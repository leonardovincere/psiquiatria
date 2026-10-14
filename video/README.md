# Vídeo de apresentação — prévia Animus

Projeto Remotion (1080×1350, 30 fps, 42 s) que apresenta o site em uma moldura de notebook e outra de celular, com a assinatura da Vincere.AI no final.

```bash
npm install
export REMOTION_BROWSER=/caminho/para/chrome-headless-shell   # opcional; sem isso o Remotion baixa o dele

# 1. Captura (grava public/desktop.mp4 e public/mobile.mp4)
SITE_URL=https://psiquiatria-ten.vercel.app/ npm run capture   # ou http://localhost:4321/ com `npm run preview` na raiz

# 2. Revisão: quadros dos segundos 2, 10, 22, 30 e 38 em out/
npm run stills

# 3. Render final: out/animus-previa.mp4 (H.264, < 16 MB)
npm run render
```

Para editar o roteiro, mexa nas constantes `SCENES` e `CAPTIONS` em `src/Video.tsx`.
