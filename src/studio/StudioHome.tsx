import { ArrowRight, Code2, Gamepad2, Monitor, Wrench, FlaskConical } from 'lucide-react';
import { games } from '../content';
import { ActionLink } from './components';
import { GameCard } from './GamesExperience';
import { canPlay } from './gameLibrary';
import { portfolioProjects, ProjectCard } from './ProjectsExperience';
export default function StudioHome() {
  const featuredGames = ['afterglow', 'circuit']
    .map(id => games.find(g => g.id === id)!)
    .filter(canPlay);
  const featuredProjects = ['cubelab', 'dual-audio-synchronizer']
    .map(id => portfolioProjects.find(p => p.id === id)!)
    .filter(Boolean);
  return (
    <main id="main">
      <section className="st-container hx-hero">
        <p className="st-eyebrow">
          <span className="st-tiny-dot" />
          Independent software & game studio
        </p>
        <h1>
          Independent software.
          <br />
          Original games.
          <br />
          <span>Built with purpose.</span>
        </h1>
        <div className="hx-hero-bottom">
          <p className="st-lead">
            Explore original browser games, desktop software, useful applications and experimental
            projects created by LIN4CRE. An independent studio by David Linacre.
          </p>
          <div className="st-inline-actions">
            <ActionLink href="/games" primary>
              Explore Games
            </ActionLink>
            <ActionLink href="/projects">Explore Projects</ActionLink>
          </div>
        </div>
        <div className="hx-index" aria-hidden="true">
          <span>Curiosity → Code → Creation</span>
          <span>LIN4CRE / Independent by design</span>
        </div>
      </section>
      <section className="st-container hx-games" aria-labelledby="home-games">
        <div className="st-section-heading">
          <div>
            <p className="st-eyebrow">A little more play</p>
            <h2 id="home-games">Originals worth exploring.</h2>
          </div>
          <a href="/games" className="st-text-link">
            All games <ArrowRight size={16} />
          </a>
        </div>
        <div className="st-grid gx-game-grid">
          {featuredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
      <section className="st-container hx-projects" aria-labelledby="home-projects">
        <div className="st-section-heading">
          <div>
            <p className="st-eyebrow">From the workbench</p>
            <h2 id="home-projects">Software with a story.</h2>
          </div>
          <a href="/projects" className="st-text-link">
            All projects <ArrowRight size={16} />
          </a>
        </div>
        <div className="st-grid hx-project-grid">
          {featuredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
      <section className="st-container hx-studio" aria-labelledby="studio-identity">
        <div>
          <p className="st-eyebrow">One independent studio</p>
          <h2 id="studio-identity">
            Space for useful.
            <br />
            Room for unexpected.
          </h2>
          <p>
            I’m David Linacre. LIN4CRE brings together my software, games and experiments — with
            source, availability and development notes that let the work speak for itself.
          </p>
          <ActionLink href="/about">Meet the studio</ActionLink>
        </div>
        <ul>
          {[
            [
              Gamepad2,
              'Original games',
              'Browser puzzles, arcade ideas and worlds in development.',
            ],
            [
              Monitor,
              'Desktop & web applications',
              'Practical interfaces, Windows utilities and browser applications.',
            ],
            [FlaskConical, 'AI experiments', 'Model interfaces, research tools and experiments.'],
            [
              Wrench,
              'Developer tools',
              'Utilities and workflows that make room for the next idea.',
            ],
          ].map(([Icon, title, description]) => {
            const I = Icon as typeof Code2;
            return (
              <li key={title as string}>
                <I size={21} aria-hidden="true" />
                <div>
                  <h3>{title as string}</h3>
                  <p>{description as string}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
