# Landing pages para clínicas de psiquiatria

Astro + Tailwind CSS v4, multi-clínica. Cada clínica é um arquivo `src/clinics/<slug>.ts`; o build gera uma página
estática por clínica em `/<slug>`. No ar, cada uma fica em `https://<slug>.preview.vincereai.tech`.

## Uso

```bash
npm install
npm run dev        # http://localhost:4321/animus
npm run build      # gera dist/ com todas as clínicas
npm run preview
```

## Nova clínica

1. Copie `src/clinics/_template.ts` para `src/clinics/<slug>.ts` (minúsculas, números e hífen) e ajuste `slug`.
   O template é comentado campo a campo; o tipo `ClinicConfig` (`src/clinics/types.ts`) documenta o resto.
2. Imagens em `public/clinics/<slug>/` (logo, símbolo, favicon). Tamanhos são lidos dos arquivos no build.
3. Opcional: fontes recortadas em `src/assets/fonts/<slug>/` (`heading-normal.woff2`, `heading-italic.woff2`,
   `body-normal.woff2`). Sem elas, o build baixa do Google Fonts.
4. `npm run build` → `/<slug>`. Arquivos que começam com `_` são ignorados.

Para cada prévia ter cara própria: `style.hero` (`arch` | `circle`), `style.conditions` (`marquee` | `chips`),
`theme.headingWeight`, `approach` (seção "Abordagem") e `doctor.experience` (seção "Trajetória").
CRM/RQE vazios só são aceitos em prévia (a página mostra "em confirmação"); para publicar, o build exige.

Nada da clínica fica no código dos componentes: dados, cores, fontes, imagens e textos vêm da config.
Textos de seção têm padrão em `src/lib/copy.ts` e podem ser sobrescritos por clínica em `copy`
(variáveis: `{medico}`, `{titulo}`, `{cidade}`, `{uf}`, `{publico}`). Dados da agência ficam em `src/lib/agency.ts`.

## Deploy (Vercel)

`vercel.json`:
- `<slug>.preview.vincereai.tech/` serve `/<slug>` e `/robots.txt` serve `/<slug>/robots.txt`;
- qualquer outro host em `/` redireciona para https://vincereai.tech (a home não lista clínicas);
- todo o domínio de prévia recebe `X-Robots-Tag: noindex, nofollow`;
- `cleanUrls`: `/animus.html` é servido como `/animus`.

Na Vercel, adicione o domínio curinga `*.preview.vincereai.tech` ao projeto (exige os nameservers do
domínio na Vercel ou a configuração de DNS que ela indicar).

### `isPreview`

Com `isPreview: true` (sempre, para cada clínica):
- `<meta name="robots" content="noindex, nofollow, noarchive">` e `robots.txt` com `Disallow: /`;
- faixa com o texto de `previewBanner` no topo ("Vincere.AI" vira link);
- JSON-LD omitido.

## Publicidade médica (Resolução CFM nº 2.336/2023)

- CRM e RQE aparecem sempre na seção “Sobre” e no rodapé (e no hero com `compliance.showCrmRqeEverywhere`); diretor(a) técnico(a) no rodapé.
- Com `compliance.noOutcomePromises: true`, `src/lib/compliance.ts` falha o build ao encontrar termos de risco nos textos
  (cura, garantia, 100%, definitivo, milagre, superlativos como “o melhor psiquiatra”, descontos/promoções, “antes e depois”).
  É uma rede de segurança — a revisão humana continua necessária.
- Aviso de emergência (SAMU 192 / CVV 188) no rodapé e menção à Resolução CFM nº 2.314/2022 na teleconsulta.

## Seções

Hero (texto + foto) · Números em destaque (`highlights`) · Sobre (citação que acende ao rolar) · Condições (faixas deslizando)
· Primeira consulta (4 passos curtos + laudos, convênio e pagamento numa linha) · Teleconsulta (3 pontos com ícones)
· FAQ (só o que não está no resto da página) · Onde estamos · Convite final · Rodapé compacto com CRM/RQE, diretora técnica,
redes e aviso de emergência · botão fixo de WhatsApp (barra no celular, pílula no desktop), que some no convite final.

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
