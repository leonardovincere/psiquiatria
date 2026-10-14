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
· Teleconsulta · FAQ · Mapa · CTA final · Rodapé com CRM/RQE · barra fixa de WhatsApp no mobile.

## Performance

Zero JS de framework; CSS inline; Google Fonts carregado sem bloquear a renderização; foto otimizada em WebP;
o iframe do Google Maps só carrega ao clicar (fachada). Lighthouse na prévia `animus`:
mobile 99 / 100 / 100, desktop 100 / 100 / 100 (performance / acessibilidade / boas práticas);
SEO 100 com `isPreview: false` (na prévia o `noindex` derruba o SEO de propósito).
