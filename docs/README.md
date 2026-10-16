# Documentação técnica · MVP Digitaliza Aí

O projeto `mvp` reúne frontend e API do Digitaliza Aí em Next.js. A capacidade
funcional atual é transcrever áudio com Groq; as quatro páginas de serviços são
placeholders. A finalidade do repositório abrange o MVP, com próximas jornadas
sujeitas a definição de escopo, sem presumir que já estejam implementadas.

| Necessidade | Documento |
| --- | --- |
| Executar o aplicativo | [README](../README.md) |
| Consultar estrutura, UI, API e configuração | [Guias técnicos](structure/overview.md) |
| Entender produto e regras | [Documentação do produto](../../docs/README.md) |
| Consultar ou registrar decisões | [DECISIONS central](../../docs/DECISIONS.md) |
| Planejamento, provedores e contrato de transcrição | [STT](../../docs/stt/README.md) |
| Instruções de execução para agentes | [instructions](../instructions.md) e [workflow](../agent-workflow.md) |

Não manter um segundo arquivo de decisões neste projeto. Os links entre `mvp` e
`docs` dependem de ambos os repositórios estarem lado a lado no workspace.
