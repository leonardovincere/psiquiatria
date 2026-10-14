import type { Address, ClinicConfig } from '../clinics/types';

export const whatsappUrl = (c: ClinicConfig) =>
  `https://wa.me/${c.contact.whatsapp}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;

export const instagramUrl = (user: string) => `https://www.instagram.com/${user.replace(/^@/, '')}/`;

export const formatAddress = (a: Address) =>
  [a.street, a.complement, `${a.city} — ${a.state}`, `CEP ${a.zip}`].filter(Boolean).join(', ');

const mapsQuery = (a: Address) => a.mapsQuery ?? formatAddress(a);

export const mapsSearchUrl = (a: Address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery(a))}`;

export const mapsEmbedUrl = (a: Address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery(a))}&output=embed`;

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
