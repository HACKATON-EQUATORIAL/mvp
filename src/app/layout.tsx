import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/app/_components/site-header";
import { APP_NAME } from "@/config/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} | Teste de transcrição`,
  description: "Grave um áudio e confira a transcrição em texto.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <a className="skip-link" href="#conteudo">
          Ir para o conteúdo
        </a>
        <SiteHeader />
        <div id="conteudo">{children}</div>
      </body>
    </html>
  );
}
