import type { ComplianceRule } from '../../lib/compliance';

/** Termos vedados próprios da psiquiatria (somados às regras comuns de src/lib/compliance.ts). */
export const PSIQUIATRIA_FORBIDDEN: ComplianceRule[] = [
  { pattern: /\b(o|a|os|as)\s+(melhor|melhores)\s+psiquiatras?\b/i, reason: 'superlativo / autopromoção' },
  { pattern: /\b(livre|livrar)(-se)?\s+(da|de|do)\s+(ansiedade|depressão)/i, reason: 'promessa de resultado' },
];
