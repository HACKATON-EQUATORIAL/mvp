# Documentação técnica · MVP Digitaliza Aí

O projeto `mvp` reúne frontend e API do Digitaliza Aí em Next.js. A capacidade
funcional atual é transcrever áudio com Groq; as quatro páginas de serviços são
placeholders. A finalidade do repositório abrange o MVP, com próximas jornadas
sujeitas a definição de escopo, sem presumir que já estejam implementadas.

| Necessidade | Documento |
| --- | --- |
| Executar o aplicativo | [README](../README.md) |
| Consultar estrutura, UI, API e configuração | [Guias técnicos](structure/overview.md) |
| Consultar o contrato de tokens CSS | [SPECS de tokens](../specs/css-design-tokens.md) |
| Planejar componentes de UI mobile first | [SPEC de componentes](../specs/ui-components.md) |
| Planejar o header e sua relação com a Eyebrow | [SPEC do Header](../specs/header.md) |
| Entender produto e regras | [Documentação do produto](../../docs/README.md) |
| Consultar ou registrar decisões | [DECISIONS central](../../docs/DECISIONS.md) |
| Planejamento, provedores e contrato de transcrição | [STT](../../docs/stt/README.md) |
| Instruções de execução para agentes | [instructions](../instructions.md) e [workflow](../agent-workflow.md) |

Não manter um segundo arquivo de decisões neste projeto. Os links entre `mvp` e
`docs` dependem de ambos os repositórios estarem lado a lado no workspace.
