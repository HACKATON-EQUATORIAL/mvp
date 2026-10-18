# Direção visual: trilha de energia (DEC-EQT-034)

Une plataforma educacional e empresa de energia, inspirada no Duolingo, com o tom
institucional nas partes de serviço real.

## Onde vale cada tom

| Área | Tom | Elementos |
| --- | --- | --- |
| Serviços, mapa, demonstração, lições, simulação | Aprendizagem (lúdico) | Eletriquinho, energia em kWh, passos que acendem, celebração, botões 3D |
| Escolha do canal, folha de ajuda, avisos | Institucional (calmo) | Aviso de simulação, sem celebração |

## Peças

- **Botões:** `.ui-button-primary` passa a ser azul Equatorial (`--header-bg`) com texto
  branco; primário e secundário têm borda inferior de 4px e “afundam” ao tocar. Botões do
  assistente (microfone e ajuda) ficam fora dessa regra e mantêm o amarelo.
- **Eletriquinho** (`components/brand/eletriquinho.tsx`): guia da trilha em SVG, humores `happy`,
  `cheer` e `think`; `FaiscaTip` mostra uma dica em balão. Decorativa (`aria-hidden`).
- **Celebração** (`components/brand/celebration.tsx`): faíscas curtas no acerto e na
  conclusão. Desligada com `prefers-reduced-motion`.
- **Energia** (`_lib/progress.ts` `energyOf`, `EnergyMeter`): 10 kWh pela demonstração,
  10 por parte da etapa 2 e 40 pela conversa inteira (máx. 90). É só visual e
  local; a prova de realização continua sendo a tentativa no backend.
  No card da trilha, o cabeçalho mostra “Energia de Aprendizado” e o status; a
  pontuação usa o texto “kWh virtuais”, seguido da mesma barra e de uma mensagem
  de apoio. `TrackRoadmap` passa sua indicação existente de conclusão (`!next`)
  para alternar “Em progresso” / “Meta atingida!” e a mensagem. Os cálculos,
  valores, persistência e atualização de pontos permanecem os mesmos.
- **Mapa da trilha:** caminho em zigue-zague com nós de 72px (concluído verde, próximo
  amarelo com brilho e selo “Próximo”, meta tracejada).
- **Lições:** “Guarde” da Eletriquinho com a ideia que a prática cobra e bônus de energia.

## Layout de app (todas as telas)

- O shell ocupa exatamente `100dvh`; a página inteira não rola.
- `JourneyPage` divide a tela em miolo rolável (`.scroll`, com 96px de respiro no fim) e
  barra de ações fixa embaixo (`#journey-actions`). Ações anteriores à última ocupam
  a largura disponível; a última linha reserva uma coluna para o assistente,
  sempre visível no canto inferior direito. Largura e altura do acionador são
  compartilhadas pelo shell (`--assistant-trigger-width` e `--assistant-trigger-height`).
- Botões principais vão para a barra: pelo prop `actions` (servidor) ou pelo
  `PageActions` (portal, para componentes de cliente e trechos dentro de `Suspense`).
  Limite de 1 a 2 botões na barra; escolhas e caminhos extras ficam no miolo.
- Barra vazia some (`:empty`). Telas sem ações (ex.: home) mantêm só o assistente.
- Na trilha e nas lições, “Consultar uma dúvida” usa `ActionLink` com variante
  `secondary` e tamanho padrão, abaixo da ação principal. Na consulta rápida, só “Voltar”
  com `ArrowLeft`, usando o botão `secondary` de tamanho padrão. O assistente usa o `Eletriquinho` original e texto
  visível “Assistente”, em amarelo; seu microfone fica dentro do Drawer.
- Rolagem: só vertical (`overflow-x: hidden`), barra fina arredondada em `--primary-200`,
  conteúdo esmaece ao passar sob a barra de ações (`mask-image`) e a barra tem sombra leve.
  Nova pergunta da prática e novo passo do simulador voltam ao topo (`scrollJourneyToTop`);
  no WhatsApp simulado, a conversa rola até a mensagem mais nova. O feedback da prática é
  revelado com rolagem suave (`revealInJourney`).
- Cabeçalho: “Digitaliza Aí” leva à home e o botão “Serviços” (oculto na home) permite
  trocar de serviço de qualquer tela.

Verificado a 375×812 em home, trilha, lições, visão geral, consulta, dificuldades,
canal, conta de exemplo, prática (pergunta e conclusão), resultado e simulador: a página
não rola, a barra fica na base, o microfone fica visível e não cobre botões.

Nota de teste: no painel de preview em segundo plano, telas com `Suspense` só revelam o
conteúdo quando a aba fica visível (o React usa `requestAnimationFrame`); não é bug do app.

## Acessibilidade

Toque mínimo de 44px (nós de 72px), contraste com os tokens existentes, textos de estado
para leitores de tela (“concluído”), animações respeitando movimento reduzido.

## Dica de desenvolvimento

O Turbopack às vezes mantém uma versão antiga de `app/globals.css` no `bun dev`. Se uma
regra nova não aparecer, pare o servidor, apague `.next/dev/cache` e suba de novo.

## Tipografia e UI de app de ensino (DEC-EQT-035)

- Fonte **Nunito** (`next/font/google`, `--font-nunito`): arredondada e legível, no estilo
  das fontes de apps de ensino. Texto base com peso 500; títulos 900; botões 800.
- Botões e opções com cantos de 16px (`--radius-lg`); rótulo de seção em azul, caixa alta
  espaçada; perguntas e lições com título 1.375rem/900.
- Barras de progresso mais grossas com brilho interno; medidor de energia em kWh,
  sem contagem de dias seguidos.

## Efeitos e gamificação gentil (DEC-EQT-036)

- **Sons** (`lib/feedback/sound.ts`): sintetizados com Web Audio (acerto, erro suave,
  conclusão, brilho), com vibração curta. Preferência única em `lib/feedback/preferences.ts`
  (botão de som do Drawer controla voz e efeitos; ligado por padrão).
- **Prática:** faixa colorida na barra inferior (verde/laranja, via `:has`), “N seguidas!”,
  selo “Lição perfeita” e resumo animado (energia e acertos; revisão mostra itens
  revisados e acertos). Tempo e ofensiva foram removidos em 18/10/2026.
- **Celebrações** (`components/brand/badge-moment.tsx`): fila de avisos de novos selos
  no topo; só comemoram. Não há avisos de ofensiva nem contagem diária de avanços.
- **Selos** (`badge-shelf.tsx`, 6 em grade 3×2) no mapa; a revisão de erros saiu (DEC-EQT-037).
- A conclusão da trilha e o resultado da prática não oferecem certificado,
  geração de imagem, download ou compartilhamento de certificado (removido em 18/10/2026).
- **Lições:** desafio de toque na ilustração antes do destaque.
- **Eletriquinho no Drawer** com humor pelo estado; acionador externo com o mascote e
  texto “Assistente”. O controle de gravação interno mantém o microfone.

## Jornada em 3 etapas e Eletriquinho acionador (DEC-EQT-037)

- **Chat do WhatsApp** (`_components/whatsapp-chat.tsx`): moldura com cabeçalho da Clara,
  aviso fixo de treino, balões animados, “digitando…”, respostas rápidas e cartão de
  resultado. Cores próprias do mensageiro, sem logo.
- **Etapa 1** (`demo-scene.tsx`): máquina de fases por passo (digitando → narração → toque).
  O Eletriquinho fala a `instruction` no balão (humor `talk`) e, com som, em voz (TTS
  nativo); o dedo 👆 toca a resposta certa. Avança sozinho após a fala; pausar, voltar,
  “Próximo passo” e “Repetir do início”. Com movimento reduzido, só avança no toque.
- **Etapas 2 e 3** (`practice-chat.tsx`): parte com “Como funciona”, contexto das partes
  anteriores esmaecido e dica/explicação no balão do Eletriquinho; conversa inteira com
  feedback neutro, “N seguidas!” e ajuda sob pedido. Faixa de feedback na barra.
- **Eletriquinho acionador:** botão redondo de 72px só com o mascote, no canto do
  conteúdo acima da barra (`#assistant-dock`), com balão de fala fechável que reabre quando
  a fala muda. A rolagem automática deixa a mensagem nova acima do balão
  (`scroll-margin-bottom`). O `EletriquinhoTip` do topo das telas saiu.
- Verificado a 320 e 375 px: sem rolagem horizontal; mascote não cobre botões da barra.

## Conclusão, cards e assistente compacto (DEC-EQT-038)

- **Assistente:** meia folha (até 62dvh e 480px de largura), cabeçalho de uma linha (Eletriquinho
  40px, som, X), fala em balão `--primary-50`, chips de 44px em pílula, Sim/Não lado a lado.
- **Cards de escolha** (`components/layout/choice-card.tsx`): ícone em círculo, título,
  descrição, linha de destaque e barra opcional; indisponível tracejado com “Em breve”.
  Usado na home e na escolha de canal.
- **Mapa:** faixa “Canal escolhido · WhatsApp da Clara · Trocar” no topo; barra só com
  “Continuar”/“Ver a conclusão”.
- **Conclusão** (`journey-done.tsx`): destaque verde com Eletriquinho, lista das 3 etapas,
  energia e selos, aviso de requisitos e o botão do WhatsApp oficial.
- **Header:** logotipo oficial branco da Equatorial com o estado “MA”.

## Ajustes após teste (DEC-EQT-039)

- **Header:** grade `1fr auto 1fr` (logo + MA / “Digitaliza Aí” / Serviços).
- **Assistente:** `.voice-icon-button` (44px, redondo, sem borda 3D); `.voice-chips` em
  lista vertical de largura total; “Voltar às opções” quando não há IA.
- **Etapa 1:** player (`.player`, segmentos clicáveis e botões redondos).
- **Etapa 3:** chat contínuo com campo de mensagem (`.composer`) e resultado só no fim.
- **Um mascote só:** `.doneIcon` e `.feedbackIcon` no lugar do Eletriquinho dos painéis.
- **Fim da tela:** `.scroll` com respiro normal (`--spacing-md`), sem os 120px.

## Rolagem, chat e barra (DEC-EQT-040)

- **Rolagem:** nunca usar `scrollIntoView`; usar `revealInJourney`/`scrollJourneyToTop`
  (`components/layout/journey-scroll.ts`), que rolam só o miolo. O shell é
  `overflow: clip`, então o header não sai da tela.
- **Chat** (`ChatFrame`): corpo rolável com `max-height: clamp(160px, 100dvh - 560px,
  420px)` e rodapé fixo (`footer`) para respostas rápidas ou o campo de mensagem.
- **Barra:** o principal sempre avança; refazer ou ver de novo é secundário.
- **Eletriquinho:** `bottom: -6px` (encostado na barra), compacto em lição, balão
  `pointer-events: none` com X clicável e fechamento automático em 6 s.
- **Ajustes (DEC-EQT-040):** `.device` com `width: 85%` (folga lateral para rolar a
  página), scrollbar fina no chat, sem padding extra no fim das telas e dica da tela só
  após 12 s ocioso (`useIdle`).
- **WhatsApp e mascote (DEC-EQT-040):** `.device` com altura `clamp(400px, 72dvh, 620px)`
  e corpo `flex: 1`; `.mascotCorner` com `bottom: var(--spacing-xs)` (e área segura quando
  não há barra); dica da tela após 30 s ocioso.
- **WhatsApp sem rolagem interna (revisão final, DEC-EQT-040):** `.device` com
  `width: 100%`, sem altura fixa; `ChatFrame` chama `revealInJourney(frame)` a cada
  mensagem (só o miolo rola). Substitui as notas anteriores de 85%, altura fixa e scrollbar.
