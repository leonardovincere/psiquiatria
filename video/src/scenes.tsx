import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, FPS, H, W, charTime, clinic, clip, query, sec, shortName, timeline } from './theme';
import { BrowserFrame, Caption, Constellation, Cursor, FilmFinish, Monogram, NightSky, PhoneFrame, ease, phoneScreen } from './ui';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const S = timeline.scenes;
const at = (s: number, scene: keyof typeof S) => sec(s - S[scene][0]);

// ─── Barra de busca genérica (sem marca de buscador) ──────────────
const SearchBar: React.FC<{ text: string; caret: boolean; y: number; scale?: number }> = ({ text, caret, y, scale = 1 }) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      left: 70,
      width: 940,
      height: 124,
      borderRadius: 62,
      background: '#f6f5f2',
      boxShadow: '0 30px 80px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.2)',
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      padding: '0 44px',
      fontFamily: FONT.body,
      fontSize: 40,
      color: '#1b1c22',
      transform: `scale(${scale})`,
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

// Resultados genéricos e borrados: nunca nomes reais.
const GENERIC = [
  ['diretório de profissionais de saúde', 'Psiquiatras em Campo Grande — lista com avaliações'],
  ['clínica de saúde mental', 'Psiquiatria e psicologia — agende sua consulta'],
  ['portal de agendamento', 'Encontre um psiquiatra perto de você'],
  ['clínica médica', 'Consultas em psiquiatria com horários hoje'],
  ['guia de especialistas', 'Os profissionais de psiquiatria da sua região'],
];
const ResultCard: React.FC<{ i: number; y: number; blur: number; dim?: number }> = ({ i, y, blur, dim = 1 }) => {
  const [site, title] = GENERIC[i % GENERIC.length];
  return (
    <div style={{ position: 'absolute', top: y, left: 80, width: 920, fontFamily: FONT.body, opacity: dim, filter: `blur(${blur}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#9ea3b8', fontSize: 26 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', background: '#2a2e45' }} />
        {site}
      </div>
      <div style={{ marginTop: 14, fontSize: 38, color: '#b9c3ff' }}>{title}</div>
      <div style={{ marginTop: 14, height: 18, width: '92%', borderRadius: 9, background: '#2a2e45' }} />
      <div style={{ marginTop: 12, height: 18, width: '70%', borderRadius: 9, background: '#2a2e45' }} />
    </div>
  );
};

// ─── 0–11 s: gancho, busca e a dor ────────────────────────────────
export const SearchStage: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const typed = query.slice(0, query.split('').filter((_, i) => charTime(i) <= t).length);
  const caret = Math.floor(f / 15) % 2 === 0 || (t > timeline.typing.start && t < charTime(query.length - 1) + 0.2);
  const pain = S.pain[0];
  const showSuggest = typed.length > 4 && t < timeline.enter;
  const results = interpolate(t, [pain - 0.1, pain + 0.5], [0, 1], { ...clamp, easing: ease });
  const barY = interpolate(results, [0, 1], [900, 250]);
  const zoom = interpolate(t, [0, pain], [1.06, 1]) * interpolate(t, [pain, S.turn[0]], [1, 1.14], clamp);
  const sugg = [
    query,
    `${query} ${clinic.city.toLowerCase()}`,
    `psiquiatra em ${clinic.city.toLowerCase()}`,
    `psiquiatra infantil ${clinic.city.toLowerCase()}`,
  ];
  const shake = t > pain ? Math.sin(f * 1.7) * 2 * interpolate(t, [pain, pain + 0.4], [1, 0], clamp) : 0;
  return (
    <AbsoluteFill style={{ background: '#05060d' }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${shake}px)`, filter: t > pain ? `saturate(${interpolate(t, [pain, S.turn[0]], [1, 0.4], clamp)})` : undefined }}>
        <AbsoluteFill style={{ background: `radial-gradient(70% 40% at 50% 47%, ${C.blue}26, transparent 70%)` }} />
        <SearchBar text={typed} caret={caret} y={barY} />
        {showSuggest && (
          <div
            style={{
              position: 'absolute',
              top: 1040,
              left: 70,
              width: 940,
              borderRadius: 34,
              background: '#f6f5f2',
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
        {results > 0 &&
          [0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ opacity: interpolate(t, [pain + 0.1 + i * 0.08, pain + 0.4 + i * 0.08], [0, 1], clamp) }}>
              <ResultCard i={i} y={460 + i * 270} blur={6} />
            </div>
          ))}
      </AbsoluteFill>
      {t > pain && <AbsoluteFill style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(5,6,13,.92) 72%)' }} />}
      <Caption text="Um paciente acabou de procurar por *você.*" at={6} out={sec(timeline.typing.start) - 6} y={560} size={88} />
      <Caption text="E encontrou *outro profissional.*" at={sec(pain + 0.45)} y={1430} size={92} />
      <FilmFinish grain={0.07} vignette={0.7} />
    </AbsoluteFill>
  );
};

// ─── 11–13 s: virada ──────────────────────────────────────────────
export const Turn: React.FC = () => {
  const f = useCurrentFrame();
  const glitch = f < 12;
  const flash = interpolate(f, [2, 4, 9], [0, 1, 0], clamp);
  const slices = Array.from({ length: 9 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {glitch &&
        slices.map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: Math.sin((f + 1) * (i + 3)) * 90,
              top: (i * H) / 9,
              width: W,
              height: H / 9 + 2,
              background: i % 3 === 0 ? `${C.blue}` : i % 3 === 1 ? '#0a0b16' : `${C.gold}55`,
              opacity: 0.5 + 0.5 * Math.sin(f * 7 + i),
              mixBlendMode: 'screen',
            }}
          />
        ))}
      <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
      <Caption text="Agora *imagine* isto:" at={14} y={860} size={104} />
      <FilmFinish grain={0.08} vignette={0.6} />
    </AbsoluteFill>
  );
};

// ─── 13–17 s: o resultado é o site dele ───────────────────────────
export const Result: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS + S.result[0];
  const typedN = Math.min(query.length, Math.max(0, Math.floor((f - 2) * 3)));
  const show = interpolate(t, [timeline.resultEnter + 0.05, timeline.resultEnter + 0.55], [0, 1], { ...clamp, easing: ease });
  const click = timeline.click;
  const press = interpolate(t, [click - 0.03, click + 0.05, click + 0.18], [0, 1, 0], clamp);
  const cx = interpolate(t, [14.3, click - 0.1], [860, 470], { ...clamp, easing: ease });
  const cy = interpolate(t, [14.3, click - 0.1], [1620, 640], { ...clamp, easing: ease });
  const dive = interpolate(t, [click + 0.15, S.result[1]], [0, 1], { ...clamp, easing: Easing2 });
  return (
    <AbsoluteFill style={{ background: '#05060d' }}>
      <AbsoluteFill style={{ transform: `scale(${1 + dive * 1.6})`, transformOrigin: '50% 34%', filter: `blur(${dive * 10}px)`, opacity: 1 - dive * 0.9 }}>
        <AbsoluteFill style={{ background: `radial-gradient(70% 40% at 50% 35%, ${C.gold}1c, transparent 70%)` }} />
        <SearchBar text={query.slice(0, typedN)} caret={typedN < query.length} y={250} />
        <div
          style={{
            position: 'absolute',
            top: 440,
            left: 60,
            width: 960,
            padding: '40px 40px 44px',
            borderRadius: 34,
            background: 'linear-gradient(160deg, #11163a, #080a1c)',
            border: `1.5px solid ${C.gold}88`,
            boxShadow: `0 0 0 8px ${C.gold}14, 0 40px 100px -30px #000, 0 0 120px -20px ${C.gold}55`,
            fontFamily: FONT.body,
            opacity: show,
            transform: `translateY(${(1 - show) * 40}px) scale(${1 + press * -0.012})`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Monogram size={70} />
            <div>
              <div style={{ color: C.ivory, fontSize: 32 }}>{clinic.name}</div>
              <div style={{ color: '#9ea3b8', fontSize: 25, marginTop: 4 }}>{clinic.url}</div>
            </div>
          </div>
          <div style={{ marginTop: 26, fontFamily: FONT.heading, fontWeight: FONT.weight, fontSize: 56, lineHeight: 1.1, color: C.gold }}>
            {clinic.seoTitle}
          </div>
          <div style={{ marginTop: 18, fontSize: 29, lineHeight: 1.45, color: 'rgba(244,239,230,.82)' }}>{clinic.seoDescription}</div>
        </div>
        {[1, 2].map((i) => (
          <div key={i} style={{ opacity: show * 0.45 }}>
            <ResultCard i={i} y={1150 + (i - 1) * 270} blur={7} />
          </div>
        ))}
        {t > 14.2 && <Cursor x={cx} y={cy} press={press} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.bg, opacity: dive }} />
      <FilmFinish grain={0.06} vignette={0.6} />
    </AbsoluteFill>
  );
};
const Easing2 = (x: number) => x * x * x;

// ─── 17–27 s: o site no computador ────────────────────────────────
export const Desktop: React.FC = () => {
  const f = useCurrentFrame();
  const clips = timeline.desktopClips;
  let acc = 0;
  const seqs = clips.map((c) => {
    const from = sec(acc);
    acc += c.seconds;
    return { ...c, trim: c.from, from, dur: sec(c.seconds) };
  });
  const enter = spring({ frame: f, fps: FPS, config: { damping: 200 }, durationInFrames: 22 });
  const width = 1000;
  const tilt = interpolate(f, [0, sec(10)], [9, 2]);
  const sway = Math.sin(f / 50) * 2.5;
  // legenda: a de cada trecho; null mantém a anterior
  const capIdx = seqs.findLastIndex((s, i) => f >= s.from && seqs[i].caption !== null);
  const cap = seqs[capIdx];
  const capEnd = seqs.slice(capIdx + 1).find((s) => s.caption !== null);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* fundo: o mesmo trecho, ampliado e desfocado */}
      {seqs.map((s) => (
        <Sequence key={`bg-${s.name}`} from={s.from} durationInFrames={s.dur}>
          <AbsoluteFill style={{ filter: 'blur(40px) brightness(.45) saturate(1.3)', transform: 'scale(2.4)' }}>
            <OffthreadVideo src={staticFile(`captures/${s.name}.mp4`)} trimBefore={sec(s.trim)} muted />
          </AbsoluteFill>
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(5,7,26,.55), rgba(5,7,26,.15) 40%, rgba(5,7,26,.75))' }} />

      <div style={{ position: 'absolute', top: 210, width: W, textAlign: 'center', fontFamily: FONT.body, fontSize: 30, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold, opacity: enter }}>
        {shortName} · {clinic.title}
      </div>

      <div style={{ position: 'absolute', top: 640, left: (W - width) / 2, perspective: 2600 }}>
        <div
          style={{
            transform: `scale(${interpolate(enter, [0, 1], [1.5, 1])}) rotateX(${tilt}deg) rotateY(${sway}deg)`,
            filter: `blur(${(1 - enter) * 12}px)`,
            transformOrigin: '50% 40%',
          }}
        >
          <BrowserFrame width={width} url={clinic.url}>
            {seqs.map((s) => {
              const local = f - s.from;
              const zoom = interpolate(local, [0, s.dur], [1, 1.07]);
              return (
                <Sequence key={s.name} from={s.from} durationInFrames={s.dur} layout="none">
                  <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${s.focus[0] * 100}% ${s.focus[1] * 100}%` }}>
                    <OffthreadVideo src={staticFile(`captures/${s.name}.mp4`)} trimBefore={sec(s.trim)} muted />
                  </AbsoluteFill>
                  {/* corte com um flash curto de luz */}
                  <AbsoluteFill style={{ background: '#fff', opacity: interpolate(local, [0, 4], [s.from === 0 ? 0 : 0.18, 0], clamp) }} />
                </Sequence>
              );
            })}
          </BrowserFrame>
        </div>
      </div>

      {cap && (
        <Caption key={cap.name} text={cap.caption!} at={cap.from + 2} out={capEnd ? capEnd.from - 8 : undefined} y={1420} size={78} width={940} />
      )}
      <FilmFinish grain={0.05} vignette={0.5} />
    </AbsoluteFill>
  );
};

// ─── 27–34 s: o site no celular ───────────────────────────────────
export const Mobile: React.FC = () => {
  const f = useCurrentFrame();
  const mc = timeline.mobileClip;
  const tapEv = clip(mc.name).events.find((e) => e.label === 'tap')!;
  const tapF = sec(tapEv.t - mc.from);
  const width = 560;
  const scr = phoneScreen(width);
  const turn = spring({ frame: f, fps: FPS, config: { damping: 18, mass: 1.1, stiffness: 70 } });
  const ry = interpolate(turn, [0, 1], [-78, 0]) + Math.sin(f / 40) * 3;
  const rx = interpolate(turn, [0, 1], [22, 4]);
  const ty = interpolate(turn, [0, 1], [260, 0]) + Math.sin(f / 35) * 6;
  const tapP = interpolate(f, [tapF - 4, tapF, tapF + 18], [0, 1, 0], clamp);
  const ripple = interpolate(f, [tapF, tapF + 20], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <NightSky glow={1.3} />
      <AbsoluteFill style={{ filter: 'blur(50px) brightness(.4)', transform: 'scale(1.6)', opacity: 0.8 }}>
        <OffthreadVideo src={staticFile(`captures/${mc.name}.mp4`)} trimBefore={sec(mc.from)} muted />
      </AbsoluteFill>
      <Caption text="Perfeito no celular, onde seus *pacientes estão.*" at={10} y={150} size={80} width={960} />
      <div style={{ position: 'absolute', top: 470, left: (W - width) / 2, perspective: 2200 }}>
        <div style={{ transform: `translateY(${ty}px) rotateX(${rx}deg) rotateY(${ry}deg)`, transformStyle: 'preserve-3d' }}>
          <PhoneFrame width={width}>
            <OffthreadVideo src={staticFile(`captures/${mc.name}.mp4`)} trimBefore={sec(mc.from)} muted style={{ width: '100%', height: '100%' }} />
            {f >= tapF - 4 && f < tapF + 24 && (
              <div
                style={{
                  position: 'absolute',
                  left: (tapEv.x! / 390) * scr.w - 60,
                  top: (tapEv.y! / 844) * scr.h - 60,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,.35)',
                  border: '3px solid rgba(255,255,255,.8)',
                  transform: `scale(${0.4 + ripple * 1.4 + tapP * 0.2})`,
                  opacity: 1 - ripple * 0.9,
                }}
              />
            )}
          </PhoneFrame>
        </div>
      </div>
      <FilmFinish grain={0.05} vignette={0.5} />
    </AbsoluteFill>
  );
};

// ─── 34–38 s: computador e celular, lado a lado ───────────────────
export const Proof: React.FC = () => {
  const f = useCurrentFrame();
  const inP = spring({ frame: f, fps: FPS, config: { damping: 200 }, durationInFrames: 24 });
  const lines = ['Seu site.', 'Pronto.', 'Com a sua *cara.*'];
  const beat = sec(60 / timeline.bpm);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <NightSky glow={1.1} />
      <div style={{ position: 'absolute', top: 170, width: W, textAlign: 'center', opacity: inP }}>
        <div style={{ fontFamily: FONT.body, fontSize: 30, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.ivory, opacity: 0.85 }}>
          {clinic.title} · {clinic.city}/{clinic.state}
        </div>
        <div style={{ marginTop: 18, fontFamily: FONT.heading, fontWeight: FONT.weight, fontStyle: 'italic', fontSize: 118, lineHeight: 1, color: C.gold }}>{shortName}</div>
      </div>
      <div style={{ position: 'absolute', top: 560, left: 40, perspective: 2400 }}>
        <div style={{ transform: `translateX(${(1 - inP) * -200}px) rotateY(${14 - f * 0.05}deg) rotateX(4deg)`, transformOrigin: '0% 50%' }}>
          <BrowserFrame width={820} url={clinic.url}>
            <OffthreadVideo src={staticFile('captures/d-hero.mp4')} trimBefore={sec(1.2)} playbackRate={0.3} muted />
          </BrowserFrame>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 760, left: 650, perspective: 2000 }}>
        <div style={{ transform: `translateY(${(1 - inP) * 300}px) rotateY(${-16 + f * 0.05}deg) rotateZ(3deg)` }}>
          <PhoneFrame width={340}>
            <OffthreadVideo src={staticFile('captures/m-tour.mp4')} trimBefore={sec(1.0)} playbackRate={0.25} muted style={{ width: '100%', height: '100%' }} />
          </PhoneFrame>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1500, width: W, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', padding: '0 60px' }}>
        {lines.map((l, i) => {
          const p = interpolate(f, [8 + i * beat * 2, 8 + i * beat * 2 + 10], [0, 1], { ...clamp, easing: ease });
          const em = l.includes('*');
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT.heading,
                fontWeight: FONT.weight,
                fontSize: 92,
                lineHeight: 1.05,
                color: em ? C.gold : C.ivory,
                fontStyle: em ? 'italic' : 'normal',
                opacity: p,
                transform: `translateY(${(1 - p) * 30}px) scale(${1 + (1 - p) * 0.1})`,
                filter: `blur(${(1 - p) * 12}px)`,
                display: 'inline-block',
              }}
            >
              {l.replace(/\*/g, '')}
            </span>
          );
        })}
      </div>
      <FilmFinish grain={0.05} vignette={0.5} />
    </AbsoluteFill>
  );
};

// ─── 38–43 s: fechamento ──────────────────────────────────────────
export const Closing: React.FC = () => {
  const f = useCurrentFrame();
  const logoF = at(timeline.logoIn, 'closing');
  const tagF = at(timeline.tagIn, 'closing');
  const wipe = interpolate(f, [logoF - 14, logoF + 4], [0, 1], { ...clamp, easing: ease });
  const logo = interpolate(f, [logoF, logoF + 18], [0, 1], { ...clamp, easing: ease });
  const shine = interpolate(f, [logoF + 6, logoF + 34], [-0.4, 1.4], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <NightSky />
      <Constellation opacity={interpolate(f, [0, 20], [0, 0.9], clamp)} />
      <div style={{ position: 'absolute', top: 640, width: W, display: 'flex', justifyContent: 'center', opacity: 1 - wipe }}>
        <div style={{ opacity: interpolate(f, [0, 14], [0, 1], clamp) }}>
          <Monogram size={130} />
        </div>
      </div>
      <Caption text="Feito exclusivamente para" at={6} out={logoF - 14} y={840} size={76} />
      <Caption text={`*${shortName}.*`} at={16} out={logoF - 12} y={950} size={128} />

      {/* logo da Vincere (fundo preto do arquivo vira transparência no PNG) */}
      <AbsoluteFill style={{ background: `radial-gradient(60% 30% at 50% 45%, ${C.blue}33, transparent 70%)`, opacity: wipe }} />
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
      <Caption text="Responda esta mensagem e *coloque no ar.*" at={tagF} y={1130} size={72} width={900} />
      <FilmFinish grain={0.045} vignette={0.35} />
    </AbsoluteFill>
  );
};
