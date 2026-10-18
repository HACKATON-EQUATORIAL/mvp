# Direção visual: trilha de energia (DEC-EQT-034)

Une plataforma educacional e empresa de energia, inspirada no Duolingo, com o tom
institucional nas partes de serviço real.

## Onde vale cada tom

| Área | Tom | Elementos |
| --- | --- | --- |
| Home, mapa da trilha, lições, prática, resultado | Aprendizagem (lúdico) | Eletriquinho, energia em kWh, passos que acendem, celebração, botões 3D |
| Canal oficial, dificuldades, simulador, avisos | Institucional (calmo) | Sem mascote, selo “Atendimento oficial”, azul claro, aviso de simulação |

## Peças

- **Botões:** `.ui-button-primary` passa a ser azul Equatorial (`--header-bg`) com texto
  branco; primário e secundário têm borda inferior de 4px e “afundam” ao tocar. Botões do
  assistente (microfone e ajuda) ficam fora dessa regra e mantêm o amarelo.
- **Eletriquinho** (`components/brand/eletriquinho.tsx`): guia da trilha em SVG, humores `happy`,
  `cheer` e `think`; `FaiscaTip` mostra uma dica em balão. Decorativa (`aria-hidden`).
- **Celebração** (`components/brand/celebration.tsx`): faíscas curtas no acerto e na
  conclusão. Desligada com `prefers-reduced-motion`.
- **Energia** (`_lib/progress.ts` `energyOf`, `EnergyMeter`): 10 kWh por lição, 20 pela
  prática com apoio, 30 pela prática sozinho e 20 pelo simulador (máx. 90). É só visual e
  local; a prova de realização continua sendo a tentativa no backend.
- **Mapa da trilha:** caminho em zigue-zague com nós de 72px (concluído verde, próximo
  amarelo com brilho e selo “Próximo”, meta tracejada).
- **Lições:** “Guarde” da Eletriquinho com a ideia que a prática cobra e bônus de energia.

## Layout de app (todas as telas)

- O shell ocupa exatamente `100dvh`; a página inteira não rola.
- `JourneyPage` divide a tela em miolo rolável (`.scroll`, com 96px de respiro no fim) e
  barra de ações fixa embaixo (`#journey-actions`), com 76px reservados à direita para o
  microfone do assistente, que fica sempre visível no canto inferior direito.
- Botões principais vão para a barra: pelo prop `actions` (servidor) ou pelo
  `PageActions` (portal, para componentes de cliente e trechos dentro de `Suspense`).
  Limite de 1 a 2 botões na barra; escolhas e caminhos extras ficam no miolo.
- Barra vazia some (`:empty`). Telas sem ações (ex.: home) mantêm só o microfone.
- Rolagem: só vertical (`overflow-x: hidden`), barra fina arredondada em `--primary-200`,
  conteúdo esmaece ao passar sob a barra de ações (`mask-image`) e a barra tem sombra leve.
  Nova pergunta da prática e novo passo do simulador voltam ao topo (`scrollJourneyToTop`);
  no WhatsApp simulado, a conversa rola até a mensagem mais nova. O feedback da prática é
  revelado com rolagem suave (`revealInJourney`).
- Cabeçalho: “Digitaliza Aí” leva à home e o botão “Trilhas” (oculto na home) permite
  trocar de trilha de qualquer tela.

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
- Barras de progresso mais grossas com brilho interno; medidor de energia com
  **sequência de dias** (`streakOf`, dias com avanço guardados no navegador).

## Efeitos e gamificação gentil (DEC-EQT-036)

- **Sons** (`lib/feedback/sound.ts`): sintetizados com Web Audio (acerto, erro suave,
  conclusão, brilho), com vibração curta. Preferência única em `lib/feedback/preferences.ts`
  (botão de som do Drawer controla voz e efeitos; ligado por padrão).
- **Prática:** faixa colorida na barra inferior (verde/laranja, via `:has`), “N seguidas!”,
  selo “Lição perfeita” e resumo animado (energia, acertos, tempo, ofensiva).
- **Celebrações** (`components/brand/streak-moment.tsx`): fila de avisos de ofensiva e selos
  no topo; só comemoram.
- **Selos** (`badge-shelf.tsx`) e **revisão** (`review-card.tsx`) no mapa da trilha.
- A conclusão da trilha e o resultado da prática não oferecem certificado,
  geração de imagem, download ou compartilhamento de certificado (removido em 18/10/2026).
- **Lições:** desafio de toque na ilustração antes do destaque.
- **Eletriquinho no Drawer** com humor pelo estado; botão flutuante só com o microfone.
