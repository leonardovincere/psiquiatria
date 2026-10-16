// src/clinics/leonardo-fabricio.ts
// Config da prévia — Dr. Leonardo Fabrício, Médico Psiquiatra (Campo Grande/MS)
// Fonte: Instagram @drleonardofabricio.psiquiatra (bio + posts públicos), lido em 16/10/2026.
// Ele não tem site, Doctoralia nem Google Meu Negócio: esta prévia sai do zero.
// Itens marcados com TODO precisam ser confirmados antes de ir ao ar.

import type { ClinicConfig } from "./types";

export const leonardoFabricio: ClinicConfig = {
  slug: "leonardo-fabricio",
  isPreview: true, // ativa noindex + faixa "Prévia criada pela Vincere.AI"
  previewBanner: "Prévia criada pela Vincere.AI para o Dr. Leonardo Fabrício",

  // ─── Identidade ─────────────────────────────────────────────
  // A marca é o nome dele. A frase da bio é dele e já é boa: vira o título do site.
  clinic: {
    name: "Dr. Leonardo Fabrício",
    fullName: "Dr. Leonardo Fabrício — Médico Psiquiatra",
    tagline: "Você não precisa enfrentar tudo sozinho.",
    taglineHighlight: "sozinho", // em itálico no título do topo
    city: "Campo Grande",
    state: "MS",
  },

  doctor: {
    name: "Dr. Leonardo Fabrício Gomes Soares",
    shortName: "Dr. Leonardo Fabrício",
    title: "Médico Psiquiatra",
    crm: "CRM-MS 7548",
    rqe: "RQE 5556",
    // TODO: pedir foto profissional. A do post "Quem sou eu" (blazer, fundo de madeira) serve para o preview privado.
    photo: null,
    education: [
      "Medicina — Universidade Federal de Minas Gerais (UFMG)",
      "Residência em Psiquiatria — Hospital Universitário da UFMS",
      "Mestrado em Saúde e Desenvolvimento na Região Centro-Oeste — UFMS",
      "Doutorado em Saúde e Desenvolvimento na Região Centro-Oeste — UFMS (2024)",
    ],
    // Texto escrito para o preview a partir do que ele publica. Validar com o médico.
    bio: [
      "Formado em Medicina pela UFMG, o Dr. Leonardo Fabrício fez residência em Psiquiatria no Hospital Universitário da UFMS, onde também concluiu mestrado e doutorado em Saúde e Desenvolvimento.",
      "São mais de 15 anos de medicina unindo consultório e pesquisa. Na prática clínica, ele explica cada etapa do tratamento com clareza e trabalha para desfazer o preconceito que ainda existe em torno da psiquiatria e dos medicamentos.",
    ],
  },

  // ─── Prova de autoridade ────────────────────────────────────
  // É o grande ativo dele e hoje não aparece em lugar nenhum fora de um post de 2024.
  // Sem números de pacientes ou promessas: só fatos verificáveis (CFM 2.336/2023).
  credentials: [
    { value: "15+", label: "anos de medicina", note: "Formado desde 2008" }, // Post de jun/2023: "quinze anos de formatura"
    { value: "Doutor", label: "em Saúde e Desenvolvimento", note: "UFMS, 2024" },
    { value: "UFMG", label: "formação médica", note: null },
  ],

  research: {
    enabled: true,
    heading: "Pesquisa que vem do consultório",
    title:
      "Tendência temporal de afastamento do trabalho por transtorno depressivo em servidores de uma universidade pública do estado de Mato Grosso do Sul (2012–2022)",
    kind: "Tese de doutorado",
    institution: "Programa de Pós-Graduação em Saúde e Desenvolvimento na Região Centro-Oeste — FAMED/UFMS",
    year: 2024,
    summary:
      "Uma década de dados sobre como a depressão afasta pessoas do trabalho. A mesma pergunta guia o consultório: como ajudar cada paciente a voltar a funcionar bem na vida real.",
    link: null, // TODO: link do repositório da UFMS, se a tese estiver publicada
  },

  // ─── Atendimento ────────────────────────────────────────────
  audience: "Adultos", // TODO: confirmar se atende adolescentes
  modalities: {
    presencial: true,
    teleconsulta: null, // TODO: o Instagram não informa. Se for false, a seção some.
  },
  insurance: {
    acceptsInsurance: null, // TODO: confirmar convênios ou atendimento particular
    note: null,
  },
  payment: null, // TODO

  // Baseado nos temas que ele posta (ansiedade, TAG, pânico, depressão, dependência química)
  // e na área da tese. Confirmar a lista com ele.
  conditions: [
    { name: "Depressão", description: "Tristeza persistente, desânimo e perda de interesse pelo que antes fazia sentido." },
    { name: "Ansiedade generalizada", description: "Preocupação constante, tensão e dificuldade de desligar a mente." },
    { name: "Síndrome do pânico", description: "Crises súbitas de medo intenso, com sintomas físicos fortes." },
    { name: "Saúde mental e trabalho", description: "Esgotamento, afastamentos e a volta à rotina profissional." }, // TODO: confirmar com ele
    { name: "Dependência química", description: "Tratamento e prevenção de recaída, com apoio à família." },
    { name: "Insônia", description: "Dificuldade para dormir e acordar descansado." },
  ],

  services: [
    { name: "Primeira consulta", description: "Avaliação completa da sua história, dos sintomas e do momento de vida." },
    { name: "Acompanhamento", description: "Retornos para ajustar o tratamento com base na sua evolução." },
  ],
  showPrices: false,

  firstVisitSteps: [
    { title: "Agende pelo WhatsApp", text: "Ou pelo telefone. A equipe confirma o melhor horário." },
    { title: "Uma conversa franca", text: "Tempo para entender seus sintomas e o que está pesando na sua vida." },
    { title: "Tudo explicado", text: "Diagnóstico, opções de tratamento e o que esperar de cada medicamento, sem jargão." },
    { title: "Acompanhamento de perto", text: "Retornos para ajustar o plano até você se sentir bem de novo." },
  ],

  // ─── Conteúdo educativo (diferencial de SEO) ────────────────
  // Ele já escreve conteúdo de qualidade no Instagram (série "Desmistificando" sobre medicamentos).
  // No site, vira uma seção "Perguntas que todo paciente faz", que ranqueia no Google e Instagram não ranqueia.
  // Textos reescritos a partir dos temas dele; não copiar posts na íntegra.
  articles: {
    enabled: true,
    heading: "Psiquiatria sem mistério",
    intro: "Respostas diretas para as dúvidas mais comuns sobre tratamento psiquiátrico.",
    items: [
      {
        slug: "remedio-psiquiatrico-vicia",
        title: "Remédio psiquiátrico vicia?",
        excerpt: "A maioria não. Entenda a diferença entre dependência e efeito terapêutico, e por que a dose é ajustada com acompanhamento.",
      },
      {
        slug: "como-funciona-antidepressivo",
        title: "Como funciona um antidepressivo",
        excerpt: "Por que ele demora algumas semanas para fazer efeito, e o que é normal sentir no começo do tratamento.",
      },
      {
        slug: "quando-procurar-psiquiatra",
        title: "Quando procurar um psiquiatra",
        excerpt: "Sinais de que a ansiedade ou a tristeza deixaram de ser passageiras e começaram a atrapalhar a vida.",
      },
    ],
  },

  // ─── Prova social ───────────────────────────────────────────
  // Há elogios de pacientes nos comentários do Instagram, mas NÃO usar: CFM veda depoimento de paciente.
  // Sem Doctoralia nem Google, não há nota agregada para mostrar. Seção desligada.
  socialProof: {
    enabled: false,
    label: null,
    rating: null,
    sourceUrl: null,
    highlights: [],
  },

  // ─── Contato e localização ──────────────────────────────────
  contact: {
    whatsapp: "5567992123416",
    whatsappMessage: "Olá! Gostaria de agendar uma consulta com o Dr. Leonardo Fabrício.",
    phone: null, // TODO: a bio diz "telefone ou WhatsApp", mas só mostra o WhatsApp
    email: null,
    instagram: "https://www.instagram.com/drleonardofabricio.psiquiatra/",
    facebook: null,
    doctoralia: null,
  },

  address: {
    clinicName: null, // TODO: confirmar se é consultório próprio ou dentro de uma clínica
    street: "Rua Abrão Júlio Rahe, 1277",
    complement: null,
    neighborhood: "Vila Célia",
    city: "Campo Grande",
    state: "MS",
    zip: null, // TODO
    coords: null, // TODO: pegar no Google Maps
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rua+Abr%C3%A3o+J%C3%BAlio+Rahe,+1277,+Vila+C%C3%A9lia,+Campo+Grande+-+MS",
  },

  hours: null, // TODO

  // ─── FAQ ────────────────────────────────────────────────────
  faq: [
    { q: "Vou ter que tomar remédio para sempre?", a: "Não necessariamente. A duração depende do quadro e da sua evolução, e é revista ao longo do acompanhamento." },
    { q: "Qual a diferença entre psiquiatra e psicólogo?", a: "O psiquiatra é médico: faz diagnóstico, pode solicitar exames e prescrever medicamentos. Os dois trabalhos costumam se complementar." },
    { q: "Preciso estar muito mal para procurar um psiquiatra?", a: "Não. Quanto antes a avaliação, mais simples tende a ser o tratamento." },
    { q: "O que levar na primeira consulta?", a: "Se tiver, traga exames recentes, receitas e relatórios de tratamentos anteriores." },
    { q: "Como agendar?", a: "Pelo WhatsApp (67) 99212-3416." },
  ],

  // ─── Visual ─────────────────────────────────────────────────
  // Conceito: "o psiquiatra pesquisador". Editorial e acadêmico, com calor humano.
  // Tem que ser diferente da Animus (sálvia) e da Dra. Marilice (teal): os três são de Campo Grande.
  // O post "Quem sou eu" dele usa creme e marrom; a paleta parte daí, mais sofisticada.
  theme: {
    primary: "#1B2A3A",    // azul-tinta, autoridade e calma
    secondary: "#D9CBB4",  // pergaminho, ecoando o creme que ele já usa
    accent: "#8A5A3B",     // marrom-conhaque, o mesmo tom do post dele, para CTAs secundários
    background: "#FAF7F2", // papel
    text: "#1A1F26",
    fontHeading: "Newsreader",
    fontBody: "Source Sans 3",
  },

  // Layout: "cinematográfico", diferente da Animus (arco + faixas + suave) e da Marilice (círculo + etiquetas + editorial).
  // Topo em tela cheia com luz de projetor, abertura em letterbox, títulos que entram em foco,
  // tese como cena escura e primeira consulta com o título preso na rolagem.
  style: {
    hero: "cinema",
    conditions: "marquee", // no acabamento "cinema", as faixas viram letreiro em serifa
    finish: "cinema",
    intro: true,
  },

  // Direção de arte para o Claude Code (ler junto com o DESIGN.md do template)
  designNotes: {
    concept: "O psiquiatra pesquisador: rigor de quem estuda, linguagem de quem acolhe.",
    hero: "Título grande com a frase da bio dele. Foto em recorte retangular alto, ao lado. Credenciais logo abaixo do título, em linha, sem ícones.",
    signatureSection: "Bloco da tese em estilo de capa de publicação acadêmica: título longo em serifa, instituição e ano em versalete pequeno. É o momento 'uau' do site.",
    motion: "Contido. Um reveal de texto lento no hero e a seção de primeira consulta presa na rolagem. Nada além disso.",
    avoid: ["cards genéricos com ícone", "gradiente decorativo", "depoimentos", "fotos pessoais, de família ou de fé"],
  },

  // ─── SEO (vale quando sair do modo preview) ─────────────────
  // Hoje o nome dele no Google só leva ao Instagram. O site passa a ser o primeiro resultado.
  seo: {
    title: "Dr. Leonardo Fabrício — Psiquiatra em Campo Grande, MS | CRM-MS 7548",
    description:
      "Psiquiatra em Campo Grande/MS, doutor pela UFMS. Tratamento de depressão, ansiedade e pânico com explicação clara e acompanhamento próximo. Agende pelo WhatsApp.",
    keywords: [
      "psiquiatra campo grande",
      "dr leonardo fabrício psiquiatra",
      "psiquiatra vila célia campo grande",
      "tratamento depressão campo grande",
      "psiquiatra ansiedade campo grande",
    ],
  },

  // ─── Compliance (CFM 2.336/2023) ────────────────────────────
  compliance: {
    showCrmRqeEverywhere: true, // rodapé + seção sobre + cabeçalho
    noOutcomePromises: true,
    noPatientTestimonials: true,
    hideNonRecognizedSpecialties: true,
    technicalDirector: "Dr. Leonardo Fabrício Gomes Soares — CRM-MS 7548 / RQE 5556",
  },
};

export default leonardoFabricio;
