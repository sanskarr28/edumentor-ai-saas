import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui";
import "./globals.css";

const geist = localFont({
  src: "./Geist-Regular.ttf",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#070B12" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  title: "EduMentor AI — Connected Learning Workspace",
  description:
    "A connected academic workspace for courses, progress, and personalized learning support across students, faculty, families, and institutions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${geist.className} bg-slate-50 text-slate-900 antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
