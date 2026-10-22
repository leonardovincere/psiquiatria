/**
 * Ícones das seções de endocrinologia (conteúdo de <svg viewBox="0 0 24 24">,
 * traço de 1.6 px). Renderizados pelo Icon compartilhado: <Icon svg={ENDO_ICONS.thyroid} />.
 */
export const ENDO_ICONS = {
  drop: '<path d="M12 3.5s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11Z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>',
  thyroid:
    '<path d="M12 8v9"/><path d="M12 10c-1.5-3.5-6.5-4.5-7.5-1.5-.9 2.8.6 7.5 3.8 8 2 .3 3.2-1.2 3.7-2.5"/><path d="M12 10c1.5-3.5 6.5-4.5 7.5-1.5.9 2.8-.6 7.5-3.8 8-2 .3-3.2-1.2-3.7-2.5"/>',
  scale: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M7.5 9.5a6 6 0 0 1 9 0"/><path d="m12 11 1.5-2.5"/>',
  molecule:
    '<circle cx="6.5" cy="7" r="2.5"/><circle cx="17.5" cy="7" r="2.5"/><circle cx="12" cy="17" r="2.5"/><path d="M9 7h6M8 9l2.8 5.8M16 9l-2.8 5.8"/>',
  cycle: '<path d="M20 12a8 8 0 0 1-13.7 5.7"/><path d="M4 12a8 8 0 0 1 13.7-5.7"/><path d="M17.5 3v3.5H14M6.5 21v-3.5H10"/>',
  bone: '<path d="M7 17 17 7"/><circle cx="17.5" cy="5.2" r="1.8"/><circle cx="18.8" cy="6.5" r="1.8"/><circle cx="5.2" cy="17.5" r="1.8"/><circle cx="6.5" cy="18.8" r="1.8"/>',
  chart: '<path d="M4 20h16"/><path d="M7 16v-5M12 16V7M17 16v-3"/>',
  flask:
    '<path d="M9.5 3.5h5M10.5 3.5v5.2L5.4 17.4A2 2 0 0 0 7.1 20.5h9.8a2 2 0 0 0 1.7-3.1l-5.1-8.7V3.5"/><path d="M7.5 14.5h9"/>',
  pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  chat: '<path d="M4.5 18.5v-11a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9l-4.5 3Z"/><path d="M8.5 9.5h7M8.5 12.5h4.5"/>',
  clipboard:
    '<rect x="5" y="4.5" width="14" height="16.5" rx="2.5"/><path d="M9 4.5V3.5h6v1M8.5 10h7M8.5 13.5h7M8.5 17h4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 16.5h2"/>',
} as const;

export type EndoIconName = keyof typeof ENDO_ICONS;
