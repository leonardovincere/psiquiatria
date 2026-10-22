// ─────────────────────────────────────────────────────────────────────────────
// MOLDE DE CLIENTE DE ENDOCRINOLOGIA — copie este arquivo para criar um cliente novo.
//
//   1. Copie para src/clients/<slug>.ts  (ex.: src/clients/dra-ana-souza.ts)
//      O nome do arquivo é o slug: só minúsculas, números e hífen.
//      Arquivos que começam com "_" (como este) são ignorados no build.
//   2. Troque `slug` abaixo pelo mesmo nome do arquivo.
//   3. Imagens em public/clinics/<slug>/ (logo, foto, favicon).
//   4. Fontes recortadas em src/assets/fonts/<slug>/ (veja o CLAUDE.md).
//   5. `npm run routes` e `npm run build` → a página sai em /<slug>
//      e, no ar, em https://<slug>.preview.vincereai.tech
//
// Publicidade médica (Resoluções CFM nº 2.336/2023 e nº 2.333/2023), o build confere:
//   - Nada de promessa de resultado ("perca 10 kg", "emagrecimento rápido"),
//     "garantia", "100%", "o melhor…", preços, descontos, "antes e depois",
//     depoimentos de pacientes ou terapias hormonais com fim estético.
//   - CRM e RQE são obrigatórios para publicar.
//   - Nunca invente dados: o que faltar vira null com comentário // TODO.
// ─────────────────────────────────────────────────────────────────────────────

import type { ClientConfig } from './types';

const cliente: ClientConfig = {
  specialty: 'endocrinologia', // escolhe o template (src/templates/registry.ts)
  slug: 'nome-do-cliente', // = nome do arquivo
  isPreview: true, // true: noindex + robots bloqueado + faixa de prévia. Só mude para false quando o cliente aprovar.
  previewBanner: 'Prévia criada pela Vincere.AI para a Dra. Nome', // "Vincere.AI" vira link automaticamente
  // siteUrl: 'https://www.clinica.com.br', // domínio próprio quando sair da prévia

  // ─── Identidade ─────────────────────────────────────────────
  clinic: {
    name: 'Dra. Nome', // curto, aparece se não houver logo
    fullName: 'Dra. Nome Completo · Endocrinologia', // rodapé e SEO
    tagline: 'Endocrinologia com diagnóstico preciso e acompanhamento contínuo.', // título do topo
    taglineHighlight: 'acompanhamento contínuo', // trecho da tagline em destaque (opcional)
    // heroEyebrow: 'Endocrinologia e Metabologia · Cidade/UF', // linha acima do título (opcional)
    city: 'Cidade',
    state: 'UF',
    logo: null, // '/clinics/<slug>/logo.webp' (opcional)
    logoLight: null, // versão para o rodapé escuro (opcional)
    favicon: null, // sem ele, gera um com a cor principal
  },

  doctor: {
    name: 'Dra. Nome Completo', // com "Dra."/"Dr." — define "a"/"o" nos textos
    shortName: 'Dra. Nome',
    title: 'Médica Endocrinologista',
    crm: null, // TODO: conferir no portal do CFM (ex.: 'CRM-SP 123456')
    rqe: null, // TODO: RQE de Endocrinologia e Metabologia
    photo: null, // foto vertical 4:5; sem foto, o topo mostra uma ficha com o monograma
    education: ['Residência em Endocrinologia e Metabologia — Instituição'], // só fatos verificáveis
    bio: [
      // 1º parágrafo vira o destaque do "Sobre"; os demais, texto normal.
      'Frase principal sobre a forma de conduzir diagnóstico e acompanhamento.',
      'Complemento curto sobre o público atendido e como são as consultas.',
    ],
  },

  // ─── Atendimento ────────────────────────────────────────────
  audience: 'Adultos',
  modalities: {
    presencial: true, // mostra "Localização e convênios" e o mapa
    teleconsulta: null, // true mostra a seção de teleconsulta; null = a confirmar
  },
  insurance: {
    acceptsInsurance: null, // true: lista `plans`; false: "Atendimento particular"; null: "em confirmação"
    plans: [], // ex.: ['Unimed', 'Bradesco Saúde']
    note: null,
  },
  payment: null, // ex.: ['Pix', 'Cartão']

  services: [{ name: 'Primeira consulta', description: 'Avaliação completa e pedido de exames.' }],
  showPrices: false, // este template nunca mostra preços

  // Opcional: sem `areas`, valem as seis do template (diabetes, tireoide, obesidade,
  // distúrbios hormonais, menopausa/andropausa, osteoporose). Ícones: ver src/templates/endocrinologia/icons.ts.
  // areas: [{ name: 'Diabetes', description: '…', icon: 'drop' }],

  // Opcional: etapas da primeira consulta e do acompanhamento (sem elas, valem as do template).
  // care: { firstVisit: [{ title: '…', text: '…' }], followUp: [{ title: '…', text: '…' }] },

  // Opcional: seção "Exames e bioimpedância". Só o que o consultório de fato faz.
  // exams: {
  //   enabled: true,
  //   bioimpedance: true,
  //   items: [{ name: 'Ultrassonografia de tireoide', description: '…' }],
  // },

  // Até 3 destaques logo abaixo do topo (opcional). Só fatos; nada de "o melhor".
  // highlights: [{ value: 'Desde 2015', label: 'endocrinologista em Cidade' }],

  // Só o número agregado com link; depoimentos não são exibidos.
  socialProof: { enabled: false, label: null, rating: null, sourceUrl: null },

  // ─── Contato e localização ──────────────────────────────────
  contact: {
    whatsapp: '5500000000000', // TODO: só dígitos, 55 + DDD + número
    whatsappMessage: 'Olá! Gostaria de agendar uma consulta.',
    phone: null,
    email: null,
    instagram: null,
    facebook: null,
    doctoralia: null,
  },

  address: {
    clinicName: null, // quando atende dentro de outra clínica
    street: 'Rua Exemplo, 123', // TODO
    complement: null,
    neighborhood: null,
    city: 'Cidade',
    state: 'UF',
    zip: null,
    coords: null,
    mapsUrl: null,
  },
  hours: null, // ex.: ['Segunda a sexta, 8h às 18h']; null não exibe

  faq: [
    { q: 'Preciso levar exames na primeira consulta?', a: 'Se tiver exames recentes, leve. Eles ajudam a entender a evolução.' },
    { q: 'Com que frequência são os retornos?', a: 'Depende da condição e da fase do tratamento; o intervalo é definido na consulta.' },
  ],

  // ─── Visual ─────────────────────────────────────────────────
  // Paleta padrão do template (src/templates/endocrinologia/theme.ts). Ajuste às cores do logo.
  theme: {
    primary: '#1E56A0',
    secondary: '#C9D3DE',
    accent: '#3BA3C7',
    background: '#F5F7F9',
    text: '#14202B',
    fontHeading: 'IBM Plex Sans', // precisa ter itálico
    headingWeight: 500,
    fontBody: 'IBM Plex Sans',
  },

  // ─── SEO (vale quando isPreview = false) ────────────────────
  seo: {
    title: 'Endocrinologista em Cidade — Dra. Nome',
    description: 'Endocrinologia em Cidade/UF: diabetes, tireoide, obesidade e distúrbios hormonais, com acompanhamento contínuo.',
    keywords: ['endocrinologista cidade'],
  },

  // ─── Compliance (CFM 2.336/2023) ────────────────────────────
  compliance: {
    showCrmRqeEverywhere: true,
    noOutcomePromises: true, // liga a checagem automática de termos vedados no build
    hideNonRecognizedSpecialties: true, // barra "ortomolecular", "medicina integrativa/funcional"…
    technicalDirector: null, // obrigatório para clínica (PJ): 'Dra. Nome — CRM-UF 000000 / RQE 00000'
  },

  // ─── Textos das seções (opcional) ───────────────────────────
  // Todos têm padrão em src/templates/endocrinologia/copy.ts. Sobrescreva só o que precisar.
  // Variáveis: {medico} ("a Dra. Nome"), {titulo}, {cidade}, {uf}, {publico}.
  // copy: {
  //   finalCta: { text: 'Tire suas dúvidas com {medico} pelo WhatsApp.' },
  // },
};

export default cliente;
