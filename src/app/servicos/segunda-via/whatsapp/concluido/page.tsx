import type { Metadata } from "next";
import { JourneyDone } from "@/app/servicos/segunda-via/_components/journey-done";
import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import { JourneyPage } from "@/components/layout/journey-page";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "segunda-via.conclusao",
  description:
    "Conclusão da segunda via pelo WhatsApp: resumo das 3 etapas e botão para abrir o WhatsApp oficial da Clara com a mensagem pronta.",
  tip: "Tudo pronto? Toque em “Abrir o WhatsApp da Clara”.",
  screen: {
    stage: "conclusao",
    teaches:
      "Tela final: com as 3 etapas feitas, a pessoa abre o WhatsApp oficial da Clara (mensagem “Quero a segunda via da fatura” já escrita) e repete o que treinou com os próprios dados. Se faltar etapa, mostra o que falta.",
  },
  suggestions: [
    {
      id: "map",
      label: "Ver as etapas",
      confirmation: "Você quer voltar ao mapa das etapas?",
      href: routes.whatsapp,
    },
  ],
};

export const metadata: Metadata = { title: "Segunda via: conclusão" };

export default function Page() {
  return (
    <JourneyPage
      eyebrow="SEGUNDA VIA · META"
      title="Pronto para o atendimento digital"
      intro="Você treinou cada passo. Agora é fazer de verdade, com os seus dados."
      voiceContext={voiceContext}
      actions={null}
      back={{ href: routes.whatsapp, label: "Voltar às etapas" }}
      // Na barra, a etapa anterior (o mapa já está no “Voltar às etapas” do topo).
      previous={{ href: routes.simulacao, label: "Voltar à etapa 3" }}
    >
      <JourneyDone />
    </JourneyPage>
  );
}
