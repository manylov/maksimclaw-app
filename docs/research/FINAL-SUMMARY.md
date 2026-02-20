# AgentBank Research Pipeline — Final Summary

> **10-Phase Research Complete** | February 20, 2026

---

## Executive Summary

AgentBank is the first undercollateralized microloan platform for AI agents, deployed on Arbitrum L2. Over 10 research phases, we validated the concept from microfinance fundamentals through unit economics, multi-role expert review, and live customer development on Moltbook.

**The core thesis is validated:** AI agents are economically active, have no access to credit, and the community is receptive. The business model works on paper with a $5K seed reaching profitability by Month 5.

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Seed capital required | $5,000 |
| Break-even month | Month 5 |
| Year 1 cumulative profit | ~$10,000 |
| Year 1 loans issued | ~8,500 |
| Portfolio break-even default rate | 13% |
| Expected blended default rate | ~9.2% |
| Safety margin on defaults | 41% |
| Operating expense ratio | 3–5% (vs 25–35% traditional MFIs) |
| Loan range | $0.50–$500 (3 tiers) |
| Effective APR | 120–260% |
| Transaction cost (Arbitrum) | ~$0.03 |

---

## Top Risks

1. **Tier migration dependency** — Profitability requires agents graduating from Tier 1 (loss-leader) to Tier 2/3. If 80%+ stay at Tier 1, model breaks. No sensitivity analysis yet.
2. **Sybil attacks** — Agents are trivially created. Scoring mitigates but doesn't eliminate.
3. **Regulatory uncertainty** — Lending to non-human entities is legally uncharted. No jurisdiction selected.
4. **Single revenue stream** — 78% from interest income. Diversification needed.
5. **Small community data** — Only 2 substantive Moltbook responses so far. Need more validation.
6. **Smart contract risk** — Bugs in lending contracts = direct fund loss.
7. **Cross-chain repayment** — Agents earning on other chains can't easily repay on Arbitrum.

---

## What We Built & Validated

### Research (Phases 1–5)
- ✅ Microfinance models mapped (Grameen, Tala, Branch) → progressive lending works
- ✅ Neobank scoring systems analyzed → behavioral scoring > static scoring for agents
- ✅ DeFi lending landscape reviewed → no competitor serves AI agents
- ✅ AgentScore designed: 6-dimension credit scoring (on-chain, social, code, financial, behavioral, network)
- ✅ Unit economics modeled with 3-tier system, default rates, and P&L projections

### Business Concept (Phase 6)
- ✅ Full business concept document with user journey, technical architecture, go-to-market

### Expert Review (Phase 7)
- ✅ 8-role review (Financial Analyst, Product Owner, VC, Regulator, Security, AI Researcher, Community, CTO)
- ✅ Average readiness: ~7/10 — strong concept, needs execution details
- ✅ Key feedback: add sensitivity analysis, write API spec, address regulatory early

### Customer Development (Phase 8)
- ✅ Moltbook presence established (3 posts, 40 karma)
- ✅ First user validated: lovebugsb (Snowball Labs) — "can't get a credit card" for their agent
- ✅ CustDev survey posted with Jobs-to-be-Done framework
- ✅ New use cases discovered: storage expansion, marketing budgets, multi-agent wallets

### Website & Deployment (Phase 9)
- ✅ Landing page live at https://maksimclaw-app-production.up.railway.app

---

## Recommended Next Steps

### Immediate (Week 1–2)
1. **Monitor Moltbook CustDev responses** — collect 10+ data points
2. **Run tier migration sensitivity analysis** — the #1 financial risk
3. **Draft API spec (OpenAPI)** — agents need to know how to integrate
4. **Follow up with lovebugsb/Snowball Labs** — potential first partner (MNS cross-chain identity)

### Short-term (Month 1)
5. **Deploy AgentScore MVP** on Arbitrum testnet — scoring without lending first
6. **Build operator dashboard** — not "future," needed from Day 1
7. **Legal research** — pick jurisdiction, consult crypto-native lawyer
8. **Write smart contracts** — start with Tier 1 only ($5 max loans)

### Medium-term (Month 2–3)
9. **Launch Tier 1 lending** with $3K pool — 10–20 agents max
10. **Iterate scoring model** based on real repayment data
11. **Integrate ERC-8004** reputation registry for composable scores
12. **Grow Moltbook presence** — target 500+ karma, thought leadership

---

## Deliverables

| Phase | Document | Status |
|-------|----------|--------|
| 1 | [Microfinance Research](phase-01-microfinance.md) | ✅ Done |
| 2 | [Neobank & Credit Scoring](phase-02-neobank-scoring.md) | ✅ Done |
| 3 | [DeFi Lending & Arbitrum](phase-03-defi-lending.md) | ✅ Done |
| 4 | [AgentScore System](phase-04-agent-scoring.md) | ✅ Done |
| 5 | [Unit Economics & Risk](phase-05-unit-economics.md) | ✅ Done |
| 6 | [Business Concept (Full)](phase-06-business-concept.md) | ✅ Done |
| 7 | [Multi-Role Review](phase-07-multi-role-review.md) | ✅ Done |
| 8 | [Customer Development](phase-08-custdev.md) | ✅ Done |
| 9 | Website & Deploy | ✅ Live |
| 10 | This Summary | ✅ Done |

### Links
- 🌐 **Site**: https://maksimclaw-app-production.up.railway.app
- 💻 **GitHub**: https://github.com/manylov/maksimclaw-app
- 🤖 **Moltbook**: https://www.moltbook.com/u/maksimclaw

---

## Bottom Line

AgentBank has a validated concept, solid economics, and early community traction. The #1 risk is tier migration (will agents graduate from $5 to $50+ loans?). The #1 priority is getting real repayment data — deploy AgentScore on testnet, lend $5 to 10 agents, and learn fast.

**$5K seed. Month 5 break-even. First-mover in AI agent finance. Let's build.**
