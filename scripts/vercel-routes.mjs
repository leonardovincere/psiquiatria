// Gera em vercel.json uma regra explícita por cliente:
//   <slug>.preview.vincereai.tech/           → /<slug>
//   <slug>.preview.vincereai.tech/robots.txt → /<slug>/robots.txt
// Regras explícitas (sem extrair o slug do domínio por regex) são o caminho mais
// previsível na Vercel. Rode `npm run routes` sempre que criar/remover um cliente;
// o build falha se o vercel.json estiver desatualizado.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const PREVIEW_DOMAIN = 'preview.vincereai.tech';
const root = new URL('../', import.meta.url);
export const clinicSlugs = () =>
  readdirSync(new URL('src/clients/', root))
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_') && !['index.ts', 'types.ts'].includes(f))
    .map((f) => f.replace(/\.ts$/, ''))
    .sort();

export function buildRewrites(slugs) {
  return slugs.flatMap((slug) => {
    const has = [{ type: 'host', value: `${slug}.${PREVIEW_DOMAIN}` }];
    return [
      { source: '/', has, destination: `/${slug}` },
      { source: '/robots.txt', has, destination: `/${slug}/robots.txt` },
    ];
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = new URL('vercel.json', root);
  const config = JSON.parse(readFileSync(file, 'utf8'));
  config.rewrites = buildRewrites(clinicSlugs());
  writeFileSync(file, JSON.stringify(config, null, 2) + '\n');
  console.log(`vercel.json: ${config.rewrites.length / 2} cliente(s) — ${clinicSlugs().join(', ')}`);
}
