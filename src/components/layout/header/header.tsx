import type { HTMLAttributes } from "react";

export type HeaderProps = HTMLAttributes<HTMLElement>;

export function Header({ className, ...props }: HeaderProps) {
  const classes = ["site-header", className].filter(Boolean).join(" ");

  return (
    <header {...props} className={classes}>
      <div className="site-header-content">
        <span className="site-header-brand">Digitaliza Aí</span>
        <span className="site-header-equatorial">
          <span className="site-header-partner">Equatorial Energia</span>
          <span className="site-header-separator" aria-hidden="true">
            -
          </span>
          <abbr className="site-header-state" title="Maranhão">
            <span aria-hidden="true">MA</span>
            <span className="sr-only">Maranhão</span>
          </abbr>
        </span>
      </div>
    </header>
  );
}
