# CLAUDE.md

Molde multi-clínica de landing pages para psiquiatras, feito pela Vincere.AI.
Astro 7 + Tailwind CSS v4, site estático. Cada clínica é um arquivo em `src/clinics/<slug>.ts` e vira a página `/<slug>`.
Converse com o usuário em português do Brasil, sem jargão técnico desnecessário.

## Comandos

```bash
npm install
npm run dev     # http://localhost:4321/<slug>
npm run build   # astro check + build; precisa terminar com "0 errors"
```

## Como funciona

- `src/clinics/<slug>.ts`: dados da clínica (tipo `ClinicConfig` em `src/clinics/types.ts`).
  `src/clinics/index.ts` carrega todos, menos `index.ts`, `types.ts` e arquivos `_*.ts`.
- `src/clinics/_template.ts`: molde comentado. Copie-o para criar uma clínica nova.
- `src/pages/[slug].astro`: página de cada clínica. `src/pages/[slug]/robots.txt.ts` e `favicon.svg.ts` geram os arquivos por clínica.
- `src/lib/copy.ts`: textos padrão das seções, que a clínica pode sobrescrever em `copy`.
  Variáveis disponíveis: `{medico}`, `{titulo}`, `{cidade}`, `{uf}`, `{publico}`.
- `src/lib/agency.ts`: dados da Vincere.AI e o domínio das prévias (`preview.vincereai.tech`).
- `src/lib/compliance.ts`: checagem da Resolução CFM 2.336/2023, roda em todo build.
- `astro.config.mjs`: carrega as fontes de todas as clínicas (variáveis `--fh-<slug>` e `--fb-<slug>`).
- `vercel.json`: `<slug>.preview.vincereai.tech` serve `/<slug>`; a raiz redireciona para vincereai.tech.

**Regra de ouro:** nada de uma clínica fica fixo no código dos componentes. Dados, cores, fontes, imagens e textos vêm da config.
Se um componente precisar de um dado novo, adicione um campo **opcional** em `types.ts`.

## Criar a prévia de uma clínica nova

1. Copie `_template.ts` para `src/clinics/<slug>.ts` e use o mesmo `slug` (só minúsculas, números e hífen).
   Se o usuário mandar um `.ts` pronto, use-o e adapte `types.ts` com campos opcionais em vez de mudar os dados dele.
2. Imagens vão em `public/clinics/<slug>/`. Os tamanhos são lidos no build, não fixe `width`/`height` de clínica no código.
3. Fontes: recorte e guarde em `src/assets/fonts/<slug>/` (`heading-normal.woff2`, `heading-italic.woff2`, `body-normal.woff2`).
   Baixe com `@fontsource-variable/<fonte>` do npm numa pasta de rascunho e recorte com fonttools (`varLib.instancer` para os pesos e `pyftsubset` para os caracteres do português).
   Sem esses arquivos, o build tenta baixar do Google Fonts. Neste ambiente de nuvem esse download costuma falhar e o site cai na fonte reserva, por isso prefira os arquivos locais.
4. Deixe cada prévia com cara própria. Combine as opções de `style` de um jeito diferente das clínicas existentes
   (`grep -n "style" src/clinics/*.ts` mostra o que cada uma usa; sem `style`, valem os padrões `arch` + `marquee` + `soft`, como na Animus):
   - `style.hero`: `arch` (foto em arco que se abre ao rolar), `circle` (foto ou monograma num círculo com anel de texto)
     ou `cinema` (tela cheia escura com luz de projetor, título que entra em foco, créditos de cartaz; foto opcional ao fundo).
     Com `cinema`, os destaques ficam no próprio topo (a faixa de destaques some).
   - `style.conditions`: `marquee` (faixas deslizando) ou `chips` (lista fixa).
   - `style.finish`: `soft` (arredondado), `editorial` (botões retos, seções numeradas, textura, fundo animado, barra de leitura)
     ou `cinema` (cenas escuras intercaladas, títulos em foco, granulação de filme, condições como letreiro, primeira consulta
     com título preso na rolagem, abertura em letterbox).
   - `style.intro`: abertura com cortina, só na 1ª visita.
   - `theme`: cores, fontes e `headingWeight`.
   - Seções opcionais: `approach` liga "Abordagem"; `doctor.experience` liga "Trajetória"; `highlights` (ou `credentials`) são os números em destaque;
     `research` liga "Pesquisa" (trabalho acadêmico como capa de publicação); `articles` liga o conteúdo educativo.
   Se nada disso der uma cara diferente o bastante, crie uma variação nova e reutilizável (opção em `style`), nunca um componente exclusivo de uma clínica.
5. Rode `npm run build` e verifique:
   - celular (390 px) e desktop (1440 px), com screenshots via puppeteer-core usando `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`;
   - sem rolagem lateral (`document.documentElement.scrollWidth` igual à largura da tela);
   - Lighthouse com acessibilidade 100 e desempenho ≥ 95. O SEO fica baixo de propósito por causa do `noindex` da prévia.
6. Publique (veja Deploy) e diga ao usuário qual domínio adicionar na Vercel.

## Regras de conteúdo (CFM 2.336/2023), o build barra

- Proibido: promessa de cura ou resultado, "garantia", "100%", "o melhor…", descontos, "antes e depois", depoimentos de pacientes.
- Prova social: só o número agregado de avaliações, com link para a fonte.
- CRM e RQE são obrigatórios. Em prévia (`isPreview: true`) podem ficar `null`: a página mostra "em confirmação" e o build só avisa. Para publicar, o build exige.
- `compliance.hideNonRecognizedSpecialties`: barra termos como "ortomolecular" e "medicina integrativa/funcional" nos textos exibidos.
- Nunca invente CRM, RQE, endereço, telefone, preços ou números. Dado faltando vira `null` com comentário `// TODO`.
- O aviso de emergência (SAMU 192 / CVV 188) e o diretor técnico ficam no rodapé.

## Ao mexer em componentes compartilhados

Mudanças visuais pedidas para uma clínica não podem alterar as outras sem o usuário pedir.
Faça a mudança como opção de `style` e compare as outras páginas antes e depois, de preferência com screenshots de página inteira comparados pixel a pixel.
Para a comparação, desligue as animações (`prefers-reduced-motion: reduce`) e use `loading = 'eager'` nas imagens.

## Deploy

- A Vercel publica a partir da branch **`main`**, no projeto **psiquiatria-vincere**. Ao terminar, faça commit e envie também para a `main`:
  `git push origin <branch-da-sessão>:main`.
- Subdomínio: o usuário adiciona `<slug>.preview.vincereai.tech` em Vercel → psiquiatria-vincere → Settings → Domains.
  O DNS está na Hostinger, com um CNAME curinga `*.preview` → `cname.vercel-dns.com`; não precisa mexer lá.
- Antes do domínio ficar válido, a prévia já abre em `https://psiquiatria-vincere.vercel.app/<slug>`.

## Limitações deste ambiente

- A rede de saída costuma bloquear sites de clínicas, o Doctoralia e a própria Vercel.
  Se não conseguir abrir um link, peça ao usuário os dados (ou um `.ts` pronto, as imagens e os textos) ou peça que libere o domínio nas configurações de rede do ambiente.
- Não dá para testar `vercel.json` (redirecionamentos e subdomínios) daqui. Peça ao usuário para conferir os links depois do deploy.
