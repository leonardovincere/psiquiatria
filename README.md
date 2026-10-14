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
2. Preencha médica, CRM, RQE, endereço, contatos, condições, modalidades, paleta e textos.
   O tipo `ClinicConfig` (`src/clinics/types.ts`) documenta cada campo.
3. Foto opcional: coloque em `src/assets/<slug>/` e importe no config (`photo: foto`). Sem foto, aparece um monograma.
4. Build com `CLINIC=<slug>`.

### `isPreview`

Com `isPreview: true`:
- `<meta name="robots" content="noindex, nofollow, noarchive">` e `robots.txt` com `Disallow: /`;
- faixa “Prévia criada pela Vincere.AI” no topo;
- JSON-LD omitido.

Com `isPreview: false`, o build **falha** se ainda houver `TODO` ou placeholders (`000000`) no config.

## Publicidade médica (Resolução CFM nº 2.336/2023)

- Nome, CRM e RQE da médica aparecem no hero, na seção “Sobre” e no rodapé; diretor(a) técnico(a) no rodapé.
- `src/lib/compliance.ts` roda em todo build e falha ao encontrar termos de risco nos textos
  (cura, garantia, 100%, definitivo, milagre, superlativos como “o melhor psiquiatra”, descontos/promoções, “antes e depois”).
  É uma rede de segurança — a revisão humana continua necessária.
- Aviso de emergência (SAMU 192 / CVV 188) no rodapé e menção à Resolução CFM nº 2.314/2022 na teleconsulta.

## Seções

Hero com CTA WhatsApp · Sobre a médica · Condições · Primeira consulta · Teleconsulta (se `modalities` incluir `teleconsulta`)
· FAQ · Mapa (se incluir `presencial`) · CTA final · Rodapé com CRM/RQE · barra fixa de WhatsApp no mobile.

## Performance

Zero JS de framework; CSS inline; fontes (Inter e Fraunces, variáveis, subset latino) self-hosted com preload;
o iframe do Google Maps só carrega ao clicar (fachada). Lighthouse na prévia `animus`:
mobile 98 / 100 / 100, desktop 100 / 100 / 100 (performance / acessibilidade / boas práticas);
SEO 100 com `isPreview: false` (na prévia o `noindex` derruba o SEO de propósito).
