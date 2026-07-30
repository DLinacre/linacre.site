import { execSync } from 'child_process';

function log(msg: string) {
  console.log(`[🧹 Janitor Agent] ${msg}`);
}

function runCmd(cmd: string) {
  try {
    const out = execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' });
    if (out.trim()) log(out.trim());
  } catch (err: any) {
    log(`Warning: ${err.message}`);
  }
}

log("Starting Repository Cleanup...");
// Prune dead remote tracking branches
runCmd('git remote prune origin');

// Delete local branches that have been merged into main
// We skip errors if there are no branches to delete
try {
  const merged = execSync('git branch --merged main', { encoding: 'utf-8' }).split('\n').map(s => s.trim()).filter(s => s && s !== '* main' && s !== 'main');
  for (const branch of merged) {
    log(`Deleting merged branch: ${branch}`);
    runCmd(`git branch -d ${branch}`);
  }
} catch (e) {}

log("Deduplicating NPM dependencies...");
runCmd('npm dedupe');

log("Cleanup complete!");
