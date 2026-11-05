export default function About() {
  return (
    <section aria-labelledby="about-page-title">
      <header className="page-hero">
        <p className="eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />
          About · David Linacre
        </p>
        <h1 id="about-page-title" className="page-title">
          Independent software from South Yorkshire.
        </h1>
        <p className="page-lead">
          LIN4CRE is the software studio and engineering portfolio of David Linacre, a self-taught
          developer based in Barnsley, England.
        </p>
      </header>

      <div className="about-page-grid">
        <div className="prose-editorial">
          <p>
            My work focuses on practical software, interactive simulation, and compact browser games
            that respect the person using them. Whether it is a native C# WASAPI audio engine
            keeping living-room speakers phase-aligned within a millisecond, a Three.js Rubik’s Cube
            solver running Kociemba’s two-phase algorithm in a Web Worker, or an artificial-life
            observatory executing 20-opcode genomes on an HTML5 canvas, the goal is always the same:
            solve a clear problem cleanly without bloat.
          </p>
          <p>
            Whenever possible, software here runs locally on your own hardware. Documents parsed in
            SpeedRead stay in browser memory, cube solves compute in background workers, and the
            self-hosted games store streaks in local browser storage rather than requiring an
            account.
          </p>

          <h2>How projects are built</h2>
          <p>
            Each release is maintained in public Git repositories with strict TypeScript or native
            compiler checks, automated tests where algorithms demand verification, and minimal
            runtime dependencies. Prototypes that do not earn their keep are retired from the main
            catalogue so the studio showcase only reflects finished, working software.
          </p>

          <div className="hero-actions" style={{ marginTop: '2rem' }}>
            <a href="/contact" className="btn-primary">
              <span>Get in touch</span>
              <span aria-hidden="true">→</span>
            </a>
            <a href="/#work" className="btn-secondary">
              <span>View selected work</span>
            </a>
          </div>
        </div>

        <aside className="about-aside" aria-label="Studio technical summary">
          <div className="about-aside__group">
            <h2>Location</h2>
            <ul className="about-aside__list">
              <li>Barnsley, South Yorkshire, UK</li>
              <li>53.55°N, 1.48°W · GMT / BST</li>
            </ul>
          </div>

          <div className="about-aside__group">
            <h2>Core Stack &amp; Disciplines</h2>
            <ul className="about-aside__list">
              <li>TypeScript, React 19 &amp; Vite</li>
              <li>C# &amp; Windows WASAPI Audio DSP</li>
              <li>Three.js, HTML5 Canvas &amp; SVG</li>
              <li>Web Workers, Web Audio &amp; Offline PWAs</li>
              <li>Node.js, Express &amp; Automated Testing</li>
            </ul>
          </div>

          <div className="about-aside__group">
            <h2>Open Source</h2>
            <ul className="about-aside__list">
              <li>
                <a
                  href="https://github.com/LIN4CRE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/LIN4CRE ↗
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/DLinacre"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/DLinacre ↗
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
