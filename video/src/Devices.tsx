// Molduras de notebook e celular feitas só em CSS (sem imagens nem marcas de fabricante).
import type { CSSProperties, ReactNode } from 'react';
import { colors, fonts } from './theme';

// Tela 1440×900 (16:10).
export const LAPTOP_SCREEN = { w: 920, h: 575 };
const LID_BEZEL = 20;

export const Laptop: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({ children, style }) => {
  const lidW = LAPTOP_SCREEN.w + LID_BEZEL * 2;
  const lidH = LAPTOP_SCREEN.h + LID_BEZEL * 2 + 4;
  return (
    <div style={{ width: lidW + 90, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style }}>
      <div
        style={{
          width: lidW,
          height: lidH,
          background: 'linear-gradient(180deg, #23262c, #16181c)',
          borderRadius: '26px 26px 8px 8px',
          padding: `${LID_BEZEL + 4}px ${LID_BEZEL}px ${LID_BEZEL}px`,
          boxSizing: 'border-box',
          position: 'relative',
          boxShadow: 'inset 0 0 0 2px #3b3f47, 0 40px 80px -30px rgba(28,43,61,0.45)',
        }}
      >
        <div style={{ position: 'absolute', top: 10, left: '50%', width: 7, height: 7, marginLeft: -3.5, borderRadius: 9, background: '#3a3f48' }} />
        <div style={{ width: LAPTOP_SCREEN.w, height: LAPTOP_SCREEN.h, overflow: 'hidden', borderRadius: 4, background: colors.background }}>
          {children}
        </div>
      </div>
      {/* base */}
      <div
        style={{
          width: lidW + 90,
          height: 20,
          marginTop: -1,
          background: 'linear-gradient(180deg, #e3e5e9 0%, #c3c7cd 55%, #9ea3ab 100%)',
          borderRadius: '3px 3px 22px 22px / 3px 3px 14px 14px',
          position: 'relative',
          boxShadow: '0 22px 30px -18px rgba(28,43,61,0.5)',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: '50%', width: 150, marginLeft: -75, height: 7, borderRadius: '0 0 9px 9px', background: '#a9adb4' }} />
      </div>
    </div>
  );
};

// Viewport 390×844 + barra de status.
export const PHONE_VIEWPORT = { w: 390, h: 844 };
const STATUS_H = 50;
const FRAME = 13;

export const Phone: React.FC<{ children: ReactNode; scale?: number; style?: CSSProperties }> = ({ children, scale = 1, style }) => {
  const sw = PHONE_VIEWPORT.w * scale;
  const vh = PHONE_VIEWPORT.h * scale;
  const sh = STATUS_H * scale;
  const outerW = sw + FRAME * 2 * scale;
  const outerH = vh + sh + FRAME * 2 * scale;
  const button = (top: number, h: number, side: 'left' | 'right'): CSSProperties => ({
    position: 'absolute',
    top: top * scale,
    [side]: -3 * scale,
    width: 4 * scale,
    height: h * scale,
    borderRadius: 3 * scale,
    background: '#2a2d33',
  });
  return (
    <div
      style={{
        width: outerW,
        height: outerH,
        position: 'relative',
        borderRadius: 64 * scale,
        background: '#111316',
        padding: FRAME * scale,
        boxSizing: 'border-box',
        boxShadow: `inset 0 0 0 ${2 * scale}px #3b3f47, 0 ${40 * scale}px ${80 * scale}px -${28 * scale}px rgba(28,43,61,0.5)`,
        ...style,
      }}
    >
      <div style={button(170, 34, 'left')} />
      <div style={button(230, 62, 'left')} />
      <div style={button(305, 62, 'left')} />
      <div style={button(250, 96, 'right')} />
      <div style={{ width: sw, height: sh + vh, borderRadius: 52 * scale, overflow: 'hidden', position: 'relative', background: colors.background }}>
        {/* barra de status na cor da faixa de prévia do site */}
        <div
          style={{
            height: sh,
            background: '#1C2B3D',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${6 * scale}px ${30 * scale}px 0`,
            boxSizing: 'border-box',
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 16 * scale,
          }}
        >
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 3 * scale, alignItems: 'flex-end' }}>
            {[5, 8, 11, 14].map((h) => (
              <span key={h} style={{ width: 3.5 * scale, height: h * scale, borderRadius: scale, background: '#fff' }} />
            ))}
            <span style={{ width: 24 * scale, height: 12 * scale, marginLeft: 6 * scale, borderRadius: 4 * scale, border: `${1.5 * scale}px solid rgba(255,255,255,0.7)`, padding: 1.5 * scale, boxSizing: 'border-box' }}>
              <span style={{ display: 'block', width: '80%', height: '100%', borderRadius: 2 * scale, background: '#fff' }} />
            </span>
          </span>
        </div>
        <div style={{ position: 'absolute', top: 11 * scale, left: '50%', width: 112 * scale, marginLeft: -56 * scale, height: 32 * scale, borderRadius: 20 * scale, background: '#000' }} />
        <div style={{ width: sw, height: vh, overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  );
};
