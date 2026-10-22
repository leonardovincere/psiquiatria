import { getImage } from 'astro:assets';
import type { BaseClientConfig } from '../clients/types';

/**
 * Versões otimizadas da foto do topo. Usada pelo Hero (<img>) e pelo Layout
 * (<link rel="preload">), para o navegador começar a baixar a foto — o maior
 * elemento da primeira tela no celular — antes de ler o corpo da página.
 */
export const heroPhotoSizes =
  '(min-width: 1280px) 520px, (min-width: 1024px) 460px, (min-width: 768px) 620px, 100vw';

const cache = new Map<string, ReturnType<typeof getImage>>();

export function getHeroPhoto(clinic: BaseClientConfig) {
  const src = clinic.doctor.photo;
  if (!src) return Promise.resolve(null);
  if (!cache.has(src)) {
    cache.set(
      src,
      (async () => {
        // Larguras: 390 (celular) e a largura original (até 1040), sem ampliar a foto.
        const original = await getImage({ src, inferSize: true, format: 'webp' });
        const max = Math.min(Number(original.attributes.width) || 1040, 1040);
        const widths = [...new Set([Math.min(390, max), max])];
        return getImage({ src, inferSize: true, widths, format: 'webp' });
      })(),
    );
  }
  return cache.get(src)!;
}
