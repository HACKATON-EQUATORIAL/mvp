"use client";

import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

/** Atalho fixo para voltar à escolha de serviços (oculto na própria home). */
export function ServicesLink() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <Link href="/" className={styles.tracks} aria-label="Serviços">
      <LayoutGrid size={18} aria-hidden="true" />
      <span className={styles.tracksLabel}>Serviços</span>
    </Link>
  );
}
