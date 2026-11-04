import { selectedGames } from '../data/curatedWork';

export default function Games() {
  return <div className="games-page"><section className="games-page__intro"><p className="studio-kicker">LIN4CRE / PLAY</p><h1>Games for<br /><em>the in-between.</em></h1><p>A small collection of browser games. Pick one, take a moment, and see where it goes.</p></section><div className="games-page__grid">{selectedGames.map((game, i) => <article className="games-page__item" key={game.name}><a href={game.url} className="work-image"><img src={game.image} alt={`${game.name} game screen`} width="1000" height="625" loading={i ? 'lazy' : 'eager'} /></a><p className="work-number">0{i + 1} / {game.genre}</p><h2>{game.name}</h2><p>{game.description}</p><p className="work-details">Available on this site · HTML · JavaScript</p><a className="text-link" href={game.url}>Play {game.name} <span aria-hidden="true">↗</span></a></article>)}</div></div>;
}
