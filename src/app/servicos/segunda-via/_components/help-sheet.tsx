"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { postEvent } from "@/http/events/post-events";
import { useGetBundle } from "@/http/track/get-bundle";
import { routes } from "../_lib/navigation";
import { PARTS, partHref, TRACK_ID } from "../_lib/steps";

/** Folha de ajuda: separa dúvida (dá para aprender) de bloqueio externo (canal oficial). */
export function HelpSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const bundle = useGetBundle(TRACK_ID);
  const [selected, setSelected] = useState<string | null>(null);
  const difficulties = bundle.data?.difficulties ?? [];
  const item = difficulties.find((entry) => entry.id === selected);
  const destination = item?.destination;
  const part = PARTS.find((entry) => entry.stepId === destination?.step_id);
  const official = bundle.data?.channel_exit.destinations[0];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>O que aconteceu?</DrawerTitle>
          <DrawerDescription>
            Escolha a situação mais parecida com a sua.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-2 overflow-y-auto px-4 pb-6">
          {difficulties.map((entry) => (
            <Button
              key={entry.id}
              variant={entry.id === selected ? "primary" : "secondary"}
              aria-pressed={entry.id === selected}
              onClick={() => {
                setSelected(entry.id);
                postEvent({
                  type: "difficulty_reported",
                  payload: {
                    option_id: entry.id,
                    classification: entry.classification,
                  },
                });
              }}
            >
              {entry.label}
            </Button>
          ))}
          {item && (
            <div role="status" className="grid gap-3 pt-2">
              <p className="m-0 text-base">{item.guidance}</p>
              {destination?.kind === "channel_exit" && official ? (
                <a
                  href={official.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-slot="button"
                  className={buttonVariants({ variant: "primary" })}
                  onClick={() =>
                    postEvent({
                      type: "channel_exit_clicked",
                      payload: { origin: "difficulty" },
                    })
                  }
                >
                  Abrir o WhatsApp oficial{" "}
                  <ExternalLink size={18} aria-hidden="true" />
                </a>
              ) : (
                <ActionLink
                  variant="primary"
                  href={part ? partHref(part.slug) : routes.demonstracao}
                  onClick={() => onOpenChange(false)}
                >
                  {part
                    ? `Praticar: ${part.label.toLocaleLowerCase("pt-BR")}`
                    : "Ver como funciona"}
                </ActionLink>
              )}
            </div>
          )}
          <DrawerClose render={<Button variant="ghost">Fechar</Button>} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
