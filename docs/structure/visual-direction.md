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
- **Padrão da barra (DEC-EQT-042):**
  - sempre empilhada, em qualquer tamanho de tela;
  - faixa de feedback em cima, depois a principal (seguir em frente) e, embaixo, no
    máximo uma secundária;
  - só ações da tela: o único voltar é o “Voltar às etapas” do topo (`back`), e não há
    mais a seta de etapa anterior (`previous`).
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
- Cabeçalho: “Digitaliza Aí” à esquerda leva à home; a logo da Equatorial + MA fica à
  direita. Não há mais botão “Serviços” (trocar de serviço é pelo “Voltar” das telas ou
  pelo início).

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

### Continuidade visual do mapa

`roadmap-path.tsx` acrescenta uma camada SVG decorativa atrás da lista do mapa,
sem alterar os círculos, rótulos, deslocamentos laterais ou espaçamentos. As curvas
saem pelas laterais dos círculos, contornam os rótulos e chegam por cima do círculo
seguinte. Cada conexão usa três curvas Bézier com tangentes compartilhadas, sem
trecho reto intermediário. O afastamento parte de `--spacing-md`; a amplitude e os
pontos de controle vêm dos raios dos círculos, da distância entre eles, dos limites
dos rótulos e da largura disponível. A curva aproveita a folga lateral sem aumentar
o espaçamento vertical da lista.

A geometria usa as posições reais dos elementos. `ResizeObserver` acompanha a
lista, os círculos e os rótulos; `MutationObserver` reassocia os alvos quando o
conteúdo ou a quantidade de passos muda. Ambos são desconectados ao desmontar.
Isso cobre redimensionamento, quebra de texto, carregamento da fonte e mudanças
nos filhos sem depender de uma quantidade fixa de etapas.

O percurso completo aparece neutro (`--border-default`, traço de 4px). O progresso
existente ilumina os segmentos até o primeiro passo pendente em `--success-400`,
com preenchimento gradual. Uma única faixa em `--success-100` percorre suavemente
esse trecho a cada seis segundos. Etapas concluídas fora de ordem mantêm seus
estados, mas não preenchem lacunas no percurso; a ligação até a meta só se ilumina
depois das seis atividades concluídas. Abrir o mapa ou a conclusão não concede
progresso. Não há nova persistência nem alteração no backend.

O SVG é oculto de tecnologias assistivas e não intercepta cliques. A lista e os
links continuam responsáveis pela navegação. Com `prefers-reduced-motion: reduce`,
o progresso aparece sem animação de desenho e sem pulso. Escopo e verificações:
[conector da trilha](../specs/trilha-conector.md).

## Ajustes após teste (DEC-EQT-039)

- **Header:** duas pontas (`1fr auto`): “Digitaliza Aí” à esquerda e logo + MA à direita
  (atualizado em 19/10/2026, sem o botão Serviços).
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

## Telas maiores, voltar e legibilidade (aplicado sobre DEC-EQT-038 a 040)

O celular não muda; tudo abaixo vale a partir de 768px, salvo onde indicado.

- **Moldura:** o shell ocupa a tela toda; a coluna (`.body`) fica centralizada sobre
  `--surface-subtle`, com borda lateral. O conteúdo do cabeçalho segue a coluna: “Digitaliza
  Aí” e a logo alinhados às bordas dela, faixa azul de ponta a ponta. 24px a mais antes
  do conteúdo.
- **Tablet (768–991px):** coluna de 720px (margens de ~24px no iPad retrato).
- **Desktop (≥992px):** `--app-content-max-width` passa a 960px (redefinido no `.shell`,
  porque `@media` só com variáveis é descartado no `globals.css`) e margem interna de
  32px no miolo, na barra e no Eletriquinho.
- **Largura toda:** o conteúdo de todas as telas ocupa a coluna inteira (mapa, etapas,
  chat e conclusão). Cards de escolha (`ChoiceCard`) em 1 coluna no tablet (em 2,
  texto e selo “Em breve” ficavam espremidos) e em 2 colunas com a mesma altura no
  desktop; no mapa, zigue-zague de ±120px e os 6 selos numa linha.
- **Chat:** respostas e campo com recuo simétrico de 80px, deixando à direita a faixa do
  Eletriquinho, que não cobre mais a última opção. O balão de fala ainda pode passar
  por cima, mas se fecha no X.
- **Barra de ações:** botões lado a lado, dividindo a largura igualmente. Ordem da
  esquerda para a direita: etapa anterior → secundário → **principal na direita**
  (avançar fecha a leitura). A faixa de feedback fica na linha de cima. No celular, com
  os botões empilhados, o principal continua em cima.
- **Voltar no topo (prop `back` do `JourneyPage`):** sub-ação em pílula `ghost` (fundo
  suave, borda fina, sem relevo, 44px de toque), acima do rótulo azul. Nas etapas
  (demonstração, partes, simulação, conclusão) leva ao mapa (“Voltar às etapas”); mapa e
  escolha do canal voltam aos serviços (quem já começou chega ao mapa direto da home; a
  troca de canal fica no “Trocar” do mapa).
- **Etapa anterior (prop `previous`):** botão secundário na barra de ações, à esquerda a
  partir de 768px. No celular vira botão quadrado só com a seta (52×52, nome completo
  para leitores de tela), na linha do secundário ou, sem ele, da principal; a barra
  passa de ~125px para 77px. A partir de 768px, com 3 botões (parte concluída), ela
  também vira só a seta e os outros dois dividem o resto. Partes 2–4 → parte anterior; parte 1 →
  demonstração; simulação → parte 4; conclusão → etapa 3 (substitui o antigo “Ver as
  etapas”, que repetia o voltar do topo). A demonstração, primeira etapa, não tem.
- **Legibilidade (todas as larguras):** rótulo acima do título em `--header-bg` (~12:1;
  o `--primary-400` dava ~4,4:1 a 12px); “MA” como etiqueta amarela com texto escuro;
  rótulos dos selos com 12px; botões `ghost`/`link` sem a sombra interna de pressionado.
- **Mapa:** 16px entre o círculo da etapa atual e o selo “Próximo”, para o brilho e a
  pulsação não encostarem nele.
- **Fim da rolagem (todas as larguras):** 72px a mais no fim do miolo, a altura do
  Eletriquinho; o último bloco (ex.: aviso de treino seguro do mapa) não fica sob ele.
  Selos em 3 colunas com 16px entre as linhas.
- **Telas largas e baixas (≥768px e altura ≤860px, ex.: iPad deitado, notebook 1366×768):**
  sem o respiro extra antes do conteúdo e conversa curta com altura mínima de 96px.
  “Como funciona” fica sempre acima do chat (lado a lado foi testado e descartado).
- **Mantido como está:** nas partes 2 a 4, o histórico das partes anteriores aumenta a
  conversa e as respostas pedem rolagem em qualquer tela; depois de cada mensagem, o
  chat já desce sozinho até elas.

## WhatsApp simulado (DEC-EQT-042)

- **Moldura:** cabeçalho “Equatorial Energia Maranhão”, com “Clara · assistente virtual”
  embaixo (`SENDER` em `whatsapp-chat.tsx`).
- **Opções:** botões presos logo abaixo do balão recebido, na largura do balão (85%, até
  400px), texto verde centralizado e 2px entre eles, como os botões interativos do
  WhatsApp.
- **Resposta da pessoa:** balão verde com a citação da mensagem respondida (`SENDER` em
  vermelho, trecho em até 2 linhas), hora e ✓✓.
- **Campo de mensagem com enviar:** sempre visível nas 3 etapas (`Composer`).
  - Desabilitado (“Mensagem”) quando a resposta é por botão.
  - “Toque para preencher o exemplo” na pergunta do documento, que é respondida só pelo
    campo nas 3 etapas, sem botões de opção, igual à demonstração.
  - Na demonstração, o dedo toca a opção ou, no documento, o enviar com o exemplo
    preenchido.

## Deixar claro que é treino (DEC-EQT-043)

- Cards de serviço e de canal levam a etiqueta “Treino” (`ChoiceCard` `tag`) e textos
  “Aprenda a…”/“Treinar no…”. Nunca descrever o serviço real como se o card o abrisse.
- A escolha de canal tem eyebrow “TREINO”, intro que explica “treina aqui, depois faz de
  verdade” e a linha das etapas no card disponível.
- O Eletriquinho avisa “Aqui é treino…” ao abrir a escolha de canal (e dá boas-vindas na
  home), uma vez por sessão (F5 fala de novo). O botão de som do balão muta e desmuta.
