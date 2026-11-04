import DOMPurify from 'dompurify';

/** Sanitize untrusted SVG before inserting into an HTML sink or exporting it. */
export function sanitizeSvg(svg: string): string {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['style', 'foreignObject'],
    FORBID_ATTR: ['style'],
  });
}

/** Rich chat output is HTML, not SVG or MathML. */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
