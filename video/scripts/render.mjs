// Render final: MP4 H.264, sem áudio, abaixo de 16 MB (limite do WhatsApp).
// Renderiza em alta qualidade e depois recomprime em 2 passes para um bitrate-alvo.
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';

const MAX_MB = 15.5;
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
mkdirSync('out', { recursive: true });
const raw = path.resolve('out', 'raw.mp4');
const final = path.resolve('out', 'animus-previa.mp4');

const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'AnimusPreview', browserExecutable });
await renderMedia({
  serveUrl, composition, codec: 'h264', crf: 12, outputLocation: raw, browserExecutable, muted: true,
  onProgress: ({ progress }) => process.stdout.write(`\rrender ${(progress * 100).toFixed(0)}%`),
});

const seconds = composition.durationInFrames / composition.fps;
const kbps = Math.floor((MAX_MB * 8 * 1024) / seconds * 0.95);
const common = ['-y', '-loglevel', 'error', '-i', raw, '-an', '-c:v', 'libx264', '-preset', 'slow', '-b:v', `${kbps}k`,
  '-maxrate', `${Math.round(kbps * 1.5)}k`, '-bufsize', `${kbps * 2}k`, '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0'];
const passlog = path.resolve('out', 'x264pass');
execFileSync('ffmpeg', [...common, '-pass', '1', '-passlogfile', passlog, '-f', 'mp4', '/dev/null']);
execFileSync('ffmpeg', [...common, '-pass', '2', '-passlogfile', passlog, '-movflags', '+faststart', final]);
rmSync(raw);
const mb = statSync(final).size / 1024 / 1024;
console.log(`\n${final} — ${mb.toFixed(1)} MB (${kbps} kbps)`);
if (mb >= 16) process.exit(1);
