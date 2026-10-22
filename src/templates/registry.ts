import type { ClientConfig, Specialty } from '../clients/types';
import type { SpecialtyTemplate } from './types';
import { psiquiatria } from './psiquiatria';

/**
 * Especialidade → template. O tipo exige um template para cada valor de
 * `specialty` em ClientConfig: especialidade sem template quebra o build.
 * Para criar uma especialidade nova, veja o README.
 */
type Registry = { [S in Specialty]: SpecialtyTemplate<Extract<ClientConfig, { specialty: S }>, any> };

export const registry: Registry = {
  psiquiatria,
};

/** Template da especialidade do cliente. */
export function templateFor<C extends ClientConfig>(client: C): SpecialtyTemplate<C> {
  const template = registry[client.specialty as Specialty];
  if (!template) {
    throw new Error(
      `[templates] ${client.slug}: especialidade "${client.specialty}" sem template. Opções: ${Object.keys(registry).join(', ')}.`,
    );
  }
  return template as unknown as SpecialtyTemplate<C>;
}
