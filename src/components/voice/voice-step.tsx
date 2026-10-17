import type { ReactNode } from "react";
import { useId } from "react";

export function VoiceStep({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const titleId = useId();
  return (
    <section className="voice-step" aria-labelledby={titleId}>
      <h3 id={titleId} tabIndex={-1}>
        {title}
      </h3>
      <p className="voice-step-description">{description}</p>
      <div className="voice-step-body">{children}</div>
    </section>
  );
}
