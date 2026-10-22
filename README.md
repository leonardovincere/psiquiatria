# Fábrica de prévias — Vincere.AI

Sites de demonstração para médicos prospectados. Astro + Tailwind CSS v4, site estático, publicado na Vercel.
Cada cliente é um arquivo `src/clients/<slug>.ts` e vira uma página. Especialidades: **psiquiatria** e **endocrinologia**.

```bash
npm install
npm run dev      # http://localhost:4321/<slug>
npm run build    # checa tipos e regras do CFM e gera dist/
npm run lint     # checa tipos e se src/components/shared continua sem texto de especialidade
npm run routes   # gera no vercel.json a regra de subdomínio de cada cliente
```

## Criar uma prévia nova

1. Copie o molde da especialidade para `src/clients/<slug>.ts` (o nome do arquivo é o slug: minúsculas, números e hífen):
   - `src/clients/_template-psiquiatria.ts`
   - `src/clients/_template-endocrinologia.ts` (um exemplo pronto está em `src/clients/exemplo-endocrino.ts`)
2. Preencha os campos. O campo `specialty` escolhe o template; se faltar um campo obrigatório dessa especialidade,
   o build aponta qual. Dado que você não tem vira `null` com `// TODO`. Nunca invente CRM, RQE, endereço ou números.
3. Imagens em `public/clinics/<slug>/`; fontes recortadas em `src/assets/fonts/<slug>/` (passo a passo no `CLAUDE.md`).
4. Rode `npm run routes` e `npm run build`, e faça commit (inclusive do `vercel.json`).
5. Acesse:
   - local: `http://localhost:4321/<slug>`
   - no ar: `https://psiquiatria-vincere.vercel.app/<slug>`
   - e, depois de adicionar o domínio em Vercel → psiquiatria-vincere → Settings → Domains: `https://<slug>.preview.vincereai.tech`

Toda prévia (`isPreview: true`) sai com `noindex, nofollow`, `robots.txt` bloqueado e `X-Robots-Tag` no domínio de prévia.
O projeto não gera sitemap.

## Como está organizado

```
src/clients/<slug>.ts        dados de cada cliente (ClientConfig, discriminado por specialty)
src/clients/types.ts         campos comuns (BaseClientConfig, BaseCopy) e a união ClientConfig
src/components/shared/       estrutura comum: Layout/SEO, cabeçalho, rodapé, WhatsApp, sobre, FAQ, localização, CTA
src/templates/<especialidade>/
  Page.astro                 a página da especialidade
  components/                seções próprias
  types.ts                   campos próprios do cliente dessa especialidade
  copy.ts                    textos padrão (o cliente sobrescreve em `copy`)
  theme.ts, icons.ts, images.ts, compliance.ts, styles.css
  index.ts                   exporta o template (formato SpecialtyTemplate)
src/templates/registry.ts    specialty → template
src/pages/[slug].astro       rota única: lê o cliente e renderiza o template
```

## Adicionar uma especialidade

Use `src/templates/endocrinologia/` como modelo.

1. Crie `src/templates/<especialidade>/` com:
   - `types.ts` com `interface <Esp>Client extends BaseClientConfig { specialty: '<especialidade>'; … }`;
   - `copy.ts` com os textos padrão (um tipo que estende `BaseCopy`) e o aviso de publicidade médica no topo;
   - `theme.ts`, `icons.ts`, `images.ts` e `compliance.ts` (termos vedados próprios);
   - as seções em `components/` e um `Page.astro` que monta a página com os componentes de `shared/`;
   - `styles.css`, com tudo dentro de `[data-specialty='<especialidade>']`;
   - `index.ts`, que exporta o objeto do template.
2. Acrescente `<Esp>Client` à união `ClientConfig` em `src/clients/types.ts`.
3. Registre o template em `src/templates/registry.ts`. Enquanto faltar, o build não passa.
4. Importe o `styles.css` em `src/styles/global.css`.
5. Crie o molde `src/clients/_template-<especialidade>.ts` e um cliente de exemplo, rode `npm run routes`, `npm run lint` e `npm run build`,
   e confira que as prévias existentes não mudaram (comparação pixel a pixel, veja o `CLAUDE.md`).

Se uma seção servir a várias especialidades, coloque-a em `src/components/shared/` recebendo os textos por props.
Se ela precisar de um dado novo, crie um campo opcional em `BaseClientConfig`.

## Publicidade médica (CFM 2.336/2023)

`src/lib/compliance.ts` barra no build promessa de resultado, "garantia", "100%", superlativos, descontos e "antes e depois",
além dos termos de cada template. CRM e RQE podem ficar em confirmação na prévia, mas são exigidos para publicar.
Nenhum template exibe depoimentos de pacientes; a prova social é só o número agregado de avaliações, com link para a fonte.
A checagem automática não substitui a revisão humana.
