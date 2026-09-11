import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function log(msg: string) {
  console.log(`[🛡️ Security Agent] ${msg}`);
}

function runCmd(cmd: string) {
  try {
    const out = execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' });
    if (out.trim()) log(out.trim());
    return true;
  } catch (err: any) {
    if (err.stdout) log(err.stdout.trim());
    return false;
  }
}

log('Starting Security Audit...');

const rootDir = process.cwd();
const gitignorePath = path.join(rootDir, '.gitignore');

// 1. Audit .gitignore for .env
if (fs.existsSync(gitignorePath)) {
  const content = fs.readFileSync(gitignorePath, 'utf-8');
  if (!content.includes('.env')) {
    log('CRITICAL VULNERABILITY: .env is missing from .gitignore!');
    log('Auto-patching .gitignore...');
    fs.appendFileSync(gitignorePath, '\n.env\n');
  } else {
    log('.env is safely secured in .gitignore.');
  }
}

// 2. NPM Audit
log('Running NPM Audit...');
const auditPassed = runCmd('npm audit --audit-level=high');
if (!auditPassed) {
  log("High severity vulnerabilities found! Please review 'npm audit' manually.");
} else {
  log('No high severity vulnerabilities found.');
}

log('Security Audit Complete.');
