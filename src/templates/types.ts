import type { BaseClientConfig, Theme } from '../clients/types';
import type { ComplianceRule } from '../lib/compliance';

/**
 * Formato que todo template de especialidade exporta (src/templates/<especialidade>/index.ts).
 * O registry (src/templates/registry.ts) liga cada valor de `specialty` ao seu template.
 */
export interface SpecialtyTemplate<C extends BaseClientConfig = BaseClientConfig, K = unknown> {
  /** Igual ao campo `specialty` da config. */
  id: string;
  /** Nome exibido para quem monta a prévia. Ex.: "Psiquiatria". */
  label: string;
  /** Textos padrão das seções (a config sobrescreve em `copy`). */
  defaultCopy: K;
  /** Textos finais da página para uma config (padrão + `copy`, com variáveis preenchidas). */
  getCopy: (client: C) => K;
  /** Paleta e fontes sugeridas para começar uma prévia (a config sempre define o `theme` dela). */
  defaultTheme: Theme;
  /** Ícones SVG (conteúdo do <svg viewBox="0 0 24 24">) próprios das seções do template. */
  icons: Record<string, string>;
  /** Que fotos procurar para a prévia (orientação para quem monta; não é exibido). */
  imageSuggestions: string[];
  /** Termos vedados próprios da especialidade, somados às regras comuns de src/lib/compliance.ts. */
  forbiddenTerms: ComplianceRule[];
  /** Página completa da especialidade. Recebe a config da clínica. */
  Page: (props: { clinic: C }) => unknown;
}
