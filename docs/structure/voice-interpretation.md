# Assistente conversacional de navegação

Referência vigente em 17/10/2026. Escopo e evidências em
[specs](../specs/voice-interpretation.md). Substitui o contrato inicial de classificação
somente das sugestões da página, conforme DEC-EQT-026, fluxo simplificado pela DEC-EQT-027 e memória por página pela DEC-EQT-029 no registro central.

## Fontes de contexto

O navegador consulta o Python diretamente, com as operações React Query existentes:
GET /tracks e GET /tracks/segunda-via. O cache é compartilhado com as páginas.
O catálogo fornece nomes/status, objetivo e resumos das etapas; não se importa o
JSON bruto do backend nem gabarito, respostas corretas ou dados de tentativas.
Não há novo endpoint Python nem proxy Next para consultas de domínio.

Cada tela de segunda via tem um descritor em seu `_lib/voice-target.ts`, incluindo
ID único, finalidade e destino. O `_lib/voice-journey.ts` da trilha compõe esses
descritores; `lib/assistant/journey.ts` combina o manifesto com o catálogo e as
sugestões locais. Não descobrir telas varrendo URLs nem importar componentes de
páginas no assistente. Declarar novas capacidades explicitamente.

VoicePageContext continua serializável e declarado pela página: id, description,
até três suggestions e `tip` (dica mostrada no balão do Eletriquinho). VoiceHelp registra
esse contexto no provider; não cria outra sessão nem outro Drawer. Sugestões
locais recebem o ID canônico do destino e preservam rótulos/href de retorno.
Os descritores são usados para reconhecer o contexto pelos IDs declarados, não
para deduzir conteúdo a partir do pathname.

A jornada mapeia (DEC-EQT-037) escolha do canal, mapa do WhatsApp, demonstração,
as 4 partes da etapa 2 e a conversa inteira (`segunda-via.canal`, `.whatsapp`,
`.demonstracao`, `.parte.{menu,documento,fatura,conferir}`, `.simulacao`). O catálogo
vem de `GET /tracks` e do pacote único já em cache.
Todas permitem acesso direto com uma escolha clara. Abrir conclusão não conclui uma
tentativa, atribui progresso ou comprova aprendizagem. Os exercícios atuais são
de escolha, não um jogo de ordenar passos. A saída oficial é o WhatsApp da Clara, aberto pela conclusão da etapa 3.
O assistente recebe somente o serviço disponível e implementada de segunda via. Outras entradas do backend não são anunciadas, nem há promessas de recursos futuros.

A composição considera os auxiliares existentes de origem/etapa e o navigation
explicitamente fornecido. IDs locais encontrar/conferir correspondem a
Encontrar o serviço/Conferir o resultado, cujo backend usa encontrar-servico e
conferir-resultado. O assistente não passa aliases para endpoints Python.

## Sessão e interface

QueryProvider → VoiceAssistantProvider → AppShell → VoiceAssistantHost persistente.
VoiceHelp nas páginas/slots Suspense apenas publica o contexto. O host mantém
microfone, interpretação, última transcrição, último resultado, ação pendente,
ordem das opções e até seis turnos completos em memória na mesma página.

Áudio → STT → interpretação automática → resposta ou navegação. A transcrição fica
em “Você disse…” discreto, em até duas linhas, sem revisão obrigatória. O microfone
permanece disponível para gravar outra mensagem. Nova gravação cancela a LLM anterior.
Botões e pedidos claros navegam diretamente. Ambiguidade apresenta opções; escolher
uma delas basta. Confirmação adicional só aparece ao sair de prática guiada,
individual ou conferência para outra tela, pois a atividade pode ser interrompida.
Este é um guard conservador por tela, não uma leitura de tentativa Python. No
handoff de prática real, deve ser conectado ao estado efetivo da atividade.
Nesse caso, botão ou fala “pode sair” confirma somente o destino pendente; rejeitar
ou mudar de assunto não executa o destino anterior. Não há efeitos de prática.
O usuário pode referir-se às últimas opções por posição. As opções mantêm a ordem
retornada; a listagem de serviços usa a ordem do catálogo recebido.

O Drawer mantém o microfone no rodapé, Motion e espectro. Exibe a última interação,
sem histórico longo. Respostas informativas e esclarecimentos mostram somente a mensagem seguida dos botões pertinentes, sem título genérico, textos intercalados ou botão auxiliar abaixo. A listagem menciona apenas o que pode ser acessado agora. O texto de apresentação do catálogo é normalizado pelo servidor, evitando promessas de funcionalidades futuras. A resposta
é texto React, nunca HTML. Respostas didáticas, execução de exercício
ou emissão de conta real não existem. Perguntas de procedimento encaminham às explicações.

Fechar aborta captura/envio/interpretação, descarta áudio/retry e invalida callbacks
tardios. Na mesma página, preserva texto, resposta, botões e estado estável. Reabrir
retoma essa visão, sem substituir as opções por uma mensagem de navegação.

Navegar para outra página ou mudar parâmetros do contexto cancela operações e limpa
histórico, transcrição, resposta, opções e ação pendente. O primeiro acesso ao
assistente no destino mostra a descrição e as sugestões dessa nova tela. Não há
mensagem sintética “Você abriu…”, histórico entre páginas ou botão “Nova conversa”.
O usuário pode mudar de assunto falando normalmente; a memória curta só ajuda a
interpretar referências como “a primeira” dentro da página atual. Recarregar também
limpa a sessão. Não há localStorage, cookies de conversa nem banco de histórico.

Catálogo carrega ao usar o assistente; GETs compartilham cache. Loading usa Skeleton,
erro oferece retry e sugestões locais conhecidas, sem inventar disponibilidade.
O mapa amplo depende do resumo da trilha; sugestões locais continuam como fallback
quando a consulta falha. Status indisponível recebido retira ações da trilha.
Antes de navegar, a ação é resolvida de novo no mapa atual e o href é validado.

## POST /api/interpret

Mesma origem; application/json, X-Digitaliza-Client: web. Fetch Metadata externo
é recusado. Não é autenticação nem controle de cota contra clientes HTTP diretos.

Entrada estrita em `lib/assistant/schemas.ts`:

- text: transcrição concluída, até 4.000 caracteres;
- context: ID/descrição da página e até três sugestões projetadas sem href;
- catalog: estado ready/loading/error, resumos de trilhas e resumo de segunda via;
- actions: até 32 ações, com id, label, confirmation e description, sem URLs;
- history: até seis turnos {user, assistant};
- pendingActionId: ID pendente ou null;
- presentedOptionIds: até três IDs na ordem visual mais recente.

Corpo máximo 65.536 bytes, conferido durante leitura do stream. O cliente remove
os turnos mais antigos se necessário para respeitar o limite em bytes UTF-8. Não
há resposta local automática por ausência de sugestões: perguntas informativas
podem ser interpretadas mesmo sem opções navegáveis da página.

Resposta estrita:

```json
{
  "type": "proposal",
  "message": "Você quer abrir a explicação geral?",
  "showCatalog": false,
  "optionIds": [],
  "actionId": "segunda-via.explicacao"
}
```

| type | Uso |
| --- | --- |
| information | Listar serviços ou descrever possibilidades; showCatalog permite lista construída com os dados reais |
| clarification | Esclarecer com uma a três opções |
| proposal | Reconhecer uma escolha clara; o cliente navega, ou pede confirmação se interromper prática |
| confirmation | Confirmar exatamente pendingActionId |
| cancellation | Recusar/cancelar a ação pendente |
| out_of_scope | Explicar limites e oferecer caminhos permitidos |

proposal/confirmation têm actionId não nulo e nenhuma optionId. Os demais têm
actionId null. cancellation não tem opções. showCatalog só vale com information.
IDs retornados devem pertencer a actions; a confirmação deve corresponder à ação
pendente. Falha de estrutura, IDs, cardinalidade, recusa ou truncamento é erro,
sem navegação. O modelo não conhece href; o cliente resolve IDs no mapa atual.
Um href externo, protocol-relative, com controle ou barra invertida é recusado.

Erros: {error:{code,message}}, no-store. 400 entrada inválida, 403 origem/header,
413 limite, 415 tipo, 429 cota, 499 cancelado, 502 provedor/resposta inválida,
503 configuração e 504 timeout. Retry é explícito. Histórico não usa React Query.

## Provedor e manutenção

GROQ_API_KEY permanece privada e compartilhada com STT. GROQ_LLM_MODEL opcional,
padrão openai/gpt-oss-20b, alternativa openai/gpt-oss-120b. Endpoint fixo Groq
chat/completions; JSON Schema strict, enum de IDs e validação adicional com Zod.
Temperature 0, reasoning_effort low, teto 1.024 tokens; timeout provedor 25s,
cliente 35s. Sem streaming ou ferramentas. O contrato STT não mudou.

Textos/contexto/histórico são dados não confiáveis; não autorizam operações Python.
O prompt restringe o modelo à navegação. Essa restrição semântica não é garantia
absoluta sobre o texto gerado; as ações continuam limitadas pelo contrato e pelo
código. Não registrar chave, áudio, transcrição ou payloads em logs. O MVP ainda
não tem autenticação nem rate limiter próprio.

Fontes oficiais consultadas em 17/10/2026:
[Structured Outputs](https://console.groq.com/docs/structured-outputs) e
[modelo](https://console.groq.com/docs/model/openai/gpt-oss-20b).

## Limite de uso (429) e modelos alternativos

`src/server/model-fallback.ts` envolve as chamadas Groq de STT e LLM. Ao receber 429, tenta
o próximo modelo da cadeia (cada modelo tem cota própria no free tier); outros erros não
disparam troca. O modelo limitado entra em cooldown em memória pelo `Retry-After` (5 s a
10 min, padrão 60 s). Se todos falharem, o 429 final e o `Retry-After` chegam ao client.

- LLM: `GROQ_LLM_MODEL` primeiro, depois `openai/gpt-oss-20b` → `openai/gpt-oss-120b` →
  `qwen/qwen3.8-27b`. Todos suportam JSON Schema estrito; Qwen usa `reasoning_effort: "none"`.
- STT: `GROQ_STT_MODEL` primeiro, depois o outro Whisper (`whisper-large-v3-turbo` /
  `whisper-large-v3`).
- Cooldown vale por processo (reinício ou instância serverless nova o zera).
- Limites e IDs conferidos na documentação da Groq em 2026-10-17; podem mudar.

## Respostas em voz (TTS nativo)

`hooks/use-speech-synthesis.ts` usa `speechSynthesis` (pt-BR; prefere voz local pt-BR, depois
qualquer `pt`). A Groq não tem TTS em português, então não há rota nem chave. O host fala
respostas que não navegam (informação, esclarecimento, cancelamento, fora de escopo) e a
pergunta de confirmação do guard; propostas que navegam não são faladas. O botão de
alto-falante no cabeçalho liga/desliga (padrão ligado, só em memória). A fala é cancelada ao
fechar, navegar, iniciar nova gravação ou desligar. `prime()` roda no toque do microfone para
liberar a fala assíncrona no iOS. Sem suporte do navegador, o botão não aparece.

## Política de navegação (DEC-EQT-033)

Pedido claro vai direto (`proposal`), de qualquer tela. Só não navega quando:
- é amplo ou tem vários destinos plausíveis → `clarification` (2–3 opções);
- a fala está confusa, mas há um destino provável → `confirmation_request`
  (“Você quis dizer…?”, Sim + até 2 alternativas);
- está fora do escopo → `out_of_scope` com o que dá para fazer e até 2 opções;
- já está na tela pedida → `information`.

“Sim”/“não” curtos com ação pendente são resolvidos no servidor (`quickReply`), sem LLM.
O guard de interrupção da prática continua determinístico no app.

### Prompt e custo

O prompt foi reduzido (~6.000 → ~2.600 caracteres) com exemplos curtos, e a entrada do
modelo é compactada em `compactInput` (ações como “id | rótulo | descrição”, sem textos de
confirmação; histórico só com tipo/ação/opções). As descrições dos alvos de voz
(`_lib/voice-target.ts`) trazem as palavras que as pessoas usam (fatura, mês, código de
barras, site não abre). `gpt-oss` roda com `reasoning_effort: "medium"` (~1–1,5 s por
resposta), que acertou pedidos como “identificar o mês da fatura” → lição de conferir.

## "Nada disso", contexto do backend e guard real (mega revisão)

- **"Nada disso, quero outra coisa"** aparece em toda lista de opções (boas-vindas, resposta,
  confirmação). Guarda as opções exibidas em `rejectedOptionIds` (só na página atual) e já abre o
  microfone pedindo outras palavras. A LLM não pode reapresentá-las; o servidor também as remove
  de `optionIds`/`actionId` e, se nada sobrar, responde `information` com franqueza.
- **Contexto:** `context.practice` (modo, pergunta atual/total, sem gabarito) e
  `catalog.secondCopy.difficulties` (rótulos de `GET /difficulties`) entram no pedido.
- **Fora de escopo** nunca termina em “não posso”: explica o que dá para fazer e oferece até 2 opções.
- **Guard de interrupção:** usa `lib/practice/activity.ts`, publicado pela tela de prática. Só
  pergunta com tentativa em andamento e já respondida/ajudada; informa a pergunta atual e que a
  tentativa fica salva para retomar.
- **Pedido da própria tela:** não navega (evita apagar a conversa); responde que já está nela.

## Assistente contextual e compacto (DEC-EQT-038)

- **Contexto:** `VoicePageContext.screen` (`stage`, `part`, `teaches`) declarado por página e
  `PracticeActivity` (`lib/practice/activity.ts`) publicado pela demonstração e pela prática
  com `stepTitle`, `prompt` (fala da Clara), `hint` e `lesson`. O campo `expected` (rótulo da
  opção certa) fica só no navegador.
- **Contrato:** `context.screen`, `context.practice` ampliado, dificuldades com `guidance` e o
  tipo de resultado `help` (até 2 `optionIds`, `actionId` nulo).
- **Guardas no host:** `withoutAnswer` troca a fala pela dica se citar a opção esperada; chips
  que levariam à própria tela são removidos.
- **Prompt:** jornada de 3 etapas, mensagens de até ~160 caracteres, `help` para dúvidas da
  tela/lição, fala hesitante sempre como `confirmation_request`, `segunda-via.conclusao` só
  para “fazer de verdade”.
- **UI:** balão curto (`VoiceStep`), `VoiceChips`, `VoiceYesNo`, link “Nada disso”, atalho
  “Me explica esta tela” / “Me dá uma dica”; folha até 62dvh.
