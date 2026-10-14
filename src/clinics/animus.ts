// src/clinics/animus.ts
// Config da prévia — Animus Psiquiatria Avançada (Campo Grande/MS)
// Fontes públicas consultadas em 14/10/2026: Doctoralia e Linktree da Dra. Luciane Cano.
// Itens marcados com TODO precisam ser confirmados com a clínica antes de ir ao ar.

import type { ClinicConfig } from "./types";

export const animus: ClinicConfig = {
  slug: "animus",
  isPreview: true, // ativa noindex + faixa "Prévia criada pela Vincere.AI"
  previewBanner: "Prévia criada pela Vincere.AI para a Animus Psiquiatria Avançada",

  // ─── Identidade ─────────────────────────────────────────────
  clinic: {
    name: "Animus",
    fullName: "Animus — Psiquiatria Avançada",
    tagline: "Psiquiatria com escuta, tempo e cuidado individual",
    taglineHighlight: "tempo", // palavra destacada em itálico no título do hero
    city: "Campo Grande",
    state: "MS",
    logo: "/clinics/animus/logo-horizontal.webp", // recortado do logo dos perfis (logo-original.png)
    logoLight: "/clinics/animus/logo-horizontal-claro.webp", // versão para fundos escuros (rodapé)
    logoMark: "/clinics/animus/lotus.svg", // flor de lótus vetorizada — ornamento do hero, teleconsulta e CTA
    favicon: "/clinics/animus/favicon.png",
    appleTouchIcon: "/clinics/animus/apple-touch-icon.png",
  },

  doctor: {
    name: "Dra. Luciane Cano Martins Silveira",
    shortName: "Dra. Luciane Cano",
    title: "Médica Psiquiatra",
    crm: "CRM-MS 5844",
    rqe: "RQE 4155",
    // Foto pública do Doctoralia — usar só no preview privado. Pedir foto oficial no fechamento.
    photo:
      "https://s3-sa-east-1.amazonaws.com/doctoralia.com.br/doctor/9f90b0/9f90b023fc8f2cc4c6cd9a361d6afde7_large.jpg",
    education: [
      "Residência e título de especialista em Psiquiatria — Santa Casa de Campo Grande/MS (2012)",
    ],
    // Texto escrito para o preview (não copiado de nenhuma fonte). Validar com a médica.
    bio: [
      "Psiquiatra em Campo Grande desde 2012, a Dra. Luciane Cano atende adultos com foco em uma avaliação cuidadosa e em um plano de tratamento construído junto com o paciente.",
      "As consultas têm tempo para ouvir a história de cada pessoa, explicar o diagnóstico com clareza e acompanhar a evolução de perto.",
    ],
  },

  // ─── Atendimento ────────────────────────────────────────────
  audience: "Adultos",
  modalities: {
    presencial: true,
    teleconsulta: true, // TODO: Doctoralia lista telemedicina, mas o FAQ de lá diz que não. Confirmar.
  },
  insurance: {
    acceptsInsurance: false,
    note: "Atendimento particular. Emitimos documentação para solicitação de reembolso junto ao seu plano.", // TODO: confirmar se emite recibo para reembolso
  },
  payment: ["Cartão de crédito", "Transferência bancária"], // TODO: confirmar Pix

  conditions: [
    { name: "Ansiedade", description: "Preocupação excessiva, tensão constante e dificuldade de relaxar." },
    { name: "Depressão", description: "Tristeza persistente, perda de interesse e cansaço que não passa." },
    { name: "Síndrome do pânico", description: "Crises súbitas de medo intenso com sintomas físicos." },
    { name: "Insônia", description: "Dificuldade para iniciar ou manter o sono e acordar descansado." },
    { name: "Alterações do humor", description: "Oscilações de humor que afetam a rotina e os relacionamentos." },
    { name: "Estresse", description: "Esgotamento físico e emocional ligado ao trabalho e à rotina." },
    { name: "Demência", description: "Avaliação e acompanhamento de alterações de memória e cognição." },
  ],

  services: [
    { name: "Primeira consulta", description: "Avaliação completa, com tempo para entender sua história e definir o plano de cuidado." },
    { name: "Consultas de acompanhamento", description: "Retornos para ajustar o tratamento e acompanhar sua evolução." },
    { name: "Teleconsulta", description: "Atendimento por vídeo, com prescrição digital válida." },
    { name: "Laudos psiquiátricos", description: "Laudo pericial e laudo de sanidade mental para concursos." },
  ],
  // Preços existem no Doctoralia (1ª consulta a partir de R$ 2.800; consulta R$ 1.200; laudos R$ 1.000).
  // Mantidos fora do site por padrão — decisão da clínica.
  showPrices: false,

  firstVisitSteps: [
    { title: "Agende pelo WhatsApp", text: "Nossa equipe confirma o melhor horário para você." },
    { title: "Primeira consulta", text: "Uma conversa sem pressa para entender seus sintomas e sua história." },
    { title: "Plano de cuidado", text: "Você sai com o diagnóstico explicado e os próximos passos claros." },
    { title: "Acompanhamento", text: "Retornos para ajustar o tratamento conforme sua evolução." },
  ],

  // ─── Prova social ───────────────────────────────────────────
  // Não reproduzir depoimentos de pacientes no preview. Mostrar só o número agregado com link para a fonte.
  socialProof: {
    enabled: true,
    label: "148 avaliações de pacientes no Doctoralia",
    rating: 5,
    sourceUrl:
      "https://www.doctoralia.com.br/luciane-cano-martins-silveira/psiquiatra/campo-grande#&tab=profile-reviews",
    highlights: ["Atenção durante a consulta", "Explicações detalhadas", "Consultório acolhedor"],
  },

  // ─── Contato e localização ──────────────────────────────────
  contact: {
    whatsapp: "5567999158100",
    whatsappMessage: "Olá! Gostaria de agendar uma consulta com a Dra. Luciane Cano.",
    phone: "(67) 3029-5656",
    email: null, // TODO
    instagram: "https://www.instagram.com/animuspsiquiatria/",
    facebook: "https://www.facebook.com/psiquiatraluciane/",
    doctoralia: "https://www.doctoralia.com.br/luciane-cano-martins-silveira/psiquiatra/campo-grande",
  },

  address: {
    street: "Rua Alagoas, 396",
    complement: "Edifício Atrium — esquina com a Rua Euclides da Cunha",
    neighborhood: "Jardim dos Estados", // TODO: confirmar bairro
    city: "Campo Grande",
    state: "MS",
    zip: "79020-120",
    coords: { lat: -20.4697113, lng: -54.620121 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=-20.4697113,-54.620121",
  },

  hours: null, // TODO: pedir horário de atendimento

  // ─── FAQ ────────────────────────────────────────────────────
  faq: [
    { q: "Vocês atendem por convênio?", a: "O atendimento é particular. Fale com a gente pelo WhatsApp sobre documentação para reembolso." },
    { q: "Atendem crianças e adolescentes?", a: "A Dra. Luciane atende adultos." },
    { q: "Como funciona a teleconsulta?", a: "Você recebe o link da videochamada antes do horário e pode participar pelo celular ou computador. A receita é enviada digitalmente." },
    { q: "Preciso levar algo na primeira consulta?", a: "Se tiver, traga exames, receitas e relatórios de tratamentos anteriores." },
    { q: "Como agendar?", a: "Pelo WhatsApp ou pelo telefone (67) 3029-5656." },
  ],

  // ─── Visual ─────────────────────────────────────────────────
  // Paleta extraída do logo da Animus (azul do nome + âmbar da flor de lótus).
  theme: {
    primary: "#254B74",    // azul do logo — botões e destaques
    secondary: "#D8C7AA",  // areia — fundos suaves e bordas (direção "Lótus editorial")
    accent: "#F9B33B",     // âmbar da flor de lótus — detalhes decorativos (não usar em texto)
    background: "#FBF8F3", // off-white quente, combina com o âmbar
    text: "#1C2B3D",       // azul quase preto
    fontHeading: "Newsreader",
    fontBody: "Figtree",
  },

  // ─── SEO (vale quando sair do modo preview) ─────────────────
  seo: {
    title: "Psiquiatra em Campo Grande — Dra. Luciane Cano | Animus",
    description:
      "Psiquiatria para adultos em Campo Grande/MS com a Dra. Luciane Cano (CRM-MS 5844, RQE 4155). Consultas presenciais e por vídeo. Agende pelo WhatsApp.",
    keywords: ["psiquiatra campo grande", "psiquiatra campo grande ms", "tratamento ansiedade campo grande", "teleconsulta psiquiatra"],
  },

  // ─── Compliance (CFM 2.336/2023) ────────────────────────────
  compliance: {
    showCrmRqeEverywhere: true, // rodapé + seção sobre
    noOutcomePromises: true,
    technicalDirector: "Dra. Luciane Cano Martins Silveira — CRM-MS 5844 / RQE 4155", // TODO: confirmar diretor técnico da clínica
  },
};

export default animus;
