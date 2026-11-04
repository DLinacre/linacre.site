export default function StudioHeader() {
  return (
    <header className="studio-header">
      <a className="studio-wordmark" href="/"><span className="studio-mark" aria-hidden="true">L<span>.</span></span><span>LIN4CRE<small>INDEPENDENT SOFTWARE</small></span></a>
      <nav className="studio-nav" aria-label="Primary navigation">
        <a href="/">Home</a><a href="/#work">Selected work</a><a href="/games">Games</a><a href="/about">About</a><a href="/contact">Contact <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}
