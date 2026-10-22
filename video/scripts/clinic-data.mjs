// Lê src/clients/<slug>.ts e gera src/clinic.json com o que o vídeo usa
// (nome, especialidade, cidade, cores, SEO) e copia as fontes da clínica.
// Uso: node --experimental-strip-types scripts/clinic-data.mjs <slug>
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';

const slug = process.argv[2];
if (!slug) throw new Error('Informe o slug: npm run data -- <slug>');
const root = new URL('../../', import.meta.url);
const { default: c } = await import(new URL(`src/clients/${slug}.ts`, root));

// Como a especialidade aparece nos textos do vídeo (busca, diretórios).
const TERMS = {
  psiquiatria: { one: 'psiquiatra', many: 'psiquiatras' },
  endocrinologia: { one: 'endocrinologista', many: 'endocrinologistas' },
};

const data = {
  slug: c.slug,
  specialty: c.specialty,
  term: TERMS[c.specialty] ?? { one: c.doctor.title.toLowerCase(), many: c.doctor.title.toLowerCase() },
  finish: c.style?.finish ?? null,
  article: c.doctor.article ?? (/^dra\b/i.test(c.doctor.shortName) ? 'a' : 'o'),
  clinicName: c.clinic.name,
  plans: c.insurance?.acceptsInsurance ? (c.insurance.plans ?? []) : [],
  name: c.doctor.name,
  shortName: c.doctor.shortName,
  title: c.doctor.title,
  credentials: [c.doctor.crm, c.doctor.rqe].filter(Boolean).join(' · '),
  city: c.clinic.city,
  state: c.clinic.state,
  audience: c.audience,
  tagline: c.clinic.tagline,
  url: `${c.slug}.preview.vincereai.tech`,
  seoTitle: c.seo.title,
  seoDescription: c.seo.description,
  theme: c.theme,
};
writeFileSync(new URL('src/clinic.json', new URL('../', import.meta.url)), JSON.stringify(data, null, 2) + '\n');

const fonts = new URL(`src/assets/fonts/${slug}/`, root);
const dest = new URL('../public/fonts/', import.meta.url);
mkdirSync(dest, { recursive: true });
for (const f of ['heading-normal.woff2', 'heading-italic.woff2', 'body-normal.woff2', 'script-normal.woff2']) {
  if (existsSync(new URL(f, fonts))) copyFileSync(new URL(f, fonts), new URL(f, dest));
}
console.log(`src/clinic.json: ${data.name} — ${data.title}, ${data.city}/${data.state}`);
