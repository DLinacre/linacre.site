import { useState, type KeyboardEvent } from 'react';
import { games, contentStatusLabel } from '../content';

const game = games.find(record => record.id === 'slime-factory-tycoon')!;
const tabs = ['features', 'systems', 'changelog', 'roadmap'] as const;
type Tab = (typeof tabs)[number];

/** Canonical content only: a Studio template is not advertised as a published game. */
export default function GameShowcase() {
  const [tab, setTab] = useState<Tab>('features');
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    setTab(tabs[next]);
    document.getElementById(`game-tab-${tabs[next]}`)?.focus();
  };
  return (
    <article className="overflow-hidden rounded-2xl border border-amber-color/20 bg-muted/20">
      {game.artwork && (
        <img
          src={game.artwork}
          alt={`${game.name} cover artwork`}
          width={1600}
          height={800}
          className="aspect-[2/1] w-full object-cover"
        />
      )}
      <div className="space-y-6 p-6">
        <header>
          <h3 className="font-display text-2xl font-bold">{game.name}</h3>
          <p>{contentStatusLabel(game)}</p>
          <p className="text-sm text-muted-foreground">{game.statusNote}</p>
        </header>
        <p>{game.fullDescription ?? game.shortDescription}</p>
        <p>{game.platforms?.join(' · ')}</p>
        <section aria-label="Screenshots">
          <h4>Screenshots</h4>
          {game.screenshots?.length ? (
            game.screenshots.map(shot => (
              <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" />
            ))
          ) : (
            <p>No screenshots available</p>
          )}
        </section>
        <div role="tablist" aria-label="Project details" className="flex flex-wrap gap-3">
          {tabs.map((name, index) => (
            <button
              key={name}
              type="button"
              id={`game-tab-${name}`}
              role="tab"
              aria-selected={tab === name}
              aria-controls={`game-panel-${name}`}
              tabIndex={tab === name ? 0 : -1}
              onClick={() => setTab(name)}
              onKeyDown={event => onKeyDown(event, index)}
              className="min-h-11 rounded border px-3 capitalize"
            >
              {name}
            </button>
          ))}
        </div>
        <div
          id={`game-panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`game-tab-${tab}`}
          tabIndex={0}
        >
          {tab === 'features' && (
            <ul>
              {game.features?.map(feature => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          )}
          {tab === 'systems' && (
            <ul>
              {game.development?.systems?.map(system => (
                <li key={system}>{system}</li>
              ))}
            </ul>
          )}
          {tab === 'changelog' &&
            game.development?.changelog?.map(entry => (
              <details key={entry.version}>
                <summary>
                  {entry.version} — {entry.title} ({entry.date})
                </summary>
                <ul>
                  {entry.changes.map(change => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </details>
            ))}
          {tab === 'roadmap' && (
            <ul>
              {game.development?.roadmap?.map(item => (
                <li key={item.item}>
                  {item.item} — {item.status}
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="flex flex-wrap gap-4 border-t pt-4">
          {game.sourceRepository && (
            <a href={game.sourceRepository} target="_blank" rel="noopener noreferrer">
              Source
            </a>
          )}
          {game.downloadUrl && (
            <a href={game.downloadUrl} target="_blank" rel="noopener noreferrer">
              Download Roblox Studio template
            </a>
          )}
          {game.playUrl ? (
            <a href={game.playUrl}>Play</a>
          ) : (
            <span aria-disabled="true" title="This game has not been published to Roblox yet">
              Not yet published
            </span>
          )}
        </footer>
      </div>
    </article>
  );
}
