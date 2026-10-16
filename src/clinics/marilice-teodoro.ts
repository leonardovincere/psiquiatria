// src/clinics/marilice-teodoro.ts
// Config da prévia — Dra. Marilice Teodoro, Psiquiatria Integral (Campo Grande/MS)
// Fonte: site atual dela (dramariliceteodoro.com.br, Hostinger Horizons), lido em 16/10/2026.
// Itens marcados com TODO precisam ser confirmados antes de ir ao ar.

import type { ClinicConfig } from "./types";

export const marilice: ClinicConfig = {
  slug: "marilice-teodoro",
  isPreview: true, // ativa noindex + faixa "Prévia criada pela Vincere.AI"
  previewBanner: "Prévia criada pela Vincere.AI para a Dra. Marilice Teodoro",

  // ─── Identidade ─────────────────────────────────────────────
  // Ela atende como profissional, não como clínica: a marca é o nome dela.
  clinic: {
    name: "Dra. Marilice Teodoro",
    fullName: "Dra. Marilice Teodoro — Psiquiatria Integral",
    tagline: "Psiquiatria que olha para a pessoa inteira, não só para os sintomas",
    taglineHighlight: "pessoa inteira", // trecho em itálico no título do topo
    heroEyebrow: "Consultório em Campo Grande · presencial e online",
    city: "Campo Grande",
    state: "MS",
  },

  doctor: {
    name: "Dra. Marilice Teodoro",
    shortName: "Dra. Marilice",
    title: "Médica Psiquiatra",
    crm: null, // TODO: não aparece no site atual nem no Doctoralia. Buscar no portal do CFM. Obrigatório pela CFM 2.336/2023.
    rqe: null, // TODO: idem. Sem RQE, o site não pode dizer "especialista em Psiquiatria".
    // TODO: copiar a URL da foto do hero do site atual (DevTools > imagem > Copy image address). Usar só no preview privado.
    photo: null,
    education: [
      "Medicina — Universidade Federal de Mato Grosso do Sul (2013)",
      "Residência em Clínica Médica — Hospital São Julião, Campo Grande/MS",
      "Residência em Psiquiatria — Secretaria Municipal de Saúde de Campo Grande/MS",
      "Especialização em Psicoterapia — Instituto Brasileiro de Psicologia Clínica (IBPC)",
    ],
    experience: [
      "Professora adjunta na Universidade Estadual de Mato Grosso do Sul (UEMS)",
      "10 anos como médica assistente na rede CAPS da Prefeitura de Campo Grande",
    ],
    // Cursos citados no site dela. Mantidos fora do destaque de propósito: ver nota de compliance no fim.
    complementaryCourses: [
      "Aprimoramento em Medicina Integrativa",
      "Aprimoramento em Medicina Funcional baseada em evidências",
    ],
    // Texto reescrito para o preview a partir do que ela publica. Validar com a médica.
    bio: [
      "Formada pela UFMS, a Dra. Marilice fez duas residências: Clínica Médica e Psiquiatria. A primeira trouxe o hábito de olhar o paciente por inteiro; a segunda, a vocação.",
      "Foram 10 anos atendendo na rede CAPS de Campo Grande e anos ensinando na UEMS. Hoje, no consultório, ela dedica tempo para ouvir cada história, investiga possíveis causas físicas quando necessário e usa medicação na menor dose eficaz, junto com psicoterapia e mudanças de hábito.",
    ],
  },

  // ─── Atendimento ────────────────────────────────────────────
  audience: "Adultos", // TODO: o site não informa. Confirmar se atende adolescentes.
  modalities: {
    presencial: true,
    teleconsulta: true, // O site diz: "Consultas online disponíveis mediante agendamento prévio."
  },
  insurance: {
    acceptsInsurance: false, // TODO: o site não informa. Confirmar.
    note: null,
  },
  payment: null, // TODO

  // O site atual NÃO lista condições tratadas. Lista genérica de psiquiatria geral: confirmar com ela.
  conditions: [
    { name: "Ansiedade", description: "Preocupação constante, tensão e dificuldade de relaxar." },
    { name: "Depressão", description: "Tristeza persistente, desânimo e perda de interesse." },
    { name: "Insônia", description: "Dificuldade para dormir e acordar descansado." },
    { name: "Esgotamento e estresse", description: "Cansaço físico e emocional que não passa com descanso." },
    { name: "Alterações do humor", description: "Oscilações que afetam a rotina e os relacionamentos." },
  ],

  // Os 4 princípios do site dela, mantidos porque são o diferencial real.
  approach: [
    { title: "Escuta atenta", text: "A conversa é o principal instrumento de investigação. Cada detalhe da sua história importa." },
    { title: "Visão integral", text: "Corpo, mente e contexto de vida são avaliados juntos, não separados." },
    { title: "Investigação completa", text: "Quando necessário, exames laboratoriais e de imagem para descartar causas físicas." },
    { title: "Medicação na medida", text: "A menor dose eficaz, sempre dentro de um plano mais amplo de cuidado." },
  ],

  services: [
    { name: "Avaliação inicial", description: "Consulta detalhada sobre sua história, sintomas e contexto de vida." },
    { name: "Acompanhamento", description: "Retornos para ajustar o plano conforme sua evolução." },
    { name: "Consulta online", description: "Atendimento por vídeo, com agendamento prévio." },
  ],
  showPrices: false,

  // O site dela tem 8 etapas. Condensei em 4 para a seção de primeira consulta.
  firstVisitSteps: [
    { title: "Agende pelo WhatsApp", text: "Presencial na Clínica Bella Età ou online." },
    { title: "Avaliação sem pressa", text: "Escuta atenta da sua história, dos sintomas e do seu momento de vida." },
    { title: "Investigação, se necessário", text: "Exames para descartar causas físicas antes de fechar o diagnóstico." },
    { title: "Plano individualizado", text: "Medicação quando indicada, psicoterapia, sono, alimentação e atividade física." },
  ],

  // Números em destaque abaixo do topo (fatos do currículo dela).
  highlights: [
    { value: "2 residências", label: "Clínica Médica e Psiquiatria" },
    { value: "10 anos", label: "na rede CAPS de Campo Grande" },
    { value: "Docente", label: "na Universidade Estadual de MS (UEMS)" },
  ],

  // Layout diferente da Animus: topo em círculo (monograma até chegar a foto) e condições em etiquetas.
  style: {
    hero: "circle",
    conditions: "chips",
  },

  // ─── Prova social ───────────────────────────────────────────
  // Não encontrei perfil no Doctoralia nem avaliações públicas. Seção desligada.
  socialProof: {
    enabled: false,
    label: null,
    rating: null,
    sourceUrl: null,
    highlights: [],
  },

  // ─── Contato e localização ──────────────────────────────────
  contact: {
    whatsapp: "5567999412022",
    whatsappMessage: "Olá! Gostaria de agendar uma consulta com a Dra. Marilice Teodoro.",
    phone: "(67) 99941-2022",
    email: "dramariliceteodoro@gmail.com",
    instagram: null, // TODO: procurar o perfil dela
    facebook: null,
    doctoralia: null,
  },

  address: {
    clinicName: "Clínica Bella Età",
    street: "Rua Coronel Cacildo Arantes, 585",
    complement: null,
    neighborhood: "Chácara Cachoeira",
    city: "Campo Grande",
    state: "MS",
    zip: "79040-452",
    coords: null, // TODO: pegar no Google Maps
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=R.+Cel.+Cacildo+Arantes,+585+-+Ch%C3%A1cara+Cachoeira,+Campo+Grande+-+MS,+79040-452",
  },

  hours: "Segunda a sexta, das 8h às 18h",

  // ─── FAQ ────────────────────────────────────────────────────
  faq: [
    { q: "A consulta pode ser online?", a: "Sim. As consultas online são feitas com agendamento prévio pelo WhatsApp." },
    { q: "Vou sair da consulta tomando remédio?", a: "Não necessariamente. Quando a medicação é indicada, a Dra. Marilice usa a menor dose eficaz, sempre junto com outras frentes de cuidado." },
    { q: "Por que ela pede exames?", a: "Algumas alterações físicas, como deficiências nutricionais ou hormonais, podem afetar o humor e o sono. Os exames ajudam a descartar essas causas." },
    { q: "Preciso levar algo na primeira consulta?", a: "Se tiver, traga exames recentes, receitas e relatórios de tratamentos anteriores." },
    { q: "Onde fica o consultório?", a: "Na Clínica Bella Età, Rua Coronel Cacildo Arantes, 585, Chácara Cachoeira." },
  ],

  // ─── Visual ─────────────────────────────────────────────────
  // Parte do teal que ela já usa (a identidade é dela), mas mais profundo e sóbrio.
  // Diferente da Animus de propósito: as duas são psiquiatras na mesma cidade.
  theme: {
    primary: "#1F5C58",    // verde-azulado profundo (evolução do teal atual dela)
    secondary: "#A9C6BF",  // eucalipto claro
    accent: "#C08A5B",     // terracota suave, para CTAs secundários
    background: "#F6F3EE", // linho
    text: "#1C2B2A",
    fontHeading: "Cormorant Garamond",
    headingWeight: 500, // Cormorant é fina; 500 dá mais presença aos títulos
    fontBody: "Inter",
  },

  // ─── SEO (vale quando sair do modo preview) ─────────────────
  seo: {
    title: "Psiquiatra em Campo Grande — Dra. Marilice Teodoro | Psiquiatria Integral",
    description:
      "Psiquiatria com escuta atenta e visão integral em Campo Grande/MS. Consultas presenciais na Clínica Bella Età e online. Agende pelo WhatsApp.",
    keywords: ["psiquiatra campo grande", "psiquiatra chácara cachoeira", "psiquiatria integral campo grande", "psiquiatra online campo grande"],
  },

  // ─── Compliance (CFM 2.336/2023) ────────────────────────────
  // Atenção: o site atual dela mostra "Ortomolecular" e "Medicina Integrativa/Funcional" em destaque.
  // A prática ortomolecular tem restrições do CFM, e áreas sem RQE não podem ser anunciadas como especialidade.
  // No preview, esses termos ficam fora de títulos e destaques; aparecem só como cursos de aprimoramento, se ela quiser.
  compliance: {
    showCrmRqeEverywhere: true, // rodapé + seção sobre (bloqueado até preencher CRM/RQE)
    noOutcomePromises: true,
    hideNonRecognizedSpecialties: true,
    technicalDirector: null, // TODO: preencher com nome + CRM + RQE
  },
};

export default marilice;
