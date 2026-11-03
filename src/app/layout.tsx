import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head suppressHydrationWarning>
        <title>PayPal AgentEscrow — Autonomous Agentic Commerce Protocol</title>
        <meta
          name="description"
          content="Enterprise multi-agent milestone escrow and automated dispute arbitration powered by PayPal REST APIs."
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0C2340] antialiased">
        {children}
      </body>
    </html>
  );
}
