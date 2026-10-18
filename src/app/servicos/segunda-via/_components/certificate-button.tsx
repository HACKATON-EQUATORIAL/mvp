"use client";

import { Award } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { feedback } from "@/lib/feedback/sound";
import {
  badgesOf,
  ENERGY_MAX,
  energyOf,
  useJourneyProgress,
} from "../_lib/progress";

const W = 1080;
const H = 1350;

/**
 * Certificado de treino (imagem gerada no navegador, sem dados pessoais):
 * compartilha pelo celular ou baixa o PNG.
 */
export function CertificateButton() {
  const progress = useJourneyProgress();
  const [busy, setBusy] = useState(false);

  async function share() {
    setBusy(true);
    try {
      const blob = await draw(
        energyOf(progress),
        badgesOf(progress).filter((badge) => badge.earned).length,
      );
      if (!blob) return;
      feedback.sparkle();
      const file = new File([blob], "certificado-digitaliza-ai.png", {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator
          .share({
            files: [file],
            title: "Concluí a trilha no Digitaliza Aí",
            text: "Aprendi a obter outra via da conta pelo atendimento digital.",
          })
          .catch(() => undefined);
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="secondary" loading={busy} onClick={() => void share()}>
      <Award size={18} aria-hidden="true" /> Compartilhar meu certificado
    </Button>
  );
}

async function draw(energy: number, badges: number) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const font = getComputedStyle(document.body).fontFamily;
  await document.fonts?.ready;

  // Fundo azul com faixa amarela.
  ctx.fillStyle = "#0414a1";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ffd700";
  ctx.fillRect(0, H - 120, W, 120);

  // Cartão branco.
  roundRect(ctx, 70, 180, W - 140, H - 420, 48, "#ffffff");

  // Eletriquinho simplificado (corpo, raio, olhos e sorriso).
  const cx = W / 2;
  ctx.fillStyle = "#ff8a00";
  ctx.beginPath();
  ctx.moveTo(cx + 4, 120);
  ctx.lineTo(cx - 44, 210);
  ctx.lineTo(cx - 4, 210);
  ctx.lineTo(cx - 24, 270);
  ctx.lineTo(cx + 50, 170);
  ctx.lineTo(cx + 10, 170);
  ctx.lineTo(cx + 30, 120);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffd43b";
  ctx.beginPath();
  ctx.ellipse(cx, 330, 110, 120, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const dx of [-40, 40]) {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx + dx, 310, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0b1f5c";
    ctx.beginPath();
    ctx.arc(cx + dx + 4, 314, 17, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#0b1f5c";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, 360, 34, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Textos.
  ctx.textAlign = "center";
  ctx.fillStyle = "#3473e8";
  ctx.font = `800 34px ${font}`;
  ctx.fillText("CERTIFICADO DE TREINO", cx, 540);
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `900 64px ${font}`;
  ctx.fillText("Concluí a trilha", cx, 630);
  ctx.fillStyle = "#0414a1";
  ctx.font = `900 58px ${font}`;
  ctx.fillText("Obter outra via da conta", cx, 710);

  // Números.
  const stats = [
    [`${energy}/${ENERGY_MAX}`, "kWh de energia"],
    [`${badges}/5`, "selos"],
  ];
  stats.forEach(([value, label], index) => {
    const x = cx + (index === 0 ? -200 : 200);
    roundRect(ctx, x - 170, 780, 340, 170, 32, "#fbf2c3");
    ctx.fillStyle = "#86721f";
    ctx.font = `900 64px ${font}`;
    ctx.fillText(value, x, 870);
    ctx.font = `800 30px ${font}`;
    ctx.fillText(label, x, 920);
  });

  ctx.fillStyle = "#737373";
  ctx.font = `600 30px ${font}`;
  ctx.fillText(
    `Digitaliza Aí · ${new Date().toLocaleDateString("pt-BR")}`,
    cx,
    1020,
  );
  ctx.font = `500 26px ${font}`;
  ctx.fillText(
    "Treino com conta de exemplo. Pronto para o canal oficial.",
    cx,
    1062,
  );

  ctx.fillStyle = "#0414a1";
  ctx.font = `900 42px ${font}`;
  ctx.fillText("Digitaliza Aí · Equatorial", cx, H - 48);

  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}
