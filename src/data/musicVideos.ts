export interface MusicVideoTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  bpm: string;
  model: string;
  cover: string;
}

export const MUSIC_VIDEO_PLAYER_URL = 'https://lin4cre.github.io/linacre-music-videos/';
export const DEFAULT_MUSIC_VIDEO_TRACK = 'the-road-beyond';

/** Curated metadata and artwork from the official Proper Mad cinema player. */
export const MUSIC_VIDEO_TRACKS: MusicVideoTrack[] = [
  {
    id: 'the-road-beyond',
    title: 'The Road Beyond',
    artist: 'Linacre',
    duration: '3:42',
    genre: 'Acoustic Grime Rap / UK Storytelling',
    bpm: '90 BPM',
    model: 'Suno V6-MINI',
    cover: '/music-videos/covers/the-road-beyond.jpg',
  },
  {
    id: 'jessica-hold-your-head-up',
    title: 'Jessica, Hold Your Head Up',
    artist: 'Linacre',
    duration: '4:00',
    genre: 'Acoustic Pop-Folk / Contemporary',
    bpm: '88 BPM',
    model: 'Suno V6-MINI',
    cover: '/music-videos/covers/jessica-hold-your-head-up.jpg',
  },
  {
    id: 'barnsley-town',
    title: 'Barnsley Town',
    artist: 'Linacre',
    duration: '3:01',
    genre: 'UK Comedy Pop-Rap / Garage',
    bpm: '132 BPM',
    model: 'Suno V6-MINI',
    cover: '/music-videos/covers/barnsley-town.jpg',
  },
  {
    id: 'skint-dave',
    title: 'Skint Dave from Barnsley',
    artist: 'Linacre',
    duration: '3:41',
    genre: 'British Indie Rock / Pub-Singalong',
    bpm: '96 BPM',
    model: 'Suno V6-MINI',
    cover: '/music-videos/covers/skint-dave.jpg',
  },
  {
    id: 'penny',
    title: "Penny, You're Still Here",
    artist: 'Linacre',
    duration: '3:58',
    genre: 'Contemporary Folk-Pop / Heartfelt',
    bpm: '112 BPM',
    model: 'Suno V6-MINI',
    cover: '/music-videos/covers/penny.jpg',
  },
  {
    id: 'dave-barnsley',
    title: 'Dave from Barnsley',
    artist: 'Linacre',
    duration: '3:20',
    genre: 'UK Boom-Bap / Comedy Rap',
    bpm: '94 BPM',
    model: 'Suno V6-MINI',
    cover: '/music-videos/covers/dave-barnsley.jpg',
  },
  {
    id: 'crazy-rap',
    title: 'Crazy Rap',
    artist: 'Linacre',
    duration: '2:04',
    genre: 'UK Comedy Rap / Garage Hip-Hop',
    bpm: '130 BPM',
    model: 'Suno V6-MINI',
    cover: '/music-videos/covers/crazy-rap.jpg',
  },
  {
    id: 'statistically',
    title: "Statistically, We're Fine",
    artist: 'Linacre',
    duration: '2:22',
    genre: 'UK Alternative Comedy Hip-Hop',
    bpm: '94 BPM',
    model: 'Suno V6-MINI',
    cover: '/music-videos/covers/statistically.jpg',
  },
  {
    id: 'your-voice-beside-my-hand',
    title: 'Your Voice Beside My Hand',
    artist: 'Linacre',
    duration: '3:07',
    genre: 'Acoustic Pop-Folk / Contemporary',
    bpm: '86 BPM',
    model: 'Suno V6-MINI',
    cover: '/music-videos/covers/your-voice-beside-my-hand.jpg',
  },
  {
    id: 'nic-on-donny-road',
    title: 'Nic on Donny Road',
    artist: 'Linacre',
    duration: '2:53',
    genre: 'UK Comedy Rap / Northern Boom-Bap',
    bpm: '98 BPM',
    model: 'Suno V6-MINI',
    cover: '/music-videos/covers/nic-on-donny-road.jpg',
  },
];
