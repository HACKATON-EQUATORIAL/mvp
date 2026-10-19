"use client";

import { Volume2, VolumeX, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  forwardRef,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import brand from "@/components/brand/brand.module.css";
import {
  Eletriquinho,
  type EletriquinhoMood,
} from "@/components/brand/eletriquinho";
import { cn } from "@/lib/utils";

/** Botão redondo do assistente: só o Eletriquinho. */
export const MascotButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & { mood?: EletriquinhoMood }
>(function MascotButton({ mood = "happy", className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      {...props}
      className={cn(brand.mascotButton, className)}
    >
      <Eletriquinho mood={mood} size={58} />
    </button>
  );
});

/**
 * Canto do Eletriquinho: o botão que abre o assistente e o balão de fala com a
 * dica da tela ou a narração. O balão pode ser fechado e volta quando a fala muda.
 */
const SPEECH_MS = 6000;

export function MascotCorner({
  text,
  hidden,
  compact,
  holdOpen,
  soundOn,
  onSound,
  children,
}: {
  text?: string;
  hidden?: boolean;
  /** Enquanto a fala é lida em voz alta, o balão não fecha sozinho. */
  holdOpen?: boolean;
  /**
   * Botão de som do balão: muta ou desmuta o app. Na primeira visita também é o
   * toque que o navegador exige antes de tocar som.
   */
  soundOn?: boolean;
  onSound?: () => void;
  /** Telas de chat: mascote menor. */
  compact?: boolean;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const corner = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);
  // Fala nova reabre o balão.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reabre só quando a fala muda
  useEffect(() => {
    setDismissed(null);
  }, [text]);
  // Voz começou (ex.: liberada pelo primeiro toque, que também “tocou fora”):
  // o balão reabre para acompanhar a fala.
  useEffect(() => {
    if (holdOpen) setDismissed(null);
  }, [holdOpen]);
  const show = !!text && !hidden && dismissed !== text;

  // O balão some sozinho e ao tocar fora dele, para não atrapalhar a tela.
  useEffect(() => {
    if (!show) return;
    const timer = holdOpen
      ? undefined
      : setTimeout(() => setDismissed(text ?? null), SPEECH_MS);
    const onPointer = (event: PointerEvent) => {
      if (!corner.current?.contains(event.target as Node))
        setDismissed(text ?? null);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [show, text, holdOpen]);

  return (
    <div
      ref={corner}
      className={brand.mascotCorner}
      data-compact={compact || undefined}
    >
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key={text}
            className={brand.speech}
            role="status"
            aria-live="polite"
            initial={
              reduced ? { opacity: 0 } : { opacity: 0, x: 12, scale: 0.95 }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <p>{text}</p>
            <span className={brand.speechTools}>
              <button
                type="button"
                className={brand.speechClose}
                aria-label="Fechar dica"
                onClick={() => setDismissed(text ?? null)}
              >
                <X size={16} aria-hidden="true" />
              </button>
              {onSound && (
                <button
                  type="button"
                  className={brand.speechListen}
                  data-sound-toggle
                  data-muted={!soundOn || undefined}
                  aria-label={soundOn ? "Desligar o som" : "Ligar o som"}
                  onClick={onSound}
                >
                  {soundOn ? (
                    <Volume2 size={18} aria-hidden="true" />
                  ) : (
                    <VolumeX size={18} aria-hidden="true" />
                  )}
                </button>
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}
