import { content } from '../src/content';
import selection from '../src/content/dashboard-selection.json';
import toolSelection from '../src/content/tool-selection.json';
import { validateContent } from '../src/content/validation/validate-content';
import { filesystemOptions } from '../src/content/validation/filesystem';
const issues = validateContent(content, {
  ...filesystemOptions(process.cwd()),
  referenceIds: [...selection, ...toolSelection.map(ref => ref.contentId)],
});
for (const issue of issues) {
  const message = `${issue.level}: ${issue.path}: ${issue.message}`;
  if (issue.level === 'error') console.error(message);
  else console.warn(message);
}
const errors = issues.filter(issue => issue.level === 'error');
process.stdout.write(
  `Content validation: ${content.length} records, ${errors.length} errors, ${issues.length - errors.length} warnings.\n`,
);
if (errors.length) process.exitCode = 1;
