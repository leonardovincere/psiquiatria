import type { ImageMetadata } from 'astro';

/** Modalidades de atendimento oferecidas. */
export type Modality = 'presencial' | 'teleconsulta';

/** Cores em hexadecimal (#rrggbb). Viram variáveis CSS e tokens do Tailwind. */
export interface Palette {
  /** Cor principal: botões, links, destaques. */
  primary: string;
  /** Texto sobre a cor principal (contraste mínimo 4.5:1). */
  onPrimary: string;
  /** Cor de apoio: ícones, detalhes, fundos suaves. */
  accent: string;
  /** Fundo geral da página. */
  background: string;
  /** Fundo de cartões e seções alternadas. */
  surface: string;
  /** Texto principal. */
  text: string;
  /** Texto secundário (contraste mínimo 4.5:1 sobre background e surface). */
  muted: string;
  /** Bordas e divisores. */
  border: string;
}

export interface Doctor {
  /** Nome como deve aparecer, com tratamento. Ex.: "Dra. Ana Souza". */
  name: string;
  /** Ex.: "CRM-SP 123456". Obrigatório na publicidade médica (CFM 2.336/2023). */
  crm: string;
  /** Ex.: "RQE 98765". Obrigatório ao anunciar especialidade. */
  rqe: string;
  /** Especialidade registrada no CRM. */
  specialty: string;
  /** Foto opcional (importe de src/assets). Sem foto, exibe monograma. */
  photo?: ImageMetadata;
  photoAlt?: string;
  /** Parágrafos da seção "Sobre a médica". */
  bio: string[];
  /** Formação e títulos — apenas fatos verificáveis. */
  credentials: string[];
}

export interface Address {
  street: string;
  /** Complemento: sala, andar, bairro. */
  complement?: string;
  city: string;
  state: string;
  zip: string;
  /** Consulta usada no Google Maps. Padrão: endereço completo. */
  mapsQuery?: string;
  /** Observações de acesso: estacionamento, acessibilidade etc. */
  notes?: string[];
}

export interface Condition {
  title: string;
  description: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ClinicConfig {
  /** Identificador; deve ser igual ao nome do arquivo. */
  slug: string;
  /** Liga noindex/nofollow, robots.txt bloqueado e a faixa de prévia. */
  isPreview: boolean;

  clinicName: string;
  /** Diretor(a) técnico(a) da clínica — exigido para pessoa jurídica. */
  technicalDirector?: { name: string; crm: string };
  /** CNPJ opcional, exibido no rodapé. */
  cnpj?: string;

  doctor: Doctor;
  address: Address;

  contact: {
    /** Somente dígitos, com DDI e DDD. Ex.: "5511999999999". */
    whatsapp: string;
    /** Mensagem pré-preenchida ao abrir o WhatsApp. */
    whatsappMessage: string;
    /** Telefone fixo opcional, formato livre para exibição. */
    phone?: string;
    email?: string;
    doctoralia?: string;
    /** Usuário sem @. */
    instagram?: string;
    /** Horários de atendimento, uma linha por item. */
    hours?: string[];
  };

  modalities: Modality[];
  conditions: Condition[];
  palette: Palette;

  seo: {
    title: string;
    description: string;
  };

  /** Todos os textos das seções. */
  texts: {
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      ctaLabel: string;
      secondaryCtaLabel?: string;
    };
    about: {
      title: string;
    };
    conditions: {
      title: string;
      intro: string;
      /** Nota exibida abaixo da lista. */
      note?: string;
    };
    firstVisit: {
      title: string;
      intro: string;
      steps: Step[];
    };
    telehealth: {
      title: string;
      intro: string;
      points: string[];
      note?: string;
    };
    faq: {
      title: string;
      items: FaqItem[];
    };
    location: {
      title: string;
      intro?: string;
    };
    finalCta: {
      title: string;
      text: string;
    };
    /** Aviso exibido no rodapé (ex.: orientação sobre emergências). */
    emergencyNotice: string;
  };
}

/** Helper com inferência de tipos para os arquivos de clínica. */
export function defineClinic(config: ClinicConfig): ClinicConfig {
  return config;
}
