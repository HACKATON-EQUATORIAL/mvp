import type { ReactNode } from "react";
import { Eyebrow } from "@/app/_components/layout/eyebrow";
import { VoiceHelp } from "@/app/_components/voice-help";
import styles from "./journey.module.css";

type JourneyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
  actions: ReactNode;
};

export function JourneyPage({
  eyebrow,
  title,
  intro,
  children,
  actions,
}: JourneyPageProps) {
  return (
    <main tabIndex={-1} className={`${styles.page} journey-page`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.intro}>{intro}</p>
      {children && <div className={styles.content}>{children}</div>}
      <div className={styles.actions}>{actions}</div>
      <VoiceHelp key={title} />
    </main>
  );
}
