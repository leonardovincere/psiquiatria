# Landing pages para clínicas de psiquiatria

Astro + Tailwind CSS v4. Cada clínica é um arquivo de configuração em `src/clinics/<slug>.ts`;
o build gera um site estático para a clínica escolhida pela variável `CLINIC`.

## Uso

```bash
npm install
npm run dev                          # http://localhost:4321 (clínica padrão: animus)
CLINIC=animus SITE_URL=https://animus.com.br npm run build   # gera dist/
npm run preview
```

## Nova clínica

1. Copie `src/clinics/animus.ts` para `src/clinics/<slug>.ts` e ajuste `slug` (igual ao nome do arquivo).
2. Preencha os campos; o tipo `ClinicConfig` (`src/clinics/types.ts`) documenta cada um.
3. Build com `CLINIC=<slug>`.

Comportamento dos campos:
- `null` (ex.: `contact.email`, `hours`) → o item simplesmente não aparece.
- `modalities.teleconsulta` → liga/desliga a seção e o serviço de teleconsulta; `modalities.presencial` → seção de mapa.
- `showPrices` → exibe `services[].price` (opcional) só quando `true`.
- `socialProof` → mostra apenas o `label` com link para `sourceUrl`; sem depoimentos (`highlights` não é exibido).
- `theme` → cores-base viram variáveis CSS (tons de fundo/borda/texto secundário são derivados) e as fontes são carregadas do Google Fonts.
- `doctor.photo` → URL remota, baixada e otimizada (WebP) no build. Sem foto, aparece um monograma.

### `isPreview`

Com `isPreview: true`:
- `<meta name="robots" content="noindex, nofollow, noarchive">` e `robots.txt` com `Disallow: /`;
- faixa com o texto de `previewBanner` no topo;
- JSON-LD omitido.

## Publicidade médica (Resolução CFM nº 2.336/2023)

- CRM e RQE aparecem sempre na seção “Sobre” e no rodapé (e no hero com `compliance.showCrmRqeEverywhere`); diretor(a) técnico(a) no rodapé.
- Com `compliance.noOutcomePromises: true`, `src/lib/compliance.ts` falha o build ao encontrar termos de risco nos textos
  (cura, garantia, 100%, definitivo, milagre, superlativos como “o melhor psiquiatra”, descontos/promoções, “antes e depois”).
  É uma rede de segurança — a revisão humana continua necessária.
- Aviso de emergência (SAMU 192 / CVV 188) no rodapé e menção à Resolução CFM nº 2.314/2022 na teleconsulta.

## Seções

Hero com CTA WhatsApp · Sobre a médica · Condições · Atendimentos (serviços, convênio, pagamento) · Primeira consulta
· Teleconsulta · FAQ · Mapa · CTA final · Rodapé com CRM/RQE · botão fixo de WhatsApp (barra no celular, pílula flutuante no desktop), único CTA de agendamento além do final da página; some quando o CTA final ou o rodapé aparecem.

## Movimento

Camada de animação contida, sem bibliotecas (CSS + ~2 KB de JS), em `src/styles/global.css` e no script de `Layout.astro`:

- **Entrada do hero**: o título sobe palavra por palavra por trás de uma máscara, a flor de lótus
  desabrocha (clip-path) e passa a "respirar", e o destaque da tagline é sublinhado.
- **Foto que se abre**: a foto começa no arco e se abre até a largura da tela conforme a rolagem (`--p` de 0 a 1).
- **Títulos em máscara**: `data-words` + `Words.astro` revelam cada título palavra por palavra ao entrar na tela.
- **Texto que acende**: o parágrafo principal do "Sobre" (`data-scrub`) passa de claro a escuro palavra por palavra.
- **Faixas de condições** deslizando devagar em sentidos opostos (decorativas, `aria-hidden`; a lista com descrições continua abaixo).
- **Tom por seção**: o fundo da página muda suavemente (creme → areia → azul na teleconsulta) conforme a seção
  no centro da tela (`data-tone-at`); cartões com `.card-light` mantêm as cores.
- **Microinterações**: botões levantam, setas deslizam, cabeçalho fixo ganha fundo ao rolar, FAQ abre suavemente.
- Tudo respeita `prefers-reduced-motion`, e sem JS a página aparece inteira e legível.

## Fontes

As fontes do `theme` são servidas pelo próprio site (Astro Fonts API), sem requisição ao Google na visita, com
fallback de métricas ajustadas (o texto não "pula" quando a fonte chega). Se existirem
`src/assets/fonts/<slug>/heading-normal.woff2`, `heading-italic.woff2` e `body-normal.woff2`, elas são usadas
(recorte para os pesos e caracteres do português, ~80 KB no total); senão, o build baixa do Google Fonts.

## Performance

Zero JS de framework; CSS inline; fontes auto-hospedadas e pré-carregadas; foto do topo pré-carregada; foto otimizada em WebP; flor de lótus vetorizada (SVG);
o iframe do Google Maps só carrega ao clicar (fachada). Lighthouse na prévia `animus`:
mobile 100 / 100 / 100, desktop 100 / 100 / 100 (performance / acessibilidade / boas práticas);
SEO 100 com `isPreview: false` (na prévia o `noindex` derruba o SEO de propósito).
