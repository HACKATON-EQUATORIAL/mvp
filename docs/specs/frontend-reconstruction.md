# SPEC — Reconstrução do frontend com telas provisórias

**Leitura atual:** esta spec preserva o planejamento e os registros da entrega. Para manter tokens, componentes e biblioteca, usar [design system](../structure/design-system.md), [UI](../structure/styling-and-ui.md) e [shadcn](../structure/shadcn-ui.md). Propostas de estrutura e caminhos do checkout original abaixo não substituem esses guias.

O fluxo do assistente de voz foi ampliado depois desta reconstrução; ver o escopo e aceite vigentes em [Drawer com contexto por página](voice-assistant-drawer.md). As descrições de acesso ao gravador nesta spec são históricas.

Local atual: `mvp/docs/specs`, desde 17/10/2026. Caminhos `src/` e comandos referem-se à raiz de `mvp`. Notas de indisponibilidade de `docs` descrevem o ambiente da execução original; ver [índice e contexto](../README.md).

| Campo | Valor |
| --- | --- |
| Status | Código executado; aceite parcial — limitações de verificação na seção 13 |
| Versão | 0.2 |
| Data | 2026-10-17 |
| Produto | Digitaliza Aí — orientação e prática provisórias de segunda via |
| Referência principal | [Figma · 03 / Telas provisórias · 4:24](https://www.figma.com/design/S8I4KGRBr6zFCIqHIpkt2A/Hackathon--c%C3%B3pia-?node-id=4-24&m=dev) |
| Referência de percurso | [Figma · Fluxos por intenção · 4:23](https://www.figma.com/design/S8I4KGRBr6zFCIqHIpkt2A/Hackathon--c%C3%B3pia-?node-id=4-23&m=dev) |
| Fundação existente | [Tokens CSS](../structure/design-system.md), [componentes](../structure/styling-and-ui.md) e [Header](../structure/styling-and-ui.md) |
| Protótipo nevegável | https://www.figma.com/design/S8I4KGRBr6zFCIqHIpkt2A/Hackathon--c%C3%B3pia-?node-id=6-560&p=f&m=dev |


## 1. Resultado esperado e limites

Reconstruir o frontend para percorrer as telas provisórias de orientação,
consulta e prática do Figma, reutilizando a fundação visual já construída.
Preservar `AudioRecorder`, seu hook, transporte e contrato STT. Integrar
`VoiceHelpButton` apenas como acesso explícito a esse gravador.

O resultado futuro será um protótipo navegável de frontend com prática local
demonstrativa e uma capacidade real já existente: gravar e transcrever áudio.
As telas não representam operação oficial, procedimento confirmado, avaliação
de autonomia ou aprendizagem comprovada.

Incluído na execução desta spec:

- S01–S09 e S11–S12 como telas provisórias navegáveis, com conteúdo estático e
  interações locais de demonstração delimitadas na seção 4.
- Header, Eyebrow, títulos, cards, ações e acesso ao gravador em composição comum.
- Revisão de rotas, apresentação, conteúdo e estado para reduzir acoplamento e
  permitir acrescentar telas sem reescrever o gravador ou a fundação visual.
- Adaptações de texto onde o Figma promete áudio ou operação ainda indisponível.

Ficam fora S10 como recuperação de intenção por voz e os estados A01–A06 do
assistente de áudio. Não implementar conversação, interpretação por LLM, TTS,
comandos por voz, navegação automática a partir da transcrição, autenticação,
histórico persistente, avaliação pedagógica ou integração com canal oficial.
Erros reais de gravação/transcrição continuam no `AudioRecorder`, sem levar a S10.

As seções 1–12 registram o planejamento original. A implementação e as
evidências desta execução estão na seção 13; suas limitações impedem declarar
aceite integral de captura. Os termos
**DEVE**, **NÃO DEVE** e **PODE** expressam requisito, proibição e opção.

## 2. Evidências e diferenças em relação ao checkout

Foram consultados contexto estruturado e screenshot do quadro `4:24`, além do
mapa `4:23`. S04, S08, S09 e S12 receberam consulta individual com screenshot.
Os IDs da seção 3 vêm da hierarquia retornada pelo Figma. A tabela de transições
da seção 4 é uma proposta baseada no mapa e nos rótulos: não foi verificado o
grafo de interações da página separada “02 / Protótipo navegável”.

O próprio quadro descreve segunda via como candidata e informa que o canal e o
procedimento real precisam ser confirmados. A frase do design “sem áudio
funcional” refere-se àquele protótipo; neste repositório há STT implementado.
Isso não torna funcional o assistente idealizado no Figma.

| Situação atual conferida | Consequência para a reconstrução |
| --- | --- |
| `/` compõe `ServiceList` e `AudioRecorder` | A home passará a representar S01; o gravador continua disponível pelo acesso de voz |
| Quatro URLs `/servicos/*` mostram apenas título e retorno | Segunda via ganha a jornada; os outros três placeholders devem continuar acessíveis |
| `Header` já está no layout raiz | Manter uma única montagem; unificar seu contêiner com o novo corpo da página |
| `Button`, `VoiceHelpButton` e `InfoCard` existem, sem consumidores nas telas | Compor e complementar somente os contratos necessários; existência não comprova aceite visual completo |
| `Button` tem hover branco, mas não variante secundária | Criar variante outline explícita; hover não representa um segundo tipo de ação |
| Navegação atual usa `next/link` | Preservar links para mudar de URL; não transformar todo link em botão com `router.push` |
| `AudioRecorder` encapsula `useSpeechToText` | Preservar essa fronteira e montar uma única instância por tela |
| CSS global contém tokens, receitas e estilos transitórios misturados | Conservar a fundação e isolar estilos novos de composição para evitar efeitos entre telas |
| Eyebrow foi informada como criada, mas não foi encontrada neste checkout | Localizar e reutilizar a implementação ou referência existente antes da composição; não criar duplicata silenciosamente |

## 3. Inventário das telas

Os códigos Sxx servem para rastrear o design, não para nomear componentes
públicos ou URLs. Todas as telas usam a mesma identidade e oferecem navegação
manual. A consulta de uma etapa não depende de terminar a trilha.

| Tela / nó no Figma | Título observado | Papel no recorte |
| --- | --- | --- |
| S01 · `6:289` | Como podemos ajudar? | Entrada por intenção, com Eyebrow “SEGUNDA VIA” |
| S02 · `6:311` | Aprenda a obter outra via da conta | Preparação, treino seguro e liberdade de ritmo |
| S03 · `6:334` | Entenda o caminho | Visão geral: encontrar o serviço e conferir o resultado |
| S04 · `6:357` | Vamos praticar | Escolha guiada entre “Segunda via” e “Consultar débitos” |
| S05 · `6:380` | Confira o resultado | Conferência ilustrativa da conta de exemplo |
| S06 · `6:403` | Agora, tente você | Escolha local sem dica automática; ajuda continua disponível |
| S07 · `6:425` | Prática concluída | Encerramento demonstrativo e próximos caminhos |
| S08 · `6:448` | Qual parte você quer consultar? | Acesso direto às etapas ou à dificuldade de acesso |
| S09 · `6:470` | Ajuda para esta etapa | Explicação contextual, com retorno à origem |
| S10 · `6:493` | Vamos continuar de outro jeito | Referência adiada do assistente; nenhuma rota ou transição neste recorte |
| S11 · `6:516` | Onde você encontrou dificuldade? | Diferenciar dúvida sobre o procedimento de limite externo |
| S12 · `6:538` | Continuar no canal oficial | Limite demonstrativo de saída; destino ainda não confirmado |

S09 é uma apresentação reutilizada para pelo menos duas etapas: `encontrar`
e `conferir`. O Figma mostra a explicação de encontrar o serviço. O conteúdo de
conferência será adaptação editorial provisória baseada em S05, identificada
como tal no registro de implementação; não afirmar que foi observado em S09.

## 4. Navegação e interações provisórias

### 4.1 Percursos principais

```text
Aprender:   S01 → S02 → S03 → S04 → S05 → S06 → S07 → S12
Consultar: S01 → S08 → S09 → voltar à origem / praticar / S12
Dificuldade: S01 → S11 → S08 / S03 / orientação de limite externo
Voz: qualquer tela incluída → abrir AudioRecorder → fechar na mesma tela
```

As alternativas, retornos e o canal de saída fazem parte do percurso. Não criar
um wizard obrigatório, cadastro ou desbloqueio de consulta por progresso.

### 4.2 Contrato das ações

| Origem | Ação | Destino ou comportamento proposto |
| --- | --- | --- |
| S01 | Aprender e praticar | S02 |
| S01 | Consultar uma etapa | S08 |
| S01 | Tentei e não consegui | S11 |
| S01 | Já sei: ir ao canal | S12, ainda interna ao protótipo |
| S02 | Começar explicação / Prefiro consultar uma etapa / Voltar | S03 / S08 / S01 |
| S03 | Praticar agora / Voltar | S04 / S02 |
| S03 | Ouvir esta explicação | Substituir por “Ler explicação”, com acesso ao conteúdo textual; não acionar gravador nem TTS |
| S04 | Segunda via | S05, após seleção explícita no exemplo |
| S04 | Consultar débitos | Feedback local: “Neste exemplo, procure Segunda via”; permanecer na tela |
| S04 | Ver uma dica | Exibir ou focar a dica textual da tela, sem áudio |
| S04 | Sair da prática | S01 |
| S05 | Entendi, quero tentar / Preciso de uma explicação / Voltar à prática | S06 / S09 `conferir` / S04 |
| S06 | Segunda via | S07, como conclusão da simulação reduzida |
| S06 | Consultar débitos | Feedback local neutro; manter escolha disponível, sem pontuação ou penalidade |
| S06 | Pedir ajuda / Sair da prática | S09 `encontrar` / S01 |
| S07 | Conhecer o próximo passo / Praticar novamente / Consultar uma etapa | S12 / S04 / S08 |
| S08 | Como encontrar segunda via / Como conferir o resultado | S09 `encontrar` / S09 `conferir` |
| S08 | Não consegui acessar o canal / Quero aprender desde o início | S11 / S02 |
| S08 | Voltar / Ir ao canal oficial | Origem válida ou S01 / S12 |
| S09 | Voltar à etapa | Origem e etapa preservadas; fallback S08 |
| S09 | Escolher outra etapa / Praticar esta etapa / Ir ao canal oficial | S08 / S04 para `encontrar`, S05 para `conferir` / S12 |
| S09 | Falar com o assistente | Remover a ação duplicada nesta fase; manter somente o acesso comum de voz e explicar seu limite |
| S11 | Não sei qual opção escolher / Não entendi o procedimento | S08 / S03 |
| S11 | Código ou página não funciona | Revelar orientação textual de limite na própria tela; não diagnosticar ou simular correção do canal |
| S11 | Voltar | Origem válida ou S01 |
| S12 | Voltar à orientação / Voltar ao início | Origem válida ou S08 / S01 |
| Todas as incluídas | Ajuda por voz | Abrir/fechar o gravador da seção 6, sem navegar |

S04 e S06 têm ações de seleção, portanto usam botões. A maior parte das outras
ações muda de tela, portanto usa links com aparência de ação. Feedback local
de escolha deve usar texto e uma região de status discreta; não depender só de cor.

### 4.3 Conteúdo honesto e limites da simulação

- Na S01, adaptar a promessa de ouvir explicações para, por exemplo:
  “Escolha o que você precisa agora. Leia as orientações e pratique no seu ritmo.”
- Na S09, trocar o card “Explicação em áudio” por “Explicação desta etapa”, com
  orientação escrita. Não prometer resposta do assistente ou reprodução.
- Na S07, explicitar que a prática demonstrativa foi concluída. Uma escolha de
  serviço não comprova execução de toda a tarefa, autonomia ou domínio aprendido.
- Na S12, adaptar “Você vai sair…” para indicar que o destino está a confirmar.
  Manter “Voltar à orientação” e “Voltar ao início”. Não adicionar botão ativo
  de abertura externa, URL suposta ou redirecionamento automático.
- Identificar a prática como exemplo, sem coletar CPF, número de cliente,
  credenciais, conta real ou documento oficial. Não gerar boleto ou pagamento.
- Notas de bastidor, códigos Sxx e instruções para designers ficam fora da UI.
  Os avisos de simulação e os limites necessários à decisão do usuário permanecem.

## 5. Rotas, contexto e estado

### 5.1 URLs semânticas propostas

| URL | Tela |
| --- | --- |
| `/` | S01 |
| `/servicos/segunda-via` | S02, evoluindo o placeholder atual |
| `/servicos/segunda-via/explicacao` | S03 |
| `/servicos/segunda-via/pratica/guiada` | S04 |
| `/servicos/segunda-via/pratica/conferencia` | S05 |
| `/servicos/segunda-via/pratica/individual` | S06 |
| `/servicos/segunda-via/pratica/concluida` | S07 |
| `/servicos/segunda-via/etapas` | S08 |
| `/servicos/segunda-via/etapas/[etapa]` | S09: somente `encontrar` ou `conferir` |
| `/servicos/segunda-via/dificuldades` | S11 |
| `/servicos/segunda-via/canal` | S12 |

Não criar uma rota genérica `/[screen]` ou um único componente com um grande
switch de S01–S12. Páginas explícitas fazem a composição; conteúdo e regras
locais podem ser compartilhados sem expor códigos de design na URL.

As URLs de consultar débitos, falta de energia e tarifa social permanecem como
placeholders, com retorno à home. Não redirecioná-las para escolhas do treino,
pois “Consultar débitos” na S04/S06 é uma opção do exemplo, não o serviço real.
Retirar `ServiceList` da S01 não autoriza apagar essas rotas nem ampliar sua função.

### 5.2 Origem e retorno

Usar contexto pequeno e explícito: identificador de origem e, quando necessário,
etapa. Exemplo: `?origem=pratica-individual&etapa=encontrar`. As origens são uma
lista fechada mapeada para caminhos internos; não aceitar uma URL arbitrária de
retorno, usar `window.history.back()` como único retorno ou transportar o contexto
de origem em um caminho não validado.

Ao abrir consulta, carregar a origem através de S08 → S09 e de S09 → S12,
sem substituí-la pela última página intermediária. Não formar ciclos de retorno.
Entradas diretas e parâmetros ausentes/inválidos usam os fallbacks da seção 4;
uma etapa desconhecida recebe not-found. Na S09, o segmento `[etapa]` define a
etapa; não deixar uma query conflitante substituí-lo. Validar `params` e `searchParams`
externos com schemas Zod e derivar seus tipos desses schemas.

O retorno preserva a tela e a etapa, sem prometer restauração de gravações,
transcrições ou feedback efêmero de escolha. Links devem preservar a query
necessária; nunca incluir áudio, texto transcrito ou informações pessoais na URL.
Recarregar ou entrar diretamente em S05/S07 renderiza uma tela demonstrativa,
sem inventar uma tentativa concluída ou uma sessão avaliada.

### 5.3 Estado por responsabilidade

| Estado | Dono | Duração |
| --- | --- | --- |
| Tela, etapa e retorno permitido | App Router e auxiliares locais de navegação | URL |
| Dica, seleção e feedback de prática | Pequeno componente client da prática | Memória da tela; pode reiniciar ao sair |
| Acesso ao gravador aberto/fechado | `VoiceHelp` | Tela atual |
| Captura, envio, erro, retry e transcrição | `AudioRecorder` → `useSpeechToText` | Instância montada do gravador |
| Conteúdo provisório e rótulos | Módulos locais de conteúdo | Estático |

Não duplicar a fase STT em estado da jornada. Não criar store global, contexto
de progresso, cache de transcrição, localStorage, banco ou máquina de estados
para orquestrar este protótipo. Novas necessidades concretas podem motivar uma
evolução posterior, sem antecipar infraestrutura nesta entrega.

## 6. Integração mínima de voz e preservação do AudioRecorder

### 6.1 Composição proposta

Criar `VoiceHelp` como pequena fronteira client que compõe `VoiceHelpButton` e
`AudioRecorder`. O botão visual continua sem conhecer captura, rede ou etapas.
O novo wrapper controla apenas abertura, fechamento e foco.

Fluxo mínimo:

1. A tela monta `VoiceHelpButton`; isso não pede microfone nem chama a API.
2. Clique abre uma região expansível na própria página e monta `AudioRecorder`.
3. A região informa: “Disponível agora: gravar e transcrever. O texto não executa
   ações nem gera orientações automaticamente.” O usuário escolhe “Gravar áudio”.
4. O gravador mantém gravar, parar e transcrever, cancelar, retry e resultado.
5. Fechar desmonta o gravador e devolve o foco ao botão. Reabrir começa uma
   sessão nova; avisar na região que fechar descarta a gravação/transcrição local.

Não usar drawer, modal, nova rota de assistente, overlay ou gravação automática
neste recorte. A região pode expandir o documento e exigir rolagem normal.
`aria-expanded` e `aria-controls` pertencem ao botão; a região tem nome acessível.
Ao abrir, tornar a região perceptível e focar seu título ou primeiro controle
adequado. Ao fechar, restaurar foco via ref compatível ou referência local ao
botão nativo, sem acrescentar uma API genérica de controle STT.

Montar no máximo um `VoiceHelp`/`AudioRecorder` por página. A instância deve
encerrar ao mudar de rota, inclusive nas navegações entre etapas que reutilizam
o mesmo componente. Não colocá-la em layout persistente sem mecanismo de reset;
usar chave da rota/etapa ou fronteira de montagem que garanta o cleanup.

### 6.2 Comportamentos que devem permanecer

- Preservar a implementação funcional de `AudioRecorder`, `useSpeechToText`,
  `recording.ts`, `transcribe-client.ts` e o endpoint `/api/transcribe`.
- Alterar somente os pontos de composição/apresentação necessários à integração.
  Não exigir reescrever o hook ou migrar os botões internos para entregar o wrapper.
- Manter as fases `idle`, `requesting`, `recording`, `transcribing`, `success`
  e `error`, bloqueio de cliques duplicados, cancelamento e retry explícito.
- Ao fechar, desmontar ou sair da rota: liberar tracks e timers, abortar envio
  ativo e invalidar respostas/permissões tardias. Não apenas ocultar via CSS.
- Cancelar enquanto a permissão está pendente deve continuar seguro; se o
  navegador conceder acesso depois, os tracks recebidos são encerrados.
- Preservar o tratamento de visibilidade: prompt de permissão mobile pode
  ocultar temporariamente a página; não reescrever essa regra no wrapper.
- Manter limites de 60 segundos e 4.000.000 bytes e os timeouts existentes.
  O client continua enviando o header público do contrato para a API local,
  validando a resposta e renderizando texto pelo React.
- Nenhum trecho transcrito seleciona serviço, responde pergunta ou altera rota.
  Erros continuam no gravador; não são uma confirmação de intenção ou S10.
- Não persistir áudio/texto, registrá-los em logs ou expor a chave Groq.

## 7. Arquitetura e organização propostas

### 7.1 Avaliação da estrutura atual

O problema atual é a responsabilidade concentrada na home e nos estilos
transitórios, não uma impossibilidade do App Router. Manter colocação junto
às rotas e ampliar as fronteiras existentes atende ao recorte. Não é necessário
introduzir outra stack, uma pasta `features` global ou um framework de jornadas.

Quatro responsabilidades devem permanecer independentes:

| Responsabilidade | Pode conhecer | Não deve conhecer |
| --- | --- | --- |
| Elementos visuais (`Button`, `InfoCard`, `Header`, `VoiceHelpButton`) | Props, semântica e tokens | Etapas, URLs de serviço, MediaRecorder ou Groq |
| Composição de tela e rotas | Elementos visuais, conteúdo e navegação local | Detalhes do provedor STT |
| Interação local (prática e `VoiceHelp`) | Escolha/dica ou montagem do gravador | Interpretação de voz, estado global de outras telas |
| Capacidade STT existente | Hook, transporte e contrato público | Conteúdo da jornada e decisão de navegação |

`server` e a API preservam suas fronteiras `server-only`. Não exportar client e
servidor juntos em barrels. O underscore exclui pastas do roteamento, mas não
substitui a proteção de importação.

### 7.2 Organização mínima de referência

```text
src/app/
├── layout.tsx                         # Fonte, metadados base, skip link e shell
├── page.tsx                           # Composição S01
├── globals.css                        # Fundação, reset e receitas compartilhadas
├── _components/
│   ├── button.tsx                     # Base existente; evolução pontual
│   ├── info-card.tsx                  # Base existente, informativa
│   ├── voice-help-button.tsx          # Apresentação existente
│   ├── audio-recorder.tsx             # Gravador funcional preservado
│   ├── voice-help.tsx                 # Client: abertura, montagem e foco
│   ├── action-link.tsx                # Link semântico com receita visual de ação
│   └── layout/
│       ├── header/header.tsx          # Caminho atual mantido
│       ├── app-shell.tsx              # Contêiner e header compartilhados
│       └── journey-page.tsx           # Corpo e slots de conteúdo/ações/voz
├── _hooks/use-speech-to-text.ts       # Preservado
├── _lib/
│   ├── recording.ts                  # Preservado
│   └── transcribe-client.ts          # Preservado
├── servicos/
│   ├── _components/service-page.tsx  # Demais placeholders
│   ├── segunda-via/
│   │   ├── page.tsx                  # S02
│   │   ├── _components/              # Interações/composições exclusivas da jornada
│   │   ├── _lib/content.ts           # Conteúdo estático e etapas
│   │   ├── _lib/navigation.ts        # Contexto validado e retornos permitidos
│   │   ├── explicacao/page.tsx
│   │   ├── pratica/.../page.tsx      # Quatro rotas explícitas da tabela
│   │   ├── etapas/page.tsx
│   │   ├── etapas/[etapa]/page.tsx
│   │   ├── dificuldades/page.tsx
│   │   └── canal/page.tsx
│   └── demais serviços/              # URLs existentes preservadas
└── api/transcribe/...                # Sem mudança de contrato
```

O mapa ilustra responsabilidades e arquivos a criar conforme usados; não criar
pastas vazias. `AppShell` monta o `Header` uma única vez, fora do `main`.
`JourneyPage` compõe o `main`, introdução, conteúdo, ações e o slot de voz.
Slots React permitem variar o conteúdo sem ensinar ao shell o que é segunda via.
O shell não importa o hook de captura nem mantém estado de etapa.

Não mudar componentes já existentes para outra árvore por conveniência.
Preservar arquivos kebab-case, exports PascalCase e o caminho do Header aceito
pelo usuário. Um componente só ganha pasta própria quando houver arquivos
auxiliares reais. Não acrescentar barrels, factories ou renderização por JSON
para abstrair o JSX de onze telas.

Conteúdo exclusivo da jornada fica em `segunda-via/_lib`, mesmo quando consumido
pela S01. Separar texto/dados de handlers sem criar um CMS. Páginas seguem
Server Components; apenas feedback da prática e acesso ao gravador precisam
de fronteira client. Passar dados serializáveis, nunca handlers do servidor
para o client. Helpers puros de rotas não importam React nem o provedor.

### 7.3 Migração do layout e CSS

Unificar o alinhamento de header, conteúdo e ações. Hoje o header é limitado a
358px, o corpo a 648px e os paddings são diferentes. O shell deve controlar a
largura útil; a classe de composição pode ampliar o Header para 100%, conforme
o contrato fluido, sem recriar sua apresentação.

Manter tokens e receitas em `globals.css`. Colocar estilos específicos novos
em CSS Modules junto da composição, ou seletores explicitamente delimitados,
sem novos `h1`, `h2`, `button` ou `a` globais para representar uma tela.
Estilos do gravador devem continuar funcionando dentro da região expandida.
Remover CSS transitório só após migrar seu último consumidor, incluindo os
placeholders; não executar limpeza geral como parte da primeira etapa.

## 8. Reuso e extensões pontuais dos componentes

| Elemento | Contrato para esta reconstrução |
| --- | --- |
| `Header` | Reusar uma única instância, identidade estática e tokens; não voltar ao alias `SiteHeader` |
| Eyebrow | Reusar a referência existente, texto por tela e fora do Header; localizar antes de criar qualquer novo arquivo |
| `Button` | Continuar botão nativo; adicionar variante `secondary` explícita, mantendo `primary` como padrão e disabled/loading |
| `ActionLink` proposto | `next/link`, semântica de navegação e a mesma receita visual primary/secondary; sem aninhar botão ou introduzir `asChild` |
| `InfoCard` | Continuar informativo; título e corpo via composição, sem transformar a área inteira em controle |
| `VoiceHelpButton` | Reusar rótulo/ícone e apresentação amarela; receber somente eventos/atributos de abertura do wrapper |
| `AudioRecorder` | Preservar fluxo e estilos funcionais; não incorporar regras da jornada |

O Figma confirma botões secundários brancos com borda `--border-default` e texto
`--primary-500`. Esta spec amplia a anterior: eles são variantes independentes,
não o estado hover do primário. Compartilhar a receita visual entre Button e
ActionLink sem compartilhar a semântica; documentar estados de cada variante.

Ações observadas nas telas têm Roboto Medium, 16px/24px; o Button atual herda
texto sem aplicar essa receita. Propor Inter, peso 500 e 16px/24px na composição,
sem alterar silenciosamente a receita global de 14px/600 de outros consumidores.
Respeitar hover apenas em ponteiros adequados e foco visível também por teclado.

Na conferência de reuso, revisar a disposição do ícone de voz: atualmente SVG e
rótulo ficam dentro de um span da base. Garantir alinhamento horizontal, gap de
8px e ícone 24 × 24px. O SVG inline atual não foi comprovado como export fiel
do design; se houver divergência, exportar o asset correto localmente conforme
a consulta ao Figma. Não usar URL temporária em runtime.

S12 tem um card de fundo `--warning-50`. Esse aviso não transforma InfoCard em
alerta interativo nem autoriza uma biblioteca de variantes genéricas; aplicar
estilo específico da composição e manter semântica informativa.

## 9. Contrato visual e acessibilidade

### 9.1 Base observada e adaptações

- As telas do Figma usam frame de 390 × 900px, padding externo nominal de 16px,
  header de 358 × 60px, intervalo vertical de 12px, ações com gap de 8px e
  VoiceHelpButton de 184 × 52px alinhado à direita, abaixo das ações.
- A borda de 1px do frame faz aparecer x=17px e pode gerar diferenças no cálculo
  da largura útil. Não copiar coordenadas absolutas, altura fixa, recorte do
  frame ou uma moldura de celular para a página real.
- Proposta de aplicação: uma coluna fluida, padding de `--spacing-sm`, com
  máximo local de 648px em telas amplas. Esse máximo é adaptação de composição,
  não medida confirmada pelo Figma. Header, cards e ações acompanham a coluna.
- Usar `min-height: 100svh` no shell e crescimento flexível do corpo para
  aproximar ações do rodapé quando houver espaço. Conteúdo longo expande e rola
  naturalmente; não reservar espaços vazios com alturas de cada screenshot.
- Manter a voz no fluxo, após as ações, disponível em todas as telas incluídas.
  “Acesso persistente” significa presença recorrente no layout neste recorte;
  não introduzir botão fixed cobrindo conteúdo ou teclado virtual.
- Usar tokens canônicos para cores, espaços, raios, foco e movimento. Não usar
  aliases `--sm`, `--xs` ou `--full`, paleta paralela ou valores de legado.

Tipografia observada: Eyebrow 12px/17px, peso 500; título 26px/38px, peso 700;
introdução 17px/25px, peso 400; cards 16px/23px, título com peso 500. Propor
Inter já instalada, com medidas locais em rem e revisão visual. Não carregar
Roboto por consequência. Receitas existentes só são usadas quando atendem ao
papel; não forçar a escala de uma receita incompatível.

### 9.2 Regras de interação

Cada página tem um `main`, um `h1` e título de documento coerente. O skip link
existente aponta para um alvo único e focável apropriado. Hierarquia dos cards
segue a página. `MA` deve manter significado acessível sem depender só de hover.

Link navega; botão executa ação local. Alvos de ações têm mínimo de 52px e
crescem com rótulos longos. Nenhum conteúdo essencial é truncado. Foco deve ser
visível sem deslocamento, com contraste adequado. Feedback de escolha e erros
não usam apenas cor; respeitar os live regions já existentes do gravador sem
duplicar anúncios no wrapper.

Verificar 320, 375, 390, 414, 768 e 1280px, texto a 200%, teclado, toque e
movimento reduzido. Contraste mínimo de texto 4,5:1 e indicadores essenciais
3:1. A abertura de voz não deve ocultar as ações da tela ou prendê-las atrás
de uma camada. Não criar um controle aparentemente funcional para recurso adiado.

## 10. Execução em etapas verificáveis

1. **Fundação e pontos de composição:** conferir tokens, localizar Eyebrow,
   revisar variantes/links e asset do botão de voz; introduzir shell e
   composição de página usando S01/S02 como primeiro recorte visual.
2. **Orientação e consulta:** conteúdo e rotas de S03, S08, S09, S11 e S12,
   com origens validadas, retorno previsível e textos adaptados ao escopo.
3. **Prática provisória:** S04–S07, seleção/feedback local e caminhos de ajuda,
   sem dados reais, contagem de desempenho ou avaliação de autonomia.
4. **Acesso STT:** compor `VoiceHelp` com o gravador preservado em todas as
   telas incluídas; conferir cleanup, permissão tardia, foco e retomada da tela.
5. **Fechamento:** revisar rotas antigas, referências e CSS sem consumidor;
   atualizar somente a documentação afetada e registrar evidências reais.

Não publicar catálogos de componentes, rotas de preview ou S10 apenas para
preencher o mapa. A entrega final deste recorte inclui todas as telas previstas,
mesmo que a execução seja dividida em mudanças pequenas. Não declarar a spec
implementada enquanto faltarem percursos ou evidências obrigatórias.

Antes de codificar, ler a documentação pertinente da versão Next instalada,
inclusive limites server/client, navegação, params e colocação. A estrutura
proposta é evolução justificada pelo novo escopo, sem reescrever a API.

## 11. Aceite e verificação da execução futura

| Área | Evidência exigida |
| --- | --- |
| Fluxos | Percorrer aprender, consulta direta e dificuldades; todas as ações incluídas têm destino ou feedback definido |
| Retornos | Entrar diretamente em S09/S12, usar origem válida/inválida, avançar/voltar e conferir fallbacks e etapa correta |
| Prática | Confirmar escolha correta, alternativa incorreta, dica, pedir ajuda, sair e reiniciar; não alegar aprendizagem |
| Rotas existentes | Conferir as três URLs de serviços fora do treino e seus retornos |
| Design | Comparar telas com nós da seção 3 e registrar as adaptações de fonte, largura e conteúdo |
| Reuso | Conferir primary/secondary, ActionLink, ícone local, Header único e Eyebrow sem duplicação |
| Voz sem captura | Abrir e fechar sem solicitar permissão ou enviar requisição; manter a tela/etapa e restaurar foco |
| Voz com captura | Conferir permissão negada/tardia, gravar/parar, cancelar durante permissão/envio, retry e desmontagem ao fechar/navegar |
| Recursos | Confirmar tracks e upload encerrados; nenhuma instância de captura sobrevivendo oculta na navegação |
| Layout e acesso | Conferir viewports da seção 9, texto a 200%, foco, teclado, ausência de overflow e controles encobertos |
| Código | Executar `bun run lint` e `bun run build`; registrar saída e limitações reais, sem reutilizar falha antiga como resultado novo |

Não criar pasta de testes, suítes, scripts ou dependências de teste. Seguir o
[workflow do MVP](../../agent-workflow.md) com verificação manual proporcional.
Não automatizar chamadas à Groq; chamada manual real só quando necessária à
integração e com registro do que foi efetivamente conferido. Lint/build não
comprovam captura em Android/iPhone físicos ou transcrição real.

## 12. Pendências e registro desta spec

| Pendência | Tratamento |
| --- | --- |
| Eyebrow não localizada no checkout | Localizar implementação/referência antes de compor; reutilizar, conforme instrução do usuário | se não tiver criada, construa. ele parece ser pertecendo a header e depender da rota. Verifique no fluxo do figma.
| Canal e procedimento reais | Continuar provisório, sem abertura externa ou instruções apresentadas como oficiais |
| S09 de conferência | Escrever conteúdo provisório coerente com S05 e registrar adaptação |
| Diferenças dos componentes atuais | Corrigir somente os pontos da seção 8 necessários ao reuso |
| Semântica completa do assistente | Adiada; futura spec definirá A01–A06, S10 e integração de intenção/reprodução |
| Decisões centrais | Na execução, registrar mudanças relevantes em `../docs/DECISIONS.md` com `DEC-EQT-*` quando esse repositório estiver disponível |

O repositório central `../docs` não está disponível neste workspace. As escolhas
acima permanecem propostas desta spec; não foi criado DECISIONS paralelo.

Na elaboração original desta spec foram lidos o código da UI/STT, o layout, rotas, tokens,
specs existentes e os guias locais pertinentes. A consulta ao Figma confirmou
textos, composição das telas e percursos gerais. Foram conferidos os caminhos
e links locais da nova documentação. Não houve implementação de frontend,
migração de arquivos, alteração de API, execução de lint/build ou verificação
manual de novos fluxos nesta entrega documental.


## 13. Registro da execução — 2026-10-17

### Implementação entregue

- S01–S09 e S11–S12 em páginas explícitas, incluindo as duas apresentações de
  S09. Sem S10, assistente conversacional, TTS ou abertura de canal externo.
- `AppShell` alinha Header e corpo; `JourneyPage` compõe Eyebrow, título,
  conteúdo, ações e voz. A busca não localizou Eyebrow em `src`; foi criada a
  implementação única autorizada na seção 12, externa ao Header, com texto por tela.
- `Button` ganhou secondary e conteúdo horizontal; `ActionLink` compartilha a
  receita mantendo `next/link`. Ícone exportado do Figma em
  `public/icons/voice-help.svg`, com dimensões de 24 × 24px.
- Conteúdo de conferência na S09 é adaptação editorial provisória de S05,
  não texto observado no design de S09. A conta ilustrativa de S05 acrescenta
  período fictício e identificação “CONTA EXEMPLO”, sem cobrança ou dados reais.
- Inter, coluna externa de até 648px (616px úteis com padding padrão), ações
  de pelo menos 52px e expansão natural do documento. Essas são as adaptações
  tipográfica e de composição previstas, sem moldura de celular ou altura fixa.
- Estado de dica/feedback restrito à prática; origens e etapas validadas com
  Zod. A origem inicial acompanha consulta e saída. O segmento da etapa prevalece
  sobre query conflitante; etapas desconhecidas renderizam not-found.
- `VoiceHelp` monta somente um gravador na região aberta, restaura foco ao
  fechar e usa chave de pathname; a página contextual tem chave da etapa.
  `AudioRecorder`, hook, captura, transporte, API e contrato STT não foram alterados.
- As três URLs de serviços fora da jornada permanecem como placeholders, com
  aviso de indisponibilidade e retorno. Catálogo/CSS transitórios sem consumidor
  foram removidos após a migração.

### Ajustes de integração confirmados

A regra preexistente do Turbopack transformava todo `*.css` em CSS comum,
invalidando os exports de classes dos novos CSS Modules. A regra agora exclui
`*.module.css`; a verificação no navegador confirmou as classes e o layout.

Com Cache Components, somente as ações que leem `searchParams` aguardam
Suspense. As duas etapas conhecidas usam `generateStaticParams`. Conteúdo e
Header não dependem da resolução da origem de retorno.

O Next preserva páginas anteriores ocultas durante navegação. Por isso, o alvo
focável `#conteudo` fica uma única vez no shell, envolvendo o conteúdo das páginas.
Os `main` pertencem às páginas, sem duplicar esse ID. Botões de escolha não
mantêm um bloqueio permanente de saída, permitindo retornar e repetir a prática.

### Evidências efetivamente conferidas

Verificação manual com Chrome controlado pelo Playwright CLI, sobre
`bun run build` + `bun run start` local, sem suíte, scripts ou dependências de
teste e sem chamadas ao provedor:

| Área | Resultado observado |
| --- | --- |
| Código | `bun run lint`: 50 arquivos, sem correções; `bun run build`: sucesso, com todas as rotas previstas |
| Percurso de aprendizagem | Home → preparação → explicação → guiada → conferência → individual → encerramento; dica, feedback alternativo, ajuda e retorno conferidos |
| Repetição | Voltar do navegador após escolha correta mantém botões habilitados; saída e acesso à prática novamente disponíveis |
| Consulta | Ajuda de encontrar e conferir; retorno à prática correta; origem preservada em S08 → S09 → S12 |
| Fallbacks | Origem externa inválida não vira destino; query `etapa=encontrar` não substitui segmento `conferir`; entrada direta em S12 retorna à consulta; etapa desconhecida mostra not-found |
| Dificuldades | Orientação local se expande; acesso à consulta conserva origem; nenhum diagnóstico ou tentativa de corrigir canal real |
| Canal | Aviso warning-50 conferido no estilo computado; nenhum link externo ativo |
| Serviços antigos | As três URLs renderizaram seus títulos, aviso e link de retorno à home |
| Voz sem captura | Abrir focou o título e montou um gravador; fechar restaurou o foco e removeu o gravador; navegação removeu também a instância da página anterior; nenhum pedido a `/api/transcribe` |
| Voz com captura | Estado de permissão pendente e Cancelar → inicial; Chrome chegou a “Gravando” e Cancelar encerrou o estado; fechar removeu o gravador; zero envios à API. Isso não comprova hardware físico |
| Layout | Home conferida em 320, 375, 390, 414, 768 e 1280px, sem overflow horizontal; header e conteúdo alinhados no desktop; menor ação medida com 52px |
| Ampliação e teclado | Texto a 200% em 320px expandiu header e ações sem overflow; Tab/Enter no skip link focaram `#conteudo`, com alvo único mesmo após navegação; dica e região de voz receberam foco |
| Movimento e toque | Modo reduced-motion ativado: transição computada de 0s; toque emulado em “Sair da prática” navegou à home. Não equivale a touchscreen físico |
| Contraste textual | Cálculo WCAG com os tokens: ação azul 16,22:1, identidade branca no header 12,96:1, voz 14,97:1, corpo 11,20:1 e muted 7,81:1. Não representa auditoria completa de todos os estados |

Screenshots locais desta execução ficam em `output/playwright/reconstruction-*.png`.
A comparação visual usou o quadro `4:24` e os contextos individuais dos nós da
seção 3. Textos que prometiam áudio, aprendizagem ou saída oficial foram
adaptados conforme esta spec. Resultados anteriores à correção do loader não
servem como evidência do layout final.

### Limitações e pendências de aceite

- Não foi feita transcrição real, chamada à Groq, avaliação pedagógica ou
  validação em Android/iPhone físicos. Não foi comprovado o encerramento físico
  de tracks nem o comportamento de captura no aparelho do usuário.
- Negação de permissão não foi comprovada: a tentativa de configurar a negação
  pelo protocolo do navegador não produziu um estado negado estável. Não conta
  como verificação aprovada. Permissão tardia concedida, parar/enviar, cancelar
  upload e retry continuam pendentes de verificação específica desta composição.
- O cleanup de tracks, timers, upload e respostas tardias foi revisado no hook
  preservado; revisão de código não substitui esses cenários manuais.
- A matriz de larguras e ampliação foi conferida na composição comum/home e
  telas de fluxo foram inspecionadas em 390px; não foi realizada a matriz completa
  de todas as telas × larguras, nem verificação em touchscreen físico.
- Canal e procedimento reais continuam a confirmar. `../docs` permanece ausente;
  não foi possível registrar um DEC-EQT central, e não foi criado DECISIONS paralelo.

O código do recorte está entregue, com aceite parcial de verificação. As pendências
acima devem ser conferidas antes de declarar a spec integralmente validada.


## 14. Ajuste de cores solicitado pelo usuário — 2026-10-17

Regra vigente: os botões habilitados e links de ação têm fundo branco,
texto azul e borda neutra por padrão. No hover com ponteiro adequado, fundo e
borda azuis, com texto branco. Inclui primary/secondary e controles do gravador.
Conforme correção posterior do usuário, “Ajuda por voz” permanece amarelo, com
texto e ícone pretos, inclusive no hover. Disabled/loading
mantêm a apresentação de indisponibilidade e o foco continua visível.

A regra substitui as cores de botões da referência original e os registros
visuais da seção 13. Tokens de paleta, Header e cards não mudaram.

Verificação desta alteração: `bun run lint` e `bun run build` passaram.
Na primeira conferência no Chrome, os estilos computados confirmaram branco/azul
em repouso e azul/branco no hover em ActionLink, voz e botão de gravação. Esse
resultado de voz antecede a correção que restaurou o amarelo. Abrir/fechar o gravador não enviou
requisições à API; não houve captura nem chamada à Groq nesta conferência.
Screenshots: `output/playwright/buttons-white-default.png` e
`output/playwright/buttons-blue-hover.png`. As limitações de captura da seção 13
continuam válidas.


Conferência da correção de voz: lint e build passaram. No Chrome, “Ajuda por voz”
voltou a `#FFD700` com texto preto; na conferência de hover permaneceu amarelo,
com texto preto e sem filtro no ícone. Os demais botões mantiveram o branco
em repouso. Não houve captura nem requisição de transcrição nesta conferência.


## 15. CSS antigo no localhost:3000 — 2026-10-17

O usuário informou que o botão ainda aparecia branco em `http://localhost:3000/`.
A leitura do CSS servido por essa instância confirmou a versão anterior, sem
os tokens locais amarelos, enquanto o código e o build já continham a correção.
A conferência anterior havia usado outra instância, na porta 3001.

O servidor de desenvolvimento da pasta deste projeto foi reiniciado e seu cache
foi movido para backup em `/tmp`. Após recarregar a porta 3000, o estilo computado
da voz passou de branco para `rgb(255, 215, 0)`, com texto preto, mantendo os
demais botões brancos. Evidência: `output/playwright/voice-localhost3000-yellow.png`.
O servidor de desenvolvimento permaneceu disponível na porta 3000. Não houve
nova alteração de código, captura ou chamada à Groq; lint/build não foram
repetidos para esta atualização de cache.
