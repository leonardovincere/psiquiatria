import type { ClinicConfig } from '../clinics/types';

/**
 * Mecanismo de textos, comum a todas as especialidades. Os textos padrão
 * ficam no template de cada especialidade (src/templates/<especialidade>/copy.ts);
 * a clínica sobrescreve o que quiser em `copy`.
 * Variáveis: {medico}, {titulo}, {cidade}, {uf}, {publico}.
 */

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
function merge<T>(base: T, over: unknown): T {
  if (!isObj(over)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over)) {
    if (v === undefined) continue;
    out[k] = isObj(v) && isObj(out[k]) ? merge(out[k], v) : v;
  }
  return out as T;
}

/** "a Dra. Fulana" / "o Dr. Fulano". */
export const doctorRef = (c: ClinicConfig) => {
  const article = c.doctor.article ?? (/^dra\b/i.test(c.doctor.shortName) ? 'a' : /^dr\b/i.test(c.doctor.shortName) ? 'o' : 'a');
  return `${article} ${c.doctor.shortName}`;
};

/** Textos da clínica: padrão do template + `copy` da config, com {medico}, {cidade}, {uf} e {publico} preenchidos. */
export function resolveCopy<T>(defaults: T, c: ClinicConfig): T {
  const merged = merge(defaults, c.copy);
  const vars: Record<string, string> = {
    medico: doctorRef(c),
    cidade: c.clinic.city,
    uf: c.clinic.state,
    publico: c.audience,
    titulo: c.doctor.title.toLowerCase(),
  };
  const fill = (v: unknown): unknown =>
    typeof v === 'string'
      ? v.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)
      : Array.isArray(v)
        ? v.map(fill)
        : isObj(v)
          ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)]))
          : v;
  return fill(merged) as T;
}
