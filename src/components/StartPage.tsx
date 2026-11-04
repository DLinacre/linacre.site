import { selectedGames, selectedWork } from '../data/curatedWork';

export default function StartPage() {
  const [feature, ...rest] = selectedWork;
  return (
    <div className="editorial-home">
      <section className="studio-intro" aria-labelledby="home-heading">
        <div className="studio-intro__side"><span>INDEPENDENT DIGITAL STUDIO</span><span>BARNSLEY, SOUTH YORKSHIRE</span></div>
        <div className="studio-intro__main">
          <p className="studio-kicker"><span className="studio-dot" /> Software with a point of view</p>
          <h1 id="home-heading">Made with<br />{' '}<em>purpose.</em></h1>
          <div className="studio-intro__bottom"><p>Independent software, useful tools and playful experiments. Designed and built by David Linacre in South Yorkshire.</p><a className="text-link" href="#work">Explore selected work <span aria-hidden="true">↘</span></a></div>
        </div>
        <div className="studio-signature" aria-hidden="true"><span>L</span><i>4</i><small>DESIGN / BUILD</small></div>
      </section>
      <section id="work" className="work-section" aria-labelledby="work-heading">
        <div className="section-heading"><div><p className="studio-kicker">A considered selection</p><h2 id="work-heading">Selected work<span>.</span></h2></div><p>Different ideas, one approach:<br />make something worth using.</p></div>
        <article className="work-feature">
          <a className="work-image work-image--feature" href={feature.url}><img src={feature.image} alt={feature.imageAlt} width="1200" height="691" /></a>
          <div className="work-feature__copy"><p className="work-number">{feature.number} / {feature.discipline}</p><h3>{feature.name}</h3><p>{feature.description}</p><p className="work-details">{feature.details}</p><p className="work-status">{feature.status}</p><div className="work-links"><a className="text-link" href={feature.url}>{feature.action} <span aria-hidden="true">↗</span></a><a href={feature.source}>View source ↗</a></div></div>
        </article>
        <div className="work-pair">{rest.map(work => <article className="work-item" key={work.name}><a className="work-image" href={work.url}><img src={work.image} alt={work.imageAlt} width="1200" height="691" loading="lazy" /></a><p className="work-number">{work.number} / {work.discipline}</p><h3>{work.name}</h3><p>{work.description}</p><p className="work-details">{work.details}</p><p className="work-status">{work.status}</p><div className="work-links"><a className="text-link" href={work.url}>{work.action} <span aria-hidden="true">↗</span></a><a href={work.source}>View source ↗</a></div></article>)}</div>
      </section>
      <section className="games-preview" aria-labelledby="games-heading"><div className="games-preview__intro"><p className="studio-kicker">A little room to play</p><h2 id="games-heading">Small games.<br /><em>Good ideas.</em></h2><p>Three browser games built for a quiet moment. No account, just play.</p><a className="text-link" href="/games">Meet the games <span aria-hidden="true">↗</span></a></div><div className="games-preview__list">{selectedGames.map((game, index) => <a href={game.url} className="game-row" key={game.name}><span>0{index + 1}</span><div><strong>{game.name}</strong><small>{game.genre}</small></div><span aria-hidden="true">↗</span></a>)}</div></section>
      <section className="studio-about" aria-labelledby="about-heading"><p className="studio-kicker">Behind the work</p><h2 id="about-heading">Independent by design.<br /><em>Human by nature.</em></h2><div><p>I’m David, a self-taught developer in Barnsley. I enjoy making practical software, exploring new ideas and paying attention to the details that make them feel right.</p><a className="text-link" href="/about">A little more about me <span aria-hidden="true">↗</span></a></div></section>
      <section className="studio-contact" aria-labelledby="contact-heading"><p className="studio-kicker">Have an idea?</p><h2 id="contact-heading">Let’s make<br /><em>something useful.</em></h2><a className="contact-arrow" href="/contact" aria-label="Get in touch">↗</a></section>
    </div>
  );
}
