import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeChat } from "@/app/servicos/segunda-via/_components/practice-chat";
import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import { PARTS, partBySlug } from "@/app/servicos/segunda-via/_lib/steps";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

type Props = { params: Promise<{ parte: string }> };

export function generateStaticParams() {
  return PARTS.map((part) => ({ parte: part.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const part = partBySlug((await params).parte);
  return { title: part ? `Etapa 2: ${part.label}` : "Etapa 2" };
}

export default async function Page({ params }: Props) {
  const part = partBySlug((await params).parte);
  if (!part) notFound();
  const number = PARTS.indexOf(part) + 1;
  const voiceContext: VoicePageContext = {
    id: `segunda-via.parte.${part.slug}`,
    description: `Etapa 2, parte ${number} de ${PARTS.length}: ${part.label}. Responda à Clara no chat simulado; errar é normal e dá para pedir dica.`,
    tip: "Leia como funciona e responda à Clara. Se travar, peça uma dica.",
    suggestions: [
      {
        id: "map",
        label: "Ver as etapas",
        confirmation: "Você quer voltar ao mapa das etapas?",
        href: routes.whatsapp,
      },
    ],
  };
  return (
    <JourneyPage
      eyebrow={`ETAPA 2 DE 3 · PARTE ${number} DE ${PARTS.length}`}
      title={part.label}
      intro="Faça só esta parte da conversa. Pode errar: eu ajudo."
      voiceContext={voiceContext}
      actions={null}
    >
      <PracticeChat part={part.slug} />
    </JourneyPage>
  );
}
