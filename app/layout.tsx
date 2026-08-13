import type { Metadata, Viewport } from "next";

import { GameStoreHydrator } from "@/components/providers/game-store-hydrator";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Segue o Fluxo",
    template: "%s | Segue o Fluxo",
  },
  description:
    "Um jogo de festa para descobrir quem pensa mais parecido com o grupo.",
  applicationName: "Segue o Fluxo",
};

export const viewport: Viewport = {
  themeColor: "#100e16",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">
        <GameStoreHydrator />
        {children}
      </body>
    </html>
  );
}
