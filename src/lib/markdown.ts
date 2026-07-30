/**
 * Minimal, dependency-free markdown → HTML for blog bodies.
 *
 * Single source of truth shared by:
 *  - the React blog modal (src/components/Blog.tsx), and
 *  - the build-time prerenderer (scripts/prerender.mjs via
 *    scripts/prerender-data.entry.ts),
 * so JS and no-JS visitors see identical rendering (audit TASK-001, 12 Jul 2026).
 *
 * Supports: #–#### headings (h1 demoted to h2), paragraphs, unordered lists,
 * fenced code blocks with language class, `inline code`, **bold**, and
 * absolute http(s) links. All text is HTML-escaped before inline formatting,
 * so untrusted characters in the markdown cannot inject markup.
 */
const esc = (s = ''): string =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let inCode = false;
  let codeLang = '';
  let codeBuf: string[] = [];
  let para: string[] = [];
  let list: string[] = [];

  const inline = (s: string): string =>
    esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(' '))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      out.push(`<ul>${list.map(li => `<li>${inline(li)}</li>`).join('')}</ul>`);
      list = [];
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (!inCode) {
        flushPara();
        flushList();
        inCode = true;
        codeLang = line.trim().slice(3).trim();
        codeBuf = [];
      } else {
        out.push(
          `<pre><code${codeLang ? ` class="language-${esc(codeLang)}"` : ''}>${esc(codeBuf.join('\n'))}</code></pre>`,
        );
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushPara();
      flushList();
      const lvl = h[1].length === 1 ? 2 : h[1].length;
      out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`);
      continue;
    }
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) {
      flushPara();
      list.push(li[1]);
      continue;
    }
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return out.join('\n');
}
