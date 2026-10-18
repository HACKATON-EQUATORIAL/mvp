# Documentação técnica · MVP Digitaliza Aí

Frontend Next.js com backend Python/FastAPI. A home carrega trilhas reais;
a jornada interna ainda usa conteúdo/prática locais. Voz grava e transcreve com
Groq e interpreta o texto automaticamente com catálogo e mapa de segunda via.
Escolhas claras navegam direto; sair da prática pode exigir confirmação. Sem TTS ou execução de serviço oficial.

- [Integração pendente para outra pessoa/IA](specs/backend-journey-handoff.md).
- [Assistente conversacional e interpretação LLM](structure/voice-interpretation.md).

## Manter o projeto

`structure` descreve a implementação vigente e orienta sua manutenção.

| Necessidade | Guia |
| --- | --- |
| Executar o aplicativo | [README do projeto](../README.md) |
| Entender arquitetura e fronteiras | [Visão geral](structure/overview.md) |
| Alterar tokens, tipografia e receitas | [Design system](structure/design-system.md) |
| Consumir componentes ou alterar Header/voz | [UI e acessibilidade](structure/styling-and-ui.md) |
| Adicionar componentes shadcn/Base UI | [Configuração e manutenção](structure/shadcn-ui.md) |
| Alterar configuração e ambiente | [Configurações](structure/configs.md) |
| Alterar código com contexto | [instructions](../instructions.md) e [workflow](../agent-workflow.md) |

## Planejar e consultar evidências

`specs` registra entregas delimitadas: objetivo, escopo, critérios de aceite e
resultados datados. Não é uma segunda documentação da API atual dos componentes.

- [Spec de reconstrução do frontend](specs/frontend-reconstruction.md): escopo,
  percursos, aceite e registros da implementação da jornada.
- [Índice de specs e registros históricos](specs/README.md): origem e verificações
  das entregas iniciais de tokens, componentes e Header.

## Documentação do produto

Decisões gerais ficam no [DECISIONS central](../../docs/DECISIONS.md), regras e
fontes em [docs](../../docs/README.md), e estudos/contrato de voz em
[STT](../../docs/stt/README.md). Não criar um segundo arquivo de decisões no app.
Os links entre repositórios pressupõem `mvp` e `docs` lado a lado no workspace.

Caminhos de código e comandos dos guias partem da raiz de `mvp`. Ao alterar uma
regra técnica, atualizar seu guia em `structure`; ao registrar uma nova entrega,
usar `specs` e vincular os guias, sem copiar contratos inteiros. Histórico não
substitui verificação atual. Ver [DEC-EQT-018](../../docs/DECISIONS.md#dec-eqt-018).
