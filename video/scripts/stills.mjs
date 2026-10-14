// Gera quadros de revisão: node scripts/stills.mjs [segundos...] (padrão: 2 10 22 30 38)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';

const seconds = process.argv.slice(2).map(Number);
const times = seconds.length ? seconds : [2, 10, 22, 30, 38];
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'AnimusPreview', browserExecutable });
for (const t of times) {
  const output = path.resolve('out', `frame-${String(t).padStart(2, '0')}s.png`);
  await renderStill({ serveUrl, composition, frame: Math.round(t * composition.fps), output, browserExecutable });
  console.log(output);
}
