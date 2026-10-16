"""Trilha e efeitos do vídeo, sintetizados do zero (sem amostras de terceiros).

Lê src/timeline.json e public/captures/manifest.json para cair nos mesmos
tempos da montagem: tensão grave até a virada (11 s), teclas na digitação,
impacto e glitch na virada, música quente a 120 BPM a partir do site, whoosh
nos cortes, clique, toque no celular e um sino na entrada do logo.
Saída: public/audio/track.wav (48 kHz, estéreo), normalizada em -14 LUFS.
Uso: python3 scripts/audio.py
"""
import json
import subprocess
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
T = json.loads((ROOT / "src/timeline.json").read_text())
CLIPS = json.loads((ROOT / "public/captures/manifest.json").read_text())["clips"]
CLINIC = json.loads((ROOT / "src/clinic.json").read_text())

SR = 48000
DUR = T["duration"]
N = int(SR * DUR)
L = np.zeros(N)
R = np.zeros(N)
rng = np.random.default_rng(7)


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def add(at, sig, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i : i + len(sig)] += sig * gain * np.sqrt((1 - pan) / 2) * np.sqrt(2)
    R[i : i + len(sig)] += sig * gain * np.sqrt((1 + pan) / 2) * np.sqrt(2)


def lowpass(x, cutoff):
    """Passa-baixa de 1 polo; cutoff pode ser um vetor (filtro que abre)."""
    c = np.broadcast_to(np.asarray(cutoff, float), x.shape)
    a = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def env(n, a, d, s_level, r, total):
    """ADSR em segundos, com duração total."""
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), 1.0)
    e = np.where((t >= a) & (t < a + d), 1 - (1 - s_level) * (t - a) / max(d, 1e-4), e)
    e = np.where(t >= a + d, s_level, e)
    rel = np.clip((total - t) / max(r, 1e-4), 0, 1)
    return e * rel


def hz(note):
    return 440.0 * 2 ** ((note - 69) / 12)


def saw(f, t, detune=0.0):
    ph = (f * (1 + detune)) * t
    return 2 * (ph - np.floor(ph + 0.5))


def pad(notes, start, length, gain=0.12, bright=1200, attack=1.2):
    t = t_axis(length)
    sig = np.zeros_like(t)
    for n in notes:
        f = hz(n)
        sig += 0.5 * saw(f, t, -0.004) + 0.5 * saw(f, t, 0.005) + 0.6 * np.sin(2 * np.pi * f * t)
    sig = lowpass(sig / len(notes), bright)
    sig *= env(len(t), attack, 0.5, 0.85, 1.4, length)
    add(start, sig, gain, -0.15)
    add(start + 0.011, sig, gain * 0.9, 0.15)


def pluck(note, start, gain=0.08, pan=0.0, decay=0.9):
    t = t_axis(decay + 0.2)
    f = hz(note)
    sig = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t))
    sig *= np.exp(-t * 4.2 / decay) * np.minimum(1, t / 0.004)
    add(start, sig, gain, pan)


def kick(start, gain=0.5):
    t = t_axis(0.45)
    f = 48 + 90 * np.exp(-t * 28)
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    add(start, sig, gain)


def shaker(start, gain=0.05, pan=0.3):
    t = t_axis(0.09)
    n = rng.standard_normal(len(t))
    sig = (n - lowpass(n, 6000)) * np.exp(-t * 55)
    add(start, sig, gain, pan)


def key_click(start, gain=0.22):
    t = t_axis(0.05)
    n = rng.standard_normal(len(t))
    body = lowpass(n, 2600) * np.exp(-t * 160)
    tick = (n - lowpass(n, 5000)) * np.exp(-t * 400)
    add(start, body * 0.8 + tick * 0.5, gain * rng.uniform(0.75, 1.1), rng.uniform(-0.15, 0.15))


def thump(start, gain=0.5, f0=52):
    t = t_axis(0.35)
    sig = np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 20))) * np.exp(-t * 11)
    add(start, sig, gain)


def boom(start, gain=0.7):
    t = t_axis(2.5)
    f = 35 + 60 * np.exp(-t * 6)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    n = lowpass(rng.standard_normal(len(t)), 900) * np.exp(-t * 5)
    add(start, sub + 0.5 * n, gain)


def whoosh(center, length=0.7, gain=0.16):
    t = t_axis(length)
    n = rng.standard_normal(len(t))
    sweep = 300 + 5000 * np.sin(np.pi * t / length) ** 2
    sig = lowpass(n, sweep) * np.sin(np.pi * t / length) ** 2
    add(center - length * 0.6, sig, gain, -0.4)
    add(center - length * 0.6 + 0.02, sig, gain, 0.4)


def riser(start, length, gain=0.18):
    t = t_axis(length)
    n = rng.standard_normal(len(t))
    sig = lowpass(n, 200 + 7000 * (t / length) ** 2) * (t / length) ** 2
    sig += 0.4 * np.sin(2 * np.pi * (220 * t + 330 * t**2 / length)) * (t / length) ** 3
    add(start, sig, gain)


def glitch(start, length=0.35, gain=0.22):
    t = t_axis(length)
    n = rng.standard_normal(len(t))
    gate = (np.sin(2 * np.pi * 37 * t) > 0.2).astype(float)
    crushed = np.round(n * 3) / 3 * gate
    tone = np.sign(np.sin(2 * np.pi * 1600 * t)) * (np.sin(2 * np.pi * 9 * t) > 0)
    add(start, (crushed + 0.3 * tone) * np.exp(-t * 4), gain)


def mouse_click(start, gain=0.35):
    for k, dt in enumerate([0, 0.075]):
        t = t_axis(0.03)
        n = rng.standard_normal(len(t))
        sig = (n - lowpass(n, 3000)) * np.exp(-t * 300)
        add(start + dt, sig, gain * (1 if k == 0 else 0.6))


def tap(start, gain=0.4):
    t = t_axis(0.12)
    sig = np.sin(2 * np.pi * 180 * t * (1 + np.exp(-t * 60))) * np.exp(-t * 45)
    add(start, sig, gain)


def bell(start, note=86, gain=0.12):
    t = t_axis(3.0)
    f = hz(note)
    sig = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * d) for a, m, d in
              [(1, 1, 1.4), (0.5, 2.0, 2.2), (0.35, 2.76, 3.0), (0.2, 5.4, 5.0)])
    add(start, sig, gain, -0.2)
    add(start + 0.18, sig, gain * 0.4, 0.3)


# ─── 0–11 s: tensão ───────────────────────────────────────────────
pad([33, 40, 45], 0.0, 11.3, gain=0.16, bright=260, attack=2.5)        # drone grave (Lá)
high = t_axis(11)
add(0, np.sin(2 * np.pi * hz(81) * high) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * high)) *
    np.clip(high / 3, 0, 1) * np.clip((11 - high) / 0.5, 0, 1), 0.018)
beat = 60 / 72
for i in range(int(10.6 / beat)):
    at = 0.6 + i * beat
    if at > 10.6:
        break
    g = 0.32 + 0.25 * (at / 11)
    thump(at, g)
    thump(at + 0.2, g * 0.6, 46)

# digitação
q = T["typing"]["query"].replace("{name}", CLINIC["name"])
for i, ch in enumerate(q):
    at = T["typing"]["start"] + i / T["typing"]["cps"] + 0.02 * np.sin(i * 1.7)
    key_click(at, 0.2 if ch != " " else 0.26)
key_click(T["enter"], 0.34)
thump(T["enter"] + 0.02, 0.15, 90)

# a dor e a virada
boom(T["scenes"]["pain"][0], 0.55)
riser(9.4, 1.6)
boom(T["scenes"]["turn"][0], 0.9)
glitch(T["scenes"]["turn"][0])
pad([57, 64, 69, 71], 11.2, 2.4, gain=0.06, bright=3000, attack=0.6)   # suspenso, "imagine"

# ─── 13–43 s: o site ──────────────────────────────────────────────
key_click(T["resultEnter"], 0.34)
mouse_click(T["click"])
bpm = T["bpm"]
spb = 60 / bpm
# Ré maior: Dmaj9 – Bm9 – Gmaj7 – Asus4, uma barra (4 tempos = 2 s) cada
prog = [[50, 57, 61, 64, 66], [47, 54, 57, 61, 62], [43, 50, 54, 57, 62], [45, 52, 57, 59, 62]]
start = 13.0
bar = 4 * spb
k = 0
while start + k * bar < 38:
    chord = prog[k % 4]
    at = start + k * bar
    pad(chord, at, bar + 0.6, gain=0.09 if at < 17 else 0.11, bright=900 if at < 17 else 1800, attack=0.4)
    if at >= 17:
        # arpejo em colcheias
        arp = [chord[1] + 12, chord[2] + 12, chord[3] + 12, chord[4] + 12, chord[3] + 12, chord[2] + 12, chord[4] + 12, chord[1] + 24]
        for j, n in enumerate(arp):
            pluck(n, at + j * spb / 2, 0.05 if at < 21 else 0.065, 0.35 * np.sin(j), 0.7)
        add(at, np.sin(2 * np.pi * hz(chord[0] - 12) * t_axis(bar)) * env(int(bar * SR), 0.02, 0.3, 0.7, 0.3, bar), 0.12)
    k += 1

# bateria leve: bumbo meio-tempo, chocalho nas colcheias
t0 = T["scenes"]["desktop"][0]
t1 = T["scenes"]["proof"][0]
i = 0
while t0 + i * spb < t1:
    at = t0 + i * spb
    if i % 4 in (0, 2):
        kick(at, 0.42)
    if at >= 21:
        shaker(at + spb / 2, 0.045, 0.3 if i % 2 else -0.3)
    i += 1

# prova e fechamento: acorde aberto e resolução
pad([50, 57, 62, 66, 69, 74], T["scenes"]["proof"][0], 4.3, gain=0.12, bright=2400, attack=0.3)
pluck(74, T["scenes"]["proof"][0], 0.08)
pad([38, 50, 57, 62, 66, 69], T["scenes"]["closing"][0], 5.0, gain=0.13, bright=1600, attack=0.5)
kick(T["scenes"]["closing"][0], 0.5)
bell(T["logoIn"])

for at in [T["scenes"]["desktop"][0], T["scenes"]["mobile"][0], T["scenes"]["proof"][0], T["scenes"]["closing"][0]]:
    whoosh(at)
cuts = np.cumsum([c["seconds"] for c in T["desktopClips"]])[:-1] + T["scenes"]["desktop"][0]
for at in cuts:
    whoosh(at, 0.35, 0.06)

m = next(c for c in CLIPS if c["name"] == T["mobileClip"]["name"])
ev = next(e for e in m["events"] if e["label"] == "tap")
tap(T["scenes"]["mobile"][0] + ev["t"] - T["mobileClip"]["from"])

# ─── reverb curto, fades e saída ──────────────────────────────────
ir_t = t_axis(1.6)
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.2)
ir /= np.sqrt(np.sum(ir**2))
def reverb(x):
    n = len(x) + len(ir)
    size = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
L = L + 0.22 * reverb(L)
R = R + 0.22 * reverb(R)

fade = np.ones(N)
fi = int(0.4 * SR)
fade[:fi] = np.linspace(0, 1, fi)
fo = int(1.4 * SR)
fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
stereo = (np.stack([L, R], 1) / peak * 0.8 * 32767).astype(np.int16)

out = ROOT / "public/audio"
out.mkdir(parents=True, exist_ok=True)
raw = out / "raw.wav"
import wave
with wave.open(str(raw), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(stereo.tobytes())

# Loudness: -14 LUFS integrado, pico real de -1,5 dBTP (duas passadas do loudnorm).
probe = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(raw), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json",
                        "-f", "null", "-"], capture_output=True, text=True).stderr
meas = json.loads(probe[probe.rindex("{"):probe.rindex("}") + 1])
af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={meas['input_i']}:measured_TP={meas['input_tp']}:"
      f"measured_LRA={meas['input_lra']}:measured_thresh={meas['input_thresh']}:offset={meas['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", af, "-ar", str(SR), str(out / "track.wav")], check=True)
raw.unlink()
print("public/audio/track.wav", f"{DUR}s", "entrada:", meas["input_i"], "LUFS")
