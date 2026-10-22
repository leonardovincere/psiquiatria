import type { ClientConfig } from './types';
import { assertCompliance } from '../lib/compliance';
import { templateFor } from '../templates/registry';

/**
 * Todos os clientes: cada arquivo src/clients/<slug>.ts (exceto index, types
 * e arquivos começando com "_", como os moldes _template-*.ts) vira uma página /<slug>.
 */
const modules = import.meta.glob<{ default: ClientConfig }>(['./*.ts', '!./index.ts', '!./types.ts', '!./_*.ts'], {
  eager: true,
});

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const clients: ClientConfig[] = Object.entries(modules).map(([path, mod]) => {
  const file = path.replace(/^\.\/(.+)\.ts$/, '$1');
  const client = mod.default;
  if (!client) throw new Error(`[clients] ${path}: falta "export default".`);
  if (client.slug !== file) {
    throw new Error(`[clients] ${path}: slug "${client.slug}" deve ser igual ao nome do arquivo ("${file}").`);
  }
  if (!SLUG.test(client.slug)) {
    throw new Error(`[clients] ${path}: slug "${client.slug}" deve ter só letras minúsculas, números e hífens.`);
  }
  const template = templateFor(client);
  assertCompliance(client, template.forbiddenTerms, template.getCopy(client));
  return client;
});

export const clientsBySlug: Record<string, ClientConfig> = Object.fromEntries(clients.map((c) => [c.slug, c]));
