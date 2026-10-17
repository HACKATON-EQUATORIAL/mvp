import type { ReactNode } from "react";
import { Header } from "@/app/_components/layout/header/header";
import styles from "./journey.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Header className={styles.header} />
      <div id="conteudo" tabIndex={-1} className={styles.body}>
        {children}
      </div>
    </div>
  );
}
