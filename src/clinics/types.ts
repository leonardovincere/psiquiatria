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

export interface Modalities {
  presencial: boolean;
  /** Controla a seção de teleconsulta. null = a confirmar (a seção não aparece). */
  teleconsulta: boolean | null;
}

export interface Insurance {
  /** null = a confirmar. */
  acceptsInsurance: boolean | null;
  note: string | null;
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
 * Textos das seções. Todos têm padrão (src/lib/copy.ts); a clínica só
 * sobrescreve o que quiser em `copy`.
 * Variáveis: {medico} ("a Dra. Fulana" / "o Dr. Fulano"), {titulo}, {cidade}, {uf}, {publico}.
 */
export interface SiteCopy {
  scheduleCta: string;
  hero: { eyebrowFallback: string; subtitle: string; link: string; ringText: string };
  approach: { eyebrow: string; title: string };
  journey: { eyebrow: string; title: string; education: string; experience: string };
  about: { eyebrow: string };
  conditions: { title: string; intro: string; note: string };
  firstVisit: { eyebrow: string; title: string; extraPrefix: string; paymentPrefix: string };
  telehealth: { eyebrow: string; title: string; titleEm: string; subtitle: string; points: [string, string, string]; note: string };
  research: { eyebrow: string; link: string };
  myths: { eyebrow: string; title: string; subtitle: string; mythLabel: string; truthLabel: string };
  audiences: { eyebrow: string; title: string };
  articles: { eyebrow: string };
  faq: { title: string };
  location: { title: string; mapButton: string; mapsLink: string };
  finalCta: { title: string; titleEm: string; text: string; callPrefix: string };
  emergencyNotice: string;
  legalNotice: string;
  previewSuffix: string;
  /** Especialidade no schema.org (dados estruturados). Ex.: "Psychiatric". */
  schemaSpecialty: string;
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? (T[K] extends unknown[] ? T[K] : DeepPartial<T[K]>) : T[K] };
export type CopyOverrides = DeepPartial<SiteCopy>;

export interface ClinicConfig {
  /** Identificador e caminho da página (/<slug>, <slug>.preview.vincereai.tech). Igual ao nome do arquivo; minúsculas, números e hífen. */
  slug: string;
  /** Domínio próprio quando o site sair da prévia (canonical/OG). Padrão: https://<slug>.preview.vincereai.tech/ */
  siteUrl?: string | null;
  /** Sobrescreve textos padrão das seções. */
  copy?: CopyOverrides;
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

  conditions: Condition[];
  services: Service[];
  showPrices: boolean;
  firstVisitSteps: Step[];
  /** Princípios da forma de atender (opcional): vira a seção "Abordagem". */
  approach?: ApproachItem[];
  /** Escolhas de layout (opcional). */
  style?: LayoutStyle;

  /** Até 3 números/fatos em destaque abaixo do topo. Sem eles, usa `credentials` ou mostra formação e modalidades. */
  highlights?: Highlight[];
  /** Credenciais em destaque (alternativa a `highlights`, com `note` opcional). */
  credentials?: Credential[];
  /** Mitos e verdades: liga a seção "Mitos" (o mito é riscado e dá lugar à verdade, guiado pela rolagem). */
  myths?: Myth[];
  /** Públicos por fase da vida: liga a seção "Fases da vida" (um cartaz por fase). */
  audiences?: Audience[];
  /** Trabalho acadêmico em destaque: liga a seção "Pesquisa". */
  research?: Research;
  /** Conteúdo educativo: liga a seção de perguntas comuns. */
  articles?: Articles;
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
