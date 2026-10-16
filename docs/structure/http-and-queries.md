# HTTP e estado

`app/_lib/transcribe-client.ts` envia FormData para `/api/transcribe`, com `X-Digitaliza-Client: web`. Não definir Content-Type manualmente: o navegador inclui o boundary. A resposta, inclusive de erro, passa pelos schemas Zod antes de ser consumida.

Não há Axios, TanStack Query ou cache de transcrições. Uma gravação é um envio explícito; fetch usa `cache: no-store`, e a API devolve `Cache-Control: no-store`. Áudio de retry permanece somente na memória do componente.

`useSpeechToText` coordena os estados `idle`, `requesting`, `recording`, `transcribing`, `success` e `error`. O bloqueio imediato por ref impede solicitações duplicadas antes de um novo render. Cancelamento aborta o envio, libera tracks e invalida respostas antigas. Nova tentativa depende de ação explícita e reutiliza a última gravação válida.

A captura limita duração a 60 segundos; arquivo a 4.000.000 bytes. O HTTP do client tem timeout de 40 segundos; Groq, de 30 segundos. A API limita o corpo antes de materializar multipart. Ver [contrato](../../../docs/stt/STT-API.md).

Durante o pedido de permissão, uma mudança temporária de visibilidade não cancela o pedido. Captura ou envio ativos são cancelados ao ocultar a página. Permissão recebida com página oculta libera o microfone e pede nova tentativa com a página visível.
