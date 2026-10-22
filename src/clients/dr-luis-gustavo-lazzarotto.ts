// src/clients/dr-luis-gustavo-lazzarotto.ts
// Config da prévia — Dr. Luís Gustavo Lazzarotto, Psiquiatra (Campo Grande/MS)
// Fonte: briefing da Vincere.AI a partir do Instagram @drluisgustavopsiquiatra (out/2026; 95 posts, ~8 mil seguidores).
// O briefing original tinha estrutura própria ("cenas"); aqui ele foi mapeado para o ClientConfig.
// A direção de cada cena ficou resumida em designNotes. Itens com TODO precisam ser confirmados antes de ir ao ar.

import type { ClientConfig } from "./types";

export const drLuisGustavo: ClientConfig = {
  specialty: "psiquiatria",
  slug: "dr-luis-gustavo-lazzarotto",
  isPreview: true, // ativa noindex + faixa "Prévia criada pela Vincere.AI"
  previewBanner: "Prévia criada pela Vincere.AI para o Dr. Luís Gustavo Lazzarotto",

  // ─── Identidade ─────────────────────────────────────────────
  // A marca é o nome dele, com logo dourado em espiral. TODO: pedir o logo vetorizado (SVG) e usar em logoMark/logo.
  clinic: {
    name: "Dr. Luís Gustavo",
    fullName: "Dr. Luís Gustavo Lazzarotto — Psiquiatra",
    tagline: "A mente também merece cuidado especializado.",
    taglineHighlight: "cuidado especializado", // em itálico dourado no título do topo
    heroEyebrow: "Psiquiatria · Campo Grande · Todo o Brasil",
    city: "Campo Grande",
    state: "MS",
  },

  doctor: {
    name: "Dr. Luís Gustavo Lazzarotto",
    shortName: "Dr. Luís Gustavo",
    title: "Psiquiatra",
    crm: "CRM-MS 7692",
    rqe: "RQE 5589 · RQE 9231",
    // TODO: foto profissional em alta (a de terno do perfil do Instagram). O topo "neural" funciona sem foto.
    photo: null,
    // TODO: faculdade, residência e área de atuação de cada RQE. O briefing não traz a formação; não inventar.
    education: [],
    // Texto escrito para a prévia a partir do tom dele no Instagram. Validar com o médico.
    bio: [
      "Cada pessoa chega com uma história. Meu trabalho começa por ela: entender o contexto, a família e a rotina, e só então construir, junto com você, um caminho de tratamento.",
      "O Dr. Luís Gustavo atende crianças, adolescentes e adultos em Campo Grande e, por teleconsulta, adultos e adolescentes de todo o Brasil.",
      "Preceptor de residentes e acadêmicos, gosta de ensinar psiquiatria e de explicar cada diagnóstico sem jargão. Fora do consultório, o lápis e o papel continuam sendo a forma dele de pensar com calma.",
    ],
  },

  // ─── Em destaque (sem números inventados) ───────────────────
  highlights: [
    { value: "3 fases", label: "infância, adolescência e vida adulta" },
    { value: "Online", label: "teleconsulta para todo o Brasil", note: "Adultos e adolescentes" },
    { value: "Preceptor", label: "de residentes e acadêmicos" },
  ],

  // ─── Seção de mitos (releitura do destaque "Para quem é o Psiquiatra?") ──
  myths: [
    { myth: "Psiquiatra é só para casos graves.", truth: "É para qualquer pessoa que sofre e quer viver melhor." },
    { myth: "Remédio psiquiátrico sempre vicia.", truth: "A maioria não causa dependência e é usada com acompanhamento." },
    { myth: "Criança não tem depressão.", truth: "Tem. E quanto antes for cuidada, melhor." },
    { myth: "Vou ficar dopado.", truth: "O objetivo é o contrário: você mais presente na própria vida." },
  ],

  // ─── Públicos por fase da vida ──────────────────────────────
  audiences: [
    {
      label: "Crianças",
      text: "Avaliação cuidadosa do desenvolvimento, do comportamento e da aprendizagem, sempre com a família por perto.",
      highlights: ["TDAH", "TEA (autismo)", "Ansiedade infantil", "Dificuldades escolares"],
    },
    {
      label: "Adolescentes",
      text: "Uma fase de muitas mudanças. Escuta sem julgamento e um plano que respeita o momento do jovem.",
      highlights: ["Depressão", "Ansiedade", "Autolesão e crises", "Uso de telas e substâncias"],
    },
    {
      label: "Adultos",
      text: "Tratamento baseado em evidências para retomar o equilíbrio no trabalho, nas relações e na rotina.",
      highlights: ["Depressão", "Ansiedade e pânico", "Burnout", "Transtorno bipolar"],
    },
  ],

  // ─── Atendimento ────────────────────────────────────────────
  audience: "Crianças, adolescentes e adultos",
  modalities: {
    presencial: true,
    teleconsulta: true, // Teleatendimento para adultos e adolescentes (todo o Brasil) a partir de 2026
  },
  insurance: {
    acceptsInsurance: null, // TODO: o briefing só diz "consulte pelo WhatsApp"
    note: null,
  },
  payment: null, // TODO

  // TODO: validar a lista com o doutor.
  conditions: [
    { name: "Depressão", description: "Tristeza persistente, desânimo e perda de interesse pelo que antes fazia sentido." },
    { name: "Ansiedade", description: "Preocupação constante, tensão e dificuldade de desligar a mente." },
    { name: "Síndrome do pânico", description: "Crises súbitas de medo intenso, com sintomas físicos fortes." },
    { name: "TDAH", description: "Desatenção, inquietação e impulsividade que atrapalham a escola, o trabalho e as relações." },
    { name: "Transtorno do Espectro Autista", description: "Diferenças na comunicação, na interação social e no comportamento, em qualquer idade." },
    { name: "Transtorno bipolar", description: "Oscilações de humor entre fases de euforia ou irritação e fases de depressão." },
    { name: "Burnout", description: "Esgotamento físico e emocional ligado ao trabalho." },
    { name: "Insônia", description: "Dificuldade para dormir e acordar descansado." },
    { name: "TOC", description: "Pensamentos intrusivos e rituais repetitivos difíceis de controlar." },
    { name: "Dificuldades de aprendizagem", description: "Quando o rendimento escolar não acompanha o esforço da criança." },
    { name: "Transtornos alimentares", description: "Relação difícil com a comida, o peso e a imagem do corpo." },
    { name: "Dependência química", description: "Tratamento e prevenção de recaída, com apoio à família." },
  ],

  services: [
    { name: "Primeira consulta", description: "Uma conversa longa e sem pressa para entender sua história." },
    { name: "Acompanhamento", description: "Retornos periódicos para ajustar o tratamento." },
    { name: "Teleconsulta", description: "Para adultos e adolescentes de todo o Brasil." },
  ],
  showPrices: false,

  firstVisitSteps: [
    { title: "Contato", text: "Você agenda pelo WhatsApp, presencial ou online." },
    {
      title: "Primeira consulta",
      text: "Uma conversa longa e sem pressa para entender sua história, com a família junto no caso de crianças e adolescentes.",
    },
    { title: "Plano de cuidado", text: "Diagnóstico explicado com clareza e um plano construído junto com você." },
    { title: "Acompanhamento", text: "Retornos periódicos para ajustar o tratamento e acompanhar sua evolução." },
  ],

  // "Por trás do jaleco" e a personalidade observada viram os princípios da Abordagem.
  approach: [
    { title: "Escutar antes de prescrever", text: "A consulta começa pela sua história, e não pela receita." },
    { title: "Explicar sem jargão", text: "Professor de residentes, ele explica o diagnóstico e cada escolha do tratamento com clareza." },
    { title: "A família por perto", text: "Com crianças e adolescentes, pais e escola fazem parte do cuidado." },
    { title: "Sem estigma", text: "Procurar um psiquiatra é cuidar da saúde, como qualquer outra consulta médica." },
  ],

  // ─── Prova social ───────────────────────────────────────────
  // Sem nota agregada de Doctoralia/Google no briefing. Depoimentos de pacientes nunca (CFM 2.336/2023).
  socialProof: {
    enabled: false,
    label: null,
    rating: null,
    sourceUrl: null,
    highlights: [],
  },

  // ─── Contato e localização ──────────────────────────────────
  contact: {
    whatsapp: "5567900000000", // TODO: número real (o briefing traz um número provisório)
    whatsappMessage: "Olá, Dr. Luís Gustavo! Gostaria de agendar uma consulta.",
    phone: null, // TODO: o briefing traz "(67) 0000-0000", provisório
    email: null, // TODO: o briefing sugere contato@drluisgustavo.com.br, a confirmar
    instagram: "https://www.instagram.com/drluisgustavopsiquiatra/",
    facebook: null,
    doctoralia: null,
  },

  address: {
    clinicName: null,
    street: "Rua Dr. Michel Scaff, 305",
    complement: "Sala 02",
    neighborhood: "Chácara Cachoeira",
    city: "Campo Grande",
    state: "MS",
    zip: null, // TODO: confirmar CEP (o briefing sugere 79040-860)
    coords: null, // TODO: pegar no Google Maps
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rua+Dr.+Michel+Scaff,+305,+Ch%C3%A1cara+Cachoeira,+Campo+Grande+-+MS",
  },

  hours: null, // TODO: o briefing sugere "Segunda a sexta, com hora marcada", a confirmar

  // ─── FAQ ────────────────────────────────────────────────────
  faq: [
    {
      q: "Qual a diferença entre psiquiatra e psicólogo?",
      a: "O psiquiatra é médico: faz diagnóstico, pode prescrever medicamentos e solicitar exames. O psicólogo conduz a psicoterapia. Muitas vezes os dois trabalham juntos.",
    },
    {
      q: "Meu filho precisa de psiquiatra?",
      a: "Mudanças persistentes de comportamento, humor, sono, alimentação ou rendimento escolar merecem avaliação. A consulta ajuda a entender o que está acontecendo.",
    },
    {
      q: "A consulta online funciona?",
      a: "Sim. O teleatendimento para adultos e adolescentes segue as normas do CFM e mantém a mesma qualidade de escuta.",
    },
    { q: "Atende por convênio?", a: "Consulte pelo WhatsApp as formas de atendimento e a possibilidade de reembolso." }, // TODO
    {
      q: "Vou precisar tomar remédio para sempre?",
      a: "Não necessariamente. Cada tratamento é individual e revisto ao longo do acompanhamento.",
    },
  ],

  // ─── Textos das seções ──────────────────────────────────────
  copy: {
    scheduleCta: "Agendar consulta",
    hero: {
      subtitle: "Dr. Luís Gustavo Lazzarotto, psiquiatra de crianças, adolescentes e adultos.",
      link: "Consulta online",
    },
    approach: { eyebrow: "Por trás do jaleco", title: "Médico, professor e alguém que ainda desenha a lápis." },
    about: { eyebrow: "Escutar antes de prescrever" },
    audiences: { title: "Do primeiro sinal na infância à vida adulta." },
    conditions: {
      title: "Sintomas têm nome. E têm tratamento.",
      intro: "Não encontrou o que está sentindo? Mande uma mensagem e conversamos sobre o seu caso.",
    },
    firstVisit: { eyebrow: "Como funciona", title: "Um processo claro, do primeiro contato ao acompanhamento." },
    telehealth: {
      eyebrow: "Novo",
      title: "Atendimento de qualquer lugar",
      titleEm: "do Brasil.",
      subtitle: "Teleconsulta para adultos e adolescentes, com a mesma escuta e o mesmo cuidado do consultório.",
    },
    faq: { title: "Perguntas que muita gente tem vergonha de fazer." },
    location: { title: "O consultório" },
    finalCta: {
      title: "O primeiro passo",
      titleEm: "pode ser hoje.",
      text: "Agende sua consulta presencial ou online com {medico} pelo WhatsApp.",
    },
  },

  // ─── Visual ─────────────────────────────────────────────────
  // Paleta do feed dele: noite azulada, azul-marinho, índigo das sinapses e o dourado do logo.
  // Diferente das outras três (fundos claros): aqui o site inteiro é uma cena noturna.
  theme: {
    primary: "#C9A45C",    // dourado do logo: botões, destaques, pulsos da rede neural
    secondary: "#2B4FD8",  // azul das sinapses: brilho da rede e das seções
    accent: "#E7CF96",     // dourado claro
    background: "#05071A", // noite (quase preto azulado)
    text: "#F4EFE6",       // marfim
    fontHeading: "Cormorant Garamond",
    headingWeight: 500,
    fontBody: "Inter",
  },

  // Layout: rede neural no topo (nova), o filme inteiro à noite (acabamento "noir", novo),
  // mitos riscados pela rolagem e cartazes por fase da vida (seções novas, ligadas por myths/audiences).
  // Diferente do Dr. Leonardo Fabrício (cinema claro com cenas escuras) e das demais.
  style: {
    hero: "neural",
    conditions: "marquee", // no acabamento "noir", letreiro em serifa
    finish: "noir",
    intro: true,
  },

  designNotes: {
    concept: "Cinematográfico e noturno: a mente como uma rede que acende. Dourado do logo como luz, azul das sinapses como atmosfera.",
    hero: "Tela preta, a rede neural acende sinapse a sinapse; o monograma é desenhado em traço; título palavra por palavra entrando em foco; letterbox que se abre ao rolar e a câmera atravessa a rede.",
    signatureSection: "Mitos riscados em sequência e substituídos pela verdade em dourado, guiados pela rolagem (releitura do destaque 'Para quem é o Psiquiatra?').",
    motion: "Cartazes de filme por fase da vida; primeira consulta ligada por um fio dourado que se desenha como uma sinapse; fechamento com a rede de volta, como créditos finais.",
    avoid: ["promessas de cura", "linguagem alarmista", "jargão sem explicação", "depoimentos de pacientes"],
  },

  // ─── SEO (vale quando sair do modo preview) ─────────────────
  seo: {
    title: "Dr. Luís Gustavo Lazzarotto | Psiquiatra em Campo Grande – MS",
    description:
      "Psiquiatra de crianças, adolescentes e adultos em Campo Grande/MS. Atendimento presencial e teleconsulta para todo o Brasil. CRM-MS 7692 · RQE 5589/9231.",
    keywords: [
      "psiquiatra Campo Grande",
      "psiquiatra infantil Campo Grande",
      "psiquiatra da infância e adolescência MS",
      "psiquiatra online",
      "TDAH Campo Grande",
    ],
  },

  // ─── Compliance (CFM 2.336/2023) ────────────────────────────
  compliance: {
    showCrmRqeEverywhere: true,
    noOutcomePromises: true,
    noPatientTestimonials: true,
    hideNonRecognizedSpecialties: true,
    technicalDirector: "Dr. Luís Gustavo Lazzarotto — CRM-MS 7692 · RQE 5589 · RQE 9231",
  },
};

export default drLuisGustavo;
