import type { BaseClientConfig, BaseCopy, DeepPartial } from '../../clients/types';
import type { EndoIconName } from './icons';

/** Campos próprios da endocrinologia (somados a BaseClientConfig). */

/** Área de atuação (seção "Áreas de atuação"). */
export interface Area {
  name: string;
  description: string;
  /** Ícone do template (./icons.ts). Sem ele, usa um marcador neutro. */
  icon?: EndoIconName;
}

/** Etapa da consulta ou do acompanhamento. */
export interface CareStep {
  title: string;
  text: string;
  /** Ícone do template (./icons.ts), usado no acabamento "luxe". Sem ele, um ícone padrão pela posição. */
  icon?: EndoIconName;
}

/** Escolhas de layout do template (opcional). */
export interface EndoStyle {
  /**
   * Acabamento: "clinic" (padrão: técnico, cantos retos, grade milimetrada no topo) ou
   * "luxe" (minimalista e premium: fundo com estrutura molecular sutil, topo centralizado com
   * medalhão de vidro espelhado, áreas em cartões de ícone que se expandem, consulta em abas,
   * cabeçalho fosco, chamadas em fonte cursiva (theme.fontScript) e rodapé com assinatura).
   */
  finish?: 'clinic' | 'luxe';
  /** Abertura cinematográfica na 1ª visita (padrão: ligada no "luxe"). */
  intro?: boolean;
}

/** Exame ou avaliação feita no consultório. */
export interface ExamItem {
  name: string;
  description: string;
}

/** Seção "Exames e bioimpedância". Opcional: só aparece com `enabled: true`. */
export interface Exams {
  enabled: boolean;
  /** Exames/avaliações oferecidos no consultório. Só o que a clínica de fato faz. */
  items?: ExamItem[];
  /** Bioimpedância no consultório: ganha um destaque próprio na seção. */
  bioimpedance?: boolean;
}

/** Textos das seções de endocrinologia. Padrões em ./copy.ts; o cliente sobrescreve em `copy`. */
export interface EndocrinologiaCopy extends BaseCopy {
  nav: { areas: string; care: string; exams: string; about: string; telehealth: string; faq: string; location: string };
  hero: { eyebrowFallback: string; subtitle: string; link: string; credentialsLabel: string };
  areas: { eyebrow: string; title: string; intro: string; note: string; items: Area[] };
  care: {
    eyebrow: string;
    title: string;
    intro: string;
    firstVisit: string;
    followUp: string;
    firstVisitSteps: CareStep[];
    followUpSteps: CareStep[];
  };
  exams: { eyebrow: string; title: string; intro: string; bioimpedanceTitle: string; bioimpedanceText: string; note: string };
  coverage: { title: string; plans: string; toConfirm: string; privateCare: string; paymentPrefix: string };
  /** Títulos das colunas do rodapé com assinatura (acabamento "luxe"). */
  footer: { address: string; contact: string; explore: string; hours: string; whatsapp: string };
}

export interface EndocrinologiaClient extends BaseClientConfig {
  specialty: 'endocrinologia';
  /** Sobrescreve textos padrão das seções. */
  copy?: DeepPartial<EndocrinologiaCopy>;
  /** Preços nunca aparecem neste template. */
  showPrices: false;
  /** Áreas de atuação. Sem elas, valem as seis do template (copy.areas.items). */
  areas?: Area[];
  /** Etapas da primeira consulta e do acompanhamento. Sem elas, valem as do template. */
  care?: { firstVisit?: CareStep[]; followUp?: CareStep[] };
  /** Exames e bioimpedância no consultório (opcional, desligado se ausente). */
  exams?: Exams;
  /** Layout (opcional): acabamento e abertura. */
  style?: EndoStyle;
  /*
   * Depoimentos de pacientes: este template não tem a seção, de propósito.
   * A regra do projeto (CFM 2.336/2023) é mostrar só o número agregado de
   * avaliações, com link para a fonte, via `socialProof`.
   */
}
