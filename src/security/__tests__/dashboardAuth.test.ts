import { describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import { dashboardAuthConfigured, dashboardPasswordMatches } from '../../../api/dashboard-auth';
describe('fail-closed dashboard credentials', () => {
  const password = 'Only a temporary unit-test fixture';
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  it('requires a configured signing secret and a correctly shaped password hash', () => {
    expect(dashboardAuthConfigured(undefined, hash)).toBe(false);
    expect(dashboardAuthConfigured('short', hash)).toBe(false);
    expect(dashboardAuthConfigured('x'.repeat(32), 'invalid')).toBe(false);
    expect(dashboardAuthConfigured('x'.repeat(32), hash)).toBe(true);
  });
  it('accepts only the exact password, never case-folded/trimmed alternatives', () => {
    expect(dashboardPasswordMatches(password, hash)).toBe(true);
    expect(dashboardPasswordMatches(password.toLowerCase(), hash)).toBe(false);
    expect(dashboardPasswordMatches(' ' + password, hash)).toBe(false);
    expect(dashboardPasswordMatches({}, hash)).toBe(false);
  });
});
