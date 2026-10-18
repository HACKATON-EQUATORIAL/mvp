import { targetPreparacao } from "@/app/servicos/segunda-via/_lib/voice-target";
import { targetCanal } from "@/app/servicos/segunda-via/canal/_lib/voice-target";
import { targetDificuldades } from "@/app/servicos/segunda-via/dificuldades/_lib/voice-target";
import { targetEtapas } from "@/app/servicos/segunda-via/etapas/_lib/voice-target";
import { stepTargets } from "@/app/servicos/segunda-via/etapas/[etapa]/_lib/voice-target";
import { targetExplicacao } from "@/app/servicos/segunda-via/explicacao/_lib/voice-target";
import { targetPraticaConcluida } from "@/app/servicos/segunda-via/pratica/concluida/_lib/voice-target";
import { targetPraticaConferencia } from "@/app/servicos/segunda-via/pratica/conferencia/_lib/voice-target";
import { targetPraticaGuiada } from "@/app/servicos/segunda-via/pratica/guiada/_lib/voice-target";
import { targetPraticaIndividual } from "@/app/servicos/segunda-via/pratica/individual/_lib/voice-target";
// Compose descriptors declared beside each page; do not crawl URLs or import pages.
export const secondCopyTargets = [
  targetPreparacao,
  targetExplicacao,
  targetEtapas,
  targetPraticaGuiada,
  targetPraticaIndividual,
  targetPraticaConferencia,
  targetPraticaConcluida,
  targetDificuldades,
  targetCanal,
  ...stepTargets,
];
