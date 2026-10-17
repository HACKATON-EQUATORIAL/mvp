import type { Step } from "./navigation";

export const entry = {
  eyebrow: "SEGUNDA VIA",
  title: "Como podemos ajudar?",
  intro:
    "Escolha o que você precisa agora. Leia as orientações e pratique no seu ritmo.",
  cardTitle: "Aqui você aprende",
  cardBody:
    "Aprenda a obter outra via da conta e pratique no seu ritmo, em um exemplo demonstrativo.",
};

export const practiceFeedback = {
  guided: "Neste exemplo, procure Segunda via.",
  individual:
    "Consultar débitos é outro serviço. Você pode escolher novamente ou pedir ajuda.",
  hint: "Para obter outra via da conta neste exemplo, escolha Segunda via.",
};

export const steps: Record<
  Step,
  { title: string; intro: string; explanation: string }
> = {
  encontrar: {
    title: "Como encontrar segunda via",
    intro:
      "Segunda via é outra via da conta. Procure esse nome entre os serviços disponíveis.",
    explanation:
      "Neste exemplo, escolha Segunda via quando precisar de outra via da conta. Consultar débitos é uma opção diferente. O caminho no canal real ainda precisa ser confirmado.",
  },
  conferir: {
    title: "Como conferir o resultado",
    intro:
      "Antes de continuar, confira se o período e a identificação correspondem à conta que você procura.",
    explanation:
      "Na conta de exemplo, observe o período e a identificação apresentados. No serviço real, confira as informações relevantes antes de utilizar o documento. Esta orientação é provisória.",
  },
};
