// Quadros soltos para revisão: node scripts/stills.mjs 1.5 5 9.5 ...  (segundos) → out/stills/
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
const root = new URL('../', import.meta.url).pathname;
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({ entryPoint: `${root}src/index.ts` });
const composition = await selectComposition({ serveUrl, id: 'whatsapp', browserExecutable });
mkdirSync(`${root}out/stills`, { recursive: true });
for (const s of process.argv.slice(2).map(Number)) {
  await renderStill({ serveUrl, composition, frame: Math.round(s * composition.fps), output: `${root}out/stills/${s}.jpg`, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable });
  console.log(s);
}
