import type { Metadata } from "next";
import { ServicePage } from "@/app/servicos/_components/service-page";
import { routes } from "@/app/servicos/segunda-via/_lib/navigation";
import type { VoicePageContext } from "@/components/voice/voice-page-context";

const voiceContext: VoicePageContext = {
  id: "servico.falta-de-energia",
  description: "Este serviço não está disponível nesta demonstração.",
  suggestions: [
    {
      id: "home",
      label: "Voltar ao início",
      confirmation: "Você quer voltar à tela inicial.",
      href: routes.inicio,
    },
  ],
};

export const metadata: Metadata = { title: "Informar falta de energia" };

export default function Page() {
  return (
    <ServicePage
      title="Informar falta de energia"
      voiceContext={voiceContext}
    />
  );
}
