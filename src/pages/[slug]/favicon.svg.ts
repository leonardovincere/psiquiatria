import type { APIRoute, GetStaticPaths } from 'astro';
import { clinics } from '../../clinics';
import type { ClinicConfig } from '../../clinics/types';
import { readableOn } from '../../lib/links';

/** Favicon gerado com a cor da clínica, usado quando a config não tem `favicon`. */
export const getStaticPaths = (() => clinics.map((clinic) => ({ params: { slug: clinic.slug }, props: { clinic } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { theme } = (props as { clinic: ClinicConfig }).clinic;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${theme.primary}"/><path d="M16 24s-7-4.3-7-9.5A4 4 0 0 1 16 12a4 4 0 0 1 7 2.5C23 19.7 16 24 16 24Z" fill="none" stroke="${readableOn(theme.primary)}" stroke-width="2" stroke-linejoin="round"/></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
