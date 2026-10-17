import type { HTMLAttributes } from "react";

export type HeaderProps = HTMLAttributes<HTMLElement>;

export function Header({ className, ...props }: HeaderProps) {
  const classes = ["site-header", className].filter(Boolean).join(" ");

  return (
    <header {...props} className={classes}>
      <span className="site-header-brand">Equatorial Energia</span>
      <abbr className="site-header-state" title="Maranhão">
        <span aria-hidden="true">MA</span>
        <span className="sr-only">Maranhão</span>
      </abbr>
    </header>
  );
}
