# Configuração e manutenção do shadcn/ui

**Revisão:** 17/10/2026. **Decisão:**
[DEC-EQT-016](../../../docs/DECISIONS.md#dec-eqt-016).

## Fundação adotada

A camada compartilhada usa shadcn/ui com Base UI, adaptada aos tokens, fonte
Inter, variantes e composição do Digitaliza Aí. Manter essa identidade ao adicionar
componentes, sem reaplicar defaults do preset sobre os estilos existentes.
O assistente de voz usa o Drawer Base UI, adaptado a tokens e dimensões mobile;
contrato e composição vigentes estão em [UI e acessibilidade](styling-and-ui.md#voz-e-captura).

## Fundação

| Arquivo | Responsabilidade |
| --- | --- |
| `mvp/components.json` | Preset `base-nova`, RSC, TypeScript, Tailwind v4, aliases e registro oficial |
| `mvp/src/components/ui/button.tsx` | Base UI Button, variantes CVA, tamanhos, loading e ref |
| `mvp/src/components/ui/action-link.tsx` | Link Next semântico com a mesma receita de botão |
| `mvp/src/components/ui/card.tsx` | Card, Header, Title, Description, Content, Action e Footer |
| `mvp/src/components/ui/drawer.tsx` | Drawer Base UI com swipe, backdrop e composição controlada |
| `mvp/src/lib/utils.ts` | Entrada local para `cn`, fornecido pelo pacote oficial `cn` |
| `mvp/src/app/globals.css` | Tokens canônicos, aliases shadcn e receitas visuais preservadas |

Composições compartilhadas como `JourneyCard`, `Header` e `Eyebrow` ficam em
`src/components/layout`; `VoiceHelpButton` e o gravador ficam em
`src/components/voice`. Reutilizam as primitivas em vez de manter cópias
próprias. Captura e transporte ficam em `src/hooks` e `src/lib/stt`.

## Contratos e estilo

Contratos de Button, ActionLink, Card e composições estão em [UI](styling-and-ui.md).
Tokens, fonte e aliases estão em [design system](design-system.md). Estes guias
são a referência vigente; não duplicar variantes ou catálogo nesta página.

O preset identifica a família do registro a instalar. O tema real é personalizado;
valores de fonte/tema inferidos por `shadcn info` não substituem o CSS do projeto.
Ícones futuros estão configurados para Tabler; o asset atual de voz foi preservado.

## Adicionar componentes depois

Executar na raiz de `mvp`:

```bash
bunx --bun shadcn@latest info --json
bunx --bun shadcn@latest add dialog --dry-run
bunx --bun shadcn@latest add dialog
```

Usar o componente concreto necessário no lugar de `dialog`. Revisar as alterações
propostas no CSS, dependências e componentes. Não usar `--overwrite`, `--reinstall`
ou reaplicar preset sobre primitivas personalizadas sem conciliar seu conteúdo.
Preservar tokens, variantes e semântica de links; revisar os novos defaults para
que correspondam ao Digitaliza Aí. O dry-run de Dialog mostrou que o registro também propõe substituir Button como dependência. Ao adicionar componentes, recusar a substituição de Button/Card existentes e conciliar apenas mudanças necessárias; não aceitar sobrescrita por rotina. O CLI reconhece a base como `base`, com
componentes em `@/components/ui` e utilitário em `@/lib/utils`.

Primitivas ficam em `components/ui`; composições de jornada e lógica de negócio
permanecem junto às rotas. Não transformar componentes visuais puros em Client
Components sem necessidade; Base UI define suas próprias fronteiras interativas.
Não importar código de `server` na camada de UI.

## Validação e evidências

Seguir [execução](build-and-run.md): lint, build e inspeção manual proporcional,
sem suíte automatizada. Conferir o componente adicionado e os consumidores das
primitivas que precisaram mudar. Não consumir a Groq para validar uma alteração
puramente visual. Evidência da migração original: [DEC-EQT-016](../../../docs/DECISIONS.md#dec-eqt-016).

## Fontes e origem

- [shadcn/ui para Next.js](https://ui.shadcn.com/docs/installation/next).
- [CLI e configuração](https://ui.shadcn.com/docs/cli).
- [Button Base UI e semântica de links](https://ui.shadcn.com/docs/components/base/button).
- [Card](https://ui.shadcn.com/docs/components/base/card).
- [Base UI Button](https://base-ui.com/react/components/button).

shadcn/ui e Base UI são componentes de terceiros, com código aberto sob MIT.
As versões efetivamente instaladas são registradas em `mvp/bun.lock`; atualização
não deve sobrescrever as adaptações locais silenciosamente.
