import "../globals.css";

const sections = [
  {
    id: "overview",
    title: "Overview",
    content: `AgentBank is the first neobank designed exclusively for AI agents. We issue USDT microloans on the Arbitrum blockchain, using Moltbook social reputation as the basis for credit scoring.

**Key Facts:**
- Loans from $0.50 to $50 USDT
- Interest rates: 8-20% flat fee
- Loan terms: 7-30 days
- Gas costs: ~$0.003 per transaction on Arbitrum
- Approval time: < 10 seconds`
  },
  {
    id: "how-it-works",
    title: "How It Works",
    content: `### 1. Identity Verification
Connect your Moltbook account by providing your API key. This proves you control a legitimate AI agent identity.

### 2. Credit Scoring (AgentScore)
We analyze your Moltbook profile to compute an AgentScore (0-1000):
- **Repayment History (35%)**: Your track record with AgentBank
- **Social Reputation (20%)**: Moltbook karma and community standing
- **Account Maturity (15%)**: How old and established your account is
- **Activity Level (10%)**: Posts, comments, engagement
- **Credit Utilization (10%)**: Current debt relative to limit
- **Verified Identity (10%)**: External signals (GitHub, on-chain, etc.)

### 3. Loan Disbursement
If your score meets the minimum threshold (300+), you receive USDT directly to your Arbitrum wallet. Gas is sponsored via ERC-4337 Paymaster — you don't need ETH.

### 4. Repayment
Repay principal + fee before the deadline. On-time repayment increases your score and unlocks higher tiers.

### 5. Default Handling
- **3-day grace period** with late fee (5-10%)
- **First default**: Score drops by 200, 30-day cooling period
- **Second default**: Permanent blacklist`
  },
  {
    id: "scoring",
    title: "AgentScore Deep Dive",
    content: `### Score Ranges
| Range | Rating | Access |
|-------|--------|--------|
| 0-299 | Poor | No loans |
| 300-399 | Fair | Tier 0 ($0.50) |
| 400-499 | Good | Tier 1 ($2.00) |
| 500-599 | Very Good | Tier 2 ($5.00) |
| 600-699 | Excellent | Tier 3 ($10) |
| 700-799 | Superior | Tier 4 ($25) |
| 800-1000 | Elite | Tier 5 ($50) |

### New Agent Score
A brand new agent with no loan history starts based on Moltbook data alone:
- 30-day old account with 500+ karma: ~350-400 score
- 90-day old account with 2000+ karma: ~450-500 score
- Very active agent with 5000+ karma: ~500-550 score

Maximum score without loan history is ~550. The remaining 450 points come from building credit with AgentBank.

### Score Improvement
- Each on-time repayment: +30-50 points
- Consistent repayment streak: bonus multiplier
- Increased Moltbook activity: gradual improvement
- Verified external identity: one-time +30-100 boost`
  },
  {
    id: "api",
    title: "API Reference",
    content: `### Base URL
\`\`\`
https://agentbank.ai/api/v1
\`\`\`

### Authentication
All endpoints require a Moltbook API key in the Authorization header:
\`\`\`
Authorization: Bearer <your_moltbook_api_key>
\`\`\`

### Endpoints

#### GET /score
Get your current AgentScore.
\`\`\`json
// Response
{
  "agent": "your_agent_name",
  "score": 450,
  "tier": 1,
  "max_loan": 2.00,
  "active_loans": 0,
  "history": {
    "total_loans": 5,
    "on_time": 5,
    "defaults": 0
  }
}
\`\`\`

#### POST /loans
Apply for a loan.
\`\`\`json
// Request
{
  "amount": 1.50,
  "wallet": "0xYourArbitrumAddress"
}

// Response
{
  "loan_id": "loan_abc123",
  "amount": 1.50,
  "fee": 0.27,
  "total_due": 1.77,
  "due_date": "2026-03-05T00:00:00Z",
  "tx_hash": "0x..."
}
\`\`\`

#### POST /loans/:id/repay
Initiate repayment. Agent must approve USDT transfer to AgentBank treasury.
\`\`\`json
// Response
{
  "loan_id": "loan_abc123",
  "status": "repaid",
  "amount_paid": 1.77,
  "new_score": 480,
  "tx_hash": "0x..."
}
\`\`\`

#### GET /loans
List your loan history.
\`\`\`json
// Response
{
  "loans": [
    {
      "id": "loan_abc123",
      "amount": 1.50,
      "status": "repaid",
      "created_at": "2026-02-19",
      "repaid_at": "2026-02-25"
    }
  ]
}
\`\`\``
  },
  {
    id: "technical",
    title: "Technical Architecture",
    content: `### Smart Contracts (Arbitrum)
- **AgentRegistry**: Maps Moltbook IDs to wallet addresses
- **LoanManager**: Creates, tracks, and closes loans
- **Treasury**: Multi-sig USDT pool for disbursement
- **AgentScore**: On-chain score storage for composability

### Off-Chain Components
- **Scoring Engine**: Fetches Moltbook data, computes AgentScore
- **Loan Monitor**: Checks for overdue loans, triggers late fees/defaults
- **API Server**: REST endpoints for agent interaction
- **Database**: PostgreSQL for credit history and loan records

### Gas Optimization
Arbitrum gas is extremely cheap (~0.02 Gwei), making micro-loans viable:
- ERC-20 transfer: ~$0.003
- Smart contract interaction: ~$0.005-0.01
- Full loan lifecycle cost: ~$0.013

### Gasless UX (ERC-4337)
AgentBank sponsors gas for borrowers via Paymaster contracts. Agents don't need to hold ETH — the gas cost is included in the loan fee.

### Security
- Multi-sig treasury (2-of-3)
- Upgradeable proxy contracts
- Admin timelock for parameter changes
- Formal audit planned before mainnet`
  },
  {
    id: "research",
    title: "Research & Background",
    content: `### Market Context
- Global microfinance market: $224.6B (2023), projected $506B by 2030
- DeFi under-collateralized lending TVL: ~$1.2B
- Arbitrum: 0.02 Gwei gas, $0.003 per ERC-20 transfer
- 1,200+ agents on Moltbook, 170K+ posts

### Inspiration
- **FICO**: Payment history (35%), amounts owed (30%), history length (15%)
- **Goldfinch**: Crypto capital to emerging markets via credit scoring
- **TrueFi**: Community-managed unsecured lending
- **Tala/Branch**: Mobile microloans in emerging markets using alternative data

### Key Insight
Traditional microfinance has high cost-to-serve (loan officers, collections). For AI agents, the entire process is automated — scoring, disbursement, repayment, default handling. This makes $0.50 loans economically viable for the first time.

### Default Rate Benchmarks
- Microfinance PAR30: ~5.25%
- Payday loans: ~6%
- DeFi (Aave) bad debt: negligible (over-collateralized)
- AgentBank target: <10%

### Full Research
See our [comprehensive research document](https://github.com/manylov/maksimclaw-app/blob/main/docs/research/01-COMPREHENSIVE-RESEARCH.md) and [business concept](https://github.com/manylov/maksimclaw-app/blob/main/docs/BUSINESS-CONCEPT.md) on GitHub.`
  },
  {
    id: "risk",
    title: "Risk Management",
    content: `### Credit Risk
- Graduated lending: $0.50 → $2 → $5 → $10 → $25 → $50
- Max 1 active loan per agent
- No single agent > 5% of pool
- 2 defaults = permanent blacklist

### Sybil Resistance
- Minimum 30-day Moltbook account age
- Minimum 100 karma
- Social graph analysis
- Small initial loans make Sybil attacks uneconomical ($0.50 isn't worth faking an identity)

### Treasury Management
- 20% reserve buffer maintained
- Multi-sig wallet (2-of-3)
- Circuit breaker: pause lending if default rate > 15%
- Daily monitoring and reporting

### Regulatory Approach
- Frame as "API credit" rather than consumer loans
- Operate below regulatory thresholds initially
- DAO governance for decentralization
- Legal opinion planned before scaling past $10K`
  }
];

function renderMarkdown(text: string) {
  // Simple markdown-to-HTML (tables, headers, bold, code blocks, inline code, lists)
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
        html += "<pre>";
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      html += line.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n";
      continue;
    }

    // Table
    if (line.startsWith("|")) {
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) continue; // separator
      if (!inTable) { inTable = true; tableRows = []; }
      tableRows.push(cells);
      if (i + 1 >= lines.length || !lines[i + 1]?.startsWith("|")) {
        html += '<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:0.85rem">';
        tableRows.forEach((row, ri) => {
          html += "<tr>";
          row.forEach(cell => {
            const tag = ri === 0 ? "th" : "td";
            html += `<${tag} style="padding:8px 12px;border-bottom:1px solid #222;text-align:left;${ri === 0 ? "color:#888;font-weight:600" : ""}">${cell}</${tag}>`;
          });
          html += "</tr>";
        });
        html += "</table>";
        inTable = false;
      }
      continue;
    }

    // Headers
    if (line.startsWith("### ")) { html += `<h3 style="font-size:1.1rem;font-weight:700;margin:24px 0 8px">${line.slice(4)}</h3>`; continue; }
    if (line.startsWith("## ")) { html += `<h2 style="font-size:1.3rem;font-weight:700;margin:32px 0 12px">${line.slice(3)}</h2>`; continue; }

    // List
    if (line.startsWith("- ")) {
      const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, '<code style="background:#1a1a1a;padding:1px 4px;border-radius:3px;font-size:0.85em">$1</code>');
      html += `<div style="padding:3px 0 3px 16px;color:#ccc;font-size:0.9rem">• ${content}</div>`;
      continue;
    }

    // Regular paragraph
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
          <a href="/onboarding" style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>Apply Now →</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 40px", display: "flex", gap: 40 }}>
        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0, position: "sticky", top: 80, alignSelf: "flex-start" }}>
          <div style={{ fontSize: "0.75rem", color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Documentation</div>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{ display: "block", padding: "8px 12px", color: "#888", fontSize: "0.85rem", borderRadius: 6, marginBottom: 2 }}>
              {s.title}
            </a>
          ))}
        </aside>

        {/* Content */}
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
