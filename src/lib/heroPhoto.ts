import { getImage } from 'astro:assets';
import type { ClinicConfig } from '../clinics/types';

/**
 * Versões otimizadas da foto do topo. Usada pelo Hero (<img>) e pelo Layout
 * (<link rel="preload">), para o navegador começar a baixar a foto — o maior
 * elemento da primeira tela no celular — antes de ler o corpo da página.
 */
export const heroPhotoSizes =
  '(min-width: 1280px) 520px, (min-width: 1024px) 460px, (min-width: 768px) 620px, 100vw';

export async function getHeroPhoto(clinic: ClinicConfig) {
  if (!clinic.doctor.photo) return null;
  return getImage({ src: clinic.doctor.photo, inferSize: true, widths: [390, 529], format: 'webp' });
}
