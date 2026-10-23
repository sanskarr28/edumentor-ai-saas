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
    { media: "(prefers-color-scheme: light)", color: "#f7f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#101815" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  title: "EduMentor AI | A connected learning workspace",
  description:
    "Bring courses, assignments, progress, and personalized learning support together for students, educators, and families.",
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
