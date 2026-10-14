import sharp from 'sharp';
import { join } from 'node:path';

/**
 * Dimensões reais de uma imagem em /public (logo, símbolo), lidas no build.
 * Servem para os atributos width/height (evitam "pulo" de layout) sem
 * números fixos de uma clínica no código.
 */
const cache = new Map<string, Promise<{ width: number; height: number }>>();
// O build roda na raiz do projeto; import.meta.url apontaria para dentro de dist/.
const publicDir = join(process.cwd(), 'public');

export function assetSize(path: string) {
  if (!cache.has(path)) {
    const file = join(publicDir, path.replace(/^\//, ''));
    cache.set(
      path,
      sharp(file)
        .metadata()
        .then(({ width = 1, height = 1 }) => ({ width, height })),
    );
  }
  return cache.get(path)!;
}

/** Altura proporcional para uma largura de exibição. */
export async function heightFor(path: string, width: number) {
  const s = await assetSize(path);
  return Math.round((width * s.height) / s.width);
}
