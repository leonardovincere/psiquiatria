// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// URL pública do site (usada em canonical, Open Graph e sitemap).
// Defina SITE_URL no ambiente de build de cada clínica.
const site = process.env.SITE_URL || 'https://example.com';

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
  vite: {
    plugins: [tailwindcss()],
  },
});
