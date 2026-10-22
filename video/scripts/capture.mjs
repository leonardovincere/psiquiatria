// Grava trechos do site quadro a quadro, com o relógio da página controlado:
// requestAnimationFrame, timers, performance.now e as animações CSS avançam
// exatamente 1/30 s por quadro. A rolagem e as animações saem fluidas mesmo
// numa máquina lenta, e nenhuma tela aparece pela metade.
// Uso: node scripts/capture.mjs <slug> [url-base]   (padrão http://localhost:4400)
// Saída: public/captures/<trecho>.mp4 e public/captures/manifest.json
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const [slug, base = 'http://localhost:4400'] = process.argv.slice(2);
if (!slug) throw new Error('Uso: node scripts/capture.mjs <slug> [url-base]');
const FPS = 30;
const OUT = new URL('../public/captures/', import.meta.url).pathname;
const TMP = new URL('../captures/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// Relógio virtual instalado antes de qualquer script da página.
const clock = () => {
  const vt = { now: 0, raf: [], timers: [], id: 1 };
  window.__vt = vt;
  const realDate = Date.now();
  performance.now = () => vt.now;
  Date.now = () => realDate + vt.now;
  window.requestAnimationFrame = (cb) => {
    const id = vt.id++;
    vt.raf.push({ id, cb });
    return id;
  };
  window.cancelAnimationFrame = (id) => (vt.raf = vt.raf.filter((r) => r.id !== id));
  const addTimer = (cb, ms, args, every) => {
    const id = vt.id++;
    vt.timers.push({ id, at: vt.now + Math.max(0, ms || 0), cb, args, every });
    return id;
  };
  window.setTimeout = (cb, ms, ...args) => addTimer(cb, ms, args, 0);
  window.setInterval = (cb, ms, ...args) => addTimer(cb, ms, args, Math.max(1, ms || 1));
  window.clearTimeout = window.clearInterval = (id) => (vt.timers = vt.timers.filter((t) => t.id !== id));
  window.requestIdleCallback = (cb) => addTimer(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 1, [], 0);

  const starts = new WeakMap();
  // Avança dt ms: dispara timers vencidos, quadros de animação e posiciona as animações CSS.
  window.__step = (dt) => {
    const target = vt.now + dt;
    for (;;) {
      const due = vt.timers.filter((t) => t.at <= target).sort((a, b) => a.at - b.at)[0];
      if (!due) break;
      vt.now = Math.max(vt.now, due.at);
      if (due.every) due.at += due.every;
      else vt.timers = vt.timers.filter((t) => t !== due);
      typeof due.cb === 'function' && due.cb(...(due.args || []));
    }
    vt.now = target;
    const frame = vt.raf;
    vt.raf = [];
    frame.forEach((r) => r.cb(vt.now));
    window.__syncAnimations();
  };
  window.__syncAnimations = () => {
    for (const a of document.getAnimations()) {
      if (a.timeline !== document.timeline) continue; // animações ligadas à rolagem seguem a rolagem
      if (!starts.has(a)) starts.set(a, vt.now);
      a.pause();
      a.currentTime = vt.now - starts.get(a);
    }
  };
};

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

async function shoot(browser, name, device, plan, { intro = false } = {}) {
  const ctx = await browser.newContext(device);
  await ctx.addInitScript(clock);
  // Pula a cortina de abertura (só aparece na 1ª visita), a menos que o trecho seja a própria abertura,
  // e evita abrir o WhatsApp de verdade.
  if (!intro) await ctx.addInitScript((s) => sessionStorage.setItem(`intro-${s}`, '1'), slug);
  await ctx.route(/wa\.me|api\.whatsapp/, (r) => r.abort());
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Animation.enable');
  await cdp.send('Animation.setPlaybackRate', { playbackRate: 0 });
  await page.goto(`${base}/${slug}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // A abertura animada de <details> (::details-content) não segue o relógio controlado e ficaria fechada: abre direto.
  await page.addStyleTag({
    content: 'html{scroll-behavior:auto!important} ::-webkit-scrollbar{display:none} *{caret-color:transparent} details::details-content{transition:none!important}',
  });
  await page.evaluate(() => window.__syncAnimations());

  const dir = `${TMP}${name}/`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const ctl = {
    page,
    y: 0,
    top: (sel, offset = 0) => page.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + scrollY + o, [sel, offset]),
    rect: (sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().toJSON(), sel),
    events: [],
  };
  let f = 0;
  const frame = async (y) => {
    if (y !== undefined && Math.round(y) !== Math.round(ctl.y)) {
      ctl.y = y;
      await page.evaluate((v) => {
        scrollTo({ top: v, behavior: 'instant' });
        dispatchEvent(new Event('scroll'));
      }, y);
    }
    await page.evaluate((dt) => window.__step(dt), 1000 / FPS);
    await page.screenshot({ path: `${dir}${String(f++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 93 });
  };
  ctl.hold = async (s) => {
    for (let i = 0; i < Math.round(s * FPS); i++) await frame();
  };
  ctl.scroll = async (to, s) => {
    const from = ctl.y;
    const n = Math.round(s * FPS);
    for (let i = 1; i <= n; i++) await frame(from + (to - from) * ease(i / n));
  };
  ctl.jump = async (to) => {
    ctl.y = to;
    await page.evaluate((v) => {
      scrollTo({ top: v, behavior: 'instant' });
      dispatchEvent(new Event('scroll'));
    }, to);
    await page.evaluate(() => window.__step(1));
  };
  ctl.mark = (label, extra = {}) => ctl.events.push({ label, t: f / FPS, ...extra });

  await plan(ctl);
  await ctx.close();

  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${dir}%05d.jpg`, '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${OUT}${name}.mp4`]);
  console.log(`${name}: ${(f / FPS).toFixed(1)}s`);
  return { name, seconds: f / FPS, width: device.viewport.width, height: device.viewport.height, events: ctl.events };
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 };
const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true };
// ONLY=m-tour,d-faq refaz só esses trechos (os outros ficam como estão no manifest).
const only = process.env.ONLY?.split(',');
const old = existsSync(`${OUT}manifest.json`) ? JSON.parse(readFileSync(`${OUT}manifest.json`, 'utf8')).clips : [];
const clips = [];
const run = async (name, device, plan, opts) => {
  if (only && !only.includes(name)) {
    const prev = old.find((c) => c.name === name);
    if (prev) clips.push(prev);
    return;
  }
  clips.push(await shoot(browser, name, device, plan, opts));
};

// Os trechos dependem das seções de cada template (src/clinic.json, gerado por `npm run data`).
const { specialty } = JSON.parse(readFileSync(new URL('../src/clinic.json', import.meta.url), 'utf8'));
if (specialty === 'endocrinologia') await endocrinologia();
else await psiquiatria();

await browser.close();
writeFileSync(`${OUT}manifest.json`, JSON.stringify({ fps: FPS, clips }, null, 2));

// ─── Psiquiatria ─────────────────────────────────────────────────
async function psiquiatria() {
// Desktop: um trecho por seção (o vídeo corta entre eles).
await run('d-hero', desktop, async (c) => {
  await c.hold(2.4);
  await c.scroll(620, 1.4);
});
await run('d-myths', desktop, async (c) => {
  const top = await c.top('#mitos');
  await c.jump(top);
  await c.hold(0.5);
  await c.scroll(top + 470, 2.2);
  await c.hold(0.4);
});
await run('d-posters', desktop, async (c) => {
  const top = await c.top('.posters', -150);
  await c.jump(top - 120);
  await c.scroll(top, 0.8);
  const r = await c.rect('.poster:nth-child(2)');
  await c.page.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 1 });
  c.mark('hover');
  await c.hold(1.6);
});
await run('d-conditions', desktop, async (c) => {
  const top = await c.top('#condicoes', 40);
  await c.jump(top);
  await c.scroll(top + 140, 2.2);
});
await run('d-faq', desktop, async (c) => {
  const top = await c.top('#duvidas', -40);
  await c.jump(top);
  await c.hold(0.6);
  await c.page.click('#duvidas details:nth-of-type(2) summary');
  c.mark('open');
  await c.hold(1.4);
});
await run('d-cta', desktop, async (c) => {
  const top = await c.top('#contato', -120);
  await c.jump(top);
  await c.hold(0.7);
  const r = await c.rect('#contato .btn-cta');
  await c.page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
  c.mark('hover', { x: r.x + r.width / 2, y: r.y + r.height / 2 });
  await c.hold(1.5);
});

// Celular: um trecho contínuo, do topo até o toque no botão do WhatsApp.
await run('m-tour', mobile, async (c) => {
  await c.hold(2.0);
  const about = await c.top('#sobre', 60);
  await c.scroll(about, 1.5);
  await c.scroll(about + 260, 1.0);
  const myths = await c.top('#mitos');
  await c.scroll(myths + 380, 1.6);
  await c.hold(0.4);
  const r = await c.rect('[data-sticky-cta] a');
  c.mark('tap', { x: r.x + r.width / 2, y: r.y + r.height / 2 });
  await c.page.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2);
  await c.hold(1.2);
});
}

// ─── Endocrinologia (acabamento "luxe") ──────────────────────────
async function endocrinologia() {
  // A abertura cinematográfica inteira, até o topo assentar.
  await run('d-intro', desktop, (c) => c.hold(4.6), { intro: true });
  await run('d-hero', desktop, async (c) => {
    await c.hold(1.8);
    await c.scroll(560, 1.4);
  });
  await run('d-areas', desktop, async (c) => {
    const top = await c.top('#areas', 160);
    await c.jump(top - 140);
    await c.scroll(top, 0.7);
    await c.hold(0.3);
    const r = await c.rect('.lx-tile:nth-child(2) summary');
    await c.page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
    await c.page.mouse.click(r.x + r.width / 2, r.y + r.height / 2);
    c.mark('open', { x: r.x + r.width / 2, y: r.y + r.height / 2 });
    await c.hold(1.6);
  });
  await run('d-care', desktop, async (c) => {
    const top = await c.top('#consulta', -40);
    await c.jump(top);
    await c.hold(0.7);
    await c.page.click('label[for="lx-care-retornos"]');
    c.mark('tab');
    await c.hold(1.6);
  });
  await run('d-faq', desktop, async (c) => {
    const top = await c.top('#duvidas', -40);
    await c.jump(top);
    await c.hold(0.5);
    await c.page.click('#duvidas details:nth-of-type(2) summary');
    c.mark('open');
    await c.hold(1.5);
  });
  await run('d-crest', desktop, async (c) => {
    const top = await c.top('#contato', -60);
    await c.jump(top);
    await c.hold(0.4);
    const end = await c.page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    await c.scroll(end, 2.2);
    await c.hold(0.4);
  });

  // Celular: topo, áreas (toque num cartão), consulta e o toque no botão do WhatsApp.
  await run('m-tour', mobile, async (c) => {
    await c.hold(1.8);
    const areas = await c.top('#areas', 80);
    await c.scroll(areas, 1.3);
    const r = await c.rect('.lx-tile:nth-child(2) summary');
    c.mark('tile', { x: r.x + r.width / 2, y: r.y + r.height / 2 });
    await c.page.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2);
    await c.hold(1.0);
    const care = await c.top('#consulta', 40);
    await c.scroll(care, 1.1);
    await c.hold(0.4);
    const b = await c.rect('[data-sticky-cta] a');
    c.mark('tap', { x: b.x + b.width / 2, y: b.y + b.height / 2 });
    await c.page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
    await c.hold(1.1);
  });
}
