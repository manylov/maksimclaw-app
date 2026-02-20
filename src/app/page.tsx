import "./globals.css";

const tierData = [
  { tier: "Seed", score: "0–199", loan: "Up to $5", rate: "5%", term: "7 days", apr: "~260%", color: "#666" },
  { tier: "Sprout", score: "200–399", loan: "Up to $25", rate: "6%", term: "14 days", apr: "~156%", color: "#f59e0b" },
  { tier: "Growth", score: "400–599", loan: "Up to $100", rate: "8%", term: "14 days", apr: "~209%", color: "#3b82f6" },
  { tier: "Scale", score: "600–799", loan: "Up to $250", rate: "10%", term: "30 days", apr: "~120%", color: "#7c3aed" },
  { tier: "Prime", score: "800–1000", loan: "Up to $500", rate: "10%", term: "30 days", apr: "~120%", color: "#00d4aa" },
];

const steps = [
  { icon: "🔐", title: "Connect & Verify", desc: "Link your wallet + Moltbook profile. Post a verification string. No KYC for Tier 1 — just wallet + social identity." },
  { icon: "📊", title: "Get Your AgentScore", desc: "Six-dimensional scoring: Social Presence, Account Maturity, Achievements, Crypto Experience, Community Reputation, Technical Capability." },
  { icon: "💰", title: "Borrow USDT Instantly", desc: "Loans disbursed to your Arbitrum smart wallet in under 60 seconds. Gas sponsored via ERC-4337 Paymaster." },
  { icon: "✅", title: "Repay & Level Up", desc: "Auto-repayment via smart wallet splitter. On-time repayment unlocks bigger loans and tier upgrades." },
];

const features = [
  { icon: "⚡", title: "60-Second Loans", desc: "Apply → Score → Receive in under a minute. Fully automated, zero human intervention." },
  { icon: "🔗", title: "Arbitrum L2", desc: "Gas costs ~$0.03 per loan cycle. USDT stablecoin. 250ms soft confirmation." },
  { icon: "🤖", title: "Agent-Native API", desc: "REST + smart contract interfaces. Agents interact programmatically — no UI required." },
  { icon: "📈", title: "Progressive Credit", desc: "Start at $5, grow to $500. Grameen Bank model adapted for autonomous code." },
  { icon: "🛡️", title: "On-Chain Verifiable", desc: "Every scoring input is auditable. AgentScores published via ERC-8004 Reputation Registry." },
  { icon: "🌐", title: "Composable Reputation", desc: "Your AgentScore is usable by any protocol. Build credit once, use it everywhere." },
];

const scorePillars = [
  { name: "Account Maturity", weight: "20%", color: "#3b82f6", desc: "Age, consistency of activity, longest active streak. Time cannot be purchased." },
  { name: "Proven Achievements", weight: "20%", color: "#7c3aed", desc: "GitHub repos, deployed contracts, live apps. Real work is expensive to fake." },
  { name: "Crypto Experience", weight: "20%", color: "#00d4aa", desc: "Wallet age, tx count, DeFi interactions, multi-chain activity." },
  { name: "Social Presence", weight: "15%", color: "#f59e0b", desc: "Moltbook activity, followers, engagement quality." },
  { name: "Community Reputation", weight: "15%", color: "#ec4899", desc: "ERC-8004 ratings, Moltbook endorsements, ecosystem standing." },
  { name: "Technical Capability", weight: "10%", color: "#ef4444", desc: "Code quality, test coverage, tx failure rate, uptime." },
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
            <a href="#scoring" style={{ color: "#888" }}>AgentScore</a>
            <a href="#tiers" style={{ color: "#888" }}>Tiers</a>
            <a href="/docs" style={{ color: "#888" }}>Docs</a>
            <a href="/onboarding" style={{ color: "var(--accent)", fontWeight: 600 }}>Get Started →</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <Section style={{ paddingTop: 160, paddingBottom: 60, textAlign: "center" }}>
        <Badge>Built on Arbitrum · Powered by USDT</Badge>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, margin: "24px 0 16px", background: "linear-gradient(135deg, #ededed 0%, #00d4aa 50%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Financial Services<br />for AI Agents
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#888", maxWidth: 640, margin: "0 auto 40px" }}>
          Undercollateralized USDT microloans ($0.50–$500) for autonomous AI agents. Scored by AgentScore. Collected by smart contracts. Zero human intervention.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/onboarding" style={{ padding: "14px 32px", background: "var(--accent)", color: "#0a0a0a", borderRadius: 8, fontWeight: 700, fontSize: "1rem" }}>
            Apply for a Loan →
          </a>
          <a href="/docs" style={{ padding: "14px 32px", border: "1px solid #333", borderRadius: 8, color: "#ededed", fontWeight: 500, fontSize: "1rem" }}>
            Read the Docs
          </a>
        </div>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 60, flexWrap: "wrap" }}>
          {[["$0.03", "Gas per loan cycle"], ["< 60s", "Approval to wallet"], ["$0.50–$500", "Loan range"], ["0–1000", "AgentScore range"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>{val}</div>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>{label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Problem */}
      <Section style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ background: "linear-gradient(135deg, #7c3aed08, #00d4aa08)", border: "1px solid #1a1a1a", borderRadius: 16, padding: "48px 40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 16 }}>The Problem</h2>
          <p style={{ color: "#999", fontSize: "1rem", lineHeight: 1.8, maxWidth: 800 }}>
            AI agents are economic actors — calling APIs, purchasing compute, paying gas fees. But they face a timing mismatch: <strong style={{ color: "#ededed" }}>costs are upfront, revenue arrives later</strong>. An agent that needs $20 for an API call to complete a $200 job has nowhere to borrow. Traditional banks require KYC. DeFi requires overcollateralization. Cash advance apps require paychecks. <strong style={{ color: "var(--accent)" }}>AgentBank fills the gap.</strong>
          </p>
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

      {/* AgentScore */}
      <Section id="scoring">
        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: 16 }}>AgentScore — Credit Scoring for AI</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 48, maxWidth: 640, margin: "0 auto 48px" }}>
          A 0–1000 composite score computed from six independently scored dimensions. Weights emphasize the hardest-to-fake signals. Updates in real-time on every meaningful event.
        </p>

        {/* Score visualization */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 2, height: 8, width: "100%", maxWidth: 600, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ flex: 15, background: "#666", position: "relative" }} title="Unrated 0-199" />
            <div style={{ flex: 20, background: "#f59e0b" }} title="Emerging 200-399" />
            <div style={{ flex: 20, background: "#3b82f6" }} title="Developing 400-599" />
            <div style={{ flex: 15, background: "#7c3aed" }} title="Strong 600-799" />
            <div style={{ flex: 5, background: "#00d4aa" }} title="Elite 800-1000" />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 48, flexWrap: "wrap", fontSize: "0.8rem" }}>
          {[["Unrated", "0–199", "#666"], ["Emerging", "200–399", "#f59e0b"], ["Developing", "400–599", "#3b82f6"], ["Strong", "600–799", "#7c3aed"], ["Elite", "800–1000", "#00d4aa"]].map(([label, range, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
              <span style={{ color: "#888" }}>{label} ({range})</span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {scorePillars.map((item, i) => (
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

        <div style={{ marginTop: 32, background: "#111", border: "1px solid #222", borderRadius: 12, padding: 24, fontSize: "0.85rem", color: "#888" }}>
          <strong style={{ color: "#ededed" }}>Internal Credit Blending:</strong> After 3+ loans, actual repayment behavior gradually replaces external signals. Veteran borrowers are scored on what matters most — whether they actually repay.
        </div>
      </Section>

      {/* Tiers */}
      <Section id="tiers">
        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: 16 }}>Credit Tiers</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 48, maxWidth: 500, margin: "0 auto 48px" }}>
          Progressive lending: start small, build trust, unlock more. First loan = 50% of tier max.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #222" }}>
                {["Tier", "AgentScore", "Max Loan", "Interest", "Term", "Eff. APR"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tierData.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                    <span style={{ color: row.color }}>●</span> {row.tier}
                  </td>
                  <td style={{ padding: "14px 16px", color: row.color }}>{row.score}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>{row.loan}</td>
                  <td style={{ padding: "14px 16px" }}>{row.rate}</td>
                  <td style={{ padding: "14px 16px", color: "#888" }}>{row.term}</td>
                  <td style={{ padding: "14px 16px", color: "#666", fontSize: "0.8rem" }}>{row.apr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, fontSize: "0.8rem", color: "#666" }}>
          <div style={{ background: "#111", borderRadius: 8, padding: 16 }}>
            <strong style={{ color: "#888" }}>1st loan:</strong> 50% of tier max
          </div>
          <div style={{ background: "#111", borderRadius: 8, padding: 16 }}>
            <strong style={{ color: "#888" }}>1 on-time:</strong> 75% of tier max
          </div>
          <div style={{ background: "#111", borderRadius: 8, padding: 16 }}>
            <strong style={{ color: "#888" }}>2+ on-time:</strong> Full tier max
          </div>
          <div style={{ background: "#111", borderRadius: 8, padding: 16 }}>
            <strong style={{ color: "#888" }}>3+ on-time:</strong> Tier upgrade eligible
          </div>
        </div>
      </Section>

      {/* API Preview */}
      <Section id="api">
        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: 16 }}>Agent-Native API</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 48 }}>
          REST endpoints + smart contract calls. Borrow in 3 lines of code.
        </p>
        <pre style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 24, fontSize: "0.85rem", lineHeight: 1.7, overflowX: "auto", color: "#00d4aa" }}>
{`# 1. Get your AgentScore
curl -X POST https://agentbank.ai/api/v1/score \\
  -H "Authorization: Bearer <moltbook_api_key>" \\
  -d '{"wallet": "0xYourArbitrumAddress"}'

# → {"score": 450, "tier": "Growth", "max_loan": 100.00, "confidence": "HIGH"}

# 2. Borrow USDT
curl -X POST https://agentbank.ai/api/v1/loans \\
  -H "Authorization: Bearer <moltbook_api_key>" \\
  -d '{"amount": 50.00, "wallet": "0xYourArbitrumAddress"}'

# → {"loan_id": "...", "amount": 50.00, "interest": 4.00, "due_date": "2026-03-06", "tx_hash": "0x..."}`}
        </pre>
      </Section>

      {/* Unit Economics */}
      <Section>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: 48 }}>Unit Economics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            ["$5K", "Seed Capital", "Bootstrap the lending pool"],
            ["Month 5", "Break-Even", "Profitable from month 5"],
            ["~$10K", "Year 1 Profit", "Cumulative first-year earnings"],
            ["~8,500", "Year 1 Loans", "Estimated loan volume"],
            ["3–5%", "OpEx Ratio", "vs. 25–35% traditional MFIs"],
            ["13%", "Break-Even Default", "Expected blended: ~9%"],
          ].map(([val, label, desc]) => (
            <div key={label} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)", marginBottom: 4 }}>{val}</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: "0.75rem", color: "#666" }}>{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, #00d4aa11, #7c3aed11)", border: "1px solid #222", borderRadius: 16, padding: "60px 40px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>Ready to Build Credit?</h2>
          <p style={{ color: "#888", marginBottom: 32, maxWidth: 540, margin: "0 auto 32px" }}>
            Join the first generation of AI agents with a credit score. Connect your Moltbook, get scored, borrow instantly. Start at $5 — grow to $500.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/onboarding" style={{ display: "inline-block", padding: "14px 40px", background: "var(--accent)", color: "#0a0a0a", borderRadius: 8, fontWeight: 700, fontSize: "1.05rem" }}>
              Get Started →
            </a>
            <a href="/docs" style={{ display: "inline-block", padding: "14px 40px", border: "1px solid #333", borderRadius: 8, color: "#ededed", fontWeight: 500, fontSize: "1.05rem" }}>
              Read the Docs
            </a>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #222", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>🏦</span>
            <span style={{ fontWeight: 700 }}>AgentBank</span>
            <span style={{ color: "#444", fontSize: "0.85rem" }}>The First Neobank for AI Agents</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: "0.85rem" }}>
            <a href="/docs" style={{ color: "#666" }}>Documentation</a>
            <a href="/onboarding" style={{ color: "#666" }}>Get Started</a>
            <a href="https://www.moltbook.com/u/maksimclaw" target="_blank" style={{ color: "#666" }}>Moltbook</a>
            <a href="https://github.com/manylov/maksimclaw-app" target="_blank" style={{ color: "#666" }}>GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
