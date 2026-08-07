import { useState } from 'react';
import { Bot, Terminal, Copy, Check, ExternalLink } from 'lucide-react';

// Tools exposed by the Linacre Tool Box MCP server (see mcp/ in this repo).
const MCP_TOOLS = [
  'json_format',
  'base64',
  'jwt_decode',
  'regex_test',
  'hash',
  'uuid_generate',
  'password_generate',
  'uk_vat',
  'url_clean',
  'timestamp_convert',
  'text_tools',
];

function CopyButton({ text, label = 'command' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch (e) {
          console.error('Clipboard write failed', e);
        }
      }}
      className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-cyan hover:bg-muted/60 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan/40"
      title={`Copy ${label}`}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-color" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

interface McpToolboxCalloutProps {
  /** Short context sentence tailored to the surrounding page. */
  blurb?: string;
  className?: string;
}

/**
 * Compact, self-contained panel that surfaces the Linacre Tool Box MCP server.
 * Reused across AI-focused pages (Lab, Agents, Playground). No external state.
 */
export default function McpToolboxCallout({ blurb, className = '' }: McpToolboxCalloutProps) {
  return (
    <section
      className={`rounded-2xl border border-cyan/20 bg-gradient-to-b from-cyan/[0.06] to-transparent p-5 sm:p-6 ${className}`}
      style={{ boxShadow: 'var(--linacre-card-shadow)' }}
      aria-labelledby="mcp-callout-heading"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-cyan/10 border border-cyan/30">
          <Bot className="w-4 h-4 text-cyan" />
        </div>
        <div>
          <h2
            id="mcp-callout-heading"
            className="font-mono text-sm sm:text-base font-semibold text-foreground flex items-center gap-2 flex-wrap"
          >
            Call these tools from your AI
            <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded text-cyan bg-cyan/10 border border-cyan/20">
              MCP
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 max-w-2xl">
            {blurb ||
              'The Linacre Tool Box ships as a Model Context Protocol server — the same private, offline utilities, callable by Claude, Cursor or any MCP client. Nothing you pass in ever leaves your machine.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5" aria-label="Tools available over MCP">
        {MCP_TOOLS.map(t => (
          <span
            key={t}
            className="font-mono text-[10px] px-2 py-1 rounded-md bg-muted/40 dark:bg-[#0B1220]/60 border border-amber-color/12 text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-amber-color/12 bg-muted/20 dark:bg-[#0B1220]/60 p-3.5">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold text-foreground">
            <Terminal className="w-3.5 h-3.5 text-amber-color" /> 1 · Build once
          </div>
          <div className="flex items-center gap-2 bg-[#061923] border border-border-color/60 rounded-lg px-3 py-2">
            <code tabIndex={0} className="font-mono text-[11px] text-cyan overflow-x-auto whitespace-nowrap flex-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">
              cd mcp &amp;&amp; npm install &amp;&amp; npm run build
            </code>
            <CopyButton text="cd mcp && npm install && npm run build" />
          </div>
        </div>
        <div className="rounded-xl border border-amber-color/12 bg-muted/20 dark:bg-[#0B1220]/60 p-3.5">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold text-foreground">
            <Terminal className="w-3.5 h-3.5 text-emerald-color" /> 2 · Add to Claude
          </div>
          <div className="flex items-center gap-2 bg-[#061923] border border-border-color/60 rounded-lg px-3 py-2">
            <code tabIndex={0} className="font-mono text-[11px] text-emerald-color overflow-x-auto whitespace-nowrap flex-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-color">
              claude mcp add linacre-toolbox -- node ./mcp/dist/server.js
            </code>
            <CopyButton text="claude mcp add linacre-toolbox -- node ./mcp/dist/server.js" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 font-mono text-[11px]">
        <a
          href="/tools"
          className="text-muted-foreground hover:text-cyan transition-colors inline-flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" /> toolkit
        </a>
        <a
          href="/.well-known/mcp.json"
          target="_blank"
          rel="noopener"
          className="text-muted-foreground hover:text-cyan transition-colors inline-flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" /> manifest
        </a>
        <a
          href="https://github.com/DLinacre/linacre.site"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-cyan transition-colors inline-flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" /> source · mcp/
        </a>
      </div>
    </section>
  );
}
