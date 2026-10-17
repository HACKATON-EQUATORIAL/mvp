import type { HTMLAttributes, ReactNode } from "react";

export type InfoCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function InfoCard({ children, className, ...props }: InfoCardProps) {
  const classes = ["info-card", className].filter(Boolean).join(" ");

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  );
}
