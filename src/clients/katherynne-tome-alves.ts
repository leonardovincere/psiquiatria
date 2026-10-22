// src/clients/katherynne-tome-alves.ts
// Prévia — Espaço A Endocrinologia & Metabologia (Dra. Katherynne Keico Tome Alves), Campo Grande/MS
// Fonte: arquivo enviado pelo usuário (dados levantados em fontes públicas, out/2026), adaptado ao molde de endocrinologia.
// Itens marcados com TODO precisam ser confirmados antes de enviar a prévia.
// Copy segue as regras de publicidade médica do CFM: sem promessa de resultado, sem antes/depois, sem preços.

import type { ClientConfig } from './types';

const katherynne: ClientConfig = {
  specialty: 'endocrinologia',
  slug: 'katherynne-tome-alves',
  isPreview: true, // noindex + faixa "Prévia criada pela Vincere.AI"
  previewBanner: 'Prévia criada pela Vincere.AI para o Espaço A Endocrinologia & Metabologia',

  // ─── Identidade ─────────────────────────────────────────────
  clinic: {
    name: 'Espaço A',
    fullName: 'Espaço A · Endocrinologia & Metabologia',
    tagline: 'Cuidado endocrinológico com diagnóstico preciso e acompanhamento de perto',
    taglineHighlight: 'acompanhamento de perto',
    heroEyebrow: 'Endocrinologia & Metabologia · Campo Grande/MS',
    city: 'Campo Grande',
    state: 'MS',
    logo: null,
    logoLight: null,
    favicon: null,
  },

  doctor: {
    name: 'Dra. Katherynne Keico Tome Alves',
    shortName: 'Dra. Katherynne',
    // TODO: sem RQE, o CFM não permite anunciar "Endocrinologista";
    // nesse caso trocar o título para "Médica — Clínica Médica" e ajustar o topo.
    title: 'Médica Endocrinologista',
    crm: 'CRM-MS 8121',
    rqe: null, // TODO: confirmar RQE no portal do CFM
    photo: null, // TODO: sem foto pública; o topo mostra a ficha com o monograma
    education: [
      'Medicina — Universidade Federal de Mato Grosso do Sul (UFMS)',
      'Residência em Clínica Médica — UFMS',
      'Estágio em Endocrinologia e Metabologia — UNIFESP',
    ],
    bio: [
      'Formada em Medicina pela Universidade Federal de Mato Grosso do Sul (UFMS), com residência em Clínica Médica pela mesma instituição.',
      'Complementou a formação com estágio em Endocrinologia e Metabologia na UNIFESP e se dedica ao cuidado de pacientes com alterações hormonais e metabólicas, com foco em diagnóstico preciso e acompanhamento contínuo.',
      // TODO: confirmar com ela a residência/título em Endocrinologia (há registros de aprovação em
      // processo seletivo de endocrinologia em SP e inscrição na prova de título da SBEM em 2022).
    ],
  },

  // ─── Atendimento ────────────────────────────────────────────
  audience: 'Adultos', // TODO: o arquivo não informa o público. Confirmar.
  modalities: {
    presencial: true,
    teleconsulta: null, // TODO: não informado (a seção de teleconsulta fica oculta)
  },
  insurance: {
    acceptsInsurance: true, // TODO: confirmar lista atual de convênios
    plans: ['Unimed'],
    note: 'Também atendemos consultas particulares.',
  },
  payment: null, // TODO

  services: [
    { name: 'Primeira consulta', description: 'Escuta do histórico e dos sintomas, e pedido de exames.' },
    { name: 'Acompanhamento', description: 'Retornos para acompanhar a evolução.' },
  ],
  showPrices: false,

  areas: [
    { name: 'Diabetes', description: 'Diagnóstico, controle glicêmico e prevenção de complicações.', icon: 'drop' },
    { name: 'Tireoide', description: 'Hipotireoidismo, hipertireoidismo e nódulos de tireoide.', icon: 'thyroid' },
    { name: 'Obesidade e metabolismo', description: 'Avaliação metabólica e tratamento clínico individualizado.', icon: 'scale' },
    { name: 'Distúrbios hormonais', description: 'Alterações de suprarrenal, hipófise e outros hormônios.', icon: 'molecule' },
    { name: 'Menopausa', description: 'Avaliação e acompanhamento das alterações hormonais.', icon: 'cycle' },
    { name: 'Saúde óssea', description: 'Prevenção e tratamento da osteoporose.', icon: 'bone' },
  ],

  // Fluxo da consulta do arquivo enviado; o acompanhamento usa as etapas padrão do template.
  care: {
    firstVisit: [
      { title: 'Escuta detalhada', text: 'Conversa sobre o seu histórico e os seus sintomas.' },
      { title: 'Exames', text: 'Solicitação e análise dos exames necessários.' },
      { title: 'Plano individualizado', text: 'Tratamento pensado para o seu caso, com retornos para acompanhar a evolução.' },
    ],
  },

  // Sem bioimpedância no consultório (features.bioimpedance: false no arquivo enviado): seção de exames desligada.

  // Fatos do currículo e do atendimento, sem números inventados.
  highlights: [
    { value: 'UFMS', label: 'Medicina e residência em Clínica Médica' },
    { value: 'UNIFESP', label: 'estágio em Endocrinologia e Metabologia' },
    { value: 'Unimed', label: 'e consultas particulares' }, // TODO: confirmar convênios
  ],

  socialProof: { enabled: false, label: null, rating: null, sourceUrl: null },

  // ─── Contato e localização ──────────────────────────────────
  contact: {
    whatsapp: '5567900000000', // TODO: número fictício — trocar pelo real ao fechar
    whatsappMessage: 'Olá! Gostaria de agendar uma consulta com a Dra. Katherynne.',
    phone: null, // TODO: "(67) 3026-1129" aparece em guia de convênio; confirmar antes de exibir
    email: null,
    instagram: null, // perfil fechado — não exibir
    facebook: null,
    doctoralia: null,
  },

  address: {
    clinicName: 'Espaço A',
    street: 'Rua São Paulo, 806',
    complement: 'Casa 05',
    neighborhood: 'Monte Castelo',
    city: 'Campo Grande',
    state: 'MS',
    zip: '79010-050',
    coords: null,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+S%C3%A3o+Paulo,+806,+Monte+Castelo,+Campo+Grande+-+MS',
  },
  hours: null, // TODO

  faq: [
    { q: 'Atende por convênio?', a: 'Sim, atendemos Unimed e consultas particulares.' }, // TODO: confirmar
    { q: 'Preciso levar exames na primeira consulta?', a: 'Se tiver exames recentes, traga. Caso contrário, serão solicitados conforme a avaliação.' },
    { q: 'Como agendar?', a: 'Pelo WhatsApp, com atendimento da nossa equipe.' },
  ],

  // ─── Visual ─────────────────────────────────────────────────
  // Sem logo/identidade pública. Verde-oliva e mel com serifa (Fraunces): mais acolhedor
  // e diferente do azul + IBM Plex do exemplo do template.
  theme: {
    primary: '#44583A', // verde-oliva profundo
    secondary: '#D5D9C3', // sálvia clara
    accent: '#D29B3C', // mel, só em detalhes
    background: '#F7F6F0',
    text: '#1E241A',
    fontHeading: 'Fraunces',
    fontBody: 'DM Sans',
  },

  // ─── SEO (vale quando sair da prévia) ───────────────────────
  seo: {
    title: 'Endocrinologia em Campo Grande — Dra. Katherynne Tome Alves | Espaço A',
    description:
      'Endocrinologia e Metabologia no Monte Castelo, em Campo Grande/MS, com a Dra. Katherynne Keico Tome Alves (CRM-MS 8121). Agende pelo WhatsApp.',
    keywords: ['endocrinologista campo grande', 'endocrinologia monte castelo', 'tireoide campo grande', 'diabetes campo grande'],
  },

  // ─── Compliance (CFM 2.336/2023) ────────────────────────────
  compliance: {
    showCrmRqeEverywhere: true,
    noOutcomePromises: true,
    hideNonRecognizedSpecialties: true,
    technicalDirector: null, // TODO: se o Espaço A for pessoa jurídica, nome + CRM do diretor técnico
  },

  copy: {
    scheduleCta: 'Agendar consulta pelo WhatsApp',
    hero: { subtitle: 'Atendimento em Endocrinologia e Metabologia no Monte Castelo, em Campo Grande.' },
  },
};

export default katherynne;
