import type { ReactNode } from "react";
import { BadgeMoment } from "@/components/brand/badge-moment";
import { Header } from "@/components/layout/header/header";
import { VoiceAssistantHost } from "@/components/voice/voice-assistant-host";
import styles from "./journey.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Header className={styles.header} />
      <div id="conteudo" tabIndex={-1} className={styles.body}>
        {children}
      </div>
      <VoiceAssistantHost />
      <BadgeMoment />
    </div>
  );
}
