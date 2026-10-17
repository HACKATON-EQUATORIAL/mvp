# Arquitetura do Digitaliza Aí

O MVP Digitaliza Aí usa um único projeto Next.js para frontend e API. STT é a primeira capacidade implementada, com evolução de produto registrada no DECISIONS central. Client e servidor têm responsabilidades distintas dentro desse projeto, permitindo desenvolver o contrato da API e a tela separadamente.

```text
Páginas explícitas → JourneyPage → ações semânticas + VoiceHelp
VoiceHelp → monta/desmonta AudioRecorder
AudioRecorder → useSpeechToText → requestTranscription
POST /api/transcribe → handleTranscription → readAudioForm + schemas
                                        → getGroqEnv → transcribeAudio → Groq
```

- `app` organiza URLs, layout raiz e implementação específica de cada rota. Páginas são Server Components por padrão.
- `components/layout` contém shell, composição compartilhada de tela e `JourneyCard`.
- `components/voice` contém acesso ao gravador, controles e painel de transcrição.
- `hooks/use-speech-to-text.ts` coordena MediaRecorder, ciclo de vida, cancelamento e envio.
- `lib/stt` contém contratos públicos e auxiliares client de captura e transporte.
- `app/servicos/segunda-via` contém páginas explícitas, conteúdo estático, contexto de retorno validado com Zod e interação local de prática.
- `app/servicos/_components` contém a apresentação comum dos placeholders.
- `app/api/transcribe/_lib` processa a requisição e limita multipart. Usa `server-only`.
- `server/stt` adapta a Groq e define o erro usado pelo servidor, também com `server-only`.
- `server/env.ts` valida a configuração privada sob demanda.

A rota conhece o handler; o handler conhece validação e provedor. O provedor não conhece React nem a rota Next. O frontend não importa módulos de servidor. Imports diretos deixam essas fronteiras visíveis, sem barrel misturando client e servidor.

Não há LLM, interpretação de intenção, navegação automática, TTS, banco ou autenticação. Esses recursos exigem decisões próprias antes de ampliar o escopo.

O Next.js admite colocação e organização por funcionalidade. O código usado por várias rotas fica fora de `app`; o código exclusivo permanece junto ao segmento. O underscore é uma convenção de roteamento; `server-only` é a proteção de importação. Ver [mapa e regras](src-structure-and-conventions.md).

`VoiceHelp` mantém apenas abertura/fechamento e foco. Uma chave de pathname e a chave da etapa contextual separam as sessões de captura. A desmontagem executa o cleanup já existente no hook. As origens de retorno são identificadores de uma lista fechada; URLs arbitrárias são rejeitadas. Não há progresso global ou persistência local.

Primitivas visuais reutilizáveis vivem em `components/ui` (shadcn com Base UI). `JourneyCard` é compartilhado entre a home e a jornada em `components/layout`; `PracticeChoice` continua exclusivo da segunda via. `lib/utils.ts` expõe `cn`; os módulos públicos de UI não importam servidor. [Contrato da fundação](shadcn-ui.md).
