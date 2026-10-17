<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Ferramentas do projeto

- Usar Bun e manter `bun.lock` atualizado ao alterar dependências.
- Biome substitui o ESLint: `bun run lint` verifica lint, formatação e imports; `bun run lint:fix` aplica correções seguras; `bun run format` formata os arquivos.
- Neste MVP, não criar ou manter pasta `tests`, suítes automatizadas, script de teste ou dependências destinadas a testes sem nova solicitação explícita do usuário. Validar código com `bun run lint`, `bun run build` e verificação manual proporcional ao fluxo alterado; registrar o que foi efetivamente conferido.

## Escopo atual

- Este repositório `mvp` é a aplicação do Digitaliza Aí, com frontend e API em Next.js, conforme [DEC-EQT-012](../docs/DECISIONS.md#dec-eqt-012). STT é a primeira capacidade implementada, não o limite permanente do projeto. Novas jornadas devem seguir o pedido e as regras vigentes; não presumir funcionalidades entregues.
- Registrar decisões relevantes no [DECISIONS central](../docs/DECISIONS.md), com novos IDs `DEC-EQT-*`. O histórico `DEC-STT-*` foi incorporado sem renumeração. Não recriar arquivo de decisões em `mvp/docs`.
- Documentação específica de STT em [docs/stt](../docs/stt/README.md). Manter chave Groq no servidor. Interpretação por LLM, navegação e TTS ainda não estão implementados; exigir recorte próprio antes de acrescentá-los.
- Contrato implementado em [STT-API](../docs/stt/STT-API.md). Ambiente validado com Zod sob demanda em `src/server/env.ts`; usar `.env.example` sem expor chaves. Segunda via possui uma jornada demonstrativa; os outros três serviços são placeholders. Não há operação oficial integrada.
- Distinguir proposta, implementação, verificação manual e evidência histórica. O MVP não presume produção autorizada ou avaliação de autonomia realizada.

## Estrutura e fronteiras

- `mvp/docs/structure` é a referência vigente de manutenção (tokens, componentes, Header e shadcn). [Specs](docs/specs/README.md) mantêm escopo, aceite e evidência de entregas. Consolidar regras técnicas em structure e referenciá-las nas specs; não manter duas versões do mesmo contrato. Não duplicar docs do frontend no repositório geral.

- Ler [docs/structure/overview.md](docs/structure/overview.md) e o guia pertinente antes de alterar camadas. As referências foram adaptadas ao Digitaliza Aí; não importar stack, domínio ou convenções de rotas do Zappoint.
- Código em `src/`; `@/*` aponta para `src/*`. Seguir a colocação do App Router: UI/hooks/auxiliares da tela em `app/_components`, `_hooks` e `_lib`; apresentação dos serviços em `app/servicos/_components`; auxiliares do endpoint em `app/api/transcribe/_lib`. Contratos públicos em `lib/stt`; ambiente e Groq em `server` com `server-only`. Não recriar camadas por funcionalidade sem necessidade concreta. Pastas com underscore não são uma proteção de importação client/servidor.
- Primitivas compartilhadas em `src/components/ui`, usando shadcn com Base UI; `components.json` está configurado para essa base. Usar `cn` de `@/lib/utils`, variantes CVA e tokens existentes. Preservar `primary`/`secondary`, tamanhos e loading; navegação usa ActionLink/Next, não Base UI Button renderizado como link. Composições específicas ficam junto às rotas. Consultar o [guia](docs/structure/shadcn-ui.md) antes de adicionar componentes e não sobrescrever primitivas personalizadas com defaults do CLI.
- Manter módulos privados com `server-only`; o client chama apenas `/api/transcribe`, com o header do contrato. Não misturar exports de servidor/client em barrels. Tipos externos devem vir de schemas Zod.
- Mudanças no contrato precisam atualizar client, handler e `../docs/stt/STT-API.md`. Preservar os cenários de permissão tardia, cancelamento e liberação de tracks. Testes simulados não comprovam captura em aparelho físico.
- Não adicionar biblioteca de estado, autenticação, cache de transcrição ou nova camada sem necessidade concreta do escopo. Limites de segurança da demonstração estão em [docs/structure/auth-and-api.md](docs/structure/auth-and-api.md).

## Instruções de execução

- Seguir [instructions.md](instructions.md) e [agent-workflow.md](agent-workflow.md), adaptados ao MVP Digitaliza Aí. A validação manual não exige nova infraestrutura de testes. Registros históricos de suítes removidas não definem requisitos atuais.

## Git

- Não executar commit, push, stash, staging ou sincronização por rotina. Resolver ou editar arquivos não autoriza essas operações; cada uma depende de pedido explícito. A skill de conflitos de `docs` pertence àquele repositório, não altera automaticamente este Git.
