"use client";

import { ChevronRight, Globe, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useGetBundle } from "@/http/track/get-bundle";
import { routes } from "../_lib/navigation";
import { TRACK_ID } from "../_lib/steps";
import styles from "./channel-choice.module.css";
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
    <ul className={styles.list} aria-label="Canais">
      {bundle.data.channels.map((channel) => {
        const Icon = icons[channel.id as keyof typeof icons] ?? Globe;
        const href = hrefs[channel.id];
        const content = (
          <>
            <span className={styles.icon} aria-hidden="true">
              <Icon size={28} />
            </span>
            <span className={styles.text}>
              <strong>{channel.label}</strong>
              <span>{channel.description}</span>
            </span>
            {channel.status === "available" && href ? (
              <ChevronRight size={22} aria-hidden="true" />
            ) : (
              <span className={styles.soon}>Em breve</span>
            )}
          </>
        );
        return (
          <li key={channel.id}>
            {channel.status === "available" && href ? (
              <Link href={href} className={styles.card}>
                {content}
              </Link>
            ) : (
              <div className={styles.card} aria-disabled="true">
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
