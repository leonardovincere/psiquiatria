import { defineClinic } from './types';

/**
 * Animus — configuração da landing page.
 *
 * TODO antes de publicar (isPreview: false): substituir os campos marcados
 * com "TODO" pelos dados reais e conferir CRM/RQE no portal do CFM.
 */
export default defineClinic({
  slug: 'animus',
  isPreview: true,

  clinicName: 'Animus Psiquiatria',
  technicalDirector: {
    name: 'Dra. Nome da Médica', // TODO
    crm: 'CRM-UF 000000', // TODO
  },

  doctor: {
    name: 'Dra. Nome da Médica', // TODO
    crm: 'CRM-UF 000000', // TODO
    rqe: 'RQE 00000', // TODO
    specialty: 'Psiquiatria',
    // photo: importe de src/assets/animus/medica.jpg quando disponível
    photoAlt: 'Retrato da médica psiquiatra',
    bio: [
      'Sou médica psiquiatra e acredito que cada pessoa chega ao consultório com uma história própria. Meu trabalho começa por escutar essa história com calma, sem pressa e sem julgamentos.',
      'Na consulta, buscamos juntos compreender o que você está vivendo e construir um plano de cuidado possível para a sua rotina — que pode incluir orientação, acompanhamento, medicação quando indicada e articulação com psicoterapia e outros profissionais.',
      'O acompanhamento é contínuo e ajustado ao longo do tempo, respeitando o seu ritmo e as suas escolhas.',
    ],
    credentials: [
      'Graduação em Medicina — Instituição (TODO)',
      'Residência Médica em Psiquiatria — Instituição (TODO)',
      'Título de Especialista em Psiquiatria — RQE (TODO)',
    ],
  },

  address: {
    street: 'Rua Exemplo, 123', // TODO
    complement: 'Sala 45 — Bairro', // TODO
    city: 'Cidade', // TODO
    state: 'UF', // TODO
    zip: '00000-000', // TODO
    notes: ['Prédio com acessibilidade', 'Estacionamento nas proximidades'],
  },

  contact: {
    whatsapp: '5500000000000', // TODO
    whatsappMessage: 'Olá! Gostaria de informações sobre consultas com a Animus Psiquiatria.',
    doctoralia: 'https://www.doctoralia.com.br/', // TODO: link do perfil
    instagram: 'animuspsiquiatria', // TODO
    hours: ['Segunda a sexta, das 8h às 19h', 'Atendimento mediante agendamento'],
  },

  modalities: ['presencial', 'teleconsulta'],

  conditions: [
    {
      title: 'Ansiedade',
      description: 'Preocupação excessiva, tensão constante, crises de pânico e sintomas físicos ligados à ansiedade.',
    },
    {
      title: 'Depressão',
      description: 'Tristeza persistente, desânimo, perda de interesse e alterações de sono e apetite.',
    },
    {
      title: 'Transtorno bipolar',
      description: 'Oscilações de humor que interferem na rotina, nos relacionamentos e no trabalho.',
    },
    {
      title: 'TDAH em adultos',
      description: 'Dificuldades de atenção, organização e impulsividade que acompanham a vida adulta.',
    },
    {
      title: 'Insônia e sono',
      description: 'Dificuldade para iniciar ou manter o sono e cansaço que afeta o dia a dia.',
    },
    {
      title: 'TOC',
      description: 'Pensamentos intrusivos e comportamentos repetitivos que geram sofrimento.',
    },
    {
      title: 'Estresse e esgotamento',
      description: 'Exaustão relacionada ao trabalho ou a períodos de sobrecarga prolongada.',
    },
    {
      title: 'Luto e momentos de crise',
      description: 'Acolhimento em perdas, mudanças importantes e fases difíceis da vida.',
    },
  ],

  palette: {
    primary: '#3f5b4f',
    onPrimary: '#ffffff',
    accent: '#b9895f',
    background: '#faf7f2',
    surface: '#f1ebe1',
    text: '#26302b',
    muted: '#5a645e',
    border: '#e0d7c8',
  },

  seo: {
    title: 'Animus Psiquiatria — Consultas presenciais e teleconsulta',
    description:
      'Atendimento psiquiátrico acolhedor e individualizado para adultos, presencial ou por teleconsulta. Agende pelo WhatsApp.',
  },

  texts: {
    hero: {
      eyebrow: 'Psiquiatria para adultos',
      title: 'Um espaço de escuta e cuidado para a sua saúde mental',
      subtitle:
        'Consultas com tempo para conversar, compreender o que você está vivendo e construir, junto com você, um plano de acompanhamento.',
      ctaLabel: 'Agendar pelo WhatsApp',
      secondaryCtaLabel: 'Como funciona a primeira consulta',
    },
    about: {
      title: 'Sobre a médica',
    },
    conditions: {
      title: 'Condições acompanhadas',
      intro:
        'Algumas das situações mais frequentes no consultório. Se você não encontrou o que está sentindo, entre em contato — conversamos sobre o seu caso.',
      note: 'Cada pessoa é única: a avaliação e o plano de cuidado são sempre individualizados.',
    },
    firstVisit: {
      title: 'Como funciona a primeira consulta',
      intro: 'Uma conversa sem pressa, para conhecer você e entender o momento que está vivendo.',
      steps: [
        {
          title: 'Agendamento',
          description: 'Você entra em contato pelo WhatsApp e escolhemos juntos o melhor horário e a modalidade — presencial ou teleconsulta.',
        },
        {
          title: 'Escuta e avaliação',
          description: 'Conversamos sobre sua história, seus sintomas, sua rotina e o que motivou a busca por ajuda. Se tiver exames ou receitas anteriores, traga.',
        },
        {
          title: 'Plano de cuidado',
          description: 'Ao final, compartilho minhas impressões e definimos juntos os próximos passos, que podem incluir orientações, exames, medicação quando indicada e psicoterapia.',
        },
        {
          title: 'Acompanhamento',
          description: 'Os retornos permitem avaliar como você está e ajustar o cuidado ao longo do tempo.',
        },
      ],
    },
    telehealth: {
      title: 'Teleconsulta',
      intro:
        'Para quem mora longe, tem uma rotina corrida ou se sente mais à vontade em casa, a consulta pode acontecer por vídeo, com o mesmo cuidado do atendimento presencial.',
      points: [
        'Plataforma segura, com sigilo e privacidade',
        'Receitas e documentos com assinatura digital válida',
        'Basta um celular ou computador com internet e um lugar reservado',
      ],
      note: 'Atendimento realizado conforme a Resolução CFM nº 2.314/2022, que regulamenta a telemedicina. Em algumas situações, pode ser indicada uma consulta presencial.',
    },
    faq: {
      title: 'Perguntas frequentes',
      items: [
        {
          question: 'Preciso de encaminhamento para marcar uma consulta?',
          answer: 'Não. Você pode agendar diretamente pelo WhatsApp.',
        },
        {
          question: 'Quanto tempo dura a primeira consulta?',
          answer: 'A primeira consulta costuma ser mais longa que os retornos, para que haja tempo de conhecer sua história com calma. Informamos a duração prevista no agendamento.',
        },
        {
          question: 'A consulta é atendida por convênio?',
          answer: 'O atendimento é particular. Emitimos recibo e nota fiscal, que podem ser usados para solicitar reembolso ao seu plano, conforme as regras do seu contrato.',
        },
        {
          question: 'Toda consulta com psiquiatra resulta em medicação?',
          answer: 'Não. A indicação de medicação depende da avaliação de cada caso e é sempre discutida com você. Em muitos casos, o cuidado envolve também psicoterapia, mudanças na rotina e outras abordagens.',
        },
        {
          question: 'A teleconsulta tem a mesma validade da consulta presencial?',
          answer: 'Sim. A telemedicina é regulamentada pelo CFM, e receitas e atestados emitidos com assinatura digital têm validade em todo o território nacional, inclusive para medicamentos controlados, conforme a legislação vigente.',
        },
        {
          question: 'O que eu digo na consulta fica em sigilo?',
          answer: 'Sim. O sigilo médico é um dever ético e legal, e seus dados são tratados de acordo com a LGPD.',
        },
        {
          question: 'Posso levar um familiar ou acompanhante?',
          answer: 'Pode, se for importante para você. Parte da conversa também pode acontecer apenas entre você e a médica.',
        },
      ],
    },
    location: {
      title: 'Onde estamos',
      intro: 'Consultório em local de fácil acesso, pensado para que você se sinta à vontade.',
    },
    finalCta: {
      title: 'Quando você quiser, estamos aqui',
      text: 'Tire suas dúvidas ou agende sua consulta pelo WhatsApp. Respondemos em horário comercial.',
    },
    emergencyNotice:
      'Este canal não atende emergências. Em situação de crise ou risco, procure o pronto-socorro mais próximo, ligue para o SAMU (192) ou para o CVV (188), disponível 24 horas.',
  },
});
