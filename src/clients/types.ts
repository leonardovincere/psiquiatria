import type { PsiquiatriaClient } from '../templates/psiquiatria/types';
import type { EndocrinologiaClient } from '../templates/endocrinologia/types';

/**
 * Estrutura do config de cada cliente (src/clients/<slug>.ts).
 *
 * `ClientConfig` é um tipo discriminado pelo campo obrigatório `specialty`:
 * a parte comum (BaseClientConfig) serve a qualquer especialidade, e cada
 * template acrescenta os campos dele (src/templates/<especialidade>/types.ts).
 * Faltou um campo obrigatório da especialidade escolhida? O build quebra.
 */

export interface ClinicIdentity {
  /** Nome curto, usado no cabeçalho. */
  name: string;
  /** Nome completo, usado no rodapé e no SEO. */
  fullName: string;
  /** Frase principal do hero. */
  tagline: string;
  /** Linha curta acima do título do hero. Padrão: "Psiquiatria · <audience> · <cidade>/<UF>". */
  heroEyebrow?: string | null;
  /** Trecho da tagline destacado em itálico (com sublinhado na cor de destaque). */
  taglineHighlight?: string | null;
  city: string;
  state: string;
  /** Logo horizontal (em /public), usado no cabeçalho e no rodapé. Sem logo, exibe o nome. */
  logo?: string | null;
  /** Logo para fundos escuros (rodapé). Sem ele, o rodapé usa o nome em texto. */
  logoLight?: string | null;
  /** Símbolo do logo (SVG/PNG), usado como ornamento. */
  logoMark?: string | null;
  /** Ícone da aba (PNG/SVG em /public). Sem ícone, gera um a partir da cor primária. */
  favicon?: string | null;
  /** Ícone 180×180 para atalho na tela inicial do iOS. */
  appleTouchIcon?: string | null;
}

export interface Doctor {
  /** Nome completo com tratamento. Ex.: "Dra. Ana Souza Lima". */
  name: string;
  /** Nome curto para textos corridos. Ex.: "Dra. Ana Souza". */
  shortName: string;
  /** Ex.: "Médica Psiquiatra". */
  title: string;
  /** Artigo usado nos textos ("com a Dra. …" / "com o Dr. …"). Padrão: deduzido de "Dra."/"Dr.". */
  article?: 'a' | 'o';
  /**
   * Ex.: "CRM-SP 123456". Obrigatório na publicidade médica (CFM 2.336/2023).
   * null só é aceito em prévia (isPreview): a página mostra "em confirmação"; publicar sem ele falha no build.
   */
  crm: string | null;
  /** Ex.: "RQE 9876". Obrigatório ao anunciar especialidade. Mesma regra do CRM. */
  rqe: string | null;
  /** URL da foto (remota ou em /public). Sem foto, exibe monograma. */
  photo?: string | null;
  /** Formação e títulos — apenas fatos verificáveis. */
  education: string[];
  /** Experiência profissional. Com ela, a página ganha a seção "Trajetória" (formação + experiência). */
  experience?: string[];
  /** Cursos complementares. Não são exibidos (áreas sem RQE não podem ser anunciadas). */
  complementaryCourses?: string[];
  /** Parágrafos da seção "Sobre". */
  bio: string[];
}

export interface Modalities {
  presencial: boolean;
  /** Controla a seção de teleconsulta. null = a confirmar (a seção não aparece). */
  teleconsulta: boolean | null;
}

export interface Insurance {
  /** null = a confirmar. */
  acceptsInsurance: boolean | null;
  note: string | null;
  /** Convênios aceitos, por nome (exibidos pelos templates que têm a seção de convênios). */
  plans?: string[];
}

export interface Service {
  name: string;
  description: string;
  /** Exibido somente quando showPrices = true. Ex.: "R$ 500". */
  price?: string | null;
}

export interface Highlight {
  /** Valor em destaque, curto. Ex.: "Desde 2012". */
  value: string;
  label: string;
  /** Link opcional (ex.: fonte das avaliações). */
  href?: string;
  /** Detalhe discreto abaixo do rótulo. Ex.: "UFMS, 2024". */
  note?: string | null;
}

/** Credencial em destaque (mesmo formato de Highlight). Usada quando não há `highlights`. */
export type Credential = Highlight;

/** Direção de arte (não exibida): referência para quem monta a prévia. */
export interface DesignNotes {
  concept?: string;
  hero?: string;
  signatureSection?: string;
  motion?: string;
  avoid?: string[];
}

export interface SocialProof {
  enabled: boolean;
  /** Ex.: "148 avaliações de pacientes no Doctoralia". */
  label: string | null;
  rating: number | null;
  /** Link para a fonte das avaliações. */
  sourceUrl: string | null;
  /** Não exibido: o site mostra só o número agregado, sem depoimentos. */
  highlights?: string[];
}

export interface Contact {
  /** Somente dígitos, com DDI e DDD. Ex.: "5511999999999". */
  whatsapp: string;
  /** Mensagem pré-preenchida ao abrir o WhatsApp. */
  whatsappMessage: string;
  phone: string | null;
  email: string | null;
  /** URLs completas. */
  instagram: string | null;
  facebook: string | null;
  doctoralia: string | null;
}

export interface Address {
  /** Nome do local, quando ela atende dentro de outra clínica. Ex.: "Clínica Bella Età". */
  clinicName?: string | null;
  street: string;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  /** null = a confirmar (o CEP não aparece). */
  zip: string | null;
  coords: { lat: number; lng: number } | null;
  /** Link "Abrir no Google Maps". Padrão: busca pelo endereço. */
  mapsUrl: string | null;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Theme {
  /** Cor principal: botões, links, destaques. */
  primary: string;
  /** Cor de apoio: fundos suaves e detalhes. */
  secondary: string;
  /** Detalhes e CTAs secundários. */
  accent: string;
  background: string;
  text: string;
  /** Nome da família no Google Fonts. Ex.: "Newsreader". Precisa ter itálico. */
  fontHeading: string;
  /** Peso dos títulos (400 ou 500). Fontes finas, como Cormorant, ficam melhores com 500. */
  headingWeight?: 400 | 500;
  fontBody: string;
}

export interface Seo {
  title: string;
  description: string;
  keywords: string[];
}

export interface Compliance {
  /** Exibe CRM/RQE também no hero (rodapé e "Sobre" sempre exibem). */
  showCrmRqeEverywhere: boolean;
  /** Ativa a verificação automática de termos vedados no build. */
  noOutcomePromises: boolean;
  /** Barra no build termos de áreas sem RQE (ortomolecular, medicina integrativa/funcional…) nos textos exibidos. */
  hideNonRecognizedSpecialties?: boolean;
  /** Lembrete de que depoimentos de pacientes não são exibidos (a página nunca os mostra). */
  noPatientTestimonials?: boolean;
  /** Diretor(a) técnico(a) — exigido para pessoa jurídica. Texto livre com nome e CRM. */
  technicalDirector: string | null;
}

/**
 * Textos usados pelos componentes compartilhados. Cada template estende este
 * formato com os textos das seções dele e define os padrões em copy.ts.
 * Variáveis: {medico} ("a Dra. Fulana" / "o Dr. Fulano"), {titulo}, {cidade}, {uf}, {publico}.
 */
export interface BaseCopy {
  scheduleCta: string;
  about: { eyebrow: string };
  telehealth: { eyebrow: string; title: string; titleEm: string; subtitle: string; points: [string, string, string]; note: string };
  faq: { title: string };
  location: { title: string; mapButton: string; mapsLink: string };
  finalCta: { title: string; titleEm: string; text: string; callPrefix: string };
  emergencyNotice: string;
  legalNotice: string;
  previewSuffix: string;
  /** Especialidade no schema.org (dados estruturados). Ex.: "Psychiatric". */
  schemaSpecialty: string;
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? (T[K] extends unknown[] ? T[K] : DeepPartial<T[K]>) : T[K] };

/** Campos comuns a todas as especialidades. */
export interface BaseClientConfig {
  /** Especialidade: escolhe o template (src/templates/registry.ts). */
  specialty: string;
  /** Identificador e caminho da página (/<slug>, <slug>.preview.vincereai.tech). Igual ao nome do arquivo; minúsculas, números e hífen. */
  slug: string;
  /** Domínio próprio quando o site sair da prévia (canonical/OG). Padrão: https://<slug>.preview.vincereai.tech/ */
  siteUrl?: string | null;
  /** Sobrescreve textos padrão das seções (o formato depende da especialidade). */
  copy?: unknown;
  /** Ativa noindex/nofollow, robots.txt bloqueado e a faixa previewBanner. */
  isPreview: boolean;
  previewBanner: string;

  clinic: ClinicIdentity;
  doctor: Doctor;

  /** Público atendido. Ex.: "Adultos". */
  audience: string;
  modalities: Modalities;
  insurance: Insurance;
  payment: string[] | null;

  services: Service[];
  showPrices: boolean;

  /** Até 3 números/fatos em destaque abaixo do topo. Sem eles, usa `credentials` ou mostra formação e modalidades. */
  highlights?: Highlight[];
  /** Credenciais em destaque (alternativa a `highlights`, com `note` opcional). */
  credentials?: Credential[];
  /** Direção de arte (não exibida na página). */
  designNotes?: DesignNotes;
  socialProof: SocialProof;
  contact: Contact;
  address: Address;
  /** Horários: um texto ou uma linha por item. null = não exibe. */
  hours: string | string[] | null;
  faq: FaqItem[];

  theme: Theme;
  seo: Seo;
  compliance: Compliance;
}

/** Config de um cliente: uma variante por especialidade. */
export type ClientConfig = PsiquiatriaClient | EndocrinologiaClient;

export type Specialty = ClientConfig['specialty'];
