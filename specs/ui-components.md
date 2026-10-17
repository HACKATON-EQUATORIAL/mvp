# SPEC — componentes de UI do Digitaliza Aí

> Atualização do usuário em 17/10/2026: todos os botões habilitados e links de
> ação usam fundo branco e texto azul por padrão; no hover com ponteiro adequado,
> fundo azul e texto branco. Isso inclui os controles do gravador. “Ajuda por voz”
> permanece amarelo, com texto e ícone pretos, inclusive no hover, conforme
> correção posterior do usuário. Disabled/loading conservam os estados de
> indisponibilidade. Esta regra prevalece sobre as cores históricas de normal/hover.


| Campo | Valor |
| --- | --- |
| Status | Implementada; verificação registrada ao final |
| Versão | 0.1 |
| Data | 2026-10-16 |
| Abordagem | Mobile first |
| Fundação | [Contrato de tokens CSS](css-design-tokens.md) |
| Referência visual | [Figma · Dev Mode · nó 12:50](https://www.figma.com/design/S8I4KGRBr6zFCIqHIpkt2A/Hackathon--c%C3%B3pia-?node-id=12-50&m=dev) |

## 1. Objetivo e escopo

Especificar os primeiros elementos reutilizáveis da aplicação: `Button`,
`VoiceHelpButton` e `InfoCard`. Eles devem permitir compor as futuras telas com
identidade visual, comportamento e acessibilidade consistentes.

A estrutura atual do frontend será substituída. Seus componentes, dimensões de
página e organização visual não são referência obrigatória para o novo design.
Esta entrega define os componentes, sem redesenhar páginas ou migrar consumidores.
As fronteiras de servidor e os contratos funcionais existentes continuam vigentes.

Inclui contratos de composição, medidas, estados, tokens, responsividade e aceite.
Não inclui novas jornadas, biblioteca visual, Storybook, tema escuro, navegação
por voz, interpretação por LLM, TTS ou integração com serviços oficiais.

Os termos **DEVE**, **NÃO DEVE** e **PODE** indicam requisito, proibição e opção.
Requisitos além da evidência visual são propostas desta spec, sujeitos à revisão.

## 2. Evidências e consulta ao Dev Mode

### 2.1 Fontes disponíveis

| Fonte | Evidência | Limite |
| --- | --- | --- |
| Extração fornecida pelo usuário | Layout de todos os três componentes; cores normal/hover de `Button`; superfícies e raios | Não informa todos os estados, textos, ícones ou tipografia |
| Consulta ao Figma em 2026-10-16 | Contexto e screenshot do nó `12:50`, chamado `MVP / Assistente de áudio` | Confirma somente `VoiceHelpButton`, não os outros dois componentes |
| Código e spec de tokens locais | Tokens CSS, Inter e receitas existentes | A composição transitória das telas não define o novo frontend |

O nó `12:50` confirma: fundo amarelo, raio pill, 184 × 52px, gap de 8px,
microfone de 24 × 24px e rótulo “Ajuda por voz” em preto. O texto está em
Roboto Bold, 16px, line-height de 22px. Sua descrição no Figma é:
“Acesso auxiliar e persistente à orientação por voz. Não substitui os controles manuais.”

### 2.2 Consulta permitida durante a implementação

A implementação PODE visitar o Dev Mode do link fornecido para obter contexto,
inspecionar componentes, variantes, propriedades, tipografia e exportar assets.
Essa consulta deve ser somente leitura; esta spec não solicita editar o Figma.

Antes de implementar cada componente:

1. Localizar seu componente ou variante no Figma; registrar nó e data consultados.
2. Conferir medidas, textos, ícones, cores de texto e estados contra esta spec.
3. Usar contexto estruturado e screenshot como referência visual, adaptando a
   implementação à stack e aos tokens locais.
4. Registrar diferenças e detalhes ausentes. Não tratar um valor deduzido como
   confirmado pelo design; se o acesso falhar, declarar a limitação.
5. Exportar somente os assets necessários à implementação para arquivos locais;
   URLs temporárias do Figma não podem ser dependências em runtime.

Não é necessário baixar assets nesta etapa documental. O link de `12:50` não
deve ser registrado como confirmação visual de `Button` ou `InfoCard`.

### 2.3 Divergência tipográfica

O contrato atual adota Inter, mas `VoiceHelpButton` no Figma usa Roboto Bold.
**Proposta:** manter Inter nesta primeira família de componentes, preservando
16px, peso 700 e line-height de 22px para “Ajuda por voz”. Essa adaptação precisa
de revisão visual e não representa fidelidade tipográfica exata ao Figma.
Se Roboto for exigida, revisar o contrato de fontes em tarefa explícita, sem
carregar uma segunda família silenciosamente.

## 3. Regras compartilhadas

### 3.1 Mobile first e dimensões

- Estilos base devem atender telas pequenas; ajustes para larguras maiores são
  progressivos. Desktop não deve ser simplesmente reduzido para caber no mobile.
- As larguras extraídas são referências no tamanho do frame, não mínimos rígidos.
  Nenhum componente pode exceder a largura útil do contêiner.
- `Button` e `InfoCard` devem ocupar a largura disponível até suas referências
  de 350px e 358px, respectivamente, por padrão. `VoiceHelpButton` tem largura
  preferencial de 184px, limitada ao espaço disponível. A composição pode ampliar
  essas larguras explicitamente, sem alterar tokens ou CSS global das páginas.
- Botões têm altura visual de 52px com conteúdo padrão. Implementar como altura
  mínima; texto ampliado ou multilinha deve permitir crescimento vertical.
- Usar `box-sizing: border-box`: bordas e padding fazem parte das medidas.
  Padding horizontal dos botões deve ser conferido no Dev Mode; na ausência de
  valor, propor 16px e registrar a adaptação. O card tem padding confirmado.
- Não truncar informação essencial nem comprimir texto para preservar uma medida.
  `InfoCard` tem altura determinada pelo conteúdo.
- Validar 320, 375, 390 e 414px; complementar com 768 e 1280px. Não criar
  breakpoints por componente sem necessidade demonstrada pelo conteúdo.

### 3.2 Tokens

Mapear os nomes exportados do Figma para os nomes canônicos existentes:

| Figma | CSS da aplicação | Valor de referência |
| --- | --- | --- |
| `--full` | `--radius-full` | 999px |
| `--md` em radius | `--radius-md` | 8px |
| `--sm` em padding | `--spacing-sm` | 16px |
| `--xxs` em gap | `--spacing-xxs` | 8px |
| `--primary-500` | `--primary-500` | #040F6D |
| `--border-default` | `--border-default` | #E0E0E0 |
| `--surface-page` | `--surface-page` | #FFFFFF |
| `--cta-bg` | `--cta-bg` | #FFD700 |
| `--card-service-bg` | `--card-service-bg` | #EFF3FF |

Não criar aliases ambíguos como `--md` nem duplicar a paleta. Para `Button`,
propor aliases de componente para fundo, borda e texto normal/hover, seguindo
`--button-{propriedade}-{estado?}` e referenciando a fundação existente.
52px e as larguras de referência podem ser medidas locais documentadas;
não precisam virar tokens globais por antecipação.

### 3.3 Semântica e acessibilidade

- Ações usam `<button>` nativo, com `type="button"` por padrão e suporte a
  `submit` quando solicitado pelo consumidor. Navegação usa links semânticos;
  não transformar esta API de botão em link por conveniência visual.
- Preservar atributos nativos, `aria-*`, foco, teclado, nome acessível e ref.
  Rótulos visíveis devem fazer parte do nome acessível.
- Enter e Espaço acionam botões; Tab alcança apenas controles habilitados.
  Não implementar controles com `div` e handlers de teclado manuais.
- Foco deve ser visível com `:focus-visible` e tokens de foco, sem alterar
  dimensões. Verificar contraste do indicador na superfície onde for usado.
- Garantir contraste mínimo de 4,5:1 para texto normal e 3:1 para indicadores
  essenciais. A borda cinza clara não deve ser a única pista de interatividade.
- Hover só se aplica em dispositivos com hover e ponteiro adequado; funções
  essenciais devem continuar disponíveis por toque e teclado.
- Estados pressionado, foco e desabilitado não dependem apenas de mudança de cor.
  Não usar opacidade global que torne o conteúdo ilegível.
- Transições devem usar tokens existentes e respeitar `prefers-reduced-motion`.
- Não acrescentar `use client` em toda a família por padrão; restringir a fronteira
  aos consumidores que precisam de eventos ou APIs do navegador.

## 4. Button

### 4.1 Visual confirmado pela extração

| Propriedade | Normal | Hover |
| --- | --- | --- |
| Display | flex | igual |
| Largura de referência | 350px | igual |
| Altura de referência | 52px | igual |
| Alinhamento | centro nos dois eixos | igual |
| Raio | `--radius-full` | igual |
| Borda | 1px solid `--primary-500` | 1px solid `--border-default` |
| Fundo | `--primary-500` | `--surface-page` |

Normal e hover são estados do mesmo botão. Esta extração não define uma variante
secundária/outline independente.

**Propostas para completar o contrato:** texto normal `--text-on-brand` e texto
no hover `--primary-500`. Tipografia inicial `.text-cta-label`, sujeita à consulta
do nó específico; a extração não confirma esses atributos. O hover não pode
manter texto branco sobre fundo branco.

### 4.2 API e comportamento propostos

- `children`: rótulo/conteúdo visível obrigatório; não aceitar botão sem nome.
- Props nativas de botão, incluindo `disabled`, `type`, `onClick`, `aria-*`,
  `className` e ref. Não introduzir `asChild` ou API polimórfica neste recorte.
- `loading?: boolean`, padrão `false`: impedir acionamentos repetidos, expor
  `aria-busy` e manter um rótulo compreensível e a estabilidade do layout.
- `disabled || loading` impede ativação. Usar semântica nativa de desabilitado;
  o consumidor deve fornecer feedback de andamento em região de status quando
  necessário, sem depender de um controle desabilitado para anunciar mudanças.

| Estado | Resultado exigido | Origem |
| --- | --- | --- |
| Normal | Aparência azul e texto legível | Extração + proposta de texto |
| Hover | Fundo branco, borda cinza, texto legível | Extração + proposta de texto |
| Focus-visible | Indicador de foco sem deslocamento | Requisito de acessibilidade |
| Pressionado | Feedback perceptível enquanto acionado; sem deslocar layout | Proposta; conferir aparência no Figma |
| Disabled | Sem ativação; aparência distinta, texto legível | Proposta; conferir aparência no Figma |
| Loading | Sem duplicação de ação, estado ocupado e feedback compreensível | Proposta funcional |

Na ausência de variante disabled no design, propor `--surface-muted`,
`--text-muted` e `--border-default`. Hover não se aplica a disabled/loading.

## 5. VoiceHelpButton

### 5.1 Visual

| Propriedade | Contrato |
| --- | --- |
| Display | flex |
| Dimensões de referência | 184 × 52px |
| Alinhamento | centro nos dois eixos |
| Gap | `--spacing-xxs` (8px) |
| Raio | `--radius-full` (999px) |
| Fundo | `--cta-bg` (#FFD700) |
| Texto | `--cta-text`, rótulo “Ajuda por voz” |
| Ícone | Microfone de 24 × 24px, à esquerda |
| Tipografia observada | Roboto Bold, 16px/22px; adaptação proposta na seção 2.3 |

### 5.2 Composição e limites

Compor a base acessível de botão com apresentação própria. Não herdar o hover
branco de `Button`. Como proposta, usar `--cta-bg-hover` para hover; o Figma
consultado não confirmou essa aparência nem estados pressionado/desabilitado.
Reutilizar as regras de foco, disabled e loading, quando aplicáveis.

O ícone deve ser exportado do Figma ou corresponder exatamente a um asset local
existente. É decorativo (`aria-hidden`) porque o rótulo já identifica a ação;
não substituir o rótulo por um botão só com ícone neste recorte.

Contrato público: rótulo padrão “Ajuda por voz”, `onClick` fornecido pelo
consumidor e props nativas compatíveis com a base. Não encapsular captura,
requisições STT, síntese de voz ou decisões de navegação neste componente.
Sem uma ação real fornecida, não publicar um controle aparentemente funcional;
a revisão isolada pode usar feedback local de demonstração, identificado como tal.

A intenção de acesso persistente descrita no Figma orienta a futura composição
de páginas. Não implica `position: fixed` no próprio botão: posição, safe area e
reserva de espaço pertencem ao layout e serão definidas no retrabalho das telas.
O botão não deve cobrir conteúdo ou impedir controles manuais.

## 6. InfoCard

### 6.1 Visual confirmado pela extração

| Propriedade | Contrato |
| --- | --- |
| Display | flex |
| Largura de referência | 358px |
| Padding | `--spacing-sm` (16px) |
| Direção | coluna |
| Alinhamento | flex-start |
| Gap | `--spacing-xxs` (8px) |
| Raio | `--radius-md` (8px) |
| Fundo | `--card-service-bg` (#EFF3FF) |
| Altura | automática, conforme conteúdo |

### 6.2 Contrato de conteúdo proposto

- `children` obrigatório para conteúdo informativo; `className` e atributos HTML
  do contêiner para composição e associação acessível.
- Contêiner neutro por padrão, sem `role="button"`, `tabIndex`, clique na área
  inteira, hover interativo ou região viva automática.
- Título, texto e ações são composição do consumidor. Quando houver título,
  usar heading com nível adequado à página; não fixar `h2` na base.
- Propor `.text-card-title`/`--text-heading` para títulos e
  `.text-body`/`--text-body` para conteúdo, até conferir a tipografia no Dev Mode.
- Links ou botões internos devem ter semântica e foco próprios. Não aninhar
  controles dentro de outro controle interativo.
- Conteúdo longo deve quebrar linha e expandir altura. Não aplicar altura fixa,
  truncamento automático ou rolagem interna ao card informativo.

Um card de serviço clicável, alerta, aviso ou card com seleção exige contrato
específico; a existência do token `--card-service-bg-hover` não torna `InfoCard`
interativo automaticamente.

## 7. Implementação futura

1. Resolver as pendências visuais da seção 8 e conferir tokens existentes.
2. Consultar a documentação pertinente da versão Next.js instalada em
   `node_modules/next/dist/docs/` antes de escrever código.
3. Implementar a base de botão, sua composição de voz e o card com TypeScript,
   React e o CSS/Tailwind já instalados. Não adicionar dependências por rotina.
4. Usar nomes de arquivo kebab-case e exports explícitos. A localização inicial
   deve seguir [as convenções vigentes](../docs/structure/src-structure-and-conventions.md),
   em `src/app/_components`, sem criar uma árvore de camadas vazias. Essa escolha
   não define a arquitetura definitiva do novo frontend.
5. Verificar os componentes em composição isolada e representativa, sem substituir
   as telas atuais nesta entrega. Não publicar rota de catálogo por antecipação.
6. Integrar às jornadas somente em um recorte posterior, preservando captura,
   cancelamento, permissão tardia e liberação de tracks quando forem afetados.

Não criar pasta `tests`, suítes automatizadas, script de teste ou dependências
de teste. A futura implementação deve executar `bun run lint`, `bun run build`
e verificação manual proporcional, conforme o [workflow](../agent-workflow.md).

## 8. Pendências para revisão

| Questão | Encaminhamento |
| --- | --- |
| Nós de `Button` e `InfoCard` | Localizar no Dev Mode; registrar links específicos, sem inventar IDs |
| Fonte Roboto no botão de voz versus Inter local | Revisar a adaptação proposta antes de declarar fidelidade visual |
| Tipografia e cores de texto dos outros componentes | Conferir no Figma; propostas estão identificadas nas seções 4 e 6 |
| Estados não fornecidos | Conferir variantes e validar propostas de foco, active, disabled e loading |
| Padding dos botões | Conferir medidas internas; 16px é proposta de fallback |
| Ação real de ajuda por voz | Definir em jornada própria; não está implementada por esta spec |

Este documento não aprova uma nova arquitetura de frontend. Decisões relevantes
aprovadas devem ser registradas no DECISIONS central, com IDs `DEC-EQT-*`.
O caminho `../docs/DECISIONS.md` não está disponível neste workspace na data da
redação; não foi criado arquivo de decisões paralelo.

## 9. Critérios de aceite da implementação

- Os três componentes podem ser compostos sem importar captura, API, Groq ou
  regras de uma tela específica.
- Os valores confirmados são reproduzidos no tamanho de referência; adaptações
  e pendências visuais têm registro explícito.
- Hover de `Button` é um estado, com texto legível sobre branco; o botão de voz
  mantém sua apresentação própria.
- Nenhum componente causa rolagem horizontal nas larguras da seção 3.1,
  incluindo rótulos longos, conteúdo extenso e texto ampliado a 200%.
- Botões preservam alvo mínimo de 52px e crescem quando o conteúdo exigir;
  largura de referência não impede o uso em telas de 320px.
- Teclado, foco visível, toque, nomes acessíveis, disabled e loading foram
  verificados; estados indisponíveis não acionam callbacks.
- Contraste e movimento reduzido foram conferidos. Texto, ícone e bordas não
  mudam involuntariamente o tamanho entre estados.
- O card permanece informativo e não recebe semântica interativa automática.
- Assets utilizados são locais; estilos usam tokens canônicos sem aliases
  ambíguos, valores de legado ou paleta duplicada.
- `bun run lint` e `bun run build` passam na entrega de código. O registro manual
  informa viewports, estados conferidos, comparação com o Figma e limitações.

## 10. Verificação da implementação

Foram implementados `Button`, `VoiceHelpButton` e `InfoCard` em
`src/app/_components`, usando os tokens canônicos e sem integrar captura, API,
Groq ou páginas existentes. A base preserva props nativas e ref, usa `type="button"`
por padrão, trata `loading` como estado desabilitado com `aria-busy`, e mantém o
card como contêiner informativo neutro. O ícone de voz é um SVG inline local e a
tipografia usa Inter, conforme a adaptação proposta na seção 2.3.

`bun run lint` e `bunx tsc --noEmit` passaram. `bun run build` e `bunx next build
--webpack` foram executados, mas o ambiente falhou antes da compilação do código:
o Turbopack não pôde criar seu processo auxiliar por `Operation not permitted` e
o Webpack não conseguiu interpretar a saída de `tsc --showConfig`. Não houve
teste em aparelho físico nem integração da ação real de ajuda por voz; a
verificação visual dos componentes deve ocorrer quando eles forem compostos em
uma jornada.
