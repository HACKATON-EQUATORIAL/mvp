# Digitaliza Aí · MVP

MVP web com foco em mobile, reunindo frontend e API em Next.js. A home oferece orientação, consulta de etapas e prática demonstrativa de segunda via. O acesso opcional de voz abre o gravador existente, que usa Groq e Zod para transcrever áudio. Os outros três serviços permanecem como placeholders.

Decisões ficam em [docs/DECISIONS.md do workspace](../docs/DECISIONS.md); a documentação específica de voz fica em [docs/stt](../docs/stt/README.md).

## Executar

Requisitos: Bun e Node.js 20.9 ou superior.

```bash
bun install
cp .env.example .env.local
```

Preencha `GROQ_API_KEY` em `.env.local` com uma chave criada em [Groq Console](https://console.groq.com/keys). Depois:

```bash
bun run dev
```

Abra [localhost:3000](http://localhost:3000). Se alterar as variáveis de ambiente, reinicie o servidor. Em celular, a captura precisa de uma URL HTTPS; acessar o IP da máquina por HTTP não equivale ao `localhost` do próprio celular.

## Variáveis de ambiente

| Variável | Necessária | Comportamento |
| --- | --- | --- |
| `GROQ_API_KEY` | Sim, para transcrever | Chave privada usada apenas no servidor |
| `GROQ_STT_MODEL` | Não | Padrão `whisper-large-v3-turbo`; aceita também `whisper-large-v3` |
| `NEXT_DEV_ALLOWED_ORIGINS` | Para túnel no desenvolvimento | Hostnames autorizados para carregar scripts do Next.js, separados por vírgula, sem protocolo ou porta |

Zod valida a configuração ao receber uma gravação. O build e as páginas funcionam sem chave; a rota retorna erro de configuração até que ela seja definida. Não use prefixo `NEXT_PUBLIC_` na chave e não envie `.env`/`.env.local` ao Git.

### Testar pelo ngrok no celular

Com o túnel apontando para a porta 3000, adicione ao arquivo de ambiente o hostname fornecido pelo ngrok:

```dotenv
NEXT_DEV_ALLOWED_ORIGINS=seu-tunel.ngrok-free.app
```

Reinicie `bun run dev`, abra a URL **HTTPS** diretamente no Chrome do celular e permita o microfone. Atualize a variável quando o hostname mudar. Sem a origem autorizada, o Next.js pode bloquear scripts de desenvolvimento com HTTP 403; a página pode aparecer sem os botões responderem. Essa configuração afeta o servidor de desenvolvimento.

## Usar

1. Abra **Ajuda por voz** em qualquer tela e clique em **Gravar áudio** para solicitar o microfone.
2. Fale e clique em **Parar e transcrever**. O envio começa ao parar.
3. O texto devolvido pela Groq aparece em **Transcrição**.

Fechar a região descarta a sessão local e devolve o foco ao botão de voz. Abrir a região não solicita permissão nem envia áudio. Cancelar descarta a captura/ignora a resposta pendente. Após falha de envio, é possível tentar enviar a mesma gravação novamente. A captura encerra e envia automaticamente ao atingir 60 segundos; ao colocar a aba em segundo plano ou sair da tela, a captura é cancelada e o microfone é liberado.

Uma mudança temporária de visibilidade durante o pedido de permissão não cancela esse pedido. Se o microfone for autorizado enquanto a página ainda estiver oculta, o app libera o dispositivo e pede para voltar à página e gravar novamente.

## API e limites

`POST /api/transcribe` exige o header `X-Digitaliza-Client: web` e recebe `multipart/form-data`, com exatamente um arquivo no campo `audio`. Retorna:

```json
{ "text": "Quero a segunda via da minha fatura." }
```

Erros retornam `{ "error": { "code": "...", "message": "..." } }`. Formatos, status e limitações estão no [contrato STT](../docs/stt/STT-API.md).

O arquivo deve ter de 1 byte a 4.000.000 bytes. A interface grava até 60 segundos; a API limita bytes e valida o MIME, e a decodificação é feita pela Groq. Não há análise local de silêncio ou garantia de duração/qualidade do conteúdo enviado diretamente à API. Áudio e texto não são persistidos pelo app nem registrados em logs; o áudio é enviado à Groq para processamento.

## Páginas de serviços

- `/servicos/segunda-via`: preparação para a prática de segunda via.
- `/servicos/consultar-debitos`: Consultar débitos.
- `/servicos/falta-de-energia`: Informar falta de energia.
- `/servicos/tarifa-social`: Cadastro de Tarifa Social.

Segunda via contém explicação, prática guiada, conferência de conta fictícia, prática individual, encerramento, consulta contextual, dificuldades e limite de saída. Não coleta dados reais, emite fatura, avalia aprendizagem ou abre canal externo. O canal e o procedimento oficiais continuam a confirmar. A navegação e as adaptações do Figma estão na [spec de reconstrução](../docs/specs/frontend-reconstruction.md).

Os outros três serviços exibem título, aviso de indisponibilidade e retorno à home. O catálogo conceitual vem de [BR-EQT-003 no workspace](../docs/business-rules/BR-EQT-003-catalogo-e-recorte.md); não representa integração, emissão de fatura, consulta real ou cadastro oficial. A transcrição não interpreta intenção nem navega automaticamente.

## Verificação

```bash
bun run lint
bun run build
```

Biome verifica lint, formatação e imports; `bun run lint:fix` aplica correções seguras e `bun run format` formata. Neste MVP não há suíte automatizada nem script de teste. Complementar lint e build com verificação manual do fluxo alterado: permissão do microfone, gravação, envio, texto, cancelamento e erro/retry quando pertinente. Chamadas reais à Groq consomem a cota da conta; não automatizar esse consumo.

Código em `src/`, com implementação específica junto às rotas do App Router e integração privada em `src/server`. Rotas apenas compõem a UI ou delegam ao handler; captura, transporte e integração Groq possuem módulos próprios. Ver [estrutura e convenções](docs/structure/overview.md) e [proteções e limites da demonstração](docs/structure/auth-and-api.md). Ao migrar de uma instância de desenvolvimento anterior à pasta `src/`, reinicie `bun run dev`.

Ver [documentação](docs/README.md), [decisões](../docs/DECISIONS.md) e [referência visual](../docs/stt/design/README.md).
