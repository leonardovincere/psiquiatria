// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, readdirSync } from 'node:fs';

// URL base (só usada como fallback; cada clínica define a sua em siteUrl ou usa
// o subdomínio <slug>.preview.vincereai.online).
const site = process.env.SITE_URL || 'https://preview.vincereai.online';

// Todas as clínicas de src/clinics (cada uma vira /<slug>). Arquivos "_*.ts",
// index.ts e types.ts não são clínicas.
const clinicFiles = readdirSync(new URL('./src/clinics/', import.meta.url)).filter(
  (f) => f.endsWith('.ts') && !f.startsWith('_') && !['index.ts', 'types.ts'].includes(f),
);
const clinics = await Promise.all(
  clinicFiles.map(async (f) => (await import(`./src/clinics/${f}`)).default),
);

/**
 * Fonte auto-hospedada. Se existir src/assets/fonts/<slug>/<papel>-<estilo>.woff2
 * (já recortada para os pesos e caracteres usados), usa o arquivo local; senão,
 * baixa do Google Fonts no build. Em ambos os casos a visita não faz requisição
 * a terceiros, e o Astro gera um fallback com métricas ajustadas (sem "pulo").
 */
/**
 * @param {string} slug
 * @param {'heading' | 'body'} role
 * @param {string} name
 * @param {`--${string}`} cssVariable
 * @param {Array<'normal' | 'italic'>} styles
 * @param {string} weights faixa do eixo variável, ex.: "400 500"
 * @param {string[]} fallbacks
 * @returns {any} FontFamily (local ou Google)
 */
const family = (slug, role, name, cssVariable, styles, weights, fallbacks) => {
  const fontDir = `./src/assets/fonts/${slug}`;
  const files = styles.map((style) => `${fontDir}/${role}-${style}.woff2`);
  if (files.every((f) => existsSync(new URL(f, import.meta.url)))) {
    return {
      provider: fontProviders.local(),
      name,
      cssVariable,
      fallbacks,
      options: {
        variants: styles.map((style, i) => ({ weight: weights, style, src: [files[i]] })),
      },
    };
  }
  return {
    provider: fontProviders.google(),
    name,
    cssVariable,
    weights: weights.split(' ').map(Number),
    styles,
    subsets: ['latin'],
    fallbacks,
  };
};

export default defineConfig({
  site,
  compressHTML: true,
  build: {
    // CSS inline no <head>: elimina requisição bloqueante de renderização.
    inlineStylesheets: 'always',
    // /animus → dist/animus.html (servido como /animus pelo cleanUrls do vercel.json).
    format: 'file',
  },
  image: {
    // Fotos remotas (ex.: doctor.photo) são baixadas e otimizadas no build.
    remotePatterns: [{ protocol: 'https' }],
  },
  // Um par de fontes por clínica, em variáveis próprias (--fh-<slug>, --fb-<slug>).
  fonts: clinics.flatMap((c) => [
    family(c.slug, 'heading', c.theme.fontHeading, `--fh-${c.slug}`, ['normal', 'italic'], '400 500', ['Georgia', 'serif']),
    family(c.slug, 'body', c.theme.fontBody, `--fb-${c.slug}`, ['normal'], '400 600', ['sans-serif']),
  ]),
  vite: {
    plugins: [tailwindcss()],
  },
});
