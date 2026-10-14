// Etapa 1: grava a rolagem suave da página em desktop (1440×900) e mobile (390×844), deviceScaleFactor 2.
//
// Grava quadro a quadro em vez de usar o recordVideo do Playwright (que sai em VP8 de baixa
// qualidade): para cada quadro a página rola até a posição calculada e é fotografada. As animações
// CSS (transições de tom, revelações, marquee) têm a velocidade reduzida via CDP para andar no
// mesmo ritmo do vídeo, já que cada screenshot leva mais que 1/30 s.
//
// Uso: SITE_URL=http://localhost:4321/ node scripts/capture.mjs [desktop|mobile]
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const SITE_URL = process.env.SITE_URL ?? 'https://psiquiatria-ten.vercel.app/';
const FPS = 30;
const DURATION = 21; // segundos de gravação por dispositivo
const HOLD_FIRST = 1.5; // parada inicial no hero (já com as animações concluídas)
const HOLD = 0.9; // pausa curta em cada seção
const HOLD_LAST = 1.2;

const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 }, isMobile: false },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
};

// Paradas: seletor da seção + deslocamento opcional (para seções mais altas que a tela).
const STOPS = {
  desktop: [['#sobre'], ['#condicoes'], ['#condicoes', 520], ['#primeira-consulta'], ['#teleconsulta'], ['#atendimentos'], ['#duvidas'], ['#localizacao'], ['#contato']],
  mobile: [['#sobre'], ['#sobre', 420], ['#condicoes'], ['#condicoes', 760], ['#primeira-consulta'], ['#primeira-consulta', 620], ['#teleconsulta'], ['#atendimentos'], ['#atendimentos', 460], ['#duvidas'], ['#localizacao'], ['#contato']],
};

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function buildTimeline(targets) {
  // Tempo de deslocamento proporcional à raiz da distância: trechos longos andam mais rápido,
  // mas nunca bruscos. O total é ajustado para caber em DURATION.
  const ys = [0, ...targets];
  const dists = ys.slice(1).map((y, i) => Math.abs(y - ys[i]));
  const holdTotal = HOLD_FIRST + HOLD * (targets.length - 1) + HOLD_LAST;
  const weights = dists.map((d) => Math.sqrt(d));
  const k = (DURATION - holdTotal) / weights.reduce((a, b) => a + b, 0);
  const segs = [];
  let t = 0;
  segs.push({ t0: t, t1: (t += HOLD_FIRST), y0: 0, y1: 0 });
  ys.slice(1).forEach((y, i) => {
    segs.push({ t0: t, t1: (t += weights[i] * k), y0: ys[i], y1: y, move: true });
    const hold = i === ys.length - 2 ? HOLD_LAST : HOLD;
    segs.push({ t0: t, t1: (t += hold), y0: y, y1: y });
  });
  return segs;
}

function scrollAt(segs, t) {
  const s = segs.find((s) => t < s.t1) ?? segs[segs.length - 1];
  if (!s.move) return s.y1;
  return s.y0 + (s.y1 - s.y0) * easeInOut(Math.min(1, (t - s.t0) / (s.t1 - s.t0)));
}

async function capture(name) {
  const cfg = DEVICES[name];
  const outDir = path.resolve('capture-frames', name);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' });
  const context = await browser.newContext({ ...cfg, deviceScaleFactor: 2, locale: 'pt-BR' });
  const page = await context.newPage();
  await page.goto(SITE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Espera as animações do hero terminarem antes de começar a rolar.
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running' || a.effect?.getComputedTiming().endTime === Infinity),
  );
  await page.waitForTimeout(800);

  const maxY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const targets = await page.evaluate(
    ([stops, maxY]) =>
      stops.map(([sel, off = 0]) => {
        const top = document.querySelector(sel).getBoundingClientRect().top + scrollY;
        return Math.round(Math.min(maxY, Math.max(0, top - 24 + off)));
      }),
    [STOPS[name], maxY],
  );
  const segs = buildTimeline(targets);
  console.log(`${name}: paradas`, segs.filter((s) => !s.move).map((s) => `${s.t0.toFixed(1)}s→${s.y1}`).join('  '));

  const cdp = await context.newCDPSession(page);
  await cdp.send('Animation.enable');
  let rate = 0.1;
  await cdp.send('Animation.setPlaybackRate', { playbackRate: rate });

  const total = DURATION * FPS;
  let last = Date.now();
  for (let f = 0; f < total; f++) {
    const y = scrollAt(segs, f / FPS);
    await page.evaluate((y) => {
      window.scrollTo({ top: y, behavior: 'instant' });
      return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }, y);
    await page.screenshot({ path: path.join(outDir, `${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
    // Ajusta a velocidade das animações CSS ao tempo real gasto por quadro.
    const now = Date.now();
    const target = 1000 / FPS / Math.max(1, now - last);
    rate = rate * 0.8 + target * 0.2;
    await cdp.send('Animation.setPlaybackRate', { playbackRate: rate });
    last = now;
    if (f % 90 === 0) console.log(`${name}: quadro ${f}/${total}`);
  }
  await browser.close();

  mkdirSync('public', { recursive: true });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(outDir, '%05d.jpg'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    path.resolve('public', `${name}.mp4`)]);
  rmSync(outDir, { recursive: true, force: true });
  console.log(`${name}: salvo em public/${name}.mp4`);
}

const which = process.argv[2];
for (const name of which ? [which] : Object.keys(DEVICES)) await capture(name);
