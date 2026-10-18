# Drawer de ajuda por voz com contexto por página

**Estado:** implementado; verificações abaixo registradas em 17/10/2026.

## Resultado e limites

Refinamento de altura em 17/10/2026: Drawer ajustado ao conteúdo, sem altura fixa
de viewport que criava espaço vazio entre sugestões e microfone. Mantém o limite
de altura e rolagem central. Lint e build aprovados; abertura real conferida no Edge.

O acesso global “Assistente” abre um Drawer inferior responsivo. O conteúdo
começa com a descrição direcionada pela página e suas sugestões. O microfone
permanece no rodapé em todas as etapas. Durante captura/envio, a área de opções
mostra o estado da conversa; ao terminar, apresenta o texto. O fluxo permite revisar a transcrição e confirmar
o texto. Uma sugestão só navega depois de mostrar sua confirmação e receber toque
em “Continuar”. A interpretação inicial posterior está em [LLM](voice-interpretation.md); o registro abaixo preserva a evidência da primeira entrega.

Esta entrega original não incluía LLM; foi ampliada pela [spec de interpretação](voice-interpretation.md). Resposta falada, serviço oficial e execução de tarefas continuam fora. A prévia de desenvolvimento e seus componentes exclusivos
foram removidos a pedido do usuário em 17/10/2026. A validação segue o fluxo real,
incrementalmente. Registros de prévia abaixo são evidências históricas, não escopo vigente.

## Contrato por tela

Cada tela fornece um `VoicePageContext` serializável: identificador estável,
descrição breve e até três sugestões. Cada sugestão contém identificador, rótulo,
texto da confirmação e destino interno. O contexto vive na página ou em módulo
local do segmento; não existe catálogo compartilhado de telas nem inferência de
contexto pelo pathname. Leitura de `searchParams` fica em composição server-side
sob `Suspense`, preservando parâmetros de origem e etapa nos destinos.

| Tela | Sugestões declaradas |
| --- | --- |
| Início | Aprender e praticar; consultar etapa; informar dificuldade |
| Preparação | Começar explicação; consultar etapa |
| Explicação geral | Prática guiada; consultar etapa |
| Práticas guiada e individual | Consultar explicação da etapa; voltar ao início |
| Conferência | Explicação de conferência; voltar à prática |
| Conclusão | Consultar etapa; repetir prática; abrir página interna do canal |
| Lista de etapas | Encontrar serviço; conferir resultado |
| Explicação de uma etapa | Praticar essa etapa; escolher outra etapa |
| Dificuldades | Consultar “encontrar”; consultar “conferir” |
| Canal | Retornar ao contexto de origem; consultar etapas |
| Outros serviços indisponíveis | Voltar ao início |
| Página não encontrada | Consultar etapas; voltar ao início |

## Ciclo de vida

- Abrir não solicita o microfone. Gesto para baixo, botão “Fechar”, Escape e fundo
  fecham o Drawer; o foco volta ao acionador.
- Permissão, gravação e envio ficam controlados pelo hook fora do conteúdo do portal.
- Fechar invalida callbacks tardios, encerra tracks, aborta envio e remove o arquivo
  de retry. A permissão tardia não pode reiniciar a gravação.
- A última transcrição concluída e a etapa estável permanecem em memória na mesma
  tela. Reabrir durante captura/envio retorna à revisão anterior, quando houver
  transcrição, ou ao início. Uma nova transcrição substitui a anterior só após êxito.
- Mudança de tela/contexto reinicia a sessão; não há armazenamento persistente.

## Aceite

- [x] Drawer modal com handle, limite de altura, scroll interno e safe area.
- [x] Botão de fechamento disponível durante captura/envio; Escape, gesto e fundo.
- [x] Contexto local nas telas da jornada, placeholders de serviço e página 404.
- [x] Sugestão exige confirmação e navega para destino interno declarado.
- [x] Captura real chama o contrato STT existente; revisão, nova gravação e cancelamento.
- Prévia de estados futuros removida; não deve ser desenvolvida ou recriada sem novo pedido.
- [x] `bun run lint` e `bun run build` aprovados.
- [x] Microsoft Edge em viewport mobile de 390×844: Drawer abriu sem solicitar microfone; fechamento pelo botão, Escape, fundo e gesto para baixo; foco retornou ao acionador.
- [x] Edge no viewport desktop padrão: abertura, contexto da tela, confirmação, navegação e fechamento.
- [x] Refinamento responsivo em 17/10/2026: cabeçalho alinhado à esquerda,
  sem rótulo da página, handle visível e ações das etapas em largura completa.
  Conferidos início em 820×740 e confirmação em 390×844 no build de produção local.
- [x] Controle de áudio persistente no rodapé; botão com ícone, gravação/parar,
  contador, processamento e cancelamento. Descrição inicial fornecida pela página.
- [x] Nome da página removido do contexto e do cabeçalho do Drawer.
- [x] Refinamento conferido em 820×740 e 390×844; `bun run lint` e `bun run build` aprovados.
- [x] Sugestões de início e tela de etapas; confirmação antes de navegar; query `origem` e `etapa` preservadas no destino.
- [x] Os oito cenários da prévia mostraram seus títulos; a opção de áudio indisponível permaneceu desativada.
- [x] Build de produção serviu `/` com HTTP 200 e `/dev/assistente-voz` com HTTP 404.
- Motion coordena transições e resposta visual do botão; AnalyserNode lê o mesmo
  stream do gravador para o espectro de frequência. Não há waveform sintética na
  experiência real. Verificação física do espectro e envio real à Groq continuam
  pendentes; os itens históricos acima não comprovam essa nova visualização.
- Verificação desta revisão: lint e build aprovados. Conferidos no Edge, em
  390×844 e 820×740, abertura, seleção e confirmação com o rodapé persistente.
  A prévia ganhou fases de captura simuladas, sem abrir microfone ou enviar áudio;
  sua verificação visual completa requer reiniciar o servidor de desenvolvimento,
  que manteve módulos e CSS antigos em memória durante esta sessão.

Atualização do acionador em 17/10/2026: rótulo “Assistente”, fixo no canto inferior
direito do AppShell com posicionamento absoluto, sem reserva de espaço exclusiva
ao final da jornada e com respeito à área segura. O Drawer se identifica como “Assistente
Digitaliza Aí”. Lint e build aprovados; esta alteração ainda não foi conferida
visualmente em aparelho físico.

Os padrões de manutenção estão em [UI](../structure/styling-and-ui.md),
[arquitetura](../structure/architecture.md) e [pastas](../structure/src-structure-and-conventions.md).
