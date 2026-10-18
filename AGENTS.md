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

- Este repositório `mvp` é a aplicação do Digitaliza Aí, com frontend em Next.js e backend de domínio em Python/FastAPI. Route Handlers Next ficam restritos ao serviço Groq; a separação atual está na DEC-EQT-022, atualizando o escopo de [DEC-EQT-012](../docs/DECISIONS.md#dec-eqt-012). STT é a primeira capacidade implementada, não o limite permanente do projeto. Novas jornadas devem seguir o pedido e as regras vigentes; não presumir funcionalidades entregues.
- Registrar decisões relevantes no [DECISIONS central](../docs/DECISIONS.md), com novos IDs `DEC-EQT-*`. O histórico `DEC-STT-*` foi incorporado sem renumeração. Não recriar arquivo de decisões em `mvp/docs`.
- Documentação específica de STT em [docs/stt](../docs/stt/README.md). Manter chave Groq no servidor. Assistente Groq autorizado, ligado só com `NEXT_PUBLIC_ASSISTANT_AI=on` (desligado por padrão; sem IA o assistente usa chips e ajuda local, DEC-EQT-039), com catálogo Python filtrado para trilhas disponíveis e implementadas (somente segunda via, sem anunciar recursos futuros), mapa completo da jornada de segunda via e até seis turnos em memória somente na página atual; fechar/reabrir preserva a conversa e opções, navegar limpa a sessão e inicia a ajuda da nova tela, sem botão Nova conversa. Orientar navegação e explicar a tela ou a lição atual (tipo `help`, DEC-EQT-038), dando dica sem nunca revelar a resposta da prática; STT inicia interpretação automaticamente, com transcrição discreta. Botões e pedidos claros por voz navegam direto de qualquer tela; só esclarecer ambiguidade, perguntar “Você quis dizer…?” em fala confusa, explicar fora de escopo e confirmar saídas que interrompam uma prática em andamento (DEC-EQT-033). Não executar operações Python, dar a resposta de exercícios ou atribuir progresso ao abrir conclusão. Respostas em voz usam `speechSynthesis` nativo (DEC-EQT-030); TTS por API externa fica fora. Ver [interpretação](docs/structure/voice-interpretation.md).
- Contrato implementado em [STT-API](../docs/stt/STT-API.md). Ambiente validado com Zod sob demanda em `src/server/env.ts`; usar `.env.example` sem expor chaves. Segunda via possui uma jornada demonstrativa; os outros três serviços são placeholders. Não há operação oficial integrada.
- Distinguir proposta, implementação, verificação manual e evidência histórica. O MVP não presume produção autorizada ou avaliação de autonomia realizada.

## Estrutura e fronteiras

- `mvp/docs/structure` é a referência vigente de manutenção (tokens, componentes, Header e shadcn). [Specs](docs/specs/README.md) mantêm escopo, aceite e evidência de entregas. Consolidar regras técnicas em structure e referenciá-las nas specs; não manter duas versões do mesmo contrato. Não duplicar docs do frontend no repositório geral.

- Ler [docs/structure/overview.md](docs/structure/overview.md) e o guia pertinente antes de alterar camadas. As referências foram adaptadas ao Digitaliza Aí; não importar stack, domínio ou convenções de rotas do Zappoint.
- Código em `src/`; `@/*` aponta para `src/*`. Reservar `app` para rotas, layout e implementação exclusiva de um segmento: `app/servicos/_components` atende só à seção de serviços e `app/api/transcribe/_lib` só ao endpoint. Composições compartilhadas ficam em `components/layout`, voz em `components/voice`, captura no `hooks/use-speech-to-text.ts` e auxiliares de captura/transporte em `lib/stt`. Contratos públicos também ficam em `lib/stt`; ambiente e Groq em `server` com `server-only`. Pastas com underscore não protegem imports client/servidor.
- Primitivas compartilhadas em `src/components/ui`, usando shadcn com Base UI; `components.json` está configurado para essa base. Usar `cn` de `@/lib/utils`, variantes CVA e tokens existentes. Preservar `primary`/`secondary`, tamanhos e loading; navegação usa ActionLink/Next, não Base UI Button renderizado como link. Composições compartilhadas ficam em `components/layout` ou `components/voice`; as exclusivas permanecem junto às rotas. Consultar o [guia](docs/structure/shadcn-ui.md) antes de adicionar componentes e não sobrescrever primitivas personalizadas com defaults do CLI.
- Manter módulos privados com `server-only`; o client chama `/api/transcribe` para STT e `/api/interpret` para LLM e o backend Python diretamente para GETs via React Query. Usar `http/api.ts` para transporte, `http/<recurso>/get-*.ts` para request privado/fábrica de opções/hook, `queries/keys` para keys e `schemas/http` para contratos Zod. Seguir [HTTP e queries](docs/structure/http-and-queries.md), adaptado do Zappoint sem importar domínio ou autenticação. Configuração pública em `NEXT_PUBLIC_API_URL`; CORS no backend Python. Não misturar exports de servidor/client em barrels. Tipos externos devem vir de schemas Zod.
- Mudanças no contrato precisam atualizar client, handler e `../docs/stt/STT-API.md`. Preservar os cenários de permissão tardia, cancelamento e liberação de tracks. Testes simulados não comprovam captura em aparelho físico.
- Não adicionar biblioteca de estado, autenticação, cache de transcrição ou nova camada sem necessidade concreta do escopo. Limites de segurança da demonstração estão em [docs/structure/auth-and-api.md](docs/structure/auth-and-api.md).

## Instruções de execução

- Integração da jornada com o backend feita nesta frente em 17/10/2026 (ver [mega revisão](docs/specs/mega-revisao.md) e [handoff](docs/specs/backend-journey-handoff.md)); outra pessoa pode revisar e evoluir. Desde a DEC-EQT-037 a jornada é Serviços → canal → 3 etapas no WhatsApp: o conteúdo vem num pacote único (`/tracks/{id}/bundle`), o front corrige a prática na hora (o pacote traz a opção esperada) e envia tudo uma vez em `/practice/attempts/submit`, onde o backend refaz a correção (`X-Session-Id` anônimo).

- Validar o assistente de voz incrementalmente pelo fluxo real. A prévia `/dev/assistente-voz` foi removida a pedido do usuário; não recriar rotas de demonstração, cenários sintéticos ou componentes exclusivos de prévia sem novo pedido explícito.

- Seguir [instructions.md](instructions.md) e [agent-workflow.md](agent-workflow.md), adaptados ao MVP Digitaliza Aí. A validação manual não exige nova infraestrutura de testes. Registros históricos de suítes removidas não definem requisitos atuais.

## Git

- Não executar commit, push, stash, staging ou sincronização por rotina. Resolver ou editar arquivos não autoriza essas operações; cada uma depende de pedido explícito. A skill de conflitos de `docs` pertence àquele repositório, não altera automaticamente este Git.

Pedidos sobre “commitar” devem receber sugestão de mensagem, a menos que o usuário peça inequivocamente para executar o commit. Não fazer staging, commit ou push por inferência.
