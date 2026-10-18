# Sessão Claude (17 e 18/10/2026): do MVP ao app de ensino

Registro do que foi feito pelo Claude numa sessão longa sobre o Digitaliza Aí
(`mvp`, `back` e `docs`). O objetivo do usuário era ficar em 1º lugar no hackathon
Equatorial e impressionar em produto, didática e design.

Este registro é evidência datada. As regras que continuam valendo estão nos guias de
`structure` e nas decisões `DEC-EQT-030` a `DEC-EQT-036`.

## Resultado esperado

Um app de ensino em trilha fechada, no estilo dos apps de ensino do mercado, que ensina
a obter a segunda via. Ele usa o backend Python como fonte de conteúdo e de prática,
tem assistente de voz com mascote e termina levando a pessoa ao canal oficial real da
Equatorial.

## Escopo entregue, por fase

### 1. Infraestrutura e assistente

| Entrega | Onde | Decisão |
| --- | --- | --- |
| QueryClient movido para `lib` | `src/lib/query-client.ts` | — |
| CORS do backend por regex (túneis ngrok) | `back/.../config.py`, `main.py` (`CORS_ORIGIN_REGEX`) | — |
| API pelo túnel quando o app abre fora de localhost | `src/config/api.ts` (`NEXT_PUBLIC_API_TUNNEL_URL`), header `ngrok-skip-browser-warning` em `http/api.ts` | — |
| Fallback de modelos Groq em 429 ou resposta inválida | `src/server/model-fallback.ts`, `server/assistant/groq.ts`, `server/stt/groq.ts` | `voice-interpretation.md` |
| TTS nativo, mute e botão de ouvir | `hooks/use-speech-synthesis.ts`, `voice-assistant-host.tsx` | DEC-EQT-030 |
| Confirmação decidida pela LLM, depois navegação direta | `server/assistant/groq.ts`, `lib/assistant/schemas.ts` | DEC-EQT-031, DEC-EQT-033 |
| Prompt menor (~57%), entrada compacta, “sim”/“não” sem LLM, raciocínio médio | `groq.ts` (`compactInput`, `quickReply`) | DEC-EQT-033 |
| “Nada disso, quero outra coisa”, `rejectedOptionIds`, guard pela tentativa real, contexto de prática e dificuldades | `components/voice/*`, `lib/practice/activity.ts` | DEC-EQT-032 |

### 2. Mega revisão: diagnóstico, Hub e integração com o backend

- **Diagnóstico** de 12 problemas no Hub e 5 no assistente: [mega-revisao.md](mega-revisao.md).
- **Integração com o backend:** todas as páginas da trilha (mapa, lições, consulta, dificuldades e canal) passaram a consumir `GET /tracks`, `/steps`, `/difficulties` e `/channel-exit`. O conteúdo local foi removido.
- **Prática real:**
  - usa `POST/GET /practice/attempts` (modos guiado e individual), com `X-Session-Id` anônimo, retomada da tentativa e nenhum gabarito no front;
  - a conclusão só é celebrada com tentativa concluída;
  - `POST /events` registra a jornada.
- **Simulador do canal oficial:**
  - Agência Virtual (Pagamento Simplificado) e WhatsApp da Clara, guiados por conteúdo do backend (`channel_simulations`, `GET /tracks/{id}/channel-simulations`);
  - telas conferidas marcadas como reais, as demais como ilustrativas;
  - detalhes em [canais-oficiais.md](canais-oficiais.md).
- Decisões: DEC-EQT-032 e DEC-EQT-033.

### 3. Design: trilha de energia

- **Direção A** (trilha no estilo Duolingo), com o tom institucional da direção B no que é serviço real. Decisão: DEC-EQT-034.
- **Base visual:**
  - botão primário azul de verdade e botões com efeito 3D;
  - mapa da trilha em zigue-zague e energia em kWh;
  - celebrações.
- **Mascote:** Eletriquinho (antes “Faísca”), redesenhado nas regras de ilustração do Duolingo e com animação em camadas: corpo, respiração, raio com halo, faíscas e olhar. Tem os humores feliz, comemorando, acenando, pensativo, “opa”, escutando e falando. Decisão: DEC-EQT-035.
- **Tipografia:** Nunito, pesos fortes e cantos de 16 px. Decisão: DEC-EQT-035.
- **Layout de app:**
  - só o miolo rola;
  - barra de ações fixa via `PageActions` (portal);
  - microfone sempre visível;
  - rolagem estilizada e sem rolagem lateral;
  - cabeçalho com atalho “Trilhas”.
- Guia: [visual-direction](../structure/visual-direction.md).

### 4. Estudo Duolingo e concorrentes, e gamificação gentil

Pesquisa sobre ofensiva, XP e ligas, corações/energia, feedback, personagens com
estados, Practice Hub, onboarding, Brilliant, Mimo e o público com pouca familiaridade
digital. A síntese e as fontes estão na DEC-EQT-036 e na mega revisão.

Princípios adotados: errar não custa nada, a ofensiva só celebra, não há ligas nem
culpa, e som e animação são opcionais.

| Entrega | Onde |
| --- | --- |
| Feedback na barra (verde/laranja), som Web Audio e vibração com mute único | `practice-session.tsx`, `lib/feedback/{sound,preferences}.ts`, `journey.module.css` (`:has`) |
| Sequência de acertos, “Lição perfeita” e resumo final | `use-practice-session.ts`, `practice-session.tsx` |
| Aviso de ofensiva e selos (fila) | `components/brand/streak-moment.tsx`, `_lib/progress.ts` (`streakOf`, `badgesOf`) |
| Revisão de erros | `back/.../practice/*` (`item_ids`, migration `0002`), `_lib/review.ts`, `pratica/revisao` |
| Desafio de toque nas lições e “Comece em 2 minutos” | `lesson-illustration.tsx`, `track-selection.tsx` |
| Certificado compartilhável (removido em 18/10/2026; ver atualização abaixo) | Componente removido: `certificate-button.tsx` |
| Eletriquinho no Drawer com humor pelo estado; botão flutuante só com microfone | `voice-conversation.tsx`, `voice-assistant-host.tsx` |
| Saída real para o canal oficial, com WhatsApp e mensagem pronta | `channel-exit.tsx`, `back/.../channel/router.py`, `CHANNEL_EXIT_LINKS` |

## Critérios de aceite e verificação

Data e ambiente: 17 e 18/10/2026, navegador do painel em 375×812, backend local e Groq real.

- [x] `bun run lint` e `bun run build` aprovados.
- [x] Backend: `validate_content`, `export_openapi` e 109 testes unitários existentes aprovados.
- [x] Prática guiada e individual completas com a API: erro, acerto, dica, conclusão, “com apoio” e resultado.
- [x] Barra verde e laranja, “2 seguidas!” e resumo (energia, acertos, tempo, ofensiva).
- [x] Revisão “1 de 1”, que limpa a lista; aviso de selo; desafio de toque nas duas lições.
- [x] Canal com os dois links oficiais e o WhatsApp com a mensagem codificada.
- [x] Assistente:
  - cenários reais na Groq: navegação direta, esclarecimento, “Você quis dizer…?”, fora de escopo e “sim”/“não”;
  - “Nada disso” sem repetir opções;
  - Eletriquinho no Drawer.
- [x] Layout: 13 telas sem rolagem da página, barra na base e microfone visível sem sobreposição.
- [ ] Som e vibração reais no celular (os testes rodaram com o som desligado).
- Certificado gerado e compartilhado no aparelho: não verificado na sessão original;
  validação cancelada com a remoção do recurso em 18/10/2026.
- [ ] Humores “escutando” e “falando” com microfone real; STT e TTS no celular via ngrok.
- [ ] Testes de integração do backend (dependem do Postgres).

## Pendências e backlog

- Painel de autonomia para a Equatorial: precisa de um endpoint público agregado, porque `/metrics/autonomy` exige `X-Admin-Token`.
- Lembretes (Web Push), meta diária configurável e repetição espaçada entre sessões.
- Telas reais da Agência Virtual depois da identificação e o menu exato da Clara por estado. A lista do que mandar está em [canais-oficiais.md](canais-oficiais.md).
- Trilha indisponível ou com `content_version` diferente ainda não tem tela própria.
- Dica de desenvolvimento: se o CSS parecer desatualizado no `bun dev`, apague `.next/dev/cache` e reinicie. É o cache do Turbopack.

## Atualização: remoção do certificado (18/10/2026)

Por pedido do usuário, o certificado deixou de fazer parte da aplicação. Foram
removidos o botão no mapa da trilha completa, o botão no resultado da prática e o
componente exclusivo que gerava, baixava e compartilhava o PNG. Energia, selos,
revisão, celebração e navegação para o canal oficial foram preservados. Nenhuma
dependência, contrato de API ou registro de progresso precisou ser alterado.

Verificações desta alteração:

- `bun run lint` aprovado; nenhuma referência ao certificado permanece em `src`.
- `bun run build --webpack` aprovado, incluindo TypeScript. O build padrão com
  Turbopack ficou bloqueado pelo ambiente (download da Nunito e, na nova tentativa,
  abertura de porta interna com `Operation not permitted`).
- Navegador em 375×812 com API Python local: mapa inicial e resultado após concluir
  uma prática individual real (3 perguntas), sem certificado e sem excesso de largura.
- Mapa completo conferido em sessão isolada com progresso local preparado apenas
  para verificar esse estado: 90 kWh, 5 selos, mensagem de conclusão e ação para o
  canal oficial, sem certificado. Isso não comprova realização de toda a trilha.
- Capturas em `output/playwright/resultado-sem-certificado.png` e
  `output/playwright/trilha-sem-certificado.png`.

## Atualização: resumo da prática e progresso sem ofensiva (18/10/2026)

Por pedido do usuário, tempo e ofensiva foram retirados do resumo compartilhado
pelas práticas com apoio, individual e revisão. O resumo mantém energia (ou itens
revisados) e acertos, em duas colunas. O medidor da trilha mantém energia em kWh e
a barra de progresso, sem “X dias seguidos”.

Foram removidos o cronômetro local, o cálculo de dias e os avisos de ofensiva.
O componente de avisos passou a se chamar `BadgeMoment` e mantém a fila de novos
selos. A sequência de acertos durante as perguntas, os selos e os avanços existentes
permanecem. Registros antigos no navegador continuam legíveis, mesmo com o campo
legado `days`; nenhum progresso é apagado. Contratos e métricas do backend não mudam.

Os relatos de tempo e ofensiva nas seções originais desta spec são históricos.
O comportamento vigente está em [direção visual](../structure/visual-direction.md).

Validação desta alteração em 18/10/2026:

- `bun run lint` e `bun run build --webpack` aprovados, incluindo TypeScript.
  O build padrão com Turbopack foi tentado e bloqueado pelo ambiente ao abrir
  uma porta interna (`Operation not permitted`).
- Navegador em 375×812 com API local: prática com apoio concluída pelas três
  perguntas reais; resumo com apenas +20 kWh e 100% de acertos. A ação “Agora tente
  sozinho” abriu a prática individual já concluída na sessão, com +30 kWh e acertos,
  também sem tempo e ofensiva. Revisão usa o mesmo resumo, mas não foi repetida.
- O selo “Lição perfeita” gerou o aviso “Novo selo!”, sem aviso de ofensiva.
- Progresso legado preparado no navegador com `days` e uma lição concluída:
  após as práticas, o mapa mostrou 60/90 kWh e a barra em 66,7%, sem dias seguidos.
  Não houve perda dos avanços nem excesso de largura.
- Capturas em `output/playwright/pratica-guiada-sem-tempo-ofensiva.png` e
  `output/playwright/trilha-sem-ofensiva.png`. Verificação em navegador, sem celular físico.

## Atualização: apresentação do card de energia (18/10/2026)

Alteração localizada em `EnergyMeter` e suas classes no CSS do mapa: cabeçalho com
“Energia de Aprendizado” à esquerda e status à direita; ícone e pontuação abaixo,
mesma barra e mensagem de apoio contextual. “kWh virtuais” é apenas o novo texto
da unidade nesse card. Demais telas e o sistema de pontos não foram alterados.

O consumidor `TrackRoadmap` fornece o indicador de conclusão que já usa (`!next`),
sem nova regra. “Em progresso” acompanha “Ganhe energia ao concluir as lições.”;
“Meta atingida!” acompanha “Você completou sua jornada de aprendizado!”.
Manutenção em [direção visual](../structure/visual-direction.md).

Verificações desta alteração em 18/10/2026:

- `bun run lint` e `bun run build --webpack` aprovados, incluindo TypeScript.
  O build padrão com Turbopack ficou bloqueado pelo ambiente ao abrir uma porta
  interna (`Operation not permitted`).
- Navegador com API local: estado inicial em sessão nova (0/90, barra em 0%),
  progresso já existente na sessão de revisão (60/90, barra em 66,7%) e conclusão
  (90/90, barra em 100%) após acessar a lição restante e concluir o simulador pela UI.
  Os status e mensagens acompanharam o indicador da trilha. Não foram inseridas
  pontuações fixas ou novos dados de progresso para esta verificação.
- Layout conferido em 320×812, 375×812 e 1280×900, sem excesso de largura;
  título e status alinhados no cabeçalho. Cores, fonte, ícone, padding, bordas e
  dimensões da barra existentes foram preservados.
- Diff conferido: `progress.ts`, hook da prática, dependências e lockfile sem
  alterações; expressão de largura da barra preservada. Apenas apresentação,
  prop de conclusão no consumidor e documentação foram alteradas.
- Capturas em `output/playwright/energia-aprendizado-em-progresso.png`,
  `output/playwright/energia-aprendizado-concluido.png` e
  `output/playwright/energia-aprendizado-320.png`. Sem verificação em celular físico.

## Configuração necessária

- **`mvp/.env`:**
  - `NEXT_PUBLIC_API_URL`;
  - opcionalmente `NEXT_PUBLIC_API_TUNNEL_URL` e `NEXT_DEV_ALLOWED_ORIGINS` (só o host) para o ngrok;
  - `GROQ_API_KEY`, `GROQ_LLM_MODEL` e `GROQ_STT_MODEL`.
- **`back/.env`:**
  - `CORS_ORIGINS` e `CORS_ORIGIN_REGEX`;
  - `CHANNEL_EXIT_LINKS` (links oficiais por destino).
- **Banco:** `uv run alembic upgrade head` (migration `0002`).

## Jornada Serviço → Canal → 3 etapas (18/10/2026, DEC-EQT-037)

O que mudou:
- **Fluxo:** Serviços → Segunda via (escolha do canal: WhatsApp; site “Em breve”) → mapa
  do WhatsApp → etapa 1 (demonstração narrada pelo Eletriquinho) → etapa 2 (4 partes no
  chat simulado) → etapa 3 (conversa inteira) → WhatsApp oficial com a mensagem pronta.
  As 12 rotas antigas, o simulador, a revisão e a página do canal foram apagados.
- **Nome:** “Trilhas” virou “Serviços” na interface, no cabeçalho, no assistente e no
  prompt da LLM (no código, `track` continua).
- **Performance:** um pacote (`GET /tracks/{id}/bundle`), correção local, um envio por
  etapa (`POST /practice/attempts/submit`, recorrigido pelo motor do backend), fila de
  reenvio para falhas de rede/5xx e eventos em lote.
- **Assistente:** Eletriquinho redondo como acionador no canto do conteúdo, com balão de
  fala (dica da tela, narração da etapa 1, dicas da prática e comemoração).

Verificações:
- `bun run lint`, `bunx tsc --noEmit` e `bun run build` aprovados; backend com
  `validate_content.py` e 173 testes aprovados.
- Navegador (375 e 320 px, API local): percurso completo da escolha do canal à conclusão;
  demonstração tocando sozinha até o fim com selo; erro, dica e acerto na etapa 2; feedback
  neutro e ajuda na etapa 3; link `wa.me/...?text=...` em nova aba; folha de Ajuda.
- Rede: nenhuma busca de conteúdo ao navegar entre as partes (só nas cargas completas da
  página), nenhuma requisição durante a prática, 1 envio ao fim da etapa 2 e 1 da etapa 3.
- Envio com rede derrubada: conclusão aparece normalmente, o envio fica na fila e é
  reenviado uma única vez ao voltar.
- **Não verificado:** movimento reduzido real (só pelo código), narração com voz em
  celular físico e abertura real do WhatsApp no aparelho.

## Assistente contextual, conclusão, cards e logo (18/10/2026, DEC-EQT-038)

O que mudou: contexto por tela e da lição no assistente, tipo `help` (dica sem resposta),
UI compacta com chips, fim do botão Ajuda, tela `/whatsapp/concluido`, `ChoiceCard` na home
e na escolha de canal, faixa “Trocar canal” no mapa e logotipo oficial no header.

Validação da LLM (script temporário fora do repositório, contra `/api/interpret`, Groq real):
- 39 falas em 9 telas (serviços, canal, mapa, demonstração, 4 partes, simulação, conclusão).
- Considerando as respostas obtidas: 33 de 35 com tipo e destino esperados.
- Mensagens entre 19 e 145 caracteres.
- **Vazamento bruto da resposta:** 2 casos (“09/2026”, deduzido da dica do mês). Na tela, o
  guarda `withoutAnswer` troca essas falas pela dica; o prompt também foi reforçado.
- Fala hesitante virou `confirmation_request` depois da regra no servidor.
- **Não verificado:** 4 falas ficaram sem resposta por limite de cota da Groq e, no fim, 3
  por `PROVIDER_AUTH_ERROR` (401/403 da Groq, lado da conta). As alterações finais do prompt
  (valor exato da opção e “terminei, e agora?”) ainda não foram rodadas de novo.

Navegador (build de produção e API local; 375 e 320 px):
- assistente com cerca de 36% da altura;
- “Me dá uma dica” na parte 1 devolveu “Procure a opção que fala de ‘fatura’”;
- home com os cards novos;
- “Trocar” no mapa sem quebrar;
- conclusão incompleta (“Quase lá!”) e completa, com `wa.me/...?text=...` em nova aba;
- logotipo nítido;
- sem rolagem horizontal.

O dev server já aberto em :3000 serviu um `globals.css` antigo (cache do Turbopack). Para
ver a UI nova nele, pare o servidor, apague `.next/dev/cache` e suba de novo.

## Ajustes após teste e flag da IA (18/10/2026, DEC-EQT-039)

Verificado em build de produção com API local, a 375px, com a flag desligada:
- botões de som e X com 44×44 redondos;
- opções do assistente em lista;
- sem microfone;
- “Me dá uma dica” mostrou a dica local;
- “Estou com problema” listou as dificuldades e a orientação com o chip do destino;
- `/api/interpret` e `/api/transcribe` responderam 503 e a página não as chamou;
- etapa 1: play/pausa, ir ao passo 3, voltar, avançar até o fim, “Ver de novo” + “Ir para a
  etapa 2” e voltar depois do fim;
- etapa 3:
  - um erro (a Clara respondeu e repetiu as opções) e CPF pelo campo de exemplo;
  - nenhum botão na barra durante a conversa;
  - fatura, resultado “Você conseguiu sozinho!” e “Concluir / Refazer” só no fim;
  - 1 envio (201);
- parte concluída com ícone, sem mascote duplicado, e aviso de selo sem mascote;
- header sem sobreposição a 375px.

**Não verificado:**
- a flag ligada no navegador (o fluxo com IA é o mesmo de antes);
- a voz pt-BR em aparelho real;
- 320 e 414 px nesta rodada.

## Header fixo, chat rolável e cliques (18/10/2026, DEC-EQT-040)

Causa do header sumindo e dos cliques perdidos: `scrollIntoView` rolava o shell inteiro e
movia os botões durante o toque.

Verificado em build de produção a 375px (flag da IA desligada):
- header sempre em `top: 0` depois de várias mensagens;
- página sem rolar na etapa 3; o chat rolou por dentro até a última mensagem;
- bolha do usuário aparece em cerca de 8ms após o clique;
- todos os botões do rodapé do chat recebem o toque no centro e na borda direita (onde
  fica o mascote);
- fim da etapa 1 com “Ir para a etapa 2” (principal) e “Ver de novo” (secundário);
- botão “ouvir” com 36×36, redondo e sem borda 3D (medido com um elemento de teste,
  porque o navegador de teste não tem voz pt e o botão some).

**Não verificado:**
- aparelho real;
- 320 e 414 px;
- rolagem suave com a aba visível (os testes rodaram com o painel oculto).

Ajustes seguintes (375px, build de produção):
- WhatsApp com 85% da largura (292 de 343px);
- respiro final normal (24px) em todas as telas;
- sem balão ao abrir; dica da tela depois de cerca de 12 s parado;
- etapa 3 com “Sair da simulação” durante a conversa.

Ajustes finais do Eletriquinho e do WhatsApp:
- **Posição do Eletriquinho:** medida em 320×568, 375×812 e 414×896, em todas as telas
  e estados: home, canal, mapa, demonstração tocando e no fim, parte (inicial, com erro e
  dica, acerto e concluída), etapa 3 e conclusão.
  - Antes ficava 6px abaixo da barra ou da borda e era cortado nas telas sem barra.
  - Agora fica a 12px, nunca cortado, com o balão sempre dentro da tela e acima da barra.
- **Tamanho do WhatsApp:**
  - 287×585 a 375×812;
  - 240×409 a 320×568, cabendo na área visível de 423px.
- **Dica da tela:** aparece depois de 30 s parado.

Revisão final do WhatsApp (pedido do usuário): sem rolagem interna e com 100% da largura.
Verificado na etapa 3 a 320×568, 375×812, 840×520 e 405×313:
- sem rolagem dentro do chat;
- fim do chat visível depois de cada mensagem (inclusive depois de um erro);
- header em `top: 0`;
- botões das respostas recebendo o toque;
- espaço final de 24px.

Etapa 2 e demonstração conferidas a 375px. O espaço grande do print do usuário vinha de
uma versão antiga em execução (o padding de 168px já removido).
