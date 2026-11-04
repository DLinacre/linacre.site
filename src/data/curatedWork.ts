/** Public editorial selection. Existing project and game data remain untouched. */
export const selectedWork = [
  {
    number: '01',
    name: 'Browser Tools',
    discipline: 'Practical software · Local utilities',
    description: 'A collection of small tools for the jobs that come up every day: format JSON, convert Base64, work with dates and clean up text.',
    details: 'React · TypeScript · Browser APIs',
    image: '/editorial/tools.webp',
    imageAlt: 'The JSON formatter in the LIN4CRE browser tools',
    url: '/tools',
    action: 'Open the tools',
    source: 'https://github.com/LIN4CRE/linacre.site',
    status: 'Available on this site',
  },
  {
    number: '02',
    name: 'OSINT HUD',
    discipline: 'Research · Information design',
    description: 'A searchable directory that brings open-source research resources into one interface, with categories and saved favourites.',
    details: 'React · TypeScript · Client-side search',
    image: '/editorial/osint.webp',
    imageAlt: 'The search interface of the OSINT HUD',
    url: '/osint',
    action: 'Explore the directory',
    source: 'https://github.com/LIN4CRE/linacre-osint-hud',
    status: 'Available on this site',
  },
  {
    number: '03',
    name: 'Music Videos',
    discipline: 'Creative work · Interactive media',
    description: 'A dedicated home for the Proper Mad collection, bringing together artwork, track selection and a lyric-video player.',
    details: 'React · TypeScript · Web media',
    image: '/editorial/music.webp',
    imageAlt: 'The Proper Mad music video collection interface',
    url: '/music-videos',
    action: 'Explore the collection',
    source: 'https://github.com/LIN4CRE/linacre-music-videos',
    status: 'Collection available; playback uses an external player',
  },
] as const;

export const selectedGames = [
  { name: 'Circuit', genre: 'A puzzle about connection', description: 'Rotate the wires and bring the whole grid to life.', url: '/games/circuit', image: '/editorial/circuit.webp' },
  { name: 'Decrypt', genre: 'A game of deduction', description: 'Crack a hidden code in a limited number of guesses.', url: '/games/decrypt', image: '/editorial/decrypt.webp' },
  { name: 'Gridlock', genre: 'A game of territory', description: 'Claim the board one edge at a time, against a friend or the computer.', url: '/games/gridlock', image: '/editorial/gridlock.webp' },
] as const;
