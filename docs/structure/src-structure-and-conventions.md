# Pastas e convenções do App Router

A organização atual usa colocação junto às rotas: arquivos usados só por uma tela ou endpoint ficam próximos de quem os consome. O Next.js também permite pastas por funcionalidade; esta escolha reduz camadas para o tamanho atual do MVP.

```text
src/
├── app/
│   ├── layout.tsx                       # Layout raiz, fontes e metadados
│   ├── page.tsx                         # Tela inicial, Server Component
│   ├── globals.css
│   ├── favicon.ico
│   ├── _components/                     # Shell, composição, botões e gravador
│   ├── _hooks/use-speech-to-text.ts      # Captura e estado do client
│   ├── _lib/                            # Captura e envio HTTP
│   ├── servicos/
│   │   ├── _components/service-page.tsx  # Apresentação comum dos serviços
│   │   └── <servico>/page.tsx            # Jornada de segunda via e três placeholders
│   └── api/transcribe/
│       ├── route.ts                     # Entrada POST e maxDuration
│       └── _lib/                        # Handler e leitura multipart
├── config/app.ts                        # Identidade global
├── lib/stt/                             # Contrato usado pelo client e servidor
│   ├── constants.ts
│   └── schemas.ts
└── server/                              # Código exclusivamente de servidor
    ├── env.ts
    └── stt/
        ├── groq.ts                      # Adaptador do provedor
        └── transcription-error.ts
```

## Regras de organização

- `page.tsx`, `layout.tsx` e `route.ts` seguem as convenções do App Router. A rota compõe a tela ou delega seu processamento; não concentra ciclo de vida do microfone ou integração externa.
- Pastas `_components`, `_hooks` e `_lib` são privadas para o roteamento: não criam URLs, mesmo se futuramente contiverem arquivos com nomes reservados.
- O conteúdo de `app/api/transcribe/_lib` pertence ao endpoint. `server/stt` concentra integração reutilizável pelo servidor, sem depender de React ou de uma rota concreta.
- `server` e auxiliares privados da API usam `server-only`. O underscore exclui uma pasta do roteamento, mas não impede importação no client. A fronteira de segurança depende de `server-only` e dos imports.
- `lib/stt` contém apenas contratos e constantes públicos, usados nos dois ambientes. Credenciais ficam em `server/env.ts`.
- Extrair um componente para uma pasta compartilhada fora da rota somente quando existir um segundo consumidor que justifique isso. Não criar `features`, `components/ui`, `services` ou outras camadas vazias por antecipação.
- Route groups `(grupo)` servem para organizar seções ou layouts sem mudar a URL. O MVP tem um único layout compartilhado e não precisa deles agora.
- Páginas e layout continuam Server Components por padrão. `use client` fica no gravador/hook, no wrapper `VoiceHelp` e na escolha da prática, que precisam de interação ou APIs do navegador.

Configurações do framework, `.env*`, `public` e `docs` ficam na raiz. O alias `@/*` resolve `src/*`. Arquivos usam kebab-case, componentes PascalCase e hooks prefixo `use`. Tipos de contrato derivam dos schemas Zod. Manter TypeScript estrito e validar entradas externas como `unknown`, sem `any`.

Usar imports explícitos, sem barrels misturando client e servidor. Ao alterar contrato, atualizar client, handler e [STT-API](../../../docs/stt/STT-API.md). Ver [execução](build-and-run.md).

Base consultada: documentação de estrutura e colocação da versão Next instalada, em `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`.

Neste MVP não manter pasta de testes, suítes ou dependências de teste; usar lint, build e verificação manual conforme [workflow](../../agent-workflow.md).

A jornada em `app/servicos/segunda-via` mantém seus `_components` e `_lib` locais: conteúdo provisório e navegação validada com Zod. `JourneyPage` fornece um `main` focável por página, Eyebrow por tela, título, conteúdo, ações e acesso de voz. `AppShell` mantém o Header e o alvo focável `#conteudo` únicos, inclusive quando o Next preserva páginas ocultas. Estilos de composição ficam em CSS Module; o loader Tailwind exclui `*.module.css` para preservar os exports de classes do Next.
