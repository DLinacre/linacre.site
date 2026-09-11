import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPORT_PATH = path.resolve(PROJECT_ROOT, 'public', 'agent-report.json');

// We use the local proxy to keep API keys secure and centralized in .env
const API_URL = 'http://localhost:3000/api/chat';

interface AgentReport {
  lastRun: string;
  status: 'clean' | 'fixing' | 'reverted' | 'error';
  gitStatus: string;
  compilerStatus: string;
  actionsTaken: string[];
}

function log(msg: string) {
  console.log(`[🤖 Agent] ${msg}`);
}

function runCmd(cmd: string): { ok: boolean; out: string } {
  try {
    const out = execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' });
    return { ok: true, out: out.trim() };
  } catch (err: any) {
    return { ok: false, out: (err.stdout + '\n' + err.stderr).trim() };
  }
}

async function askAI(prompt: string): Promise<string> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history: [] }),
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    return data.reply;
  } catch (e) {
    log('Failed to reach AI proxy.');
    return '';
  }
}

function writeReport(report: AgentReport) {
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');
}

async function main() {
  log('Waking up...');

  const report: AgentReport = {
    lastRun: new Date().toISOString(),
    status: 'clean',
    gitStatus: 'clean',
    compilerStatus: 'pass',
    actionsTaken: [],
  };

  // 1. Check Git
  const gitRes = runCmd('git status --porcelain');
  if (gitRes.out.length > 0) {
    report.gitStatus = 'dirty';
    report.actionsTaken.push('Detected uncommitted changes.');
  }

  // 2. Check TypeScript Compiler
  log('Running compiler checks...');
  const tscRes = runCmd('npx tsc --noEmit');

  if (!tscRes.ok) {
    log('Compiler errors detected. Attempting AI repair...');
    report.compilerStatus = 'failed';
    report.status = 'fixing';

    // AI Auto-fix attempt
    const aiPrompt = `I got the following TypeScript errors running 'tsc --noEmit':\n\n${tscRes.out}\n\nWhat file is the error in and how should I fix it? Provide only a very brief summary of what went wrong.`;
    const aiFix = await askAI(aiPrompt);

    report.actionsTaken.push(`AI Analysis: ${aiFix.slice(0, 100)}...`);

    // 3. Quality Gate (Revert)
    // If the system is broken, we enforce the "clean and professional" rule
    log('Compiler failed. Reverting dirty state to enforce strict quality gate.');
    runCmd('git restore .');
    report.actionsTaken.push(
      'Quality Gate failed: ran git restore . to delete unverified changes.',
    );
    report.status = 'reverted';
  } else {
    report.actionsTaken.push('Compiler check passed.');
  }

  // 4. Check dependencies (Upgrades)
  log('Checking for dependency upgrades...');
  const outdatedRes = runCmd('npm outdated --json');
  if (!outdatedRes.ok && outdatedRes.out) {
    try {
      const updates = JSON.parse(outdatedRes.out);
      const packages = Object.keys(updates);
      if (packages.length > 0) {
        report.actionsTaken.push(
          `Found ${packages.length} packages to upgrade. Ignoring auto-upgrade to prevent breaking changes without human review.`,
        );
      }
    } catch (e) {}
  }

  // 5. Trigger Daily Automations
  log('Triggering Daily Agent Automations...');
  const tsxBin = process.platform === 'win32' ? 'tsx.cmd' : 'tsx';
  const agentsToRun = ['janitor', 'security', 'seo', 'doc', 'release'];
  for (const agent of agentsToRun) {
    log(`Executing: ${agent}`);
    const scriptPath = path.join(PROJECT_ROOT, 'scripts', 'agents', `${agent}.ts`);
    const res = runCmd(`${tsxBin} "${scriptPath}"`);
    if (!res.ok) {
      log(`Failed to run ${agent} automation: ${res.out}`);
    } else {
      report.actionsTaken.push(`Ran ${agent} automation successfully.`);
    }
  }

  // Save report
  writeReport(report);
  log('Task complete. Report saved.');
}

main();
setInterval(main, 24 * 60 * 60 * 1000); // Run daily
