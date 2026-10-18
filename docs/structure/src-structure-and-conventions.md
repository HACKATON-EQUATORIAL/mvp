# Pastas e convenções do App Router

A organização separa código compartilhado de implementação exclusiva de uma rota. O App Router contém páginas, layout e auxiliares do segmento; componentes e lógica usados por várias telas ficam em `src/components`, `src/hooks` e `src/lib`.

```text
src/
├── app/
│   ├── layout.tsx                       # Layout raiz, fontes e metadados
│   ├── page.tsx                         # Rota server; compõe seleção client de trilhas
│   ├── _components/track-selection.tsx   # Primeiro consumidor React Query
│   ├── globals.css
│   ├── favicon.ico
│   ├── servicos/
│   │   ├── _components/service-page.tsx  # Apresentação comum dos serviços
│   │   ├── segunda-via/                 # Páginas, conteúdo e prática exclusivos
│   │   │   ├── _components/practice-choice.tsx
│   │   │   └── _lib/                     # Conteúdo e navegação da jornada
│   │   └── <servico>/page.tsx            # Três placeholders
│   ├── api/interpret/                  # POST JSON para LLM Groq e _lib/handler
│   └── api/transcribe/
│       ├── route.ts                     # Entrada POST e maxDuration
│       └── _lib/                        # Handler e leitura multipart
├── components/
│   ├── ui/                             # Primitivas shadcn/Base UI
│   ├── providers/query-provider.tsx     # Provider React Query do layout
│   ├── layout/                         # Shell, Header, telas e JourneyCard
│   └── voice/                          # Drawer, contexto tipado, etapas e captura
├── hooks/use-speech-to-text.ts         # Captura e estado do client
├── hooks/use-voice-catalog.ts          # Catálogo compartilhado com React Query
├── hooks/use-voice-assistant.ts        # Etapa, sugestão e transcrição em memória
├── hooks/use-voice-interpretation.ts   # Envio LLM, resultado e abort
├── hooks/use-audio-spectrum.ts         # AnalyserNode/canvas do stream já capturado
├── http/                               # api.ts e operação/fábrica/hook por recurso
├── queries/                            # Query client e keys/<recurso>/get-*.ts
├── schemas/http/                       # Schemas Zod das respostas Python
├── config/api.ts                       # URL pública do backend validada com Zod
├── config/app.ts                        # Identidade global
├── lib/
│   ├── assistant/                     # Schemas e POST explícito de interpretação
│   ├── error/api-error.ts              # Erro HTTP normalizado
│   ├── utils.ts                        # cn local para composição de classes
│   └── stt/                            # Contrato público e auxiliares client
│       ├── constants.ts
│       ├── schemas.ts
│       ├── recording.ts                # Formatos e erros do navegador
│       └── transcribe-client.ts        # Envio HTTP para a API local
└── server/                              # Código exclusivamente de servidor
    ├── env.ts
    ├── assistant/                      # Prompt, provedor LLM e erro tipado
    └── stt/
        ├── groq.ts                      # Adaptador do provedor
        └── transcription-error.ts
```

## Regras de organização

- `page.tsx`, `layout.tsx` e `route.ts` seguem as convenções do App Router. A rota compõe a tela ou delega seu processamento; não concentra ciclo de vida do microfone ou integração externa.
- Pastas `_components` e `_lib` dentro dos segmentos são privadas para o roteamento: não criam URLs, mesmo se futuramente contiverem arquivos com nomes reservados. Não criar uma segunda árvore compartilhada em `app`.
- O conteúdo de `app/api/transcribe/_lib` pertence ao endpoint. `server/stt` concentra integração reutilizável pelo servidor, sem depender de React ou de uma rota concreta.
- `server` e auxiliares privados da API usam `server-only`. O underscore exclui uma pasta do roteamento, mas não impede importação no client. A fronteira de segurança depende de `server-only` e dos imports.
- `lib/stt/constants.ts` e `schemas.ts` são compartilhados entre client e servidor; `recording.ts` e `transcribe-client.ts` são auxiliares do navegador. Credenciais ficam em `server/env.ts`.
- Primitivas visuais compartilhadas ficam em `components/ui`, no padrão shadcn com Base UI. Composições gerais ficam em `components/layout`; recursos de voz em `components/voice`; somente a prática permanece em `app/servicos/segunda-via/_components`. Não criar camadas vazias por antecipação.
- Route groups `(grupo)` servem para organizar seções ou layouts sem mudar a URL. O MVP tem um único layout compartilhado e não precisa deles agora.
- Páginas e layout continuam Server Components por padrão. `use client` fica no gravador/hooks, no provider/host persistente e no registro `VoiceHelp`, nas etapas reutilizáveis que recebem dados e callbacks e na escolha da prática. `useVoiceAssistant` controla a etapa, sugestão e transcrição; `useSpeechToText` permanece responsável pelo microfone e envio. Contextos de voz são dados serializáveis declarados por página; páginas que dependem de `searchParams` encaminham a composição interativa por slot dentro de `Suspense`.

Configurações do framework, `.env*`, `public` e `docs` ficam na raiz. O alias `@/*` resolve `src/*`. Arquivos usam kebab-case, componentes PascalCase e hooks prefixo `use`. Tipos de contrato derivam dos schemas Zod. Manter TypeScript estrito e validar entradas externas como `unknown`, sem `any`.

Usar imports explícitos, sem barrels misturando client e servidor. Ao alterar contrato, atualizar client, handler e [STT-API](../../../docs/stt/STT-API.md). Ver [execução](build-and-run.md).

Base consultada: documentação de estrutura e colocação da versão Next instalada, em `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`.

Neste MVP não manter pasta de testes, suítes ou dependências de teste; usar lint, build e verificação manual conforme [workflow](../../agent-workflow.md).

A jornada em `app/servicos/segunda-via` mantém seus `_components` e `_lib` locais: conteúdo provisório e navegação validada com Zod. `JourneyPage` fornece um `main` focável por página, Eyebrow por tela, título, conteúdo, ações e acesso de voz. `AppShell` mantém o Header e o alvo focável `#conteudo` únicos, inclusive quando o Next preserva páginas ocultas. Estilos de composição ficam em CSS Module; o loader Tailwind exclui `*.module.css` para preservar os exports de classes do Next.

Configuração e manutenção das primitivas: [shadcn com Base UI](shadcn-ui.md). Não recriar cópias de Button/Card em pastas de rotas.

Consultas de domínio usam `http` por operação, `queries/keys` e `schemas/http`; provider compartilhado em
`components/providers/query-provider.tsx`. O Route Handler Next permanece apenas
para Groq. Ver [HTTP e estado](http-and-queries.md).

O host do assistente é único no AppShell. VoiceHelp registra o contexto, sem criar Drawer ou microfone por página. Descritores `_lib/voice-target.ts` junto às telas compõem o manifesto da jornada. Manter IDs canônicos e o contrato descrito em [interpretação](voice-interpretation.md).
