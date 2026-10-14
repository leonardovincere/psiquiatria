import type { ClinicConfig } from '../clinics/types';

/**
 * Verificação automática de termos vedados ou de risco na publicidade médica
 * (Resolução CFM nº 2.336/2023): promessa de resultado, garantia, superlativos
 * e sensacionalismo. Não substitui a revisão humana — é uma rede de segurança
 * para o build falhar antes de algo inadequado ir ao ar.
 */
const FORBIDDEN: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bcur(a|ar|ado|ada|ados|adas|amos|o)\b/i, reason: 'promessa de cura' },
  { pattern: /\bgarant(ia|ido|ida|imos|e|ir)\b/i, reason: 'garantia de resultado' },
  { pattern: /\b100\s?%/i, reason: 'promessa de eficácia absoluta' },
  { pattern: /\bdefinitiv[oa]s?\b/i, reason: 'promessa de resultado definitivo' },
  { pattern: /\bmilagr/i, reason: 'sensacionalismo' },
  {
    pattern: /\b(o|a|os|as)\s+(melhor|melhores)\s+(psiquiatra|médic|clínica|consultório|tratamento|atendimento|especialista)/i,
    reason: 'superlativo / autopromoção',
  },
  { pattern: /\breferência\s+em\b/i, reason: 'superlativo / autopromoção' },
  { pattern: /\bn[ºo°]\s?1\b|\bnúmero\s+1\b/i, reason: 'superlativo / autopromoção' },
  { pattern: /\b(livre|livrar)(-se)?\s+(da|de|do)\s+(ansiedade|depressão)/i, reason: 'promessa de resultado' },
  { pattern: /\bresultado(s)?\s+(rápido|imediato|garantido)/i, reason: 'promessa de resultado' },
  { pattern: /\bdesconto|promoç(ão|ões)|grátis|gratuit[ao]\b/i, reason: 'mercantilização da consulta' },
  { pattern: /\bantes\s+e\s+depois\b/i, reason: 'antes e depois' },
];

// Campos técnicos ou não exibidos, que não são texto publicitário.
const SKIP_KEYS = new Set([
  'theme', 'photo', 'slug', 'siteUrl', 'contact', 'sourceUrl', 'mapsUrl', 'href', 'keywords',
  'logo', 'logoLight', 'logoMark', 'favicon', 'appleTouchIcon',
]);
// Caminhos específicos não exibidos na página.
const SKIP_PATHS = new Set(['socialProof.highlights']);

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

export function assertCompliance(clinic: ClinicConfig) {
  const problems: string[] = [];

  if (!clinic.doctor.crm.trim()) problems.push('doctor.crm é obrigatório');
  if (!clinic.doctor.rqe.trim()) problems.push('doctor.rqe é obrigatório ao anunciar especialidade');
  if (!/^\d{12,13}$/.test(clinic.contact.whatsapp)) {
    problems.push('contact.whatsapp deve conter só dígitos, com DDI e DDD (ex.: 5511999999999)');
  }
  if (!clinic.isPreview && /TODO|000000/.test(JSON.stringify(clinic))) {
    problems.push('há campos com TODO/placeholder — preencha antes de publicar com isPreview: false');
  }

  const strings: { path: string; text: string }[] = [];
  if (clinic.compliance.noOutcomePromises) collectStrings(clinic, '', strings);
  for (const { path, text } of strings) {
    for (const { pattern, reason } of FORBIDDEN) {
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
