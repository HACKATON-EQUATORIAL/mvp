# Design system e tokens

Guia vigente de manutenção, revisto por leitura do código em **17/10/2026**.
Valores executáveis em `src/app/globals.css`; fonte em `src/app/layout.tsx`.
Os caminhos deste guia partem da raiz de `mvp`. Atualizar código e guia juntos
quando um token mudar. O [registro da entrega original](../specs/css-design-tokens.md)
preserva origem e limites da extração, sem manter um segundo catálogo.

## Autoridade e integração

O CSS mantém tokens manualmente; não há `tokens.json` nem gerador. A fonte atual
é Inter por `next/font/google`, exposta em `--font-inter` e consumida por
`--font-sans`. Não trocar a fonte ao aplicar presets de UI.

Componentes consomem os tokens por receitas CSS e aliases Tailwind. Não duplicar
paleta, criar aliases genéricos como `--sm` ou usar `--legacy-*` em código novo.
Tokens catalogados de notícias, tarifa e layouts maiores não comprovam que esses
módulos estejam implementados. Não há tema escuro.

## Arquitetura e nomes

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

## Catálogo normativo

### Cores semânticas e de componente

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

### Paletas primitivas

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

### Tipografia primitiva

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

### Receitas tipográficas observadas

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
| `.text-tag` | `12px` | `1.5` | `600` | `0.2px` |

As receitas foram observadas na home de referência e não fornecem mapeamento
mobile completo. Até uma revisão visual definir esse mapeamento, a implementação
NÃO DEVE inferir que receitas em mobile usam automaticamente a escala
`--font-size-mobile-*`. Texto informativo ou acionável DEVE ter ao menos 12 px;
a receita `.text-tag` do Digitaliza Aí já usa 12 px, ajustando o valor observado de 9 px.

### Espaçamento e raios

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

### Sombras

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

### Layout e camadas

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

### Movimento

| Token | Valor |
| --- | --- |
| `--transition-fast` | `0.15s ease-in-out` |
| `--transition-base` | `0.3s ease-in-out` |
| `--transition-slow` | `0.5s ease-in-out` |

Componentes DEVEM desativar movimento não essencial em
`prefers-reduced-motion: reduce`. Transições não podem atrasar confirmação de
uma ação nem esconder mudança de estado de tecnologia assistiva.


## Complementos usados no produto

| Token | Valor | Uso |
| --- | --- | --- |
| `--text-error` / `--text-recording` | `var(--error-500)` | Falha e gravação |
| `--text-link` | `var(--primary-500)` | Links |
| `--focus-ring` | `var(--header-bg)` | Foco em fundo claro |
| `--focus-ring-on-brand` | `var(--highlight-500)` | Foco sobre marca |
| `--transcript-bg` | `var(--primary-50)` | Transcrição |
| `--font-weight-regular/medium/semibold/bold/black` | `400/500/600/700/900` | Pesos |
| `--button-bg` / `--button-text` | `var(--surface-page)` / `var(--primary-500)` | Botões normais |
| `--button-bg-hover` / `--button-text-hover` | `var(--primary-500)` / `var(--text-on-brand)` | Hover |

A receita do botão de voz redefine os tokens locais de botão para amarelo e
texto preto. Estados desabilitados usam superfície neutra e texto secundário,
sem reduzir a opacidade global do componente. Contratos de tamanho e comportamento
ficam em [UI](styling-and-ui.md), sem duplicá-los neste catálogo.

## Aliases shadcn e Tailwind

O bloco semântico em `globals.css` mapeia `--background`, `--foreground`,
`--primary`, `--card`, `--popover`, `--secondary`, `--muted`, `--accent`,
`--destructive`, `--border`, `--input` e `--ring` aos tokens canônicos. Os aliases
`sidebar` e `chart` também estão disponíveis, sem significar telas implementadas.
`@theme inline` expõe `--color-*` correspondentes. `--radius` referencia
`--radius-md`; os raios anteriores continuam preservados.

Não criar autorreferência como `--font-sans: var(--font-sans)` nem redefinir a
paleta com valores do preset. [Adicionar componentes shadcn](shadcn-ui.md).

## Legibilidade, contraste e movimento

A presença de uma cor na paleta não garante contraste em qualquer combinação.
Conferir texto, bordas e indicadores necessários à compreensão em normal, hover,
foco, ativo e desabilitado. Referência de aceite: 4,5:1 para texto comum e 3:1
para texto grande e indicadores gráficos pertinentes. Os cálculos datados da
extração estão no registro original; não constituem auditoria completa da UI.

Cor deve vir acompanhada de texto ou outra indicação de estado. `--font-size-mobile-xs`
de 8px permanece como dado da extração, sem uso em conteúdo informativo ou
acionável. Receitas mobile não são inferidas automaticamente da escala primitiva.
Movimento não essencial respeita `prefers-reduced-motion`.

## Fontes e mudanças

- [Registro de origem dos tokens](../specs/css-design-tokens.md).
- [UI e acessibilidade atuais](styling-and-ui.md).
- [Configuração do shadcn](shadcn-ui.md).
- [Decisões do produto](../../../docs/DECISIONS.md).
