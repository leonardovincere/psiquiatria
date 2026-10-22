import type { BaseClientConfig, BaseCopy, DeepPartial } from '../../clients/types';

/** Campos próprios da psiquiatria (somados a BaseClientConfig). */

/** Princípio da forma de atender (seção "Abordagem"). */
export interface ApproachItem {
  title: string;
  text: string;
}

/** Escolhas de layout por clínica, para as prévias não ficarem iguais. */
export interface LayoutStyle {
  /**
   * Topo: "arch" = foto em arco que se abre ao rolar (padrão); "circle" = foto/monograma em círculo com anel de texto girando;
   * "cinema" = tela cheia escura com luz de projetor, título que entra em foco e créditos de cartaz (foto opcional, ao fundo);
   * "neural" = rede neural viva (sinapses que acendem e pulsos na cor principal), monograma desenhado em traço,
   * título centralizado como cartela de abertura e letterbox 2.39:1 que se abre ao rolar, com a câmera atravessando a rede.
   */
  hero?: 'arch' | 'circle' | 'cinema' | 'neural';
  /** Condições: "marquee" = faixas deslizando (padrão); "chips" = grade fixa de etiquetas. */
  conditions?: 'marquee' | 'chips';
  /**
   * Acabamento: "soft" (padrão: cantos arredondados, botões em pílula) ou "editorial"
   * (botões retos, seções numeradas, filetes no lugar de cartões, textura de papel e
   * fundo animado no topo).
   * "cinema": botões retos com brilho, títulos que entram em foco, granulação de filme, faixas de condições
   * como letreiro e primeira consulta com o título preso na rolagem. A abertura vira um letterbox que se abre.
   * "noir": o "cinema" inteiro numa cena noturna. Pede um `theme` escuro (background escuro, texto claro, primary como luz):
   * vinheta fixa, títulos com brilho metálico na cor principal, primeira consulta ligada por um fio que se desenha ao rolar.
   */
  finish?: 'soft' | 'editorial' | 'cinema' | 'noir';
  /** Abertura: cortina com o monograma/logo que sobe revelando o site (só na 1ª visita). Padrão: ligada no "editorial" e no "cinema". */
  intro?: boolean;
}

export interface Condition {
  name: string;
  description: string;
}

export interface Step {
  title: string;
  text: string;
}

/** Mito comum sobre psiquiatria e a resposta correta (seção "Mitos"). */
export interface Myth {
  myth: string;
  truth: string;
}

/** Público por fase da vida (seção "Fases da vida", em cartazes). */
export interface Audience {
  /** Ex.: "Crianças". */
  label: string;
  text: string;
  /** Temas mais comuns nessa fase (3–4 itens curtos). */
  highlights: string[];
}

/** Trabalho acadêmico em destaque (seção "Pesquisa", em estilo de capa de publicação). */
export interface Research {
  enabled: boolean;
  /** Título da seção. Ex.: "Pesquisa que vem do consultório". */
  heading: string;
  /** Título do trabalho. */
  title: string;
  /** Ex.: "Tese de doutorado". */
  kind: string;
  institution: string;
  year: number | null;
  /** Por que o trabalho importa para o paciente (1–2 frases). */
  summary: string | null;
  /** Link para o trabalho publicado. */
  link: string | null;
}

/** Conteúdo educativo (seção de perguntas comuns com respostas curtas). */
export interface Articles {
  enabled: boolean;
  heading: string;
  intro: string | null;
  items: { slug: string; title: string; excerpt: string; href?: string | null }[];
}

/** Textos das seções de psiquiatria. Padrões em ./copy.ts; a clínica sobrescreve em `copy`. */
export interface PsiquiatriaCopy extends BaseCopy {
  hero: { eyebrowFallback: string; subtitle: string; link: string; ringText: string };
  approach: { eyebrow: string; title: string };
  journey: { eyebrow: string; title: string; education: string; experience: string };
  conditions: { title: string; intro: string; note: string };
  firstVisit: { eyebrow: string; title: string; extraPrefix: string; paymentPrefix: string };
  research: { eyebrow: string; link: string };
  myths: { eyebrow: string; title: string; subtitle: string; mythLabel: string; truthLabel: string };
  audiences: { eyebrow: string; title: string };
  articles: { eyebrow: string };
}

export interface PsiquiatriaClient extends BaseClientConfig {
  specialty: 'psiquiatria';
  /** Sobrescreve textos padrão das seções. */
  copy?: DeepPartial<PsiquiatriaCopy>;
  conditions: Condition[];
  firstVisitSteps: Step[];
  /** Princípios da forma de atender (opcional): vira a seção "Abordagem". */
  approach?: ApproachItem[];
  /** Escolhas de layout (opcional). */
  style?: LayoutStyle;
  /** Mitos e verdades: liga a seção "Mitos" (o mito é riscado e dá lugar à verdade, guiado pela rolagem). */
  myths?: Myth[];
  /** Públicos por fase da vida: liga a seção "Fases da vida" (um cartaz por fase). */
  audiences?: Audience[];
  /** Trabalho acadêmico em destaque: liga a seção "Pesquisa". */
  research?: Research;
  /** Conteúdo educativo: liga a seção de perguntas comuns. */
  articles?: Articles;
}
