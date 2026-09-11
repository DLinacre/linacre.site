import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { TextDecoder, TextEncoder } from 'node:util';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const html = readFileSync(resolve(process.cwd(), 'public/tools/opagent.html'), 'utf8');
const toolSource = html.slice(html.indexOf('const ToolRunner = {'), html.indexOf('window.ToolRunner = ToolRunner;'));
const streamSource = html.slice(html.indexOf('async _stream(model, messages) {'), html.indexOf('          stop() {', html.indexOf('async _stream(model, messages) {')));

function tools() {
  return runInNewContext(toolSource + '\nToolRunner;', {
    document,
    $: (selector: string) => document.querySelector(selector),
    Modal: { open: vi.fn() },
    btoa: (text: string) => window.btoa(text),
    atob: (text: string) => window.atob(text),
  }) as { open: (title: string, id: string) => void; b64: (mode: string) => void; formatJSON: (mode: string) => void };
}

async function streamed(chunks: string[]) {
  const encoder = new TextEncoder();
  const reader = {
    read: vi.fn(async () => chunks.length ? { done: false, value: encoder.encode(chunks.shift()!) } : { done: true }),
    cancel: vi.fn(async () => {}),
    releaseLock: vi.fn(),
  };
  const api = runInNewContext('({' + streamSource + '})', {
    AbortController, TextDecoder,
    CONFIG: { api: { pollinations: { chat: 'https://example.test/chat' } } },
    fetch: vi.fn(async () => ({ ok: true, headers: { get: () => 'text/event-stream' }, body: { getReader: () => reader } })),
  }) as { _stream: (model: string, messages: unknown[]) => Promise<AsyncIterable<{ text: string }>> };
  let text = '';
  for await (const chunk of await api._stream('test', [])) text += chunk.text;
  expect(reader.releaseLock).toHaveBeenCalled();
  return text;
}

const event = (text: string) => `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;

describe('single-file OP Agent tools', () => {
  beforeEach(() => {
    document.body.innerHTML = '<h2 id="tool-title"></h2><div id="tool-body"></div><div id="tool-footer"></div>';
  });
  it.each(['b64', 'urlenc', 'hash', 'uuid', 'calc', 'lorem', 'regex', 'qr', 'diff', 'jwt', 'cron', 'tts', 'stt', 'chart', 'minify', 'encrypt', 'time', 'json-fmt'])(
    'opens %s without executing its action before inputs exist', id => {
      tools().open(id, id);
      expect(document.querySelector('#tool-output')).not.toBeNull();
      expect(document.querySelector('#tool-footer button')).not.toBeNull();
    },
  );
  it('round-trips Unicode Base64 after opening the tool', () => {
    const runner = tools();
    runner.open('Base64', 'b64');
    const input = document.querySelector<HTMLTextAreaElement>('#tool-input')!;
    input.value = 'Hello 🌍';
    runner.b64('encode');
    input.value = document.querySelector('#tool-output')!.textContent!;
    runner.b64('decode');
    expect(document.querySelector('#tool-output')!.textContent).toBe('Hello 🌍');
  });
  it('preserves the receiver for non-colliding setup methods', () => {
    const runner = tools();
    runner.open('JSON', 'json-fmt');
    document.querySelector<HTMLTextAreaElement>('#tool-input')!.value = '{"ok":true}';
    runner.formatJSON('minify');
    expect(document.querySelector('#tool-output')!.textContent).toBe('{"ok":true}');
  });
});

describe('OP Agent streamed responses', () => {
  it('keeps all events in one network chunk', async () => {
    expect(await streamed([event('Hello ') + event('world') + 'data: [DONE]\n\n'])).toBe('Hello world');
  });
  it('accepts events split across network chunks and a final unterminated event', async () => {
    const payload = event('one') + event('two').trimEnd();
    expect(await streamed([payload.slice(0, 8), payload.slice(8, 40), payload.slice(40)])).toBe('onetwo');
  });
  it('handles CRLF and reports empty responses', async () => {
    expect(await streamed([event('ok').replace(/\n/g, '\r\n')])).toBe('ok');
    await expect(streamed(['data: [DONE]\n\n'])).rejects.toThrow('without a message');
  });
});
