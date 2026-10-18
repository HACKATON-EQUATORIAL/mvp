"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import styles from "./roadmap.module.css";

type Point = {
  id: string;
  x: number;
  y: number;
  radius: number;
  labelLeft: number;
  labelRight: number;
  labelTop: number;
  labelBottom: number;
};

type Segment = { id: string; start: string; curve: string };
type Geometry = { width: number; height: number; segments: Segment[] };

/** Três Béziers com tangentes compartilhadas, fora da área de leitura. */
function connect(
  from: Point,
  to: Point,
  width: number,
  clearance: number,
): Segment {
  const delta = to.x - from.x;
  const direction =
    Math.abs(delta) < 1 ? (from.x <= width / 2 ? 1 : -1) : Math.sign(delta);
  const edge = clearance / 3;
  const reach = from.radius * 2 + Math.abs(delta);
  const rail =
    direction === 1
      ? Math.min(
          width - edge,
          Math.max(
            from.labelRight + clearance,
            from.x + reach,
            to.x + to.radius + clearance,
          ),
        )
      : Math.max(
          edge,
          Math.min(
            from.labelLeft - clearance,
            from.x - reach,
            to.x - to.radius - clearance,
          ),
        );

  // Aproveita a folga lateral sem deixar a curva sair da largura disponível.
  const bulge = Math.min(
    from.radius / 2,
    Math.max(0, direction === 1 ? width - edge - rail : rail - edge),
  );
  const departureY = from.labelTop - clearance / 2;
  const arrivalY = from.labelBottom;
  const bodyHeight = arrivalY - departureY;
  const departureTangent = Math.min(
    (departureY - from.y) * 0.75,
    bodyHeight / 3,
  );
  const arrivalTangent = Math.min((to.y - arrivalY) / 2, bodyHeight / 3);
  const entry = Math.min(to.radius, (to.y - arrivalY) / 2);
  const outer = rail + direction * bulge;

  return {
    id: from.id,
    start: `M ${from.x} ${from.y}`,
    curve: [
      `C ${from.x + (rail - from.x) * 0.65} ${from.y}, ${rail - direction * bulge} ${departureY - departureTangent}, ${rail} ${departureY}`,
      `C ${outer} ${departureY + departureTangent}, ${outer} ${arrivalY - arrivalTangent}, ${rail} ${arrivalY}`,
      `C ${rail - direction * bulge} ${arrivalY + arrivalTangent}, ${to.x} ${to.y - entry}, ${to.x} ${to.y}`,
    ].join(" "),
  };
}

function pathOf(segments: Segment[]) {
  return segments.length
    ? `${segments[0].start} ${segments.map(({ curve }) => curve).join(" ")}`
    : "";
}

/** Camada decorativa do mapa; a lista continua sendo a navegação acessível. */
export function RoadmapPath({
  completedSegments,
  children,
}: {
  completedSegments: number;
  children: ReactNode;
}) {
  const list = useRef<HTMLOListElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const element = list.current;
    if (!element) return;
    let frame = 0;

    const measure = () => {
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const clearance = Number.parseFloat(
        getComputedStyle(element).getPropertyValue("--spacing-md"),
      );
      const points = Array.from(
        element.querySelectorAll<HTMLElement>("[data-roadmap-node]"),
      ).flatMap((node): Point[] => {
        const badge = node.querySelector<HTMLElement>("[data-roadmap-badge]");
        const label = node.querySelector<HTMLElement>("[data-roadmap-label]");
        if (!badge || !label) return [];
        const circle = badge.getBoundingClientRect();
        const text = label.getBoundingClientRect();
        return [
          {
            id: node.dataset.roadmapNode ?? "",
            x: circle.left + circle.width / 2 - bounds.left,
            y: circle.top + circle.height / 2 - bounds.top,
            // A escala animada do círculo não deve deslocar a curva.
            radius: badge.offsetWidth / 2,
            labelLeft: text.left - bounds.left,
            labelRight: text.right - bounds.left,
            labelTop: text.top - bounds.top,
            labelBottom: text.bottom - bounds.top,
          },
        ];
      });

      setGeometry({
        width: bounds.width,
        height: bounds.height,
        segments: points
          .slice(0, -1)
          .map((point, index) =>
            connect(point, points[index + 1], bounds.width, clearance),
          ),
      });
    };

    measure();
    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(scheduleMeasure);
    const observeElements = () => {
      observer.disconnect();
      observer.observe(element);
      for (const target of element.querySelectorAll(
        "[data-roadmap-badge], [data-roadmap-label]",
      )) {
        observer.observe(target);
      }
    };
    observeElements();
    // Reassocia a medição quando o conteúdo ou a quantidade de passos muda.
    const mutations = new MutationObserver(() => {
      observeElements();
      scheduleMeasure();
    });
    mutations.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => {
      mutations.disconnect();
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.pathCanvas}>
      {geometry && (
        <svg
          className={styles.connector}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          aria-hidden="true"
          focusable="false"
        >
          <path
            className={styles.connectorTrack}
            d={pathOf(geometry.segments)}
          />
          {geometry.segments.map((segment, index) => (
            <motion.path
              key={segment.id}
              className={styles.connectorProgress}
              d={`${segment.start} ${segment.curve}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: index < completedSegments ? 1 : 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.9,
                delay: reducedMotion ? 0 : index * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
          {completedSegments > 0 && (
            <path
              key={completedSegments}
              className={styles.connectorPulse}
              d={pathOf(geometry.segments.slice(0, completedSegments))}
              pathLength={1}
            />
          )}
        </svg>
      )}
      <ol ref={list} className={styles.path} aria-label="Etapas do aprendizado">
        {children}
      </ol>
    </div>
  );
}
