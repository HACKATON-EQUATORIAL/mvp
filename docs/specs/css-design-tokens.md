# Registro da entrega: tokens CSS

**Data original:** 16/10/2026. **Tipo:** evidência histórica, não guia de manutenção.
O catálogo e as regras vigentes foram consolidados no [design system](../structure/design-system.md).
Código: `src/app/globals.css` e `src/app/layout.tsx`, relativos à raiz de `mvp`.

## Objetivo e resultado da etapa

Adotar os valores da extração fornecida pelo usuário como tokens semânticos,
escalas e receitas, com fonte Inter. A implementação foi mantida manualmente,
sem gerador JSON. A receita tag foi elevada de 9px observados para 12px;
primitivas pequenas permaneceram catalogadas, sem autorização de uso em texto
informativo. Aliases antigos foram removidos junto da migração de consumidores.

A descrição original de Tailwind expor apenas background/foreground foi superada
pela adoção shadcn de [DEC-EQT-016](../../../docs/DECISIONS.md#dec-eqt-016).
Da mesma forma, referências a título transitório e ausência de `docs` pertencem
ao checkout original, não ao estado atual. Não houve nova consulta externa ou
nova verificação visual ao consolidar este registro em 17/10/2026.

## Origem e limites da evidência

Os valores desta proposta foram fornecidos como extração de
`https://ma.equatorialenergia.com.br/` realizada em 2026-10-15, a partir das
variáveis de `:root` e de estilos computados da home. Esta especificação não
revalida a página externa, não declara licença sobre os elementos visuais e não
prova que todos os valores pertencem a um design system oficial. A adoção no
Digitaliza Aí depende da aprovação do projeto e das verificações descritas aqui.

## Cálculo registrado na etapa original

Verificação inicial dos pares propostos, calculada em sRGB:

| Par | Contraste | Resultado para texto comum |
| --- | --- | --- |
| `--header-bg` / `--text-on-brand` | `12.96:1` | Aprovado |
| `--primary-500` / branco | `16.22:1` | Aprovado |
| `--cta-bg` / `--cta-text` | `14.97:1` | Aprovado |
| `--text-body` / `--surface-page` | `11.20:1` | Aprovado |
| `--text-muted` / `--surface-page` | `7.81:1` | Aprovado |
| `--text-subtle` / `--surface-page` | `4.74:1` | Aprovado no limite |
| `--card-service-title-hover` / `--card-service-bg-hover` | `9.40:1` | Aprovado |
| `--warning-500` / branco | `3.79:1` | Reprovado para texto comum |

Uma cor primitiva aprovada em um par não está aprovada em todos os fundos.
Estados de erro, sucesso, alerta e gravação DEVEM combinar cor com texto, ícone
ou outra pista perceptível.


## Manutenção

Para valores, nomes, receitas, aliases, fonte e novos consumidores, consultar
somente o [guia vigente](../structure/design-system.md). A evidência acima é
datada, não valida todos os estados e componentes atuais.
