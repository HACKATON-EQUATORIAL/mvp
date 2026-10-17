import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/app/_components/button";

export type VoiceHelpButtonProps = Omit<ButtonProps, "children"> & {
  children?: ReactNode;
};

export function VoiceHelpButton({ children, ...props }: VoiceHelpButtonProps) {
  return (
    <Button
      {...props}
      className={classNames("voice-help-button", props.className)}
    >
      <svg
        aria-hidden="true"
        className="voice-help-button-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5V7a3.5 3.5 0 0 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {children ?? "Ajuda por voz"}
    </Button>
  );
}

function classNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}
