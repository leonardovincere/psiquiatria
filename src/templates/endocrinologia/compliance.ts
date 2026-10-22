import type { ComplianceRule } from '../../lib/compliance';

/**
 * Termos vedados próprios da endocrinologia (somados às regras comuns de
 * src/lib/compliance.ts). Cobrem promessa de perda de peso, terapias
 * hormonais com fim estético ou de desempenho (Resolução CFM nº 2.333/2023)
 * e o sensacionalismo comum em anúncios de emagrecimento (CFM 2.336/2023).
 */
export const ENDOCRINOLOGIA_FORBIDDEN: ComplianceRule[] = [
  { pattern: /\b(o|a|os|as)\s+(melhor|melhores)\s+endocrinologistas?\b/i, reason: 'superlativo / autopromoção' },
  {
    pattern: /\b(perca|perder|percam|elimine|eliminar|emagre[cç]a|emagrecer)\s+(até\s+)?\d+\s*(kg|quilos)/i,
    reason: 'promessa de resultado (perda de peso)',
  },
  {
    pattern: /\b(emagrecimento|emagrecer|perda\s+de\s+peso)\s+(rápid[oa]|garantid[oa]|definitiv[oa]|sem\s+esforço|fácil)/i,
    reason: 'promessa de resultado (perda de peso)',
  },
  { pattern: /\bchip\s+da\s+beleza|\bimplantes?\s+hormona(l|is)/i, reason: 'terapia hormonal vedada para fins estéticos (CFM 2.333/2023)' },
  {
    pattern: /\bmodula[çc][ãa]o\s+hormonal|\banti-?aging\b|\bantienvelhecimento\b|\bhormônios?\s+bioidêntic/i,
    reason: 'terapia hormonal com fim estético/antienvelhecimento (CFM 2.333/2023)',
  },
  { pattern: /\bsoroterapia\b/i, reason: 'prática sem respaldo do CFM' },
  { pattern: /\bcorpo\s+dos\s+sonhos|\bbarriga\s+chapada|\bsecar\s+a\s+barriga/i, reason: 'sensacionalismo' },
];
