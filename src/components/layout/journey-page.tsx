import type { ReactNode } from "react";
import { Eyebrow } from "@/components/layout/eyebrow";
import { VoiceHelp } from "@/components/voice/voice-help";
import type { VoicePageContext } from "@/components/voice/voice-page-context";
import styles from "./journey.module.css";

type JourneyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
  actions: ReactNode;
  voiceContext?: VoicePageContext;
  voiceSlot?: ReactNode;
};

export function JourneyPage({
  eyebrow,
  title,
  intro,
  children,
  actions,
  voiceContext,
  voiceSlot,
}: JourneyPageProps) {
  return (
    <main tabIndex={-1} className={`${styles.page} journey-page`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.intro}>{intro}</p>
      {children && <div className={styles.content}>{children}</div>}
      <div className={styles.actions}>{actions}</div>
      {voiceSlot ??
        (voiceContext ? <VoiceHelp context={voiceContext} /> : null)}
    </main>
  );
}
