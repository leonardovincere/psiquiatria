import type { APIRoute, GetStaticPaths } from 'astro';
import { clients } from '../../clients';
import type { BaseClientConfig } from '../../clients/types';

/** /<slug>/robots.txt — servido como /robots.txt no subdomínio da clínica (vercel.json). */
export const getStaticPaths = (() => clients.map((clinic) => ({ params: { slug: clinic.slug }, props: { clinic } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const clinic = (props as { clinic: BaseClientConfig }).clinic;
  const body = clinic.isPreview ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
