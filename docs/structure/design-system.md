# Design system do Digitaliza Aí

A implementação preserva a composição registrada em [design](../../../docs/stt/design/README.md). Tokens reais estão em `src/app/globals.css`.

| Token | Valor | Uso |
| --- | --- | --- |
| `--background` | `#fff` | Fundo |
| `--foreground` | `#10152d` | Texto |
| `--muted` | `#59657b` | Texto secundário |
| `--primary` | `#0414a1` | Cabeçalho e foco |
| `--highlight` | `#ffd700` | Ação de gravação |
| `--line` | `#dce1e8` | Bordas |
| `--surface` | `#edf3fa` | Transcrição |
| `--danger` | `#a32020` | Falhas e gravação ativa |

Fontes Geist Sans e Geist Mono por `next/font`. Conteúdo limitado a 648px com padding lateral de 24px; botões principais de pelo menos 48px e secundários de 44px. Raios de 8px em controles e transcrição.

Não há tema escuro ou biblioteca de componentes instalada. Não importar tokens, tabelas ou componentes do Zappoint por analogia. Reutilizar tokens e manter a hierarquia visual existente ao extrair componentes.
