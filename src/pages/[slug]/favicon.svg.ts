import type { APIRoute, GetStaticPaths } from 'astro';
import { clients } from '../../clients';
import type { BaseClientConfig } from '../../clients/types';
import { initials, readableOn } from '../../lib/links';

/** Favicon gerado com a cor da clínica, usado quando a config não tem `favicon`. */
export const getStaticPaths = (() => clients.map((clinic) => ({ params: { slug: clinic.slug }, props: { clinic } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { theme, clinic, doctor } = (props as { clinic: BaseClientConfig }).clinic;
  const fg = readableOn(theme.primary);
  // Monograma com as iniciais (marca pessoal, sem logo); senão, um coração simples.
  const mono = initials(clinic.name.startsWith('Dr') ? doctor.name : clinic.name).slice(0, 2);
  const mark = mono
    ? `<text x="16" y="21.5" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="15" fill="${fg}">${mono}</text>`
    : `<path d="M16 24s-7-4.3-7-9.5A4 4 0 0 1 16 12a4 4 0 0 1 7 2.5C23 19.7 16 24 16 24Z" fill="none" stroke="${fg}" stroke-width="2" stroke-linejoin="round"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${theme.primary}"/>${mark}</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
