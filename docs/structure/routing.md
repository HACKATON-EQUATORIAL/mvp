# Rotas e navegação

Next.js App Router em `src/app`. Todas as páginas atuais são públicas.

| URL | Arquivo em `src/app` | Comportamento |
| --- | --- | --- |
| `/` | `page.tsx` | Catálogo e gravador |
| `/servicos/segunda-via` | `servicos/segunda-via/page.tsx` | Título e retorno |
| `/servicos/consultar-debitos` | `servicos/consultar-debitos/page.tsx` | Título e retorno |
| `/servicos/falta-de-energia` | `servicos/falta-de-energia/page.tsx` | Título e retorno |
| `/servicos/tarifa-social` | `servicos/tarifa-social/page.tsx` | Título e retorno |
| `/api/transcribe` | `api/transcribe/route.ts` | POST multipart → JSON |

`layout.tsx` define idioma pt-BR, fontes, metadados, link de pular conteúdo e cabeçalho. `next/link` realiza a navegação. A transcrição não navega nem executa ações.

A gravação é descartada e o microfone liberado ao desmontar o gravador. Solicitações e respostas antigas são invalidadas por geração, inclusive se uma permissão chegar depois de cancelar. O contrato e os erros da API ficam em [STT-API](../../../docs/stt/STT-API.md).

Implementação exclusiva fica em pastas privadas com underscore junto ao segmento consumidor. `servicos/_components` não gera um serviço adicional; `api/transcribe/_lib` não cria endpoints. Não há route groups porque todas as telas atuais compartilham o mesmo layout.
