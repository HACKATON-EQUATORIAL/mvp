import type { ComponentProps, ReactNode } from "react";
import { Eletriquinho } from "@/components/brand/eletriquinho";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type VoiceHelpButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children"
> & {
  children?: ReactNode;
};

export function VoiceHelpButton({ children, ...props }: VoiceHelpButtonProps) {
  return (
    <Button
      title="Assistente"
      {...props}
      className={cn("voice-help-button", props.className)}
    >
      <Eletriquinho size={32} className="voice-help-button-mascot" />
      <span>{children ?? "Assistente"}</span>
    </Button>
  );
}
