import Page from './Page.astro';
import { PSIQUIATRIA_COPY, getCopy } from './copy';
import { PSIQUIATRIA_THEME } from './theme';
import { PSIQUIATRIA_ICONS } from './icons';
import { PSIQUIATRIA_IMAGES } from './images';
import { PSIQUIATRIA_FORBIDDEN } from './compliance';
import type { ClinicConfig, SiteCopy } from '../../clinics/types';
import type { SpecialtyTemplate } from '../types';

/**
 * Template de psiquiatria: tom de acolhimento, topo em arco/círculo/cinema,
 * condições em faixas ou etiquetas, e os acabamentos soft/editorial/cinema (style).
 */
export const psiquiatria: SpecialtyTemplate<ClinicConfig, SiteCopy> = {
  id: 'psiquiatria',
  label: 'Psiquiatria',
  defaultCopy: PSIQUIATRIA_COPY,
  getCopy,
  defaultTheme: PSIQUIATRIA_THEME,
  icons: PSIQUIATRIA_ICONS,
  imageSuggestions: PSIQUIATRIA_IMAGES,
  forbiddenTerms: PSIQUIATRIA_FORBIDDEN,
  Page,
};
