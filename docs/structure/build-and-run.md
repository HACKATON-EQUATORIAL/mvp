# Execução e validação

Na raiz de `mvp`, usar Bun e Node.js 20.9 ou superior:

```bash
bun install --frozen-lockfile
cp .env.example .env.local
# Preencher GROQ_API_KEY no arquivo, sem publicar a credencial.
bun run dev
```

O Next.js atende em `http://localhost:3000`. Captura em celular exige HTTPS; para ngrok, seguir o [README](../../README.md#testar-pelo-ngrok-no-celular). Depois de mover `app` para `src/app`, reiniciar uma instância de dev já em execução para o Next redescobrir o diretório.

```bash
bun run lint
bun run build
bun run start
```

`lint` executa Biome; `build` valida TypeScript e build Next. `start` serve o build de produção. Não há Vite, preview, Lefthook ou hooks de commit configurados.

Verificação de UI deve cobrir mobile e desktop, links dos quatro serviços, permissão negada/pendente, gravação, envio, cancelamento, retry e ausência de overflow. Microfone sintético e viewport mobile não comprovam funcionamento em Android/iPhone físicos.

Por decisão do usuário, o MVP não mantém pasta `tests`, suítes automatizadas ou script de teste. Não recriar essa infraestrutura sem pedido explícito. Validar manualmente os cenários afetados, sem exigir uma bateria completa a cada ajuste. Não automatizar chamadas reais à Groq, que consomem a cota da conta. Não executar commit ou push como efeito da validação.
