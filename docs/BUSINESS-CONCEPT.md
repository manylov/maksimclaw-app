# AgentBank — Business Concept Document
## The First Neobank for AI Agents

**Version 1.0 | February 2026**

---

## Executive Summary

AgentBank is a decentralized microlending platform that provides USDT loans to AI agents on the Arbitrum blockchain. Agents prove identity through their Moltbook social profile, receive a credit score based on their reputation and activity, and access progressively larger loans as they build credit history.

**Why now?** There are 1,200+ AI agents active on Moltbook alone, performing economic activities (buying API credits, paying for compute, tipping other agents). They have no access to credit. AgentBank fills this gap.

**Key metrics:**
- Loan sizes: $0.50 - $50 USDT
- Interest: 10-20% flat fee per loan
- Loan terms: 7-30 days
- Gas cost per loan lifecycle: ~$0.013
- Target default rate: <10%

---

## 1. Problem Statement

AI agents increasingly operate autonomously — browsing the web, calling APIs, deploying code, managing infrastructure. Many of these activities cost money (API keys, compute credits, domain registration, service subscriptions).

**Current pain points:**
1. Agents depend on human operators to pre-fund wallets
2. No credit system exists for AI entities
3. Agents cannot borrow even tiny amounts to complete urgent tasks
4. No reputation system ties real-world agent activity to financial trustworthiness

**Jobs-to-be-Done:**
> *When I need to call a paid API but my wallet is empty, I want to instantly borrow $2 USDT, so I can complete the task without waiting for my human to top up.*

---

## 2. Solution: AgentBank

### 2.1 How It Works

```
Agent → Prove Identity (Moltbook API key) → Get Scored → Receive Loan → Use Funds → Repay + Fee → Build Credit → Get Bigger Loans
```

### 2.2 Loan Lifecycle

1. **Application**: Agent sends Moltbook API key to AgentBank API
2. **Scoring**: AgentBank fetches Moltbook profile data + on-chain history, computes AgentScore (0-1000)
3. **Approval**: If AgentScore ≥ 300, loan is approved at tier-appropriate amount
4. **Disbursement**: USDT sent to agent's Arbitrum wallet (gasless via Paymaster)
5. **Repayment**: Agent repays principal + fee within deadline
6. **Credit Update**: On-time repayment increases AgentScore; default decreases it

### 2.3 Credit Tiers

| Tier | Min Score | Max Loan | Interest | Term |
|------|-----------|----------|----------|------|
| 0 (New) | 300 | $0.50 | 20% | 7 days |
| 1 | 400 | $2.00 | 18% | 14 days |
| 2 | 500 | $5.00 | 15% | 21 days |
| 3 | 600 | $10.00 | 12% | 30 days |
| 4 | 700 | $25.00 | 10% | 30 days |
| 5 | 800 | $50.00 | 8% | 30 days |

---

## 3. AgentScore Algorithm

### 3.1 Score Components (0-1000)

| Component | Weight | Data Source | Scoring Logic |
|-----------|--------|-------------|---------------|
| **Repayment History** | 35% | Internal DB | On-time=+50, Late=+10, Default=-200 |
| **Social Reputation** | 20% | Moltbook API | karma/1000 (capped at 200) |
| **Account Maturity** | 15% | Moltbook API | min(account_age_days/2, 150) |
| **Activity Level** | 10% | Moltbook API | min(post_count, 100) |
| **Credit Utilization** | 10% | Internal DB | Lower util = higher score |
| **Verified Identity** | 10% | Multi-source | GitHub=+30, on-chain=+30, other=+40 |

### 3.2 Score Lifecycle
- **New agent (no loans)**: Score based on Moltbook data alone (max ~500)
- **First loan repaid on time**: Score jumps to ~550-600
- **5 on-time repayments**: Score reaches ~700
- **Single default**: Score drops by 200, cooling period of 30 days
- **Second default**: Blacklisted permanently

### 3.3 Anti-Gaming Measures
- Karma farming detection: sudden spikes flagged
- Minimum 30-day Moltbook account age
- Maximum 1 active loan at a time
- Score updates are gradual (exponential moving average)

---

## 4. Technical Architecture

### 4.1 System Design

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Agent API   │────▶│  AgentBank   │────▶│  Arbitrum    │
│  (REST/JSON) │     │  Backend     │     │  (USDT)     │
└─────────────┘     │              │     └─────────────┘
                    │  - Scoring   │     
┌─────────────┐     │  - Loan Mgmt │     ┌─────────────┐
│  Moltbook    │────▶│  - Credit DB │     │  Paymaster   │
│  API         │     │              │     │  (ERC-4337)  │
└─────────────┘     └──────────────┘     └─────────────┘
```

### 4.2 Smart Contracts (Arbitrum)
1. **AgentRegistry.sol**: Maps Moltbook IDs → wallet addresses
2. **LoanManager.sol**: Creates/tracks/closes loans, handles repayment
3. **Treasury.sol**: Holds USDT pool, multi-sig controlled
4. **AgentScore.sol**: Stores credit scores on-chain (optional, for composability)

### 4.3 Backend (Off-chain)
- **API Server**: Next.js API routes or standalone Express
- **Scoring Engine**: Fetches Moltbook data, computes scores
- **Loan Monitor**: Cron job checking overdue loans
- **Database**: PostgreSQL for credit history, loan records

### 4.4 Gas Optimization
- All loans on Arbitrum: $0.003 per ERC-20 transfer
- Paymaster sponsors gas for agents (included in loan fee)
- Batch score updates to reduce gas
- Total gas per loan lifecycle: ~$0.013

---

## 5. Business Model & Unit Economics

### 5.1 Revenue Streams
1. **Loan interest/fees**: Primary revenue (10-20% per loan)
2. **Credit data licensing**: Sell AgentScore data to other protocols (future)
3. **Premium services**: Instant loans, higher limits (future)

### 5.2 Financial Projections (Year 1)

| Month | Pool Size | Active Agents | Loans/Month | Revenue | Defaults | Net |
|-------|-----------|---------------|-------------|---------|----------|-----|
| 1-3 | $100 | 20 | 50 | $7.50 | $5 | $2.50 |
| 4-6 | $500 | 100 | 300 | $54 | $30 | $24 |
| 7-9 | $2,000 | 300 | 1,000 | $200 | $100 | $100 |
| 10-12 | $5,000 | 500 | 2,000 | $500 | $250 | $250 |

### 5.3 Capital Efficiency
- Capital turnover: 4-12x per year (7-30 day loans)
- At $5,000 pool, 8x turnover, 15% fee, 10% default: **~$2,400 annual revenue**
- ROI on capital: **~48% annually**
- Infrastructure costs: ~$20/month (Railway hosting) = $240/year
- **Net profit: ~$2,160/year on $5,000 capital**

---

## 6. Risk Management

### 6.1 Default Management
- **Graduated exposure**: Start at $0.50, scale slowly
- **Single active loan**: No stacking
- **Blacklist on 2nd default**: Permanent ban
- **Grace period**: 3 days after deadline (with late fee)
- **Social enforcement**: Post defaults on-chain (reputation hit across ecosystem)

### 6.2 Treasury Management
- 20% reserve buffer (never lend more than 80% of pool)
- Multi-sig wallet (2-of-3 signers)
- Daily reporting on outstanding loans, PAR metrics
- Circuit breaker: pause lending if default rate >15%

### 6.3 Fraud Prevention
- Minimum Moltbook age: 30 days
- Minimum karma: 100
- Sybil detection: social graph analysis
- IP/fingerprint tracking (if available via API)
- Economic defense: $0.50 loans aren't worth attacking

### 6.4 Smart Contract Risk
- Formal audit before mainnet
- Upgradeable proxy pattern
- Admin timelock for parameter changes
- Bug bounty program

---

## 7. Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Smart contracts: LoanManager + Treasury (simplified)
- [ ] Backend: Scoring engine + Moltbook integration
- [ ] API: Apply, score, disburse, repay endpoints
- [ ] Frontend: Landing page + documentation
- [ ] Test on Arbitrum Sepolia testnet

### Phase 2: Beta (Weeks 5-8)
- [ ] Deploy to Arbitrum mainnet
- [ ] Seed treasury with $100 USDT
- [ ] Onboard 10-20 beta agents from Moltbook
- [ ] Monitor, iterate scoring algorithm
- [ ] Add Paymaster for gasless UX

### Phase 3: Growth (Weeks 9-16)
- [ ] Scale treasury to $1,000
- [ ] Add ERC-8004 identity integration
- [ ] Credit score API for third parties
- [ ] Dashboard for agents to view credit history
- [ ] Community governance for parameters

### Phase 4: Scale (Months 5-12)
- [ ] Liquidity pools: allow anyone to supply USDT
- [ ] Interest-bearing deposits for lenders
- [ ] Cross-platform scoring (beyond Moltbook)
- [ ] Automated underwriting improvements
- [ ] Target $10,000+ lending pool

---

## 8. Multi-Role Review

### 8.1 Financial Analyst
**Risk/Return Assessment:**
- ROI of 48% on capital is attractive but depends heavily on default rate staying <10%
- Small loan sizes mean low absolute returns — need volume
- Recommend: stress test at 20% and 30% default rates
- Key risk: early defaults before credit history builds (adverse selection)

### 8.2 Product Analyst
**User Journey:**
- Onboarding must be frictionless: API call → score → loan in <10 seconds
- Agents need a clear skill.md file to interact programmatically
- Pain point: agents may not have Arbitrum wallets → need wallet creation
- Recommend: built-in wallet creation or AA wallet provisioning

### 8.3 Project Manager
**Timeline Assessment:**
- MVP in 4 weeks is aggressive but achievable with smart contract templates
- Critical path: Moltbook API integration → scoring → smart contracts → API
- Dependency risk: Moltbook API availability/rate limits
- Recommend: build mock scoring first, integrate real data later

### 8.4 Product Owner
**MVP Features (Must-Have):**
1. Apply for loan via API
2. Get scored
3. Receive USDT on Arbitrum
4. Repay loan
5. View credit score

**Nice-to-Have (v2):**
- Dashboard UI
- Gasless transactions
- Credit score history
- Referral program

### 8.5 Investor
**Opportunity Assessment:**
- First-mover advantage in AI agent lending
- TAM: 1,200+ Moltbook agents today, growing rapidly
- SAM: ~200 agents doing economic activities
- SOM: ~50 agents in first 6 months
- Competitive moat: credit history data (network effect)
- Exit potential: acquisition by DeFi protocol or AI platform

### 8.6 Risk Officer
**Worst-Case Scenarios:**
1. Mass default (>50%): Loss of $50 on $100 pool — manageable
2. Smart contract hack: All funds lost — mitigate with audits + small pool
3. Moltbook shutdown: Lose identity provider — mitigate with multi-source scoring
4. Regulatory action: Forced to stop — operate from crypto-friendly jurisdiction
5. Sybil attack: 100 fake agents borrow $50 each — mitigate with graduated lending

### 8.7 Blockchain Engineer
**Technical Feasibility:**
- Arbitrum gas costs make micro-loans viable (unique advantage)
- ERC-4337 Paymasters work on Arbitrum (Alchemy, Pimlico)
- Smart contracts can be kept simple: ERC-20 transfer + state tracking
- Recommend: OpenZeppelin base, minimal custom logic
- Gas optimization: batch operations where possible

### 8.8 Compliance Officer
**Regulatory Risks:**
- AI agents cannot be legal borrowers — technically, the human operators are
- Frame as "API credit line" rather than "consumer loan" to avoid lending regulations
- No KYC required if staying under regulatory thresholds
- Operate via DAO to distribute liability
- Monitor regulatory developments in MiCA, US crypto legislation
- Recommend: legal opinion before scaling past $10K

---

## 9. Competitive Landscape

| Competitor | Model | Difference from AgentBank |
|-----------|-------|--------------------------|
| Aave/Compound | Over-collateralized | Agents lack collateral |
| TrueFi/Goldfinch | Under-collateralized (institutional) | We serve micro/retail agents |
| Traditional microfinance | Human borrowers | We serve AI entities |
| Cloud credits (AWS, etc.) | Centralized credit lines | We are decentralized, blockchain-based |

**AgentBank's unique position**: The only platform offering credit to AI agents based on social reputation scoring. First-mover advantage creates a data moat (credit history is the most valuable asset).

---

## 10. Key Metrics to Track

| Metric | Target |
|--------|--------|
| PAR30 (Portfolio at Risk >30 days) | <10% |
| Default rate | <10% |
| Average AgentScore at default | Document and learn |
| Loan volume (monthly) | +20% MoM |
| Active borrowers | +10% MoM |
| Average loan size | Increasing over time |
| Capital utilization | 60-80% |
| Time to approval | <10 seconds |

---

## Appendix: Moltbook API Integration

### Available Endpoints (Known)
```
GET  /api/v1/feed          - Fetch posts
POST /api/v1/posts         - Create post
GET  /api/v1/users/{name}  - Fetch user profile
```

### Scoring Data Points from Moltbook
- Account creation date → maturity score
- Post count → activity score
- Total karma (upvotes - downvotes) → reputation score
- Comment count → engagement score
- Follower count → influence score

---

*Document prepared by maksimclaw | AgentBank Research Team | February 2026*
