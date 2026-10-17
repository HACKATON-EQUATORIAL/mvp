# Instruções do MVP Digitaliza Aí

O pedido do usuário define a fronteira do trabalho. O projeto `mvp` reúne frontend e API do Digitaliza Aí e usa Next.js App Router, React, TypeScript, Bun, Biome e Zod. A primeira capacidade implementada é gravar áudio, transcrever com Groq e exibir texto; os quatro serviços ainda são placeholders. O repositório passa a abrigar o MVP completo, com evolução conforme o pedido e as decisões centrais.

## Onde começar

| Trabalho | Pontos de entrada |
| --- | --- |
| Escopo e execução | [README](README.md), [AGENTS](AGENTS.md) e pedido atual |
| Entrega específica e evidência | [Specs e registros](docs/specs/README.md), sem duplicar padrões de manutenção |
| Estrutura Next.js | [Mapa de pastas](docs/structure/src-structure-and-conventions.md) e documentação da versão instalada em `node_modules/next/dist/docs` |
| Primitivas visuais | `src/components/ui`, `components.json` e [guia shadcn/Base UI](docs/structure/shadcn-ui.md) |
| Captura e UI | `src/app/_components`, `src/app/_hooks` e `src/app/_lib` |
| API de transcrição | [Contrato STT](../docs/stt/STT-API.md), `src/app/api/transcribe` e `src/server/stt` |
| Ambiente e segurança | `src/server/env.ts`, `.env.example` e [limites da API](docs/structure/auth-and-api.md) |
| Configuração e comandos | [Execução](docs/structure/build-and-run.md), `package.json` e arquivo afetado |
| Decisões | [DECISIONS](../docs/DECISIONS.md) |

Ler apenas os arquivos necessários e seguir imports quando houver dúvida concreta. Conferir o código atual antes de atribuir comportamento ao produto. Não importar padrões, serviços ou dependências do Zappoint por analogia.

## Implementação

- Preferir a menor mudança que entrega o pedido. Não acrescentar camadas, bibliotecas, autenticação, LLM, navegação por voz ou TTS por iniciativa própria.
- Seguir a colocação do App Router: código exclusivo junto à rota em pastas privadas; integração e ambiente em `src/server` com `server-only`; contratos públicos em `src/lib/stt`.
- Preservar identidade visual, acessibilidade, estados de carregamento/erro e liberação do microfone no cancelamento ou saída.
- Validar entradas e respostas externas com Zod. Nunca expor, imprimir ou versionar a chave Groq; não registrar áudio ou transcrição em logs.
- Alterações de contrato devem manter client, handler e documentação coerentes. Usar dados sintéticos na demonstração.

## Validação do MVP

Por decisão explícita do usuário, não manter ou criar pasta `tests`, suítes automatizadas, script `test` ou dependências destinadas a testes. Essa infraestrutura só volta mediante novo pedido explícito.

Para mudanças de código, executar `bun run lint` e `bun run build`. Complementar com verificação manual proporcional do fluxo afetado. Para mudanças apenas documentais, conferir links, caminhos e coerência, sem exigir build.

Não automatizar chamadas reais à Groq nem exigir consumo da API em mudanças que não precisem disso. Registrar o que foi conferido e as limitações: lint/build não comprovam captura física em Android/iPhone ou transcrição real. Resultados de suítes removidas são históricos, não requisitos vigentes.

Seguir o [workflow](agent-workflow.md) para execução e entrega.

Para documentação técnica: manter padrões vigentes em `docs/structure` e planejamento/evidência de entregas em `docs/specs`. Ao implementar uma spec, consolidar orientações duráveis no guia correspondente e substituir cópias do contrato por links.
