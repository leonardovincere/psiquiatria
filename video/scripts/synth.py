"""Sintetizador simples para as trilhas dos vídeos (sem amostras de terceiros).

Mesmos timbres de scripts/audio.py, num objeto Mix reutilizável por qualquer roteiro:
pads, plucks, bumbo, chocalho, teclas, clique, toque, whoosh, riser, impacto e sino.
`Mix.save()` aplica reverb curto, fades e normaliza em -14 LUFS (pico real -1,5 dBTP).
"""
import json
import subprocess
import wave
from pathlib import Path

import numpy as np

SR = 48000


def hz(note):
    return 440.0 * 2 ** ((note - 69) / 12)


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


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


def saw(f, t, detune=0.0):
    ph = (f * (1 + detune)) * t
    return 2 * (ph - np.floor(ph + 0.5))


class Mix:
    def __init__(self, duration, seed=7):
        self.dur = duration
        self.n = int(SR * duration)
        self.L = np.zeros(self.n)
        self.R = np.zeros(self.n)
        self.rng = np.random.default_rng(seed)

    def add(self, at, sig, gain=1.0, pan=0.0):
        i = int(at * SR)
        if i >= self.n or i < 0:
            return
        sig = sig[: self.n - i]
        self.L[i : i + len(sig)] += sig * gain * np.sqrt((1 - pan) / 2) * np.sqrt(2)
        self.R[i : i + len(sig)] += sig * gain * np.sqrt((1 + pan) / 2) * np.sqrt(2)

    # ─── timbres ───
    def pad(self, notes, start, length, gain=0.12, bright=1200, attack=1.2):
        t = t_axis(length)
        sig = np.zeros_like(t)
        for n in notes:
            f = hz(n)
            sig += 0.5 * saw(f, t, -0.004) + 0.5 * saw(f, t, 0.005) + 0.6 * np.sin(2 * np.pi * f * t)
        sig = lowpass(sig / len(notes), bright)
        sig *= env(len(t), attack, 0.5, 0.85, 1.4, length)
        self.add(start, sig, gain, -0.15)
        self.add(start + 0.011, sig, gain * 0.9, 0.15)

    def pluck(self, note, start, gain=0.08, pan=0.0, decay=0.9):
        t = t_axis(decay + 0.2)
        f = hz(note)
        sig = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
        sig *= np.exp(-t * 4.2 / decay) * np.minimum(1, t / 0.004)
        self.add(start, sig, gain, pan)

    def bass(self, note, start, length, gain=0.12):
        t = t_axis(length)
        self.add(start, np.sin(2 * np.pi * hz(note) * t) * env(len(t), 0.02, 0.3, 0.7, 0.3, length), gain)

    def kick(self, start, gain=0.5):
        t = t_axis(0.45)
        f = 48 + 90 * np.exp(-t * 28)
        self.add(start, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7), gain)

    def shaker(self, start, gain=0.05, pan=0.3):
        t = t_axis(0.09)
        n = self.rng.standard_normal(len(t))
        self.add(start, (n - lowpass(n, 6000)) * np.exp(-t * 55), gain, pan)

    def key_click(self, start, gain=0.22):
        t = t_axis(0.05)
        n = self.rng.standard_normal(len(t))
        body = lowpass(n, 2600) * np.exp(-t * 160)
        tick = (n - lowpass(n, 5000)) * np.exp(-t * 400)
        self.add(start, body * 0.8 + tick * 0.5, gain * self.rng.uniform(0.75, 1.1), self.rng.uniform(-0.15, 0.15))

    def thump(self, start, gain=0.5, f0=52):
        t = t_axis(0.35)
        self.add(start, np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 20))) * np.exp(-t * 11), gain)

    def boom(self, start, gain=0.7):
        t = t_axis(2.5)
        f = 35 + 60 * np.exp(-t * 6)
        sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
        n = lowpass(self.rng.standard_normal(len(t)), 900) * np.exp(-t * 5)
        self.add(start, sub + 0.5 * n, gain)

    def whoosh(self, center, length=0.7, gain=0.16):
        t = t_axis(length)
        n = self.rng.standard_normal(len(t))
        sweep = 300 + 5000 * np.sin(np.pi * t / length) ** 2
        sig = lowpass(n, sweep) * np.sin(np.pi * t / length) ** 2
        self.add(center - length * 0.6, sig, gain, -0.4)
        self.add(center - length * 0.6 + 0.02, sig, gain, 0.4)

    def riser(self, start, length, gain=0.18):
        t = t_axis(length)
        n = self.rng.standard_normal(len(t))
        sig = lowpass(n, 200 + 7000 * (t / length) ** 2) * (t / length) ** 2
        sig += 0.4 * np.sin(2 * np.pi * (220 * t + 330 * t**2 / length)) * (t / length) ** 3
        self.add(start, sig, gain)

    def mouse_click(self, start, gain=0.35):
        for k, dt in enumerate([0, 0.075]):
            t = t_axis(0.03)
            n = self.rng.standard_normal(len(t))
            self.add(start + dt, (n - lowpass(n, 3000)) * np.exp(-t * 300), gain * (1 if k == 0 else 0.6))

    def tap(self, start, gain=0.4):
        t = t_axis(0.12)
        self.add(start, np.sin(2 * np.pi * 180 * t * (1 + np.exp(-t * 60))) * np.exp(-t * 45), gain)

    def bell(self, start, note=86, gain=0.12):
        t = t_axis(3.0)
        f = hz(note)
        sig = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * d) for a, m, d in
                  [(1, 1, 1.4), (0.5, 2.0, 2.2), (0.35, 2.76, 3.0), (0.2, 5.4, 5.0)])
        self.add(start, sig, gain, -0.2)
        self.add(start + 0.18, sig, gain * 0.4, 0.3)

    # ─── saída ───
    def save(self, path: Path):
        ir_t = t_axis(1.6)
        ir = self.rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.2)
        ir /= np.sqrt(np.sum(ir**2))

        def reverb(x):
            n = len(x) + len(ir)
            size = 1 << (n - 1).bit_length()
            return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]

        L = self.L + 0.22 * reverb(self.L)
        R = self.R + 0.22 * reverb(self.R)
        fade = np.ones(self.n)
        fi, fo = int(0.4 * SR), int(1.4 * SR)
        fade[:fi] = np.linspace(0, 1, fi)
        fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
        L *= fade
        R *= fade
        peak = max(np.abs(L).max(), np.abs(R).max())
        stereo = (np.stack([L, R], 1) / peak * 0.8 * 32767).astype(np.int16)

        path.parent.mkdir(parents=True, exist_ok=True)
        raw = path.with_suffix(".raw.wav")
        with wave.open(str(raw), "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(stereo.tobytes())
        probe = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(raw), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json",
                                "-f", "null", "-"], capture_output=True, text=True).stderr
        meas = json.loads(probe[probe.rindex("{"):probe.rindex("}") + 1])
        af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={meas['input_i']}:measured_TP={meas['input_tp']}:"
              f"measured_LRA={meas['input_lra']}:measured_thresh={meas['input_thresh']}:offset={meas['target_offset']}:linear=true")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", af, "-ar", str(SR), str(path)], check=True)
        raw.unlink()
        return meas["input_i"]
