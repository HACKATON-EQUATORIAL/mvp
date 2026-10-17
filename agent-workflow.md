# Workflow do MVP Digitaliza Aí

## Executar uma alteração

1. Ler o pedido, [AGENTS](AGENTS.md) e os pontos pertinentes de [instructions](instructions.md). Conferir o estado Git e preservar alterações existentes.
2. Identificar o resultado esperado e ler os arquivos diretamente envolvidos. Para APIs ou convenções Next, consultar a documentação da versão instalada.
3. Implementar a menor solução que atende ao pedido, mantendo o recorte solicitado do MVP e as fronteiras de client/servidor.
4. Revisar as mudanças e validar conforme a tabela abaixo. Não criar infraestrutura adicional para validar o MVP.
5. Manter specs de interface e funcionalidades em [docs/specs](../docs/specs/README.md), sem duplicação no app. Atualizar os documentos afetados e registrar decisões importantes em [DECISIONS](../docs/DECISIONS.md). Relatar resultado, verificações executadas e limitações.

Não exigir cartões, quadros, checkpoints ou escolha de modelo para uma alteração direta. Se o usuário indicar uma tarefa documentada, atualizar somente os registros relacionados. Não executar commit, push, stash, staging ou sincronização sem pedido explícito para a operação, nem criar memória paralela. Resolução de conflito e implementação deixam mudanças para revisão.

## Validação proporcional

| Alteração | Verificação |
| --- | --- |
| Documentação | Conferir links, caminhos, comandos e coerência com o código |
| Código, tipos, schemas, hooks ou rotas | `bun run lint` e `bun run build` |
| UI ou captura | Verificar manualmente o comportamento alterado, estados relevantes, responsividade e liberação do microfone |
| Contrato/API | Conferir client, entrada, resposta e falhas pertinentes, sem suíte automatizada |
| Ambiente ou dependências | Conferir exemplo de ambiente, lockfile e build, sem expor segredos |

**Não criar pasta `tests`, suítes automatizadas, script de teste, dependências ou ferramentas de teste para este MVP sem nova solicitação explícita do usuário.** Não substituir a pasta removida por suítes em outro local ou scripts de teste temporários.

Os cenários manuais dependem da mudança: permissão pendente/negada, gravar/parar, transcrição, cancelamento, erro/retry e links de serviços. Não exigir verificar todos em uma alteração que não os afeta. Não automatizar chamadas à Groq; uma chamada manual real consome a cota e só faz sentido quando necessária ao fluxo em validação.

Não repetir checks aprovados sem nova mudança relevante ou falha. Se uma verificação depender de dispositivo ou ambiente indisponível, registrar a limitação sem declarar sucesso. Build não equivale a teste em celular físico nem comprova integração real.

## Entrega e retomada

Informar o que mudou, por quê e como foi validado. Quando houver trabalho pendente, registrar o ponto concreto para retomada, sem ampliar o pedido. Conservar evidências históricas com data e contexto; a existência passada de testes não exige recriá-los.
