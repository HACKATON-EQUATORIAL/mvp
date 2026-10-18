import { MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Saída sempre disponível quando nenhuma opção serve: pede outras palavras. */
export function OtherOption({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="voice-other-option"
      onClick={onClick}
    >
      <MessageCircleQuestion size={20} aria-hidden="true" />
      Nada disso, quero outra coisa
    </Button>
  );
}
