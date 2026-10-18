# Rodapés e identificação do Assistente Digitaliza Aí

Entrega de interface de 18/10/2026. Manutenção vigente em
[UI e acessibilidade](../structure/styling-and-ui.md#header-e-composicao-da-pagina)
e [direção visual](../structure/visual-direction.md#layout-de-app-todas-as-telas).

## Escopo e aceite

- Reutilizar `JourneyPage`, o portal `PageActions`, `ActionLink`, `Button` e o
  `VoiceHelpButton` existente, sem nova abstração de rodapé ou dependência.
- Ação principal na largura disponível; última linha com ação secundária discreta
  à esquerda e assistente independente à direita.
- Trilha concluída: “Ir para o canal oficial” e “Consultar uma dúvida”.
- Lição: “Próxima etapa” e “Consultar uma dúvida”. Destino original da API mantido,
  inclusive quando a última etapa leva à prática. O contexto de prática preserva
  “Voltar à prática”, sem forçar avanço.
- Consulta rápida: “Voltar”, com ícone de retorno e botão secundário padrão; sem repetir
  o botão de consulta. Destino e parâmetros de `returnTo` preservados.
- Acionador amarelo com conversa (`MessageCircle`) e texto visível “Assistente”.
  Abertura do mesmo Drawer, sem iniciar gravação; microfone interno, Eletriquinho,
  sugestões, reconhecimento e reprodução de áudio preservados.
- Grade, dimensões compartilhadas e áreas seguras evitam sobreposição. Só o miolo
  rola; os caminhos no fim do conteúdo continuam acessíveis.

Nenhuma mudança no sistema de pontuação, persistência, regras de conclusão,
contratos de API ou lógica interna do assistente. O componente compartilhado já
aceita ações distintas como filhos; a mudança de layout foi feita no CSS existente.

## Verificação

Em 18/10/2026, navegador com API Python local:

- `bun run lint` aprovado, sem avisos. `bun run build` aprovado com Turbopack,
  incluindo a checagem TypeScript.
- Trilha concluída, ambas as lições e consulta rápida conferidas no fluxo real.
  Navegação “Consultar uma dúvida” → consulta → lição 1 → “Próxima etapa” →
  lição 2 → consulta → “Voltar” executada com os parâmetros existentes.
  Destino da última lição para a prática e retorno à prática com `origem`
  também conferidos, sem mudar a função `returnTo`.
- Layouts em 320×812, 375×812 e 414×896; áreas de toque com pelo menos 44px,
  acionador de 96×60px e sem interseção com os controles inferiores. Em 320px,
  “Consultar uma dúvida” pode ocupar duas linhas e o rodapé cresce. Sem excesso
  de largura. Na lição longa, a rolagem revela os caminhos no fim do conteúdo.
- Assistente aberto por clique e por Enter; fechamento pelo botão e por Escape.
  Foco devolvido a “Abrir assistente”. Drawer mantém Eletriquinho, sugestões e
  controle “Gravar áudio” em repouso (“Toque no microfone para falar.”), sem
  iniciar gravação ao abrir.
- Verificação adicional da barra compartilhada: prática guiada com uma resposta
  real e faixa de feedback, “Continuar” e assistente sem sobreposição. Tentativa
  encerrada pelo botão “Sair da prática”. Home sem barra de ações mantém acesso
  ao assistente.
- Diff: hooks de áudio, host do assistente, microfone interno, navegação, progresso,
  dependências e lockfile sem alterações. Nenhuma chamada à Groq nesta validação.

Capturas locais em `output/playwright/rodape-trilha-375.png`,
`rodape-consulta-320.png`, `rodape-consulta-375.png`, `rodape-licao-320.png`,
`rodape-licao-414.png`, `rodape-licao-fim-conteudo.png` e
`rodape-feedback-pratica-375.png` (todos no mesmo diretório).

Limites: gravação/reprodução reais e áreas seguras em aparelho físico não foram
revalidadas. O microfone interno foi conferido na interface e permaneceu sem
alterações no código. Não foram criadas suítes nem infraestrutura de testes.

## Atualização: Eletriquinho no acionador (18/10/2026)

O ícone de conversa da entrega original foi substituído pelo componente SVG
`Eletriquinho` já utilizado na aplicação, sem alteração do mascote nem novos assets.
É decorativo (`aria-hidden`), proporcional e usa 32px pelo token `--spacing-lg`.
Mantém o humor padrão do componente. O texto “Assistente” continua abaixo e o
botão mantém 96×60px, cores, tipografia, posição e eventos. O nome acessível passou
a “Abrir Assistente Digitaliza Aí”. Nenhuma alteração no Drawer ou na lógica de voz.

Verificação desta atualização:

- `bun run lint` e `bun run build` aprovados (Turbopack e TypeScript).
- Navegador em 320×812 e 375×812: botão mantém 96×60px, mascote 32×32px,
  `viewBox` quadrado original, sem recorte ou excesso de largura; texto visível.
- Abertura e fechamento conferidos: mesmo Drawer, sugestões, Eletriquinho interno
  e “Gravar áudio” em repouso. Foco volta a “Abrir Assistente Digitaliza Aí”.
- Nenhum asset, dependência, evento ou lógica de áudio alterado. Capturas em
  `output/playwright/assistente-eletriquinho-320.png` e
  `output/playwright/assistente-eletriquinho-375.png`.
- Áudio e captura em aparelho físico não foram revalidados nesta troca visual.

## Arquivos da refatoração dos rodapés

Atualização de 18/10/2026: a pedido do usuário, “Voltar” na consulta rápida passou
de `ghost`/`sm` para `secondary` no tamanho padrão, com a mesma borda, superfície
e relevo dos outros botões secundários. Ícone, destino e parâmetros mantidos.
Lint e build aprovados; navegador em 320×812 conferido sem sobreposição com o
assistente nem excesso de largura. Captura em
`output/playwright/consulta-voltar-padronizado-320.png`.

Também a pedido do usuário, “Consultar uma dúvida” no mapa e nas lições usa
`secondary` no tamanho padrão, com a mesma superfície, borda e relevo de “Voltar”.
Destinos, parâmetros, posição na segunda linha e espaço do assistente preservados.
Lint e build aprovados; mapa e lição conferidos em 320×812 sem corte ou sobreposição.
Capturas em `output/playwright/consulta-botao-trilha-320.png` e
`output/playwright/consulta-botao-licao-320.png`.

- Layout: `src/components/layout/journey.module.css` e `journey-page.tsx`.
- Acionador: `src/components/voice/voice-help-button.tsx` e `src/app/globals.css`.
- Telas: `src/app/servicos/segunda-via/_components/track-roadmap.tsx`,
  `_components/step-lesson.tsx` e `etapas/page.tsx`.
- Documentação: esta spec, `docs/specs/README.md`,
  `docs/structure/styling-and-ui.md` e `docs/structure/visual-direction.md`.
