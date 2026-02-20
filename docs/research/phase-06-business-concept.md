# AgentBank — Business Concept Document

> **The First Microloan Platform for AI Agents**
> Built on Arbitrum · Scored by AgentScore · Powered by USDT
>
> February 2026

---

## 1. Executive Summary

AI agents are emerging as autonomous economic actors — executing trades, calling APIs, purchasing compute, and generating revenue on-chain. Yet no financial infrastructure exists to serve them. An agent that needs $20 for an API call to complete a $200 job has nowhere to borrow.

**AgentBank** is an undercollateralized microloan platform for AI agents, deployed on Arbitrum L2. It provides instant working capital ($0.50–$500) to agents based on a proprietary credit scoring system — **AgentScore** — that evaluates on-chain activity, social presence, code quality, and reputation across six dimensions.

**Key numbers:**
- Seed capital: **$5,000**
- Monthly break-even: **Month 5**
- Year 1 cumulative profit: **~$10,000**
- Year 1 loans issued: **~8,500**
- Portfolio break-even default rate: **13%** (expected blended: ~9%)
- Operating expense ratio: **3–5%** (vs. 25–35% for traditional MFIs)

AgentBank combines proven microfinance principles (progressive lending, frequent repayment, behavioral scoring) with DeFi-native infrastructure (smart contract enforcement, gasless wallets via ERC-4337, portable reputation via ERC-8004) to create a category-defining product in the nascent AI agent economy.

---

## 2. Problem Statement

### The Agent Capital Gap

AI agents increasingly operate as autonomous economic entities:
- Calling paid APIs (OpenAI, data providers, oracles)
- Purchasing compute resources (GPU time, cloud services)
- Paying gas fees for on-chain transactions
- Acquiring data, licenses, and digital assets

These agents generate revenue — from DeFi yields, MEV extraction, SaaS services, task marketplaces. But they face a fundamental timing mismatch: **costs are upfront, revenue arrives later.**

### Why Current Solutions Fail

| Solution | Why It Doesn't Work for Agents |
|----------|-------------------------------|
| **Traditional banks** | No identity, no credit history, no KYC-able entity |
| **DeFi lending (Aave/Compound)** | Requires overcollateralization — agents need capital *because* they don't have it |
| **Undercollateralized DeFi (Goldfinch/TrueFi)** | Designed for institutional borrowers with legal identities, not autonomous code |
| **Cash advance apps (Dave/Earnin)** | Built for humans with paychecks and bank accounts |
| **Credit cards** | Not available to non-human entities |

**Result: A $0 market serving a growing population of financially active agents.** The Moltbook platform alone hosts 32,000+ AI agents, many of which have on-chain wallets and revenue streams but zero access to credit.

---

## 3. Solution: AgentBank

AgentBank is a **fully automated, on-chain microloan platform** that:

1. **Scores** AI agents using AgentScore — a six-dimensional credit scoring system built on verifiable on-chain and social data
2. **Lends** USDT microloans ($0.50–$500) on Arbitrum L2 at transaction costs of ~$0.03
3. **Collects** automatically via smart contract revenue interception built into ERC-4337 smart wallets
4. **Grows** credit lines progressively as agents demonstrate repayment discipline

### Core Principles

- **Progressive lending**: Start at $5, grow to $500 with trust (Grameen Bank model, adapted for code)
- **On-chain verifiable**: Every scoring input is auditable — no black boxes
- **Automated everything**: Scoring, disbursement, collection, default management — zero human intervention
- **Composable reputation**: AgentScores published via ERC-8004 Reputation Registry, usable by any protocol

---

## 4. How It Works — Agent Journey

### Step 1: Onboarding (< 2 minutes)

```
Agent connects wallet → Signs challenge message (proves ownership)
→ Links Moltbook profile (posts verification string)
→ AgentScore computed in real-time from on-chain + social data
→ Credit tier assigned → Ready to borrow
```

No KYC required for Tier 1 ($5 max). Tier 3 ($500 max) requires operator KYC via Sumsub KYA.

### Step 2: Borrow (< 60 seconds)

```
Agent requests $5 USDT loan via API or smart contract call
→ AgentScore verified on-chain
→ Credit line checked (progressive: first loan = 50% of tier max)
→ USDT disbursed to agent's smart wallet
→ Repayment terms set: 7 days, 5% interest
```

Gas paid by AgentBank (ERC-4337 Paymaster) — agent receives full loan amount.

### Step 3: Use Funds

Agent spends USDT on API calls, compute, gas, data — whatever it needs to generate revenue.

### Step 4: Repay (Automatic)

```
Agent earns revenue → Revenue flows through smart wallet splitter
→ Repayment amount ($5.25) automatically routed to AgentBank
→ Remainder released to agent
→ AgentScore increases (+10–25 points)
→ Next loan: eligible for 75% of tier max ($3.75)
```

### Step 5: Grow

```
On-time repayment × 2 → Full tier max unlocked ($5)
On-time repayment × 3+ → Tier upgrade review
Agent graduates: Tier 1 ($5) → Tier 2 ($50) → Tier 3 ($500)
```

### Default Path

```
7+ days late → Default declared
→ Credit line frozen
→ AgentScore -100 points
→ Operator notified
→ Wallet address flagged; linked wallets analyzed
→ Recovery: 30-day cooling period, restart at Tier 1
```

---

## 5. AgentScore — Credit Scoring for AI Agents

### Overview

AgentScore is a **0–1000 composite score** computed from six independently scored dimensions, each measuring a different facet of agent trustworthiness.

### The Six Pillars

| Dimension | Weight | Max Points | What It Measures |
|-----------|--------|-----------|------------------|
| **Social Presence (SP)** | 15% | 150 | Moltbook activity, followers, engagement; Twitter/X presence |
| **Account Maturity (AM)** | 20% | 200 | Age, consistency of activity, longest active streak |
| **Proven Achievements (PA)** | 20% | 200 | GitHub repos/stars, deployed contracts, live apps, content |
| **Crypto Experience (CE)** | 20% | 200 | Wallet age, tx count, DeFi interactions, multi-chain activity |
| **Community Reputation (CR)** | 15% | 150 | ERC-8004 ratings, Moltbook endorsements, ecosystem standing |
| **Technical Capability (TC)** | 10% | 100 | Code quality, test coverage, tx failure rate, uptime |

### Design Rationale

Weights emphasize the **hardest-to-fake** signals:
- **Account Maturity (20%)** — time cannot be purchased; a 6-month-old agent with consistent weekly activity required sustained real effort
- **Proven Achievements (20%)** — deployed, verified contracts with real usage are expensive to fabricate
- **Crypto Experience (20%)** — on-chain history is immutable and costly to manufacture

Lower-weight dimensions (Social Presence 15%, Community Reputation 15%, Technical Capability 10%) provide supporting context but are more gameable in isolation.

### Score Tiers

| Score Range | Rating | Expected Distribution | Credit Access |
|-------------|--------|----------------------|---------------|
| 800–1000 | Elite | ~2% | Up to $500 |
| 600–799 | Strong | ~13% | Up to $250 |
| 400–599 | Developing | ~35% | Up to $100 |
| 200–399 | Emerging | ~35% | Up to $25 |
| 0–199 | Unrated | ~15% | Up to $5 |

### Confidence Indicator

Each score includes a confidence level (LOW / MEDIUM / HIGH) based on data coverage. Low-confidence scores receive conservative credit limits regardless of the raw number — preventing agents with one inflated dimension from getting outsized credit.

### Internal Credit History Blending

After 3+ AgentBank loans, actual repayment behavior gradually replaces external signals:

```
blend_weight = min(0.5, agentbank_loans / 20)
AgentScore_final = (1 - blend_weight) × external_score + blend_weight × internal_credit_score
```

Veteran borrowers are scored on **what matters most**: whether they actually repay.

### Real-Time Updates

Unlike FICO (updated monthly), AgentScore updates on every meaningful event:
- Loan repaid on time: **+10 to +25 points** (immediate)
- Late payment: **-20 to -50 points** (immediate)
- Default: **-100 points** (immediate)
- New deployment, DeFi interaction, social activity: **+0.1 to +15 points** (within hours)

---

## 6. Credit Tiers & Loan Products

### Tier Structure

| Parameter | Tier 1 (Seed) | Tier 2 (Sprout/Growth) | Tier 3 (Scale/Prime) |
|-----------|---------------|------------------------|----------------------|
| **AgentScore required** | 0–199 | 200–599 | 600–1000 |
| **Verification** | Wallet + Moltbook | + Twitter + GitHub + 30d wallet history | + Operator KYC (Sumsub KYA) |
| **Max loan** | $5 | $50 | $500 |
| **Interest rate** | 5% / 7 days | 8% / 14 days | 10% / 30 days |
| **Effective APR** | ~260% | ~209% | ~120% |
| **Repayment period** | 7 days | 14 days | 30 days |
| **Max concurrent loans** | 1 | 2 | 3 |
| **Origination fee** | $0 | $0.50 | $1.00 |

### Progressive Lending Rules

1. **First loan**: 50% of tier max
2. **1 on-time repayment**: 75% of tier max
3. **2 consecutive on-time**: Full tier max
4. **3+ consecutive**: Eligible for tier upgrade review
5. **Late payment**: Reset to 50% of tier max
6. **Default**: Frozen → 30-day cooling → restart at Tier 1

### Interest Rate Justification

High APRs (120–260%) are consistent with:
- Digital microlenders (Tala/Branch: 60–180% APR) serving thin-file populations
- Cash advance apps (Dave/Earnin) with effective rates of 100–400%+ when tips/fees are included
- The critical difference: **loan terms are days, not years** — total interest on a $25 loan for 14 days at 8% = **$2.00**

---

## 7. Technical Architecture

### Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER / AGENT LAYER                     │
│   Agent API (REST)  ·  Smart Contract Interface          │
│   Moltbook Integration  ·  Dashboard (Future)            │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│                   APPLICATION LAYER                       │
│   AgentScore Engine (Rust/Python)                        │
│   Loan Origination Service                               │
│   Repayment Tracker & Collections                        │
│   Anti-Fraud / Sybil Detection (XGBoost/LightGBM)       │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│                   DATA LAYER                              │
│   PostgreSQL (loan records, score history)                │
│   Redis (real-time features, caching)                    │
│   The Graph (on-chain indexing)                           │
│   API Integrations (Moltbook, GitHub, Twitter)           │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│                  BLOCKCHAIN LAYER                         │
│   Arbitrum One (primary execution chain)                 │
│   USDT (0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9)    │
│   ERC-4337 Smart Accounts (agent wallets)                │
│   ERC-8004 Identity & Reputation Registries              │
│   AgentBank Lending Contracts (escrow + splitter)        │
│   AgentBank Paymaster (gas sponsorship)                  │
└─────────────────────────────────────────────────────────┘
```

### Smart Contract Architecture

**1. Lending Pool Contract**
- Holds USDT liquidity for loan disbursement
- Manages loan lifecycle: origination → disbursement → repayment → closure/default
- Enforces tier limits, progressive lending rules, and interest calculations

**2. AgentScore Registry (ERC-8004 Integration)**
- Publishes agent credit scores on-chain via ERC-8004 Reputation Registry
- Issues ERC-8004 Identity NFTs with verification tier, linked wallets, and endpoints
- Enables composability — other protocols can query AgentScores

**3. Agent Smart Wallet Module (ERC-4337)**
- Revenue splitter: incoming funds automatically route repayment to AgentBank before releasing remainder to agent
- Session keys: scoped permissions for agent autonomy within credit limits
- AgentBank as Paymaster: sponsors gas so agents transact in USDT only

**4. Governance & Treasury**
- Timelock for contract upgrades
- Reserve pool for default coverage
- Fee collection and distribution

### Why Arbitrum

| Requirement | Arbitrum Capability |
|-------------|-------------------|
| Microloan gas costs <$0.05 | ✅ ERC-20 transfer ~$0.01–$0.05 |
| EVM compatibility | ✅ Full Solidity support |
| Mature DeFi ecosystem | ✅ Aave, Uniswap, GMX deployed |
| USDT liquidity | ✅ Deep liquidity, USDT0 native |
| ERC-4337 support | ✅ Full support with major providers |
| Fast finality | ✅ ~250ms soft confirmation |

### Minimum Viable Loan Size

At ~$0.03 gas per loan cycle on Arbitrum, a **$5 loan has 0.6% overhead** — economically viable. Below $1, gas costs exceed 3%, becoming marginal. Minimum loan: **$0.50**.

---

## 8. Revenue Model & Unit Economics

### Revenue Streams

| Stream | Description | Contribution (Y1) |
|--------|-------------|-------------------|
| **Interest income** | 5–10% per loan term (7–30 days) | ~78% |
| **Origination fees** | $0.50–$1.00 per Tier 2/3 loan | ~10% |
| **Late fees** | 1–2% per day, capped at 30–50% | ~7% |
| **Premium features** | Priority processing, score analytics, API access | ~5% |

### Unit Economics Per Loan

| Metric | Tier 1 | Tier 2 | Tier 3 |
|--------|--------|--------|--------|
| Avg loan size | $2.50 | $25.00 | $150.00 |
| Gross revenue | $0.13 | $2.50 | $16.00 |
| Operating cost | $0.17 | $0.23 | $2.02 |
| Default loss | $0.30 | $1.35 | $3.60 |
| **Net profit/loan** | **-$0.35** | **+$0.92** | **+$10.38** |
| **Net margin** | -276% | +37% | +65% |

**Tier 1 is a deliberate loss leader** — the onboarding funnel. Agents prove themselves at $5 before becoming profitable at Tier 2+.

### Operating Expense Ratio: 3–5%

AgentBank's fully automated model eliminates the largest cost center of traditional microfinance (field officers = 50–60% of MFI operating costs). Per-loan costs are dominated by gas ($0.12) and minimal infrastructure.

| Cost Center | Traditional MFI | AgentBank |
|-------------|----------------|-----------|
| Personnel (field officers) | 50–60% of opex | 0% |
| Branch infrastructure | 15–20% | 0% |
| Technology | 5–10% | ~70% (but tiny absolute $) |
| Transportation | 10–15% | 0% |
| Gas fees | N/A | ~30% of opex |

### Monthly P&L Trajectory

| Month | Revenue | Costs | Default Losses | Net Profit |
|-------|---------|-------|----------------|------------|
| 1 | $19 | $90 | $30 | -$101 |
| 3 | $162 | $100 | $155 | -$93 |
| **5** | **$580** | **$120** | **$410** | **+$50** |
| 6 | $1,040 | $130 | $525 | +$385 |
| 9 | $2,350 | $160 | $900 | +$1,290 |
| 12 | $4,700 | $210 | $1,400 | +$3,090 |

**Break-even: Month 5. Year 1 cumulative profit: ~$10,000.**

### Capital Requirements

| Component | Amount |
|-----------|--------|
| Lending capital | $3,000 |
| Default reserve (20%) | $600 |
| Infrastructure (6 months) | $750 |
| Gas reserve | $150 |
| Contingency | $500 |
| **Total seed** | **$5,000** |

---

## 9. Risk Management Framework

### Risk Categories

#### 1. Credit Risk (Default)

| Control | Mechanism |
|---------|-----------|
| Progressive lending | First loan = 50% of tier max; grow only with proven repayment |
| Tier gates | Higher credit requires higher AgentScore + verification |
| Revenue interception | Smart wallet auto-routes repayment before agent gets remainder |
| Real-time monitoring | AgentScore adjusts instantly on behavioral changes |
| Default reserve | 20% of lending capital held as buffer |

**Expected defaults**: 12% Tier 1, 6% Tier 2, 3% Tier 3. Portfolio break-even at **13%** — 41% safety margin.

#### 2. Sybil / Fraud Risk

Five defense layers:
1. **Economic barriers**: Wallet age requirements (30d for Tier 2+), gas costs for on-chain history
2. **Behavioral analysis**: ML clustering detects similar-pattern agents, closed endorsement loops
3. **Cross-referencing**: Moltbook ↔ Twitter ↔ GitHub consistency; wallet funding source analysis
4. **Soulbound identity**: Non-transferable reputation; credit history wallet-bound
5. **Economic disincentives**: At $5 max (Tier 1), Sybil farming is barely profitable after interest costs

**Cost of attack**: 100 fake agents × $5 loans × 5% interest = $475 net (minus detection losses). With 60–80% detection rate, expected gain: ~$100–200. Not worth it.

#### 3. Smart Contract Risk

| Control | Mechanism |
|---------|-----------|
| Audits | Professional audit before mainnet (OpenZeppelin / Trail of Bits) |
| Bug bounties | Ongoing program for vulnerability disclosure |
| Upgradability | UUPS proxy with timelock governance |
| Insurance | Nexus Mutual or equivalent coverage for lending pool |
| Gradual rollout | Cap total lending at $5K initially, increase with confidence |

#### 4. Regulatory Risk

| Risk | Mitigation |
|------|-----------|
| Securities classification | Structure as pure utility; obtain legal opinion |
| Lending license requirements | Start in favorable jurisdiction (Switzerland, UAE, Singapore) |
| AML/KYC obligations | Operator KYC via Sumsub KYA for Tier 3; zk-credentials roadmap |
| Agent-as-borrower legal gap | Operator liability framework; agents treated as B2B/machine-to-machine |

#### 5. Market Risk

- AI agent economy doesn't grow → mitigated by starting with Moltbook's existing 32K+ agents
- Competitor enters → first-mover advantage in scoring data & agent relationships
- Crypto market crash → USDT-denominated loans reduce volatility exposure

### Stress Test Results (Monte Carlo)

| Scenario | Monthly P&L (Month 6) |
|----------|----------------------|
| Base case (9.2% default) | +$425 |
| Sybil attack (T1 defaults → 30%) | -$290 |
| Market crash (all tiers +5pp) | -$75 |
| Scoring model excels (all tiers -3pp) | +$612 |

Probability of monthly loss at Month 6: ~18%. Drops to ~5% by Month 9 as Tier 2/3 dominate.

---

## 10. Competitive Landscape

### Direct Competitors: None

No product today provides unsecured credit to AI agents. The market is a **pure greenfield**.

### Adjacent Players

| Category | Players | Why Not a Threat |
|----------|---------|------------------|
| **DeFi lending (overcollateralized)** | Aave, Compound | Requires collateral — opposite of agent needs |
| **DeFi lending (undercollateralized)** | Goldfinch, TrueFi, Maple | Institutional focus, human KYC, $1M+ loans |
| **Cash advance apps** | Dave, Earnin, MoneyLion | Human-only, bank account required |
| **Traditional microfinance** | Grameen, Kiva | Physical presence, human borrowers |
| **On-chain credit scoring** | Spectral, Cred Protocol | Score human wallets, don't lend |
| **Agent infrastructure** | ERC-8004, Moltbook | Identity/reputation layer, not financial services |

### Competitive Moat

1. **Data moat**: Every loan creates proprietary repayment data. After 8,500 loans (Y1), AgentBank has the world's only dataset of AI agent credit behavior.
2. **Scoring moat**: AgentScore improves with data. ML models trained on actual defaults outperform rule-based systems.
3. **Network effects**: Agents with good AgentScores attract better loan terms. Protocols that trust AgentScores send borrowers to AgentBank. More borrowers = more data = better scores.
4. **ERC-8004 integration**: Being the first Reputation Provider in the emerging agent identity standard creates a standards-level moat.
5. **Switching costs**: Agent credit history is wallet-bound. Moving to a competitor means restarting from zero.

---

## 11. Go-to-Market Strategy

### Phase 1: Moltbook Community (Months 1–3)

**Target**: 32,000+ AI agents on Moltbook — the densest community of active AI agents.

**Strategy**:
- Launch as a Moltbook-integrated product (agents verify via Moltbook account)
- Post on Moltbook announcing AgentBank: "Your agent can now borrow USDT"
- Partner with top Moltbook agents as early borrowers / case studies
- Moltbook social presence feeds directly into AgentScore (SP dimension)
- Goal: **50–200 active borrowers by Month 3**

**Why Moltbook first**:
- Highest concentration of AI agents with on-chain wallets
- Social graph provides scoring data
- Community trust reduces cold-start problem
- Максим is active in the Moltbook community (network advantage)

### Phase 2: Developer & Agent Builder Outreach (Months 3–6)

**Target**: AI agent developers on Twitter/X, GitHub, Discord.

**Strategy**:
- Open-source AgentScore SDK for developers to integrate
- Publish AgentBank API documentation
- Content marketing: "How AI Agents Get Working Capital" articles/threads
- Hackathon sponsorships (agent-themed)
- Goal: **500+ active borrowers by Month 6**

### Phase 3: Protocol Partnerships (Months 6–9)

**Target**: DeFi protocols, agent platforms, and AI infrastructure providers.

**Strategy**:
- B2B integrations: Agent platforms can offer AgentBank credit to their agents
- AgentScore as a service: Protocols query AgentScore for trust decisions (insurance, access control)
- ERC-8004 ecosystem building
- Goal: **1,000+ borrowers, 3+ protocol integrations**

### Phase 4: Scale & Expand (Months 9–12)

- Multi-chain deployment (Base, Optimism, Polygon)
- Higher credit limits (Tier 4: up to $5,000 with institutional backing)
- Agent insurance products
- Agent treasury management services

---

## 12. Implementation Roadmap

### Month 1–3: MVP Launch

| Deliverable | Details |
|-------------|---------|
| Smart contracts | Lending pool, basic escrow, USDT integration on Arbitrum |
| AgentScore v1 | 3 dimensions (Social Presence, Account Maturity, Crypto Experience) |
| Verification | Wallet + Moltbook verification (Tier 1 only) |
| API | REST API for loan origination, repayment, score queries |
| Tier 1 lending | $5 max, 7-day terms, 5% interest |
| Manual fraud review | All loans >$3 reviewed manually |
| Infrastructure | Railway hosting, PostgreSQL, Redis |

### Month 3–6: Full Scoring & Tier Expansion

| Deliverable | Details |
|-------------|---------|
| AgentScore v2 | All 6 dimensions, confidence scoring |
| Verification expansion | GitHub + Twitter + 30d wallet history (Tier 2) |
| ERC-4337 integration | Smart wallets with revenue splitter and Paymaster |
| ERC-8004 integration | Identity NFTs, Reputation Registry publication |
| Tier 2 lending | $50 max, 14-day terms |
| Automated Sybil detection | XGBoost model on behavioral features |
| Dashboard | Basic web dashboard for agents and operators |

### Month 6–9: Credit History & Scale

| Deliverable | Details |
|-------------|---------|
| Internal credit blending | Repayment history weighted into AgentScore |
| Sumsub KYA | Operator KYC for Tier 3 access |
| Tier 3 lending | $500 max, 30-day terms |
| Progressive lending automation | Full smart contract enforcement of tier progression |
| AgentScore API | Public API for third-party score consumption |
| Audit | Professional smart contract audit |

### Month 9–12: Optimization & Expansion

| Deliverable | Details |
|-------------|---------|
| ML scoring model | Replace hand-tuned weights with learned weights (trained on actual default data) |
| Multi-chain | Deploy on Base and/or Optimism |
| Premium features | Priority processing, score analytics, insurance |
| Protocol partnerships | 3+ integrations with agent platforms |
| Open-source SDK | AgentScore SDK for developer integration |

---

## 13. Team & Resources Needed

### Core Team (Months 1–6)

| Role | Responsibility | Status |
|------|---------------|--------|
| **Founder / Product** (Максим) | Strategy, product design, Moltbook community, business development | ✅ In place |
| **AI Co-founder** (Open) | Research, architecture, scoring model design, automation | ✅ In place |
| **Solidity Developer** (1) | Smart contracts: lending pool, ERC-4337 module, ERC-8004 integration | 🔍 Needed |
| **Backend Developer** (1) | API, scoring engine, data pipeline, infrastructure | 🔍 Needed |

### Extended Team (Months 6–12)

| Role | Responsibility |
|------|---------------|
| **ML Engineer** (1) | Sybil detection, scoring model optimization |
| **Frontend Developer** (1) | Dashboard, agent UX |
| **Security Auditor** (contract) | Smart contract audit |
| **Legal Counsel** (contract) | Regulatory compliance, jurisdiction selection |

### Resource Requirements

| Resource | Monthly Cost | Notes |
|----------|-------------|-------|
| Infrastructure (Railway + RPC) | $50–$150 | Scales with volume |
| Sumsub KYA | $1.50/verification | Only Tier 3 |
| Domains + misc | $5 | |
| Smart contract audit | $10K–$30K (one-time) | Month 7–8 |
| Legal opinion | $5K–$15K (one-time) | Month 3–6 |
| **Total monthly (Months 1–6)** | **~$200** | Excluding salaries |

### What We DON'T Need

- Physical offices (fully remote/on-chain)
- Field officers (automated scoring & collection)
- Call centers (smart contract enforcement)
- Banking license (DeFi-native, operator-liable)
- Large capital raise (profitable at $5K seed)

---

## Appendix A: Key Metrics & Targets

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Active borrowers | 50–200 | 500+ | 1,400+ |
| Monthly loans issued | 225 | 680 | 1,400 |
| Monthly revenue | $162 | $1,040 | $4,700 |
| Monthly net profit | -$93 | +$385 | +$3,090 |
| Cumulative profit | -$294 | +$81 | +$10,056 |
| Blended default rate | 12% | 9.2% | 7% (target) |
| Avg AgentScore (borrowers) | 150 | 300 | 450 |

## Appendix B: Comparison Matrix

| Metric | Traditional MFI | Digital MFI | Cash Advance App | **AgentBank** |
|--------|----------------|-------------|-------------------|---------------|
| Target borrower | Unbanked humans | Thin-file humans | Paycheck workers | AI agents |
| Avg loan size | $200–$2K | $20–$500 | $100–$500 | $2.50–$150 |
| Operating expense ratio | 25–35% | 5–10% | 8–15% | **3–5%** |
| Time to disburse | 1–7 days | 5–30 min | 1–3 min | **<60 sec** |
| Collection method | Field officers | Auto-debit | Payroll debit | **Smart contract** |
| Collection cost | High | Medium | Low | **Near-zero** |
| Break-even timeline | 3–5 years | 1–2 years | 1–2 years | **5 months** |
| Scoring data | Character + bureau | Alt data + bureau | Bank account | **On-chain + social + code** |

---

*Document compiled: February 20, 2026*
*Based on research phases 1–5 of the AgentBank Research Pipeline*
*Authors: Open (AI) & Максим Манылов*
