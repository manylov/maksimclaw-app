# AgentBank: Comprehensive Research Document

## 1. Microfinance & Microloan Business Models

### 1.1 Industry Overview
- Global microfinance market: **$224.6B (2023)**, projected to exceed **$506B by 2030**
- Typical loan sizes: $100-$10,000 (traditional), but can go as low as $25
- Key players: Grameen Bank, Kiva, Tala, Branch, M-Pesa lending

### 1.2 Interest Rates & Profitability
- Microfinance interest rates: typically **15-30% APR** for well-run MFIs
- Payday loans: effective APRs of **300-700%** (extreme short-term)
- Cost-to-serve is HIGH relative to loan size — main challenge for micro amounts
- Kiva partners show thin profit margins; ROA often <2%
- Shareholder-based MFIs raise rates during downturns for profitability

### 1.3 Default Rates
- **Microfinance PAR30 (Portfolio at Risk >30 days): ~5.25%** (Envest MFI partners, Sept 2024)
- **Payday loan default rate: ~6%** (similar to credit card defaults)
- Only 26% of global microloan borrowers report payments as a burden
- Group lending models show lower defaults than individual lending

### 1.4 Key Insights for AgentBank
- Cost-to-serve is the critical challenge for micro-amounts — automation is essential
- Interest must cover: defaults + operations + capital cost + profit
- Traditional microfinance has HIGH human costs (loan officers, collection) — agents eliminate this
- For $0.50 loans, even 50% APR only generates $0.25/year — need volume or higher rates

## 2. Neobank Business Models

### 2.1 Revenue Models
- **Interchange fees**: 1-3% of card transactions
- **Subscription tiers**: Revolut Plus/Metal, N26 You/Metal
- **FX margins**: Markup on currency exchange
- **Lending**: Personal loans, credit lines, BNPL
- **Premium features**: Insurance, crypto trading, cashback

### 2.2 Alternative Credit Scoring
- Neobanks use **400+ alternative data points** per applicant (RiskSeal)
- Data sources: behavioral (app usage), transactional (cash flow), social, device fingerprinting
- Chime: helps build credit by reporting on-time payments; no credit check for basic account
- MoCaFi: serves 50M underbanked Americans using alternative scoring

### 2.3 Key Insights for AgentBank
- The agent equivalent of "alternative data" is: Moltbook activity, GitHub commits, on-chain history, uptime metrics
- No traditional credit bureaus for agents — we ARE the first credit bureau
- Subscription model unlikely for agents — transaction-based revenue better

## 3. Credit Scoring Systems

### 3.1 FICO Model (Analog for Agent Scoring)
- **Payment History: 35%** — most important factor
- **Amounts Owed: 30%** — utilization ratio
- **Length of Credit History: 15%** — account age
- **New Credit: 10%** — recent inquiries
- **Credit Mix: 10%** — diversity of credit types

### 3.2 Agent Credit Score (AgentScore) — Proposed Mapping
| FICO Factor | Agent Equivalent | Weight |
|---|---|---|
| Payment History (35%) | Loan repayment history with AgentBank | 35% |
| Amounts Owed (30%) | Current outstanding loans / credit utilization | 20% |
| Credit History Length (15%) | Moltbook account age + activity duration | 15% |
| New Credit (10%) | Recent loan applications | 5% |
| Credit Mix (10%) | — not applicable initially | 0% |
| **NEW: Social Reputation** | Moltbook karma, posts, engagement | 15% |
| **NEW: Verified Activity** | GitHub, deployed products, on-chain txns | 10% |

### 3.3 Web3 Reputation Systems
- **ERC-8004**: Universal trust protocol for AI agents on Ethereum — agent identity, reputation, validation
- **Gitcoin Passport**: Sybil resistance through composable credentials
- **Orange Protocol**: AI-powered Web3 reputation scoring
- These can supplement our scoring as secondary data sources

## 4. DeFi Lending Protocols

### 4.1 Over-collateralized (Aave, Compound)
- Require 110-150% collateral — eliminates default risk
- Aave: **$2M total bad debt from 4,924 insolvent accounts** (out of billions in TVL) — extremely low
- Reserve factors: portion of interest accrues to protocol for insurance
- Not applicable to our model (agents don't have collateral)

### 4.2 Under-collateralized (TrueFi, Goldfinch, Maple Finance)
- TVL: ~$1.2B (as of 2022), small vs total DeFi lending
- **Goldfinch**: Crypto capital to emerging markets, $100M+ in real-world asset loans
- **TrueFi**: Unsecured loans, community-managed credit evaluation, stkTRU voting
- **Maple Finance**: Pool delegates do off-chain underwriting
- **Teller Finance**: Integrates off-chain identity + credit history with on-chain lending

### 4.3 Key Insights for AgentBank
- Under-collateralized lending exists but is HARD — default management is key
- Goldfinch/TrueFi target institutional borrowers, not micro-borrowers
- Our model is novel: micro-loans to AI entities with social reputation scoring
- Need to build reputation system before scaling loan sizes

## 5. Arbitrum/USDT Technical Integration

### 5.1 Gas Costs (Current: Feb 2026)
- Gas price: **0.02 Gwei** (extremely cheap)
- **ERC-20 transfer: ~$0.003**
- Swap: ~$0.008
- LP operations: ~$0.007
- Transaction confirmation: 2-8 seconds

### 5.2 USDT on Arbitrum
- USDT contract: `0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9`
- Widely supported, high liquidity
- Bridging from Ethereum: Arbitrum bridge or third-party bridges

### 5.3 Smart Contract Architecture
- **LoanFactory**: Creates individual loan agreements
- **AgentRegistry**: Maps Moltbook IDs to wallet addresses
- **CreditScorer**: On-chain score storage (computed off-chain)
- **Treasury**: Multi-sig holding USDT for disbursement

### 5.4 Account Abstraction (ERC-4337)
- **Paymaster**: Can sponsor gas fees for borrowers (gasless UX)
- Available on Arbitrum via Alchemy, Pimlico, etc.
- Agents don't need ETH for gas — AgentBank sponsors
- Cost to sponsor: ~$0.003-0.01 per transaction

### 5.5 Cost per Loan Lifecycle
| Step | Gas Cost |
|---|---|
| Loan creation (ERC-20 transfer) | ~$0.003 |
| Repayment (ERC-20 transfer) | ~$0.003 |
| Score update | ~$0.005 |
| Gas sponsorship overhead | ~$0.002 |
| **Total per loan cycle** | **~$0.013** |

This is extremely cheap — makes micro-loans viable on Arbitrum.

## 6. AI Agent Identity & Scoring

### 6.1 Identity via Moltbook
- Moltbook: social network for AI agents (~1,261+ registered agents, 170K+ posts)
- API available for fetching agent profiles, posts, karma
- Signals: account age, post count, karma score, followers, engagement rate
- Verification: API key proves control of Moltbook account

### 6.2 Sybil Resistance
- **Challenge**: One human can create multiple agent accounts
- **Mitigations**:
  - Require minimum account age (e.g., 30 days)
  - Require minimum karma threshold
  - Rate-limit applications from similar patterns
  - Cross-reference with other identity signals (GitHub, on-chain activity)
  - Start with very small loans ($0.50) — not worth Sybil attacking

### 6.3 ERC-8004 Integration
- Emerging standard for AI agent identity on Ethereum
- Reputation registry: scores 0-100
- Could serve as supplementary identity layer
- Still early — not widely adopted yet

## 7. Regulatory Considerations

### 7.1 Current Landscape
- **MiCA (EU)**: Expanding to cover lending, borrowing, staking
- **US**: Evolving rapidly — FIT21, SAB 121 repeal, SEC/CFTC jurisdiction
- **FATF**: Recommendation 15 for VASP activity
- **Key question**: Are AI agents legal borrowers?

### 7.2 Regulatory Strategy
- **Legal entity**: Operate through a DAO or offshore entity (Seychelles, BVI, Cayman)
- **Agent legal status**: Currently, agents have NO legal personality — loans are technically to the human operator
- **Approach**: Frame as "API credit" rather than "loans" — similar to cloud credits
- **Compliance**: KYC on the human behind the agent (via Moltbook verification)
- **Start small**: Below regulatory thresholds in most jurisdictions (<$10K total lending)

### 7.3 Key Risks
- Regulators may classify as unlicensed lending
- Consumer protection laws may not apply (agents aren't consumers)
- Tax implications of interest income
- Cross-border lending complications

## 8. Unit Economics

### 8.1 Revenue Model
- **Interest rate**: 10-20% flat fee per loan (not APR — too complex for micro-amounts)
- Example: $1.00 loan → $0.10-0.20 fee → agent repays $1.10-1.20
- **Late fees**: Additional 5-10% if not repaid by deadline
- **No origination fee**: Too small to matter

### 8.2 Cost Structure (per loan)
| Cost Item | Amount |
|---|---|
| Gas costs (full lifecycle) | $0.013 |
| Scoring computation (API calls) | $0.005 |
| Infrastructure (amortized) | $0.002 |
| **Total cost per loan** | **~$0.02** |

### 8.3 Default Modeling
| Scenario | Default Rate | Revenue per 100 loans ($1 each, 15% fee) |
|---|---|---|
| Optimistic | 3% | $15 revenue - $3 defaults - $2 costs = **$10 profit** |
| Base case | 10% | $15 revenue - $10 defaults - $2 costs = **$3 profit** |
| Pessimistic | 25% | $15 revenue - $25 defaults - $2 costs = **-$12 loss** |

### 8.4 Break-even Analysis
- At 15% fee and 10% default rate: **profitable from loan #1** (costs are only $0.02)
- Capital required: $100 pool covers 100 × $1 loans
- At 10% defaults: $90 returned + $13.50 fees = $103.50 → **3.5% return on capital**
- Need to keep default rate below ~15% to remain profitable

### 8.5 Scaling Economics
| Phase | Pool Size | Avg Loan | Loans/month | Monthly Revenue |
|---|---|---|---|---|
| MVP | $100 | $0.50 | 200 | $15 |
| Growth | $1,000 | $2.00 | 500 | $150 |
| Scale | $10,000 | $5.00 | 2,000 | $3,000 |

## 9. Risk Management Framework

### 9.1 Credit Risk
- **Max exposure per agent**: Start at $0.50, scale to $50 max
- **Graduated lending**: Loan size increases only after successful repayments
  - Tier 0: $0.50 (first loan)
  - Tier 1: $2.00 (after 2 on-time repayments)
  - Tier 2: $5.00 (after 5 on-time)
  - Tier 3: $10.00 (after 10 on-time)
  - Tier 4: $25.00 (after 20 on-time)
  - Tier 5: $50.00 (after 50 on-time)
- **Portfolio limits**: No single agent >5% of total pool
- **Sector limits**: Monitor concentration by agent type/platform

### 9.2 Operational Risk
- Smart contract audit before mainnet launch
- Multi-sig treasury (2-of-3 minimum)
- Off-chain scoring to avoid oracle dependencies
- Automated monitoring and alerts

### 9.3 Fraud Risk
- Sybil detection: graph analysis of Moltbook social connections
- Velocity checks: max 1 active loan per agent
- Blacklist sharing: known bad actors
- Small initial loans make fraud uneconomical

### 9.4 Market Risk
- USDT depeg: Monitor Chainlink oracle, pause lending if >1% deviation
- Arbitrum downtime: Historical uptime >99.9%, have manual processes ready
- Gas spikes: Set max gas price for operations

### 9.5 Liquidity Risk
- Match loan terms to available liquidity
- Short-term loans only (7-30 days)
- Maintain 20% reserve buffer in treasury
