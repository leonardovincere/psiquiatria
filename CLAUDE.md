# CLAUDE.md

Fábrica de prévias de landing pages para médicos, feita pela Vincere.AI. Multi-especialidade: hoje **psiquiatria** e **endocrinologia**.
Astro 7 + Tailwind CSS v4, site estático. Cada cliente é um arquivo em `src/clients/<slug>.ts` e vira a página `/<slug>`.
Converse com o usuário em português do Brasil, sem jargão técnico desnecessário.

## Comandos

```bash
npm install
npm run dev     # http://localhost:4321/<slug>
npm run build   # astro check + build; precisa terminar com "0 errors"
npm run lint    # astro check + confere que src/components/shared não tem texto de especialidade
npm run routes  # regenera as regras de subdomínio no vercel.json
```

## Como funciona

- `src/clients/<slug>.ts`: dados do cliente. Tipo `ClientConfig` (`src/clients/types.ts`), discriminado pelo campo obrigatório `specialty`:
  `BaseClientConfig` tem os campos comuns, e cada especialidade acrescenta os seus em `src/templates/<especialidade>/types.ts`.
  `src/clients/index.ts` carrega todos, menos `index.ts`, `types.ts` e arquivos `_*.ts`.
- `src/clients/_template-psiquiatria.ts` e `_template-endocrinologia.ts`: moldes comentados. `exemplo-endocrino.ts` é um cliente fictício de demonstração.
- `src/templates/<especialidade>/`: seções próprias (`components/`), `Page.astro`, textos padrão (`copy.ts`), paleta (`theme.ts`),
  ícones, sugestões de imagem, termos vedados próprios (`compliance.ts`) e `styles.css`. Todos exportam o mesmo formato (`SpecialtyTemplate`, em `src/templates/types.ts`).
- `src/templates/registry.ts`: liga cada `specialty` ao template. Especialidade sem template quebra o build.
- `src/components/shared/`: estrutura comum (Layout com SEO/metadados, cabeçalho, rodapé, botões de WhatsApp, sobre, teleconsulta, FAQ, localização, CTA final).
  Recebem os textos por props, nunca leem `copy` nem têm texto de especialidade (`npm run lint` confere).
- `src/pages/[slug].astro`: rota única; busca o cliente e renderiza o `Page` do template. `src/pages/[slug]/robots.txt.ts` e `favicon.svg.ts` geram os arquivos por cliente.
- `src/lib/copy.ts`: mescla os textos padrão do template com o `copy` do cliente.
  Variáveis disponíveis: `{medico}`, `{titulo}`, `{cidade}`, `{uf}`, `{publico}`.
- `src/styles/global.css`: junta `base.css` (compartilhado) e o `styles.css` de cada especialidade.
- `src/lib/agency.ts`: dados da Vincere.AI e o domínio das prévias (`preview.vincereai.tech`).
- `src/lib/compliance.ts`: checagem da Resolução CFM 2.336/2023 (regras comuns + as do template), roda em todo build sobre a config e os textos finais.
- `astro.config.mjs`: carrega as fontes de todas as clínicas (variáveis `--fh-<slug>` e `--fb-<slug>`).
- `vercel.json`: uma regra por clínica (`<slug>.preview.vincereai.tech` → `/<slug>`), gerada por `npm run routes` (`scripts/vercel-routes.mjs`); a raiz de outros domínios redireciona para vincereai.tech.

**Regra de ouro:** nada de uma clínica fica fixo no código dos componentes. Dados, cores, fontes, imagens e textos vêm da config.
Se um componente precisar de um dado novo, adicione um campo **opcional**: em `BaseClientConfig` se servir a todas as especialidades,
ou no `types.ts` do template se for só de uma. Nada de especialidade em `src/components/shared/`.

## Criar a prévia de um cliente novo

1. Copie o molde da especialidade (`_template-psiquiatria.ts` ou `_template-endocrinologia.ts`) para `src/clients/<slug>.ts`
   e use o mesmo `slug` (só minúsculas, números e hífen).
   Se o usuário mandar um `.ts` pronto, use-o e adapte os tipos com campos opcionais em vez de mudar os dados dele.
2. Imagens vão em `public/clinics/<slug>/`. Os tamanhos são lidos no build, não fixe `width`/`height` de clínica no código.
3. Fontes: recorte e guarde em `src/assets/fonts/<slug>/` (`heading-normal.woff2`, `heading-italic.woff2`, `body-normal.woff2`).
   Baixe com `@fontsource-variable/<fonte>` do npm numa pasta de rascunho e recorte com fonttools (`varLib.instancer` para os pesos e `pyftsubset` para os caracteres do português).
   Sem esses arquivos, o build tenta baixar do Google Fonts. Neste ambiente de nuvem esse download costuma falhar e o site cai na fonte reserva, por isso prefira os arquivos locais.
4. Deixe cada prévia com cara própria. Em **endocrinologia**: `theme`, `exams` (exames e bioimpedância), `areas`, `care` e `highlights`.
   Em **psiquiatria**, combine as opções de `style` de um jeito diferente das clínicas existentes
   (`grep -n "style" src/clients/*.ts` mostra o que cada uma usa; sem `style`, valem os padrões `arch` + `marquee` + `soft`, como na Animus):
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
5. Rode `npm run routes`: ele gera no `vercel.json` a regra do subdomínio da clínica nova. Faça commit do `vercel.json`; sem isso, o build para com um aviso.
6. Rode `npm run build` e verifique:
   - celular (390 px) e desktop (1440 px), com screenshots via puppeteer-core usando `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`;
   - sem rolagem lateral (`document.documentElement.scrollWidth` igual à largura da tela);
   - Lighthouse com acessibilidade 100 e desempenho ≥ 95. O SEO fica baixo de propósito por causa do `noindex` da prévia.
7. Publique (veja Deploy) e diga ao usuário qual domínio adicionar na Vercel.

## Regras de conteúdo (CFM 2.336/2023), o build barra

- Proibido: promessa de cura ou resultado, "garantia", "100%", "o melhor…", descontos, "antes e depois", depoimentos de pacientes.
- Prova social: só o número agregado de avaliações, com link para a fonte.
- CRM e RQE são obrigatórios. Em prévia (`isPreview: true`) podem ficar `null`: a página mostra "em confirmação" e o build só avisa. Para publicar, o build exige.
- `compliance.hideNonRecognizedSpecialties`: barra termos como "ortomolecular" e "medicina integrativa/funcional" nos textos exibidos.
- Nunca invente CRM, RQE, endereço, telefone, preços ou números. Dado faltando vira `null` com comentário `// TODO`.
- O aviso de emergência e o diretor técnico ficam no rodapé. O aviso é do template: psiquiatria cita SAMU 192 e CVV 188; endocrinologia, SAMU 192.
- Endocrinologia também barra promessa de perda de peso ("perca 10 kg", "emagrecimento rápido") e terapias hormonais
  com fim estético ou "antienvelhecimento" (CFM 2.333/2023). Veja `src/templates/endocrinologia/compliance.ts`.
- Nenhum template tem seção de depoimentos de pacientes.

## Criar uma especialidade nova

Siga o passo a passo do README ("Adicionar uma especialidade"). Use `src/templates/endocrinologia/` como modelo:
seções próprias no template, estrutura comum em `src/components/shared/`, estilos escopados em `[data-specialty='<especialidade>']`.
Ao terminar, compare as prévias existentes pixel a pixel: nenhuma pode mudar.

## Ao mexer em componentes compartilhados

Mudanças visuais pedidas para uma clínica não podem alterar as outras sem o usuário pedir.
Faça a mudança como opção de `style` (ou dentro do template da especialidade) e compare as outras páginas antes e depois, de preferência com screenshots de página inteira comparados pixel a pixel.
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
