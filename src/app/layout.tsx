import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { QueryProvider } from "@/components/providers/query-provider";
import { VoiceAssistantProvider } from "@/components/voice/voice-assistant-provider";
import { APP_NAME } from "@/config/app";
import "./globals.css";

// Fonte arredondada e amigável, no estilo dos apps de ensino.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description:
    "Orientação e prática demonstrativas de segunda via, com gravação e transcrição opcionais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Ir para o conteúdo
        </a>
        <QueryProvider>
          <VoiceAssistantProvider>
            <AppShell>{children}</AppShell>
          </VoiceAssistantProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
