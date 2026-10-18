"use client";

import { Globe, MessageCircle } from "lucide-react";
import { ChoiceCard, choiceCardStyles } from "@/components/layout/choice-card";
import { useGetBundle } from "@/http/track/get-bundle";
import { routes } from "../_lib/navigation";
import { TRACK_ID } from "../_lib/steps";
import { LoadState } from "./load-state";

const icons = { whatsapp: MessageCircle, site: Globe } as const;
const hrefs: Record<string, string> = { whatsapp: routes.whatsapp };

/** Escolha do canal para aprender: só os disponíveis abrem; os demais ficam “Em breve”. */
export function ChannelChoice() {
  // Esta é a única busca de conteúdo da jornada; as próximas telas leem do cache.
  const bundle = useGetBundle(TRACK_ID);
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
            title={channel.label}
            description={channel.description}
          />
        </li>
      ))}
    </ul>
  );
}
