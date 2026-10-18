# Conector visual da trilha

**Data:** 18/10/2026. **Branch:** `review-ui`.

## Escopo e aceite

Evoluir o mapa `/servicos/segunda-via/whatsapp` com um conector sinuoso, mantendo
ícones, textos, botões, fonte, paleta, espaçamentos e deslocamentos das etapas.
O percurso completo deve aparecer neutro desde a abertura e destacar gradualmente
o trecho percorrido, com energia sutil e contínua. As curvas devem preservar a
leitura dos rótulos, não interferir na navegação e respeitar movimento reduzido.

## Implementação

Camada SVG local à jornada, ligada ao progresso já existente. A manutenção de
geometria, cores, animação e estados fica na
[direção visual](../structure/visual-direction.md#continuidade-visual-do-mapa).
Não foram adicionados assets raster, dependências, rotas de prévia ou infraestrutura
de testes. As alterações anteriores do header permanecem no mesmo checkout.

## Verificação em 18/10/2026

- `bun run lint`: aprovado.
- `bun node_modules/typescript/bin/tsc --noEmit`: aprovado.
- `git diff --check`: aprovado.
- `bun run build`: bloqueado pelo ambiente, mesmo fora do sandbox. O Turbopack
  falhou ao abrir uma porta para seu processo auxiliar (`Operation not permitted`).
- Navegador com aplicação e backend locais: mapa com sete círculos e seis conexões
  neutras. Inspeção em 320px, 390px e desktop (viewport de 1280px) sem overflow
  horizontal na lista; amostragem da geometria do traço em 320px e desktop sem
  cruzamentos com os retângulos dos rótulos.
- A demonstração foi reproduzida até a conclusão pelo fluxo existente. Ao voltar
  ao mapa, o primeiro círculo estava concluído, o segundo era o atual e apenas a
  primeira conexão estava realçada. As cinco seguintes permaneceram neutras;
  a faixa de energia tinha animação ativa no trecho percorrido.
- Com movimento reduzido emulado no navegador, o pulso ficou com `display: none`
  e sem animação, preservando o segmento verde estático. O SVG permaneceu
  `aria-hidden` e com `pointer-events: none`.
- Sem novos erros ou avisos no console durante a conferência.

Evidências locais em `output/playwright`: `trilha-conector-neutro-390.png`,
`trilha-conector-progresso-320.png`, `trilha-conector-reduzido-320.png`,
`trilha-conector-desktop.png` e `trilha-conector-proposta-390.png`.
Não foi refeita a jornada completa das seis atividades nesta alteração; o estado
de conclusão total e lacunas de progresso foram conferidos na derivação do código,
sem simular conquistas no armazenamento. Não houve conferência em aparelho físico.

## Refinamento da geometria (18/10/2026)

**Causa:** a primeira geometria combinava duas curvas curtas com um trecho reto
vertical e afastamento de 12px. O retorno entrava pela lateral do círculo seguinte,
criando uma aparência de contorno apertado em torno do conteúdo.

**Alteração:** somente o cálculo e a medição em `roadmap-path.tsx`, mantendo a
camada SVG, a lista e o comportamento de progresso. O contrato do traçado revisado
está na [direção visual](../structure/visual-direction.md#continuidade-visual-do-mapa).
Sem mudanças no CSS, círculos, textos, badges, ícones, tokens ou persistência nesta
iteração.

**Verificação efetiva:**

- Lint, TypeScript e `git diff --check` aprovados. O build foi tentado novamente
  fora do sandbox e permaneceu bloqueado pela abertura de porta do processo auxiliar
  do Turbopack (`Operation not permitted`).
- A página foi recarregada para conferir o SVG atualizado. Em 390px, a lista
  manteve 1048px de altura e os mesmos centros dos sete círculos, inclusive as
  coordenadas verticais 48, 192, 360, 504, 648, 792 e 936px relativas à lista.
- Em 320px, sem overflow horizontal; amostragem do traço a cada 2px encontrou
  distância mínima aproximada de 20.2px entre o centro da linha e os retângulos
  dos rótulos. A linha de 4px não atravessou os textos.
- Inclusão temporária de um oitavo passo com texto de outra altura no DOM:
  a lista e o SVG passaram de 1048px para 1244px e a conexão adicional apareceu.
  Após remover o passo temporário, ambos voltaram a 1048px com sete círculos.
  Essa foi uma inspeção de layout no navegador; nenhum conteúdo ou progresso
  do produto foi gravado por ela.
- O primeiro trecho continuou concluído e o próximo passo permaneceu ativo;
  as conexões futuras continuaram neutras. As camadas usam a mesma geometria.
- Desktop de 1280px: lista com 610px de largura e 1048px de altura, sem overflow.
  Com movimento reduzido, o pulso ficou oculto e sem animação; o segmento
  concluído permaneceu totalmente preenchido.

Prévia: `output/playwright/trilha-refinamento-depois-390.png`. Comparação inicial:
`trilha-refinamento-antes-390.png`; menor largura: `trilha-refinamento-320.png`.
Desktop e movimento reduzido: `trilha-refinamento-desktop.png` e
`trilha-refinamento-reduzido.png`.
