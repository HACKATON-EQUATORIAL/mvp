# Mega revisão (17/10/2026)

Frente única assumiu a integração da jornada de segunda via com o backend Python
(`/api/v1`). Outra pessoa pode revisar depois; este arquivo registra diagnóstico,
decisões e pendências. Commits ficam a cargo do usuário, antes da etapa de design.

## 1. Diagnóstico

Severidade: **A** (quebra a proposta ou dados), **M** (confunde/engana), **B** (polimento).

### Hub (jornada de segunda via)

| # | Sev. | Problema | Onde / como reproduzir |
| --- | --- | --- | --- |
| H1 | A | Prática não usa o motor do backend: um único item local com gabarito no front (`PracticeChoice`), enquanto a API tem 3 itens, feedback por opção, dica, explicação e progresso. Nenhuma tentativa é registrada, então a métrica de autonomia nunca recebe dados. | `segunda-via/_components/practice-choice.tsx`; praticar e conferir que nada chega em `practice_attempts`. |
| H2 | A | Conteúdo divergente entre front e API (front: “Outubro de 2026 / CONTA EXEMPLO”; API: setembro 09/2026, “DEMO-001”). Textos de etapas e dificuldades fixos em `_lib/content.ts` e nas páginas. | Comparar `/etapas/conferir` com `GET /tracks/segunda-via/steps/conferir-resultado`. |
| H3 | A | “Prática concluída” abre sem tentativa: acesso direto, pelo assistente ou pela prática individual (acertar 1 item) exibe conclusão. | Abrir `/servicos/segunda-via/pratica/concluida` direto. |
| H4 | M | Prática individual: acertar leva direto à conclusão, sem feedback nem progresso; “Pedir ajuda” tira a pessoa da prática. | `/pratica/individual`. |
| H5 | M | Sem noção de progresso na trilha: não há “onde estou / o que falta”; etapas não mostram ordem nem próxima etapa (a API tem `next_actions`). | Todas as telas. |
| H6 | M | Excesso de ações concorrentes: `/etapas` tem 6 botões, com “Quero aprender desde o início” como primário numa tela de consulta. | `/etapas`. |
| H7 | M | “Sair da prática” vai para a home sem encerrar a tentativa; não há retomada. | `PracticeChoice`. |
| H8 | M | Canal oficial ignora `GET /channel-exit` (aviso de requisitos, `is_simulated`). | `/canal`. |
| H9 | M | Eventos de navegação nunca são enviados (`journey_entered`, `explanation_viewed`, `difficulty_reported`, `channel_exit_clicked`). | Nenhuma chamada a `POST /events`. |
| H10 | B | Explicação geral: botão “Ler explicação” aponta para âncora já visível. | `/explicacao`. |
| H11 | B | Página de etapa com título genérico (“Ajuda para esta etapa”) e primário “Voltar à etapa” ambíguo. | `/etapas/encontrar`. |
| H12 | B | `/pratica/conferencia` repete o conteúdo que a API já cobre nos itens de conferência. | Fluxo guiada → conferência. |

### Assistente

| # | Sev. | Problema | Onde / como reproduzir |
| --- | --- | --- | --- |
| V1 | A | Sem saída quando nenhuma opção serve: a pessoa recebe sempre o mesmo conjunto de botões. A LLM não sabe quais opções já foram recusadas. | Pedir algo fora das opções 2 vezes. |
| V2 | M | Guard de interrupção se baseia só no ID da tela, não no estado real da tentativa. | `voice-assistant-host.tsx` `leavingPracticeTo`. |
| V3 | M | Contexto pobre: a LLM não recebe dificuldades, `next_actions`, nem progresso/etapa atual da prática. | `use-voice-catalog.ts`, `buildVoiceActions`. |
| V4 | M | Proposta para a própria tela atual navega para a mesma URL e apaga a conversa. | Pedir a tela em que já está, quando a LLM responder `proposal`. |
| V5 | B | Prompt grande × limite de 8K TPM do free tier: rajadas acionam o fallback de modelos. | Uso rápido em sequência. |

## 2. Decisões desta revisão

- Prática passa a usar `POST/GET /practice/attempts` com `X-Session-Id` anônimo
  (UUID em `localStorage`, só para agrupar tentativas). IDs de tentativa ficam em
  `sessionStorage` por modo, para retomar ao recarregar.
- Guiada (`mode=guided`): feedback por opção, dica e explicação. Individual
  (`mode=independent`): feedback neutro; ajuda fica na própria tela e marca
  `assisted` conforme o backend.
- Conclusão só celebra com tentativa individual concluída na sessão; sem ela, convida a praticar.
- IDs locais `encontrar`/`conferir` continuam nas URLs; a tradução para
  `encontrar-servico`/`conferir-resultado` fica em `segunda-via/_lib/steps.ts`.
- Conteúdo didático vem da API; o front mantém só textos de interface.

## 3. Status por item

| Item | Status |
| --- | --- |
| H1 prática no backend | Corrigido: `PracticeSession` + `usePracticeSession` (tentativas, feedback, dica, “descrever as opções”, progresso, retomada). |
| H2 conteúdo divergente | Corrigido: lições, visão geral, consulta, dificuldades e canal vêm da API; `_lib/content.ts` removido. Ilustrações seguem o conteúdo (DEMO-001, 09/2026). |
| H3 conclusão sem tentativa | Corrigido: `PracticeResult` só celebra tentativa individual concluída; senão convida a praticar. |
| H4 individual sem feedback | Corrigido: feedback neutro, ajuda na própria tela, resultado com/sem apoio. |
| H5 sem progresso | Corrigido: mapa da trilha com 4 passos + meta (canal), “Etapa N de 2”, barra de progresso na prática. |
| H6 excesso de ações | Corrigido: consulta com etapas da API + “Tive outro problema” + Voltar. |
| H7 sair sem encerrar | Corrigido: “Sair da prática” abandona a tentativa; navegação pelo assistente mantém para retomar. |
| H8 canal ignora API | Corrigido: `ChannelExit` usa `requirements_notice`, `is_simulated` e `url` (sem inventar URL). |
| H9 eventos | Corrigido: `journey_entered`, `explanation_viewed`, `difficulty_reported`, `channel_exit_clicked`. |
| H10–H12 | Corrigidos (visão geral nova, lição com título real, conferência vira “Conheça a conta de exemplo”). |
| V1 sem saída | Corrigido: “Nada disso, quero outra coisa” + `rejectedOptionIds` (prompt e servidor). |
| V2 guard | Corrigido: guard pelo estado real da tentativa (`lib/practice/activity.ts`). |
| V3 contexto pobre | Corrigido: prática em andamento e dificuldades no pedido; fora de escopo oferece caminho. |
| V4 própria tela | Corrigido: responde “você já está nesta tela” sem navegar. |
| V5 limite de tokens | Apontado: prompt maior; fallback de modelos cobre rajadas. Avaliar enxugar o prompt. |

## 4. Verificação realizada (17/10/2026)

- `bun run lint` e `bun run build` aprovados.
- Navegador (375×812, backend local): mapa da trilha com dados da API; lição “encontrar”
  com ilustração e `next_actions`; prática guiada completa (erro, acerto, dica, conclusão);
  prática individual com ajuda → resultado “com apoio”; resultado sem tentativa convida a
  praticar; dificuldades com orientação e destino; canal com aviso de requisitos; guard do
  assistente na prática após resposta (“pergunta 1 de 3… pode continuar depois”); botão
  “Nada disso” visível no Drawer.
- Groq real: opções recusadas não voltam; problema de acesso → dificuldades; pedido de
  resposta de exercício → recusa com caminho alternativo.

## 5. Pendências

- Não testado no celular físico (microfone + “Nada disso” + retomada da prática).
- Trilha com `status` indisponível ou `content_version` diferente não tem tela própria
  (hoje mostra erro/carregamento genérico).
- Botões primário e secundário são visualmente iguais no design system atual (etapa de design).
- Eventos não fazem fila/offline; falhas são ignoradas (melhor-esforço).
- Métrica de autonomia exige `X-Admin-Token`; não há painel no front.

## 6. Rodada pós-revisão (antes do design)

- Navegação direta por voz; confirmação só em fala confusa, ambiguidade ou fora de
  escopo (DEC-EQT-033). “Sim/não” curtos sem LLM.
- Prompt ~57% menor, entrada compactada, descrições de alvos enriquecidas, raciocínio
  médio. Cenários reais na Groq: “identificar o mês da fatura” → lição de conferir;
  “quero praticar” (home) → prática com apoio; “o site não abre” → dificuldades;
  pagamento → fora de escopo com canal oficial; “sim” após pergunta → confirma.
- Simulador dos canais oficiais (Agência Virtual e WhatsApp da Clara) guiado por
  conteúdo do backend; ver [canais oficiais](canais-oficiais.md) e o backlog de fluxos.

## 7. Estudo Duolingo e concorrentes (18/10/2026)

Pesquisa e plano completos em `~/.claude/plans/velvety-herding-eich.md` (resumo em DEC-EQT-036).
Implementado: Eletriquinho no Drawer; feedback na barra com som/vibração; sequência e
lição perfeita; resumo de fim de lição; aviso de ofensiva e selos; revisão de erros
(backend `item_ids`, migration `0002`); desafio de toque nas lições; “comece em 2
minutos”; certificado; canal oficial com links reais e WhatsApp com mensagem pronta.

Verificado no navegador (375×812): faixa verde/laranja na barra, “2 seguidas!”, resumo
(energia, acertos, tempo, ofensiva), revisão “1 de 1” limpando a lista, aviso de selo,
desafio de toque nas duas lições, home levando à lição 1, canal com os dois links oficiais,
Drawer com o Eletriquinho. Não verificado: som e vibração reais (testes com som desligado),
certificado gerado e compartilhado, humores “escutando/falando” com microfone real.

Atualização de 18/10/2026: o certificado foi removido a pedido do usuário; o relato
acima é histórico. Escopo e verificações da remoção estão na
[sessão Claude](sessao-claude-2026-10.md#atualizacao-remocao-do-certificado-18102026).

Backlog: painel de autonomia para a Equatorial (precisa de endpoint público agregado),
lembretes (Web Push), meta diária configurável, repetição espaçada entre sessões.
