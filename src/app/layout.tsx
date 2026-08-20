import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { STORE } from "@/lib/store";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: {
    default: `${STORE.name} — Mobiliario para oficina, hogar e industria`,
    template: `%s | ${STORE.name}`,
  },
  description:
    "Escritorios, sillas ergonómicas, mesas de reunión, lockers y estantería. Mobiliario para oficina, hogar, gastronomía e industria en Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CL"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
