# Handoff: integração da jornada com o backend

**Responsável:** outra pessoa e sua IA, conforme divisão do usuário em 17/10/2026.
**Estado:** pendente. Esta frente não bloqueia a entrega inicial da LLM.

## O que já existe

- Backend Python/FastAPI em `../back`, banco Postgres e migrations disponíveis.
- Home usa `useGetTracks` e catálogo real: uma trilha disponível, três em breve.
- Clientes GET e schemas prontos em `src/http/track`, `src/http/channel` e
  `src/schemas/http`; keys em `src/queries/keys`; QueryClient em `src/lib/query-client.ts`.
- Provider React Query, Skeleton, falha/retry e URLs local/túnel já configurados.
- Páginas internas de segunda via ainda usam conteúdo e prática locais. Clientes
  HTTP prontos NÃO significam que essas páginas estejam integradas.
- Assistente grava, transcreve e interpreta por Groq; conhece o mapa de segunda via e mantém conversa na mesma página; interpreta após STT e navega com escolhas claras, sem revisão ou confirmação extra. Não responde nem conclui exercícios.

## Ordem sugerida para a outra frente

### 1. Apresentação da trilha

- [ ] Migrar `src/app/servicos/segunda-via/page.tsx` para o detalhe real da trilha
  via `useGetTrack`/`getTrack` em `src/http/track/get-track.ts`.
- [ ] Exibir título, objetivo, aviso demonstrativo e etapas do contrato; respeitar
  `status` e `content_version`, com loading, indisponível, erro/retry e vazio.
- [ ] Preservar a home como escolha de trilhas e permitir voltar a ela.

### 2. Explicações, etapas, dificuldades e canal

- [ ] Integrar `explicacao/page.tsx`, `etapas/page.tsx`, `etapas/[etapa]/page.tsx`,
  `dificuldades/page.tsx` e `canal/page.tsx` usando os GETs existentes.
- [ ] Detalhe: GET /api/v1/tracks/{track_id}.
- [ ] Etapa: GET /api/v1/tracks/{track_id}/steps/{step_id}.
- [ ] Dificuldades: GET /api/v1/tracks/{track_id}/difficulties.
- [ ] Canal: GET /api/v1/channel-exit?track_id=segunda-via.
- [ ] Resolver a diferença de IDs explicitamente: rotas locais usam `encontrar`
  e `conferir`; o backend usa `encontrar-servico` e `conferir-resultado`. Não enviar
  os aliases locais para a API. Se preservar URLs atuais, adaptar na camada local
  da jornada; não traduzir nomes arbitrariamente no transporte HTTP.
- [ ] Preservar `origem` e `etapa` de `_lib/navigation.ts`, Suspense para queries
  de URL e o retorno correto após consultas/interrupções.
- [ ] Não inventar URL oficial: `is_simulated: true` e `url: null` não autorizam
  redirecionar para um endereço suposto.

### 3. Prática no backend (fase posterior aos GETs)

A prática atual está em `pratica/*`, `_components/practice-choice.tsx` e
`_lib/content.ts`. A outra pessoa implementará a migração; esta entrega de LLM
não cria tentativas, não envia respostas e não altera o banco.

- [ ] Conferir `../back/openapi.json`, `../back/src/digitaliza_api/practice/router.py`
  e `schemas.py`; criar contratos Zod a partir das respostas atuais.
- [ ] POST /api/v1/practice/attempts cria tentativa com track_id/mode.
- [ ] GET /api/v1/practice/attempts/{attempt_id} retoma o estado.
- [ ] POST .../{attempt_id}/actions, /help e /abandon conforme o contrato.
- [ ] Essas operações usam UUID anônimo em X-Session-Id. Definir armazenamento e
  retomada dessa sessão com o usuário/equipe; não confundir com login ou com a
  transcrição em memória do assistente.
- [ ] Renderizar current_item, progress, last_feedback e status da resposta;
  remover correção/gabarito locais. Não inferir sucesso antes da resposta da API.
- [ ] Só então introduzir mutations e invalidação por tentativa, sem colocar
  domínio no Next nem usar a LLM como motor de prática.

### 4. Validação real progressiva

- [ ] No celular via ngrok: home → trilha → etapa → retorno → prática.
- [ ] Carregamento, offline/erro, retry, trilha indisponível e retomada permitida.
- [ ] Mudança de contexto e fechamento do Drawer cancelam captura/interpretação.
- [ ] Confirmar destino interno e parâmetros de retorno do assistente.
- [ ] Registrar o que foi efetivamente exercitado, sem confundir build com uso real.

## Limites para evitar conflito entre frentes

A IA desta frente pode trabalhar nas páginas da jornada, HTTP/queries/schemas
Python e prática. Deve preservar o contrato VoicePageContext e declarar descrição,
sugestões e href interno em cada página. IDs devem ser estáveis, únicos e ter
significado; no máximo três sugestões. Incluir só navegação permitida e disponível.

A frente atual de LLM mantém `src/app/api/interpret`, `src/server/assistant`,
`src/lib/assistant`, `src/hooks/use-voice-interpretation.ts` e o ciclo compartilhado
em `components/voice`. Coordenar mudanças de contrato antes de alterar esses módulos.
A LLM recebe o catálogo, o manifesto de segunda via, contexto e seis turnos em memória por página.
VoiceHelp agora somente registra o contexto; o provider/host no shell mantém o
Drawer único. IDs de sugestões são normalizados para os descritores
`_lib/voice-target.ts` de cada tela, compostos em `_lib/voice-journey.ts`. Ao mudar
rotas ou capacidades, atualizar esses descritores e a resolução de origem/etapa.
Páginas dependentes de parâmetros devem passar `navigation` no VoicePageContext.
O assistente consulta GET /tracks e GET /tracks/segunda-via via queries existentes;
não duplicar fetch nem criar API de catálogo Next. Não conhece gabarito nem executa
mutations da prática. Abrir conferência ou conclusão é navegação demonstrativa,
nunca prova de tentativa concluída. Ao integrar a prática real, coordenar essa
separação e não permitir que o acesso direto atribua progresso.

Backend de domínio é acessado diretamente pelo navegador. Next Route Handlers
são apenas integrações Groq (STT/LLM). Não criar proxy /backend. Manter ambiente
privado fora do Git. Não recriar prévia /dev nem infraestrutura de testes.

Guias: [HTTP e queries](../structure/http-and-queries.md),
[interpretação](../structure/voice-interpretation.md),
[pastas](../structure/src-structure-and-conventions.md),
[instructions](../../instructions.md) e [workflow](../../agent-workflow.md).

## Atualização do fluxo de voz

Não reintroduzir revisão obrigatória de transcrição ou confirmação de toda escolha.
O assistente interpreta após STT, mostra “Você disse…” discreto e navega para IDs
permitidos. Há confirmação conservadora ao sair das telas de prática guiada,
individual e conferência. Ao integrar tentativas, associar esse guard ao estado
real da atividade e às regras de interrupção, sem atribuir progresso por navegação.

## Memória contextual (DEC-EQT-029)

Fechar/reabrir na mesma página preserva a resposta e os botões. Navegar ou mudar
os parâmetros de contexto limpa histórico, transcrição e ações pendentes. O
assistente no destino abre com sugestões da tela atual, sem “Você abriu…” ou
botão “Nova conversa”. Novos assuntos são tratados normalmente por áudio.
