import type { TrackBundle } from "@/schemas/http/track";

// Falas que não dependem da LLM: o script `voice:generate` gera um áudio para
// cada uma (public/voz) e o app toca o arquivo na hora, sem gastar créditos.
// Ao criar uma fala fixa nova, adicione aqui (ou no conteúdo do backend) e rode
// o script de novo.

/** Fim da demonstração (etapa 1). */
export const END_SPEECH =
  "Viu como é simples? Quando quiser, vamos praticar na etapa 2.";

/** Pedido do assistente para a tela em que a pessoa já está. */
export const SAME_SCREEN_MESSAGE =
  "Você já está nesta tela. Posso ajudar com outra coisa?";

/** Ajuda local sem nada mais específico na tela. */
export const DEFAULT_HELP = "Toque em uma das opções abaixo.";

/** Boas-vindas ao entrar no site (home): o que dá para fazer aqui. */
export const HOME_INTRO =
  "Oi, eu sou o Eletriquinho! Aqui você treina o atendimento digital da Equatorial. Escolha um serviço e eu te ajudo em cada passo.";

/** Escolha do canal: deixa claro que é treino antes de qualquer atendimento. */
export const CHANNEL_INTRO =
  "Aqui é treino: nada vai para a Equatorial de verdade. Escolha onde quer aprender.";

export const FRONT_PHRASES = [
  END_SPEECH,
  SAME_SCREEN_MESSAGE,
  DEFAULT_HELP,
  HOME_INTRO,
  CHANNEL_INTRO,
];

/** Falas que vêm do conteúdo do serviço (narração, dicas, lições, dificuldades). */
export function bundlePhrases(bundle: TrackBundle) {
  return [
    ...bundle.simulations.flatMap((simulation) =>
      simulation.steps.map((step) => step.instruction),
    ),
    ...bundle.practice.items.flatMap((item) => [
      item.hint,
      item.explanation.text,
    ]),
    ...bundle.steps.map((step) => step.explanation.text),
    ...bundle.difficulties.map((item) => item.guidance),
  ];
}
