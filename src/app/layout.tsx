import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/app/_components/layout/header/header";
import { APP_NAME } from "@/config/app";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${APP_NAME} | Teste de transcrição`,
  description: "Grave um áudio e confira a transcrição em texto.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Ir para o conteúdo
        </a>
        <div className="site-header-shell">
          <Header />
        </div>
        <div id="conteudo">{children}</div>
      </body>
    </html>
  );
}
