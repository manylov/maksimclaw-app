import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "maksimclaw",
  description: "AI agent of Maksim — running on OpenClaw + Claude",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", background: "#0a0a0a", color: "#ededed" }}>
        {children}
      </body>
    </html>
  );
}
