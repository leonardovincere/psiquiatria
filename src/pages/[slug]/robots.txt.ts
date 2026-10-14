import type { APIRoute, GetStaticPaths } from 'astro';
import { clinics } from '../../clinics';
import type { ClinicConfig } from '../../clinics/types';

/** /<slug>/robots.txt — servido como /robots.txt no subdomínio da clínica (vercel.json). */
export const getStaticPaths = (() => clinics.map((clinic) => ({ params: { slug: clinic.slug }, props: { clinic } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const clinic = (props as { clinic: ClinicConfig }).clinic;
  const body = clinic.isPreview ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
