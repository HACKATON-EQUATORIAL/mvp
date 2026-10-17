# Design system do Digitaliza Aí

A interface atual parte da composição registrada em [design](../../../docs/stt/design/README.md). Seus tokens reais estão em `src/app/globals.css`.

O contrato implementado está descrito na
[SPECS de tokens CSS](../../../docs/specs/css-design-tokens.md). Os tokens e as 15 receitas
tipográficas estão em `src/app/globals.css`, disponíveis para o retrabalho do
frontend. Os consumidores atuais já usam os novos aliases semânticos.

| Token | Valor | Uso |
| --- | --- | --- |
| `--surface-page` | `var(--neutral-0)` | Fundo |
| `--text-body` | `#3b3b3b` | Texto |
| `--text-heading` | `var(--neutral-900)` | Títulos |
| `--text-muted` | `var(--neutral-600)` | Texto secundário |
| `--header-bg` | `#0414a1` | Cabeçalho |
| `--focus-ring` | `var(--header-bg)` | Foco em superfícies claras |
| `--cta-bg` | `var(--highlight-500)` | Ação de gravação |
| `--cta-text` | `var(--neutral-950)` | Texto da ação principal |
| `--border-default` | `#e0e0e0` | Bordas |
| `--transcript-bg` | `var(--primary-50)` | Transcrição |
| `--text-error` / `--text-recording` | `var(--error-500)` | Falhas e gravação ativa |

Inter variável por `next/font/google`, exposta por `--font-inter` e consumida por
`--font-sans`. Conteúdo transitório limitado a 648px com padding lateral de 24px;
botões principais de pelo menos 48px e secundários de 44px. Controles e
transcrição usam `--radius-md`. `.text-tag` usa 12px para legibilidade.

Os oito aliases antigos foram removidos após atualizar todos os consumidores.
Tokens `--legacy-*` ficam catalogados, sem consumidores. Não há gerador JSON.
Breakpoints em `:root` são referências; media queries precisam de literais
equivalentes. O Tailwind expõe apenas os aliases de utilities necessários, sem
duplicar a paleta ou criar referências circulares para `--font-sans`.

Não há tema escuro ou biblioteca de componentes instalada. Não importar tokens, tabelas ou componentes do Zappoint por analogia. Reutilizar tokens e manter a hierarquia visual existente ao extrair componentes.
