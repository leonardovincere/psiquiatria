// Cliente de EXEMPLO do template de endocrinologia. Todos os dados são fictícios
// (nome, endereço, convênios, WhatsApp): servem só para demonstrar o template.
// Para um cliente real, copie src/clients/_template-endocrinologia.ts.

import type { ClientConfig } from './types';

const exemplo: ClientConfig = {
  specialty: 'endocrinologia',
  slug: 'exemplo-endocrino',
  isPreview: true, // noindex + robots bloqueado + faixa de prévia
  previewBanner: 'Prévia de exemplo criada pela Vincere.AI · dados fictícios',

  clinic: {
    name: 'Dra. Clara Exemplo',
    fullName: 'Dra. Clara Exemplo · Endocrinologia',
    tagline: 'Endocrinologia com diagnóstico preciso e acompanhamento contínuo.',
    taglineHighlight: 'acompanhamento contínuo',
    city: 'São Paulo',
    state: 'SP',
  },

  doctor: {
    name: 'Dra. Clara Exemplo',
    shortName: 'Dra. Clara',
    title: 'Médica Endocrinologista',
    crm: null, // fictício: a página mostra "em confirmação"
    rqe: null,
    photo: null, // sem foto, o topo mostra a ficha com o monograma
    education: [
      'Medicina pela Universidade Exemplo',
      'Residência em Endocrinologia e Metabologia no Hospital Exemplo',
    ],
    bio: [
      'Cada decisão parte da história clínica, do exame físico e dos exames, e é revista a cada retorno.',
      'Atendo adultos e adolescentes com diabetes, doenças da tireoide, obesidade e outras alterações hormonais, com consultas de seguimento em intervalos definidos para cada caso.',
      'Na primeira consulta, explico as hipóteses, os exames pedidos e o que será avaliado no retorno.',
    ],
  },

  audience: 'Adultos e adolescentes',
  modalities: { presencial: true, teleconsulta: true },
  insurance: {
    acceptsInsurance: true,
    plans: ['Convênio Exemplo A', 'Convênio Exemplo B', 'Convênio Exemplo C'],
    note: 'Confirme a cobertura do seu plano ao agendar.',
  },
  payment: ['Pix', 'Cartão'],

  services: [
    { name: 'Primeira consulta', description: 'Avaliação completa e pedido de exames.' },
    { name: 'Retorno', description: 'Avaliação dos exames e ajuste do tratamento.' },
  ],
  showPrices: false,

  exams: {
    enabled: true,
    bioimpedance: true,
    items: [
      { name: 'Glicemia capilar', description: 'Medida rápida da glicose na própria consulta, útil no acompanhamento do diabetes.' },
      { name: 'Ultrassonografia de tireoide', description: 'Feita no consultório quando indicada, para avaliar nódulos e o volume da glândula.' },
      { name: 'Revisão de exames anteriores', description: 'Leve seus resultados: comparar exames ao longo do tempo orienta o tratamento.' },
    ],
  },

  socialProof: { enabled: false, label: null, rating: null, sourceUrl: null },

  contact: {
    whatsapp: '5511900000000', // fictício
    whatsappMessage: 'Olá! Gostaria de agendar uma consulta com a Dra. Clara.',
    phone: null,
    email: null,
    instagram: null,
    facebook: null,
    doctoralia: null,
  },

  address: {
    clinicName: 'Centro Médico Exemplo',
    street: 'Rua Exemplo, 123',
    complement: 'Sala 45',
    neighborhood: 'Bairro Exemplo',
    city: 'São Paulo',
    state: 'SP',
    zip: null,
    coords: null,
    mapsUrl: null,
  },
  hours: ['Segunda a sexta, das 8h às 18h'],

  faq: [
    { q: 'Preciso levar exames na primeira consulta?', a: 'Se tiver exames recentes, leve. Eles ajudam a entender a evolução e podem evitar a repetição de pedidos.' },
    { q: 'Com que frequência são os retornos?', a: 'Depende da condição e da fase do tratamento. O intervalo é definido na consulta e revisto a cada retorno.' },
    { q: 'O que é a bioimpedância?', a: 'Um exame rápido e não invasivo que estima a composição corporal. Para ele, venha sem ter feito atividade física intensa no dia.' },
    { q: 'Posso fazer o acompanhamento por teleconsulta?', a: 'Retornos e avaliação de exames podem ser feitos por vídeo quando o quadro permite. A primeira consulta é presencial.' },
    { q: 'Atende convênio?', a: 'Sim, os convênios atendidos estão listados abaixo. Confirme a cobertura do seu plano ao agendar.' },
  ],

  // Paleta padrão do template (src/templates/endocrinologia/theme.ts).
  theme: {
    primary: '#1E56A0',
    secondary: '#C9D3DE',
    accent: '#3BA3C7',
    background: '#F5F7F9',
    text: '#14202B',
    fontHeading: 'IBM Plex Sans',
    headingWeight: 500,
    fontBody: 'IBM Plex Sans',
  },

  seo: {
    title: 'Endocrinologista em São Paulo — Dra. Clara Exemplo',
    description: 'Endocrinologia em São Paulo: diabetes, tireoide, obesidade e distúrbios hormonais, com acompanhamento contínuo.',
    keywords: ['endocrinologista', 'São Paulo', 'diabetes', 'tireoide'],
  },

  compliance: {
    showCrmRqeEverywhere: true,
    noOutcomePromises: true,
    hideNonRecognizedSpecialties: true,
    technicalDirector: null,
  },
};

export default exemplo;
