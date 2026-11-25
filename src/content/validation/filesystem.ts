/** Node-only structural validation. Does not claim a route or external application works. */
import fs from 'node:fs';
import path from 'node:path';
import type { ValidationOptions } from './validate-content';
export function filesystemOptions(root: string): ValidationOptions {
  const publicRoot = path.resolve(root, 'public');
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8')) as {
    rewrites: { source: string; destination: string }[];
    redirects: { source: string; destination: string }[];
  };
  const metadata = JSON.parse(fs.readFileSync(path.join(root, 'route-meta.json'), 'utf8'));
  const routes = new Set(Object.keys(metadata.routes));
  const literalRewrites = config.rewrites.filter(rule => !/[()*:]/.test(rule.source));
  const isFile = (url: string) => {
    const resolved = path.resolve(publicRoot, '.' + url);
    return (
      resolved.startsWith(publicRoot + path.sep) &&
      fs.existsSync(resolved) &&
      fs.statSync(resolved).isFile()
    );
  };
  return {
    assetExists: isFile,
    routeExists: url => {
      if (url === '/' || routes.has(url)) return true;
      const rewrite = literalRewrites.find(rule => rule.source === url);
      if (rewrite && (isFile(rewrite.destination) || routes.has(url))) return true;
      return isFile(url) || isFile(url.replace(/\/$/, '') + '/index.html');
    },
  };
}
