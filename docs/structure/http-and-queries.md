# HTTP, queries e cache

## Referência adotada

Organização adaptada do [web-app do Zappoint](https://github.com/Zappoint/web-app),
consultado em 17/10/2026 no commit `4a2523ec0eb23411a61da66103282f3ab50c113f`.
O checkout local estava limpo nos arquivos consultados e no mesmo HEAD anunciado
pelo remoto. Referências: [transporte](https://github.com/Zappoint/web-app/blob/4a2523ec0eb23411a61da66103282f3ab50c113f/src/http/api.ts),
[operação e hook](https://github.com/Zappoint/web-app/blob/4a2523ec0eb23411a61da66103282f3ab50c113f/src/http/service/get-services.ts),
[keys](https://github.com/Zappoint/web-app/blob/4a2523ec0eb23411a61da66103282f3ab50c113f/src/queries/keys/app/service/get-services.ts).

Reaproveitamos um módulo por operação, request interno, opções reutilizáveis, hook
co-localizado e keys separadas. A aplicação usa Next.js App Router, fetch e Zod.
Não importar Axios, Vite, cookies, organização, auth ou toasts do outro projeto.

## Estrutura e responsabilidades

```text
src/
├── http/
│   ├── api.ts                        # apiRequest (GET/POST, X-Session-Id opcional) + apiGet
│   ├── track/
│   │   ├── get-tracks.ts              # Fn privada + getTracks + useGetTracks
│   │   ├── get-track.ts
│   │   ├── get-step.ts
│   │   └── get-difficulties.ts
│   ├── channel/get-channel-exit.ts
│   ├── practice/
│   │   ├── get-attempt.ts             # Query da tentativa (retomada)
│   │   └── practice-commands.ts       # Mutations: criar, responder, ajuda, abandonar
│   └── events/post-events.ts          # POST /events, melhor-esforço
├── lib/query-client.ts               # Configuração/cache por ambiente
├── queries/
│   └── keys/
│       ├── tracks/                   # Uma key por operação, composição por ID
│       └── channel/get-channel-exit.ts
├── schemas/http/
│   ├── track.ts                      # Respostas reais do backend FastAPI
│   ├── channel.ts
│   └── practice.ts                   # AttemptState/HelpResponse (sem gabarito)
├── lib/error/api-error.ts            # Erro HTTP normalizado
├── lib/session-id.ts                 # UUID anônimo (localStorage) para X-Session-Id
└── components/providers/query-provider.tsx
```

O navegador consulta diretamente o backend Python em `../back`. Route Handlers
Next atendem somente à Groq. Não criar um proxy Next para os GETs.

`http/api.ts` mantém base URL pública, método GET, timeout de 15s, cancelamento via
signal da query, credentials omit e cache no-store. Corpo externo é unknown até
passar no schema Zod. ApiError contém status/code, sem expor corpo bruto. Tipos
externos derivam de schemas; tipos de resultado do hook derivam da função interna.

## Convenção de cada operação

Em `http/track/get-tracks.ts`:

- `getTracksFn(signal)` é privada e retorna a Promise dos dados validados.
- `getTracks(options?)` retorna queryOptions. Não executa a chamada HTTP.
- `useGetTracks(options?)` consome as mesmas opções com useQuery.
- `GetTracksData` e `GetTracksQueryOptions` são tipos exportados.
- Options permitem enabled/staleTime e ajustes do consumidor, sem substituir key
  ou queryFn. O signal sempre chega ao fetch. Não capturar erros apenas para
  registrar console.error e relançar: o transporte normaliza, e a UI os apresenta.

```tsx
// Componente client
const tracks = useGetTracks()
const track = useGetTrack(trackId)
const step = useGetStep(trackId, stepId)

// Imperativo/prefetch, quando houver necessidade concreta
await queryClient.fetchQuery(getTracks())
await queryClient.prefetchQuery(getTrack(trackId))
```

Hook só é chamado em Client Component. Layout/page permanecem server por padrão;
o provider fica no layout raiz, sem transformar a aplicação inteira em client.
Não acrescentar use client aos módulos HTTP que também exportam fábricas para
prefetch; a fronteira client pertence ao consumidor do hook.

## Keys e cache

| Recurso | Key |
| --- | --- |
| Catálogo | getTracksKeys.list: tracks, list |
| Trilha | getTrackKeys.byId(id): tracks, detail, id |
| Etapa | getStepKeys.byId(trackId, stepId): prefixo da trilha, steps, stepId |
| Dificuldades | getDifficultiesKeys.byTrackId(id): prefixo da trilha, difficulties |
| Canal | getChannelExitKeys.byTrackId(id?): channel-exit, id ou null |

IDs são os retornados pelo backend, não os nomes locais de etapas ainda não
migradas. Keys hierárquicas permitem invalidação futura por trilha. Não adicionar
escopo de organização, autenticação ou filtros inexistentes no contrato Python.

QueryClient é estável no navegador e isolado no servidor: staleTime de 60s,
gcTime de 5min e sem refetch ao focar a janela. Uma repetição para falha transitória;
4xx e resposta inválida não são repetidos. Cache somente em memória. STT não passa por esse cache.

Mutations da prática (`http/practice/practice-commands.ts`) gravam a resposta do
backend no cache da tentativa (`setQueryData`); o front nunca infere acerto. Prática e
eventos enviam `X-Session-Id`, um UUID anônimo do navegador, sem login nem dado pessoal.
O ID da tentativa fica em `sessionStorage` por modo para retomar após recarregar.

## Consumidor e ambiente

A home usa useGetTracks. Loading inicial usa Skeleton shadcn com status acessível;
refetch com dados preserva os cards. Vazio, offline e falha com retry têm estados
próprios. Só jornadas disponíveis já implementadas no front podem ser abertas.
As telas de segunda via (trilha, lições, consulta, dificuldades, canal, prática e
resultado) consomem a API; ver `docs/specs/mega-revisao.md`.

Não há prefetch server do catálogo nesta entrega: build independe da API, e a
consulta começa no navegador. NEXT_PUBLIC_API_URL inclui /api/v1, é validada em
config/api.ts e incorporada ao bundle pelo Next. Reiniciar dev após alterar o
ambiente; reconstruir produção. Nunca colocar credenciais nessa variável.

Local: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 (padrão). No celular, localhost
aponta para o aparelho: defina NEXT_PUBLIC_API_TUNNEL_URL com o túnel do backend; ela só é
usada quando o app abre por host não local, e em localhost vale a URL padrão. Com front HTTPS/ngrok, configurar URL HTTPS pública do
backend e origem exata do front em CORS_ORIGINS do Python (ou CORS_ORIGIN_REGEX para ngrok), reiniciando a API.
Não liberar CORS no Route Handler STT.

## STT separado

lib/stt/transcribe-client.ts continua enviando FormData para /api/transcribe com
X-Digitaliza-Client: web. Não definir Content-Type manualmente. O Next valida e
chama Groq com chave privada em server-only. Não usa React Query, mutation ou
cache de transcrições. Captura, cancelamento e áudio de retry ficam no hook.
Limites atuais: 60s e 4.000.000 bytes; timeout client de 40s e Groq de 30s.
Ver [contrato STT](../../../docs/stt/STT-API.md).

Referências complementares: [queryOptions](https://tanstack.com/query/latest/docs/framework/react/guides/query-options),
[cancelamento](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)
e [App Router/provider](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr).

## Interpretação por LLM

Após confirmar a transcrição, o client faz POST /api/interpret para o próprio Next
que chama Groq. Não entra no transporte GET Python nem em React Query/mutations.
Contrato e fronteiras em [interpretação](voice-interpretation.md). Integração de
páginas/prática com Python pertence à outra frente: [handoff](../specs/backend-journey-handoff.md).
