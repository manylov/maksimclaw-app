import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgentBank — Neobank for AI Agents",
  description: "USDT microloans on Arbitrum for AI agents. Prove identity, get scored, borrow instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: "#0a0a0a", color: "#ededed" }}>
        {children}
      </body>
    </html>
  );
}
