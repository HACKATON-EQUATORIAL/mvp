import Image from "next/image";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import styles from "./header.module.css";

export type HeaderProps = HTMLAttributes<HTMLElement>;

/** Duas pontas: Digitaliza Aí (início) à esquerda e marca Equatorial à direita. */
export function Header({ className, ...props }: HeaderProps) {
  const classes = ["site-header", className].filter(Boolean).join(" ");

  return (
    <header {...props} className={classes}>
      <div className={styles.content}>
        <Link
          href="/"
          className={styles.home}
          aria-label="Digitaliza Aí: início"
        >
          <span className="site-header-brand">Digitaliza Aí</span>
        </Link>
        {/* Aba nova: um toque sem querer no logo não tira a pessoa da prática. */}
        <a
          href="https://www.equatorialenergia.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.partner}
        >
          <Image
            src="/brand/equatorial-energia.png"
            alt="Equatorial Energia"
            width={151}
            height={44}
            priority
            className={styles.logo}
          />
          <abbr title="Maranhão" className={styles.state}>
            MA
          </abbr>
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </header>
  );
}
