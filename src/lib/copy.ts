import type { ClinicConfig, SiteCopy } from '../clinics/types';

/** Textos padrão das seções (genéricos para clínicas de psiquiatria). */
const DEFAULT_COPY: SiteCopy = {
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
  myths: {
    eyebrow: 'Para quem é o psiquiatra?',
    title: 'Você já deve ter ouvido muita coisa errada a respeito.',
    subtitle: 'Psiquiatra não é só para casos graves. É para quem quer viver melhor.',
    mythLabel: 'Mito',
    truthLabel: 'Na verdade',
  },
  audiences: { eyebrow: 'Atendimento por fase da vida', title: 'Cada fase tem as suas questões.' },
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

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
function merge<T>(base: T, over: unknown): T {
  if (!isObj(over)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over)) {
    if (v === undefined) continue;
    out[k] = isObj(v) && isObj(out[k]) ? merge(out[k], v) : v;
  }
  return out as T;
}

/** "a Dra. Fulana" / "o Dr. Fulano". */
export const doctorRef = (c: ClinicConfig) => {
  const article = c.doctor.article ?? (/^dra\b/i.test(c.doctor.shortName) ? 'a' : /^dr\b/i.test(c.doctor.shortName) ? 'o' : 'a');
  return `${article} ${c.doctor.shortName}`;
};

/** Textos da clínica: padrão + `copy` da config, com {medico}, {cidade}, {uf} e {publico} preenchidos. */
export function getCopy(c: ClinicConfig): SiteCopy {
  const merged = merge(DEFAULT_COPY, c.copy);
  const vars: Record<string, string> = {
    medico: doctorRef(c),
    cidade: c.clinic.city,
    uf: c.clinic.state,
    publico: c.audience,
    titulo: c.doctor.title.toLowerCase(),
  };
  const fill = (v: unknown): unknown =>
    typeof v === 'string'
      ? v.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)
      : Array.isArray(v)
        ? v.map(fill)
        : isObj(v)
          ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)]))
          : v;
  return fill(merged) as SiteCopy;
}
