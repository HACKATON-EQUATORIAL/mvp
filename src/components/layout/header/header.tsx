import Image from "next/image";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import styles from "./header.module.css";
import { ServicesLink } from "./services-link";

export type HeaderProps = HTMLAttributes<HTMLElement>;

/** Três colunas: marca Equatorial à esquerda, título no centro e Serviços à direita. */
export function Header({ className, ...props }: HeaderProps) {
  const classes = ["site-header", className].filter(Boolean).join(" ");

  return (
    <header {...props} className={classes}>
      <div className={styles.content}>
        <a
          href="https://www.equatorialenergia.com.br/"
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
        </a>
        <Link
          href="/"
          className={styles.home}
          aria-label="Digitaliza Aí: início"
        >
          <span className="site-header-brand">Digitaliza Aí</span>
        </Link>
        <span className={styles.end}>
          <ServicesLink />
        </span>
      </div>
    </header>
  );
}
