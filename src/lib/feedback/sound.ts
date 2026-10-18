import { getSoundEnabled } from "./preferences";

// Efeitos curtos sintetizados com Web Audio (sem arquivos), no espírito dos
// sons de acerto e conclusão dos apps de ensino. Respeitam o mute do app.
type Note = { freq: number; at: number; length: number; type?: OscillatorType };

let context: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
}

function play(notes: Note[], volume = 0.18) {
  if (!getSoundEnabled()) return;
  const ctx = audio();
  if (!ctx) return;
  const start = ctx.currentTime + 0.01;
  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = note.type ?? "sine";
    osc.frequency.value = note.freq;
    const t0 = start + note.at;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + note.length);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + note.length + 0.02);
  }
}

function vibrate(pattern: number | number[]) {
  if (!getSoundEnabled()) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Vibração indisponível (ex.: iOS): só o som.
  }
}

export const feedback = {
  /** Acerto: duas notas subindo, curtas e brilhantes. */
  correct() {
    play([
      { freq: 784, at: 0, length: 0.12, type: "triangle" },
      { freq: 1175, at: 0.08, length: 0.22, type: "triangle" },
    ]);
    vibrate(18);
  },
  /** Erro: nota grave e suave, sem tom de punição. */
  wrong() {
    play(
      [
        { freq: 330, at: 0, length: 0.14, type: "sine" },
        { freq: 262, at: 0.1, length: 0.2, type: "sine" },
      ],
      0.12,
    );
    vibrate([12, 40, 12]);
  },
  /** Conclusão: arpejo festivo. */
  complete() {
    play([
      { freq: 523, at: 0, length: 0.14, type: "triangle" },
      { freq: 659, at: 0.1, length: 0.14, type: "triangle" },
      { freq: 784, at: 0.2, length: 0.14, type: "triangle" },
      { freq: 1047, at: 0.3, length: 0.38, type: "triangle" },
    ]);
    vibrate([20, 60, 20, 60, 40]);
  },
  /** Ofensiva ou selo: brilho curto. */
  sparkle() {
    play([
      { freq: 1319, at: 0, length: 0.1, type: "sine" },
      { freq: 1760, at: 0.07, length: 0.18, type: "sine" },
    ]);
    vibrate(25);
  },
};
