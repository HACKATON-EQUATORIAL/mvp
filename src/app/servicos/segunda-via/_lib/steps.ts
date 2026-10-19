import { routes } from "./navigation";

export const TRACK_ID = "segunda-via";

// Partes da etapa 2: slug curto na URL ↔ ID da etapa no conteúdo da API.
export const PARTS = [
  {
    slug: "menu",
    stepId: "encontrar-servico",
    label: "Escolher a segunda via",
  },
  {
    slug: "documento",
    stepId: "informar-documento",
    label: "Informar o documento",
  },
  { slug: "fatura", stepId: "escolher-fatura", label: "Escolher a fatura" },
  { slug: "conferir", stepId: "conferir-resultado", label: "Conferir e pagar" },
] as const;

export type PartSlug = (typeof PARTS)[number]["slug"];

export const partHref = (slug: PartSlug) => `${routes.licoes}/${slug}`;

export function partBySlug(slug: string) {
  return PARTS.find((part) => part.slug === slug) ?? null;
}

/** O que a parte ensina (contexto do assistente e fala pré-gerada da ajuda). */
export const partTeaches = (number: number, label: string) =>
  `Parte ${number} de ${PARTS.length} da prática: ${label}. A pessoa responde à Clara no chat simulado e recebe feedback na hora.`;
