import clinic from './clinic.json';
import timeline from './timeline.json';
import manifest from '../public/captures/manifest.json';

export { clinic, timeline, manifest };

export const W = 1080;
export const H = 1920;
export const FPS = timeline.fps;
export const sec = (s: number) => Math.round(s * FPS);

export const C = {
  bg: clinic.theme.background,
  gold: clinic.theme.primary,
  blue: clinic.theme.secondary,
  goldLight: clinic.theme.accent,
  ivory: clinic.theme.text,
  ink: '#0b0d1c',
};

export const FONT = {
  heading: `'ClinicHeading', Georgia, serif`,
  body: `'ClinicBody', Inter, system-ui, sans-serif`,
  weight: clinic.theme.headingWeight ?? 400,
};

/** Nome curto sem o tratamento ("Dr. Luís Gustavo"). */
export const shortName = clinic.shortName;
export const query = timeline.typing.query.replace('{name}', clinic.name);

/** Tempo (s) em que o caractere i aparece — o mesmo cálculo do áudio. */
export const charTime = (i: number) => timeline.typing.start + i / timeline.typing.cps + 0.02 * Math.sin(i * 1.7);

export const clip = (name: string) => manifest.clips.find((c) => c.name === name)!;
