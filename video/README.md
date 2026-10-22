# Vídeo comercial da prévia (Remotion)

Vídeo vertical 1080×1920 para WhatsApp, feito a partir da prévia de uma clínica.
Roteiro: busca pelo nome → resultado genérico (a dor) → virada → o site dele no resultado →
site no computador → no celular → lado a lado → "Feito exclusivamente para…" → logo da Vincere.

## Gerar para uma clínica

```bash
cd video && npm install
# 1. o site precisa estar rodando: na raiz, npm run build && npx serve -l 4400 dist
npm run data -- <slug>          # src/clinic.json + fontes da clínica
npm run capture -- <slug>       # grava os trechos quadro a quadro (public/captures/)
npm run audio                   # trilha e efeitos sintetizados, -14 LUFS (public/audio/)
npm run render                  # out/<slug>-whatsapp.mp4 (< 16 MB) e out/<slug>-thumb.jpg
```

## Roteiro "marca própria" (composição `marca`)

Para quem ainda não tem site: busca pelo nome → informações soltas (guia do convênio, diretório,
perfil privado) → "mais uma na lista" numa plataforma genérica → virada para a luz → o site dela no
resultado → computador → celular → rápido, bonito, encontrável → "Sua marca. Seu site. Seus pacientes."
Usa as cores e a cursiva (`theme.fontScript`) da clínica; os trechos gravados dependem da especialidade
(`scripts/capture.mjs`; hoje, endocrinologia com acabamento "luxe").

```bash
npm run data -- <slug> && npm run capture -- <slug>
npm run audio:marca             # public/audio/marca.wav
npm run render:marca            # out/<slug>-marca-whatsapp.mp4 e out/<slug>-marca-thumb.jpg
```

- Tempos, fragmentos, legendas e pilares: `src/marca/timeline.json`; cenas em `src/marca/scenes.tsx`.
- Trilha: `scripts/audio-marca.py`, com os timbres de `scripts/synth.py` (reutilizável por novos roteiros).
- Quadros soltos: `COMP=marca node scripts/stills.mjs 11 24.6` → `out/stills/marca-*.jpg`.

## Detalhes

- Tempos de cena, trechos e legendas: `src/timeline.json` (o áudio lê o mesmo arquivo).
  Os trechos do desktop têm múltiplos de 0,5 s para os cortes caírem na batida (120 BPM).
- O que cada trecho grava (rolagem, hover, FAQ, toque no WhatsApp): `scripts/capture.mjs`.
  `ONLY=d-faq,m-tour npm run capture -- <slug>` refaz só alguns.
- A gravação controla o relógio da página (rAF, timers, animações CSS): os quadros saem
  fluidos mesmo numa máquina lenta.
- Logo da Vincere: `public/brand/vincere-logo.png` (fundo transparente).
- Quadros soltos para revisar: `node scripts/stills.mjs 5 18.5 36.6` → `out/stills/`.
