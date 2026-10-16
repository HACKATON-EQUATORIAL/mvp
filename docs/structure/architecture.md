# Arquitetura do Digitaliza Aí

O MVP Digitaliza Aí usa um único projeto Next.js para frontend e API. STT é a primeira capacidade implementada, com evolução de produto registrada no DECISIONS central. Client e servidor têm responsabilidades distintas dentro desse projeto, permitindo desenvolver o contrato da API e a tela separadamente.

```text
src/app/page.tsx → ServiceList + AudioRecorder
AudioRecorder → useSpeechToText → requestTranscription
POST /api/transcribe → handleTranscription → readAudioForm + schemas
                                        → getGroqEnv → transcribeAudio → Groq
```

- `app` organiza URLs, layout e implementação específica de cada rota. Páginas são Server Components por padrão.
- `app/_components` contém cabeçalho, lista de serviços e gravador da tela inicial.
- `app/_hooks` coordena MediaRecorder, ciclo de vida, cancelamento e envio.
- `app/_lib` contém catálogo local, auxiliares de captura e transporte para a API do app.
- `app/servicos/_components` contém a apresentação comum dos placeholders.
- `app/api/transcribe/_lib` processa a requisição e limita multipart. Usa `server-only`.
- `server/stt` adapta a Groq e define o erro usado pelo servidor, também com `server-only`.
- `lib/stt` contém schemas e constantes públicos, compartilhados entre client e servidor.
- `server/env.ts` valida a configuração privada sob demanda.

A rota conhece o handler; o handler conhece validação e provedor. O provedor não conhece React nem a rota Next. O frontend não importa módulos de servidor. Imports diretos deixam essas fronteiras visíveis, sem barrel misturando client e servidor.

Não há LLM, interpretação de intenção, navegação automática, TTS, banco ou autenticação. Esses recursos exigem decisões próprias antes de ampliar o escopo.

O Next.js admite colocação e organização por funcionalidade. Para este MVP, escolhemos colocação para reduzir camadas. O underscore é uma convenção de roteamento; `server-only` é a proteção de importação. Ver [mapa e regras](src-structure-and-conventions.md).
