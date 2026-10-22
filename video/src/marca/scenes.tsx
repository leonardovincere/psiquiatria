// Roteiro "marca própria" (composição "marca"): como o paciente encontra a médica hoje
// (informações soltas, perfis genéricos, mais uma na lista) e a virada para o site com a marca dela.
// Cores, fontes e textos vêm de src/clinic.json; tempos e legendas, de ./timeline.json.
import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, random, spring, staticFile, useCurrentFrame } from 'remotion';
import { FONT, H, W, clinic, manifest } from '../theme';
import { BrowserFrame, Caption, Cursor, FilmFinish, PhoneFrame, ease, phoneScreen } from '../ui';
import timeline from './timeline.json';

const FPS = timeline.fps;
const sec = (s: number) => Math.round(s * FPS);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const S = timeline.scenes;
type Scene = keyof typeof S;
/** Quadro local de um instante absoluto (s) dentro da cena. */
const at = (s: number, scene: Scene) => sec(s - S[scene][0]);

// ─── Paleta: as cores do site, com um tom escuro derivado para a parte "hoje" ───
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) =>
  '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const th = clinic.theme;
export const P = {
  bg: th.background,
  text: th.text,
  primary: th.primary,
  secondary: th.secondary,
  accent: th.accent,
  deep: mix(th.text, th.primary, 0.3),
  night: mix(th.text, '#000000', 0.35),
  paper: mix(th.background, '#ffffff', 0.5),
};
const SCRIPT = `'ClinicScript', ${FONT.heading}`;

// ─── Textos derivados da clínica ───
const short = clinic.shortName;
// Iniciais como no site: primeiro e último nome, sem o tratamento ("KA").
const names = clinic.name.replace(/^(dra?\.?)\s+/i, '').split(/\s+/);
const initials = (names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '')).toUpperCase();
const one = clinic.article === 'a' ? 'mais uma' : 'mais um';
export const query = timeline.typing.query
  .replace('{short}', short.toLowerCase().replace(/\./g, ''))
  .replace('{term}', clinic.term.one);
const charTime = (i: number) => timeline.typing.start + i / timeline.typing.cps + 0.02 * Math.sin(i * 1.7);
const clip = (name: string) => manifest.clips.find((c) => c.name === name)!;

// ─── Peças ─────────────────────────────────────────────────────────

/** Barra de busca genérica (sem marca de buscador). */
const SearchBar: React.FC<{ text: string; caret: boolean; y: number; light?: boolean }> = ({ text, caret, y, light }) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      left: 70,
      width: 940,
      height: 124,
      borderRadius: 62,
      background: light ? '#ffffff' : '#f4f3ee',
      boxShadow: light
        ? `0 30px 70px -30px ${P.primary}66, 0 0 0 1.5px ${P.secondary}`
        : '0 30px 80px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.2)',
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      padding: '0 44px',
      fontFamily: FONT.body,
      fontSize: 40,
      color: '#1b1c22',
    }}
  >
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#6b6d78" strokeWidth="2.4" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.6-4.6" />
    </svg>
    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', flex: 1, color: text ? '#1b1c22' : '#9a9ba5' }}>
      {text || 'Pesquisar'}
      <span style={{ display: 'inline-block', width: 3, height: 46, marginLeft: 3, verticalAlign: 'middle', background: '#1b1c22', opacity: caret ? 1 : 0 }} />
    </span>
  </div>
);

/** Resultado genérico e borrado: nunca nomes reais. */
const GENERIC = [
  ['guia de convênio', `${cap(clinic.term.many)} credenciados — ${clinic.city}`],
  ['diretório de profissionais', `${cap(clinic.term.many)} em ${clinic.city} — agende online`],
  ['portal de saúde', `Encontre ${clinic.term.one} perto de você`],
  ['lista de médicos', `Profissionais de ${clinic.city}/${clinic.state}`],
  ['rede social', `${short} (@perfil)`],
];
function cap(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}
const ResultRow: React.FC<{ i: number; y: number; blur: number; dark?: boolean }> = ({ i, y, blur, dark = true }) => {
  const [site, title] = GENERIC[i % GENERIC.length];
  const bar = dark ? '#2b3327' : `${P.secondary}88`;
  return (
    <div style={{ position: 'absolute', top: y, left: 80, width: 920, fontFamily: FONT.body, filter: `blur(${blur}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: dark ? '#9aa395' : '#7d8577', fontSize: 26 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', background: bar }} />
        {site}
      </div>
      <div style={{ marginTop: 14, fontSize: 38, color: dark ? '#c9d2c0' : P.text }}>{title}</div>
      <div style={{ marginTop: 14, height: 18, width: '92%', borderRadius: 9, background: bar }} />
      <div style={{ marginTop: 12, height: 18, width: '70%', borderRadius: 9, background: bar }} />
    </div>
  );
};

/** Medalhão com o monograma em cursiva, como no topo do site. */
export const Medallion: React.FC<{ size: number; glow?: number }> = ({ size, glow = 1 }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
        background: `linear-gradient(150deg, #ffffff, ${mix(P.bg, '#ffffff', 0.4)} 55%, ${mix(P.secondary, '#ffffff', 0.45)})`,
        border: '2px solid rgba(255,255,255,.9)',
        boxShadow: `inset 0 -${size * 0.12}px ${size * 0.22}px -${size * 0.12}px ${P.primary}55, 0 ${size * 0.18}px ${size * 0.35}px -${size * 0.16}px ${P.primary}${Math.round(0x99 * glow).toString(16).padStart(2, '0')}`,
      }}
    >
      <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, transform: `rotate(${f * 0.15}deg)` }}>
        {Array.from({ length: 60 }, (_, i) => (
          <line key={i} x1="100" y1="4" x2="100" y2={i % 5 === 0 ? 13 : 9} transform={`rotate(${i * 6} 100 100)`} stroke={P.primary} strokeOpacity={0.35} strokeWidth={1} />
        ))}
      </svg>
      <span style={{ fontFamily: SCRIPT, fontSize: size * 0.44, lineHeight: 1, color: P.primary, transform: 'translateY(4%)' }}>{initials}</span>
      <div
        style={{
          position: 'absolute',
          inset: '-30%',
          background: 'linear-gradient(115deg, transparent 42%, rgba(255,255,255,.75) 50%, transparent 58%)',
          transform: `translateX(${interpolate((f % 150) / 150, [0, 0.35, 1], [-70, 70, 70])}%)`,
        }}
      />
    </div>
  );
};

/** Favo molecular de fundo (eco do site), quase invisível. */
const Lattice: React.FC<{ color: string; opacity: number }> = ({ color, opacity }) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity }}>
      <defs>
        <pattern id="hex" width="62.4" height="108" patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${-f * 0.4})`}>
          <path
            d="M0 -36L31.2 -18L31.2 18L0 36L-31.2 18L-31.2 -18ZM62.4 -36L93.6 -18L93.6 18L62.4 36L31.2 18L31.2 -18ZM31.2 18L62.4 36L62.4 72L31.2 90L0 72L0 36ZM0 72L31.2 90L31.2 126L0 144L-31.2 126L-31.2 90ZM62.4 72L93.6 90L93.6 126L62.4 144L31.2 126L31.2 90Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="fade" cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </radialGradient>
        <mask id="m">
          <rect width="100%" height="100%" fill="url(#fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" mask="url(#m)" />
    </svg>
  );
};

/** Fundo claro da parte "com marca": creme, luz sálvia e mel que respira devagar. */
const Daylight: React.FC = () => {
  const f = useCurrentFrame();
  const x = 50 + Math.sin(f / 80) * 10;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(80% 45% at ${x}% 18%, ${P.secondary}cc, transparent 70%),
          radial-gradient(70% 40% at 20% 100%, ${P.accent}33, transparent 70%), ${P.bg}`,
      }}
    >
      <Lattice color={P.primary} opacity={0.07} />
    </AbsoluteFill>
  );
};

/** Fundo escuro da parte "hoje": verde quase preto, frio e dessaturado. */
const Night: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(80% 50% at 50% 40%, ${P.deep}, ${P.night} 75%)` }} />
);

// ─── 0–9 s: gancho e busca ─────────────────────────────────────────
export const Search: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const typed = query.slice(0, query.split('').filter((_, i) => charTime(i) <= t).length);
  const caret = Math.floor(f / 15) % 2 === 0 || (t > timeline.typing.start && t < charTime(query.length - 1) + 0.2);
  const res = interpolate(t, [timeline.enter + 0.1, timeline.enter + 0.6], [0, 1], { ...clamp, easing: ease });
  const barY = interpolate(res, [0, 1], [880, 250]);
  const zoom = interpolate(t, [0, S.search[1]], [1.07, 1]);
  const sugg = [query, `${query} ${clinic.city.toLowerCase()}`, `${clinic.term.one} ${clinic.city.toLowerCase()}`, `${clinic.term.one} ${clinic.plans[0]?.toLowerCase() ?? 'perto de mim'}`];
  const showSuggest = typed.length > 4 && t < timeline.enter;
  return (
    <AbsoluteFill>
      <Night />
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {t > S.search[0] - 0.4 && (
          <div style={{ opacity: interpolate(t, [S.search[0] - 0.4, S.search[0]], [0, 1], clamp) }}>
            <SearchBar text={typed} caret={caret} y={barY} />
          </div>
        )}
        {showSuggest && (
          <div
            style={{
              position: 'absolute',
              top: 1020,
              left: 70,
              width: 940,
              borderRadius: 34,
              background: '#f4f3ee',
              padding: '18px 0',
              fontFamily: FONT.body,
              fontSize: 34,
              color: '#1b1c22',
              opacity: interpolate(typed.length, [4, 7], [0, 1], clamp),
            }}
          >
            {sugg.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '20px 44px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9a9ba5" strokeWidth="2.4" strokeLinecap="round">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m20 20-4.6-4.6" />
                </svg>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.startsWith(typed) ? (
                    <>
                      {typed}
                      <b>{s.slice(typed.length)}</b>
                    </>
                  ) : (
                    s
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
        {res > 0 &&
          [0, 1, 3, 4].map((g, i) => (
            <div key={g} style={{ opacity: interpolate(t, [timeline.enter + 0.2 + i * 0.1, timeline.enter + 0.5 + i * 0.1], [0, 1], clamp) }}>
              <ResultRow i={g} y={460 + i * 270} blur={5} />
            </div>
          ))}
      </AbsoluteFill>
      <Caption text="Antes de marcar, o paciente *pesquisa seu nome.*" at={8} out={sec(timeline.typing.start) - 10} y={700} size={92} width={920} color="#f4f3ee" emColor={P.accent} />
      <FilmFinish grain={0.07} vignette={0.65} />
    </AbsoluteFill>
  );
};

// ─── 9–16 s: informações soltas ────────────────────────────────────
const Fragment: React.FC<{ kind: string; label: string }> = ({ kind, label }) => {
  const row = (w: string, strong = false, key?: number) => (
    <div key={key} style={{ height: strong ? 'auto' : 16, width: w, borderRadius: 8, background: strong ? 'none' : '#d9dccf', marginTop: 16 }} />
  );
  return (
    <div
      style={{
        width: 620,
        padding: '30px 34px 34px',
        borderRadius: 26,
        background: '#eceee5',
        boxShadow: '0 40px 80px -30px rgba(0,0,0,.8)',
        fontFamily: FONT.body,
        color: '#2a2f27',
      }}
    >
      <div style={{ fontSize: 22, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#80877a' }}>{label}</div>
      {kind === 'guide' && (
        <>
          {row('80%')}
          <div style={{ marginTop: 18, padding: '14px 18px', borderRadius: 12, background: '#ffffff', fontSize: 27, lineHeight: 1.35 }}>
            <b>{clinic.name.replace(/^dra?\.?\s+/i, '')}</b>
            <br />
            {cap(clinic.term.one)} · (67) ••••-••••
          </div>
          {row('70%')}
          {row('86%')}
        </>
      )}
      {kind === 'directory' && (
        <>
          <div style={{ marginTop: 14, fontSize: 32, fontFamily: FONT.heading }}>
            {cap(clinic.term.many)} em {clinic.city}
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 14 }}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} style={{ width: 72, height: 72, borderRadius: '50%', background: i === 2 ? '#c4c9b8' : '#d9dccf', display: 'grid', placeItems: 'center', fontSize: 24, color: '#6d7468' }}>
                {i === 2 ? initials : ''}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 25, color: '#80877a' }}>e muitos outros perfis iguais</div>
        </>
      )}
      {kind === 'social' && (
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 22 }}>
          <span style={{ width: 92, height: 92, borderRadius: '50%', background: '#d9dccf' }} />
          <div style={{ fontSize: 30, lineHeight: 1.35 }}>
            {short}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#80877a', fontSize: 26 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Perfil privado
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Scatter: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS + S.scatter[0];
  // posição, giro e deriva de cada fragmento
  const spots = [
    { x: 70, y: 470, r: -5 },
    { x: 390, y: 860, r: 4 },
    { x: 110, y: 1260, r: -3 },
  ];
  const frags = timeline.fragments.filter((fr) => fr.kind !== 'guide' || clinic.plans.length > 0);
  const gray = interpolate(t, [12.5, 15.5], [0.3, 1], clamp);
  return (
    <AbsoluteFill>
      <Night />
      {/* os resultados da busca se desfazem */}
      <AbsoluteFill style={{ opacity: interpolate(t, [9, 9.6], [0.6, 0], clamp), transform: `scale(${interpolate(t, [9, 9.6], [1, 1.1], clamp)})`, filter: 'blur(6px)' }}>
        {[0, 1, 3].map((g, i) => (
          <ResultRow key={g} i={g} y={460 + i * 270} blur={4} />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ filter: `grayscale(${gray}) contrast(${1 - gray * 0.12})` }}>
        {frags.map((fr, i) => {
          const s = spots[i % spots.length];
          const p = spring({ frame: f - at(fr.at, 'scatter'), fps: FPS, config: { damping: 16, mass: 0.8, stiffness: 110 } });
          const drift = (f - at(fr.at, 'scatter')) / FPS;
          const apart = interpolate(t, [13.2, 16], [0, 1], { ...clamp, easing: ease });
          return (
            <div
              key={fr.kind}
              style={{
                position: 'absolute',
                left: s.x + drift * (i % 2 ? 6 : -5) + apart * (i % 2 ? 160 : -160),
                top: s.y + drift * 4 + apart * (i - 1) * 120,
                opacity: p * (1 - apart * 0.55),
                transform: `rotate(${s.r + drift * (i % 2 ? 0.6 : -0.5) + apart * s.r}deg) scale(${0.85 + p * 0.15})`,
                filter: `blur(${apart * 6}px)`,
              }}
            >
              <Fragment kind={fr.kind} label={fr.label} />
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${P.night}ee 0%, transparent 22%, transparent 70%, ${P.night}f2 88%)` }} />
      <Caption text="E encontra só *informações soltas.*" at={6} out={at(12.6, 'scatter')} y={190} size={84} color="#f4f3ee" emColor={P.accent} />
      <Caption text="Nada que mostre *quem você é.*" at={at(12.9, 'scatter')} y={1600} size={88} color="#f4f3ee" emColor={P.accent} />
      <FilmFinish grain={0.07} vignette={0.7} />
    </AbsoluteFill>
  );
};

// ─── 16–20,5 s: mais uma na lista ──────────────────────────────────
export const Crowd: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS + S.crowd[0];
  const cols = 4;
  const rows = 9;
  const cw = 300;
  const ch = 330;
  const her = { c: 1, r: 4 };
  const pick = { c: 2, r: 5 };
  const pickT = timeline.crowdPick;
  // começa no card dela e abre para a multidão de perfis iguais
  const zoom = interpolate(t, [16, 18.4], [2.1, 0.86], { ...clamp, easing: ease });
  const cx = (c: number) => (W - cols * cw) / 2 + c * cw;
  const cy = (r: number) => (H - rows * ch) / 2 + r * ch;
  const herX = cx(her.c) + cw / 2;
  const herY = cy(her.r) + ch / 2;
  const ox = interpolate(zoom, [0.86, 2.1], [W / 2, herX]);
  const oy = interpolate(zoom, [0.86, 2.1], [H / 2, herY]);
  const press = interpolate(t, [pickT - 0.03, pickT + 0.05, pickT + 0.2], [0, 1, 0], clamp);
  const picked = t >= pickT;
  const curX = interpolate(t, [18.5, pickT - 0.1], [W + 40, 0], { ...clamp, easing: ease });
  const curY = interpolate(t, [18.5, pickT - 0.1], [H - 200, 0], { ...clamp, easing: ease });
  // posição do cursor na tela, sobre o card escolhido (depois do zoom)
  const px = (cx(pick.c) + cw * 0.55 - ox) * zoom + W / 2;
  const py = (cy(pick.r) + ch * 0.5 - oy) * zoom + H / 2;
  return (
    <AbsoluteFill>
      <Night />
      <AbsoluteFill style={{ transform: `translate(${W / 2 - ox}px, ${H / 2 - oy}px) scale(${zoom})`, transformOrigin: `${ox}px ${oy}px` }}>
        {Array.from({ length: rows * cols }, (_, k) => {
          const c = k % cols;
          const r = Math.floor(k / cols);
          const isHer = c === her.c && r === her.r;
          const isPick = c === pick.c && r === pick.r;
          const lift = isPick && picked ? spring({ frame: f - at(pickT, 'crowd'), fps: FPS, config: { damping: 14 } }) : 0;
          const dim = isHer ? interpolate(t, [18.6, 19.4], [1, 0.55], clamp) : 1;
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: cx(c) + 14,
                top: cy(r) + 14,
                width: cw - 28,
                height: ch - 28,
                borderRadius: 24,
                background: isPick && picked ? '#ffffff' : '#e3e6dc',
                opacity: (0.55 + random(`o${k}`) * 0.25) * dim + (isHer ? 0.25 : 0),
                transform: `translateY(${-lift * 18}px) scale(${1 + lift * 0.06})`,
                boxShadow: isPick && picked ? `0 30px 60px -20px rgba(0,0,0,.8), 0 0 0 4px ${P.accent}` : 'none',
                padding: 24,
                fontFamily: FONT.body,
              }}
            >
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#c7ccbd', display: 'grid', placeItems: 'center', fontSize: 34, color: '#6d7468' }}>
                {isHer ? initials : ''}
              </div>
              {isHer ? (
                <div style={{ marginTop: 22, fontSize: 26, color: '#4c5347', lineHeight: 1.3 }}>
                  {short}
                  <div style={{ fontSize: 21, color: '#80877a' }}>{cap(clinic.term.one)}</div>
                </div>
              ) : (
                <>
                  <div style={{ marginTop: 26, height: 18, width: '80%', borderRadius: 9, background: '#c7ccbd' }} />
                  <div style={{ marginTop: 14, height: 14, width: '60%', borderRadius: 7, background: '#d3d7ca' }} />
                </>
              )}
              <div style={{ marginTop: 22, height: 44, width: '100%', borderRadius: 22, background: isPick && picked ? P.primary : '#d3d7ca' }} />
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${P.night}f5 0%, ${P.night}99 16%, transparent 30%, transparent 66%, ${P.night}f2 84%)` }} />
      {t > 18.5 && <Cursor x={Math.min(px + curX, W - 40)} y={Math.min(py + curY, H - 40)} press={press} />}
      <Caption text={`Em plataformas genéricas, você é *${one} na lista.*`} at={8} out={at(19.2, 'crowd')} y={150} size={80} color="#f4f3ee" emColor={P.accent} />
      <Caption text="E o paciente escolhe *outro perfil.*" at={at(19.45, 'crowd')} y={1600} size={88} color="#f4f3ee" emColor={P.accent} />
      <FilmFinish grain={0.07} vignette={0.7} />
    </AbsoluteFill>
  );
};

// ─── 20,5–22,5 s: virada para a luz ────────────────────────────────
export const Turn: React.FC = () => {
  const f = useCurrentFrame();
  const open = interpolate(f, [4, 26], [0, 1], { ...clamp, easing: ease });
  const flash = interpolate(f, [2, 6, 18], [0, 0.9, 0], clamp);
  return (
    <AbsoluteFill>
      <Night />
      {/* o claro se abre do centro, como uma cortina de luz */}
      <AbsoluteFill style={{ clipPath: `circle(${open * 120}% at 50% 50%)` }}>
        <Daylight />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#ffffff', opacity: flash }} />
      <Caption text="Com *marca própria,* é diferente." at={14} y={860} size={100} color={P.text} emColor={P.primary} />
      <FilmFinish grain={0.04} vignette={0.25} />
    </AbsoluteFill>
  );
};

// ─── 22,5–26 s: o resultado é o site dela ──────────────────────────
export const Result: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS + S.result[0];
  const typedN = Math.min(query.length, Math.max(0, Math.floor((f - 2) * 3)));
  const show = interpolate(t, [timeline.resultEnter + 0.05, timeline.resultEnter + 0.55], [0, 1], { ...clamp, easing: ease });
  const click = timeline.click;
  const press = interpolate(t, [click - 0.03, click + 0.05, click + 0.18], [0, 1, 0], clamp);
  const cx = interpolate(t, [23.8, click - 0.1], [880, 480], { ...clamp, easing: ease });
  const cy = interpolate(t, [23.8, click - 0.1], [1640, 760], { ...clamp, easing: ease });
  const dive = interpolate(t, [click + 0.15, S.result[1]], [0, 1], { ...clamp, easing: (x) => x * x * x });
  return (
    <AbsoluteFill>
      <Daylight />
      <AbsoluteFill style={{ transform: `scale(${1 + dive * 1.6})`, transformOrigin: '50% 38%', filter: `blur(${dive * 10}px)`, opacity: 1 - dive * 0.9 }}>
        <SearchBar text={query.slice(0, typedN)} caret={typedN < query.length} y={250} light />
        <div
          style={{
            position: 'absolute',
            top: 440,
            left: 60,
            width: 960,
            padding: '40px 40px 44px',
            borderRadius: 34,
            background: 'rgba(255,255,255,.88)',
            border: `1.5px solid ${P.primary}55`,
            boxShadow: `0 0 0 8px ${P.primary}12, 0 40px 90px -40px ${P.primary}aa`,
            fontFamily: FONT.body,
            opacity: show,
            transform: `translateY(${(1 - show) * 40}px) scale(${1 + press * -0.012})`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Medallion size={86} glow={0.5} />
            <div>
              <div style={{ color: P.text, fontSize: 32 }}>{clinic.clinicName}</div>
              <div style={{ color: '#7d8577', fontSize: 25, marginTop: 4 }}>{clinic.url}</div>
            </div>
          </div>
          <div style={{ marginTop: 26, fontFamily: FONT.heading, fontWeight: FONT.weight, fontSize: 54, lineHeight: 1.1, color: P.primary }}>{clinic.seoTitle}</div>
          <div style={{ marginTop: 18, fontSize: 29, lineHeight: 1.45, color: mix(P.text, P.bg, 0.25) }}>{clinic.seoDescription}</div>
        </div>
        {[1, 3].map((g, i) => (
          <div key={g} style={{ opacity: show * 0.4 }}>
            <ResultRow i={g} y={1220 + i * 270} blur={6} dark={false} />
          </div>
        ))}
        {t > 23.7 && <Cursor x={cx} y={cy} press={press} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: P.bg, opacity: dive }} />
      <FilmFinish grain={0.035} vignette={0.25} />
    </AbsoluteFill>
  );
};

// ─── 26–35,5 s: o site no computador ───────────────────────────────
export const Desktop: React.FC = () => {
  const f = useCurrentFrame();
  let acc = 0;
  const seqs = timeline.desktopClips.map((c) => {
    const from = sec(acc);
    acc += c.seconds;
    return { ...c, trim: c.from, from, dur: sec(c.seconds) };
  });
  const enter = spring({ frame: f, fps: FPS, config: { damping: 200 }, durationInFrames: 22 });
  const width = 1000;
  const tilt = interpolate(f, [0, sec(9.5)], [8, 2]);
  const sway = Math.sin(f / 50) * 2.5;
  const cur = seqs.findLast((s) => f >= s.from) ?? seqs[0];
  const next = seqs.find((s) => s.from > f);
  return (
    <AbsoluteFill>
      <Daylight />
      <div style={{ position: 'absolute', top: 230, width: W, textAlign: 'center', fontFamily: FONT.body, fontSize: 28, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.primary, opacity: enter }}>
        {short} · {clinic.title}
      </div>
      <div style={{ position: 'absolute', top: 620, left: (W - width) / 2, perspective: 2600 }}>
        <div
          style={{
            transform: `scale(${interpolate(enter, [0, 1], [1.4, 1])}) rotateX(${tilt}deg) rotateY(${sway}deg)`,
            filter: `blur(${(1 - enter) * 12}px) drop-shadow(0 50px 60px ${P.primary}55)`,
            transformOrigin: '50% 40%',
          }}
        >
          <BrowserFrame width={width} url={clinic.url}>
            {seqs.map((s) => {
              const local = f - s.from;
              const zoom = interpolate(local, [0, s.dur], [1.02, 1.14]);
              return (
                <Sequence key={s.name} from={s.from} durationInFrames={s.dur} layout="none">
                  <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${s.focus[0] * 100}% ${s.focus[1] * 100}%` }}>
                    <OffthreadVideo src={staticFile(`captures/${s.name}.mp4`)} trimBefore={sec(s.trim)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </AbsoluteFill>
                  <AbsoluteFill style={{ background: '#fff', opacity: interpolate(local, [0, 5], [s.from === 0 ? 0 : 0.35, 0], clamp) }} />
                </Sequence>
              );
            })}
          </BrowserFrame>
        </div>
      </div>
      <Caption key={cur.name} text={cur.caption} at={cur.from + 4} out={next ? next.from - 8 : undefined} y={1420} size={80} width={960} color={P.text} emColor={P.primary} />
      <FilmFinish grain={0.03} vignette={0.2} />
    </AbsoluteFill>
  );
};

// ─── 35,5–42 s: o site no celular ──────────────────────────────────
export const Mobile: React.FC = () => {
  const f = useCurrentFrame();
  const mc = timeline.mobileClip;
  const events = clip(mc.name).events as { label: string; t: number; x?: number; y?: number }[];
  const width = 560;
  const scr = phoneScreen(width);
  const turn = spring({ frame: f, fps: FPS, config: { damping: 18, mass: 1.1, stiffness: 70 } });
  const ry = interpolate(turn, [0, 1], [-70, 0]) + Math.sin(f / 40) * 3;
  const rx = interpolate(turn, [0, 1], [20, 4]);
  const ty = interpolate(turn, [0, 1], [240, 0]) + Math.sin(f / 35) * 6;
  return (
    <AbsoluteFill>
      <Daylight />
      <Caption text="Perfeito no celular, onde estão *seus pacientes.*" at={10} y={150} size={80} width={960} color={P.text} emColor={P.primary} />
      <div style={{ position: 'absolute', top: 480, left: (W - width) / 2, perspective: 2200 }}>
        <div style={{ transform: `translateY(${ty}px) rotateX(${rx}deg) rotateY(${ry}deg)`, filter: `drop-shadow(0 60px 60px ${P.primary}55)` }}>
          <PhoneFrame width={width}>
            <OffthreadVideo src={staticFile(`captures/${mc.name}.mp4`)} trimBefore={sec(mc.from)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {events
              .filter((e) => e.x !== undefined)
              .map((e) => {
                const tf = sec(e.t - mc.from);
                const r = interpolate(f, [tf, tf + 20], [0, 1], clamp);
                if (f < tf - 2 || f > tf + 24) return null;
                return (
                  <div
                    key={e.label}
                    style={{
                      position: 'absolute',
                      left: (e.x! / 390) * scr.w - 60,
                      top: (e.y! / 844) * scr.h - 60,
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,.4)',
                      border: '3px solid rgba(255,255,255,.85)',
                      transform: `scale(${0.4 + r * 1.4})`,
                      opacity: 1 - r * 0.9,
                    }}
                  />
                );
              })}
          </PhoneFrame>
        </div>
      </div>
      <FilmFinish grain={0.03} vignette={0.2} />
    </AbsoluteFill>
  );
};

// ─── 42–46 s: o que um site próprio entrega ───────────────────────
const PillarIcon: React.FC<{ icon: string; p: number }> = ({ icon, p }) => (
  <div style={{ position: 'relative', width: 150, height: 150, flex: 'none' }}>
    <svg width="150" height="150" viewBox="0 0 150 150" style={{ position: 'absolute', inset: 0 }}>
      <circle cx="75" cy="75" r="68" fill="#ffffff" stroke={`${P.primary}33`} strokeWidth="2" />
      {icon === 'gauge' && (
        <circle cx="75" cy="75" r="68" fill="none" stroke={P.primary} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${p * 427} 427`} transform="rotate(-90 75 75)" />
      )}
    </svg>
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: P.primary }}>
      {icon === 'gauge' ? (
        <span style={{ fontFamily: FONT.heading, fontSize: 52 }}>{Math.round(p * 100)}</span>
      ) : (
        <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {icon === 'spark' ? (
            <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9L12 3.5ZM18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
          ) : (
            <>
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m20 20-4.6-4.6" />
            </>
          )}
        </svg>
      )}
    </div>
  </div>
);

export const Pillars: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Daylight />
      <Caption text="O que um site *próprio* entrega:" at={4} y={250} size={86} color={P.text} emColor={P.primary} />
      {timeline.pillars.map((pl, i) => {
        const lf = at(pl.at, 'pillars');
        const p = spring({ frame: f - lf, fps: FPS, config: { damping: 200 }, durationInFrames: 18 });
        const fill = interpolate(f, [lf + 4, lf + 30], [0, 1], { ...clamp, easing: ease });
        return (
          <div
            key={pl.title}
            style={{
              position: 'absolute',
              top: 640 + i * 330,
              left: 90,
              width: 900,
              display: 'flex',
              alignItems: 'center',
              gap: 44,
              opacity: p,
              transform: `translateX(${(1 - p) * 80}px)`,
              filter: `blur(${(1 - p) * 10}px)`,
            }}
          >
            <PillarIcon icon={pl.icon} p={fill} />
            <div>
              <div style={{ fontFamily: FONT.heading, fontSize: 76, lineHeight: 1, color: P.text }}>{pl.title}</div>
              <div style={{ marginTop: 14, fontFamily: FONT.body, fontSize: 34, lineHeight: 1.3, color: mix(P.text, P.bg, 0.25) }}>
                {pl.text.replace('{clinic}', clinic.clinicName)}
              </div>
            </div>
          </div>
        );
      })}
      <FilmFinish grain={0.03} vignette={0.2} />
    </AbsoluteFill>
  );
};

// ─── 46–51 s: fechamento ───────────────────────────────────────────
export const Closing: React.FC = () => {
  const f = useCurrentFrame();
  const logoF = at(timeline.logoIn, 'closing');
  const tagF = at(timeline.tagIn, 'closing');
  const wipe = interpolate(f, [logoF - 14, logoF + 4], [0, 1], { ...clamp, easing: ease });
  const logo = interpolate(f, [logoF, logoF + 18], [0, 1], { ...clamp, easing: ease });
  const shine = interpolate(f, [logoF + 6, logoF + 34], [-0.4, 1.4], clamp);
  const med = spring({ frame: f, fps: FPS, config: { damping: 200 }, durationInFrames: 20 });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% 40%, ${mix(P.primary, P.night, 0.35)}, ${P.night} 80%)` }} />
      <Lattice color={P.secondary} opacity={0.06} />
      <div style={{ position: 'absolute', top: 470, width: W, display: 'flex', justifyContent: 'center', opacity: (1 - wipe) * med, transform: `scale(${0.9 + med * 0.1})` }}>
        <Medallion size={230} />
      </div>
      <Caption text="Sua marca. Seu site." at={8} out={logoF - 14} y={850} size={96} color="#f4f3ee" emColor={P.accent} />
      <Caption text="*Seus pacientes.*" at={24} out={logoF - 12} y={970} size={110} color="#f4f3ee" emColor={P.accent} />

      <AbsoluteFill style={{ background: `radial-gradient(60% 30% at 50% 45%, ${P.secondary}33, transparent 70%)`, opacity: wipe }} />
      <div style={{ position: 'absolute', top: 690, left: 90, width: 900, opacity: logo, transform: `scale(${0.9 + logo * 0.1})`, filter: `blur(${(1 - logo) * 10}px)` }}>
        <Img src={staticFile('brand/vincere-logo.png')} style={{ width: '100%' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(105deg, transparent ${shine * 100 - 10}%, rgba(255,255,255,.55) ${shine * 100}%, transparent ${shine * 100 + 10}%)`,
            mixBlendMode: 'overlay',
          }}
        />
      </div>
      <Caption text="Responda esta mensagem e *coloque no ar.*" at={tagF} y={1130} size={72} width={900} color="#f4f3ee" emColor={P.accent} />
      <FilmFinish grain={0.045} vignette={0.4} />
    </AbsoluteFill>
  );
};
