"""Trilha do roteiro "marca própria" (composição "marca"), sintetizada com scripts/synth.py.

Lê src/marca/timeline.json e public/captures/manifest.json para cair nos mesmos tempos:
tensão grave na busca e nas informações soltas (com um acorde dissonante a cada fragmento),
relógio nervoso na multidão de perfis, luz na virada e música quente a 120 BPM a partir do site.
Saída: public/audio/marca.wav (48 kHz, estéreo, -14 LUFS).
Uso: python3 scripts/audio-marca.py
"""
import json
from pathlib import Path

import numpy as np

from synth import Mix, t_axis, hz

ROOT = Path(__file__).resolve().parent.parent
T = json.loads((ROOT / "src/marca/timeline.json").read_text())
CLIPS = {c["name"]: c for c in json.loads((ROOT / "public/captures/manifest.json").read_text())["clips"]}
CLINIC = json.loads((ROOT / "src/clinic.json").read_text())
S = T["scenes"]
m = Mix(T["duration"])

# ─── 0–20,5 s: hoje ───────────────────────────────────────────────
dark_end = S["turn"][0]
m.pad([33, 40, 45], 0.0, dark_end + 0.4, gain=0.15, bright=260, attack=2.5)  # drone grave (Lá)
hi = t_axis(dark_end)
m.add(0, np.sin(2 * np.pi * hz(81) * hi) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * hi)) * np.clip(hi / 3, 0, 1)
      * np.clip((dark_end - hi) / 0.5, 0, 1), 0.016)
beat = 60 / 72
i = 0
while 0.6 + i * beat < S["crowd"][0]:
    at = 0.6 + i * beat
    g = 0.28 + 0.22 * (at / dark_end)
    m.thump(at, g)
    m.thump(at + 0.2, g * 0.6, 46)
    i += 1

# digitação (o mesmo cálculo de tempo das legendas)
short = CLINIC["shortName"].lower().replace(".", "")
q = T["typing"]["query"].replace("{short}", short).replace("{term}", CLINIC["term"]["one"])
for k, ch in enumerate(q):
    at = T["typing"]["start"] + k / T["typing"]["cps"] + 0.02 * np.sin(k * 1.7)
    m.key_click(at, 0.2 if ch != " " else 0.26)
m.key_click(T["enter"], 0.34)
m.thump(T["enter"] + 0.02, 0.15, 90)

# informações soltas: impacto e um acorde dissonante a cada fragmento
m.boom(S["scatter"][0], 0.5)
frags = [f for f in T["fragments"] if f["kind"] != "guide" or CLINIC["plans"]]
for k, fr in enumerate(frags):
    base = [57, 58, 63][k % 3]
    for d in (0, 1, 6):
        m.pluck(base + d, fr["at"], 0.05, 0.4 * (k - 1), 1.6)
    m.whoosh(fr["at"], 0.5, 0.07)

# a multidão: relógio nervoso que acelera até o clique em outro perfil
t0, pick = S["crowd"][0], T["crowdPick"]
at, step = t0, 0.5
while at < pick:
    m.key_click(at, 0.12)
    at += step
    step = max(0.16, step * 0.9)
m.mouse_click(pick, 0.4)
m.boom(pick + 0.05, 0.35)
m.riser(pick - 0.2, dark_end - pick + 0.2, 0.16)

# ─── 20,5 s: virada para a luz ────────────────────────────────────
m.whoosh(dark_end + 0.1, 0.9, 0.2)
m.bell(dark_end + 0.1, 81, 0.1)
m.pad([57, 64, 69, 71, 76], dark_end, S["result"][0] - dark_end + 0.6, gain=0.07, bright=3200, attack=0.4)

# ─── 22,5–51 s: o site ────────────────────────────────────────────
m.key_click(T["resultEnter"], 0.34)
m.mouse_click(T["click"])
spb = 60 / T["bpm"]
bar = 4 * spb
# Ré maior: Dmaj9 – Bm9 – Gmaj7 – Asus4, uma barra (2 s) cada
prog = [[50, 57, 61, 64, 66], [47, 54, 57, 61, 62], [43, 50, 54, 57, 62], [45, 52, 57, 59, 62]]
start = S["result"][0]
k = 0
while start + k * bar < S["closing"][0]:
    chord = prog[k % 4]
    at = start + k * bar
    full = at >= S["desktop"][0]
    m.pad(chord, at, bar + 0.6, gain=0.11 if full else 0.08, bright=1800 if full else 900, attack=0.4)
    if full:
        arp = [chord[1] + 12, chord[2] + 12, chord[3] + 12, chord[4] + 12, chord[3] + 12, chord[2] + 12, chord[4] + 12, chord[1] + 24]
        for j, n in enumerate(arp):
            m.pluck(n, at + j * spb / 2, 0.06, 0.35 * np.sin(j), 0.7)
        m.bass(chord[0] - 12, at, bar)
    k += 1

# bateria leve do computador até o fim dos pilares
i = 0
while S["desktop"][0] + i * spb < S["closing"][0]:
    at = S["desktop"][0] + i * spb
    if i % 4 in (0, 2):
        m.kick(at, 0.4)
    if at >= S["desktop"][0] + 2:
        m.shaker(at + spb / 2, 0.045, 0.3 if i % 2 else -0.3)
    i += 1

# cortes, interações gravadas e os pilares
for at in [S["desktop"][0], S["mobile"][0], S["pillars"][0], S["closing"][0]]:
    m.whoosh(at)
acc = S["desktop"][0]
for c in T["desktopClips"]:
    for e in CLIPS[c["name"]].get("events", []):
        t = acc + e["t"] - c["from"]
        if acc <= t < acc + c["seconds"]:
            m.mouse_click(t, 0.25)
    acc += c["seconds"]
    if acc < S["desktop"][1]:
        m.whoosh(acc, 0.35, 0.06)
mc = T["mobileClip"]
for e in CLIPS[mc["name"]].get("events", []):
    m.tap(S["mobile"][0] + e["t"] - mc["from"])
for k, p in enumerate(T["pillars"]):
    m.pluck([74, 78, 81][k % 3], p["at"], 0.09)

# fechamento: acorde aberto e sino na entrada do logo
m.pad([38, 50, 57, 62, 66, 69], S["closing"][0], S["closing"][1] - S["closing"][0], gain=0.13, bright=1600, attack=0.5)
m.kick(S["closing"][0], 0.5)
m.bell(T["logoIn"])

loud = m.save(ROOT / "public/audio/marca.wav")
print("public/audio/marca.wav", f"{T['duration']}s", "entrada:", loud, "LUFS")
