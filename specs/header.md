# SPEC — Header do Digitaliza Aí

| Campo | Valor |
| --- | --- |
| Status | Implementada; verificação registrada ao final |
| Versão | 0.1 |
| Data | 2026-10-16 |
| Abordagem | Mobile first |
| Fundação | [Tokens CSS](css-design-tokens.md) |
| Referência | [Layout no Figma](https://www.figma.com/design/S8I4KGRBr6zFCIqHIpkt2A/Hackathon--c%C3%B3pia-?node-id=0-1&p=f&m=dev) |

## 1. Objetivo e escopo

Especificar e construir o header azul arredondado do novo frontend, com os textos
“Equatorial Energia” e “MA”, conforme o layout consultado.

A Eyebrow já foi criada, conforme informado pelo usuário. Ela aparece abaixo
do header e deve ser reutilizada na composição da tela, sem ser recriada ou
incorporada à API do header. Não redesenhar as demais áreas da página,
implementar menu, login, seletor de estado ou novas jornadas neste recorte.

Os termos **DEVE**, **NÃO DEVE** e **PODE** indicam requisito, proibição e opção.
Adaptações de acessibilidade e integração abaixo são propostas de implementação,
distintas dos valores observados no Figma.

## 2. Evidência visual e conteúdo

Consulta somente leitura ao Figma em 2026-10-16, com contexto estruturado e
screenshots do header e da tela S01:

| Nó | Referência | Evidência |
| --- | --- | --- |
| `12:47` | [Componente base](https://www.figma.com/design/S8I4KGRBr6zFCIqHIpkt2A/Hackathon--c%C3%B3pia-?node-id=12-47&m=dev) | `MVP / Cabeçalho Equatorial`, 350 × 60px |
| `19:116` | [Header na S01](https://www.figma.com/design/S8I4KGRBr6zFCIqHIpkt2A/Hackathon--c%C3%B3pia-?node-id=19-116&m=dev) | Instância de 358 × 60px, referência deste pedido |
| `6:289` | [Tela S01](https://www.figma.com/design/S8I4KGRBr6zFCIqHIpkt2A/Hackathon--c%C3%B3pia-?node-id=6-289&m=dev) | Frame de 390px; header seguido da Eyebrow e do título |
| `6:291` | [Eyebrow na S01](https://www.figma.com/design/S8I4KGRBr6zFCIqHIpkt2A/Hackathon--c%C3%B3pia-?node-id=6-291&m=dev) | Texto “SEGUNDA VIA”, externo ao header |

Conteúdo confirmado:

- À esquerda: **Equatorial Energia**, em branco.
- À direita: **MA**, em amarelo; identifica o estado, sem affordance de seleção.
- Abaixo do header: Eyebrow **SEGUNDA VIA**, seguida do título da página
  “Como podemos ajudar?”. Esses dois elementos pertencem à tela.

A descrição do componente no Figma informa que o header é inspirado na navegação
azul arredondada do site, com Roboto provisória, sem reproduzir o logotipo oficial.
O texto deve continuar sendo texto HTML; não criar ou substituir por logotipo,
imagem ou SVG.

## 3. Layout e tokens

O layout fornecido pelo usuário foi confirmado na instância da S01:

```css
display: flex;
width: 358px;
height: 60px;
padding: 0 var(--spacing-sm);
justify-content: space-between;
align-items: center;
flex-shrink: 0;
```

| Propriedade | Contrato |
| --- | --- |
| Largura | 358px de referência; ocupar a largura útil do contêiner |
| Altura | 60px com texto padrão; implementar como `min-height` para permitir ampliação |
| Padding horizontal | `--spacing-sm` (16px), equivalente ao `--sm` exportado |
| Padding vertical | Zero na referência |
| Alinhamento | Flex horizontal, `space-between`, centralizado verticalmente |
| Raio | `--radius-full` (999px), equivalente ao `--full` exportado |
| Fundo | `--header-bg` (#0414A1) |
| Texto da identidade | `--text-on-brand` (#FFFFFF) |
| Texto do estado | `--cta-bg` (#FFD700) |
| Espaço até a Eyebrow | `--spacing-xs` (12px), aplicado pela composição da tela |

Usar `box-sizing: border-box`: os 32px de padding horizontal fazem parte dos
358px, deixando 326px internos na referência. Não somar o padding da página ao
padding do header como se ambos fossem do mesmo elemento.

O frame S01 tem padding externo de 16px e borda de 1px, posicionando a instância
em x=17px. Essa borda e o arredondamento do frame não são propriedades do header
nem exigem desenhar uma moldura de celular na aplicação.

Não criar aliases globais `--sm` ou `--full`, duplicar cores ou usar tokens de
legado. Os tokens canônicos existentes atendem a este componente.

## 4. Tipografia

| Conteúdo | Figma | Adaptação proposta para a aplicação |
| --- | --- | --- |
| Equatorial Energia | Roboto Bold, 19px / 27px, peso 700 | Inter, 19px / 27px, peso `--font-weight-bold` |
| MA | Roboto Bold, 13px / 18px, peso 700 | Inter, 13px / 18px, peso `--font-weight-bold` |

Usar `--font-sans`, que já resolve Inter. A mudança de família deve ser revisada
visualmente; não declarar fidelidade tipográfica exata à Roboto nem carregar uma
segunda família silenciosamente. Medidas específicas podem ser locais ao
componente, preferencialmente em rem para acompanhar a preferência de fonte.
Não alterar receitas globais para obter os dois tamanhos específicos.

Os textos do header não são headings: o `h1` continua sendo o título da tela.
Não fixar “SEGUNDA VIA” em uma prop, pseudo-elemento ou estilo do header.

## 5. Responsividade e acessibilidade

- Implementar mobile first, com largura fluida limitada pelo contêiner. Os 358px
  não são largura mínima nem limite obrigatório para layouts maiores.
- Manter os dois textos nas extremidades no tamanho de referência. Em larguras
  pequenas e texto a 200%, permitir quebra e crescimento vertical, sem recorte,
  reticências, sobreposição ou redução da fonte para forçar encaixe.
- Usar gap explícito entre os textos como adaptação, por exemplo
  `--spacing-xxs`, para evitar contato quando `space-between` ficar sem sobra.
- Preservar o conteúdo completo de “Equatorial Energia” e “MA”. A sigla pode
  usar `<abbr title="Maranhão">MA</abbr>` com o significado disponível a tecnologias
  assistivas; a informação não deve depender exclusivamente de tooltip por hover.
- O design consultado apresenta identidade estática. Não tornar toda a pill
  clicável nem inventar ação para “MA”. Se houver navegação posteriormente,
  ela precisa de destino explícito, link semântico e foco visível.
- Conferir contraste de ambos os textos sobre `--header-bg` (mínimo de 4,5:1)
  na implementação. Não usar opacidade que prejudique a leitura.
- Não aplicar `fixed` ou `sticky`: a posição segue o fluxo do layout. Não há
  animação ou estado loading/disabled para este elemento informativo.

## 6. Contrato e integração propostos

Proposta: componente `Header` em `src/app/_components/layout/header/header.tsx`, com export
explícito e sem `use client`. Conteúdo fixo neste recorte: “Equatorial Energia”
e “MA”. Aceitar `className` e atributos HTML de composição; não introduzir API
polimórfica, callbacks, seletor de estado ou biblioteca de UI.

O contêiner deve usar `<header>` no nível de página, com uma única landmark de
cabeçalho global. A implementação deve definir o ponto de montagem antes de
alterar o layout compartilhado: o `Header` atual já é renderizado em
`src/app/layout.tsx`, tem link inicial e aparece nas quatro rotas de serviços.

Esta spec propõe construir e revisar o novo componente isoladamente primeiro.
A integração do `Header` compartilhado deve ser explícita, considerando todas
as rotas consumidoras e o destino do link inicial existente. Não publicar dois
cabeçalhos globais na mesma página ou alterar rotas e metadados por consequência.

A composição da tela é responsável por montar, nesta ordem:

1. Header.
2. Eyebrow existente, com 12px de espaço após o header.
3. Título e demais conteúdos da página, conforme seu próprio recorte.

Não foi localizado componente chamado Eyebrow no checkout consultado. Isso não
invalida a informação do usuário de que ela já foi criada: antes de integrar,
localizar sua implementação ou referência no estado atualizado do projeto e
reutilizá-la. A criação de uma segunda Eyebrow está fora deste escopo.

## 7. Execução futura e critérios de aceite

Antes de escrever código, ler os [guias de estrutura](../docs/structure/overview.md),
as [convenções](../docs/structure/src-structure-and-conventions.md) e a documentação
pertinente da versão Next instalada em `node_modules/next/dist/docs/`.

- Header apresenta exatamente “Equatorial Energia” e “MA”, com hierarquia,
  alinhamento, fundo e raio descritos nesta spec.
- Em um contêiner de 358px, reproduz 358 × 60px com texto padrão e padding
  interno horizontal de 16px.
- A Eyebrow permanece fora do componente e abaixo dele, sem duplicação.
- Verificação manual cobre 320, 375, 390, 414, 768 e 1280px, texto a 200% e
  ausência de rolagem horizontal ou sobreposição.
- Comparação visual usa os nós `19:116` e `6:289`; registrar a adaptação para
  Inter e eventuais diferenças, sem atribuir ao Figma valores propostos.
- Sem dependências de assets temporários ou integração com captura/API/STT.
- Executar `bun run lint`, `bun run build` e verificação manual proporcional,
  registrando resultados e limitações conforme o [workflow](../agent-workflow.md).
  Não criar suítes, scripts ou dependências de teste.

## 8. Verificação da implementação

Foram conferidos contexto estruturado e screenshot do Figma para os nós `12:47`
e `19:116`, os tokens existentes e o ponto de montagem do header no layout.
O componente foi implementado em `src/app/_components/layout/header/header.tsx`, com os
textos como HTML, sem assets temporários, e integrado ao layout global sem
criar uma segunda landmark de cabeçalho. A fonte usa Inter como adaptação local
à fonte Roboto provisória do Figma.

`bun run lint`, `bunx tsc --noEmit` e `git diff --check` passaram. A verificação
manual no navegador cobriu 320px e 390px: o header manteve a pill azul, os dois
textos nas extremidades, uma única landmark `banner` e nenhum overflow visível.
O build de produção permanece sujeito à limitação do ambiente: o Turbopack
falhou ao criar processo auxiliar por `Operation not permitted`; a tentativa
com Webpack falhou ao interpretar `tsc --showConfig`. A Eyebrow não foi
alterada porque não existe componente correspondente no checkout atual.
