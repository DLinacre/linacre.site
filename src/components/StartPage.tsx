import type { RefObject } from 'react';
import { ArrowDown, ArrowRight, Gamepad2, Orbit, Search, Wrench } from 'lucide-react';
import { SITE_PROJECTS } from '../data/siteProjects';
import ExperienceShowcase from './ExperienceShowcase';
import FeaturedSpotlight from './FeaturedSpotlight';
import HeroMonolith from './HeroMonolith';
import ProjectGrid from './ProjectGrid';

interface StartPageProps {
  navigate: (tab: string) => void;
  query: string;
  setQuery: (query: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
}

const projectCount = SITE_PROJECTS.length;
const categoryCount = new Set(SITE_PROJECTS.map(project => project.kind)).size;
const sourceCount = SITE_PROJECTS.filter(project => Boolean(project.repo)).length;

const QUICK_SEARCH_CHIPS = ['Fire TV', 'Android', 'AI', 'Games', 'Audio', 'OSINT'] as const;

export default function StartPage({ navigate, query, setQuery, searchRef }: StartPageProps) {
  return (
    <div className="start-page">
      <section className="home-hero" aria-labelledby="home-heading">
        <div className="home-hero__copy">
          <p className="home-hero__eyebrow">
            <span className="home-hero__eyebrow-mark" aria-hidden="true" />
            Independent software studio <span aria-hidden="true">/</span> South Yorkshire, UK
          </p>

          <h1 id="home-heading" className="home-hero__title">
            Independent software,
            <br />
            <span>made to be useful.</span>
          </h1>

          <p className="home-hero__intro">
            Apps, AI experiments, developer tools and games, made in South Yorkshire. Explore the
            projects, try a browser tool, or follow the source behind the work.
          </p>

          <div className="home-hero__actions">
            <a href="#project-library" className="home-hero__primary-action">
              Explore projects <ArrowDown aria-hidden="true" />
            </a>
            <button
              type="button"
              className="home-hero__secondary-action"
              onClick={() => navigate('tools')}
            >
              <Wrench aria-hidden="true" />
              Browser tools
              <ArrowRight aria-hidden="true" className="home-hero__action-arrow" />
            </button>
            <a href="/games" className="home-hero__games-action">
              <Gamepad2 aria-hidden="true" />
              Explore games
            </a>
            <button
              type="button"
              className="home-hero__secondary-action"
              onClick={() => navigate('orbit')}
            >
              <Orbit aria-hidden="true" />
              Live Orbit
            </button>
          </div>

          <div className="home-search" role="search">
            <label htmlFor="project-search">Find a project</label>
            <div className="home-search__control">
              <Search aria-hidden="true" />
              <input
                ref={searchRef}
                id="project-search"
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Try ‘Android’, ‘audio’ or ‘recipes’"
                autoComplete="off"
                aria-controls="project-library"
              />
              <kbd aria-hidden="true">/</kbd>
            </div>
            <div className="home-search__chips" aria-label="Quick search topics">
              {QUICK_SEARCH_CHIPS.map(chip => {
                const isSelected = query.toLowerCase() === chip.toLowerCase();
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setQuery(isSelected ? '' : chip)}
                    className={`home-search__chip${isSelected ? ' is-active' : ''}`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          <dl className="home-hero__stats" aria-label="Project catalogue at a glance">
            <div>
              <dt>Projects listed</dt>
              <dd>{projectCount.toString().padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>Project categories</dt>
              <dd>{categoryCount.toString().padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>Source links</dt>
              <dd>{sourceCount.toString().padStart(2, '0')}</dd>
            </div>
          </dl>
        </div>

        <div className="home-hero__visual">
          <HeroMonolith />
        </div>
      </section>

      {!query && <ExperienceShowcase navigate={navigate} />}

      {!query && <FeaturedSpotlight />}

      <ProjectGrid
        query={query}
        setQuery={setQuery}
        heading={query ? 'Search results' : 'The project library'}
      />
    </div>
  );
}
