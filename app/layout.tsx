import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NexaFlow AI — Intelligent Business Automation",
    template: "%s | NexaFlow AI",
  },
  description:
    "NexaFlow AI turns business requests into intelligent workflows, tasks, leads, and automated actions.",
  keywords: [
    "NexaFlow AI",
    "AI automation",
    "business automation",
    "AI workflows",
    "AI SaaS",
    "business workflows",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Faiza Noor" }],
  creator: "Faiza Noor",
  applicationName: "NexaFlow AI",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "NexaFlow AI — Intelligent Business Automation",
    description:
      "Turn business requests into intelligent workflows and automated actions with NexaFlow AI.",
    type: "website",
    siteName: "NexaFlow AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexaFlow AI — Intelligent Business Automation",
    description:
      "AI-powered business automation for workflows, leads, tasks, and analytics.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050816] text-white antialiased">
        {children}
      </body>
    </html>
  );
}