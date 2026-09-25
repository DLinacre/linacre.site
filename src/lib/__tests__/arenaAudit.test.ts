import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const html = readFileSync(resolve(process.cwd(), 'public/tools/arena-audit.html'), 'utf8');

// Extract script block content from arena-audit.html
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('Could not find script block in arena-audit.html');
const scriptSource = scriptMatch[1];

function makeElement() {
  return {
    value: '',
    textContent: '',
    innerHTML: '',
    placeholder: '',
    dataset: {},
    classList: { toggle: vi.fn(), add: vi.fn(), remove: vi.fn() },
    addEventListener: vi.fn(),
    querySelectorAll: () => [],
    querySelector: () => null,
    setAttribute: vi.fn(),
    getAttribute: () => null,
  };
}

function createAuditEnv() {
  const localStorageMock: Record<string, string> = {};
  const domElements: Record<string, any> = {};

  const getEl = (sel: string) => {
    if (!domElements[sel]) domElements[sel] = makeElement();
    return domElements[sel];
  };

  getEl('#targetInput').value = 'https://example.com';
  getEl('#productName').value = 'Example';

  const windowMock: Record<string, any> = {};
  const context = {
    window: windowMock,
    document: {
      querySelector: (sel: string) => getEl(sel),
      querySelectorAll: () => [],
      getElementById: (id: string) => getEl('#' + id),
      body: { appendChild: vi.fn() },
      createElement: () => makeElement(),
      addEventListener: vi.fn(),
    },
    $: (sel: string) => getEl(sel),
    localStorage: {
      getItem: (key: string) => localStorageMock[key] || null,
      setItem: (key: string, val: string) => { localStorageMock[key] = String(val); },
      removeItem: (key: string) => { delete localStorageMock[key]; },
    },
    location: { search: '', href: 'https://example.test' },
    history: { replaceState: vi.fn() },
    showToast: vi.fn(),
    prompt: () => 'Security Forensic',
    alert: vi.fn(),
    console,
    setTimeout: (fn: () => void) => { fn(); return 1; },
    clearTimeout: vi.fn(),
    URL: { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} },
  };
  windowMock.window = windowMock;
  windowMock.document = context.document;
  windowMock.localStorage = context.localStorage;
  windowMock.prompt = context.prompt;
  windowMock.showToast = vi.fn();

  runInNewContext(scriptSource, context);
  const audit = windowMock.ArenaAudit;
  return { ...audit, localStorage: context.localStorage, prompt: windowMock.prompt };
}

describe('Arena Audit prompt builder behavioral regressions', () => {
  it('omits scoring section and category score directives when scores deliverable is disabled', () => {
    const env = createAuditEnv();
    env.state.dels.scores = false;
    const result = env.buildPrompt();
    expect(result.text).not.toContain('## Scoring');
    expect(result.text).not.toContain('Score each completed category out of 100');
    expect(result.text).toContain('Produce detailed findings for **each selected category** below.');
  });

  it('includes scoring section when scores deliverable is enabled', () => {
    const env = createAuditEnv();
    env.state.dels.scores = true;
    const result = env.buildPrompt();
    expect(result.text).toContain('## Scoring');
    expect(result.text).toContain('Score each completed category out of 100');
  });

  it('does not force action plans, tasks, or workspace packages when deliverables are empty', () => {
    const env = createAuditEnv();
    // Uncheck all deliverables
    Object.keys(env.state.dels).forEach(k => { env.state.dels[k] = false; });
    env.state.adv.workspace = false;
    const result = env.buildPrompt();
    expect(result.text).not.toContain('### Action plan structure');
    expect(result.text).not.toContain('### Task format');
    expect(result.text).not.toContain('### Workspace / package structure');
    expect(result.text).toContain('A focused written audit addressing the selected categories and constraints');
  });

  it('respects workspace file generation options when toggled', () => {
    const env = createAuditEnv();
    Object.keys(env.state.dels).forEach(k => { env.state.dels[k] = false; });
    
    // When workspace is true, files must be written to workspace
    env.state.adv.workspace = true;
    let result = env.buildPrompt();
    expect(result.text).toContain('Create these as real files in the workspace');

    // When workspace is false and zip is false, no workspace structure
    env.state.adv.workspace = false;
    env.state.dels.zip = false;
    result = env.buildPrompt();
    expect(result.text).not.toContain('### Workspace / package structure');
  });

  it('custom preset persistence correctly saves and restores full configurations', () => {
    const env = createAuditEnv();
    env.state.cats = { executive: true, security: true };
    env.state.roles = { sec: true, dev: true };
    env.state.dels = { scores: false, action: true, tasks: false };
    env.state.adv = { publicOnly: true, workspace: false };
    env.state.depth = 'forensic';
    env.state.style = 'agent';

    env.prompt = () => 'Security Forensic';
    env.saveCustomPreset();

    // Verify preset was saved in localStorage
    const saved = JSON.parse(env.localStorage.getItem('arena_audit_custom_presets_v1'));
    const presetId = Object.keys(saved)[0];
    expect(saved[presetId].name).toBe('Security Forensic');
    expect(saved[presetId].dels.scores).toBe(false);
    expect(saved[presetId].adv.workspace).toBe(false);

    // Reset state and load
    env.state.dels.scores = true;
    env.state.depth = 'focused';
    env.loadCustomPreset(presetId);

    expect(env.state.dels.scores).toBe(false);
    expect(env.state.depth).toBe('forensic');
    expect(env.state.style).toBe('agent');
  });
});
