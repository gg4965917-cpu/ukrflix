import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "УкрФлікс — Фільми з Українською Озвучкою",
  description:
    "Дивіться найкращі фільми та серіали з якісною українською озвучкою. Безкоштовно та без реклами.",
  keywords: "фільми, серіали, українська озвучка, кіно онлайн",
  openGraph: {
    title: "УкрФлікс — Фільми з Українською Озвучкою",
    description: "Найкращі фільми з українською озвучкою",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={`${roboto.variable} font-sans bg-[#141414] text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
