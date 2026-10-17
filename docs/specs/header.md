# Registro da entrega: Header

**Consulta original:** 16/10/2026. **Tipo:** evidência histórica.
Manutenção do Header, Eyebrow e AppShell: [UI](../structure/styling-and-ui.md#header-e-composicao-da-pagina).
Tokens: [design system](../structure/design-system.md).

## Objetivo da entrega

Construir o cabeçalho estático a partir da instância da S01, usando texto HTML,
identidade Equatorial e indicação de Maranhão. A fonte Inter foi uma adaptação
local à Roboto provisória do desenho, sem reproduzir o logotipo oficial.

O contrato atual está no guia de UI. A implantação posterior do AppShell e da
Eyebrow torna históricas as observações de checkout contidas no registro abaixo.
Não houve nova consulta ao Figma ou inspeção de navegador nesta consolidação.

## Origem visual

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


## Verificação registrada na etapa original

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
