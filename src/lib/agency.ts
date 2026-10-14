/**
 * Dados da agência que produz os sites (não são dados de clínica).
 * Usados na faixa de prévia, no crédito do rodapé e no domínio das prévias.
 */
export const AGENCY = {
  name: 'Vincere.AI',
  url: 'https://vincereai.tech',
  /** Cada clínica fica em <slug>.<previewDomain> (ver vercel.json). */
  previewDomain: 'preview.vincereai.tech',
} as const;

/** URL pública da clínica: domínio próprio (siteUrl) ou o subdomínio de prévia. */
export const clinicUrl = (c: { slug: string; siteUrl?: string | null }) =>
  c.siteUrl ? c.siteUrl.replace(/\/?$/, '/') : `https://${c.slug}.${AGENCY.previewDomain}/`;
