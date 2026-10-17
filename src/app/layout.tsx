import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { APP_NAME } from "@/config/app";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Ir para o conteúdo
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
