import Link from "next/link";
import type { HTMLAttributes } from "react";
import styles from "./header.module.css";
import { TracksLink } from "./tracks-link";

export type HeaderProps = HTMLAttributes<HTMLElement>;

export function Header({ className, ...props }: HeaderProps) {
  const classes = ["site-header", className].filter(Boolean).join(" ");

  return (
    <header {...props} className={classes}>
      <div className="site-header-content">
        <Link
          href="/"
          className={styles.home}
          aria-label="Digitaliza Aí: início"
        >
          <span className="site-header-brand">Digitaliza Aí</span>
          <span className={styles.partner}>
            Equatorial Energia ·{" "}
            <abbr title="Maranhão" className={styles.state}>
              MA
            </abbr>
          </span>
        </Link>
        <TracksLink />
      </div>
    </header>
  );
}
