# Rotas e navegação

Next.js App Router em `src/app`. Todas as páginas atuais são públicas.

| URL | Arquivo em `src/app` | Comportamento |
| --- | --- | --- |
| `/` | `page.tsx` | Entrada por intenção e acesso opcional ao gravador |
| `/servicos/segunda-via` | `servicos/segunda-via/page.tsx` | Escolha do canal (WhatsApp; site em breve) |
| `/servicos/consultar-debitos` | `servicos/consultar-debitos/page.tsx` | Título e retorno |
| `/servicos/falta-de-energia` | `servicos/falta-de-energia/page.tsx` | Título e retorno |
| `/servicos/tarifa-social` | `servicos/tarifa-social/page.tsx` | Título e retorno |
| `/api/transcribe` | `api/transcribe/route.ts` | POST multipart → JSON |

`layout.tsx` define idioma pt-BR, fontes, metadados, link de pular conteúdo e cabeçalho. `next/link` realiza a navegação. A transcrição não navega nem executa ações.

A gravação é descartada e o microfone liberado ao desmontar o gravador. Solicitações e respostas antigas são invalidadas por geração, inclusive se uma permissão chegar depois de cancelar. O contrato e os erros da API ficam em [STT-API](../../../docs/stt/STT-API.md).

Implementação exclusiva fica em pastas privadas com underscore junto ao segmento consumidor. `servicos/_components` não gera um serviço adicional; `api/transcribe/_lib` não cria endpoints. Não há route groups porque todas as telas atuais compartilham o mesmo layout.

## Jornada de segunda via (DEC-EQT-037)

Sob `/servicos/segunda-via`: escolha do canal na raiz e, no WhatsApp, `whatsapp` (mapa
das 3 etapas), `whatsapp/demonstracao` (etapa 1), `whatsapp/licoes/[parte]` (etapa 2;
`menu`, `documento`, `fatura`, `conferir`, gerados estaticamente; outra parte recebe
not-found) e `whatsapp/simulacao` (etapa 3) e `whatsapp/concluido` (meta: resumo e WhatsApp oficial com a mensagem pronta). As rotas
ficam em `_lib/navigation.ts` e as partes em `_lib/steps.ts`. Não há query de origem nem
redirect de rotas antigas.

Todas as telas leem o pacote do serviço do cache do React Query; a prática corrige na
hora e envia a tentativa uma vez no fim. O Next pode manter telas anteriores montadas e
ocultas: portais da barra e do Eletriquinho usam `findVisibleById`
(`components/layout/journey-target.ts`).
