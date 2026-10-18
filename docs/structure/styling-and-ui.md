# Componentes de UI e acessibilidade

Guia vigente, conferido no código em **17/10/2026**. Primitivas visuais ficam em
`src/components/ui`; composições compartilhadas ficam em `src/components/layout`
e `src/components/voice`, enquanto a prática exclusiva fica junto à rota. Tokens em
[design system](design-system.md); instalação e atualizações em [shadcn](shadcn-ui.md).

Rodapés e acionador externo do assistente revistos em **18/10/2026**;
escopo e evidências em [rodapés e assistente](../specs/rodapes-assistente.md).

## Camadas e consumidores

| Componente | Local | Responsabilidade |
| --- | --- | --- |
| Button | `components/ui/button.tsx` | Ações com Base UI e variantes CVA |
| ActionLink | `components/ui/action-link.tsx` | Navegação Next com aparência de botão |
| Card e suas partes | `components/ui/card.tsx` | Agrupamento informativo |
| Header, AppShell, JourneyPage, Eyebrow, JourneyCard | `components/layout/` | Estrutura e composição compartilhada das telas |
| VoiceHelpButton, VoiceHelp, AudioRecorder e etapas do assistente | `components/voice/` | Drawer, contexto recebido da página, captura e revisão |
| VoiceAudioDock / VoiceConversation / indicação de transcrição | `components/voice/` | Rodapé de áudio, transições do conteúdo e indicação discreta do texto ouvido |
| PracticeChoice | `app/servicos/segunda-via/_components/` | Interação exclusiva da prática |

Usar imports explícitos e `cn` de `@/lib/utils`; não recriar Button/Card em pastas
de rota. Primitivas não importam servidor. Não adicionar `use client` a componentes
puramente visuais; Base UI mantém suas fronteiras, e hooks/interações locais
ficam nos consumidores que precisam delas.

O Drawer de voz usa largura responsiva limitada à largura da aplicação e altura
conforme o conteúdo, limitada a `min(90dvh, 760px)`. A área central encolhe e rola
quando necessário; cabeçalho e rodapé não encolhem. Não forçar altura mínima de
viewport nem distribuir espaço vazio entre as opções e o microfone.
As sugestões internas ocupam toda a largura útil do painel,
mesmo com o limite padrão de largura dos demais botões. Os controles das etapas
também usam essa largura; o fechamento mantém tamanho compacto no cabeçalho.
O cabeçalho mostra “Assistente Digitaliza Aí” e o botão de fechar. O indicador de
arraste pertence ao popup, fora do cabeçalho.

## Button e ActionLink

`Button` usa `@base-ui/react/button`, com props nativas da primitiva, ref,
`className`, `variant`, `size` e `loading`. O tipo padrão é `button`.
`loading` desabilita a ação, marca `aria-busy` e mostra spinner decorativo,
preservando o texto. Manter estados disabled e loading sem callbacks acionáveis.

`ActionLink` usa `next/link`, `buttonVariants`, `variant` e `size`. Navegação deve
continuar sendo link; não usar Base UI Button renderizado como âncora, pois sua
semântica continua sendo de botão.

| Variante | Uso e apresentação |
| --- | --- |
| `primary` / `default` | Mesma receita: branco com texto azul; hover azul/texto branco |
| `secondary` / `outline` | Receita atual equivalente, mantendo a distinção no contrato |
| `ghost` | Fundo e borda transparentes |
| `link` | Fundo/borda transparentes, texto sublinhado |
| `destructive` | Texto de erro, hover vermelho |

| Tamanho | Comportamento atual |
| --- | --- |
| `default` | Altura mínima 52px; largura de referência até 350px fora da jornada |
| `xs`, `sm` | Altura mínima 44px e padding compacto |
| `lg` | Altura mínima 60px |
| `icon`, `icon-xs`, `icon-sm`, `icon-lg` | Atualmente todos com largura de 52px e mínimo de altura herdado de 52px |
| `recording` | Largura total, raio 8px, padding 12×16px e peso 600 |
| `recording-secondary` | Largura total, raio 8px, margem superior 8px e peso 400 |

Botões comuns têm raio pill; na jornada ocupam a largura disponível, com texto
16px/24px e peso 500. Hover aplica-se a apontador fino com suporte a hover.
Não interpretar um nome de variante/tamanho como garantia de estilo ainda não
implementado; conferir a receita antes de ampliar seu significado.

## Cards e conteúdo

`Card` substitui o antigo InfoCard e mantém superfície azul clara, padding 16px,
gap 8px e raio 8px. É informativo, sem papel de botão ou clique implícito.
Partes disponíveis: CardHeader, CardTitle, CardDescription, CardContent,
CardAction e CardFooter. `CardTitle` renderiza `h2`; CardDescription renderiza `p`.

`JourneyCard` combina Header/Title/Content, preservando a semântica e os estilos
da jornada. Um título de card não substitui o `h1` da página. Conteúdo longo
precisa quebrar e expandir sem altura fixa ou truncamento de orientação.

<a id="header-e-composicao-da-pagina"></a>

## Header e composição da página

`Header` é um elemento `header` com props HTML e `className`. Renderiza o logotipo
oficial da Equatorial à esquerda, junto de “MA” em amarelo; o nome Maranhão fica
disponível para tecnologia assistiva. Esse grupo é um link para
`https://www.equatorialenergia.com.br/`, em nova aba (um toque sem querer não tira a
pessoa da prática; “abre em nova aba” fica para leitores de tela), com área de toque de pelo
menos 44px de altura e foco visível. “Digitaliza Aí” fica no centro e leva ao início;
o atalho “Serviços” fica à direita, oculto na home. O cabeçalho permanece
sticky em todas as rotas pelo `AppShell` do layout raiz, ocupa a largura da aplicação,
sem margem, borda ou raio, e respeita a área segura. O foco no conteúdo considera
sua altura.

| Propriedade | Implementação atual |
| --- | --- |
| Montagem | Uma vez no AppShell, usado pelo layout raiz em todas as rotas |
| Comportamento | `position: sticky`, no topo e abaixo do Drawer modal |
| Superfície | Fundo azul na largura da aplicação, sem margem, borda ou raio; padding lateral de 16px |
| Dimensões | Mínimo 60px mais área segura; limitado pelo AppShell de até 648px |
| Marca | Logotipo oficial branco em `next/image`, com `alt="Equatorial Energia"`, e MA amarelo à esquerda; Digitaliza Aí em destaque no centro |
| Tipografia | Fonte da aplicação; marca central pelos tokens de `.site-header-brand`, MA em 0.75rem com peso bold |
| Organização | Grid em três colunas (`1fr auto 1fr`), mantendo o título centralizado mesmo sem o atalho da direita |

A Eyebrow fica fora do Header e pertence à tela. `JourneyPage` contém um `main`
focável, Eyebrow, `h1`, introdução, conteúdo, ações e voz. `AppShell` mantém o
cabeçalho e o alvo de pular conteúdo `#conteudo`. O shell é centralizado, limitado
a `--app-content-max-width` (648px), e tem `height: 100dvh`.
Só o miolo rola, com respiro inferior para acessar o fim do conteúdo.
O CSS Module `journey.module.css` mantém a composição, separada
das receitas globais. Não usar dimensões da captura do Figma como largura mínima
rígida ou desenhar uma moldura de celular na página.

`JourneyPage` mantém a barra inferior `#journey-actions`; páginas usam `actions`
ou o portal `PageActions` existente. A barra usa grid: as ações anteriores à última
ocupam as duas colunas; a última ocupa a coluna esquerda, reservando a direita
ao acionador independente do assistente. O último botão tem altura mínima igual
à do acionador; textos podem aumentar a linha sem sobreposição. Padding inferior
e laterais respeitam as áreas seguras. Sem ações, a barra fica oculta.

Nas trilhas e lições, a ação principal mantém `primary` e a secundária
“Consultar uma dúvida” usa `secondary` no tamanho padrão. Na consulta rápida, “Voltar” usa
`secondary`, no tamanho padrão e com `ArrowLeft`, preservando `returnTo`.
A lição mantém o destino de
avanço da API com o rótulo “Próxima etapa”; o contexto de prática continua oferecendo
“Voltar à prática”. Não criar outro rodapé nem outro estado para compor essas ações.

## Voz e captura

`VoiceHelpButton` reutiliza Button; acionador amarelo compacto com o componente
`Eletriquinho` original em 32px (token `--spacing-lg`) e texto visível “Assistente”,
dispostos em coluna. Mantém sombra e raio da
aplicação. As dimensões ficam no shell: largura pelo token `--spacing-6xl` (96px)
e altura de 60px, compartilhadas com a reserva da barra de ações. O nome acessível
“Abrir Assistente Digitaliza Aí” inclui o texto visível; o SVG decorativo usa `aria-hidden`.
Somente o acionador externo usa o mascote: o botão interno de gravar mantém `Mic`,
parar mantém `Square` e carregamento mantém `LoaderCircle`.
O controle usa `position: absolute` no canto inferior direito do AppShell, que
define o contêiner relativo. Usa `--spacing-sm` na lateral e `--spacing-xs` na base,
somados às áreas seguras. Fica alinhado à última linha do rodapé; a reserva de coluna
impede que cubra ações. Continua disponível nas telas sem barra de ações.
O acionador fica abaixo da camada modal e mantém o contexto fornecido pela página.

`VoiceHelp` coordena o Drawer Base UI em `components/ui/drawer.tsx`. O Drawer é
modal, inferior e limitado a 90dvh; o conteúdo rola dentro dele e respeita a área
segura do aparelho. Gesto para baixo, botão visível, Escape e toque no fundo fecham
a superfície. O foco retorna ao acionador; abrir não pede microfone. O CSS local
preserva tokens e aparência do produto. Não substituir suas classes e variantes
personalizadas ao atualizar a primitiva pelo CLI.

`VoiceAudioDock` permanece no rodapé, fora da área que rola, em todas as etapas.
O botão amarelo usa o ícone de microfone; durante captura vira parar, com contador
e espectro real. Durante permissão/envio fica indisponível, com Cancelar acessível.
Título e descrição do conteúdo mudam conforme a etapa; a abertura usa o contexto
declarado pela página e não exibe seu nome.

`VoiceConversation` usa [Motion](https://motion.dev/docs/react-animate-presence) para
trocar o conteúdo com fade e deslocamento curto. Respeitar movimento reduzido,
preservar foco e não animar o ciclo de vida do microfone nem substituir os gestos
do Drawer Base UI. O rodapé não é desmontado nas transições.

`useAudioSpectrum` observa o mesmo `MediaStream` exposto por `useSpeechToText`.
Usa `AnalyserNode` e canvas, até 30 quadros/s (12 com movimento reduzido), com
bandas de frequência e intensidade real alimentando o botão via MotionValue.
Não pedir outro microfone nem conectar à saída de som. Liberar frames,
ResizeObserver, nós e AudioContext ao parar/fechar; tracks pertencem ao hook de
captura. Falha na visualização não interrompe a gravação. Sem áudio, não inventar
barras animadas. Validar o fluxo real, sem página de prévia ou cenários simulados.

Cada página declara um `VoicePageContext` serializável com `id`, descrição e até
três sugestões. O contexto não inclui o título da página. Cada sugestão declara
rótulo, confirmação e destino interno.
Páginas com query params compõem `VoiceHelp` em um slot dentro de `Suspense`, junto
da própria leitura dos parâmetros. O assistente não infere conteúdo pelo pathname. O manifesto de segunda via compõe descritores declarados junto às páginas. Contextos e destinos devem reutilizar os
auxiliares de navegação existentes e preservar origem/etapa.

O fluxo vai de captura/transcrição diretamente à interpretação. “Você disse…”
aparece discretamente, sem tela ou botão para revisar texto. Escolhas claras por
botão ou voz navegam direto; ambiguidade oferece opções, e sair de uma tela de
prática pede confirmação porque pode interromper a atividade. O microfone continua
disponível para corrigir a fala e cancela interpretação anterior ao gravar.
TTS fica para entrega futura. Ver [contrato e ciclo LLM](voice-interpretation.md).

`useSpeechToText` permanece montado fora do portal descartável. Fechar durante
permissão/captura/envio invalida a tentativa, para tracks, aborta o envio e apaga
o áudio de retry; autorização tardia não retoma o microfone. A última transcrição
concluída, a resposta e seus botões são preservados ao fechar/reabrir na mesma página.
Navegação ou mudança dos parâmetros de contexto cancela operações e limpa toda a
conversa. Ao abrir no destino, mostrar as sugestões da nova tela. Não há botão para
reiniciar: uma fala nova pode mudar o assunto normalmente. Fechar também aborta a LLM. Não há persistência local; recarregar limpa
as informações. Ver o contrato vigente do assistente para os estados de retomada.

`AudioRecorder` apresenta somente o conteúdo da conversa durante permissão,
captura, envio e erro/retry. Sugestões dão lugar ao processamento e depois à
interpretação com transcrição discreta; não há transcrição parcial durante a gravação.
O controle de gravar outra mensagem permanece no rodapé. Texto transcrito
vai para região viva e erro usa `role=alert`; não inserir resposta como HTML.
Ciclo de vida e contrato: [HTTP/estado](http-and-queries.md) e [STT](../../../docs/stt/STT-API.md).

Registros de escopo e aceite desta entrega estão em [specs do assistente de voz](../specs/voice-assistant-drawer.md).

## Acessibilidade e manutenção

Preservar foco visível, ordem de teclado, nomes funcionais, link de pular conteúdo,
idioma pt-BR, crescimento de texto e movimento reduzido. Cor de gravação tem
texto de apoio. Conferir layout mobile e desktop, estados do componente e conteúdo
longo conforme a mudança, seguindo [execução](build-and-run.md). A biblioteca não
substitui a verificação de acessibilidade da composição final.

Origens e verificações datadas: [componentes iniciais](../specs/ui-components.md)
e [Header inicial](../specs/header.md). Esses registros são históricos; este guia
é a referência para novos consumidores e alterações.
