import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Server } from 'node:http';
let server: Server;
let base: string;
const previous = {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
  DASHBOARD_SESSION_SECRET: process.env.DASHBOARD_SESSION_SECRET,
  DASHBOARD_PASSWORD_HASH: process.env.DASHBOARD_PASSWORD_HASH,
};
beforeAll(async () => {
  process.env.NODE_ENV = 'production';
  process.env.VERCEL = '1';
  delete process.env.DASHBOARD_SESSION_SECRET;
  delete process.env.DASHBOARD_PASSWORD_HASH;
  const { default: app } = await import('../../../api/server');
  await new Promise<void>(resolve => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw Error('test server unavailable');
  base = `http://127.0.0.1:${address.port}`;
});
afterAll(async () => {
  await new Promise<void>(resolve => server?.close(() => resolve()));
  for (const [key, value] of Object.entries(previous)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});
describe('production API release boundaries', () => {
  it('fails closed when authentication is not configured', async () => {
    const response = await fetch(base + '/api/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: 'temporary-test-input' }),
    });
    expect(response.status).toBe(503);
    expect(response.headers.get('set-cookie')).toBeNull();
  });
  it('does not mint cookies from a Google identity assertion', async () => {
    const response = await fetch(base + '/api/auth/google', { method: 'POST' });
    expect(response.status).toBe(501);
    expect(response.headers.get('set-cookie')).toBeNull();
  });
  it('does not bypass protected access for a localhost request', async () => {
    const response = await fetch(base + '/api/tasks');
    expect(response.status).toBe(401);
    const auth = await fetch(base + '/api/auth');
    expect(await auth.json()).toEqual({ authenticated: false });
  });
});
