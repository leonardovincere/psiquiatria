import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, Easing } from 'remotion';
import { C, FONT, clinic } from './theme';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Legenda grande: cada palavra entra em foco (desfoque + subida curta). Trecho entre *asteriscos* sai em itálico dourado. */
export const Caption: React.FC<{
  text: string;
  at: number;
  out?: number;
  size?: number;
  color?: string;
  y?: number;
  align?: 'center' | 'left';
  width?: number;
  emColor?: string;
}> = ({ text, at, out, size = 84, color = C.ivory, y = 300, align = 'center', width = 920, emColor = C.gold }) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 12)) return null;
  const leave = out === undefined ? 0 : interpolate(f, [out, out + 10], [0, 1], clamp);
  let em = false;
  const words = text.split(' ').map((w) => {
    const starts = w.startsWith('*');
    if (starts) em = true;
    const item = { w: w.replace(/\*/g, ''), em };
    if (w.endsWith('*')) em = false;
    return item;
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: (1080 - width) / 2,
        width,
        textAlign: align,
        fontFamily: FONT.heading,
        fontWeight: FONT.weight,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: '-0.015em',
        color,
        opacity: 1 - leave,
        filter: `blur(${leave * 12}px)`,
        textShadow: '0 4px 30px rgba(0,0,0,.45)',
      }}
    >
      {words.map((it, i) => {
        const p = interpolate(f, [at + i * 3, at + i * 3 + 14], [0, 1], { ...clamp, easing: ease });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.24em',
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px)`,
              filter: `blur(${(1 - p) * 14}px)`,
              fontStyle: it.em ? 'italic' : 'normal',
              color: it.em ? emColor : undefined,
            }}
          >
            {it.w}
          </span>
        );
      })}
    </div>
  );
};

/** Granulação de filme (troca a cada 3 quadros para não pesar no arquivo) e vinheta. */
export const FilmFinish: React.FC<{ grain?: number; vignette?: number }> = ({ grain = 0.06, vignette = 0.55 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 3);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity: grain, mixBlendMode: 'overlay' }}>
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, transparent 45%, rgba(0,0,0,${vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};

/** Fundo noturno da clínica, com brilho azul que respira devagar. */
export const NightSky: React.FC<{ glow?: number }> = ({ glow = 1 }) => {
  const f = useCurrentFrame();
  const x = 50 + Math.sin(f / 90) * 12;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(90% 55% at ${x}% 30%, ${C.blue}${Math.round(0x40 * glow).toString(16).padStart(2, '0')} 0%, transparent 65%),
          radial-gradient(70% 45% at 30% 95%, ${C.gold}22, transparent 70%), ${C.bg}`,
      }}
    />
  );
};

/** Rede de pontos dourados (eco da rede neural do site), para o fechamento. */
export const Constellation: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const f = useCurrentFrame();
  const pts = Array.from({ length: 46 }, (_, i) => ({
    x: random(`x${i}`) * 1080 + Math.sin(f / 60 + i) * 8,
    y: random(`y${i}`) * 1920 + Math.cos(f / 70 + i) * 8,
  }));
  const lines: React.ReactNode[] = [];
  pts.forEach((a, i) =>
    pts.slice(i + 1).forEach((b, j) => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 230) lines.push(<line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.blue} strokeOpacity={(1 - d / 230) * 0.5} strokeWidth={1.2} />);
    }),
  );
  return (
    <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity }}>
      {lines}
      {pts.map((p, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(f / 9 + i * 1.3);
        return <circle key={i} cx={p.x} cy={p.y} r={2 + pulse * 2} fill={pulse > 0.85 ? C.gold : C.blue} opacity={0.5 + pulse * 0.5} />;
      })}
    </svg>
  );
};

/** Moldura de navegador. `children` é a tela (proporção 1440×900). */
export const BrowserFrame: React.FC<{ width: number; url: string; children: React.ReactNode }> = ({ width, url, children }) => {
  const bar = Math.round(width * 0.058);
  return (
    <div
      style={{
        width,
        borderRadius: Math.round(width * 0.018),
        overflow: 'hidden',
        background: '#11131f',
        boxShadow: '0 60px 120px -30px rgba(0,0,0,.85), 0 0 0 1.5px rgba(255,255,255,.09), 0 0 80px -10px ' + C.blue + '55',
      }}
    >
      <div style={{ height: bar, display: 'flex', alignItems: 'center', gap: bar * 0.22, padding: `0 ${bar * 0.4}px`, background: '#161929' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} style={{ width: bar * 0.24, height: bar * 0.24, borderRadius: '50%', background: c, opacity: 0.85 }} />
        ))}
        <div
          style={{
            flex: 1,
            marginLeft: bar * 0.4,
            height: bar * 0.56,
            borderRadius: bar,
            background: '#0b0d18',
            color: 'rgba(255,255,255,.72)',
            fontFamily: FONT.body,
            fontSize: bar * 0.3,
            display: 'flex',
            alignItems: 'center',
            gap: bar * 0.16,
            padding: `0 ${bar * 0.3}px`,
          }}
        >
          <svg width={bar * 0.26} height={bar * 0.26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          {url}
        </div>
      </div>
      <div style={{ width, height: (width * 900) / 1440, position: 'relative', overflow: 'hidden', background: C.bg }}>{children}</div>
    </div>
  );
};

/** Moldura de celular (proporção de tela 390×844). */
export const PhoneFrame: React.FC<{ width: number; children: React.ReactNode }> = ({ width, children }) => {
  const pad = width * 0.04;
  const screenW = width - pad * 2;
  const screenH = (screenW * 844) / 390;
  return (
    <div
      style={{
        width,
        padding: pad,
        borderRadius: width * 0.16,
        background: 'linear-gradient(145deg,#3a3d4a,#15161d 40%,#26283a)',
        boxShadow: '0 70px 140px -30px rgba(0,0,0,.9), inset 0 0 0 2px rgba(255,255,255,.12), 0 0 90px -10px ' + C.gold + '33',
      }}
    >
      <div style={{ width: screenW, height: screenH, borderRadius: width * 0.125, overflow: 'hidden', position: 'relative', background: '#000' }}>
        {children}
        <div
          style={{
            position: 'absolute',
            top: screenW * 0.025,
            left: '50%',
            transform: 'translateX(-50%)',
            width: screenW * 0.3,
            height: screenW * 0.085,
            borderRadius: 99,
            background: '#000',
          }}
        />
      </div>
    </div>
  );
};

export const phoneScreen = (width: number) => {
  const screenW = width - width * 0.08;
  return { w: screenW, h: (screenW * 844) / 390 };
};

/** Cursor de seta (sem marca de sistema). */
export const Cursor: React.FC<{ x: number; y: number; press?: number }> = ({ x, y, press = 0 }) => (
  <svg
    width="54"
    height="54"
    viewBox="0 0 24 24"
    style={{ position: 'absolute', left: x, top: y, transform: `scale(${1 - press * 0.18})`, transformOrigin: '10% 10%', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.5))' }}
  >
    <path d="M4 2l15 11.2-6.6 1.2 3.9 7.3-2.7 1.4-3.9-7.4L4 20.4z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

/** Monograma com as iniciais, como no site. */
export const Monogram: React.FC<{ size: number }> = ({ size }) => {
  const ini = clinic.shortName
    .replace(/^(dra?\.?)\s+/i, '')
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1.5px solid ${C.gold}`,
        boxShadow: `inset 0 0 0 ${size * 0.06}px ${C.bg}, inset 0 0 0 ${size * 0.07}px ${C.gold}88`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT.heading,
        fontStyle: 'italic',
        fontSize: size * 0.42,
        color: C.gold,
        background: C.bg,
      }}
    >
      {ini}
    </div>
  );
};
