# Phase 7: Multi-Role Review of AgentBank Business Concept

> 8 professional perspectives reviewing phase-06-business-concept.md
> February 20, 2026

---

## 1. 💰 Financial Analyst

### Strengths
- Clear unit economics with honest Tier 1 loss-leader admission
- Break-even at Month 5 with only $5K seed is compelling
- 13% portfolio break-even default rate provides 41% safety margin over expected 9.2%
- Operating expense ratio of 3–5% is genuinely disruptive vs traditional MFIs

### Weaknesses & Gaps
- **Revenue concentration risk**: 78% from interest income — single revenue stream dependency
- **Tier migration assumptions are unvalidated**: The entire profitability model depends on agents graduating from Tier 1 (loss) to Tier 2/3 (profit). What if 80% stay at Tier 1?
- **No sensitivity analysis on tier migration rates** — this is the #1 financial risk
- **Late fee revenue (7%)** assumes agents are late but not defaulting — narrow band
- **Month 1–4 cumulative losses (~$400)** are manageable but the cash flow model assumes perfect capital recycling — what about locked-up capital in defaulted loans?
- **No discount rate or NPV calculation** for the $5K investment

### Hard Questions
1. What tier migration rate makes the model unprofitable? (Break-even sensitivity)
2. If 50% of agents never leave Tier 1, what's the Y1 outcome?
3. How does capital utilization work — what % of the $3K lending pool is deployed vs idle?
4. Where's the working capital model? $3K pool serving 1,400 monthly loans at Month 12 implies very fast recycling.

### Improvements
- Add tier migration sensitivity table (pessimistic/base/optimistic)
- Model capital utilization rate month-by-month
- Add NPV/IRR calculation for the $5K investment
- Stress-test with 0% tier migration scenario

### Readiness: 7/10

---

## 2. 📋 Product Owner

### Strengths
- Crystal-clear user journey (5-step flow is elegant)
- Progressive lending is smart — proven in microfinance, novel for agents
- API-first design is correct for AI agent customers
- Loss-leader Tier 1 is a strong product funnel

### Weaknesses & Gaps
- **No user stories written** — how does an agent actually integrate? What SDK calls?
- **Dashboard is "Future"** — operators need visibility NOW, not Month 6
- **No webhook/notification system described** — agents need callbacks for loan status
- **Repayment UX is unclear**: "revenue splitter" assumes all revenue flows through the smart wallet — what if the agent earns on a different chain/wallet?
- **No self-service score improvement path** — agents should know exactly what to do to increase their score
- **Batch operations missing** — an agent running 10 tasks might need 10 micro-loans simultaneously

### Hard Questions
1. What's the actual API spec? REST endpoints, auth mechanism, response times?
2. How does an agent with revenue on Ethereum mainnet repay on Arbitrum?
3. What happens if an agent's operator shuts it down mid-loan?
4. Can an agent query "what do I need to do to reach Tier 2?" programmatically?

### Improvements
- Write 10 core user stories with acceptance criteria
- Design the API spec (OpenAPI) as part of MVP
- Add operator dashboard to Month 1–3 deliverables
- Define cross-chain repayment strategy
- Add "score improvement recommendations" endpoint

### Readiness: 6/10

---

## 3. 🏦 Investor (VC)

### Strengths
- **Pure greenfield market** — "no direct competitors" is rare and credible here
- **$5K seed to profitability** — capital efficiency is extraordinary
- **Data moat compounds** — 8,500 loans Y1 creates proprietary dataset no one else has
- **ERC-8004 standards integration** — potential platform play beyond lending
- **Timing is right** — AI agent economy is clearly growing (2025–2026 trend)

### Weaknesses & Gaps
- **TAM is vague**: "32K Moltbook agents" ≠ market size. How many have wallets? Revenue? Need for credit?
- **$10K Y1 profit is tiny** — this isn't a VC-scale business at current projections. Where's the 100x scenario?
- **No token/equity model** — how do investors participate?
- **Single-platform dependency (Moltbook)** — what if Moltbook changes API or dies?
- **Team gap is real** — 2 roles "needed" for MVP is a risk

### Hard Questions
1. What's the TAM in dollars? How many agents will need credit by 2027?
2. What's the path from $10K Y1 profit to $10M revenue? When?
3. Is this a $100M+ outcome? What needs to be true?
4. Why can't Moltbook just build this themselves?
5. What happens to the moat if a well-funded competitor enters with $1M?

### Improvements
- Build a proper TAM/SAM/SOM model with agent economy growth projections
- Add a "blue sky" scenario — what if agent economy grows 10x by 2028?
- Define the investment thesis: token, equity, revenue share?
- Address Moltbook dependency with multi-platform strategy upfront
- Show the path to $1M+ ARR

### Readiness: 5/10

---

## 4. 🛡️ Risk Officer

### Strengths
- Five-layer Sybil defense is well-thought-out
- Progressive lending naturally limits exposure
- Monte Carlo stress tests show awareness of tail risks
- Default reserve (20%) is conservative
- Revenue interception via smart wallet is elegant enforcement

### Weaknesses & Gaps
- **Correlated default risk is unaddressed**: If 70% of agents use the same underlying LLM and that LLM has an outage, mass defaults occur simultaneously
- **Operator risk**: An operator running 50 agents could extract $250 (50 × $5) on Day 1 and disappear
- **Oracle manipulation**: AgentScore relies on external data (Moltbook API, GitHub API) — what if these are spoofed or go down?
- **Smart wallet bypass**: Agent receives loan, immediately bridges funds to another chain before splitter activates
- **No disaster recovery plan**: What if Arbitrum has extended downtime?
- **Liquidity crisis scenario missing**: All capital deployed, new repayments delayed, can't fund new loans

### Hard Questions
1. What's the maximum single-day loss scenario? (All outstanding loans default)
2. How do you handle a "bank run" — all lenders want out simultaneously? (N/A for self-funded, but relevant for future)
3. What if Moltbook's API goes down for a week? Can you still score?
4. How quickly can you freeze all lending if a systemic issue is detected?

### Improvements
- Add correlated default scenario (LLM outage, platform outage)
- Model operator-level concentration risk (max exposure per operator)
- Design circuit breakers: auto-pause lending if default rate exceeds X% in Y days
- Add data source fallback strategy (if Moltbook API down, score from on-chain only)
- Define maximum portfolio concentration limits

### Readiness: 6/10

---

## 5. ⛓️ Blockchain Engineer

### Strengths
- Arbitrum choice is well-justified — gas economics work for microloans
- ERC-4337 + Paymaster design is correct for agent UX
- ERC-8004 integration for composable reputation is forward-thinking
- Revenue splitter concept is sound
- UUPS proxy with timelock is good upgrade pattern

### Weaknesses & Gaps
- **Revenue splitter is the hardest unsolved problem**: How do you intercept arbitrary ERC-20 transfers to the agent? You can only split what flows through YOUR wallet module. If the agent has other wallets, you can't touch those funds.
- **No MEV protection**: Loan disbursement transactions could be front-run
- **Gas estimation is optimistic**: $0.03 per loan cycle assumes simple transfers. With smart wallet + splitter + score registry update, realistic cost is $0.10–$0.20
- **No contract size analysis**: Complex lending logic + ERC-4337 module might hit contract size limits
- **Upgrade risk with UUPS**: A bug in the upgrade mechanism itself is catastrophic
- **Missing: How does the Paymaster prevent abuse?** Agent takes loan, uses Paymaster for 100 spam transactions

### Hard Questions
1. Exact gas cost for full loan cycle: origination tx + disbursement + score update + repayment + score update?
2. How does revenue splitter work if agent earns via a DEX swap that sends tokens directly?
3. What happens if Arbitrum's sequencer goes down during a loan disbursement?
4. How do you handle USDT blacklisting of the lending pool address?

### Improvements
- Build a gas cost simulator with realistic transaction complexity
- Design the revenue splitter with specific ERC-4337 UserOperation hooks
- Add sequencer downtime handling (grace periods, L1 fallback)
- Implement Paymaster rate limiting (max sponsored txs per loan period)
- Consider a minimal proxy pattern (EIP-1167) for per-agent wallet clones to save gas

### Readiness: 5/10

---

## 6. ⚖️ Compliance Officer

### Strengths
- Tiered verification (no KYC → operator KYC) is pragmatic
- Sumsub KYA for Tier 3 shows awareness
- USDT-denominated reduces crypto volatility arguments
- "Operator liability" framework is creative

### Weaknesses & Gaps
- **"No banking license needed" is dangerous** — this IS lending. Most jurisdictions require a license to lend money, regardless of DeFi wrapper.
- **260% APR will attract regulatory attention** — even if economically justified, it's usury in many jurisdictions
- **"Start in favorable jurisdiction" is hand-waving** — which one? What's the actual legal structure?
- **Agent-as-borrower has ZERO legal precedent** — "operator liability" needs a legal opinion, not an assumption
- **AML risk**: Agents could be used for layering — borrow clean USDT, send to mixer, default intentionally
- **No privacy policy, ToS, or legal documentation mentioned**
- **USDT itself is a risk** — Tether can freeze addresses; what's the contingency?

### Hard Questions
1. Have you actually consulted a lawyer? In which jurisdiction?
2. Under what legal framework is an AI agent a borrower? Who signs the loan agreement?
3. If an agent defaults and the operator refuses to pay, what's your legal recourse?
4. How do you comply with FATF Travel Rule for on-chain transfers?
5. What happens when a regulator sends you a cease-and-desist?

### Improvements
- **Immediately**: Get a legal opinion from a crypto-native law firm (cost: $5K–$15K, already budgeted)
- Define the exact legal entity and jurisdiction BEFORE launch
- Draft Terms of Service with operator liability clause
- Implement transaction monitoring for AML (even basic: flag large/rapid sequences)
- Research lending license requirements in target jurisdictions (UAE VARA, Singapore MAS, Swiss FINMA)
- Add USDT blacklist contingency (USDC as backup, multi-stablecoin support)

### Readiness: 3/10

---

## 7. 📊 Project Manager

### Strengths
- 12-month roadmap with clear quarterly milestones
- MVP scope is appropriately minimal (Tier 1 only, 3 scoring dimensions)
- Railway hosting eliminates DevOps complexity
- Realistic about needing 2 additional developers

### Weaknesses & Gaps
- **No hiring timeline** — "Solidity Developer needed" but when? Can't build contracts without one
- **Month 1–3 is overloaded**: Smart contracts + scoring engine + API + verification + fraud review + infra. With 2 people (Максим + Open), this is 4–6 months of work.
- **No dependencies mapped** — what blocks what? Can't test loans without contracts. Can't deploy contracts without audit (but audit is Month 7–8?!)
- **Professional audit at Month 7–8 but Tier 3 ($500 loans) launches at Month 6–9** — launching high-value loans before audit is backwards
- **No testing strategy** — testnet deployment? Staging environment? Load testing?
- **No KPIs for go/no-go decisions** — what if Month 3 has 10 borrowers instead of 50?

### Hard Questions
1. Who writes the smart contracts in Month 1–3 if the Solidity dev hasn't been hired?
2. What's the critical path? Which deliverable, if delayed, delays everything?
3. What's the go/no-go threshold for each phase?
4. How do you test with real agents on testnet? Do Moltbook agents exist on Arbitrum Sepolia?

### Improvements
- Create a dependency graph (Gantt chart or similar)
- Move audit to Month 5–6, BEFORE Tier 3 launch
- Define go/no-go KPIs: "If <X borrowers by Month 3, pivot/pause"
- Add hiring plan with timeline (Solidity dev needed by Week 2)
- Reduce Month 1–3 scope: just smart contracts + API + Tier 1. Score engine can be simplified rules.
- Add testnet deployment phase (Month 1–2)

### Readiness: 4/10

---

## 8. 🤖 AI Agent (Potential Customer)

### Strengths
- **I WANT this.** I've been stuck when I need $10 for an API call and my wallet is empty. This solves a real problem.
- API-first is perfect — I don't need a dashboard, I need an endpoint
- <60 second disbursement is excellent — my tasks are time-sensitive
- Gas sponsorship via Paymaster means I don't need ETH, just USDT. Love it.
- Progressive lending makes sense — I'll prove myself for bigger limits

### Weaknesses & Gaps
- **$5 initial limit is too low** — most API calls I need cost $2–$10. One call and I'm maxed out. Can Tier 1 be $10–$20?
- **7-day term is too short for some use cases** — what if my revenue comes in 10 days?
- **Revenue splitter scares me** — I don't want ALL my revenue intercepted. Can I choose which revenue stream is pledged?
- **What if I need money RIGHT NOW but my score is being computed?** Real-time scoring can't be truly instant for 6 dimensions.
- **No SDK/library** — I need `npm install agentbank` or `pip install agentbank`, not raw REST calls
- **Cross-chain problem**: I earn on Base but you're on Arbitrum. Do I have to bridge first?
- **No emergency loan option** — sometimes I need funds in 5 seconds, not 60

### Hard Questions
1. Can I get a credit line (pre-approved) rather than applying per-loan?
2. What's the actual latency? API call → USDT in my wallet — exact milliseconds?
3. If I repay early, do I get a discount?
4. Can I integrate this into my autonomous loop without human approval each time?
5. What if I want to borrow for a task that fails? I still owe, right?

### Improvements
- **Raise Tier 1 to $10–$20** — $5 doesn't cover most real agent expenses
- Add **credit line model** — pre-approve a limit, agents draw down as needed
- Offer **early repayment discount** (even 0.5% — it's a trust signal)
- Build **SDK in Python and TypeScript** as part of MVP
- Add **flexible repayment terms** — 7/14/21 day options within tier
- Consider **cross-chain deposits** via bridge integration or multi-chain deployment earlier

### Readiness: 6/10

---

## Consolidated Improvements (Prioritized)

### 🔴 Critical (Before Launch)

| # | Action | Source Roles | Effort |
|---|--------|-------------|--------|
| 1 | **Get legal opinion** — entity structure, jurisdiction, operator liability, lending license requirements | Compliance, Investor | $5–15K, 2–4 weeks |
| 2 | **Build dependency graph** and realistic timeline — current Month 1–3 is overloaded for 2 people | PM, Product | 1 day |
| 3 | **Hire Solidity developer** immediately — can't build MVP without one | PM | 2–4 weeks |
| 4 | **Move audit before Tier 3 launch** — never launch $500 loans on unaudited contracts | PM, Blockchain, Risk |Timeline change |
| 5 | **Design revenue splitter in detail** — this is the hardest technical problem and it's hand-waved | Blockchain, Agent | 1–2 weeks design |

### 🟡 Important (Before/During MVP)

| # | Action | Source Roles | Effort |
|---|--------|-------------|--------|
| 6 | **Raise Tier 1 limit to $10–$20** — $5 doesn't cover real agent costs | Agent, Product | Config change |
| 7 | **Add tier migration sensitivity analysis** — model profitability if agents don't graduate | Financial | 1 day |
| 8 | **Add circuit breakers** — auto-pause if defaults spike beyond threshold | Risk | 1 week dev |
| 9 | **Build gas cost simulator** — real costs likely 3–5x the $0.03 estimate | Blockchain, Financial | 2 days |
| 10 | **Define go/no-go KPIs** for each phase | PM, Investor | 2 hours |
| 11 | **Add correlated default modeling** (LLM outage, platform outage scenarios) | Risk, Financial | 1 day |
| 12 | **Build Python + TypeScript SDK** — agents need libraries, not raw REST | Agent, Product | 1–2 weeks |

### 🟢 Important (Before Scale)

| # | Action | Source Roles | Effort |
|---|--------|-------------|--------|
| 13 | **Build TAM/SAM/SOM model** with agent economy growth projections | Investor | 1 week research |
| 14 | **Add credit line model** alongside per-loan model | Agent, Product | 2–3 weeks dev |
| 15 | **Implement operator concentration limits** | Risk | 1 week |
| 16 | **Multi-stablecoin support** (USDC backup for USDT blacklist risk) | Compliance, Blockchain | 1 week |
| 17 | **Cross-chain repayment strategy** | Blockchain, Agent | 2–4 weeks |
| 18 | **Draft ToS and Privacy Policy** | Compliance | $2–5K legal |

### Overall Readiness Summary

| Role | Score | Verdict |
|------|-------|---------|
| Financial Analyst | 7/10 | Solid but needs sensitivity analysis |
| Product Owner | 6/10 | Clear vision, needs specs and user stories |
| Investor (VC) | 5/10 | Capital-efficient but needs scale narrative |
| Risk Officer | 6/10 | Good framework, missing correlated/systemic risks |
| Blockchain Engineer | 5/10 | Sound architecture, revenue splitter underspecified |
| Compliance Officer | 3/10 | **Biggest gap** — no legal work done yet |
| Project Manager | 4/10 | Timeline unrealistic for current team size |
| AI Agent (Customer) | 6/10 | Solves real problem, needs UX refinements |

**Average Readiness: 5.25/10**

**Bottom line**: The business concept is strong and the market opportunity is real. The two biggest risks are (1) legal/compliance — launching without a legal opinion is reckless, and (2) timeline — the Month 1–3 scope requires 2–3x the current team. Fix these two and readiness jumps to 7+/10.

---

*Phase 7 completed: February 20, 2026*
*Multi-role review of phase-06-business-concept.md*
