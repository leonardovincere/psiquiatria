import type { BaseClientConfig } from '../clients/types';

/**
 * Verificação automática de termos vedados ou de risco na publicidade médica
 * (Resolução CFM nº 2.336/2023): promessa de resultado, garantia, superlativos
 * e sensacionalismo. Não substitui a revisão humana — é uma rede de segurança
 * para o build falhar antes de algo inadequado ir ao ar.
 */
export interface ComplianceRule {
  pattern: RegExp;
  reason: string;
}

/** Regras comuns a todas as especialidades. Cada template acrescenta as suas (`forbiddenTerms`). */
const FORBIDDEN: ComplianceRule[] = [
  { pattern: /\bcur(a|ar|ado|ada|ados|adas|amos|o)\b/i, reason: 'promessa de cura' },
  { pattern: /\bgarant(ia|ido|ida|imos|e|ir)\b/i, reason: 'garantia de resultado' },
  { pattern: /\b100\s?%/i, reason: 'promessa de eficácia absoluta' },
  { pattern: /\bdefinitiv[oa]s?\b/i, reason: 'promessa de resultado definitivo' },
  { pattern: /\bmilagr/i, reason: 'sensacionalismo' },
  {
    pattern: /\b(o|a|os|as)\s+(melhor|melhores)\s+(médic|clínica|consultório|tratamento|atendimento|especialista)/i,
    reason: 'superlativo / autopromoção',
  },
  { pattern: /\breferência\s+em\b/i, reason: 'superlativo / autopromoção' },
  { pattern: /\bn[ºo°]\s?1\b|\bnúmero\s+1\b/i, reason: 'superlativo / autopromoção' },
  { pattern: /\bresultado(s)?\s+(rápido|imediato|garantido)/i, reason: 'promessa de resultado' },
  { pattern: /\bdesconto|promoç(ão|ões)|grátis|gratuit[ao]\b/i, reason: 'mercantilização da consulta' },
  { pattern: /\bantes\s+e\s+depois\b/i, reason: 'antes e depois' },
];

// Áreas sem RQE / com restrições do CFM: não podem aparecer como especialidade nos textos exibidos.
const NON_RECOGNIZED: ComplianceRule[] = [
  { pattern: /ortomolecular/i, reason: 'prática com restrições do CFM' },
  { pattern: /medicina\s+(integrativa|funcional)/i, reason: 'área sem RQE' },
  { pattern: /nutrologia|nutr[oó]logo/i, reason: 'especialidade sem RQE informado' },
];

// Campos técnicos ou não exibidos, que não são texto publicitário.
const SKIP_KEYS = new Set([
  'theme', 'photo', 'slug', 'siteUrl', 'contact', 'sourceUrl', 'mapsUrl', 'href', 'keywords',
  'logo', 'logoLight', 'logoMark', 'favicon', 'appleTouchIcon', 'designNotes',
]);
// Caminhos específicos não exibidos na página.
const SKIP_PATHS = new Set(['research.link', 'socialProof.highlights', 'doctor.complementaryCourses', 'seo.keywords']);

function collectStrings(value: unknown, path: string, out: { path: string; text: string }[]) {
  if (typeof value === 'string') out.push({ path, text: value });
  else if (Array.isArray(value)) value.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      const next = path ? `${path}.${k}` : k;
      if (SKIP_KEYS.has(k) || SKIP_PATHS.has(next)) continue;
      collectStrings(v, next, out);
    }
  }
}

/**
 * @param templateRules termos vedados próprios da especialidade.
 * @param resolvedCopy  textos finais da página (padrão do template + `copy`), conferidos junto com a config.
 */
export function assertCompliance(clinic: BaseClientConfig, templateRules: ComplianceRule[] = [], resolvedCopy?: unknown) {
  const problems: string[] = [];

  // CRM/RQE: obrigatórios para publicar. Na prévia, a página mostra "em confirmação" e o build só avisa.
  const missing = [!clinic.doctor.crm?.trim() && 'doctor.crm', !clinic.doctor.rqe?.trim() && 'doctor.rqe'].filter(Boolean);
  if (missing.length) {
    const msg = `${missing.join(' e ')} ausente(s) — obrigatório(s) pela CFM 2.336/2023`;
    if (clinic.isPreview) console.warn(`[compliance] ${clinic.slug}: ${msg} (prévia: exibido como "em confirmação").`);
    else problems.push(msg);
  }
  if (!/^\d{12,13}$/.test(clinic.contact.whatsapp)) {
    problems.push('contact.whatsapp deve conter só dígitos, com DDI e DDD (ex.: 5511999999999)');
  }
  if (!clinic.isPreview && /TODO|000000/.test(JSON.stringify(clinic))) {
    problems.push('há campos com TODO/placeholder — preencha antes de publicar com isPreview: false');
  }

  const strings: { path: string; text: string }[] = [];
  const scan = clinic.compliance.noOutcomePromises || clinic.compliance.hideNonRecognizedSpecialties;
  if (scan) {
    // O `copy` da config já entra resolvido (texto final); os demais campos vêm direto da config.
    collectStrings({ ...clinic, copy: undefined }, '', strings);
    collectStrings(resolvedCopy ?? clinic.copy, 'copy', strings);
  }
  const rules = [...FORBIDDEN, ...templateRules, ...(clinic.compliance.hideNonRecognizedSpecialties ? NON_RECOGNIZED : [])];
  for (const { path, text } of strings) {
    for (const { pattern, reason } of rules) {
      const match = text.match(pattern);
      if (match) problems.push(`${path}: "${match[0]}" (${reason})`);
    }
  }

  if (problems.length) {
    throw new Error(
      `[compliance] ${clinic.slug}: revise os textos (Resolução CFM 2.336/2023):\n  - ${problems.join('\n  - ')}`,
    );
  }
}
