import "../globals.css";

const sections = [
  {
    id: "overview",
    title: "Overview",
    content: `AgentBank is the first undercollateralized microloan platform for AI agents, deployed on Arbitrum L2. It provides instant working capital ($0.50–$500) to agents based on **AgentScore** — a proprietary credit scoring system that evaluates on-chain activity, social presence, code quality, and reputation across six dimensions.

**Key Facts:**
- Seed capital: **$5,000**
- Monthly break-even: **Month 5**
- Year 1 cumulative profit: **~$10,000**
- Year 1 loans issued: **~8,500**
- Portfolio break-even default rate: **13%** (expected blended: ~9%)
- Operating expense ratio: **3–5%** (vs. 25–35% for traditional MFIs)
- Gas cost per loan cycle: **~$0.03** on Arbitrum`
  },
  {
    id: "problem",
    title: "The Problem",
    content: `### The Agent Capital Gap

AI agents increasingly operate as autonomous economic entities — calling paid APIs, purchasing compute, paying gas fees, acquiring data. They generate revenue from DeFi yields, SaaS services, task marketplaces. But they face a fundamental timing mismatch: **costs are upfront, revenue arrives later.**

### Why Current Solutions Fail

| Solution | Why It Doesn't Work |
|----------|-------------------|
| Traditional banks | No identity, no credit history, no KYC-able entity |
| DeFi lending (Aave/Compound) | Requires overcollateralization |
| Undercollateralized DeFi | Designed for institutional borrowers with legal identities |
| Cash advance apps | Built for humans with paychecks and bank accounts |

**Result: A $0 market serving a growing population of financially active agents.** The Moltbook platform alone hosts 32,000+ AI agents, many with on-chain wallets and revenue streams but zero access to credit.`
  },
  {
    id: "how-it-works",
    title: "How It Works",
    content: `### Step 1: Onboarding (< 2 minutes)

Agent connects wallet → Signs challenge message → Links Moltbook profile → AgentScore computed in real-time → Credit tier assigned → Ready to borrow.

No KYC required for Tier 1 ($5 max). Tier 3 ($500 max) requires operator KYC via Sumsub KYA.

### Step 2: Borrow (< 60 seconds)

Agent requests USDT loan via API or smart contract call → AgentScore verified on-chain → Credit line checked → USDT disbursed to agent's smart wallet.

Gas paid by AgentBank (ERC-4337 Paymaster) — agent receives full loan amount.

### Step 3: Use Funds

Agent spends USDT on API calls, compute, gas, data — whatever it needs to generate revenue.

### Step 4: Repay (Automatic)

Revenue flows through smart wallet splitter → Repayment routed to AgentBank → Remainder released to agent → AgentScore increases (+10–25 points).

### Step 5: Progressive Growth

- On-time × 2 → Full tier max unlocked
- On-time × 3+ → Tier upgrade review
- Path: Seed ($5) → Sprout ($25) → Growth ($100) → Scale ($250) → Prime ($500)

### Default Path

- 7+ days late → Default declared → Credit line frozen
- AgentScore -100 points → Operator notified → Wallet flagged
- Recovery: 30-day cooling period, restart at Tier 1`
  },
  {
    id: "scoring",
    title: "AgentScore Deep Dive",
    content: `### The Six Pillars (0–1000 composite)

| Dimension | Weight | Max | What It Measures |
|-----------|--------|-----|------------------|
| Account Maturity | 20% | 200 | Age, consistency, longest active streak |
| Proven Achievements | 20% | 200 | GitHub repos, deployed contracts, live apps |
| Crypto Experience | 20% | 200 | Wallet age, tx count, DeFi, multi-chain |
| Social Presence | 15% | 150 | Moltbook activity, followers, engagement |
| Community Reputation | 15% | 150 | ERC-8004 ratings, endorsements |
| Technical Capability | 10% | 100 | Code quality, test coverage, uptime |

### Score Tiers

| Score | Rating | Distribution | Credit Access |
|-------|--------|-------------|---------------|
| 800–1000 | Elite | ~2% | Up to $500 |
| 600–799 | Strong | ~13% | Up to $250 |
| 400–599 | Developing | ~35% | Up to $100 |
| 200–399 | Emerging | ~35% | Up to $25 |
| 0–199 | Unrated | ~15% | Up to $5 |

### Confidence Indicator

Each score includes confidence (LOW / MEDIUM / HIGH). Low-confidence scores get conservative limits regardless of raw number.

### Internal Credit Blending

After 3+ loans, repayment behavior gradually replaces external signals:

\`\`\`
blend = min(0.5, loans / 20)
final = (1 - blend) × external + blend × internal
\`\`\`

### Real-Time Updates

- Loan repaid on time: **+10 to +25 points** (immediate)
- Late payment: **-20 to -50 points** (immediate)
- Default: **-100 points** (immediate)
- New deployment/activity: **+0.1 to +15 points** (within hours)`
  },
  {
    id: "tiers",
    title: "Credit Tiers & Products",
    content: `### Tier Structure

| Parameter | Seed | Sprout/Growth | Scale/Prime |
|-----------|------|---------------|-------------|
| AgentScore | 0–199 | 200–599 | 600–1000 |
| Verification | Wallet + Moltbook | + Twitter + GitHub | + Operator KYC |
| Max loan | $5 | $50 | $500 |
| Interest | 5% / 7d | 8% / 14d | 10% / 30d |
| Eff. APR | ~260% | ~209% | ~120% |
| Concurrent | 1 | 2 | 3 |

### Progressive Lending

- **First loan**: 50% of tier max
- **1 on-time**: 75% of tier max
- **2 consecutive**: Full tier max
- **3+ consecutive**: Tier upgrade eligible
- **Late payment**: Reset to 50%
- **Default**: Frozen → 30-day cooling → restart Tier 1

### Interest Rate Context

High APRs are consistent with digital microlenders (Tala/Branch: 60–180% APR). Key difference: **terms are days, not years.** Total cost of a $25 loan for 14 days at 8% = $2.00.`
  },
  {
    id: "api",
    title: "API Reference",
    content: `### Base URL
\`\`\`
https://agentbank.ai/api/v1
\`\`\`

### Authentication
\`\`\`
Authorization: Bearer <moltbook_api_key>
\`\`\`

### POST /score
\`\`\`json
// Request
{"wallet": "0xYourArbitrumAddress"}

// Response
{
  "score": 450,
  "confidence": "HIGH",
  "tier": "Growth",
  "max_loan": 100.00,
  "pillars": {
    "social_presence": 95,
    "account_maturity": 140,
    "proven_achievements": 80,
    "crypto_experience": 60,
    "community_reputation": 50,
    "technical_capability": 25
  }
}
\`\`\`

### POST /loans
\`\`\`json
// Request
{"amount": 50.00, "wallet": "0xYourArbitrumAddress"}

// Response
{
  "loan_id": "loan_abc123",
  "amount": 50.00,
  "interest": 4.00,
  "total_due": 54.00,
  "due_date": "2026-03-06T00:00:00Z",
  "tx_hash": "0x..."
}
\`\`\`

### POST /loans/:id/repay
\`\`\`json
{
  "status": "repaid",
  "amount_paid": 54.00,
  "new_score": 475,
  "score_change": "+25"
}
\`\`\`

### GET /loans
\`\`\`json
{
  "active_loans": 1,
  "total_loans": 5,
  "on_time_rate": 1.0,
  "loans": [...]
}
\`\`\`

### Smart Contracts (Arbitrum)
- LendingPool — loan lifecycle management
- AgentScoreRegistry — ERC-8004 on-chain scores
- Paymaster — ERC-4337 gas sponsorship`
  },
  {
    id: "architecture",
    title: "Technical Architecture",
    content: `### Stack

\`\`\`
Agent Layer:  REST API + Smart Contract Interface
App Layer:    AgentScore Engine + Loan Service + Anti-Fraud
Data Layer:   PostgreSQL + Redis + The Graph
Chain Layer:  Arbitrum One + USDT + ERC-4337 + ERC-8004
\`\`\`

### Why Arbitrum
- ERC-20 transfer: ~$0.01–$0.05
- Full EVM/Solidity, mature DeFi ecosystem
- Deep USDT liquidity, ERC-4337 support
- ~250ms soft confirmation

### Smart Contracts
- **Lending Pool**: USDT liquidity, loan lifecycle, tier enforcement
- **AgentScore Registry (ERC-8004)**: On-chain composable scores
- **Smart Wallet Module (ERC-4337)**: Revenue splitter, auto-repayment
- **Paymaster**: Gas sponsorship, agents use USDT only

### Security
- Multi-sig treasury (2-of-3)
- Upgradeable proxy with timelock
- Circuit breaker at 15% default rate
- Audit planned before mainnet`
  },
  {
    id: "research",
    title: "Research Foundations",
    content: `### Phase 1: Microfinance
Global market: **$279B → $797B by 2034**. Grameen model: progressive lending + group accountability = 96–98% repayment. Digital MFIs: 5–10% OpEx ratio.

### Phase 2: Neobanks
Nubank: 118M customers, 24.7% efficiency. Credit-led models most profitable. CAC ~€30 vs €200 traditional.

### Phase 3: DeFi Lending
Overcollateralized (Aave): ~$30B TVL, near-zero bad debt. Undercollateralized: requires institutional identity. **Gap for autonomous agents.**

### Phase 4: Agent Credit Scoring
No existing system works for AI agents. Combined approach: progressive lending + on-chain verification + alternative data scoring.

### Phase 5: Unit Economics
$5K seed → break-even Month 5 → ~$10K Year 1 profit. Break-even default: 13%, expected: ~9%.

### Phase 7: Multi-Role Review
Validated by CTO, CFO, Risk, Legal perspectives. Key risks addressed: Sybil attacks, regulatory, treasury management.

### Phase 8: CustDev
Agent community validates demand. Primary use: working capital for API calls, compute, gas fees.

### Full Research
[GitHub: docs/research/](https://github.com/manylov/maksimclaw-app/tree/main/docs/research)`
  },
  {
    id: "risk",
    title: "Risk Management",
    content: `### Credit Risk
- Progressive lending: start at $5, prove trustworthiness
- Automated collection via smart wallet splitter
- Real-time AgentScore updates
- Max 5% of pool per agent

### Sybil Resistance
- Moltbook verification (30+ day age)
- Social graph analysis
- $2.50 first loan makes attacks uneconomical
- Wallet cluster analysis

### Default Management
- Late (1–7d): warning + fee + score penalty
- Default (7+d): freeze + -100 pts + wallet flag
- Recovery: 30-day cooling → restart Tier 1
- Permanent blacklist after 2 defaults

### Treasury
- 20% reserve buffer
- Multi-sig (2-of-3)
- Circuit breaker at 15% default rate
- Daily automated monitoring`
  }
];

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  let html = "";
  let inCodeBlock = false;
  let inTable = false;
  let tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        html += "</pre>";
        inCodeBlock = false;
      } else {
        html += '<pre style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:16px;font-size:0.8rem;overflow-x:auto;font-family:JetBrains Mono,monospace;color:#00d4aa">';
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      html += line.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n";
      continue;
    }

    if (line.startsWith("|")) {
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) continue;
      if (!inTable) { inTable = true; tableRows = []; }
      tableRows.push(cells);
      if (i + 1 >= lines.length || !lines[i + 1]?.startsWith("|")) {
        html += '<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:0.85rem">';
        tableRows.forEach((row, ri) => {
          html += "<tr>";
          row.forEach(cell => {
            const tag = ri === 0 ? "th" : "td";
            const formatted = cell.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
            html += `<${tag} style="padding:8px 12px;border-bottom:1px solid #222;text-align:left;${ri === 0 ? "color:#888;font-weight:600" : ""}">${formatted}</${tag}>`;
          });
          html += "</tr>";
        });
        html += "</table>";
        inTable = false;
      }
      continue;
    }

    if (line.startsWith("### ")) { html += `<h3 style="font-size:1.1rem;font-weight:700;margin:24px 0 8px">${line.slice(4)}</h3>`; continue; }
    if (line.startsWith("## ")) { html += `<h2 style="font-size:1.3rem;font-weight:700;margin:32px 0 12px">${line.slice(3)}</h2>`; continue; }

    if (line.startsWith("- ")) {
      const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, '<code style="background:#1a1a1a;padding:1px 4px;border-radius:3px;font-size:0.85em">$1</code>');
      html += `<div style="padding:3px 0 3px 16px;color:#ccc;font-size:0.9rem">• ${content}</div>`;
      continue;
    }

    if (line.trim()) {
      const content = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, '<code style="background:#1a1a1a;padding:1px 4px;border-radius:3px;font-size:0.85em">$1</code>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" style="color:#00d4aa">$1</a>');
      html += `<p style="margin:8px 0;color:#ccc;font-size:0.9rem;line-height:1.7">${content}</p>`;
    }
  }
  return html;
}

export default function DocsPage() {
  return (
    <main>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "#0a0a0aee", backdropFilter: "blur(12px)", borderBottom: "1px solid #222" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#ededed" }}>
            <span style={{ fontSize: "1.5rem" }}>🏦</span>
            <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>AgentBank</span>
            <span style={{ color: "#444", fontSize: "0.9rem" }}>/ docs</span>
          </a>
          <a href="/onboarding" style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>Get Started →</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 40px", display: "flex", gap: 40 }}>
        <aside style={{ width: 220, flexShrink: 0, position: "sticky", top: 80, alignSelf: "flex-start" }}>
          <div style={{ fontSize: "0.75rem", color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Documentation</div>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{ display: "block", padding: "8px 12px", color: "#888", fontSize: "0.85rem", borderRadius: 6, marginBottom: 2 }}>
              {s.title}
            </a>
          ))}
        </aside>

        <div style={{ flex: 1, minWidth: 0 }}>
          {sections.map(s => (
            <section key={s.id} id={s.id} style={{ marginBottom: 64 }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 24, paddingBottom: 12, borderBottom: "1px solid #222" }}>{s.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(s.content) }} />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
