// ─────────────────────────────────────────────────────────────────────────────
// ATENÇÃO — PUBLICIDADE MÉDICA (Resolução CFM nº 2.336/2023 e nº 2.333/2023)
//
// Todo texto deste template (e o `copy` de cada cliente) precisa seguir as
// normas do CFM. Em endocrinologia, os riscos mais comuns são:
//   - prometer resultado: "perca 10 kg", "emagrecimento rápido", "controle
//     total do diabetes", prazos ou percentuais de melhora;
//   - "antes e depois", fotos de corpos ou de balanças;
//   - preços, descontos, pacotes ou "consulta grátis";
//   - sensacionalismo ("corpo dos sonhos") e superlativos ("o melhor endocrinologista");
//   - terapias hormonais com fim estético, de desempenho ou "antienvelhecimento",
//     "chip da beleza", "modulação hormonal" (vedadas pela CFM 2.333/2023);
//   - depoimentos de pacientes (este template não tem essa seção).
// O build barra os termos mais comuns (src/lib/compliance.ts + ./compliance.ts),
// mas isso não substitui a revisão humana antes de publicar.
//
// Tom: técnico e confiável. Falamos de diagnóstico, exames e acompanhamento
// contínuo, sempre descrevendo o processo, nunca o resultado.
// ─────────────────────────────────────────────────────────────────────────────

import type { EndocrinologiaClient, EndocrinologiaCopy } from './types';
import { resolveCopy } from '../../lib/copy';

/** Textos padrão das seções de endocrinologia. */
export const ENDOCRINOLOGIA_COPY: EndocrinologiaCopy = {
  scheduleCta: 'Agendar consulta',
  nav: {
    areas: 'Áreas de atuação',
    care: 'Consulta',
    exams: 'Exames',
    about: 'Sobre',
    telehealth: 'Teleconsulta',
    faq: 'Dúvidas',
    location: 'Localização',
  },
  hero: {
    eyebrowFallback: 'Endocrinologia e Metabologia · {cidade}/{uf}',
    subtitle: 'Diagnóstico, tratamento e acompanhamento contínuo com {medico}, {titulo} em {cidade}.',
    link: 'Como funciona a consulta',
    credentialsLabel: 'Registro profissional',
  },
  areas: {
    eyebrow: 'Áreas de atuação',
    title: 'O que é avaliado e acompanhado',
    intro: 'Condições que costumam exigir investigação cuidadosa e seguimento ao longo do tempo, com decisões apoiadas em exames e nas diretrizes das sociedades médicas.',
    note: 'O plano de tratamento é definido só depois da avaliação clínica e dos exames de cada paciente.',
    items: [
      {
        name: 'Diabetes',
        description:
          'Diagnóstico e acompanhamento do diabetes tipo 1, tipo 2 e gestacional, e do pré-diabetes, com ajuste do tratamento conforme a glicemia e os exames.',
        icon: 'drop',
      },
      {
        name: 'Tireoide',
        description:
          'Hipotireoidismo, hipertireoidismo, nódulos e alterações nos exames da tireoide, com seguimento laboratorial e de imagem quando indicado.',
        icon: 'thyroid',
      },
      {
        name: 'Obesidade e emagrecimento com acompanhamento',
        description:
          'Investigação das causas do ganho de peso e plano individualizado, com metas realistas e consultas de seguimento. Medicamentos, quando indicados, seguem as diretrizes vigentes.',
        icon: 'scale',
      },
      {
        name: 'Distúrbios hormonais',
        description:
          'Alterações da hipófise, das adrenais e dos hormônios sexuais, como a síndrome dos ovários policísticos, investigadas com exames direcionados.',
        icon: 'molecule',
      },
      {
        name: 'Menopausa e andropausa',
        description:
          'Avaliação dos sintomas e das alterações hormonais do climatério e do hipogonadismo masculino, com tratamento indicado apenas quando há critério clínico.',
        icon: 'cycle',
      },
      {
        name: 'Osteoporose',
        description:
          'Avaliação da saúde óssea com densitometria e exames, e acompanhamento para reduzir o risco de fraturas.',
        icon: 'bone',
      },
    ],
  },
  care: {
    eyebrow: 'Consulta e acompanhamento',
    title: 'Do diagnóstico ao acompanhamento',
    intro: 'Doenças endócrinas costumam pedir seguimento ao longo do tempo. Cada etapa tem um objetivo claro e é registrada para comparar a evolução.',
    firstVisit: 'Primeira consulta',
    followUp: 'Acompanhamento',
    firstVisitSteps: [
      { title: 'História clínica', text: 'Sintomas, histórico familiar, medicamentos em uso e exames anteriores. Leve os resultados que tiver.' },
      { title: 'Exame físico e medidas', text: 'Peso, altura, circunferência abdominal e pressão arterial, registrados para comparar nos retornos.' },
      { title: 'Pedido de exames', text: 'Exames laboratoriais e de imagem quando indicados, para confirmar ou descartar hipóteses.' },
      { title: 'Plano explicado', text: 'Hipóteses, próximos passos e data do retorno, explicados de forma objetiva.' },
    ],
    followUpSteps: [
      { title: 'Retorno com os exames', text: 'Interpretação dos resultados e definição do diagnóstico.' },
      { title: 'Ajuste do tratamento', text: 'Doses e condutas revistas a cada retorno, conforme a evolução e os exames.' },
      { title: 'Intervalos definidos pelo quadro', text: 'A frequência das consultas e dos exames de controle depende de cada condição.' },
    ],
  },
  exams: {
    eyebrow: 'Exames',
    title: 'Avaliações no consultório',
    intro: 'Parte da avaliação é feita na própria consulta, o que agiliza o diagnóstico e o acompanhamento.',
    bioimpedanceTitle: 'Bioimpedância',
    bioimpedanceText:
      'Exame rápido e não invasivo que estima a composição corporal (massa magra, gordura e água). Repetido nos retornos, ajuda a acompanhar a evolução além do peso na balança.',
    note: 'Exames laboratoriais e de imagem são feitos em laboratórios e clínicas de sua escolha.',
  },
  about: { eyebrow: 'Sobre' },
  telehealth: {
    eyebrow: 'Teleconsulta',
    title: 'Retornos e avaliação de exames',
    titleEm: 'por vídeo',
    subtitle: 'Quando o quadro permite, o acompanhamento pode ser feito a distância.',
    points: ['Link enviado antes do horário', 'Sigilo e privacidade', 'Receitas e pedidos de exame digitais'],
    note: 'Conforme a Resolução CFM nº 2.314/2022, que regulamenta a telemedicina. A primeira consulta e algumas situações pedem atendimento presencial.',
  },
  faq: { title: 'Perguntas frequentes' },
  location: { title: 'Localização e convênios', mapButton: 'Ver mapa interativo', mapsLink: 'Abrir no Google Maps' },
  coverage: {
    title: 'Convênios',
    plans: 'Convênios atendidos',
    toConfirm: 'Convênios em confirmação. Pergunte pelo WhatsApp.',
    privateCare: 'Atendimento particular.',
    paymentPrefix: 'Pagamento',
  },
  finalCta: {
    title: 'Agende sua consulta',
    titleEm: 'e leve seus exames.',
    text: 'Marque a primeira consulta ou um retorno com {medico} pelo WhatsApp.',
    callPrefix: 'ou ligue',
  },
  emergencyNotice:
    'Este canal não atende emergências. Em caso de mal-estar súbito, como sinais de hipoglicemia grave, procure o pronto-socorro mais próximo ou ligue para o SAMU (192).',
  legalNotice: 'Conteúdo informativo, que não substitui a consulta médica. Publicidade médica conforme a Resolução CFM nº 2.336/2023.',
  previewSuffix: 'versão de demonstração, não indexada',
  schemaSpecialty: 'Endocrine',
};

/** Textos do cliente de endocrinologia (padrão + `copy` da config). */
export const getCopy = (c: EndocrinologiaClient): EndocrinologiaCopy => resolveCopy(ENDOCRINOLOGIA_COPY, c);
