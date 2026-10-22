// ─────────────────────────────────────────────────────────────────────────────
// MOLDE DE CLIENTE DE PSIQUIATRIA — copie este arquivo para criar uma clínica nova.
//
//   1. Copie para src/clients/<slug>.ts  (ex.: src/clients/serenamente.ts)
//      O nome do arquivo é o slug: só minúsculas, números e hífen.
//      Arquivos que começam com "_" (como este) são ignorados no build.
//   2. Troque `slug` abaixo pelo mesmo nome do arquivo.
//   3. Coloque as imagens em public/clinics/<slug>/ (logo, símbolo, favicon).
//   4. Opcional: fontes recortadas em src/assets/fonts/<slug>/
//      (heading-normal.woff2, heading-italic.woff2, body-normal.woff2).
//      Sem elas, o build baixa as fontes do Google Fonts automaticamente.
//   5. `npm run build` → a página sai em /<slug>
//      e, no ar, em https://<slug>.preview.vincereai.tech
//
// Regras da Resolução CFM nº 2.336/2023 (o build confere e falha se encontrar):
//   - Nada de promessa de cura/resultado, "garantia", "100%", "o melhor…",
//     descontos, "antes e depois" ou depoimentos de pacientes.
//   - CRM e RQE são obrigatórios.
// ─────────────────────────────────────────────────────────────────────────────

import type { ClientConfig } from './types';

const clinica: ClientConfig = {
  specialty: 'psiquiatria', // escolhe o template (src/templates/registry.ts)
  slug: 'nome-da-clinica', // = nome do arquivo
  isPreview: true, // true: noindex + robots bloqueado + faixa de prévia. Só mude para false quando a clínica aprovar.
  previewBanner: 'Prévia criada pela Vincere.AI para a Nome da Clínica', // "Vincere.AI" vira link automaticamente
  // siteUrl: 'https://www.clinica.com.br', // domínio próprio quando sair da prévia (canonical/compartilhamento)

  // ─── Identidade ─────────────────────────────────────────────
  clinic: {
    name: 'Nome', // curto, aparece se não houver logo
    fullName: 'Nome da Clínica — Psiquiatria', // rodapé e SEO
    tagline: 'Atendimento com escuta, tempo e cuidado individual', // título principal do topo
    taglineHighlight: 'tempo', // trecho da tagline em itálico com sublinhado (opcional)
    heroEyebrow: 'Saúde mental em Cidade', // linha pequena acima do título (opcional)
    city: 'Cidade',
    state: 'UF',
    logo: '/clinics/nome-da-clinica/logo-horizontal.webp', // logo horizontal, fundo transparente (opcional)
    logoLight: '/clinics/nome-da-clinica/logo-horizontal-claro.webp', // versão para o rodapé escuro (opcional)
    logoMark: '/clinics/nome-da-clinica/simbolo.svg', // símbolo do logo, usado como ornamento (opcional)
    favicon: '/clinics/nome-da-clinica/favicon.png', // opcional: sem ele, gera um com a cor principal
    appleTouchIcon: '/clinics/nome-da-clinica/apple-touch-icon.png', // 180×180 (opcional)
  },

  doctor: {
    name: 'Dra. Nome Completo', // com "Dra."/"Dr." — define "a"/"o" nos textos
    shortName: 'Dra. Nome',
    title: 'Médica Psiquiatra',
    // article: 'a', // force "a"/"o" se o nome não começar com Dra./Dr.
    crm: 'CRM-UF 000000', // TODO: conferir no portal do CFM
    rqe: 'RQE 00000', // TODO
    photo: null, // URL https ou caminho em /public; sem foto, aparecem as iniciais
    education: ['Residência em Psiquiatria — Instituição (ano)'], // só fatos verificáveis
    bio: [
      // 1º parágrafo vira a citação grande do "Sobre"; os demais, texto normal.
      'Frase principal sobre a médica e a forma de atender.',
      'Complemento curto sobre como são as consultas.',
    ],
  },

  // ─── Atendimento ────────────────────────────────────────────
  audience: 'Adultos',
  modalities: {
    presencial: true, // mostra "Onde estamos" e o mapa
    teleconsulta: true, // mostra a seção de teleconsulta
  },
  insurance: {
    acceptsInsurance: false,
    note: 'Atendimento particular. Emitimos documentação para solicitação de reembolso junto ao seu plano.',
  },
  payment: ['Cartão de crédito', 'Pix'],

  conditions: [
    // O site mostra os nomes; a descrição fica como referência.
    { name: 'Ansiedade', description: 'Preocupação excessiva e dificuldade de relaxar.' },
    { name: 'Depressão', description: 'Tristeza persistente e perda de interesse.' },
  ],

  services: [
    // "Primeira consulta", "acompanhamento" e "teleconsulta" já aparecem nos passos;
    // os demais (ex.: laudos) viram a linha "Também emitimos …".
    { name: 'Primeira consulta', description: 'Avaliação completa.' },
    { name: 'Laudos psiquiátricos', description: 'Laudos para concursos e perícias.', price: null },
  ],
  showPrices: false, // preços em services[].price só aparecem com true

  firstVisitSteps: [
    { title: 'Agende pelo WhatsApp', text: 'Confirmamos o melhor horário para você.' },
    { title: 'Primeira consulta', text: 'Conversamos sobre sua história e seus sintomas.' },
    { title: 'Plano de cuidado', text: 'Diagnóstico explicado e próximos passos claros.' },
    { title: 'Acompanhamento', text: 'Retornos para ajustar o tratamento.' },
  ],

  // Até 3 destaques logo abaixo do topo (opcional). Só fatos; nada de "o melhor".
  highlights: [
    { value: 'Desde 2015', label: 'psiquiatra em Cidade' },
    { value: '120', label: 'avaliações de pacientes no Doctoralia', href: 'https://www.doctoralia.com.br/…' },
    { value: 'Presencial e vídeo', label: 'duas formas de atendimento' },
  ],

  // Só o número agregado com link; depoimentos não são exibidos.
  socialProof: {
    enabled: false,
    label: '120 avaliações de pacientes no Doctoralia',
    rating: 5,
    sourceUrl: 'https://www.doctoralia.com.br/…',
  },

  // ─── Contato e localização ──────────────────────────────────
  contact: {
    whatsapp: '5500000000000', // só dígitos: 55 + DDD + número
    whatsappMessage: 'Olá! Gostaria de agendar uma consulta.',
    phone: null, // ex.: '(11) 3000-0000'
    email: null,
    instagram: null, // URL completa
    facebook: null,
    doctoralia: null,
  },

  address: {
    street: 'Rua Exemplo, 123',
    complement: null, // sala, edifício
    neighborhood: null,
    city: 'Cidade',
    state: 'UF',
    zip: '00000-000',
    coords: null, // { lat: -23.5, lng: -46.6 } — centraliza o mapa
    mapsUrl: null, // link "Abrir no Google Maps"; sem ele, busca pelo endereço
  },

  hours: null, // ex.: ['Segunda a sexta, 8h às 18h']; null não exibe

  // Só o que não está no resto da página.
  faq: [
    { q: 'Atendem crianças e adolescentes?', a: 'Atendemos adultos.' },
    { q: 'Preciso levar algo na primeira consulta?', a: 'Se tiver, traga exames, receitas e relatórios anteriores.' },
  ],

  // ─── Visual ─────────────────────────────────────────────────
  // Cores do logo. O site deriva sozinho os tons de fundo, bordas e texto secundário.
  theme: {
    primary: '#254B74', // botões e destaques (texto branco precisa ter bom contraste)
    secondary: '#D8C7AA', // fundos suaves e bordas
    accent: '#F9B33B', // detalhes decorativos (não é usada em texto)
    background: '#FBF8F3',
    text: '#1C2B3D',
    fontHeading: 'Newsreader', // Google Fonts; precisa ter itálico
    fontBody: 'Figtree',
  },

  // ─── SEO (vale quando isPreview = false) ────────────────────
  seo: {
    title: 'Psiquiatra em Cidade — Dra. Nome | Clínica',
    description: 'Psiquiatria para adultos em Cidade/UF com a Dra. Nome (CRM-UF 000000, RQE 00000). Agende pelo WhatsApp.',
    keywords: ['psiquiatra cidade'],
  },

  // ─── Compliance (CFM 2.336/2023) ────────────────────────────
  compliance: {
    showCrmRqeEverywhere: true, // CRM/RQE também no cartão da foto (Sobre e rodapé sempre mostram)
    noOutcomePromises: true, // liga a checagem automática de termos vedados no build
    technicalDirector: 'Dra. Nome Completo — CRM-UF 000000 / RQE 00000', // obrigatório para clínica (PJ)
  },

  // ─── Layout (opcional) ──────────────────────────────────────
  // Para as prévias não ficarem iguais.
  // style: {
  //   hero: 'circle',      // 'arch' (foto em arco que se abre) | 'circle' (foto/monograma em círculo com anel de texto) | 'cinema' (tela cheia escura)
  //   conditions: 'chips', // 'marquee' (faixas deslizando) | 'chips' (etiquetas fixas)
  //   finish: 'editorial', // 'soft' (arredondado) | 'editorial' (botões retos, seções numeradas, textura, fundo animado) | 'cinema' (cenas escuras, títulos em foco)
  //   intro: true,         // abertura com cortina e monograma/logo (padrão: ligada no 'editorial')
  // },
  // approach: [{ title: 'Escuta atenta', text: '…' }], // vira a seção "Abordagem"
  // research: { enabled: true, heading: '…', title: '…', kind: 'Tese de doutorado', institution: '…', year: 2024, summary: '…', link: null }, // seção "Pesquisa"
  // articles: { enabled: true, heading: '…', intro: '…', items: [{ slug: '…', title: '…', excerpt: '…' }] }, // conteúdo educativo
  // (doctor.experience preenchido liga a seção "Trajetória": formação + experiência)

  // ─── Textos das seções (opcional) ───────────────────────────
  // Todos têm padrão em src/templates/psiquiatria/copy.ts. Sobrescreva só o que precisar.
  // Variáveis: {medico} ("a Dra. Nome"), {titulo}, {cidade}, {uf}, {publico}.
  // copy: {
  //   telehealth: { points: ['Link enviado antes do horário', 'Sigilo e privacidade', 'Receita digital válida'] },
  //   finalCta: { text: 'Fale com a equipe de {medico} pelo WhatsApp.' },
  // },
};

export default clinica;
