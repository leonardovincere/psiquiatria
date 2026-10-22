import type { ClinicConfig } from './types';
import { assertCompliance } from '../lib/compliance';
import { templateFor } from '../templates/registry';

/**
 * Todas as clínicas: cada arquivo src/clinics/<slug>.ts (exceto index, types
 * e arquivos começando com "_", como o _template.ts) vira uma página /<slug>.
 */
const modules = import.meta.glob<{ default: ClinicConfig }>(['./*.ts', '!./index.ts', '!./types.ts', '!./_*.ts'], {
  eager: true,
});

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const clinics: ClinicConfig[] = Object.entries(modules).map(([path, mod]) => {
  const file = path.replace(/^\.\/(.+)\.ts$/, '$1');
  const clinic = mod.default;
  if (!clinic) throw new Error(`[clinics] ${path}: falta "export default".`);
  if (clinic.slug !== file) {
    throw new Error(`[clinics] ${path}: slug "${clinic.slug}" deve ser igual ao nome do arquivo ("${file}").`);
  }
  if (!SLUG.test(clinic.slug)) {
    throw new Error(`[clinics] ${path}: slug "${clinic.slug}" deve ter só letras minúsculas, números e hífens.`);
  }
  const template = templateFor(clinic);
  assertCompliance(clinic, template.forbiddenTerms, template.getCopy(clinic));
  return clinic;
});

export const clinicsBySlug: Record<string, ClinicConfig> = Object.fromEntries(clinics.map((c) => [c.slug, c]));
