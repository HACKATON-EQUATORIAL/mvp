# SPECS — tokens CSS do Digitaliza Aí

| Campo | Valor |
| --- | --- |
| Status | Implementada; verificação registrada ao final |
| Versão | 1.0 |
| Data | 2026-10-16 |
| Origem visual | Equatorial MA, captura de 2026-10-15 |
| Implementação | `src/app/globals.css` e `src/app/layout.tsx` |

## 1. Objetivo

Definir o contrato de tokens CSS do Digitaliza Aí a partir dos valores extraídos
da home da Equatorial MA. O contrato deve permitir que páginas e componentes
compartilhem identidade visual, estados, tipografia, espaçamento e movimento sem
espalhar valores literais pelo código.

Esta especificação distingue quatro conceitos:

1. **valor observado**: evidência obtida da página de referência;
2. **token primitivo**: escala sem contexto de uso, como `--primary-500`;
3. **token semântico**: papel na interface, como `--text-body`;
4. **receita**: combinação aplicada por uma classe ou componente, como
   `.text-card-heading`.

Os valores observados não se tornam automaticamente adequados a qualquer uso.
Contraste, legibilidade, responsividade e o contexto do Digitaliza Aí continuam
obrigatórios.

## 2. Estado atual e autoridade

- `src/app/globals.css` declara os tokens e receitas implementados. O layout
  carrega Inter por `next/font/google` e fornece a variável `--font-inter`.
- Este documento define o contrato; os estilos atuais já consomem seus aliases
  semânticos. O retrabalho das telas pode usar essa fundação.
- O frontend atual é transitório: seus tokens, aliases e composição visual não
  são requisitos de compatibilidade para o novo frontend.
- A página da Equatorial MA é referência visual e de proveniência, não uma
  dependência em tempo de execução.
- A captura foi descrita como gerada a partir de `tokens.json`, mas esse artefato
  não está neste repositório. Enquanto ele não for incorporado, os valores deste
  documento são o registro local da captura.
- O projeto não possui tema escuro. Criá-lo exige especificação própria.

Os termos **DEVE**, **NÃO DEVE**, **DEVERIA** e **PODE** indicam requisito,
proibição, recomendação e opção, respectivamente.

## 3. Escopo

Incluído:

- cores primitivas e semânticas;
- família, escala e receitas tipográficas;
- espaçamento, raios e sombras;
- breakpoints, contêineres e camadas;
- duração e curva de movimento;
- integração esperada com CSS global, Tailwind v4 e `next/font`;
- regras de acessibilidade, adoção e aceite.

Fora do escopo:

- implementar o retrabalho completo das telas;
- instalar biblioteca de componentes;
- criar tema escuro;
- definir um gerador para `tokens.json`;
- alterar o contrato de transcrição ou as jornadas dos serviços;

## 4. Arquitetura e nomes

O fluxo de dependência DEVE ser unidirecional:

```text
valor primitivo → token semântico → receita/componente → seletor
```

Um token primitivo NÃO DEVE referenciar um token semântico. Aliases NÃO DEVEM
formar ciclos.

| Camada | Padrão | Exemplo | Regra |
| --- | --- | --- | --- |
| Primitiva | `--{família}-{escala}` | `--primary-500` | Não comunica uso |
| Semântica global | `--{papel}-{variante}` | `--text-muted` | Comunica intenção |
| Componente | `--{componente}-{propriedade}-{estado?}` | `--card-service-bg-hover` | Só para padrão recorrente |
| Receita de texto | `.text-{papel}` | `.text-body-sm` | Consome tokens; não é token |
| Legado | `--legacy-{nome}` | `--legacy-green` | Apenas migração |

Regras de autoria:

- nomes DEVEM ser em inglês, minúsculos e separados por hífen;
- nomes NÃO DEVEM conter o valor (`blue`, `16px`) quando representam um papel;
- componentes DEVEM preferir tokens semânticos; primitivos são permitidos na
  definição dos próprios aliases;
- novos valores literais em seletores DEVEM ser evitados. Uma exceção precisa
  ser local, justificada e candidata a token apenas quando houver reuso ou papel
  de interface estável;
- `--legacy-*` NÃO DEVE aparecer em código novo;
- um token removido DEVERIA permanecer como alias depreciado durante uma janela
  de migração, quando isso evitar quebra silenciosa.

## 5. Catálogo normativo

### 5.1 Cores semânticas e de componente

| Token | Valor | Papel |
| --- | --- | --- |
| `--header-bg` | `#0414a1` | Fundo do cabeçalho |
| `--header-bg-hover` | `#030f78` | Estado interativo do cabeçalho |
| `--footer-bg` | `var(--primary-500)` | Fundo do rodapé |
| `--nav-hover-bg` | `#0414a11a` | Fundo sutil de navegação em hover |
| `--cta-bg` | `var(--highlight-500)` | Fundo de ação principal |
| `--cta-bg-hover` | `#ffcc00` | Hover da ação principal |
| `--cta-text` | `#000000` | Texto sobre a ação principal |
| `--text-body` | `#3b3b3b` | Texto corrido |
| `--text-heading` | `var(--neutral-900)` | Títulos |
| `--text-muted` | `var(--neutral-600)` | Texto secundário |
| `--text-subtle` | `var(--neutral-500)` | Metadados e texto de baixa ênfase |
| `--text-on-brand` | `#ffffff` | Texto sobre fundos de marca escuros |
| `--surface-page` | `#ffffff` | Fundo da página |
| `--surface-subtle` | `#f8f9fa` | Superfície de baixa ênfase |
| `--surface-muted` | `var(--neutral-100)` | Superfície desabilitada ou agrupada |
| `--border-default` | `#e0e0e0` | Divisores e bordas neutras |
| `--card-service-bg` | `var(--primary-50)` | Cartão de serviço |
| `--card-service-bg-hover` | `#c0c3f7` | Hover do cartão de serviço |
| `--card-service-title-hover` | `#00136e` | Título no hover do cartão |
| `--news-title` | `var(--primary-600)` | Títulos de notícias |
| `--tag-border` | `var(--primary-200)` | Borda de tag |
| `--tariff-green` | `#00c853` | Bandeira tarifária verde |
| `--tariff-yellow` | `#ffd600` | Bandeira tarifária amarela |
| `--tariff-red` | `#ff1744` | Bandeira tarifária vermelha |
| `--tariff-red-dark` | `#d50000` | Variação vermelha escura |

Os tokens de tarifa comunicam uma classificação externa. Eles NÃO DEVEM ser
reutilizados como feedback genérico de sucesso, alerta ou erro.

### 5.2 Paletas primitivas

| Escala | `primary` | `highlight` | `warning` | `success` | `error` |
| --- | --- | --- | --- | --- | --- |
| `50` | `#eff3ff` | `#fbf2c3` | `#ffe6cf` | `#cdf2cf` | `#ffcdcd` |
| `100` | `#d6e4ff` | `#faf097` | `#ffcb99` | `#96e49a` | `#ff9c9c` |
| `200` | `#a9cbff` | `#f8ed71` | `#ffb066` | `#5ad662` | `#ff6b6b` |
| `300` | `#6d9eff` | `#f7eb4f` | `#ff9533` | `#2fc937` | `#ff3939` |
| `400` | `#3473e8` | `#f2e531` | `#ff7a00` | `#19bc24` | `#ff0808` |
| `500` | `#040f6d` | `#ffd700` | `#d06502` | `#006f03` | `#d50606` |
| `600` | `#031059` | `#aa8f28` | `#a95302` | `#005c02` | `#ab0505` |
| `700` | `#021045` | `#86721f` | `#814002` | `#004902` | `#810404` |
| `800` | `#020d30` | `#625416` | `#5a2d01` | `#003501` | `#560303` |
| `900` | `#010b1f` | `#3e350e` | `#321a01` | `#002201` | `#2c0101` |

Cada célula representa `--{família}-{escala}`. A numeração expressa progressão
visual dentro da família; ela não garante contraste para texto.

| Token neutro | Valor | Token neutro | Valor |
| --- | --- | --- | --- |
| `--neutral-0` | `#ffffff` | `--neutral-500` | `#737373` |
| `--neutral-50` | `#fafafa` | `--neutral-600` | `#525252` |
| `--neutral-100` | `#f5f5f5` | `--neutral-700` | `#404040` |
| `--neutral-200` | `#e5e5e5` | `--neutral-800` | `#262626` |
| `--neutral-300` | `#d4d4d4` | `--neutral-900` | `#171717` |
| `--neutral-400` | `#a3a3a3` | `--neutral-950` | `#000000` |

Tokens aceitos apenas para compatibilidade:

| Token | Valor | Política |
| --- | --- | --- |
| `--legacy-green` | `#00a335` | Depreciado; não usar em código novo |
| `--legacy-teal` | `#005f86` | Depreciado; não usar em código novo |
| `--legacy-text` | `#333333` | Depreciado; migrar para token semântico |

### 5.3 Tipografia primitiva

`--font-sans` representa Inter com a seguinte pilha de fallback:

```css
"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
"Helvetica Neue", Arial, sans-serif
```

Na aplicação Next.js, Inter DEVE ser carregada por `next/font/google` e exposta
por variável CSS. O `@import` remoto da captura não faz parte do contrato: a
versão instalada do Next.js baixa a fonte no build e a serve localmente, sem
requisição do navegador ao Google.

| Token | Valor |
| --- | --- |
| `--line-height-xs` | `1.2` |
| `--line-height-sm` | `1.4` |
| `--line-height-base` | `1.5` |
| `--line-height-lg` | `1.6` |
| `--line-height-xl` | `1.8` |

| Escala | Desktop | Mobile |
| --- | --- | --- |
| `xs` | `0.75rem` | `0.5rem` |
| `sm` | `0.875rem` | `0.75rem` |
| `base` | `1rem` | `0.875rem` |
| `md` | `1.125rem` | `1rem` |
| `lg` | `1.25rem` | `1.125rem` |
| `xl` | `1.5rem` | `1.25rem` |
| `2xl` | `2rem` | `1.5rem` |
| `3xl` | `2.5rem` | `1.75rem` |
| `4xl` | `3rem` | `2rem` |
| `5xl` | `3.5rem` | `2.5rem` |
| `display` | `5rem` | — |

Cada valor representa `--font-size-{viewport}-{escala}`. As escalas são
primitivas e NÃO definem sozinhas qual tamanho um papel tipográfico usa.
`--font-size-mobile-xs` (8 px) não é permitido para conteúdo informativo ou
acionável; permanece catalogado apenas por fidelidade à extração.

### 5.4 Receitas tipográficas observadas

As classes abaixo são receitas, não tokens. Uma implementação DEVE compô-las a
partir de família, tamanho, altura de linha, peso e espaçamento entre letras.

| Receita | Tamanho | Altura | Peso | Espaçamento |
| --- | --- | --- | --- | --- |
| `.text-hero-title` | `62.4px` | `1.2` | `400` | padrão |
| `.text-section-title` | `40px` | `1.4` | `700` | padrão |
| `.text-section-title-md` | `32px` | `1.1` | `700` | padrão |
| `.text-subsection-title` | `24px` | `1.2` | `700` | padrão |
| `.text-card-heading` | `18px` | `1.4` | `600` | padrão |
| `.text-card-title` | `16px` | `1.2` | `600` | padrão |
| `.text-body` | `16px` | `1.5` | `400` | padrão |
| `.text-body-sm` | `14px` | `1.6` | `400` | padrão |
| `.text-cta-label` | `14px` | `1.5` | `600` | padrão |
| `.text-nav-link` | `14px` | `1.5` | `400` | padrão |
| `.text-submenu-link` | `12px` | `1.5` | `500` | padrão |
| `.text-footer-title` | `14px` | `1.4` | `900` | padrão |
| `.text-footer-link` | `14px` | `1.8` | `400` | padrão |
| `.text-caption` | `12px` | `1.5` | `400` | padrão |
| `.text-tag` | `9px` | `1.5` | `600` | `0.2px` |

As receitas foram observadas na home de referência e não fornecem mapeamento
mobile completo. Até uma revisão visual definir esse mapeamento, a implementação
NÃO DEVE inferir que receitas em mobile usam automaticamente a escala
`--font-size-mobile-*`. Texto informativo ou acionável DEVE ter ao menos 12 px;
portanto `.text-tag` precisa usar 12 px no Digitaliza Aí ou ficar restrita a
ornamento redundante e não acionável.

### 5.5 Espaçamento e raios

| Token | Valor | Token | Valor |
| --- | --- | --- | --- |
| `--spacing-xxs` | `8px` | `--spacing-xl` | `40px` |
| `--spacing-xs` | `12px` | `--spacing-xxl` | `48px` |
| `--spacing-sm` | `16px` | `--spacing-3xl` | `56px` |
| `--spacing-md` | `24px` | `--spacing-4xl` | `64px` |
| `--spacing-lg` | `32px` | `--spacing-5xl` | `80px` |
|  |  | `--spacing-6xl` | `96px` |

| Token | Valor |
| --- | --- |
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `16px` |
| `--radius-xl` | `24px` |
| `--radius-full` | `999px` |

Margens e paddings que não pertencem à escala PODEM existir quando necessários
para alinhamento tipográfico ou área mínima de toque. Não se deve criar um token
global para cada exceção local.

### 5.6 Sombras

| Token | Valor |
| --- | --- |
| `--shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)` |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)` |
| `--shadow-2xl` | `0 25px 50px -12px rgba(0,0,0,0.25)` |
| `--shadow-service` | `0 2px 8px 0 rgba(0,0,0,0.1)` |
| `--shadow-service-hover` | `0 8px 24px 0 rgba(0,0,0,0.15)` |
| `--shadow-cta-hover` | `0 4px 12px 0 rgba(255,215,0,0.3)` |

Sombras NÃO DEVEM ser o único meio de indicar foco, seleção ou separação
necessária para compreender a interface.

### 5.7 Layout e camadas

| Token | Valor | Token | Valor |
| --- | --- | --- | --- |
| `--breakpoint-xxs` | `375px` | `--breakpoint-xl` | `1200px` |
| `--breakpoint-xs` | `414px` | `--breakpoint-xxl` | `1396px` |
| `--breakpoint-sm` | `576px` | `--breakpoint-wide` | `1600px` |
| `--breakpoint-md` | `768px` | `--container-max-width` | `1400px` |
| `--breakpoint-lg` | `992px` | `--container-padding` | `16px` |

| Token | Valor | Uso |
| --- | --- | --- |
| `--z-index-dropdown` | `10` | Menus suspensos |
| `--z-index-sticky` | `50` | Elementos sticky |
| `--z-index-fixed` | `60` | Elementos fixos |
| `--z-index-modal-backdrop` | `90` | Fundo de modal |
| `--z-index-header` | `99` | Cabeçalho sobre conteúdo |
| `--z-index-modal` | `100` | Modal |
| `--z-index-toast` | `110` | Mensagem temporária |

Custom properties de `:root` não podem ser usadas diretamente na condição de
uma media query, como `@media (min-width: var(--breakpoint-md))`. A implementação
DEVE manter os mesmos valores em literais de media query ou registrá-los no
mecanismo de tema do Tailwind; não deve simular que o alias de runtime controla
a condição.

O contêiner de 1400 px é um limite global disponível, não substitui limites
menores exigidos por legibilidade. A tela de transcrição atual pode continuar
com largura de conteúdo mais estreita.

### 5.8 Movimento

| Token | Valor |
| --- | --- |
| `--transition-fast` | `0.15s ease-in-out` |
| `--transition-base` | `0.3s ease-in-out` |
| `--transition-slow` | `0.5s ease-in-out` |

Componentes DEVEM desativar movimento não essencial em
`prefers-reduced-motion: reduce`. Transições não podem atrasar confirmação de
uma ação nem esconder mudança de estado de tecnologia assistiva.

## 6. Acessibilidade de cor

Antes de usar uma dupla de cores, a implementação DEVE verificar o contraste no
estado normal, hover, foco, ativo e desabilitado:

- 4,5:1 para texto comum;
- 3:1 para texto grande;
- 3:1 para indicadores gráficos e limites de controles quando necessários para
  identificá-los.

Verificação inicial dos pares propostos, calculada em sRGB:

| Par | Contraste | Resultado para texto comum |
| --- | --- | --- |
| `--header-bg` / `--text-on-brand` | `12.96:1` | Aprovado |
| `--primary-500` / branco | `16.22:1` | Aprovado |
| `--cta-bg` / `--cta-text` | `14.97:1` | Aprovado |
| `--text-body` / `--surface-page` | `11.20:1` | Aprovado |
| `--text-muted` / `--surface-page` | `7.81:1` | Aprovado |
| `--text-subtle` / `--surface-page` | `4.74:1` | Aprovado no limite |
| `--card-service-title-hover` / `--card-service-bg-hover` | `9.40:1` | Aprovado |
| `--warning-500` / branco | `3.79:1` | Reprovado para texto comum |

Uma cor primitiva aprovada em um par não está aprovada em todos os fundos.
Estados de erro, sucesso, alerta e gravação DEVEM combinar cor com texto, ícone
ou outra pista perceptível.

## 7. Integração esperada

### 7.1 CSS global

- tokens globais DEVEM existir uma única vez em `:root`;
- aliases semânticos DEVEM preferir `var(...)` quando o valor corresponde
  exatamente a um primitivo;
- valores sem correspondência exata na paleta PODEM permanecer literais no
  alias semântico nesta versão; não se deve aproximar a cor e alterar a marca;
- receitas e seletores DEVEM ficar fora do bloco de declaração de tokens;
- uma futura separação física de arquivos só é justificada quando reduzir a
  manutenção; ela não deve criar uma nova camada por formalidade.

### 7.2 Tailwind v4

O contrato canônico é CSS custom properties. O bloco `@theme inline` DEVE expor
somente os aliases necessários às utilities do Tailwind, referenciando os tokens
canônicos. Não se deve manter uma segunda paleta com valores duplicados.

Tokens com nomes reconhecidos pelo Tailwind, como `--font-sans` e
`--breakpoint-*`, precisam de revisão de colisão durante a implementação. A
existência em `:root` não significa, por si só, registro no tema do Tailwind.

### 7.3 Fonte

A implementação deve substituir Geist Sans por Inter somente na tarefa de
retrabalho visual. Ela deve usar a API `next/font/google` da versão instalada e
expor a fonte por variável CSS. Geist Mono não precisa ser removida se continuar
existindo um uso real; caso contrário, sua limpeza pertence ao mesmo retrabalho.

## 8. Adoção no retrabalho do frontend

1. Aprovar esta especificação e resolver as questões abertas.
2. Registrar a decisão no `DECISIONS.md` central do workspace.
3. Introduzir os tokens como fundação do novo frontend em
   `src/app/globals.css` ou em um arquivo global importado por ele.
4. Trocar a fonte em `src/app/layout.tsx` por Inter via `next/font/google`.
5. Retrabalhar as telas por jornadas coerentes, verificando cada estado e
   viewport; a interface atual serve como inventário funcional, não como alvo
   visual.
6. Preservar aliases atuais (`--background`, `--foreground`, `--muted`,
   `--primary`, `--highlight`, `--line`, `--surface`, `--danger`) somente se a
   adoção for incremental e ainda houver consumidores. Em uma substituição
   integral, eles PODEM ser removidos na mesma alteração.
7. Executar `bun run lint`, `bun run build` e verificação manual proporcional.

O retrabalho visual é esperado, mas sua implementação precisa de escopo próprio.
A especificação dos tokens não autoriza, sozinha, mudanças de conteúdo, contrato
ou jornada funcional.

## 9. Critérios de aceite

- todos os tokens aprovados estão declarados sem duplicidade e sem ciclos;
- não há `@import` remoto do Google Fonts;
- Inter é servida pelo mecanismo de fontes do Next.js;
- componentes usam tokens semânticos para cor e tokens primitivos/receitas para
  as demais propriedades;
- `--legacy-*` não possui consumidor novo;
- nenhuma dupla de texto introduzida reprova os limites definidos;
- foco visível, estados desabilitados e feedback não dependem apenas de cor;
- movimento não essencial respeita `prefers-reduced-motion`;
- a página não cria rolagem horizontal a 390 px;
- alvos principais preservam no mínimo 48 px e secundários 44 px conforme o
  contrato atual do MVP;
- `bun run lint` e `bun run build` passam;
- a revisão manual registra mobile, desktop, teclado, hover, foco e os estados
  funcionais afetados.

## 10. Escolhas da implementação

1. As receitas usam os tamanhos explícitos observados, expressos em `rem`.
   Não há mapeamento automático para a escala mobile; o retrabalho de cada tela
   definirá seu comportamento responsivo. O título atual conserva seu `clamp()`.
2. `.text-tag` usa 12 px, mantendo os demais atributos da receita observada.
3. Notícias e tarifas permanecem catalogadas e disponíveis sem consumidores.
4. O CSS é mantido manualmente; não foi criado gerador ou `tokens.json`.
5. Todos os consumidores atuais foram atualizados na mesma entrega, permitindo
   remover os oito aliases antigos. O futuro retrabalho visual continua próprio.

Complementos necessários ao consumo atual:

| Token | Valor | Papel |
| --- | --- | --- |
| `--text-error` | `var(--error-500)` | Mensagem de erro |
| `--text-recording` | `var(--error-500)` | Estado de gravação |
| `--text-link` | `var(--primary-500)` | Link de retorno |
| `--focus-ring` | `var(--header-bg)` | Foco sobre superfícies claras |
| `--focus-ring-on-brand` | `var(--highlight-500)` | Foco sobre cabeçalho |
| `--transcript-bg` | `var(--primary-50)` | Superfície de transcrição |
| `--font-weight-regular` | `400` | Peso regular |
| `--font-weight-medium` | `500` | Peso médio |
| `--font-weight-semibold` | `600` | Peso semibold |
| `--font-weight-bold` | `700` | Peso bold |
| `--font-weight-black` | `900` | Peso black |
| `--font-size-hero` | `3.9rem` | 62,4 px na base de 16 px |
| `--line-height-section-tight` | `1.1` | Receita section-title-md |
| `--letter-spacing-tag` | `0.2px` | Receita tag |

As dimensões locais da composição transitória (largura de 648 px, títulos,
alinhamentos e animação do indicador) permanecem exceções locais, sem criar um
token global para cada detalhe da tela. Botões desabilitados usam superfície
neutra e texto secundário sem redução de opacidade, preservando contraste.

Os breakpoints ficam disponíveis em `:root` como referência. Não foram criadas
utilities responsivas com valores diferentes nem media queries com `var()`.
O tema Tailwind só expõe `background` e `foreground`; `font-sans` resolve o token
canônico declarado em `:root`, depois do import do Tailwind.

O registro no `DECISIONS.md` central está pendente: `../docs` não está disponível
neste workspace. Não foi criado arquivo de decisões paralelo.

## 11. Proveniência e limitações

Os valores desta proposta foram fornecidos como extração de
`https://ma.equatorialenergia.com.br/` realizada em 2026-10-15, a partir das
variáveis de `:root` e de estilos computados da home. Esta especificação não
revalida a página externa, não declara licença sobre os elementos visuais e não
prova que todos os valores pertencem a um design system oficial. A adoção no
Digitaliza Aí depende da aprovação do projeto e das verificações descritas aqui.
