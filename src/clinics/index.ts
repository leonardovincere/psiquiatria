import type { ClinicConfig } from './types';
import { assertCompliance } from '../lib/compliance';

const modules = import.meta.glob<{ default: ClinicConfig }>(['./*.ts', '!./index.ts', '!./types.ts'], {
  eager: true,
});

export const clinics: Record<string, ClinicConfig> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const slug = path.replace(/^\.\/(.+)\.ts$/, '$1');
    if (mod.default.slug !== slug) {
      throw new Error(`[clinics] ${path}: slug "${mod.default.slug}" deve ser igual ao nome do arquivo ("${slug}").`);
    }
    return [slug, mod.default];
  }),
);

/** Clínica publicada neste build, escolhida pela variável de ambiente CLINIC. */
export function getClinic(): ClinicConfig {
  const slug = import.meta.env.CLINIC || process.env.CLINIC || 'animus';
  const clinic = clinics[slug];
  if (!clinic) {
    throw new Error(`[clinics] Clínica "${slug}" não encontrada. Disponíveis: ${Object.keys(clinics).join(', ')}.`);
  }
  assertCompliance(clinic);
  return clinic;
}
