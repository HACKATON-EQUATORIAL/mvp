# Configurações do Digitaliza Aí

| Arquivo | Responsabilidade |
| --- | --- |
| `next.config.ts` | Origens de desenvolvimento explícitas, headers, cache components e integração Tailwind/Turbopack |
| `tsconfig.json` | TypeScript estrito e alias `@/*` para `src/*` |
| `components.json` | shadcn `base-nova`, Base UI, aliases e destino `src/components/ui` |
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

Para adicionar ou atualizar componentes via CLI, seguir [shadcn/Base UI](shadcn-ui.md). Variantes e semântica dos componentes ficam em [UI](styling-and-ui.md); valores visuais ficam no [design system](design-system.md). Não manter essas regras duplicadas nesta lista de configuração.

## URL pública do backend

`NEXT_PUBLIC_ASSISTANT_AI` liga a IA do assistente (LLM e transcrição pela Groq) só com o
valor `on`; ausente ou outro valor vale desligado (DEC-EQT-039). Desligada, as rotas
`/api/interpret` e `/api/transcribe` respondem `503 ASSISTANT_AI_DISABLED` e o assistente
segue sem microfone, com chips e ajuda local (`src/config/assistant.ts`). Como é
`NEXT_PUBLIC_`, a mudança exige reiniciar o dev server ou refazer o build.

`NEXT_PUBLIC_API_URL` define o backend Python com `/api/v1`. Validada por Zod em
`src/config/api.ts`; disponível no navegador e incorporada ao build, sem segredos.
Para celular/ngrok e CORS, seguir [HTTP e queries](http-and-queries.md).

GROQ_LLM_MODEL configura a interpretação no servidor, com padrão openai/gpt-oss-20b.
Usa a mesma GROQ_API_KEY do STT; validadores independentes preservam o contrato
de transcrição. Alternativa aceita: openai/gpt-oss-120b. Ver [LLM](voice-interpretation.md).
