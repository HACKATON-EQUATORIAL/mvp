"use client";

import {
  motion,
  type TargetAndTransition,
  type Transition,
  useReducedMotion,
} from "motion/react";
import { type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";
import styles from "./brand.module.css";

export type EletriquinhoMood =
  | "happy"
  | "cheer"
  | "think"
  | "wave"
  | "oops"
  | "listen"
  | "talk";

// Paleta chapada em dois tons (sem contorno), no padrão de mascotes como o Duo.
const color = {
  body: "#FFD43B",
  shade: "#F5B700",
  bolt: "#FF8A00",
  boltShade: "#E06F00",
  glow: "#FFB000",
  spark: "#FFE066",
  sparkHot: "#FF8A00",
  feet: "#FF8A00",
  ink: "#0B1F5C",
  white: "#FFFFFF",
  cheek: "#FFB38A",
  tongue: "#FF6B6B",
  sweat: "#7CC6FF",
  ground: "#0414A11A",
};

const forever = Number.POSITIVE_INFINITY;

// Movimento do corpo inteiro por humor (pulo, balanço, tremida…).
const bodyMotion: Record<
  EletriquinhoMood,
  { animate: TargetAndTransition; transition: Transition }
> = {
  happy: {
    animate: { y: [0, -3, 0], rotate: [-2, 2, -2] },
    transition: { duration: 3, repeat: forever, ease: "easeInOut" },
  },
  cheer: {
    // Antecipa (agacha), salta girando um pouco e amassa ao aterrissar.
    animate: {
      y: [0, 4, -18, 0, 2, 0],
      rotate: [0, 0, -8, 6, 0, 0],
      scaleY: [1, 0.86, 1.1, 0.88, 1.03, 1],
      scaleX: [1, 1.1, 0.92, 1.1, 0.98, 1],
    },
    transition: {
      duration: 1,
      times: [0, 0.15, 0.4, 0.62, 0.8, 1],
      repeat: forever,
      repeatDelay: 0.35,
      ease: "easeOut",
    },
  },
  wave: {
    animate: { rotate: [-5, 5, -5], y: [0, -2, 0] },
    transition: { duration: 1.6, repeat: forever, ease: "easeInOut" },
  },
  think: {
    animate: { rotate: [-9, -5, -9], y: [0, -1.5, 0] },
    transition: { duration: 3.4, repeat: forever, ease: "easeInOut" },
  },
  oops: {
    animate: { x: [0, -3, 3, -2, 2, 0, 0], rotate: [0, -3, 3, -2, 0, 0, 0] },
    transition: { duration: 1.8, repeat: forever, ease: "easeInOut" },
  },
  // Inclina para o lado, como quem aproxima o ouvido.
  listen: {
    animate: { rotate: [5, 8, 5], y: [0, -1.5, 0] },
    transition: { duration: 1.4, repeat: forever, ease: "easeInOut" },
  },
  talk: {
    animate: { y: [0, -2, 0], rotate: [-2, 1, -2] },
    transition: { duration: 0.9, repeat: forever, ease: "easeInOut" },
  },
};

/**
 * Eletriquinho: guia dos serviços. Construído só com formas arredondadas
 * (pílula, círculo e triângulo arredondado), olhos grandes com brilho e pés
 * soltos. Animações em camadas (corpo, respiração, raio, faíscas, olhos e
 * braços) que mudam com o humor. Decorativo; parado com movimento reduzido.
 */
export function Eletriquinho({
  mood = "happy",
  size = 72,
  className,
}: {
  mood?: EletriquinhoMood;
  size?: number;
  className?: string;
}) {
  const still = !!useReducedMotion();
  const clip = `eletriquinho-${useId().replace(/:/g, "")}`;
  const body = bodyMotion[mood];
  const cheering = mood === "cheer";

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn(styles.mascot, className)}
      overflow="visible"
    >
      {/* Sombra no chão: encolhe quando ele está no ar. */}
      <motion.ellipse
        cx="60"
        cy="113"
        rx="26"
        ry="5"
        fill={color.ground}
        animate={
          still
            ? undefined
            : cheering
              ? {
                  scaleX: [1, 1.1, 0.6, 1.1, 1, 1],
                  opacity: [1, 1, 0.5, 1, 1, 1],
                }
              : { scaleX: [1, 0.92, 1] }
        }
        transition={cheering ? bodyMotion.cheer.transition : body.transition}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
      />

      {/* Entrada com “pop” e reação a cada troca de humor. */}
      <motion.g
        key={mood}
        initial={still ? false : { scale: 0.88, y: 6 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 14 }}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 1 }}
      >
        <motion.g
          animate={still ? undefined : body.animate}
          transition={body.transition}
          style={{ transformBox: "fill-box", originX: 0.5, originY: 1 }}
        >
          <Feet mood={mood} still={still} />
          <Arm side="left" mood={mood} still={still} />
          <Arm side="right" mood={mood} still={still} />
          <Bolt mood={mood} still={still} />

          {/* Respiração: estica e comprime de leve, apoiado nos pés. */}
          <motion.g
            animate={
              still || cheering
                ? undefined
                : { scaleY: [1, 1.035, 1], scaleX: [1, 0.975, 1] }
            }
            transition={{ duration: 2.2, repeat: forever, ease: "easeInOut" }}
            style={{ transformBox: "fill-box", originX: 0.5, originY: 1 }}
          >
            <clipPath id={clip}>
              <rect x="28" y="34" width="64" height="70" rx="32" />
            </clipPath>
            <g clipPath={`url(#${clip})`}>
              <rect x="28" y="34" width="64" height="70" fill={color.body} />
              <circle cx="112" cy="72" r="34" fill={color.shade} />
              {/* Brilho chapado no alto do corpo. */}
              <ellipse
                cx="44"
                cy="48"
                rx="7"
                ry="4"
                fill={color.white}
                opacity="0.45"
                transform="rotate(-30 44 48)"
              />
            </g>
            <motion.g
              animate={
                still ? undefined : { opacity: cheering ? [0.6, 1, 0.6] : 0.7 }
              }
              transition={{ duration: 0.8, repeat: forever }}
            >
              <circle cx="40" cy="77" r="5" fill={color.cheek} />
              <circle cx="80" cy="77" r="5" fill={color.cheek} />
            </motion.g>
            <Eyes mood={mood} still={still} />
            <Mouth mood={mood} still={still} />
          </motion.g>

          {mood === "oops" && <Sweat still={still} />}
        </motion.g>
      </motion.g>

      {(mood === "listen" || mood === "talk") && (
        <SoundWaves incoming={mood === "listen"} still={still} />
      )}
      <Sparks mood={mood} still={still} />
      {mood === "think" && <ThoughtDots still={still} />}
    </svg>
  );
}

function Feet({ mood, still }: { mood: EletriquinhoMood; still: boolean }) {
  const tap = mood === "cheer" || mood === "wave";
  return (
    <>
      {[40, 64].map((x, index) => (
        <motion.rect
          key={x}
          x={x}
          y="100"
          width="16"
          height="9"
          rx="4.5"
          fill={color.feet}
          animate={still || !tap ? undefined : { y: [0, -2, 0] }}
          transition={{
            duration: 0.5,
            repeat: forever,
            delay: index * 0.25,
          }}
        />
      ))}
    </>
  );
}

function Arm({
  side,
  mood,
  still,
}: {
  side: "left" | "right";
  mood: EletriquinhoMood;
  still: boolean;
}) {
  const left = side === "left";
  const x = left ? 24 : 96;
  const up = mood === "cheer" || (mood === "wave" && !left);
  const sign = left ? -1 : 1;

  // Cada humor dá um gesto diferente aos braços.
  const rotate = still
    ? sign * (up ? 30 : -25)
    : mood === "cheer"
      ? [sign * 20, sign * 45, sign * 20]
      : mood === "wave" && !left
        ? [10, 45, 10]
        : mood === "think" && !left
          ? [-70, -64, -70]
          : mood === "oops"
            ? [sign * -40, sign * -30, sign * -40]
            : [sign * -25, sign * -18, sign * -25];

  return (
    <motion.ellipse
      cx={x}
      cy={up ? 46 : 74}
      rx="8"
      ry="13"
      fill={color.shade}
      initial={false}
      animate={{ rotate }}
      transition={
        still
          ? { duration: 0 }
          : {
              duration: mood === "wave" ? 0.5 : mood === "cheer" ? 0.45 : 2.2,
              repeat: forever,
              ease: "easeInOut",
              delay: left ? 0 : 0.2,
            }
      }
      style={{
        transformBox: "fill-box",
        originX: 0.5,
        originY: up ? 1 : 0,
      }}
    />
  );
}

function Bolt({ mood, still }: { mood: EletriquinhoMood; still: boolean }) {
  const excited = mood === "cheer" || mood === "wave";
  return (
    <g>
      {/* Halo de energia atrás do raio. */}
      <motion.circle
        cx="60"
        cy="22"
        r="16"
        fill={color.glow}
        animate={
          still
            ? { opacity: 0.18 }
            : {
                opacity: excited ? [0.15, 0.45, 0.15] : [0.08, 0.25, 0.08],
                scale: excited ? [0.9, 1.25, 0.9] : [0.95, 1.08, 0.95],
              }
        }
        transition={{ duration: excited ? 0.7 : 1.8, repeat: forever }}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
      />
      <motion.g
        strokeLinejoin="round"
        strokeLinecap="round"
        animate={
          still
            ? undefined
            : mood === "oops"
              ? { rotate: [0, -14, 10, -6, 0], scale: [1, 0.92, 1] }
              : {
                  rotate: excited ? [-10, 10, -10] : [-4, 4, -4],
                  scale: excited ? [1, 1.12, 1] : [1, 1.04, 1],
                }
        }
        transition={{
          duration: excited ? 0.6 : 2,
          repeat: forever,
          ease: "easeInOut",
        }}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 1 }}
      >
        <path
          d="M62 6 L46 30 L58 30 L52 44 L74 18 L62 18 L68 6 Z"
          fill={color.bolt}
          stroke={color.bolt}
          strokeWidth="5"
        />
        <path
          d="M68 6 L62 18 L74 18 L60 34 L66 22 L58 22 Z"
          fill={color.boltShade}
          stroke={color.boltShade}
          strokeWidth="2"
          opacity="0.55"
        />
      </motion.g>
    </g>
  );
}

// Posições das faíscas em volta do raio (e, ao comemorar, do corpo todo).
const sparkSpots = [
  { x: 38, y: 16, r: 3.2, delay: 0 },
  { x: 84, y: 12, r: 2.6, delay: 0.5 },
  { x: 90, y: 34, r: 2.2, delay: 1.1 },
  { x: 30, y: 36, r: 2.4, delay: 1.6 },
];
const burstSpots = [
  { x: 14, y: 50, r: 3, delay: 0.1 },
  { x: 106, y: 52, r: 3, delay: 0.25 },
  { x: 20, y: 84, r: 2.4, delay: 0.4 },
  { x: 102, y: 86, r: 2.4, delay: 0.55 },
];

function Sparks({ mood, still }: { mood: EletriquinhoMood; still: boolean }) {
  if (still || mood === "oops") return null;
  const cheering = mood === "cheer";
  const spots = cheering ? [...sparkSpots, ...burstSpots] : sparkSpots;
  return (
    <g>
      {spots.map((spot) => (
        <motion.g
          key={`${spot.x}-${spot.y}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 90],
            y: cheering ? [0, -8] : [0, -4],
          }}
          transition={{
            duration: cheering ? 0.9 : 1.4,
            repeat: forever,
            repeatDelay: cheering ? 0.4 : 1.4,
            delay: spot.delay,
            ease: "easeOut",
          }}
          style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
        >
          {/* Faísca: losango arredondado com miolo quente. */}
          <rect
            x={spot.x - spot.r}
            y={spot.y - spot.r}
            width={spot.r * 2}
            height={spot.r * 2}
            rx={spot.r * 0.45}
            fill={color.spark}
            transform={`rotate(45 ${spot.x} ${spot.y})`}
          />
          <circle
            cx={spot.x}
            cy={spot.y}
            r={spot.r * 0.45}
            fill={color.sparkHot}
          />
        </motion.g>
      ))}
    </g>
  );
}

function ThoughtDots({ still }: { still: boolean }) {
  return (
    <g>
      {[
        { cx: 96, cy: 40, r: 3 },
        { cx: 103, cy: 30, r: 4 },
        { cx: 110, cy: 18, r: 5.5 },
      ].map((dot, index) => (
        <motion.circle
          key={dot.cy}
          {...dot}
          fill={color.white}
          stroke="#C9D3F5"
          strokeWidth="2"
          initial={still ? false : { opacity: 0, scale: 0 }}
          animate={
            still
              ? { opacity: 1 }
              : { opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.6] }
          }
          transition={{
            duration: 2.4,
            times: [0, 0.2, 0.8, 1],
            repeat: forever,
            delay: index * 0.3,
          }}
          style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
        />
      ))}
    </g>
  );
}

function Sweat({ still }: { still: boolean }) {
  return (
    <motion.path
      d="M88 40 Q92 47 88 50 Q84 47 88 40 Z"
      fill={color.sweat}
      animate={still ? undefined : { y: [0, 10], opacity: [0, 1, 0] }}
      transition={{ duration: 1.4, repeat: forever, repeatDelay: 0.6 }}
    />
  );
}

function Eyes({ mood, still }: { mood: EletriquinhoMood; still: boolean }) {
  if (mood === "cheer")
    return (
      <g stroke={color.ink} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M41 60 Q48 51 55 60" />
        <path d="M65 60 Q72 51 79 60" />
      </g>
    );

  const pupil = mood === "oops" ? 5 : 7;
  // Olhar: pensativo fixa no alto; feliz e acenando passeiam pelo entorno.
  const gaze: TargetAndTransition =
    mood === "think"
      ? { x: [-2.5, -1.5, -2.5], y: -3.5 }
      : mood === "oops"
        ? { x: [-1.5, 1.5, -1.5], y: 0 }
        : mood === "listen"
          ? { x: [2.5, 3.5, 2.5], y: [0, 1, 0] }
          : { x: [1, 3, 3, -2, -2, 1], y: [1, 0, 2, 1, -1, 1] };

  return (
    <motion.g
      // Pisca, às vezes duas vezes seguidas.
      animate={
        still ? undefined : { scaleY: [1, 1, 0.1, 1, 1, 0.1, 1, 0.1, 1] }
      }
      transition={{
        duration: 6,
        times: [0, 0.3, 0.33, 0.36, 0.86, 0.89, 0.92, 0.95, 1],
        repeat: forever,
      }}
      style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
    >
      {[48, 72].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="60" r="12" fill={color.white} />
          <motion.g
            animate={still ? { x: 1, y: 1 } : gaze}
            transition={{
              duration: mood === "oops" ? 0.6 : 5,
              repeat: forever,
              ease: "easeInOut",
            }}
          >
            <circle cx={cx} cy="60" r={pupil} fill={color.ink} />
            <circle cx={cx + 2.5} cy="57.5" r="2.4" fill={color.white} />
            <circle cx={cx - 2.2} cy="62.5" r="1.1" fill={color.white} />
          </motion.g>
        </g>
      ))}
      {mood === "think" && (
        <motion.path
          d="M64 42 Q72 37 80 42"
          stroke={color.ink}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={still ? undefined : { y: [0, -2, 0] }}
          transition={{ duration: 1.7, repeat: forever }}
        />
      )}
      {mood === "oops" && (
        <g stroke={color.ink} strokeWidth="4" strokeLinecap="round">
          <path d="M38 45 L54 49" />
          <path d="M82 45 L66 49" />
        </g>
      )}
    </motion.g>
  );
}

function Mouth({ mood, still }: { mood: EletriquinhoMood; still: boolean }) {
  if (mood === "talk")
    return (
      <motion.g
        animate={
          still ? undefined : { scaleY: [0.35, 1, 0.5, 0.9, 0.3, 0.8, 0.35] }
        }
        transition={{ duration: 0.9, repeat: forever, ease: "easeInOut" }}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 0 }}
      >
        <path d="M51 78 Q60 92 69 78 Z" fill={color.ink} />
        <path d="M55 84 Q60 89 65 84 Q60 81 55 84 Z" fill={color.tongue} />
      </motion.g>
    );
  if (mood === "cheer" || mood === "wave")
    return (
      <motion.g
        animate={still ? undefined : { scaleY: [1, 1.15, 1] }}
        transition={{ duration: mood === "cheer" ? 0.5 : 1, repeat: forever }}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 0 }}
      >
        <path d="M50 78 Q60 94 70 78 Z" fill={color.ink} />
        <path d="M54 85 Q60 91 66 85 Q60 82 54 85 Z" fill={color.tongue} />
      </motion.g>
    );
  if (mood === "think" || mood === "oops")
    return (
      <motion.circle
        cx="60"
        cy="82"
        r="4"
        fill={color.ink}
        animate={still ? undefined : { scale: [1, 0.75, 1] }}
        transition={{ duration: 1.6, repeat: forever }}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
      />
    );
  return (
    <path
      d="M51 79 Q60 88 69 79"
      stroke={color.ink}
      strokeWidth="4.5"
      strokeLinecap="round"
      fill="none"
    />
  );
}

/** Balão do Eletriquinho com uma dica curta. */
export function EletriquinhoTip({
  children,
  mood = "happy",
  className,
}: {
  children: ReactNode;
  mood?: EletriquinhoMood;
  className?: string;
}) {
  return (
    <div className={cn(styles.tip, className)}>
      <Eletriquinho mood={mood} size={76} />
      <p className={styles.bubble}>{children}</p>
    </div>
  );
}

/** Ondas de som: chegando (escutando) ou saindo da boca (falando). */
function SoundWaves({
  incoming,
  still,
}: {
  incoming: boolean;
  still: boolean;
}) {
  return (
    <g
      fill="none"
      stroke={incoming ? "#3473E8" : "#FF8A00"}
      strokeWidth="3.5"
      strokeLinecap="round"
    >
      {[0, 1, 2].map((index) => {
        const r = 8 + index * 7;
        return (
          <motion.path
            key={index}
            d={`M${104 + index * 2} ${60 - r} A${r} ${r} 0 0 1 ${104 + index * 2} ${60 + r}`}
            initial={{ opacity: 0 }}
            animate={
              still
                ? { opacity: 0.7 }
                : { opacity: [0, 1, 0], x: incoming ? [6, 0] : [0, 6] }
            }
            transition={{
              duration: 1.2,
              repeat: forever,
              delay: incoming ? (2 - index) * 0.25 : index * 0.25,
              ease: "easeOut",
            }}
          />
        );
      })}
    </g>
  );
}
