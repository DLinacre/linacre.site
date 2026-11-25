import { useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronRight, Code2, Gamepad2, Menu, Search, X } from 'lucide-react';
import { contentStatusLabel, type StudioContent } from '../content';

export const detailHref = (record: StudioContent) =>
  `/${record.type === 'game' ? 'games' : 'projects'}/${record.slug}`;
export function ActionLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <a className={`st-button ${primary ? 'st-button-primary' : ''}`} href={href}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}
export function SiteNavigation({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="st-nav">
      <div className="st-container st-nav-inner">
        <a className="st-wordmark" href="/" aria-label="LIN4CRE home">
          LIN<span>4</span>CRE<span className="st-logo-dot">.</span>
        </a>
        <button
          className="st-menu"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="studio-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="studio-navigation"
          className={open ? 'is-open' : ''}
          aria-label="Primary"
          onKeyDown={event => {
            if (event.key === 'Escape') {
              setOpen(false);
              document.querySelector<HTMLButtonElement>('.st-menu')?.focus();
            }
          }}
        >
          {[
            ['/', 'Home'],
            ['/games', 'Games'],
            ['/projects', 'Projects'],
            ['/about', 'About'],
            ['/contact', 'Contact'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              aria-current={
                (href === '/' ? path === '/' : path.startsWith(href)) ? 'page' : undefined
              }
            >
              {label}
            </a>
          ))}
        </nav>
        <span className="st-nav-note">Independent by design</span>
      </div>
    </header>
  );
}
export function Breadcrumbs({ section, name }: { section: 'games' | 'projects'; name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="st-breadcrumb">
      <a href="/">Home</a>
      <ChevronRight size={13} aria-hidden="true" />
      <a href={`/${section}`}>{section === 'games' ? 'Games' : 'Projects'}</a>
      <ChevronRight size={13} aria-hidden="true" />
      <span aria-current="page">{name}</span>
    </nav>
  );
}
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="st-page-heading">
      <p className="st-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="st-lead">{children}</div>
    </div>
  );
}
export function StatusBadge({ record }: { record: StudioContent }) {
  return (
    <span className={`st-status ${record.status ? 'st-status-known' : ''}`}>
      <span aria-hidden="true" />
      {contentStatusLabel(record)}
    </span>
  );
}
export function Artwork({ record, eager = false }: { record: StudioContent; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`st-artwork st-artwork-${record.type}`}>
      {record.artwork && !failed ? (
        <img
          src={record.artwork}
          alt=""
          width="1280"
          height="720"
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="st-artwork-fallback">
          {record.type === 'game' ? <Gamepad2 size={36} /> : <Code2 size={36} />}
          <span>{record.name}</span>
        </div>
      )}
    </div>
  );
}
export function ArtworkCard({ record }: { record: StudioContent }) {
  return (
    <article className="st-card">
      <a href={detailHref(record)} className="st-card-link">
        <Artwork record={record} />
        <div className="st-card-body">
          <div className="st-card-meta">
            <span>{record.type === 'game' ? record.genre?.[0] || 'Game' : record.category}</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </div>
          <h3>{record.name}</h3>
          <p>{record.shortDescription}</p>
          <StatusBadge record={record} />
        </div>
      </a>
    </article>
  );
}
export function CategoryFilters({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="st-filters">
      <legend className="st-sr-only">Filter by category</legend>
      {options.map(option => (
        <button
          key={option}
          type="button"
          aria-pressed={selected === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </fieldset>
  );
}
export function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="st-search">
      <Search size={18} aria-hidden="true" />
      <span className="st-sr-only">Search the collection</span>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search the collection…"
      />
    </label>
  );
}
export function EmptyState({ reset }: { reset?: () => void }) {
  return (
    <div className="st-empty">
      <Search size={28} aria-hidden="true" />
      <h2>No matches this time.</h2>
      <p>Try another search or explore a different category.</p>
      {reset && (
        <button className="st-button" onClick={reset}>
          Clear filters
        </button>
      )}
    </div>
  );
}
export function Footer() {
  return (
    <footer className="st-footer st-container">
      <div>
        <a className="st-wordmark" href="/">
          LIN<span>4</span>CRE.
        </a>
        <p>
          Independent software. Original games.
          <br />
          Built with curiosity, made with care.
        </p>
      </div>
      <nav aria-label="Footer">
        <a href="/games">Games</a>
        <a href="/projects">Projects</a>
        <a href="/contact">
          Get in touch <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <a href="/privacy">Privacy</a>
        <a href="/accessibility">Accessibility</a>
      </nav>
      <span className="st-footer-note">An independent studio by David Linacre.</span>
    </footer>
  );
}
