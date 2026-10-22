import type { ClinicConfig } from '../clinics/types';
import type { SpecialtyTemplate } from './types';
import { psiquiatria } from './psiquiatria';

/**
 * Especialidade → template. Para criar uma especialidade nova, crie
 * src/templates/<especialidade>/ (veja o README) e registre-a aqui.
 */
export const registry = {
  psiquiatria,
} satisfies Record<string, SpecialtyTemplate<any, any>>;

/** Template da clínica. */
export const templateFor = (_clinic: ClinicConfig): SpecialtyTemplate => registry.psiquiatria as SpecialtyTemplate;
