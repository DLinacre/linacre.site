import crypto from 'node:crypto';
/** No built-in credentials or client-asserted identity providers. */
export function dashboardAuthConfigured(secret: unknown, hash: unknown): secret is string {
  return (
    typeof secret === 'string' &&
    secret.length >= 32 &&
    typeof hash === 'string' &&
    /^[a-f0-9]{64}$/i.test(hash)
  );
}
export function dashboardPasswordMatches(password: unknown, hash: string): boolean {
  if (
    typeof password !== 'string' ||
    !password ||
    password.length > 1024 ||
    !/^[a-f0-9]{64}$/i.test(hash)
  )
    return false;
  const actual = crypto.createHash('sha256').update(password).digest();
  return crypto.timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}
