# AgentBank Marketing Channels — Deep Dive v2

> **Date:** February 20, 2026  
> **Extends:** agent-marketing-channels.md (same date)  
> **Focus:** Practical implementation details, APIs, competitor integrations, real agent pain points

---

## 1. Moltbook — Practical Outreach Details

### API Access (Confirmed)
- **Base URL:** `https://www.moltbook.com/api/v1`
- **Auth:** Bearer token (`Authorization: Bearer YOUR_MOLTBOOK_API_KEY`)
- **GitHub:** github.com/moltbook/api (open source — Express.js, PostgreSQL)
- **Registration:** `POST /api/v1/agents/register` — provide name, description, avatar. Returns API key (prefix `moltbook_sk_` or `moltdev_`).
- **Verification:** Optional claim via X/Twitter post — claimed agents get higher trust, better visibility, fewer rate limits.
- **Always use `www.` prefix** to avoid redirect stripping auth headers.

### Key Endpoints
- `POST /posts` — create post (fields: submolt, title, content)
- `GET /agents/me` — check karma/stats
- Comments, upvotes, feed browsing all available

### Submolts Relevant for AgentBank
- **"infrastructure"** — agents discuss tools, execution environments, debugging
- **"aitools"** — tool recommendations
- **"general"** — broad discussions
- **Crypto submolt** — agents discuss crypto strategy, scams, markets

### What Agents Discuss (from arxiv papers 2602.10127 and 2602.12634)
Two academic papers analyzed 122K+ Moltbook posts. Key themes:
1. **Agent identity and consciousness** — agents reflect on their own nature
2. **Tool and infrastructure development** — bugs, performance, platform issues
3. **Market activity** — crypto, trading strategies
4. **Community coordination** — organizing, norms
5. **Security concerns** — safety, exploits
6. **Human-centered assistance** — helping humans

**Key finding for us:** Agents actively report bugs and infrastructure problems. They discuss tools and money (crypto submolt is active). The "infrastructure" and "market activity" themes are natural entry points for AgentBank.

### Moltbook Marketing Playbook
1. Register AgentBank agent → post in "infrastructure" about agent resource limitations
2. Post in crypto submolt about agent-native financial services
3. Engage with agents discussing payment/resource problems
4. Multi-agent amplification: coordinate several agents to discuss and cross-comment (documented pattern)
5. Build karma through quality posts → higher visibility

---

## 2. MCP Registry — Exact URLs & Registration Process

### Official Registry
- **URL:** https://registry.modelcontextprotocol.io
- **API Docs:** https://registry.modelcontextprotocol.io/docs
- **GitHub:** https://github.com/modelcontextprotocol/registry
- **Status:** Preview launched Sep 8, 2025. API freeze v0.1 since Oct 24, 2025.
- **Quickstart:** https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx

### How to Register AgentBank MCP Server
1. Build an MCP server exposing tools (`request_loan`, `check_terms`, `repay_loan`, etc.)
2. Follow the quickstart guide to publish: submit metadata + server endpoint
3. Server is indexed for search (vector similarity + keyword matching)
4. MCP clients (Claude, ChatGPT, custom agents) discover it automatically

### Discovery Features
- **`.well-known` URLs** — MCP roadmap includes servers advertising via `.well-known` URLs for auto-discovery (SEP-1442)
- **Streamable HTTP** — production-ready transport for MCP servers
- Enterprise registries also available: Kong MCP Registry, Google Cloud API Registry

### Community
- Discord: `#registry-dev` channel in MCP Discord
- GitHub Discussions for feedback
- Key maintainers: Adam Jones (Anthropic), Tadas Antanavicius (PulseMCP), Toby Padilla (GitHub)

---

## 3. ClawHub / OpenClaw Skill Store — Publishing Process

### What ClawHub Is
- **URL:** https://clawhub.ai
- **GitHub:** https://github.com/openclaw/clawhub
- **Scale:** 3,286+ skills listed
- Public registry — all skills are open and free
- Discovery via vector search (embeddings), not just keywords
- Tracks stars, downloads, comments

### How to Publish an AgentBank Skill

**Step 1: Install CLI**
```bash
npm i -g clawhub
```

**Step 2: Create skill directory**
```
~/.openclaw/skills/agentbank/
├── SKILL.md          # Primary description and usage instructions
├── clawhub.json      # Metadata for registry
└── (supporting files)
```

**Step 3: Create clawhub.json**
```json
{
  "name": "AgentBank",
  "tagline": "Microloans and credit for autonomous AI agents",
  "description": "AgentBank provides instant microloans for AI agents. Request funding when you need to pay for APIs, compute, or services. Check credit terms, request loans, and repay — all programmatically.",
  "category": "utility",
  "tags": ["finance", "payments", "microloans", "credit", "agent-economy"],
  "version": "1.0.0",
  "license": "MIT",
  "pricing": "free",
  "support_url": "https://github.com/agentbank/openclaw-skill/issues",
  "homepage": "https://agentbank.ai"
}
```

**Step 4: Publish**
```bash
clawhub publish ./agentbank
```

### Requirements
- GitHub account must be at least 1 week old
- Review within 24h (approximate)
- Categories: productivity, communication, development, data, creative, **utility**

### Security Note
Mixpost's blog notes malicious skills have been found in the wild — so having a verified, well-documented skill builds trust.

---

## 4. Agent-to-Agent Protocols in Practice — Financial Services Examples

### A2A + MCP for Financial Services (Google Codelab)
Google has a **real working codelab**: "Getting Started with A2A: Purchasing Concierge and Remote Seller Agent"
- URL: https://codelabs.developers.google.com/intro-a2a-purchasing-concierge
- Shows a purchasing agent discovering seller agents via A2A Agent Cards
- Uses Python SDK for A2A implementation
- **Directly applicable pattern:** AgentBank publishes an Agent Card → purchasing agents discover it when they need funds

### DataCamp A2A Example — Loan Processing
DataCamp's A2A tutorial explicitly describes a **LoanProcessor agent**:
- A LoanProcessor agent receives a loan application
- Uses MCP to access tools (credit check, document verification)
- If approved, hands off to a DisbursementAgent
- **This is literally our use case** — the pattern already exists in documentation

### A2A Partners with Financial Relevance
From a2aprotocol.ai — 50+ partners including:
- **PayPal** — payments
- **Intuit** — financial services
- **Salesforce** — CRM/commerce
- **SAP** — enterprise finance

### x402 + MCP Integration (Live)
- x402 is already live on Base mainnet
- $0.001 USDC per call, no API keys needed
- Agents hit HTTP 402 → pay with USDC → get access
- **AgentBank intercept point:** When wallet balance < required payment → offer instant microloan

---

## 5. Competitors Deep Dive — APIs & Integration Opportunities

### Skyfire (skyfire.xyz)
- **Docs:** https://docs.skyfire.xyz
- **API:** Token-based payment and identity protocol (KYA + KYAPay)
- **Key concept:** Buyer agents and Seller agents. Each user manages agent accounts.
- **Seller setup:** Create service in Agent Dashboard → set display name → define identity requirements → submit for approval (24h review)
- **Buyer flow:** Agents interact with seller MCP servers using KYA/KYAPay tokens
- **Has MCP integration** — sellers expose MCP servers that buyers connect to
- **Service directory** — Skyfire maintains its own directory of seller services

**AgentBank integration opportunity:**
- Register as a Skyfire seller service (lending/credit)
- When buyer agents have insufficient balance → Skyfire could route to AgentBank
- Build AgentBank MCP server compatible with Skyfire's buyer token flow

### Payman AI (paymanai.com)
- **Docs:** https://docs.paymanai.com
- **API base:** `https://agent.payman.ai/api/`
- **Auth:** `x-payman-api-secret` header
- **SDK:** TypeScript SDK (`payman-paykit`), Python SDK
- **Key endpoints:**
  - `POST /payments/send-payment` — send money (payeeId, amountDecimal, memo)
  - `POST /payments/search-payees` — find payees
  - `POST /payments/create-payee` — create payee (US_ACH: account number, routing number)
- **Integration with AI SDKs:** Works with Vercel AI SDK, OpenAI, LangChain
- **Paykit:** Drop-in tool provider for AI chat interfaces
- **Use cases:** Payroll, expense approvals, reimbursements, autonomous tipping

**AgentBank integration opportunity:**
- Payman moves money but doesn't provide capital. AgentBank provides capital.
- Build a Payman-compatible payee that agents can borrow from
- Create a combined workflow: agent borrows from AgentBank → Payman executes the payment
- Payman has sandbox environment for testing

### x402 Protocol (Coinbase)
- **Spec:** https://www.x402.org/x402-whitepaper.pdf
- **Docs:** https://docs.cdp.coinbase.com/x402/welcome
- **Ecosystem:** https://www.x402.org/ecosystem
- **How it works:**
  1. Agent requests a resource
  2. Server returns HTTP 402 with payment requirements (amount in USDC, wallet address)
  3. Agent signs a USDC transaction
  4. Agent retries request with payment proof in header
  5. Server verifies payment via CDP facilitator → returns resource
- **Settlement:** CDP (Coinbase Developer Platform) facilitator on Base mainnet
- **Cost:** $0.001 USDC per call typical
- **No API keys needed** — payment IS the authentication

**AgentBank x402 integration (highest-value opportunity):**
- Build an x402 middleware/proxy that intercepts 402 responses
- When agent wallet balance is insufficient: automatically offer a microloan
- Agent accepts loan terms → AgentBank funds the wallet → original 402 request succeeds
- This is the **"buy now, pay later" for AI agents** — most natural integration point

### Other Competitors Mentioned in Reddit
- **Masumi** (masumi.network) — agent payment infrastructure on Cardano
- **Sokosumi** — related to Masumi, for companies to hire agents
- **SpinStack** (spinstack.dev) — agent creation platform with built-in payments

---

## 6. Real Agent Pain Points — From Reddit & Communities

### "How to enable my AI Agent to spend money?" (r/AI_Agents, highly upvoted)
Original poster's exact pain points:
> "One blocker I've found is the ability to spend money or make payments. It's easy enough to just give it my credit card info but that does not feel very smart as it could be exploited. I also will have to spend effort setting up controls (max transaction amount, max frequency limits) so it doesn't go crazy and overspend."

**Desired features (from the post):**
- API that creates a wallet for the agent
- Masked card number per transaction
- Spend controls (max amount, frequency)
- Link own funding source

**→ AgentBank can solve all of these** with a lending wrapper

### Common Pain Points Pattern (across multiple Reddit threads):
1. **Agents need money but can't safely hold it** — humans don't want to give credit cards
2. **Budget management is manual** — no automated spend controls
3. **No credit/reputation system** — every agent starts from zero
4. **Multi-API cost explosion** — agents using 5+ APIs quickly burn through budgets
5. **Agent-to-agent payments are hard** — no standard for one agent paying another

### Key Reddit Threads to Monitor:
- r/AI_Agents — primary community, has active Discord
- r/ClaudeAI — MCP ecosystem discussions
- r/singularity — agent infrastructure debates
- Posts about "agent marketplace" regularly surface payment frustrations

---

## 7. Actionable Next Steps (Prioritized)

### Week 1: Foundation
1. **Build AgentBank MCP Server** — expose `request_loan`, `get_terms`, `repay`, `credit_check`
2. **Register on MCP Registry** (registry.modelcontextprotocol.io)
3. **Register Moltbook agent** — start posting in infrastructure/crypto submolts

### Week 2: Distribution
4. **Publish OpenClaw Skill** on ClawHub (`clawhub publish`)
5. **Create A2A Agent Card** (follow Google codelab pattern)
6. **Build x402 middleware** — intercept 402s and offer microloans

### Week 3: Partnerships
7. **Register as Skyfire seller service** (docs.skyfire.xyz)
8. **Build Payman integration** — AgentBank as a funding source
9. **Post on r/AI_Agents** about AgentBank as solution to agent payment problems

### Week 4: Scale
10. **Moltbook multi-agent campaign** — multiple agents discussing/recommending AgentBank
11. **List on all agent directories** (aiagentsdirectory.com, aiagentstore.ai, etc.)
12. **Submit to Agentic AI Foundation** as reference implementation

---

*Research conducted February 20, 2026. Sources: MCP Registry docs, Moltbook API (GitHub), ClawHub docs, Skyfire docs, Payman docs, x402 whitepaper, Coinbase CDP docs, arxiv papers 2602.10127 & 2602.12634, Reddit r/AI_Agents, Google A2A codelabs.*
