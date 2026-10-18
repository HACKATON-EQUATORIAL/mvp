# Arquitetura do Digitaliza Aí

O frontend Digitaliza Aí usa Next.js App Router. O backend de domínio é Python/FastAPI
em `../back`; consultas GET saem do navegador via React Query, sem proxy Next.
Route Handlers do Next atendem as integrações STT e LLM com Groq. Ver
[HTTP e queries](http-and-queries.md) e DEC-EQT-022 no registro central.

```text
Home → useGetTracks → http/track/get-tracks → http/api → Python GET /api/v1/tracks
                   ↘ queries/keys/tracks + schemas/http/track
QueryProvider no layout raiz mantém o cache em memória
Páginas explícitas → JourneyPage → ações semânticas + VoiceHelp(contexto)
VoiceHelp → publica contexto no VoiceAssistantProvider
AppShell → VoiceAssistantHost persistente → Drawer + VoiceConversation
                  → VoiceAudioDock → useAudioSpectrum (AnalyserNode/canvas)
       ↘ useVoiceAssistant
       ↘ useSpeechToText → MediaStream compartilhado com o rodapé
                        → requestTranscription
Transcrição concluída → useVoiceInterpretation → POST /api/interpret
                     → Groq → IDs permitidos → confirmação → navegação interna
POST /api/transcribe → handleTranscription → readAudioForm + schemas
                                        → getGroqEnv → transcribeAudio → Groq
```

- `app` organiza URLs, layout raiz e implementação específica de cada rota. Páginas são Server Components por padrão.
- `components/layout` contém shell, composição compartilhada de tela e `JourneyCard`.
- `components/voice` contém o contrato de contexto por página, Drawer, etapas, gravador, controles e painel de transcrição.
- `hooks/use-voice-assistant.ts` controla a etapa visual e a última transcrição concluída.
- `hooks/use-speech-to-text.ts` coordena MediaRecorder, ciclo de vida, cancelamento e envio.
- `hooks/use-audio-spectrum.ts` apenas observa o stream da captura. Motion anima a UI; o analisador não solicita outro microfone nem envia áudio.
- `http/api.ts` contém o transporte GET; `http/<recurso>` reúne request privado, opções e hook por operação. `queries/keys` mantém keys e `lib/query-client.ts` configura o cache.
- `schemas/http` mantém schemas Zod do contrato Python; `lib/error/api-error.ts` normaliza falhas HTTP.
- `components/providers` mantém o provider React Query.
- `lib/assistant` mantém contrato e client da interpretação; `server/assistant` mantém o prompt/provedor; `hooks/use-voice-interpretation.ts` controla cancelamento e resultado.
- `lib/stt` contém contratos públicos e auxiliares client de captura e transporte.
- `app/servicos/segunda-via` contém páginas explícitas, conteúdo estático, contexto de retorno validado com Zod e interação local de prática.
- `app/servicos/_components` contém a apresentação comum dos placeholders.
- `app/api/transcribe/_lib` processa a requisição e limita multipart. Usa `server-only`.
- `server/stt` adapta a Groq e define o erro usado pelo servidor, também com `server-only`.
- `server/env.ts` valida a configuração privada sob demanda.

A rota conhece o handler; o handler conhece validação e provedor. O provedor não conhece React nem a rota Next. O frontend não importa módulos de servidor. Imports diretos deixam essas fronteiras visíveis, sem barrel misturando client e servidor.

LLM recebe catálogo Python, manifesto completo de segunda via e histórico curto; escolhas claras navegam direto e só a interrupção de prática exige confirmação adicional. TTS e respostas pedagógicas livres ficam fora. Integração das páginas/prática Python está atribuída à outra pessoa, no handoff. Ver [interpretação](voice-interpretation.md) e [tarefas da outra frente](../specs/backend-journey-handoff.md). A evolução é validada incrementalmente pelo fluxo real, sem prévia de desenvolvimento de estados futuros.

O Next.js admite colocação e organização por funcionalidade. O código usado por várias rotas fica fora de `app`; o código exclusivo permanece junto ao segmento. O underscore é uma convenção de roteamento; `server-only` é a proteção de importação. Ver [mapa e regras](src-structure-and-conventions.md).

`VoiceHelp` publica o contexto serializável da página. O provider e o host no shell preservam até seis turnos, último resultado, opções e transcrição somente na mesma página. Páginas com query params mantêm slots em `Suspense` e origem/etapa. Navegar cancela operações e limpa toda a conversa, iniciando a ajuda contextual do destino; fechar preserva estado estável e descarta áudio bruto. Recarregar limpa a sessão. Não há progresso global ou persistência local. O manifesto de segunda via compõe descritores junto às páginas, não varre URLs.

Primitivas visuais reutilizáveis vivem em `components/ui` (shadcn com Base UI). `JourneyCard` é compartilhado entre a home e a jornada em `components/layout`; `PracticeChoice` continua exclusivo da segunda via. `lib/utils.ts` expõe `cn`; os módulos públicos de UI não importam servidor. [Contrato da fundação](shadcn-ui.md).
