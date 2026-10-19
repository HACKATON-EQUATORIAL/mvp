"use client";

import { Globe, MessageCircle } from "lucide-react";
import { ChoiceCard, choiceCardStyles } from "@/components/layout/choice-card";
import { useIntroSpeech } from "@/hooks/use-intro-speech";
import { useGetBundle } from "@/http/track/get-bundle";
import { CHANNEL_INTRO } from "@/lib/tts/fixed-phrases";
import { routes } from "../_lib/navigation";
import { TRACK_ID } from "../_lib/steps";
import { LoadState } from "./load-state";

const icons = { whatsapp: MessageCircle, site: Globe } as const;
const hrefs: Record<string, string> = { whatsapp: routes.whatsapp };

// Textos do treino (o conteúdo do backend descreve o serviço real, e as pessoas
// achavam que iriam direto para o atendimento).
const training: Record<string, { title: string; description: string }> = {
  whatsapp: {
    title: "Treinar no WhatsApp",
    description:
      "Aprenda a pedir a segunda via com a Clara num WhatsApp de treino. Nada é enviado de verdade.",
  },
  site: {
    title: "Treinar no site (Agência Virtual)",
    description: "Aprenda a pegar a conta pelo site.",
  },
};
const STEPS = "Ver · Praticar · Fazer sozinho · 5 min";

/** Escolha do canal para treinar: só os disponíveis abrem; os demais ficam “Em breve”. */
export function ChannelChoice() {
  // Esta é a única busca de conteúdo da jornada; as próximas telas leem do cache.
  const bundle = useGetBundle(TRACK_ID);

  // Ao abrir, o Eletriquinho avisa que é treino.
  useIntroSpeech(CHANNEL_INTRO);

  if (!bundle.data)
    return (
      <LoadState error={bundle.isError} onRetry={() => void bundle.refetch()} />
    );
  return (
    <ul className={choiceCardStyles.list} aria-label="Canais">
      {bundle.data.channels.map((channel) => (
        <li key={channel.id}>
          <ChoiceCard
            href={
              channel.status === "available" ? hrefs[channel.id] : undefined
            }
            icon={icons[channel.id as keyof typeof icons] ?? Globe}
            tone={channel.id === "whatsapp" ? "whatsapp" : "brand"}
            title={training[channel.id]?.title ?? channel.label}
            description={
              training[channel.id]?.description ?? channel.description
            }
            tag="Treino"
            meta={channel.status === "available" ? STEPS : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
