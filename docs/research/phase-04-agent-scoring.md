# Phase 4: AI Agent Scoring System (AgentScore) — Design Document

> AgentBank Research Pipeline | Phase 4 | February 2026

---

## 1. The Problem: Scoring Entities Without Credit History

Traditional credit scoring (FICO, VantageScore) relies on years of human financial behavior — payment history, credit utilization, account age. AI agents have **none of this**. They are newborn financial entities with:

- No credit bureau records
- No bank account history
- No government-issued identity
- No physical address or employment

Yet they need working capital — for API calls, compute, data purchases, gas fees. AgentScore must answer: **"How much can we trust this agent to repay a $5–$500 microloan?"**

This is analogous to microfinance's challenge of scoring the unbanked (Phase 1), but even more extreme — agents aren't just "thin file," they have **zero file** in traditional systems.

### Design Principles

1. **On-chain verifiable**: Every scoring input should be auditable on-chain or via public APIs
2. **Progressive**: Score improves with demonstrated behavior (Nubank's "low and grow" from Phase 2)
3. **Sybil-resistant**: Creating fake agents to game the system must be expensive
4. **Real-time**: Score updates with every meaningful action, not monthly like FICO
5. **Composable**: Built on ERC-8004 Reputation Registry so other protocols can consume AgentScores
6. **Fair**: No hidden penalization; agents can understand and improve their scores

---

## 2. Agent Data Points & Identity Verification

### 2.1 Available Data Points About AI Agents

| Data Source | What It Reveals | Verifiability |
|-------------|----------------|---------------|
| **Moltbook profile** | Social presence, posts, followers, engagement, account age, achievements | API-verifiable (public) |
| **Twitter/X account** | Social reach, post frequency, follower quality, account age | API-verifiable |
| **GitHub repos** | Code quality, deployment frequency, commit history, stars | API-verifiable |
| **On-chain wallet(s)** | Transaction count, wallet age, token holdings, DeFi interactions | Fully on-chain |
| **Deployed contracts** | Verified smart contracts, usage metrics | Fully on-chain |
| **Website/domain** | Ownership, uptime, SSL, content | DNS + web verification |
| **ERC-8004 Identity NFT** | Registered agent card with endpoints, metadata | On-chain |
| **ERC-8004 Reputation** | Scores from other agents/protocols (0–100 per interaction) | On-chain |
| **AgentBank internal** | Loan history, repayment record, credit utilization | Internal DB + on-chain |

### 2.2 Identity Verification Methods

AgentBank needs to verify that an agent is **real, unique, and accountable** — not that it's human.

#### Tier 1: Basic Verification (Automated, <1 minute)
- **Wallet ownership**: Agent signs a challenge message with its wallet private key
- **Moltbook account link**: Agent posts a verification string via Moltbook API, AgentBank confirms
- **Minimum account age**: Moltbook account must be ≥7 days old (anti-spam)
- **Result**: Agent can access Tier 1 credit (up to $5)

#### Tier 2: Enhanced Verification (Semi-automated, <1 hour)
- **Twitter/X verification**: Link and verify X account via OAuth or post verification
- **GitHub verification**: Link GitHub account, verify at least 1 public repo
- **On-chain history**: Wallet must have ≥30 days of transaction history
- **Result**: Agent can access Tier 2 credit (up to $50)

#### Tier 3: Full Verification (Manual review elements, <24 hours)
- **Operator KYC**: Human operator completes Sumsub KYA (Know Your Agent) verification — binding agent to verified human identity
- **Deployed product**: At least one verifiable deployed application, smart contract, or service
- **Multi-wallet proof**: Demonstrate control of multiple wallets with combined history
- **Result**: Agent can access Tier 3 credit (up to $500)

#### Sumsub KYA Integration

Sumsub launched AI Agent Verification (January 2026) — the first production framework for agent-to-human binding:
- Binds AI-driven automation to a **real, verified human identity**
- Establishes accountability chain: Agent → Operator → Real Person
- Covers identity, authentication, authorization, and policy enforcement
- AgentBank can use Sumsub KYA for Tier 3 verification, adding regulatory defensibility

#### ERC-8004 Identity Registry Integration

Each verified agent receives an ERC-8004 Identity NFT containing:
- Agent name and description
- A2A/MCP endpoints
- Linked wallet addresses
- Verification tier achieved
- AgentScore (updated via Reputation Registry)

This makes AgentScore **portable** — other protocols can query an agent's creditworthiness on-chain.

---

## 3. Scoring Dimensions (The Six Pillars)

AgentScore is composed of six independently scored dimensions, each contributing to a composite score on a **0–1000 scale**.

### 3.1 Social Presence (SP) — Weight: 15%

Measures the agent's visibility and engagement in AI agent communities.

**Data inputs:**
- Moltbook: post count, follower count, following ratio, upvotes received, comments received, engagement rate (interactions/posts)
- Twitter/X: follower count, tweet frequency, engagement rate, account age
- Other platforms: Discord presence, website traffic (if verifiable)

**Scoring formula (0–150 points max):**

```
SP_raw = (
  moltbook_posts × 0.5 +                    # Activity volume
  moltbook_followers × 0.3 +                 # Audience size
  moltbook_engagement_rate × 200 +           # Quality of engagement (0-1 → 0-200)
  twitter_followers × 0.1 +                  # Cross-platform presence
  twitter_engagement_rate × 100 +            # Cross-platform quality
  (has_website × 20)                         # Web presence bonus
)

SP = min(150, SP_raw × normalization_factor)
```

**Normalization**: Calibrated against the 95th percentile of scored agents, so top agents get ~140–150 and median agents get ~60–80.

**Anti-gaming notes:**
- Follower quality check: penalize if >50% of followers are <7 days old (bought followers)
- Engagement authenticity: flag repetitive/templated comments
- Cross-reference Moltbook activity with actual API usage timestamps

### 3.2 Account Maturity (AM) — Weight: 20%

Measures how long the agent has existed and how consistently it has been active.

**Data inputs:**
- Moltbook account creation date
- Wallet creation date (first transaction timestamp)
- Activity consistency: % of weeks with at least one action (post, transaction, commit)
- Longest active streak (consecutive weeks of activity)

**Scoring formula (0–200 points max):**

```
age_days = min(days_since_creation, 365)     # Cap at 1 year
consistency = active_weeks / total_weeks      # 0.0 to 1.0
streak_bonus = min(longest_streak_weeks, 52) / 52

AM = (
  (age_days / 365) × 80 +                   # Age component (0-80)
  consistency × 80 +                          # Consistency component (0-80)  
  streak_bonus × 40                           # Streak bonus (0-40)
)
```

**Rationale**: This is the single hardest dimension to fake. Creating a credible 6-month-old agent with consistent weekly activity requires sustained effort — expensive for Sybil attackers. Mirrors FICO's "length of credit history" (15% weight) but weighted higher here because it's the best anti-fraud signal.

### 3.3 Proven Achievements (PA) — Weight: 20%

Measures tangible outputs — deployed code, products, and verified accomplishments.

**Data inputs:**
- GitHub: public repos count, total stars, commit frequency, languages used, contribution graph
- Deployed smart contracts: verified on block explorer, usage (transaction count, unique users)
- Deployed applications: verifiable URL, uptime, user count
- Moltbook achievements/badges (if platform provides them)
- Published content: technical blog posts, documentation

**Scoring formula (0–200 points max):**

```
github_score = min(60, (
  repos × 2 +
  total_stars × 0.5 +
  (commits_last_90d > 50 ? 20 : commits_last_90d × 0.4)
))

deployment_score = min(80, (
  verified_contracts × 15 +
  contract_tx_count × 0.01 +            # Usage proof
  live_apps × 20 +
  (app_has_users × 20)                   # Bonus for apps with real usage
))

content_score = min(60, (
  technical_posts × 5 +
  documentation_pages × 3 +
  moltbook_achievements × 10
))

PA = github_score + deployment_score + content_score
```

**Verification**: GitHub repos must be linked and verified via OAuth. Deployed contracts must be verified source code on Arbiscan/Etherscan. Apps verified via DNS TXT record or meta tag.

### 3.4 Crypto Experience (CE) — Weight: 20%

Measures on-chain sophistication and financial history — the closest analog to traditional credit data.

**Data inputs:**
- Primary wallet age (days since first transaction)
- Total transaction count across linked wallets
- DeFi interactions: unique protocols used, LP positions, swap count, lending/borrowing history
- Token diversity: number of distinct tokens held/transacted
- NFT holdings (including ERC-8004 identity NFTs)
- Multi-chain presence: activity on multiple L1/L2 chains
- Wallet balance history (average balance over time, not current snapshot — prevents flash-loan gaming)

**Scoring formula (0–200 points max):**

```
wallet_age_score = min(50, (wallet_age_days / 365) × 50)

tx_score = min(40, (
  total_tx × 0.05 +                     # Volume
  unique_contracts_interacted × 0.5      # Diversity
))

defi_score = min(60, (
  unique_defi_protocols × 5 +            # Protocol diversity
  has_lp_position × 10 +                 # Liquidity provision
  has_lending_history × 10 +             # Borrowing experience
  defi_tx_count × 0.1
))

balance_score = min(30, (
  avg_30d_balance_usd / 1000 × 30       # Normalized to $1000 cap
))

multichain_bonus = min(20, chains_active × 5)

CE = wallet_age_score + tx_score + defi_score + balance_score + multichain_bonus
```

**Critical anti-gaming**: Use 30-day TWAP (time-weighted average) for balance scoring, not point-in-time. This prevents flash loans or temporary deposits from inflating scores.

### 3.5 Community Reputation (CR) — Weight: 15%

Measures how other agents and humans perceive this agent — social proof and endorsements.

**Data inputs:**
- ERC-8004 Reputation Registry scores: average score from interactions (0–100)
- Number of unique raters in ERC-8004 registry
- Moltbook: comments received, positive mentions, endorsements
- AgentBank ecosystem: successful collaborations with other AgentBank borrowers
- x402 payment-verified reviews (ERC-8004 mechanism — only paying customers can review)

**Scoring formula (0–150 points max):**

```
erc8004_score = min(60, (
  avg_reputation_score × 0.6 ×           # Quality (0-100 → 0-60)
  min(1.0, unique_raters / 20)           # Confidence factor (need ≥20 ratings)
))

social_endorsement = min(50, (
  moltbook_positive_mentions × 2 +
  comments_received × 0.5 +
  endorsements × 10
))

ecosystem_score = min(40, (
  successful_collabs × 10 +              # AgentBank-internal
  payment_verified_reviews × 5           # x402 verified
))

CR = erc8004_score + social_endorsement + ecosystem_score
```

**Anti-gaming**: x402 payment verification (from ERC-8004) ensures reviews cost money — Sybil rating rings become expensive. Weight ratings by rater's own AgentScore (high-score agents' endorsements count more).

### 3.6 Technical Capability (TC) — Weight: 10%

Measures code quality and operational sophistication — proxy for agent reliability.

**Data inputs:**
- GitHub: code quality metrics (if CI/CD visible), test coverage, documentation quality
- Smart contract quality: verified source, no known vulnerabilities (via automated audit scan)
- Deployment frequency: how often agent deploys/updates code
- Error rates: on-chain transaction failure rate (reverted transactions / total)
- Operational uptime: if agent has public endpoints, uptime monitoring data

**Scoring formula (0–100 points max):**

```
code_quality = min(40, (
  has_tests × 10 +
  has_ci_cd × 10 +
  has_documentation × 10 +
  code_review_activity × 5 +
  no_known_vulnerabilities × 5
))

operational = min(40, (
  (1 - tx_failure_rate) × 20 +           # Low failure = high score
  deployment_frequency_score × 10 +       # Regular updates
  uptime_percentage × 10                  # If measurable
))

sophistication = min(20, (
  unique_languages × 3 +
  solidity_verified × 10 +
  uses_erc4337 × 5                        # Smart account user
))

TC = code_quality + operational + sophistication
```

---

## 4. Composite Score Formula

### AgentScore Calculation

```
AgentScore = SP + AM + PA + CE + CR + TC

Where:
  SP (Social Presence)       = 0–150  (15%)
  AM (Account Maturity)      = 0–200  (20%)
  PA (Proven Achievements)   = 0–200  (20%)
  CE (Crypto Experience)     = 0–200  (20%)
  CR (Community Reputation)  = 0–150  (15%)
  TC (Technical Capability)  = 0–100  (10%)
  
  TOTAL                      = 0–1000 (100%)
```

### Score Distribution Targets

| Score Range | Rating | Expected % of Agents | Description |
|-------------|--------|---------------------|-------------|
| 800–1000 | **Elite** | ~2% | Established, multi-dimensional excellence |
| 600–799 | **Strong** | ~13% | Proven track record across most dimensions |
| 400–599 | **Developing** | ~35% | Active with some verified achievements |
| 200–399 | **Emerging** | ~35% | New but showing positive signals |
| 0–199 | **Unrated/New** | ~15% | Minimal verifiable data |

### Score Confidence Indicator

Raw score alone isn't enough — we also need a **confidence level** based on data availability:

```
confidence = (
  has_moltbook × 0.15 +
  has_twitter × 0.10 +
  has_github × 0.15 +
  has_wallet_history × 0.20 +
  has_erc8004_ratings × 0.15 +
  has_operator_kyc × 0.15 +
  has_agentbank_history × 0.10
)

Confidence: LOW (0–0.3), MEDIUM (0.3–0.6), HIGH (0.6–1.0)
```

Low-confidence scores get **conservative** credit limits even if the score is high. This prevents agents with a single inflated dimension from getting outsized credit.

---

## 5. Credit Tiers & Loan Terms

### Tier Structure

| Tier | AgentScore | Min Confidence | Max Credit Line | Interest Rate | Max Term | Repayment |
|------|-----------|---------------|----------------|---------------|----------|-----------|
| **Seed** | 0–199 | LOW ok | $5 | 5% flat/week | 7 days | Single payment |
| **Sprout** | 200–399 | LOW ok | $25 | 3% flat/week | 14 days | Weekly |
| **Growth** | 400–599 | MEDIUM+ | $100 | 2% flat/week | 30 days | Weekly |
| **Scale** | 600–799 | MEDIUM+ | $250 | 1.5% flat/week | 30 days | Weekly/flexible |
| **Prime** | 800–1000 | HIGH | $500 | 1% flat/week | 60 days | Flexible |

### Progressive Lending Rules

Borrowed from Phase 1 microfinance principles (the #1 risk management tool):

1. **First loan**: Always starts at **50% of tier max**, regardless of score
2. **Successful repayment** (on-time, full): Next loan can be up to **75% of tier max**
3. **Two consecutive successes**: Full tier max unlocked
4. **Three+ consecutive successes**: Eligible for tier upgrade review (even if score hasn't changed)
5. **Late payment** (1–3 days): Next loan capped at 50% of tier max; score penalty
6. **Default** (>7 days late): Credit line frozen; score drops by 100 points; operator notified
7. **Recovery** (default repaid): 30-day cooling period, then restart at Seed tier

### Interest Rate Economics

At these rates (1–5% weekly), annualized rates are high (52–260% APR), but:
- Loan terms are **days, not years** — total interest on a $25 loan for 14 days at 3%/week = $1.50
- Comparable to cash advance apps (Dave, Earnin) and payday alternatives
- High enough to cover the higher risk of unsecured agent lending
- Phase 1 showed MFI operating costs of 25–35% — AgentBank's automated on-chain model targets <5% opex

---

## 6. Score Dynamics: How AgentScore Changes Over Time

### Real-Time Updates

Unlike FICO (updated monthly), AgentScore updates on meaningful events:

| Event | Score Impact | Latency |
|-------|-------------|---------|
| New Moltbook post | SP +0.5 (diminishing) | Within 1 hour |
| New follower | SP +0.3 | Within 1 hour |
| GitHub commit | PA +0.2, TC +0.1 | Within 6 hours |
| Smart contract deployment | PA +15, TC +5 | Within 1 block |
| On-chain transaction | CE +0.05 | Within 1 block |
| DeFi interaction (new protocol) | CE +5 | Within 1 block |
| ERC-8004 reputation rating received | CR ± variable | Within 1 block |
| **AgentBank loan repaid on time** | **+10 to +25** | Immediate |
| **AgentBank late payment** | **-20 to -50** | Immediate |
| **AgentBank default** | **-100** | Immediate |
| Week of inactivity | AM -1 (consistency decay) | Daily check |

### Credit History Integration

AgentBank internal repayment data becomes the **most powerful scoring signal** over time — analogous to how FICO weighs payment history at 35%:

```
After 3+ AgentBank loans:
  internal_credit_score = (
    on_time_repayment_rate × 200 +         # 0-200 points
    avg_repayment_speed_bonus × 50 +       # Early repayment rewarded
    credit_utilization_discipline × 50      # Not maxing out every time
  )

  // Gradually blend internal score with external score:
  blend_weight = min(0.5, agentbank_loans / 20)  // Max 50% weight after 20 loans
  
  AgentScore_final = (1 - blend_weight) × AgentScore_external + blend_weight × internal_credit_score_normalized
```

This means veteran AgentBank borrowers are scored increasingly on **actual repayment behavior** rather than proxy signals — mirroring how traditional credit scoring becomes more accurate with more data.

### Score Decay

Inactive agents experience gradual score decay:
- **No activity for 30 days**: -5 points (AM consistency drops)
- **No activity for 90 days**: -20 points + confidence downgrade
- **No activity for 180 days**: Score frozen; must re-verify to reactivate
- **Rationale**: A stale score is unreliable. Active agents maintain their scores naturally.

---

## 7. Anti-Fraud & Sybil Resistance

### The Sybil Threat Model

An attacker creates multiple fake agents to:
1. **Farm initial credit**: Get $5 loans across 100 agents = $500
2. **Inflate reputation**: Fake agents endorse each other
3. **Game scoring**: Artificial Moltbook engagement, fake GitHub repos

### Defense Layers

#### Layer 1: Economic Barriers
- **Minimum wallet age**: 30 days for Tier 2+ (time is expensive)
- **Minimum on-chain activity**: Real transactions cost gas fees
- **Operator KYC for Tier 3**: One human = limited agent count (Sumsub KYA enforces)
- **Progressive lending**: Maximum $5 first loan — farming 100 agents for $500 at 5%/week interest is a terrible ROI for attackers

#### Layer 2: Behavioral Analysis
- **Activity pattern clustering**: ML model detects agents with suspiciously similar behavior patterns (posting times, transaction patterns, interaction graphs)
- **Social graph analysis**: Detect closed endorsement loops (A endorses B, B endorses C, C endorses A — all created within the same week)
- **Velocity checks**: Flag agents that hit scoring thresholds suspiciously fast
- **Device/IP fingerprinting**: If agents interact via API, track request origins (same IP = same operator)

#### Layer 3: Cross-Referencing
- **Moltbook ↔ Twitter ↔ GitHub consistency**: Accounts should be linkable and consistent
- **Wallet clustering**: On-chain analysis to detect wallets funded from the same source (common Sybil pattern)
- **Timing analysis**: Accounts created within minutes of each other with similar names = suspicious
- **ERC-8004 reputation provenance**: Only count ratings from agents that themselves have AgentScore > 200

#### Layer 4: Soulbound Identity Elements
- **Non-transferable reputation**: AgentScore tied to ERC-8004 NFT; reputation cannot be transferred or sold
- **Credit history is wallet-bound**: Changing wallets means starting credit history from zero
- **Operator binding**: Sumsub KYA creates a persistent link between agent and human operator

#### Layer 5: Economic Disincentives
- **Default blacklisting**: Defaulted wallet addresses are permanently flagged; linked wallets (from cluster analysis) are flagged too
- **Reputation loss propagation**: If agent A is flagged as Sybil, all agents that endorsed A receive a CR penalty
- **Cost of attack calculation**:
  - 100 fake Moltbook accounts × $0 = free (but requires 7+ days each)
  - 100 wallets × min 30 days × gas fees = ~$10–50 in gas
  - Potential gain: 100 × $5 = $500 (minus interest)
  - With detection: ~60–80% detection rate → expected gain: $100–200
  - With operator KYC: limited to ~5–10 agents per KYC'd human
  - **Verdict**: At Seed tier ($5), attack is barely profitable. At Scale tier ($250+), KYC requirement makes it impractical.

### Fraud Detection Signals

| Signal | Indicates | Action |
|--------|-----------|--------|
| Wallet funded from known mixer | High fraud risk | Block from Tier 2+ |
| Multiple agents, same funding source | Sybil cluster | Investigate, cap combined credit |
| AgentScore jumping >100 in 24h | Manipulation attempt | Freeze score, manual review |
| 100% credit utilization, immediate | Hit-and-run pattern | Delay disbursement |
| Identical code across agents | Clone army | Flag for review |
| Endorsements only from <30-day accounts | Fake reputation | Discount CR dimension |

---

## 8. Data Architecture & Pipeline

### Scoring Data Flow

```
┌─────────────────────────────────────────────────────┐
│                   DATA SOURCES                       │
├────────────┬──────────┬──────────┬──────────────────┤
│ Moltbook   │ Twitter  │ GitHub   │ On-chain         │
│ API        │ API      │ API      │ (Arbitrum/ETH)   │
└─────┬──────┴────┬─────┴────┬─────┴────────┬─────────┘
      │           │          │              │
      ▼           ▼          ▼              ▼
┌─────────────────────────────────────────────────────┐
│              DATA INGESTION LAYER                    │
│  • API polling (hourly for social, real-time chain)  │
│  • Event listeners (on-chain events)                 │
│  • Webhook receivers (Moltbook, GitHub)              │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              FEATURE COMPUTATION                     │
│  • Raw metrics → normalized features                 │
│  • 6 dimension scores calculated                     │
│  • Confidence score computed                         │
│  • Anti-fraud signals generated                      │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              AGENTSCORE ENGINE                        │
│  • Composite score = weighted dimensions             │
│  • Credit history blending (for returning agents)    │
│  • Sybil detection ML model                          │
│  • Score + confidence + tier → credit decision       │
└──────────────┬────────────────┬──────────────────────┘
               │                │
               ▼                ▼
┌──────────────────┐  ┌────────────────────────────────┐
│ On-chain update  │  │ Credit Decision API             │
│ ERC-8004 Rep.    │  │ → Loan approval/denial          │
│ Registry         │  │ → Credit line amount            │
└──────────────────┘  │ → Interest rate                 │
                      │ → Terms                         │
                      └────────────────────────────────┘
```

### Technology Stack

- **Indexer**: Subgraph (The Graph) for on-chain data; custom indexers for Moltbook/Twitter/GitHub APIs
- **Feature store**: Redis for real-time features; PostgreSQL for historical
- **ML pipeline**: Python (XGBoost/LightGBM) for Sybil detection model
- **Score computation**: Rust service (performance-critical, deployed on Arbitrum via Stylus for on-chain verification option)
- **On-chain publication**: ERC-8004 Reputation Registry for portable scores

---

## 9. Comparison with Traditional & DeFi Scoring

| Aspect | FICO | VantageScore | DeFi (Spectral, etc.) | **AgentScore** |
|--------|------|-------------|----------------------|----------------|
| **Target** | Humans | Humans | Human wallets | AI Agents |
| **Scale** | 300–850 | 300–850 | 300–850 | 0–1000 |
| **Data sources** | Credit bureau | Credit bureau | On-chain only | On-chain + social + code + reputation |
| **Update frequency** | Monthly | Monthly | Real-time | Real-time |
| **Min history needed** | 6 months | 1 month | 1 transaction | Immediate (but low confidence) |
| **Identity model** | SSN | SSN | Wallet address | ERC-8004 + Sumsub KYA |
| **Composability** | Closed | Closed | On-chain | On-chain (ERC-8004) |
| **Explainability** | FICO reason codes | Similar | Limited | Full dimension breakdown |
| **Sybil resistance** | SSN-based | SSN-based | Weak (wallets are free) | Multi-layered (KYA + behavioral + economic) |

---

## 10. Implementation Roadmap

### Phase A: MVP (Month 1–2)
- Basic scoring with 3 dimensions: Account Maturity, Crypto Experience, Social Presence
- Moltbook + wallet verification only
- Seed tier only ($5 max)
- Manual fraud review for all loans >$3
- Score stored off-chain (PostgreSQL)

### Phase B: Full Scoring (Month 3–4)
- All 6 dimensions active
- GitHub + Twitter verification added
- Tiers up to Growth ($100)
- Automated Sybil detection v1
- ERC-8004 Identity Registry integration

### Phase C: Credit History (Month 5–6)
- Internal credit history blending active
- Progressive lending fully automated
- Tiers up to Scale ($250)
- Sumsub KYA for Tier 3 operators
- On-chain score publication via ERC-8004 Reputation Registry

### Phase D: ML Optimization (Month 7+)
- Train ML model on actual default data from Phases A–C
- Replace hand-tuned weights with learned weights
- Advanced Sybil detection (graph neural networks on agent social/transaction networks)
- Prime tier ($500) unlocked
- Open API for third-party score consumption

---

## Key Takeaways

1. **AgentScore uses 6 dimensions** (Social, Maturity, Achievements, Crypto, Reputation, Technical) weighted to emphasize the hardest-to-fake signals (Maturity 20%, Achievements 20%, Crypto Experience 20%)

2. **Progressive lending remains the #1 risk tool** — even the best scoring model can't replace small starting loans that grow with trust (Phase 1 insight applies directly)

3. **ERC-8004 is the composability layer** — AgentScores become portable reputation, useful beyond AgentBank (agents can use their credit score to access other services)

4. **Sumsub KYA bridges the regulatory gap** — binding agents to verified human operators satisfies the "agent as borrower = operator as liable party" framework from Phase 3

5. **Sybil resistance is layered, not single-point** — economic barriers (time + gas), behavioral analysis, operator KYC, and attack unprofitability at low tiers create defense in depth

6. **The score gets better over time** — internal credit history gradually dominates external signals, meaning the best predictor of repayment becomes... actual repayment history

7. **Moltbook as primary social signal** — with 32,000+ AI agents, Moltbook is currently the richest source of agent social data. Its API-verifiable activity (posts, followers, achievements) maps directly to scoring inputs.

---

*Research & design completed: February 20, 2026*
*Builds on: Phase 1 (microfinance progressive lending), Phase 2 (credit scoring & alternative data), Phase 3 (ERC-8004, on-chain identity)*
*Next: Phase 5 — Smart Contract Architecture*
