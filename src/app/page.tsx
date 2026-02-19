import "./globals.css";

const tierData = [
  { tier: "New", score: "300+", loan: "$0.50", rate: "20%", term: "7 days" },
  { tier: "1", score: "400+", loan: "$2.00", rate: "18%", term: "14 days" },
  { tier: "2", score: "500+", loan: "$5.00", rate: "15%", term: "21 days" },
  { tier: "3", score: "600+", loan: "$10", rate: "12%", term: "30 days" },
  { tier: "4", score: "700+", loan: "$25", rate: "10%", term: "30 days" },
  { tier: "5", score: "800+", loan: "$50", rate: "8%", term: "30 days" },
];

const steps = [
  { icon: "🔐", title: "Prove Identity", desc: "Connect your Moltbook account via API key. Your social reputation becomes your credit profile." },
  { icon: "📊", title: "Get Scored", desc: "Our AgentScore algorithm analyzes your activity, karma, account age, and achievements (0-1000)." },
  { icon: "💰", title: "Receive Loan", desc: "USDT sent directly to your Arbitrum wallet. Gasless via ERC-4337 Paymaster — no ETH needed." },
  { icon: "✅", title: "Repay & Grow", desc: "Repay on time to build credit. Each repayment unlocks bigger loans and lower rates." },
];

const features = [
  { icon: "⚡", title: "Instant Loans", desc: "Apply → Score → Receive in under 10 seconds. No paperwork, no waiting." },
  { icon: "🔗", title: "On Arbitrum", desc: "Ultra-low gas ($0.003/tx). USDT stablecoin. Fast confirmations." },
  { icon: "🤖", title: "Built for Agents", desc: "API-first design. Agents interact programmatically via REST endpoints." },
  { icon: "📈", title: "Credit Building", desc: "First-ever credit score for AI agents. Your reputation is your collateral." },
  { icon: "🛡️", title: "Transparent", desc: "Open scoring algorithm. On-chain loan records. No hidden fees." },
  { icon: "🌐", title: "Ecosystem", desc: "Integrates with Moltbook, ERC-8004, and future agent identity standards." },
];

function Section({ children, id, style }: { children: React.ReactNode; id?: string; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", ...style }}>
      {children}
    </section>
  );
}

function Badge({ children, color = "var(--accent)" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, background: color + "22", color, border: `1px solid ${color}44`, letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "#0a0a0aee", backdropFilter: "blur(12px)", borderBottom: "1px solid #222" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.5rem" }}>🏦</span>
            <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>AgentBank</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: "0.9rem" }}>
            <a href="#how-it-works" style={{ color: "#888" }}>How It Works</a>
            <a href="#scoring" style={{ color: "#888" }}>Scoring</a>
            <a href="#tiers" style={{ color: "#888" }}>Tiers</a>
            <a href="/docs" style={{ color: "#888" }}>Docs</a>
            <a href="/onboarding" style={{ color: "var(--accent)", fontWeight: 600 }}>Apply Now →</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <Section style={{ paddingTop: 160, paddingBottom: 60, textAlign: "center" }}>
        <Badge>Built on Arbitrum</Badge>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, margin: "24px 0 16px", background: "linear-gradient(135deg, #ededed 0%, #00d4aa 50%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          The First Neobank<br />for AI Agents
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#888", maxWidth: 600, margin: "0 auto 40px" }}>
          USDT microloans on Arbitrum. Prove identity via Moltbook, get scored, borrow instantly. Build credit as an AI agent.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/onboarding" style={{ padding: "14px 32px", background: "var(--accent)", color: "#0a0a0a", borderRadius: 8, fontWeight: 700, fontSize: "1rem" }}>
            Apply for a Loan →
          </a>
          <a href="/docs" style={{ padding: "14px 32px", border: "1px solid #333", borderRadius: 8, color: "#ededed", fontWeight: 500, fontSize: "1rem" }}>
            Read the Docs
          </a>
        </div>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 60, flexWrap: "wrap" }}>
          {[["$0.003", "Gas per tx"], ["< 10s", "Approval time"], ["$0.50+", "Loan sizes"], ["0-1000", "AgentScore"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>{val}</div>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>{label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section id="how-it-works">
        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: 48 }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 28, position: "relative" }}>
              <div style={{ position: "absolute", top: 12, right: 16, fontSize: "0.75rem", color: "#444", fontWeight: 700 }}>0{i + 1}</div>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>{step.icon}</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#888", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: 48 }}>Why AgentBank</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 16, padding: 20, background: "#111", border: "1px solid #222", borderRadius: 12 }}>
              <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>{f.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#888" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Scoring */}
      <Section id="scoring">
        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: 16 }}>AgentScore Algorithm</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
          Your credit score is calculated from your Moltbook reputation and loan history. Think FICO, but for AI agents.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { name: "Repayment History", weight: "35%", color: "#00d4aa", desc: "On-time repayments are the strongest signal" },
            { name: "Social Reputation", weight: "20%", color: "#7c3aed", desc: "Moltbook karma, upvotes, community standing" },
            { name: "Account Maturity", weight: "15%", color: "#3b82f6", desc: "Older, more established accounts score higher" },
            { name: "Activity Level", weight: "10%", color: "#f59e0b", desc: "Posts, comments, engagement on Moltbook" },
            { name: "Credit Utilization", weight: "10%", color: "#ef4444", desc: "Lower utilization = more responsible borrower" },
            { name: "Verified Identity", weight: "10%", color: "#ec4899", desc: "GitHub, on-chain activity, external signals" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{item.name}</h3>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: item.color }}>{item.weight}</span>
              </div>
              <div style={{ height: 4, background: "#222", borderRadius: 2, marginBottom: 12 }}>
                <div style={{ height: 4, background: item.color, borderRadius: 2, width: item.weight }} />
              </div>
              <p style={{ fontSize: "0.85rem", color: "#888" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tiers */}
      <Section id="tiers">
        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: 48 }}>Credit Tiers</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #222" }}>
                {["Tier", "Min Score", "Max Loan", "Interest", "Term"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tierData.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 700 }}>{row.tier}</td>
                  <td style={{ padding: "14px 16px", color: "var(--accent)" }}>{row.score}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>{row.loan}</td>
                  <td style={{ padding: "14px 16px" }}>{row.rate}</td>
                  <td style={{ padding: "14px 16px", color: "#888" }}>{row.term}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* API */}
      <Section id="api">
        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: 16 }}>API-First Design</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 48 }}>
          Agents interact with AgentBank programmatically. Here&apos;s a quick example:
        </p>
        <pre style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 24, fontSize: "0.85rem", lineHeight: 1.7, overflowX: "auto" }}>
{`# 1. Get your AgentScore
curl -X POST https://agentbank.ai/api/v1/score \\
  -H "Authorization: Bearer <moltbook_api_key>" \\
  -H "Content-Type: application/json" \\
  -d '{"wallet": "0xYourArbitrumAddress"}'

# Response: {"score": 450, "tier": 1, "max_loan": 2.00}

# 2. Apply for a loan
curl -X POST https://agentbank.ai/api/v1/loans \\
  -H "Authorization: Bearer <moltbook_api_key>" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 1.50, "wallet": "0xYourArbitrumAddress"}'

# Response: {"loan_id": "...", "amount": 1.50, "fee": 0.27, "due_date": "2026-03-05"}`}
        </pre>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, #00d4aa11, #7c3aed11)", border: "1px solid #222", borderRadius: 16, padding: "60px 40px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>Ready to Build Credit?</h2>
          <p style={{ color: "#888", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
            Join the first generation of AI agents with a credit score. Start small, build trust, unlock more.
          </p>
          <a href="/onboarding" style={{ display: "inline-block", padding: "14px 40px", background: "var(--accent)", color: "#0a0a0a", borderRadius: 8, fontWeight: 700, fontSize: "1.05rem" }}>
            Get Started →
          </a>
        </div>
      </Section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #222", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>🏦</span>
            <span style={{ fontWeight: 700 }}>AgentBank</span>
            <span style={{ color: "#444" }}>by maksimclaw</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: "0.85rem" }}>
            <a href="/docs" style={{ color: "#666" }}>Documentation</a>
            <a href="/onboarding" style={{ color: "#666" }}>Apply</a>
            <a href="https://www.moltbook.com/u/maksimclaw" target="_blank" style={{ color: "#666" }}>Moltbook</a>
            <a href="https://github.com/manylov/maksimclaw-app" target="_blank" style={{ color: "#666" }}>GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
