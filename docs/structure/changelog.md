# Histórico da estrutura do Digitaliza Aí

## 16/10/2026

Os arquivos de estrutura importados do Zappoint foram reescritos para o recorte real do Digitaliza Aí. A origem é referência de convenções, não evidência de que tecnologias ou módulos daquele produto existam aqui.

Aplicados `src/`, organização por funcionalidade, composição de rotas, separação de UI/hook/HTTP, contrato Zod compartilhado e módulos privados de servidor. Preservadas URLs, identidade visual e escopo STT. Acrescentadas proteção contra acionamento da API por outros sites, recusa de redirects do provedor e políticas HTTP básicas.

Detalhes, evidências e limites: [DEC-STT-011](../../../docs/DECISIONS.md#dec-stt-011), [segurança](auth-and-api.md) e [execução](build-and-run.md).

## 16/10/2026: organização junto às rotas Next.js

A camada `features` criada na primeira refatoração foi substituída por colocação no App Router. UI e hooks da tela inicial ficam em pastas privadas de `app`; auxiliares da API ficam junto ao Route Handler; integração e ambiente ficam em `server`; contratos em `lib/stt`. A decisão anterior permanece no histórico, com a organização atual definida por [DEC-STT-012](../../../docs/DECISIONS.md#dec-stt-012). URLs, comportamento e proteções foram preservados.

## 16/10/2026: validação enxuta do MVP

Removidos `tests`, script de teste e dependência exclusiva da suíte por solicitação do usuário. Instruções e workflow agora usam lint, build e verificação manual proporcional, sem criar infraestrutura de testes. Evidências anteriores permanecem históricas. Ver [DEC-STT-013](../../../docs/DECISIONS.md#dec-stt-013).

## 16/10/2026: repositório do MVP

A aplicação agora vive em `mvp` e abrange frontend e API do Digitaliza Aí. Decisões centralizadas em [docs/DECISIONS](../../../docs/DECISIONS.md); documentação e imagens de STT movidas para [docs/stt](../../../docs/stt/README.md). Guias técnicos permanecem neste projeto. Ver [DEC-EQT-012](../../../docs/DECISIONS.md#dec-eqt-012).
