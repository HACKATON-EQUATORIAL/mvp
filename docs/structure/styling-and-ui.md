# Componentes de UI e acessibilidade

Guia vigente, conferido no código em **17/10/2026**. Primitivas visuais ficam em
`src/components/ui`; composições compartilhadas ficam em `src/components/layout`
e `src/components/voice`, enquanto a prática exclusiva fica junto à rota. Tokens em
[design system](design-system.md); instalação e atualizações em [shadcn](shadcn-ui.md).

## Camadas e consumidores

| Componente | Local | Responsabilidade |
| --- | --- | --- |
| Button | `components/ui/button.tsx` | Ações com Base UI e variantes CVA |
| ActionLink | `components/ui/action-link.tsx` | Navegação Next com aparência de botão |
| Card e suas partes | `components/ui/card.tsx` | Agrupamento informativo |
| Header, AppShell, JourneyPage, Eyebrow, JourneyCard | `components/layout/` | Estrutura e composição compartilhada das telas |
| VoiceHelpButton, VoiceHelp, AudioRecorder | `components/voice/` | Acesso opcional e apresentação da captura |
| RecordingControls / TranscriptionPanel | `components/voice/` | Controles de gravação e região de transcrição |
| PracticeChoice | `app/servicos/segunda-via/_components/` | Interação exclusiva da prática |

Usar imports explícitos e `cn` de `@/lib/utils`; não recriar Button/Card em pastas
de rota. Primitivas não importam servidor. Não adicionar `use client` a componentes
puramente visuais; Base UI mantém suas fronteiras, e hooks/interações locais
ficam nos consumidores que precisam delas.

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

`Header` é um elemento `header` estático, com props HTML e `className`. Renderiza
“Equatorial Energia” como texto e a sigla “MA”, com significado Maranhão disponível
para tecnologia assistiva. Não é logo, seletor de estado ou link. Não adicionar
navegação, fixed ou sticky sem um comportamento definido.

| Propriedade | Implementação atual |
| --- | --- |
| Montagem | Uma vez no AppShell, usado pelo layout raiz |
| Superfície | `--header-bg`, raio `--radius-full`, padding horizontal 16px |
| Dimensões | Mínimo 60px; standalone até 358px, mas AppShell estende à largura útil |
| Textos | Identidade branca, estado amarelo; fonte Inter |
| Tipografia | Identidade 19px / 1.421rem, estado 13px / 1.125rem, peso 700 |
| Organização | Flex, space-between, gap 8px; permitir quebra sem esconder conteúdo |

A Eyebrow fica fora do Header e pertence à tela. `JourneyPage` contém um `main`
focável, Eyebrow, `h1`, introdução, conteúdo, ações e voz. `AppShell` mantém o
cabeçalho e o alvo de pular conteúdo `#conteudo`; sua coluna tem até 648px,
padding 16px e gap 12px. O CSS Module `journey.module.css` mantém a composição,
separada das receitas globais. Não usar dimensões da captura do Figma como largura
mínima rígida ou desenhar uma moldura de celular na página.

## Voz e captura

`VoiceHelpButton` reutiliza Button; largura de referência 184px, mínimo 52px,
pill amarela, texto/ícone pretos, 16px/22px e peso 700. O ícone existente está em
`public/icons/voice-help.svg`, com 24×24px e alternativa vazia por ser decorativo.
Na jornada, o controle se alinha à direita.

`VoiceHelp` é uma região expansível. Abrir monta o gravador e leva o foco ao título;
fechar desmonta a sessão e devolve o foco ao acionador. Abrir não solicita microfone
nem transcreve automaticamente. Não há Drawer implantado nesta base.

`AudioRecorder` apresenta o estado do hook por `RecordingControls` e
`TranscriptionPanel`: início, permissão pendente, captura, envio, sucesso, erro e
retry. Usa Button com tamanhos de gravação; durante
permissão/envio, preservar Cancelar e impedir início duplicado. Texto transcrito
vai para região viva e erro usa `role=alert`; não inserir resposta como HTML.
Ciclo de vida e contrato: [HTTP/estado](http-and-queries.md) e [STT](../../../docs/stt/STT-API.md).

## Acessibilidade e manutenção

Preservar foco visível, ordem de teclado, nomes funcionais, link de pular conteúdo,
idioma pt-BR, crescimento de texto e movimento reduzido. Cor de gravação tem
texto de apoio. Conferir layout mobile e desktop, estados do componente e conteúdo
longo conforme a mudança, seguindo [execução](build-and-run.md). A biblioteca não
substitui a verificação de acessibilidade da composição final.

Origens e verificações datadas: [componentes iniciais](../specs/ui-components.md)
e [Header inicial](../specs/header.md). Esses registros são históricos; este guia
é a referência para novos consumidores e alterações.
