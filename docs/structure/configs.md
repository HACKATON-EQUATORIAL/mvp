# Configurações do Digitaliza Aí

| Arquivo | Responsabilidade |
| --- | --- |
| `next.config.ts` | Origens de desenvolvimento explícitas, headers, cache components e integração Tailwind/Turbopack |
| `tsconfig.json` | TypeScript estrito e alias `@/*` para `src/*` |
| `biome.json` | Lint, formatação e imports; espaços, aspas duplas e ponto e vírgula |
| `src/config/app.ts` | Nome Digitaliza Aí |
| `src/server/env.ts` | Zod privado para chave e modelo Groq, validado por requisição |
| `src/lib/stt/constants.ts` | Limites de áudio, timeouts e contrato de transporte |
| `src/app/globals.css` | Tokens e estilos atuais |
| `.env.example` | Exemplo sem credenciais |
| `package.json` / `bun.lock` | Scripts e dependências |

`GROQ_API_KEY` é necessária para transcrever; `GROQ_STT_MODEL` aceita `whisper-large-v3-turbo` (padrão) ou `whisper-large-v3`. `NEXT_DEV_ALLOWED_ORIGINS` recebe hostnames separados por vírgula, sem protocolo ou porta, para túneis de desenvolvimento. Não é configuração de CORS nem autorização de acesso à API.

Configuração secreta ausente não bloqueia build ou renderização; a API responde com erro público de configuração. Não imprimir objetos de erro de ambiente: podem conter informações privadas. `.env*` ficam fora do Git, exceto o exemplo sem valores secretos.

[Execução e ngrok](../../README.md).
