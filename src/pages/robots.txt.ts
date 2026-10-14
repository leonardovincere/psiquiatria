import type { APIRoute } from 'astro';
import { getClinic } from '../clinics';

export const GET: APIRoute = () => {
  const body = getClinic().isPreview
    ? 'User-agent: *\nDisallow: /\n'
    : 'User-agent: *\nAllow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
