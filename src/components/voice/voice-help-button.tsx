import { MessageCircle } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
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
      <MessageCircle
        size={24}
        aria-hidden="true"
        className="voice-help-button-icon"
      />
      <span>{children ?? "Assistente"}</span>
    </Button>
  );
}
