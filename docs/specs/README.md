# Specs e registros de entregas

Esta pasta mantém planejamento de entregas e suas evidências datadas. Para
manutenção cotidiana, começar pelos [guias de structure](../structure/overview.md).
Contratos atuais de tokens, componentes e configuração não são duplicados aqui.

## Entrega com escopo e aceite

| Spec | Conteúdo |
| --- | --- |
| [Sessão Claude (out/2026)](sessao-claude-2026-10.md) | Tudo o que foi feito na sessão longa: integração com o backend, assistente, design, gamificação e canal oficial |
| [Mega revisão](mega-revisao.md) | Diagnóstico, status por item, verificação e estudo Duolingo |
| [Canais oficiais](canais-oficiais.md) | Mapeamento da Agência Virtual e da Clara, simulador e saída real |
| [Checklist manual do assistente](voice-assistant-manual-checklist.md) | Perguntas, casos positivos/negativos e espaço para registrar resultados |
| [Interpretação inicial LLM](voice-interpretation.md) | Groq, confirmação e fallbacks reais |
| [Handoff da jornada](backend-journey-handoff.md) | Tarefas de integração Python atribuídas à outra pessoa/IA |
| [Consultas GET do backend](backend-queries.md) | React Query, contratos Python e seleção inicial de trilhas |
| [Reconstrução do frontend](frontend-reconstruction.md) | Percursos, rotas propostas, limites, aceite e registros de execução |
| [Drawer de ajuda por voz](voice-assistant-drawer.md) | Contexto por página, fluxo STT e ciclo de vida do assistente |

## Registros históricos

| Registro | Evidência preservada | Guia vigente |
| --- | --- | --- |
| [Tokens iniciais](css-design-tokens.md) | Origem da extração, adaptações e contraste registrado | [Design system](../structure/design-system.md) |
| [Componentes iniciais](ui-components.md) | Fontes, recorte inicial e limitações da execução | [UI](../structure/styling-and-ui.md) |
| [Header inicial](header.md) | Nós Figma, evidência e verificação daquela etapa | [Header e composição](../structure/styling-and-ui.md#header-e-composicao-da-pagina) |

A migração shadcn tem sua evidência em [DEC-EQT-016](../../../docs/DECISIONS.md#dec-eqt-016)
e sua manutenção em [structure/shadcn-ui](../structure/shadcn-ui.md).
Não há spec duplicada dessa configuração.

Novas specs devem explicar resultado esperado, escopo, critérios de aceite e
pendências; vincular padrões existentes em vez de copiá-los. Ao implementar,
registrar verificações com ambiente/data e consolidar orientações duráveis em
`structure`. Preservar evidência sem tratá-la como garantia de comportamento atual.

[Índice técnico](../README.md) · [Decisões gerais](../../../docs/DECISIONS.md)
