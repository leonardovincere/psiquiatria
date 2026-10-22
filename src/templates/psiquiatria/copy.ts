import type { PsiquiatriaClient, PsiquiatriaCopy } from './types';
import { resolveCopy } from '../../lib/copy';

/** Textos padrão das seções de psiquiatria (tom de acolhimento). */
export const PSIQUIATRIA_COPY: PsiquiatriaCopy = {
  scheduleCta: 'Agendar pelo WhatsApp',
  hero: {
    eyebrowFallback: 'Psiquiatria · {publico} · {cidade}/{uf}',
    subtitle: 'Com {medico}, {titulo} em {cidade}.',
    link: 'Como funciona a primeira consulta',
    ringText: '{titulo} · {cidade}/{uf} · ',
  },
  approach: { eyebrow: 'Abordagem', title: 'O que guia cada consulta' },
  journey: { eyebrow: 'Trajetória', title: 'Formação e experiência', education: 'Formação', experience: 'Experiência' },
  about: { eyebrow: 'Sobre' },
  conditions: {
    title: 'Condições acompanhadas',
    intro: 'Não encontrou o que está sentindo? Fale com a gente — conversamos sobre o seu caso.',
    note: 'Cada pessoa é única: a avaliação e o plano de cuidado são sempre individualizados.',
  },
  firstVisit: {
    eyebrow: 'Passo a passo',
    title: 'Como funciona a primeira consulta',
    extraPrefix: 'Também emitimos',
    paymentPrefix: 'Pagamento',
  },
  telehealth: {
    eyebrow: 'Teleconsulta',
    title: 'O mesmo cuidado,',
    titleEm: 'de onde você estiver',
    subtitle: 'Consulta por vídeo, pelo celular ou computador.',
    points: ['Link enviado antes do horário', 'Sigilo e privacidade', 'Receita digital válida'],
    note: 'Conforme a Resolução CFM nº 2.314/2022, que regulamenta a telemedicina. Em algumas situações, pode ser indicada uma consulta presencial.',
  },
  research: { eyebrow: 'Pesquisa', link: 'Ler o trabalho completo' },
  articles: { eyebrow: 'Conteúdo' },
  faq: { title: 'Perguntas frequentes' },
  location: { title: 'Onde estamos', mapButton: 'Ver mapa interativo', mapsLink: 'Abrir no Google Maps' },
  finalCta: {
    title: 'Quando você quiser,',
    titleEm: 'estamos aqui.',
    text: 'Tire suas dúvidas ou agende sua consulta com {medico} pelo WhatsApp.',
    callPrefix: 'ou ligue',
  },
  emergencyNotice:
    'Este canal não atende emergências. Em situação de crise ou risco, procure o pronto-socorro mais próximo, ligue para o SAMU (192) ou para o CVV (188), disponível 24 horas.',
  legalNotice:
    'Conteúdo informativo, que não substitui a consulta médica. Publicidade médica conforme a Resolução CFM nº 2.336/2023.',
  previewSuffix: 'versão de demonstração, não indexada',
  schemaSpecialty: 'Psychiatric',
};

/** Textos da clínica de psiquiatria (padrão + `copy` da config). */
export const getCopy = (c: PsiquiatriaClient): PsiquiatriaCopy => resolveCopy(PSIQUIATRIA_COPY, c);
