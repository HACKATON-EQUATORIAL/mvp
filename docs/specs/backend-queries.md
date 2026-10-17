# Consultas GET do backend Python

Entrega de 17/10/2026 autorizada pelo usuário: estruturar React Query e consumo
GET direto do backend Python; Route Handlers Next restritos à Groq.

Implementado: provider raiz, transporte GET com timeout/cancelamento, schemas Zod,
keys/options por recurso e configuração pública da URL. Queries de catálogo,
trilha, etapa, dificuldades e saída ao canal. A home lista trilhas reais, mantém
indisponíveis desabilitadas e adapta sugestões do assistente às trilhas disponíveis.
Estados de carregamento, offline, vazio e falha com retry previstos na UI.

Sem mutations, sem proxy Next, sem infraestrutura de testes ou prévia. As demais
páginas continuam locais; os GETs preparados não equivalem à migração da jornada.
IDs de etapas devem vir do backend, sem reutilizar automaticamente os IDs locais.

Validação inicial: lint/build aprovados. Os cinco GETs foram chamados contra a API
local real e passaram nos schemas; catálogo de quatro trilhas, duas etapas e três
dificuldades. Resposta 404 de etapa inexistente reconhecida como ApiError.
Conferidos manualmente no Edge em 390×844 e 820×740: carregamento real do catálogo,
trilha disponível, três indisponíveis, contexto do assistente, confirmação, entrada
na jornada e retorno à home. Sem chamadas à Groq. Estados de vazio, offline e erro
com retry estão implementados, mas não foram provocados no navegador nesta entrega.

Manutenção: [HTTP/queries](../structure/http-and-queries.md),
[pastas](../structure/src-structure-and-conventions.md),
[arquitetura](../structure/architecture.md).

Carregamento refinado com Skeleton oficial shadcn (CLI revisado em dry-run),
composição de quatro cards, status acessível e respeito a movimento reduzido.
Sem atraso artificial na chamada real.

Ícones de interface padronizados com lucide-react: Mic, Square e LoaderCircle;
configuração shadcn alinhada. O SVG local do microfone e os desenhos CSS de parar
e spinner foram substituídos pelos componentes da biblioteca.

Refinamento de organização em 17/10/2026: padrão de http e queries consultado no
Zappoint/web-app, commit 4a2523ec0eb23411a61da66103282f3ab50c113f, igual ao HEAD
remoto. Transporte em http/api.ts; arquivo por operação com Fn privada,
fábrica de opções e hook; keys em queries/keys e schemas em schemas/http.
Home migrada para useGetTracks. Mantidos keys/cache, validação, cancelamento,
backend direto e STT isolado. Sem Axios, autenticação ou escopo de organização.

Validação do refinamento: lint/build aprovados; QueryClient.fetchQuery nas cinco
operações contra o backend real, com schemas e keys preservados. No Edge, home
carregou via useGetTracks e mostrou quatro trilhas (uma disponível, três em breve).
