import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import type { Server } from 'node:http';

let server: Server;
let base: string;
const request = globalThis.fetch;
const password = 'integration-test-password';
const secret = 'integration-test-session-secret-long-enough';

beforeAll(async () => {
  process.env.NODE_ENV = 'production';
  process.env.VERCEL = '1';
  process.env.DASHBOARD_SESSION_SECRET = secret;
  process.env.DASHBOARD_PASSWORD_HASH = createHash('sha256').update(password).digest('hex');
  delete process.env.RESEND_API_KEY;
  const { default: app } = await import('../../api/server');
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No test server address');
  base = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  vi.unstubAllGlobals();
  await new Promise<void>((resolve, reject) =>
    server.close(err => (err ? reject(err) : resolve())),
  );
});

const post = (path: string, body: unknown, headers: Record<string, string> = {}) =>
  request(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

describe('API security and delivery', () => {
  it('does not issue a session for unverified Google sign-in or the former built-in password', async () => {
    const google = await post('/api/auth/google', {});
    expect(google.status).toBe(503);
    expect(google.headers.get('set-cookie')).toBeNull();
    expect((await post('/api/auth', { password: 'Christopher91' })).status).toBe(401);
    expect((await request(`${base}/api/tasks`, { headers: { host: 'localhost' } })).status).toBe(
      401,
    );
  });

  it('authenticates only the configured password and rejects forged cookies', async () => {
    const login = await post('/api/auth', { password });
    expect(login.status).toBe(200);
    const cookie = login.headers.get('set-cookie')!.split(';')[0];
    expect(
      (await (await request(`${base}/api/auth`, { headers: { cookie } })).json()).authenticated,
    ).toBe(true);
    expect(
      (
        await (
          await request(`${base}/api/auth`, {
            headers: { cookie: 'linacre_dash_session=9999999999999.fake' },
          })
        ).json()
      ).authenticated,
    ).toBe(false);
  });

  it('refuses to claim delivery without configuration', async () => {
    const response = await post('/api/contact', {
      email: 'test@example.com',
      message: 'A legitimate test message',
    });
    expect(response.status).toBe(503);
    expect((await response.json()).error).toMatch(/not configured/i);
  });

  it('reports success only when the mail provider accepts the request', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CONTACT_FROM_EMAIL = 'sender@example.com';
    process.env.CONTACT_TO_EMAIL = 'recipient@example.com';
    const provider = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', provider);
    const response = await post('/api/contact', {
      email: 'test@example.com',
      message: 'A legitimate test message',
    });
    expect(response.status).toBe(200);
    expect(provider).toHaveBeenCalledOnce();
    expect(JSON.parse(provider.mock.calls[0][1].body).reply_to).toBe('test@example.com');
    provider.mockResolvedValue(new Response('{}', { status: 403 }));
    expect(
      (
        await post('/api/contact', {
          email: 'test@example.com',
          message: 'Another legitimate test message',
        })
      ).status,
    ).toBe(502);
  });
});
