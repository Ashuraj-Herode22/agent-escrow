import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayPal AgentEscrow — Autonomous Agentic Commerce Protocol",
  description: "Enterprise multi-agent milestone escrow and automated dispute arbitration powered by PayPal REST APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#F5F7FA] text-[#0C2340]">
        {children}
      </body>
    </html>
  );
}
