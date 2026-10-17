# Arquitetura do Digitaliza Aí

O MVP Digitaliza Aí usa um único projeto Next.js para frontend e API. STT é a primeira capacidade implementada, com evolução de produto registrada no DECISIONS central. Client e servidor têm responsabilidades distintas dentro desse projeto, permitindo desenvolver o contrato da API e a tela separadamente.

```text
Páginas explícitas → JourneyPage → ações semânticas + VoiceHelp(contexto)
VoiceHelp → Drawer → VoiceConversation + etapas reutilizáveis
                  → VoiceAudioDock → useAudioSpectrum (AnalyserNode/canvas)
       ↘ useVoiceAssistant
       ↘ useSpeechToText → MediaStream compartilhado com o rodapé
                        → requestTranscription
POST /api/transcribe → handleTranscription → readAudioForm + schemas
                                        → getGroqEnv → transcribeAudio → Groq
```

- `app` organiza URLs, layout raiz e implementação específica de cada rota. Páginas são Server Components por padrão.
- `components/layout` contém shell, composição compartilhada de tela e `JourneyCard`.
- `components/voice` contém o contrato de contexto por página, Drawer, etapas, gravador, controles e painel de transcrição.
- `hooks/use-voice-assistant.ts` controla etapa, sugestão selecionada e última transcrição revisada.
- `hooks/use-speech-to-text.ts` coordena MediaRecorder, ciclo de vida, cancelamento e envio.
- `hooks/use-audio-spectrum.ts` apenas observa o stream da captura. Motion anima a UI; o analisador não solicita outro microfone nem envia áudio.
- `lib/stt` contém contratos públicos e auxiliares client de captura e transporte.
- `app/servicos/segunda-via` contém páginas explícitas, conteúdo estático, contexto de retorno validado com Zod e interação local de prática.
- `app/servicos/_components` contém a apresentação comum dos placeholders.
- `app/api/transcribe/_lib` processa a requisição e limita multipart. Usa `server-only`.
- `server/stt` adapta a Groq e define o erro usado pelo servidor, também com `server-only`.
- `server/env.ts` valida a configuração privada sob demanda.

A rota conhece o handler; o handler conhece validação e provedor. O provedor não conhece React nem a rota Next. O frontend não importa módulos de servidor. Imports diretos deixam essas fronteiras visíveis, sem barrel misturando client e servidor.

LLM e interpretação de intenção, navegação inferida do áudio, TTS, banco e autenticação não fazem parte deste fluxo. A navegação pelas sugestões declaradas pela página exige confirmação explícita em botão. A evolução é validada incrementalmente pelo fluxo real, sem prévia de desenvolvimento de estados futuros.

O Next.js admite colocação e organização por funcionalidade. O código usado por várias rotas fica fora de `app`; o código exclusivo permanece junto ao segmento. O underscore é uma convenção de roteamento; `server-only` é a proteção de importação. Ver [mapa e regras](src-structure-and-conventions.md).

`VoiceHelp` recebe contexto serializável declarado pela página e mantém etapa, sugestão e última transcrição em memória. A chave do contexto separa sessões; páginas com query params criam contexto no servidor sob `Suspense`, preservando origem/etapa. Fechar aborta envio e captura e não aceita permissões tardias. Não há progresso global ou persistência local.

Primitivas visuais reutilizáveis vivem em `components/ui` (shadcn com Base UI). `JourneyCard` é compartilhado entre a home e a jornada em `components/layout`; `PracticeChoice` continua exclusivo da segunda via. `lib/utils.ts` expõe `cn`; os módulos públicos de UI não importam servidor. [Contrato da fundação](shadcn-ui.md).
