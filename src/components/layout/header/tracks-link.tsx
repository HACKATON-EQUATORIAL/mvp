"use client";

import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

/** Atalho fixo para voltar à escolha de trilhas (oculto na própria home). */
export function TracksLink() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <Link href="/" className={styles.tracks}>
      <LayoutGrid size={18} aria-hidden="true" />
      Trilhas
    </Link>
  );
}
