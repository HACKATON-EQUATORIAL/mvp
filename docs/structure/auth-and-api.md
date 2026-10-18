# Acesso e segurança da API

O MVP é público e não possui login, sessão, cookies de autenticação ou autorização por usuário. A chave Groq é uma credencial do servidor, não uma identidade do cliente. Não importar a infraestrutura de acesso do projeto de referência.

GETs de conteúdo vão diretamente ao backend Python com URL pública e sem credenciais.
CORS de origens permitidas é configurado na API Python. As proteções de upload
abaixo pertencem ao Route Handler STT, não aos GETs do domínio.

## Proteções implementadas

- Ambiente privado validado com Zod sob demanda, em módulo `server-only`. Nunca usar `NEXT_PUBLIC_` para a chave.
- Multipart e arquivo limitados em bytes, campo único e MIME declarado validado. Conteúdo binário é decodificado pela Groq, não certificado pelo MIME.
- Endpoint Groq fixo, sem URLs recebidas do client; redirecionamentos externos recusados. Timeout e cancelamento propagados.
- Header não simples `X-Digitaliza-Client: web` obrigatório. Formulários de outros sites não conseguem defini-lo, e fetch entre origens exige preflight que esta API não autoriza. `Sec-Fetch-Site: cross-site` ou `same-site` é recusado antes de ler o corpo. Ausência de Fetch Metadata permite clientes HTTP com o header explícito.
- Não liberar CORS. O header público é defesa contra acionamento por outros sites, não autenticação e não bloqueia scripts HTTP diretos.
- Erros públicos sanitizados, sem corpo bruto do provedor, chave ou logs de áudio/texto. JSON com `no-store`.
- Transcrição renderizada como texto pelo React, sem HTML dinâmico.
- Headers globais: `nosniff`, bloqueio de iframe, política de referência e microfone restrito à própria origem; câmera/geolocalização desabilitadas.
- Ngrok autorizado por hostname explícito apenas no desenvolvimento. HTTPS é necessário à captura mobile.

## Limites para publicação

Não há rate limiter próprio, autenticação nem quota por usuário; chamadas HTTP diretas ainda podem consumir a cota Groq. O upload tem limite de bytes, mas não há prazo próprio de leitura lenta do corpo. Uma publicação aberta exige limites de taxa, concorrência, corpo e tempo no gateway/hospedagem, além de definir acesso e orçamento. Limites do provedor não substituem esses controles.

CSP com restrição de scripts ainda não foi implantada; deve ser planejada e testada com o modo de renderização Next escolhido. Não adicionar `unsafe-inline` ou desativar proteções para contornar incompatibilidade. Não existe alegação de auditoria completa ou prontidão para produção nesta refatoração.

Ver [contrato](../../../docs/stt/STT-API.md) e [ambiente](configs.md). Usar dados sintéticos na demonstração.

## Interpretação LLM

/api/interpret segue a proteção de mesma origem e header público do STT. Corpo
JSON limitado, schemas estritos, IDs restritos às opções enviadas e respostas
sanitizadas. Prompt não é controle de autorização. Não retorna URLs ou executa
ferramentas; confirmação e destino interno são resolvidos pelo frontend. Mesmos
limites de cota/acesso da demonstração. Ver [contrato LLM](voice-interpretation.md).
