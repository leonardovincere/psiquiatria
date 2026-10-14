/**
 * Estrutura do config de cada clínica (src/clinics/<slug>.ts).
 * Os textos das seções que não vêm do config estão nos componentes,
 * montados a partir destes dados.
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
  /** Ex.: "CRM-SP 123456". Obrigatório na publicidade médica (CFM 2.336/2023). */
  crm: string;
  /** Ex.: "RQE 9876". Obrigatório ao anunciar especialidade. */
  rqe: string;
  /** URL da foto (remota ou em /public). Sem foto, exibe monograma. */
  photo?: string | null;
  /** Formação e títulos — apenas fatos verificáveis. */
  education: string[];
  /** Parágrafos da seção "Sobre". */
  bio: string[];
}

export interface Modalities {
  presencial: boolean;
  /** Controla a seção de teleconsulta. */
  teleconsulta: boolean;
}

export interface Insurance {
  acceptsInsurance: boolean;
  note: string;
}

export interface Condition {
  name: string;
  description: string;
}

export interface Service {
  name: string;
  description: string;
  /** Exibido somente quando showPrices = true. Ex.: "R$ 500". */
  price?: string | null;
}

export interface Step {
  title: string;
  text: string;
}

export interface SocialProof {
  enabled: boolean;
  /** Ex.: "148 avaliações de pacientes no Doctoralia". */
  label: string;
  rating: number;
  /** Link para a fonte das avaliações. */
  sourceUrl: string;
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
  street: string;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  zip: string;
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
  /** Diretor(a) técnico(a) — exigido para pessoa jurídica. Texto livre com nome e CRM. */
  technicalDirector: string | null;
}

export interface ClinicConfig {
  /** Identificador; deve ser igual ao nome do arquivo. */
  slug: string;
  /** Ativa noindex/nofollow, robots.txt bloqueado e a faixa previewBanner. */
  isPreview: boolean;
  previewBanner: string;

  clinic: ClinicIdentity;
  doctor: Doctor;

  /** Público atendido. Ex.: "Adultos". */
  audience: string;
  modalities: Modalities;
  insurance: Insurance;
  payment: string[];

  conditions: Condition[];
  services: Service[];
  showPrices: boolean;
  firstVisitSteps: Step[];

  socialProof: SocialProof;
  contact: Contact;
  address: Address;
  /** Horários, uma linha por item. null = não exibe. */
  hours: string[] | null;
  faq: FaqItem[];

  theme: Theme;
  seo: Seo;
  compliance: Compliance;
}
