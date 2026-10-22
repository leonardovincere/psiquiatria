// Template de endocrinologia. Textos em conformidade com a publicidade médica
// do CFM (Res. 2.336/2023 e 2.333/2023): sem promessa de resultado, sem antes e
// depois, sem preços, sem sensacionalismo. Leia o aviso no topo de ./copy.ts.
import Page from './Page.astro';
import { ENDOCRINOLOGIA_COPY, getCopy } from './copy';
import { ENDOCRINOLOGIA_THEME } from './theme';
import { ENDO_ICONS } from './icons';
import { ENDOCRINOLOGIA_IMAGES } from './images';
import { ENDOCRINOLOGIA_FORBIDDEN } from './compliance';
import type { EndocrinologiaClient, EndocrinologiaCopy } from './types';
import type { SpecialtyTemplate } from '../types';

/**
 * Template de endocrinologia: tom técnico e confiável, focado em diagnóstico,
 * exames e acompanhamento contínuo. Visual sóbrio (cobalto, cinza frio, títulos
 * sem serifa, cantos retos, grade milimetrada no topo).
 */
export const endocrinologia: SpecialtyTemplate<EndocrinologiaClient, EndocrinologiaCopy> = {
  id: 'endocrinologia',
  label: 'Endocrinologia',
  defaultCopy: ENDOCRINOLOGIA_COPY,
  getCopy,
  defaultTheme: ENDOCRINOLOGIA_THEME,
  icons: ENDO_ICONS,
  imageSuggestions: ENDOCRINOLOGIA_IMAGES,
  forbiddenTerms: ENDOCRINOLOGIA_FORBIDDEN,
  Page,
};
