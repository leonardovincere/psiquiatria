// Renderiza o vídeo e prepara a entrega para o WhatsApp.
// Uso: node scripts/render.mjs   (depois de npm run data, capture e audio)
// Saída em out/: <slug>-whatsapp.mp4 (< 16 MB), <slug>-thumb.jpg
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, statSync, rmSync } from 'node:fs';

const root = new URL('../', import.meta.url).pathname;
const clinic = JSON.parse(readFileSync(`${root}src/clinic.json`, 'utf8'));
const out = `${root}out/`;
mkdirSync(out, { recursive: true });
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

const serveUrl = await bundle({ entryPoint: `${root}src/index.ts` });
const composition = await selectComposition({ serveUrl, id: 'whatsapp', browserExecutable });
const master = `${out}${clinic.slug}-master.mp4`;
const only = process.env.FRAMES?.split('-').map(Number);
await renderMedia({
  serveUrl,
  composition,
  codec: 'h264',
  crf: 16,
  audioCodec: 'aac',
  audioBitrate: '192k',
  pixelFormat: 'yuv420p',
  outputLocation: master,
  browserExecutable,
  concurrency: 4,
  frameRange: only ? [only[0], only[1]] : undefined,
  onProgress: ({ progress }) => process.stdout.write(`\r${Math.round(progress * 100)}%  `),
});
console.log('\nmestre:', master);

// Entrega: H.264 2 passes com bitrate calculado para ficar abaixo de 16 MB.
const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', master]).toString());
const audioK = 128;
const videoK = Math.floor((15.2 * 8 * 1024) / dur - audioK);
const final = `${out}${clinic.slug}-whatsapp.mp4`;
const common = ['-y', '-loglevel', 'error', '-i', master, '-c:v', 'libx264', '-preset', 'slow', '-b:v', `${videoK}k`, '-maxrate', `${Math.round(videoK * 1.6)}k`, '-bufsize', `${videoK * 2}k`, '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', '30'];
execFileSync('ffmpeg', [...common, '-pass', '1', '-passlogfile', `${out}2pass`, '-an', '-f', 'mp4', '/dev/null'], { cwd: out });
execFileSync('ffmpeg', [...common, '-pass', '2', '-passlogfile', `${out}2pass`, '-c:a', 'aac', '-b:a', `${audioK}k`, '-movflags', '+faststart', final], { cwd: out });
for (const f of ['2pass-0.log', '2pass-0.log.mbtree']) rmSync(`${out}${f}`, { force: true });
console.log('final:', final, `${(statSync(final).size / 1024 / 1024).toFixed(2)} MB`, `${dur.toFixed(1)} s`, `vídeo ${videoK} kb/s`);

// Miniatura: celular e nome lado a lado (cena "prova").
const thumbFrame = Math.round((composition.fps * (Number(process.env.THUMB_AT) || 36.6)));
await renderStill({ serveUrl, composition, frame: thumbFrame, output: `${out}${clinic.slug}-thumb.jpg`, imageFormat: 'jpeg', jpegQuality: 90, browserExecutable });
console.log('miniatura:', `${out}${clinic.slug}-thumb.jpg`);
