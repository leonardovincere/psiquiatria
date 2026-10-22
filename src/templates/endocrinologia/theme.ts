import type { Theme } from '../../clients/types';

/**
 * Paleta de partida da endocrinologia: azul-cobalto, cinza frio e branco-gelo,
 * com títulos sem serifa. Sóbria e clínica, distinta dos tons quentes da psiquiatria.
 */
export const ENDOCRINOLOGIA_THEME: Theme = {
  primary: '#1E56A0', // cobalto: botões, links e destaques (texto branco com contraste 7:1)
  secondary: '#C9D3DE', // cinza-azulado: fundos suaves e filetes
  accent: '#3BA3C7', // ciano: detalhes e marcadores (não usar em texto sobre fundo claro)
  background: '#F5F7F9', // branco-gelo
  text: '#14202B', // grafite azulado
  fontHeading: 'IBM Plex Sans',
  headingWeight: 500,
  fontBody: 'IBM Plex Sans',
};
