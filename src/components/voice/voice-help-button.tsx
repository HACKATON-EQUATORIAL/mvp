import Image from "next/image";
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
    <Button {...props} className={cn("voice-help-button", props.className)}>
      <Image
        src="/icons/voice-help.svg"
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
        className="voice-help-button-icon"
      />
      {children ?? "Ajuda por voz"}
    </Button>
  );
}
