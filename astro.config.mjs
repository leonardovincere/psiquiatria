// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { existsSync } from 'node:fs';

// URL pública do site (usada em canonical, Open Graph e sitemap).
// Defina SITE_URL no ambiente de build de cada clínica.
const site = process.env.SITE_URL || 'https://example.com';

// As fontes vêm do `theme` da clínica publicada neste build (variável CLINIC).
const slug = process.env.CLINIC || 'animus';
const { default: clinic } = await import(`./src/clinics/${slug}.ts`);
const { fontHeading, fontBody } = clinic.theme;

/**
 * Fonte auto-hospedada. Se existir src/assets/fonts/<slug>/<papel>-<estilo>.woff2
 * (já recortada para os pesos e caracteres usados), usa o arquivo local; senão,
 * baixa do Google Fonts no build. Em ambos os casos a visita não faz requisição
 * a terceiros, e o Astro gera um fallback com métricas ajustadas (sem "pulo").
 */
const fontDir = `./src/assets/fonts/${slug}`;
/**
 * @param {'heading' | 'body'} role
 * @param {string} name
 * @param {`--${string}`} cssVariable
 * @param {Array<'normal' | 'italic'>} styles
 * @param {string} weights faixa do eixo variável, ex.: "400 500"
 * @param {string[]} fallbacks
 * @returns {any} FontFamily (local ou Google)
 */
const family = (role, name, cssVariable, styles, weights, fallbacks) => {
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
    // CSS inline no <head>: página única, elimina requisição bloqueante de renderização.
    inlineStylesheets: 'always',
  },
  image: {
    // Fotos remotas (ex.: doctor.photo) são baixadas e otimizadas no build.
    remotePatterns: [{ protocol: 'https' }],
  },
  fonts: [
    family('heading', fontHeading, '--f-heading', ['normal', 'italic'], '400 500', ['Georgia', 'serif']),
    family('body', fontBody, '--f-body', ['normal'], '400 600', ['sans-serif']),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
