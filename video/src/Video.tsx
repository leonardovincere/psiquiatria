import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Laptop, Phone } from './Devices';
import { colors, fonts, s } from './theme';

export const WIDTH = 1080;
export const HEIGHT = 1350;
export const DURATION = s(42);
const FADE = 15; // sobreposição entre cenas (crossfade)

// ─── Roteiro ───────────────────────────────────────────────────────────────
// Cenas em segundos [início, fim). Cada cena entra e sai com fade de FADE quadros.
const SCENES = {
  intro: [0, 4],
  laptop: [3.5, 14],
  phone: [13.5, 24],
  both: [23.5, 34],
  closing: [33.5, 37.5],
  vincere: [37, 42],
} as const;

// Legendas, uma de cada vez: [início, fim, texto].
const CAPTIONS: [number, number, string][] = [
  [0.5, 3.6, 'Um novo site para a Animus'],
  [4.4, 8.9, 'Primeira impressão de acolhimento e confiança'],
  [9.3, 13.6, 'Cada seção responde a uma dúvida do paciente'],
  [14.4, 18.9, 'Pensado primeiro para o celular'],
  [19.3, 23.6, 'Agendamento pelo WhatsApp em um toque'],
  [24.4, 28.9, 'Teleconsulta, dúvidas e como chegar'],
  [29.3, 33.6, 'A mesma experiência em qualquer tela'],
  [34.2, 37.2, 'Prévia pronta para a sua revisão'],
];

// Trecho de cada gravação (em quadros) onde começa a cena "both": continua de onde a cena anterior parou.
const CLIP_RESUME = s(10);

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Opacidade/escala de entrada e saída de uma cena (frame relativo à cena).
function useSceneFade(length: number) {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, FADE, length - FADE, length], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rise = interpolate(f, [0, FADE * 2], [24, 0], { extrapolateRight: 'clamp', easing: ease });
  return { f, opacity, rise };
}

const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(1100px 800px at 85% 0%, ${colors.secondary}55, transparent 60%),
        radial-gradient(900px 700px at 0% 100%, ${colors.accent}1f, transparent 60%), ${colors.background}`,
    }}
  />
);

const Badge: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 40,
      right: 40,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 18px',
      borderRadius: 999,
      background: 'rgba(255,255,255,0.72)',
      border: `1px solid ${colors.secondary}`,
      color: colors.primary,
      fontFamily: fonts.body,
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: 0.2,
      zIndex: 10,
    }}
  >
    <span style={{ width: 9, height: 9, borderRadius: 9, background: colors.accent }} />
    Prévia demonstrativa
  </div>
);

const Caption: React.FC<{ text: string; length: number }> = ({ text, length }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 12, length - 10, length], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(f, [0, 16], [26, 0], { extrapolateRight: 'clamp', easing: ease }) + interpolate(f, [length - 10, length], [0, -8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ top: 1095, height: 200, alignItems: 'center', justifyContent: 'center', padding: '0 70px' }}>
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          fontFamily: fonts.heading,
          fontSize: 62,
          lineHeight: 1.12,
          color: colors.text,
          textAlign: 'center',
          textWrap: 'balance',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ range: readonly [number, number]; children: React.ReactNode }> = ({ range, children }) => (
  <Sequence from={s(range[0])} durationInFrames={s(range[1]) - s(range[0])}>
    {children}
  </Sequence>
);

const AnimusLogo: React.FC<{ width: number }> = ({ width }) => (
  <Img src={staticFile('logo-horizontal.webp')} style={{ width, display: 'block' }} />
);

const Intro: React.FC<{ length: number }> = ({ length }) => {
  const { opacity, rise } = useSceneFade(length);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity, paddingBottom: 220 }}>
      <div style={{ transform: `translateY(${rise}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
        <AnimusLogo width={560} />
        <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 22, letterSpacing: 5, color: colors.primary }}>
          SAÚDE MENTAL EM CAMPO GRANDE
        </div>
      </div>
    </AbsoluteFill>
  );
};

const video = (name: 'desktop' | 'mobile', from = 0) => (
  <OffthreadVideo src={staticFile(`${name}.mp4`)} trimBefore={from} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
);

const LaptopScene: React.FC<{ length: number }> = ({ length }) => {
  const { f, opacity, rise } = useSceneFade(length);
  const scale = interpolate(f, [0, length], [0.97, 1.0]);
  return (
    <AbsoluteFill style={{ alignItems: 'center', opacity, top: 120, height: 960, justifyContent: 'center' }}>
      <div style={{ transform: `translateY(${rise}px) scale(${scale})` }}>
        <Laptop>{video('desktop')}</Laptop>
      </div>
    </AbsoluteFill>
  );
};

const PhoneScene: React.FC<{ length: number }> = ({ length }) => {
  const { f, opacity, rise } = useSceneFade(length);
  const scale = interpolate(f, [0, length], [0.97, 1.0]);
  return (
    <AbsoluteFill style={{ alignItems: 'center', opacity, top: 105, height: 980, justifyContent: 'center' }}>
      <div style={{ transform: `translateY(${rise}px) scale(${scale})` }}>
        <Phone scale={0.96}>{video('mobile')}</Phone>
      </div>
    </AbsoluteFill>
  );
};

const BothScene: React.FC<{ length: number }> = ({ length }) => {
  const { f, opacity } = useSceneFade(length);
  const laptopX = interpolate(f, [0, 30], [40, 0], { extrapolateRight: 'clamp', easing: ease });
  const phoneY = interpolate(f, [6, 40], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: 'absolute', left: -40, top: 300, transform: `translateX(${laptopX}px) scale(0.8)`, transformOrigin: 'left top' }}>
        <Laptop>{video('desktop', CLIP_RESUME)}</Laptop>
      </div>
      <div style={{ position: 'absolute', right: 70, top: 470, transform: `translateY(${phoneY}px)` }}>
        <Phone scale={0.62}>{video('mobile', CLIP_RESUME)}</Phone>
      </div>
    </AbsoluteFill>
  );
};

const Closing: React.FC<{ length: number }> = ({ length }) => {
  const { opacity, rise } = useSceneFade(length);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity, paddingBottom: 220 }}>
      <div style={{ transform: `translateY(${rise}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <AnimusLogo width={500} />
        <div style={{ fontFamily: fonts.heading, fontStyle: 'italic', fontSize: 40, color: colors.primary }}>
          Psiquiatria Avançada
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Assinatura Vincere.AI: fundo branco (o da logo), linha de luz azul como o brilho do "V".
const VincereOutro: React.FC<{ length: number }> = ({ length }) => {
  const f = useCurrentFrame();
  const bg = interpolate(f, [0, FADE], [0, 1], { extrapolateRight: 'clamp' });
  const logo = interpolate(f, [8, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const logoScale = interpolate(f, [8, length], [0.96, 1.02], { extrapolateLeft: 'clamp' });
  const line = interpolate(f, [18, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const text = interpolate(f, [30, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: `rgba(255,255,255,${bg})`, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Img src={staticFile('vincere-logo.webp')} style={{ width: 860, opacity: logo, transform: `scale(${logoScale})` }} />
        <div
          style={{
            width: 520 * line,
            height: 3,
            marginTop: 18,
            borderRadius: 3,
            background: `linear-gradient(90deg, transparent, ${colors.vincereBlue}, transparent)`,
            boxShadow: `0 0 18px ${colors.vincereBlue}`,
          }}
        />
        <div style={{ marginTop: 40, opacity: text, fontFamily: fonts.body, fontSize: 30, color: colors.vincereSteel, letterSpacing: 0.4, textAlign: 'center', lineHeight: 1.4 }}>
          Prévia desenvolvida pela Vincere.AI
          <br />
          para a Animus Psiquiatria Avançada
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AnimusPreview: React.FC = () => {
  const len = (r: readonly [number, number]) => s(r[1]) - s(r[0]);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <Background />
      <Scene range={SCENES.intro}><Intro length={len(SCENES.intro)} /></Scene>
      <Scene range={SCENES.laptop}><LaptopScene length={len(SCENES.laptop)} /></Scene>
      <Scene range={SCENES.phone}><PhoneScene length={len(SCENES.phone)} /></Scene>
      <Scene range={SCENES.both}><BothScene length={len(SCENES.both)} /></Scene>
      <Scene range={SCENES.closing}><Closing length={len(SCENES.closing)} /></Scene>
      {CAPTIONS.map(([a, b, text]) => (
        <Sequence key={text} from={s(a)} durationInFrames={s(b) - s(a)}>
          <Caption text={text} length={s(b) - s(a)} />
        </Sequence>
      ))}
      <Scene range={SCENES.vincere}><VincereOutro length={len(SCENES.vincere)} /></Scene>
      <Badge />
    </AbsoluteFill>
  );
};
