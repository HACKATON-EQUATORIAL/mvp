// Respostas do assistente que não dependem da LLM (servidor e navegador). Ficam
// aqui para o script `voice:generate` pré-gerar o áudio de todas elas.

/** “Sim” curto com ação pendente (resolvido no servidor, sem LLM). */
export const CONFIRM_OPEN = "Combinado, abrindo.";
/** “Não” curto com ação pendente. */
export const CANCEL_OPEN =
  "Tudo bem, não vou abrir. Posso ajudar com outra coisa?";
/** A LLM sugeriu só opções já recusadas. */
export const NO_OTHER_SCREEN =
  "Não encontrei outra tela que combine com isso. Tente explicar de outro jeito ou escolha uma opção.";
export const CATALOG_ONE = "Este é o serviço disponível para aprender:";
export const CATALOG_NONE =
  "Não há serviços disponíveis para acessar no momento.";
export const CATALOG_ERROR =
  "Não consegui consultar os serviços agora. Tente novamente.";
/** Resposta que entregaria a opção certa da prática, sem dica no item. */
export const NO_ANSWER_FALLBACK =
  "Leia a mensagem da Clara com calma e escolha a opção que combina com o seu pedido.";

export const ASSISTANT_PHRASES = [
  CONFIRM_OPEN,
  CANCEL_OPEN,
  NO_OTHER_SCREEN,
  CATALOG_ONE,
  CATALOG_NONE,
  CATALOG_ERROR,
  NO_ANSWER_FALLBACK,
];

const lower = (label: string) => label.toLocaleLowerCase("pt-BR");

/** Fala hesitante vira pergunta, nunca navegação direta. */
export const didYouMean = (label: string) =>
  `Você quis dizer: ${lower(label)}?`;

/**
 * Sair de uma prática em andamento. Sem “pergunta X de Y” para cada botão ter
 * uma fala só (pré-gerada); o progresso fica salvo de todo jeito.
 */
export const leaveConfirmation = (label: string) =>
  `Se sair agora, pode continuar a prática depois de onde parou. Quer ir para ${lower(label)}?`;

/** Falas que dependem só do nome do botão (uma por destino possível). */
export const labelPhrases = (labels: string[]) =>
  labels.flatMap((label) => [didYouMean(label), leaveConfirmation(label)]);
