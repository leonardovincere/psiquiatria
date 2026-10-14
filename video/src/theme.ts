// Paleta e fontes do site (src/clinics/animus.ts) e marca Vincere.AI.
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const colors = {
  primary: '#254B74',
  secondary: '#D8C7AA',
  accent: '#F9B33B',
  background: '#FBF8F3',
  text: '#1C2B3D',
  muted: '#4A5566',
  vincereBlue: '#2F5BFF',
  vincereSteel: '#3E4652',
};

export const fonts = {
  heading: 'Newsreader, Georgia, serif',
  body: 'Figtree, system-ui, sans-serif',
};

// Mesmos arquivos auto-hospedados do site (fontes variáveis, já recortadas).
export const fontsLoaded = Promise.all([
  loadFont({ family: 'Newsreader', url: staticFile('fonts/heading-normal.woff2'), weight: '400 500', style: 'normal' }),
  loadFont({ family: 'Newsreader', url: staticFile('fonts/heading-italic.woff2'), weight: '400 500', style: 'italic' }),
  loadFont({ family: 'Figtree', url: staticFile('fonts/body-normal.woff2'), weight: '400 600', style: 'normal' }),
]);

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);
