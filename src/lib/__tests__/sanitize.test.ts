import { describe, expect, it } from 'vitest';
import { sanitizeHtml, sanitizeSvg } from '../sanitize';

describe('untrusted markup sanitization', () => {
  it('removes script, event handlers, foreign content and CSS from SVG', () => {
    const clean = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(1)</script><style>*{color:red}</style><foreignObject><img src=x onerror=alert(1) /></foreignObject><circle cx="5" style="fill:red" /></svg>',
    );
    expect(clean).toContain('<circle');
    expect(clean).not.toMatch(/script|onload|onerror|foreignObject|style/i);
  });
  it('retains rich text but removes active HTML and SVG', () => {
    const clean = sanitizeHtml(
      '<strong>hello</strong><img src=x onerror=alert(1)><svg onload=alert(1)></svg>',
    );
    expect(clean).toContain('<strong>hello</strong>');
    expect(clean).not.toMatch(/onerror|onload|<svg/i);
  });
});
