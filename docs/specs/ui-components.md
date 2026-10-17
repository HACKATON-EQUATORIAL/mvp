# Registro da entrega: componentes iniciais

**Data da referência:** 16/10/2026. **Tipo:** evidência histórica.
Contrato vigente de componentes e acessibilidade: [UI](../structure/styling-and-ui.md).
Configuração da biblioteca atual: [shadcn com Base UI](../structure/shadcn-ui.md).

## Objetivo e mudanças posteriores

A etapa inicial entregou Button, VoiceHelpButton e InfoCard separados das telas.
A fonte Inter foi uma adaptação à Roboto provisória do Figma. As props nativas,
ref, estados disabled/loading e card informativo formavam o recorte de construção.

A integração nas jornadas veio depois. Em DEC-EQT-016, Button e ActionLink
passaram para `src/components/ui`, InfoCard foi absorvido por Card e o ícone de
voz já existente no projeto foi preservado. Caminhos, SVG inline e limitações
abaixo descrevem a execução original e não são instruções atuais.

## Fontes consultadas

| Fonte | Evidência | Limite |
| --- | --- | --- |
| Extração fornecida pelo usuário | Layout de todos os três componentes; cores normal/hover de `Button`; superfícies e raios | Não informa todos os estados, textos, ícones ou tipografia |
| Consulta ao Figma em 2026-10-16 | Contexto e screenshot do nó `12:50`, chamado `MVP / Assistente de áudio` | Confirma somente `VoiceHelpButton`, não os outros dois componentes |
| Código e spec de tokens locais | Tokens CSS, Inter e receitas existentes | A composição transitória das telas não define o novo frontend |

O nó `12:50` confirma: fundo amarelo, raio pill, 184 × 52px, gap de 8px,
microfone de 24 × 24px e rótulo “Ajuda por voz” em preto. O texto está em
Roboto Bold, 16px, line-height de 22px. Sua descrição no Figma é:
“Acesso auxiliar e persistente à orientação por voz. Não substitui os controles manuais.”


## Verificação registrada na etapa original

Foram implementados `Button`, `VoiceHelpButton` e `InfoCard` em
`src/app/_components`, usando os tokens canônicos e sem integrar captura, API,
Groq ou páginas existentes. A base preserva props nativas e ref, usa `type="button"`
por padrão, trata `loading` como estado desabilitado com `aria-busy`, e mantém o
card como contêiner informativo neutro. O ícone de voz é um SVG inline local e a
tipografia usa Inter, conforme a adaptação proposta naquela etapa.

`bun run lint` e `bunx tsc --noEmit` passaram. `bun run build` e `bunx next build
--webpack` foram executados, mas o ambiente falhou antes da compilação do código:
o Turbopack não pôde criar seu processo auxiliar por `Operation not permitted` e
o Webpack não conseguiu interpretar a saída de `tsc --showConfig`. Não houve
teste em aparelho físico nem integração da ação real de ajuda por voz; a
verificação visual dos componentes deve ocorrer quando eles forem compostos em
uma jornada.


## Limites deste registro

A consulta ao nó de voz não confirma todos os componentes ou estados. Falhas de
build registradas acima descrevem aquele ambiente; builds posteriores estão nas
[decisões centrais](../../../docs/DECISIONS.md#dec-eqt-016). Não foi executada nova
verificação visual ou de captura durante a consolidação documental.
