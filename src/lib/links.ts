import type { Address, ClinicConfig, Doctor, Highlight } from '../clinics/types';

export const whatsappUrl = (c: ClinicConfig) =>
  `https://wa.me/${c.contact.whatsapp}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;

export const formatAddress = (a: Address) =>
  [a.street, a.complement, a.neighborhood, `${a.city} — ${a.state}`, a.zip && `CEP ${a.zip}`].filter(Boolean).join(', ');

const mapsQuery = (a: Address) => (a.coords ? `${a.coords.lat},${a.coords.lng}` : formatAddress(a));

export const mapsSearchUrl = (a: Address) =>
  a.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery(a))}`;

export const mapsEmbedUrl = (a: Address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery(a))}&z=17&output=embed`;

/** Branco ou quase-preto, o que tiver mais contraste sobre a cor dada. */
export const readableOn = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return (1.05 / (lum + 0.05)) >= ((lum + 0.05) / 0.05) ? '#ffffff' : '#111111';
};

/** "Dra. Ana Souza" -> "AS" */
export const initials = (name: string) =>
  name
    .replace(/^(dra?\.?|dr\.?)\s+/i, '')
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .map((p) => p[0])
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .join('')
    .toUpperCase();

/** "CRM-MS 5844 · RQE 4155"; na prévia sem os números, "CRM e RQE em confirmação". */
export const credentials = (d: Doctor) => {
  const parts = [d.crm, d.rqe].filter((x): x is string => !!x && !!x.trim());
  if (parts.length === 2) return parts.join(' · ');
  if (parts.length === 1) return `${parts[0]} · ${d.crm ? 'RQE' : 'CRM'} em confirmação`;
  return 'CRM e RQE em confirmação';
};

/** Fatos da faixa de destaques: `highlights`, senão `credentials`, senão formação + modalidades + avaliações. */
export const factsFor = (c: ClinicConfig): Highlight[] =>
  c.highlights?.length
    ? c.highlights
    : c.credentials?.length
      ? c.credentials
      : [
          ...c.doctor.education.map((e) => ({ value: '', label: e })),
          {
            value: '',
            label:
              c.modalities.presencial && c.modalities.teleconsulta
                ? 'Presencial e teleconsulta'
                : c.modalities.teleconsulta
                  ? 'Teleconsulta'
                  : 'Atendimento presencial',
          },
          ...(c.socialProof.enabled && c.socialProof.label
            ? [{ value: '', label: c.socialProof.label, href: c.socialProof.sourceUrl ?? undefined }]
            : []),
        ];

/** Horários sempre como lista. */
export const hoursList = (h: string | string[] | null) => (h == null ? [] : Array.isArray(h) ? h : [h]);

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const mixWhite = (hex: string, t: number) =>
  '#' + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, '0')).join('');

/** A cor de destaque, clareada só o necessário para ter contraste 4.5:1 sobre o fundo dado. */
export const legibleOn = (fg: string, bg: string, min = 4.5) => {
  for (let t = 0; t <= 1; t += 0.05) {
    const c = mixWhite(fg, t);
    if (contrast(c, bg) >= min) return c;
  }
  return '#ffffff';
};
