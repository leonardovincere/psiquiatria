import type { Address, ClinicConfig, Theme } from '../clinics/types';

export const whatsappUrl = (c: ClinicConfig) =>
  `https://wa.me/${c.contact.whatsapp}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;

export const formatAddress = (a: Address) =>
  [a.street, a.complement, a.neighborhood, `${a.city} — ${a.state}`, `CEP ${a.zip}`].filter(Boolean).join(', ');

const mapsQuery = (a: Address) => (a.coords ? `${a.coords.lat},${a.coords.lng}` : formatAddress(a));

export const mapsSearchUrl = (a: Address) =>
  a.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery(a))}`;

export const mapsEmbedUrl = (a: Address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery(a))}&z=17&output=embed`;

/** URL do Google Fonts com as duas famílias do tema (pesos 400–600). */
export const googleFontsUrl = (t: Theme) => {
  const families = [...new Set([t.fontHeading, t.fontBody])]
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
};

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
