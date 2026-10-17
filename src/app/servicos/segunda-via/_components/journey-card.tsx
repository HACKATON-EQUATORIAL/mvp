import type { ReactNode } from "react";
import { InfoCard } from "@/app/_components/info-card";

export function JourneyCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <InfoCard className={className}>
      <h2>{title}</h2>
      {typeof children === "string" ? <p>{children}</p> : children}
    </InfoCard>
  );
}
