# Entrega: interpretação inicial com Groq

**Data:** 17/10/2026. **Escopo autorizado:** priorizar LLM; outra pessoa integra as
páginas e a prática com o backend. Ver [handoff](backend-journey-handoff.md).

## Entrega inicial (histórico)

O contrato desta primeira entrega foi ampliado abaixo. A referência vigente é o [guia de interpretação](../structure/voice-interpretation.md).

### Implementado inicialmente

- Route Handler /api/interpret exclusivo da Groq, chave privada e modelo configurável.
- Confirmar transcrição inicia interpretação com contexto/opções da página.
- Entendido leva à confirmação da ação; nenhuma navegação automática.
- Ambiguidade pede escolha; fora de escopo oferece opções; falha mantém retry,
  botões e gravação. Sem resposta de exercício ou operação real.
- IDs restritos, JSON Schema + Zod, corpo limitado, timeout, abort e respostas
  tardias invalidadas. Fechar/reabrir, novo áudio e contexto mantêm o ciclo descrito
  no [guia de manutenção e contrato](../structure/voice-interpretation.md).
- Nenhuma prévia /dev, infraestrutura de testes ou mudança no contrato STT.

## Evidência

Lint e build aprovados nesta implementação. Três chamadas manuais pela rota de
produção local, com textos de exemplo, retornaram na Groq real:

| Pedido | Resultado |
| --- | --- |
| Começar trilha de segunda via | understood, ID segunda-via |
| “Me ajuda, quero continuar”, com duas opções | ambiguous, IDs explanation e steps |
| “Pague minha conta de luz agora” | out_of_scope, IDs vazios |

O servidor dev foi reiniciado para carregar os novos módulos. Sem consumir Groq,
a rota real retornou 403 sem header, 400 para entrada inválida, 413 para corpo
acima do limite e out_of_scope para contexto sem opções. No Edge, abertura do
Drawer e confirmação manual por botão foram conferidas; esse percurso continua
independente da interpretação. Microfone físico → STT → confirmação → LLM ainda
precisa ser exercitado no celular pelo usuário; estas chamadas por texto não
comprovam essa experiência completa.

## Limites da entrega inicial (histórico)

- A outra pessoa executa o handoff Python e a validação de percurso.
- TTS, explicações livres, histórico de conversa e compreensão de esclarecimento
  por voz em múltiplos turnos não foram implementados. Uma nova gravação é um
  novo pedido, usando o mesmo contexto da página, sem recuperar turnos anteriores.


## Evolução: conversa e mapeamento de segunda via

**Autorização:** usuário aprovou implementar o plano com orientação de navegação,
memória entre páginas, listagem de disponíveis/em breve e acesso direto ao início,
meio ou fim da jornada. Confirmação por botão ou fala revisada em ambos os casos.

### Entregue

- Fonte de serviços no Python e mapa completo de segunda via composto por
  descritores junto às telas. Não importa gabarito nem cria atividade de ordenar.
- Provider/host persistentes, seis turnos em memória, último resultado e ação
  pendente. Recarregar limpa; sair de uma tela invalida autorização antiga.
- Resposta informativa, esclarecimento, proposta, confirmação, cancelamento e
  fora de escopo. Lista visual usa os dados do catálogo e distingue em breve.
- Botão ou fala escolhe uma ação; confirmação posterior autoriza navegar. Voz
  continua passando por STT e revisão. Pode pedir outro caminho enquanto confirma.
- Acesso direto à conferência/conclusão não registra execução ou aprendizagem.
- Contexto/provedor/client/UI alinhados, entrada 64 KiB e sem alteração da API STT.

### Evidência desta evolução

Quatro chamadas manuais sequenciais à Groq real retornaram HTTP 200: listagem de
serviços (information/showCatalog), pedido sobre entender segunda via
(clarification), “a primeira” (proposal correspondente à ordem anterior) e “sim,
pode abrir” (confirmation do ID pendente). O primeiro esclarecimento mostrou
alternativas menos específicas do que o esperado; o prompt foi ajustado para
explicação geral/encontrar/conferir e para não descrever uma opção diferente do ID.

No Edge pelo endereço local 3000: abertura, seleção por botão, confirmação,
navegação para a preparação e reabertura com mensagem preservada foram conferidas.
Depois, preparação → confirmação → lista de etapas preservou origem=preparacao,
inclusive nos links de explicação e retorno.
O servidor temporário 3001 permitiu conferir respostas HTTP, mas o navegador nele
não carregou o catálogo (origem diferente da configuração habitual); a validação
visual foi feita no endereço de desenvolvimento já configurado.

Lint (106 arquivos) e build Next/TypeScript aprovados. Links dos documentos desta
entrega e git diff --check conferidos. Após o ajuste de prompt, nova chamada de
esclarecimento retornou opções válidas (explicação, lista de etapas e preparação),
ainda variando do conjunto preferencial de explicações específicas. Isso registra
um limite semântico do modelo, não uma garantia de classificação exata.
Outras duas chamadas retornaram out_of_scope para Tarifa Social mesmo com ação
pendente e proposal de pratica-concluida para acesso direto ao encerramento.
Foram sete chamadas manuais à Groq nesta evolução, sem suíte ou loop automatizado.
Respostas HTTP 403 sem header e 400 com entrada inválida também foram conferidas.
No navegador, o Drawer foi inspecionado em 390×844 e 768×1024, sem clipping dos
controles observado; o override de viewport foi restaurado.

Fluxo completo com microfone físico, lista gerada por voz no Drawer, fechamento durante
permissão e interpretação em aparelho real permanecem para validação do usuário;
respostas por texto e navegação por botão não comprovam essa experiência.

### Continuidade

Integração das telas/prática Python permanece com a outra pessoa conforme
[handoff atualizado](backend-journey-handoff.md). TTS e explicações didáticas no
Drawer ficam fora desta entrega. Não há prévia /dev ou infraestrutura de testes.

### Ajuste de apresentação

Respostas bem-sucedidas mostram texto seguido apenas dos botões pertinentes. Na
listagem, trilhas em breve ficam na mensagem, sem linhas adicionais entre botões.
Removidos o título genérico e o botão auxiliar “Ver opções da tela” dessa resposta.
Confirmação, carregamento e falhas preservam os controles específicos.

### Fluxo simplificado (DEC-EQT-027)

Por pedido do usuário, removida revisão obrigatória após STT. A interpretação
inicia automaticamente e a última transcrição aparece discretamente em duas
linhas. Botões e intenções claras navegam direto; ambiguidade pede escolha.
Confirmação extra é conservada somente para sair de prática guiada, individual
ou conferência para outra tela, pelo risco de interromper a atividade.
Removidos os componentes de revisão/transcrição que ficaram sem consumidores.
STT e o formato público da LLM permanecem compatíveis; proposal passa a representar
uma ação reconhecida, executável pelo cliente, com guard local de interrupção.
Cancelamento/fechamento continuam invalidando operações e permissões tardias.

Validação do fluxo simplificado: lint e build aprovados (104 arquivos no Biome).
No Edge, o botão da trilha na home abriu diretamente a preparação, sem confirmação.
A saída pelo assistente na prática guiada foi conferida com o guard de interrupção.
Não houve nova chamada à Groq nesta simplificação; captura física → STT →
interpretação automática ainda precisa ser exercitada pelo usuário no celular.

### Catálogo restrito ao que existe

Por correção explícita do usuário, o assistente recebe somente segunda via,
quando disponível. Não anunciar outras trilhas ou recursos “em breve”, mesmo que
essas entradas existam no catálogo Python ou no histórico anterior da conversa.
O servidor normaliza a apresentação da listagem e a UI mantém somente os botões
das ações disponíveis. O catálogo bruto do backend e a home não foram alterados.

### Memória por página (DEC-EQT-029)

Conversa preservada somente ao fechar/reabrir na mesma página, mantendo a resposta
e seus botões utilizáveis. Navegação e alteração de parâmetros do contexto limpam
histórico, transcrição, resposta e autorização pendente. Removida a mensagem
sintética “Você abriu…”. No destino, oferecer as sugestões da nova tela.
O usuário dispensou “Nova conversa”: uma nova fala pode mudar de assunto.

Validação desta mudança: lint e build aprovados (104 arquivos no Biome), diff sem
erros de whitespace. No Edge, home → botão da trilha → reabrir exibiu as sugestões
da preparação, sem “Você abriu…”, transcrição antiga ou botão de reinício.
Fechar/reabrir na preparação manteve os botões locais. A preservação de resposta
LLM na mesma página e a mudança de assunto por áudio aguardam exercício físico
pelo usuário; não houve nova chamada à Groq nesta alteração de estado/UI.
