export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drive',
    artist: 'AI Synth Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'Cybernetic Pulse',
    artist: 'Digital Voyager',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400',
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Retro Wave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/grid/400/400',
  },
];
