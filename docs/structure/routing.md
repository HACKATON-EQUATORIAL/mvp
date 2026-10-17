# Rotas e navegação

Next.js App Router em `src/app`. Todas as páginas atuais são públicas.

| URL | Arquivo em `src/app` | Comportamento |
| --- | --- | --- |
| `/` | `page.tsx` | Entrada por intenção e acesso opcional ao gravador |
| `/servicos/segunda-via` | `servicos/segunda-via/page.tsx` | Preparação da prática |
| `/servicos/consultar-debitos` | `servicos/consultar-debitos/page.tsx` | Título e retorno |
| `/servicos/falta-de-energia` | `servicos/falta-de-energia/page.tsx` | Título e retorno |
| `/servicos/tarifa-social` | `servicos/tarifa-social/page.tsx` | Título e retorno |
| `/api/transcribe` | `api/transcribe/route.ts` | POST multipart → JSON |

`layout.tsx` define idioma pt-BR, fontes, metadados, link de pular conteúdo e cabeçalho. `next/link` realiza a navegação. A transcrição não navega nem executa ações.

A gravação é descartada e o microfone liberado ao desmontar o gravador. Solicitações e respostas antigas são invalidadas por geração, inclusive se uma permissão chegar depois de cancelar. O contrato e os erros da API ficam em [STT-API](../../../docs/stt/STT-API.md).

Implementação exclusiva fica em pastas privadas com underscore junto ao segmento consumidor. `servicos/_components` não gera um serviço adicional; `api/transcribe/_lib` não cria endpoints. Não há route groups porque todas as telas atuais compartilham o mesmo layout.

## Jornada de segunda via

Sob `/servicos/segunda-via`, as rotas explícitas são `explicacao`,
`pratica/guiada`, `pratica/conferencia`, `pratica/individual`,
`pratica/concluida`, `etapas`, `etapas/encontrar`, `etapas/conferir`,
`dificuldades` e `canal`. A home representa a entrada por intenção. O canal
permanece interno, sem destino externo confirmado. Não há rota S10.

`origem` e `etapa` são validadas por schemas Zod em `_lib/navigation.ts`.
Origem inválida, ausente ou repetida usa fallback; nunca é uma URL de retorno.
O segmento da etapa prevalece sobre query conflitante e uma etapa desconhecida
recebe not-found. A origem inicial acompanha consulta e saída. As ações que
leem `searchParams` ficam sob Suspense, mantendo o conteúdo estático da tela.

Links navegam; botões da prática selecionam e mostram feedback local. A escolha
correta avança a simulação com `router.push`, sem avaliar desempenho. Entradas
diretas na conferência ou no encerramento continuam demonstrativas.
