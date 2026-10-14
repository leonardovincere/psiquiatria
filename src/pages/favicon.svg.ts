import type { APIRoute } from 'astro';
import { getClinic } from '../clinics';

/** Favicon gerado com a paleta da clínica. */
export const GET: APIRoute = () => {
  const { palette } = getClinic();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${palette.primary}"/><path d="M16 24s-7-4.3-7-9.5A4 4 0 0 1 16 12a4 4 0 0 1 7 2.5C23 19.7 16 24 16 24Z" fill="none" stroke="${palette.onPrimary}" stroke-width="2" stroke-linejoin="round"/></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
