import * as RNFS from '@dr.pogodin/react-native-fs';

export const FLAGS = {
  GLOBAL: 'https://utfs.io/f/ImOWJajUmXfyRKHTpylsELpB6QlYA4OdG9Jfr3hagoCN5Mzt',
  INDIA: 'https://utfs.io/f/ImOWJajUmXfyYCEwdELCDZIMxNG5H27Bouwvb4fyVJrdqj3X',
  ENGLISH: 'https://utfs.io/f/ImOWJajUmXfyN1E0dlnILrEMR3DJQX7OUvixCSHp6YWGNVPc',
  ITALY: 'https://utfs.io/f/ImOWJajUmXfynpGlTaXrTMAELcs2W76PyY4IRJVBXCHOofa5',
};

export const downloadFolder = RNFS.DownloadDirectoryPath + '/unrealstreams';

// UnrealStreams brand colors
export const BRAND = {
  primary: '#00D4FF',       // Electric cyan - the main accent
  secondary: '#7B2FFF',     // Deep violet
  accent: '#FF3D71',        // Hot coral for highlights
  dark: '#050811',          // Near-black background
  surface: '#0D1117',       // Card/surface background
  elevated: '#161B27',      // Elevated surface
  border: '#1E2738',        // Subtle borders
  text: '#E8EDF5',          // Primary text
  textMuted: '#6B7A99',     // Muted text
};

export const themes: {name: string; color: string}[] = [
  {
    name: 'UnrealStreams',
    color: '#00D4FF',
  },
  {
    name: 'Nebula',
    color: '#7B2FFF',
  },
  {
    name: 'Crimson',
    color: '#FF3D71',
  },
  {
    name: 'Aurora',
    color: '#00E5CC',
  },
  {
    name: 'Solar',
    color: '#FF9500',
  },
  {
    name: 'Matrix',
    color: '#00FF7F',
  },
  {
    name: 'Flix',
    color: '#E50914',
  },
  {
    name: 'Cobalt',
    color: '#2979FF',
  },
  {
    name: 'Custom',
    color: '#FFFFFF',
  },
];

export const socialLinks = {
  github: 'https://github.com/unrealstreams/app',
  discord: 'https://discord.gg/unrealstreams',
  sponsor: 'https://unrealstreams.app/support',
};

export const APP_NAME = 'UnrealStreams';
export const APP_TAGLINE = 'Stream Beyond Limits';
