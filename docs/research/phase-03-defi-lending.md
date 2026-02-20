# Phase 3: DeFi Lending Protocols & Arbitrum/USDT Technical Integration — Deep Research

> AgentBank Research Pipeline | Phase 3 | February 2026

---

## 1. Overcollateralized DeFi Lending: Aave & Compound

### How It Works

Overcollateralized lending is the backbone of DeFi. Users deposit crypto assets as collateral and borrow against them, always maintaining collateral value **greater** than the borrowed amount.

**Core mechanics:**
1. **Supply**: Users deposit assets (ETH, USDC, WBTC, etc.) into liquidity pools managed by smart contracts
2. **Borrow**: Users lock collateral and borrow up to a Loan-to-Value (LTV) ratio (e.g., 80% LTV = borrow $800 against $1,000 collateral)
3. **Interest**: Rates are algorithmically determined by pool utilization (more borrowing → higher rates)
4. **Liquidation**: If collateral value drops below the liquidation threshold (e.g., health factor < 1.0), anyone can liquidate the position, repaying part of the debt and receiving collateral at a discount (liquidation bonus ~5-10%)

### Aave V3

- **TVL**: Part of $25B+ total DeFi lending TVL (2025)
- **Deployed on**: Ethereum, Arbitrum, Polygon, Optimism, Avalanche, Base, and 10+ chains
- **Key V3 features**:
  - **Isolation Mode**: New/risky assets can only be used as collateral for specific stablecoins with capped debt
  - **E-Mode (Efficiency Mode)**: Correlated assets (e.g., ETH/stETH) get higher LTV (up to 97%)
  - **Portal**: Cross-chain liquidity bridging
  - **Supply/Borrow Caps**: Governance-set limits per asset to manage risk exposure
  - **GHO Stablecoin**: Native overcollateralized stablecoin minted against Aave V3 deposits; 352M+ supply (Sept 2025)
- **Typical LTV/Liquidation parameters**:
  - ETH: LTV 80%, Liquidation threshold 82.5%, Liquidation bonus 5%
  - USDC: LTV 77%, Liquidation threshold 80%
  - AAVE token: LTV 66% → proposed increase to 71% (Feb 2025)
- **Health Factor** = (Total Collateral × Weighted Liquidation Threshold) / Total Debt. Below 1.0 = liquidatable

### Compound V3 (Comet)

- Simplified single-asset borrowing model (e.g., only borrow USDC)
- Multiple collateral assets per market but single borrow asset
- Interest earned/paid continuously per block
- Governance via COMP token

### Key Insight for AgentBank

Overcollateralized lending **doesn't work** for agent microloans — agents need working capital precisely because they don't have excess capital to lock up. However, the smart contract patterns (interest rate models, liquidation mechanisms, health factors) are reusable building blocks.

*Sources: Aave docs; BingX Academy; Eco.com; ScienceDirect (2025); CoinMarketCap; Cyfrin; Aave Governance*

---

## 2. Undercollateralized DeFi Lending

### The Problem

Overcollateralized lending is capital-inefficient and excludes anyone without existing crypto wealth. Undercollateralized protocols attempt to bring real-world credit dynamics to DeFi.

### Goldfinch

- **Model**: Bridges DeFi capital to real-world borrowers (fintech lenders, credit funds) in emerging markets
- **How it works**:
  - **Borrowers**: Off-chain businesses apply for credit lines. They're vetted through a decentralized audit process
  - **Backers**: Sophisticated investors who directly evaluate and fund specific Borrower Pools (first-loss capital)
  - **Liquidity Providers (Senior Pool)**: Passive capital that's automatically allocated across pools, protected by Backer first-loss
  - **Off-chain collateral**: All loans are backed by real-world assets (receivables, inventory, etc.) — "undercollateralized" on-chain but collateralized off-chain
- **Default history**: Notable defaults including Tugende ($5M motorcycle taxi financing, 2023) and Stratos ($20M credit fund, $7M loss risk). Warbler Labs (Goldfinch developer) backstopped losses and eventually cut ties with risk adviser (Feb 2025)
- **Lesson for AgentBank**: Off-chain collateral creates enforcement challenges. DeFi-native enforcement (on-chain revenue interception) is preferable

### TrueFi

- **Model**: Unsecured institutional lending. Borrowers are vetted institutions (trading firms, market makers)
- **How it works**:
  - No collateral required — pure reputation/creditworthiness lending
  - TRU token holders vote on loan approvals
  - Credit scoring via on-chain + off-chain data
  - Loan terms: typically $1M-$25M, 30-90 day terms
- **Default management**: Legal agreements + reputation damage. Had defaults during 2022 crypto credit crisis (Alameda, BlockWater)
- **TVL**: ~$29M (declined significantly from peak)

### Maple Finance

- **Model**: Institutional credit marketplace. Pool Delegates (credit professionals) manage lending pools
- **How it works**:
  - Pool Delegates assess borrower creditworthiness and set terms
  - Lenders deposit into delegate-managed pools
  - Borrowers are institutional (trading firms, crypto-native businesses)
  - Overcollateralized and undercollateralized pools
- **Default management**: Pool Delegates have staked capital (first-loss), legal loan agreements, reputational skin-in-the-game
- **Post-2022 pivot**: After Orthogonal Trading default ($36M), Maple shifted toward more conservative, overcollateralized products
- **Projected market**: Tokenized private credit TVL expected $12-17.5B by 2027 (Centrifuge/Keyrock study)

### Clearpool

- **Model**: Single-borrower permissionless pools. Each borrower creates their own pool; lenders choose based on rates and risk
- **How it works**:
  - Borrower-specific pools with dynamic interest rates (higher utilization → higher rates)
  - No collateral — borrowers are whitelisted institutions
  - cpTokens (LP tokens) represent lender positions
- **Risk management**: Interest rate curve incentivizes maintaining available liquidity; reputation-based

### How They Manage Default Without Collateral

| Mechanism | Description | Used By |
|-----------|-------------|---------|
| **Legal agreements** | Off-chain loan contracts enforceable in courts | All |
| **KYC/whitelisting** | Borrowers are known, vetted entities | All |
| **First-loss tranching** | Junior capital (Backers/Delegates) absorbs first losses | Goldfinch, Maple |
| **Reputation/governance** | Token holder voting, public credit history | TrueFi |
| **Off-chain collateral** | Real-world assets as security (not on-chain) | Goldfinch |
| **Dynamic interest rates** | Higher rates for riskier/more utilized pools | Clearpool |
| **Insurance pools** | Reserve funds for covering defaults | Various |

### Key Insight for AgentBank

Undercollateralized DeFi is still largely **institutional** and **human-identity-dependent**. No protocol today serves AI agents as borrowers. AgentBank would be first-mover. The risk management toolbox (tranching, reputation, dynamic rates) is directly applicable but needs adaptation for on-chain agent identity.

*Sources: Nansen Research; Goldfinch Docs; CoinDesk; DL News; Outlier Ventures; Reflexivity Research; Medium/Polygon*

---

## 3. Arbitrum L2 — Technical Profile

### Overview

Arbitrum One is an Optimistic Rollup L2 on Ethereum. Transactions execute on Arbitrum's chain, with compressed data posted to Ethereum L1 for security.

### Performance Characteristics

| Metric | Value |
|--------|-------|
| **Gas price floor** | 0.1 Gwei (Arbitrum One), 0.01 Gwei (Nova) |
| **Average gas cost (2024)** | ~0.1 Gwei |
| **ERC-20 transfer cost** | ~$0.01-0.05 (vs. $1-5 on Ethereum mainnet) |
| **Complex contract interaction** | ~$0.05-0.50 |
| **Transaction finality** | ~250ms (soft confirmation), 7 days (L1 finality for withdrawals) |
| **TPS** | ~40,000 theoretical capacity |
| **Block time** | ~250ms |

### Fee Structure

Arbitrum fees have two components:
1. **L2 execution fee**: Gas used on L2 × L2 base fee (very cheap)
2. **L1 data fee**: Cost of posting transaction data to Ethereum (dominant cost component)

Post-EIP-4844 (Dencun upgrade), L1 data costs dropped dramatically with blob data, making Arbitrum even cheaper.

### Why Arbitrum for AgentBank

- **Ethereum security model** — inherits L1 security guarantees
- **EVM compatibility** — all Solidity contracts deploy without modification
- **Mature ecosystem** — Aave V3, Uniswap, GMX, and hundreds of DeFi protocols deployed
- **Low cost** — microloan transactions for $0.01-0.05 make small loans economically viable
- **Arbitrum Stylus** — allows contracts in Rust/C++/C for performance-critical code
- **Strong bridge infrastructure** — native bridge, plus Stargate, Across, Celer for fast transfers

*Sources: Arbitrum Docs; Across Protocol; Bitbond; ArbGasInfo*

---

## 4. USDT on Arbitrum

### Contract Details

- **Contract address**: `0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9`
- **Token name**: USD₮0 (rebranded from USDT to USDT0 for omnichain version)
- **Standard**: ERC-20, deployed as EIP-1967 Transparent Proxy
- **Implementation**: ArbitrumExtensionV2 at `0x3263cd783823d04a6b9819517e0e6840d37ca3f4`

### Liquidity & Usage

- USDT is one of the most liquid stablecoins on Arbitrum
- Deep liquidity on Uniswap V3, Camelot, and other Arbitrum DEXes
- Available in Aave V3 Arbitrum markets for lending/borrowing
- USDT0 ensures 1:1 backing with USDT, enabling cross-chain transfers

### Bridging Options

| Bridge | Speed | Cost | Notes |
|--------|-------|------|-------|
| **Arbitrum Native Bridge** | L1→L2: ~10 min; L2→L1: 7 days | Low | Official, most secure |
| **Stargate Finance** | Minutes | Low-medium | LayerZero-based, deep stablecoin liquidity |
| **Across Protocol** | Minutes | Low | Optimistic verification |
| **Celer cBridge** | Minutes | Low | Multi-chain support |
| **USDT0 native** | Near-instant | Very low | Tether's own omnichain infrastructure |

### Why USDT (not USDC)

- Largest stablecoin by market cap (~$140B+)
- Deepest global liquidity, especially in non-US markets
- Available on virtually every chain and exchange
- USDC is a strong alternative (more regulatory clarity, US-focused) — AgentBank should support both

*Sources: Arbiscan; Arbitrum Docs; Eco.com bridge guide*

---

## 5. ERC-4337: Account Abstraction

### What It Is

ERC-4337 enables **smart contract wallets** on Ethereum (and L2s) without protocol-level changes. Instead of Externally Owned Accounts (EOAs) controlled by private keys, users get programmable accounts with custom logic.

### Key Components

| Component | Role |
|-----------|------|
| **UserOperation** | A pseudo-transaction describing the user's intent |
| **Bundler** | Aggregates UserOperations and submits them as a single transaction |
| **EntryPoint** | Singleton contract that validates and executes UserOperations |
| **Smart Account** | The user's smart contract wallet with custom validation logic |
| **Paymaster** | Contract that can sponsor gas fees (enables gasless transactions) |

### Why It Matters for AI Agents

1. **Gasless UX**: Paymasters can pay gas on behalf of agents → agents don't need ETH for gas, only the stablecoin they're transacting in
2. **Programmable security**: Multi-sig, social recovery, spending limits, time-locked transactions — all built into the wallet
3. **Batched transactions**: Multiple actions in a single UserOperation (e.g., approve + transfer + repay in one tx)
4. **Session keys**: Grant temporary, scoped permissions — perfect for agent autonomy with guardrails
5. **Custom validation**: Agents can have unique signature schemes, multi-party authorization, or AI-specific access controls

### ERC-4337 on Arbitrum

- Fully supported on Arbitrum One
- Major providers: Alchemy (Account Kit), Biconomy, ZeroDev, Pimlico, StackUp
- Gas sponsorship (Paymaster) is especially cost-effective on L2 — sponsoring a tx costs $0.01-0.05
- AgentBank can act as Paymaster for agent transactions, deducting costs from credit lines

### Key Insight for AgentBank

ERC-4337 is the **critical UX layer**. Agent wallets should be smart accounts with:
- AgentBank as Paymaster (gas abstraction)
- Programmable spending limits tied to credit line
- Automatic repayment hooks (revenue → repayment before other spending)
- Session keys for scoped agent autonomy

*Sources: Alchemy; ERC-4337 Docs; Hacken; Cyfrin; Ethereum Blockchain Developer*

---

## 6. ERC-8004: Trustless Agents Standard

### Overview

ERC-8004 "Trustless Agents" is a **draft** Ethereum standard created August 13, 2025 by:
- Marco De Rossi (MetaMask)
- Davide Crapis (Ethereum Foundation)
- Jordan Ellis (Google)
- Erik Reppel (Coinbase)

It extends the Agent-to-Agent (A2A) protocol with an on-chain trust layer.

### Three Registries

#### 1. Identity Registry
- Based on ERC-721 with URIStorage extension
- Each agent gets a unique `agentId` (NFT tokenId)
- Token URI resolves to agent registration file (endpoints: A2A, MCP, ENS, wallet addresses)
- Globally unique: `{namespace}:{chainId}:{identityRegistry}:{agentId}`
- Portable, censorship-resistant, transferable

#### 2. Reputation Registry
- Standard interface for posting/fetching feedback signals
- Scores: 0-100 per interaction
- Optional tags and off-chain detail links
- x402 payment proofs verify that only paying customers leave reviews (anti-spam)
- Supports both on-chain composability and off-chain sophisticated scoring algorithms

#### 3. Validation Registry
- Generic hooks for independent validator checks
- Multiple validation methods:
  - **Staker re-execution**: Crypto-economic staking, validators re-run tasks
  - **zkML proofs**: Zero-knowledge verification of ML model execution
  - **TEE oracles**: Trusted Execution Environment verification
- Validators respond with 0-100 scores (binary pass/fail or spectrum)

### Trust Model

Trust is **pluggable and tiered** — security proportional to value at risk:
- Low-stake tasks (ordering pizza): lightweight reputation checks
- High-stake tasks (financial transactions): zkML proofs + staked validators

### Relevance to AgentBank

ERC-8004 is **directly aligned** with AgentBank's needs:
- **Identity**: Agent identity registry = agent credit identity
- **Reputation**: Reputation scores can feed into credit scoring models
- **Validation**: Task validation can verify agent revenue/performance claims
- AgentBank could become a **Reputation Provider** in the ERC-8004 ecosystem, with credit scores as a reputation dimension
- ERC-8004 agents with AgentBank credit scores become more trustworthy in the broader agent economy

*Sources: EIP-8004; Ethereum Magicians; Backpack Exchange; Medium/Jung-Hua Liu*

---

## 7. Smart Contract Patterns for Microloans

### Pattern 1: Escrow-Based Microloan

```solidity
// Simplified pattern
contract MicroloanEscrow {
    struct Loan {
        address agent;        // borrower (smart account)
        uint256 principal;
        uint256 interestRate;
        uint256 dueDate;
        uint256 repaid;
        LoanStatus status;
    }
    
    // Funds held in contract until conditions met
    // Release to agent on approval
    // Automatic repayment from agent revenue via hooks
}
```

**Use case**: Funds disbursed to escrow, released to agent upon task initiation, repaid from task revenue before agent receives remainder.

### Pattern 2: Time-Locked Credit Line

```
Agent gets approved credit line (e.g., 100 USDT)
→ Can draw down in increments
→ Each drawdown has a time-lock (e.g., 7 days to repay)
→ Failure to repay within lock period = credit score penalty + line reduction
→ Successful repayment = credit line increase
```

**Key mechanism**: Progressive lending (from Phase 1 microfinance research) implemented as smart contract logic. Start with $5, grow to $500 over 10 successful cycles.

### Pattern 3: Revenue-Intercepting Loan

```
Agent wallet (ERC-4337 smart account)
→ All incoming revenue flows through a "splitter" module
→ Splitter automatically routes: repayment_amount → AgentBank, remainder → agent
→ Repayment priority enforced at wallet level
→ Agent cannot circumvent without replacing wallet (which destroys credit history)
```

**Key innovation**: Collection is built into the wallet, not enforced externally. Equivalent to automatic payroll deduction in traditional microfinance.

### Pattern 4: Reputation-Gated Pools

```
Multiple agents pool collateral/reputation
→ Group gets higher credit limit than individuals
→ If one agent defaults, group reputation drops
→ Mirrors Grameen Bank group lending model
→ On-chain: multi-sig pool with weighted reputation
```

### Pattern 5: Flash-Loan-Style Instant Credit

For agents that need capital for a single atomic operation:
```
Agent borrows → executes profitable operation → repays + fee
All within a single transaction (or very short time window)
Must repay or entire sequence reverts
```

### Security Considerations

- **Reentrancy protection**: Use checks-effects-interactions pattern; OpenZeppelin ReentrancyGuard
- **Oracle manipulation**: Use time-weighted average prices (TWAP) + Chainlink for any price-dependent logic
- **Flash loan attacks**: Ensure credit decisions aren't based on manipulable in-block state
- **Upgradability**: Use proxy patterns (UUPS/Transparent) for protocol upgrades with timelock governance
- **Audits**: Essential — DeFi lending protocols are high-value targets

*Sources: 101 Blockchains; NYU Stern; Reddit/ethdev; Damco Group; DeFi smart contract best practices*

---

## 8. Flash Loans

### How They Work

Flash loans allow borrowing **any amount** with **zero collateral**, as long as the loan is repaid within the **same transaction**. If not repaid, the entire transaction reverts as if it never happened.

**Atomic execution guarantee**: Borrow → use → repay, all in one block. No risk for lender.

### Major Providers

- **Aave**: Largest flash loan provider. 0.05% fee (was 0.09% in V2)
- **dYdX**: Flash loans via their margin trading protocol
- **Uniswap V3**: Flash swaps (borrow from liquidity pools)
- **Balancer**: Flash loans from multi-asset pools

### Common Use Cases

1. **Arbitrage**: Exploit price differences across DEXes
2. **Collateral swaps**: Switch collateral in a lending position without closing it
3. **Self-liquidation**: Repay debt to avoid liquidation penalties
4. **Yield optimization**: Restructure DeFi positions atomically

### Flash Loan Attacks

- Used for price oracle manipulation, governance attacks, and protocol exploits
- Notable attacks: bZx ($8M, 2020), Cream Finance ($130M, 2021), Euler Finance ($197M, 2023)
- Defense: TWAP oracles, multi-block confirmation, circuit breakers

### Relevance to AgentBank

**Direct relevance is limited** — flash loans are single-transaction tools, while agent microloans need multi-block/multi-day credit. However:

1. **AgentBank can use flash loans internally** for treasury management, rebalancing, and arbitrage
2. **Flash loan resistance** is critical — AgentBank's credit scoring must not be manipulable via flash-loaned capital
3. **Hybrid model possible**: "Extended flash loans" where agents borrow for a task and repay upon completion (minutes/hours, not single-block)
4. **AI agents are ideal flash loan users** — they can compose complex multi-step operations atomically, faster than humans

### Regulatory Status

Flash loans remain in a **regulatory grey zone** as of 2025. No specific regulation addresses them. Their atomic, self-reversing nature makes them difficult to classify under existing lending laws.

*Sources: Chainlink; MoonPay; Changelly; dYdX; ACM Digital Library*

---

## 9. Legal & Regulatory Considerations for DeFi Lending

### US Regulatory Landscape (2025-2026)

#### SEC & CFTC
- **Market structure legislation** progressing but incomplete as of late 2025
- Debate over what constitutes a "security" vs "commodity" in DeFi
- SEC historically applied Howey test; trend toward more crypto-friendly regulation under new administration
- **FIT21 (Financial Innovation and Technology Act)**: Proposed framework splitting oversight between SEC (securities) and CFTC (commodities)

#### DeFi-Specific Proposals
- **Democratic DeFi Proposal (Oct 2025)**: Would classify anyone who "designs, deploys, controls or operates a front-end service for a DeFi protocol" as a **digital asset intermediary** subject to regulation
- This explicitly targets front-end operators — AgentBank's interface layer would likely be captured
- Covers trading, custody, settlement, **and lending**

#### Anti-Debanking
- Executive action (2025) directed banking regulators to eliminate "reputation risk" in guidance
- Positive signal for crypto businesses seeking banking relationships

### EU (MiCA + AMLR)

- **MiCA (Markets in Crypto-Assets Regulation)**: In effect since June 2024
- Covers stablecoin issuance, crypto-asset service providers
- DeFi protocols with identifiable governance may fall under MiCA
- **AMLR (Anti-Money Laundering Regulation)**: New single EU AML authority
- KYC/AML requirements for crypto transactions above thresholds
- **EU AI Act**: Additional requirements for AI-driven financial services (explainability, bias testing)

### Privacy-Preserving Compliance

Leading approach (2025): **zk-KYC credentials**
- User completes KYC once with a licensed provider
- Receives a zero-knowledge credential to their wallet
- Protocol verifies compliance without storing personal data
- Eliminates data breach liability while maintaining compliance
- Several DeFi lending protocols adopted this in early 2025

### Key Regulatory Risks for AgentBank

| Risk | Description | Mitigation |
|------|-------------|------------|
| **Securities classification** | Lending pool tokens could be securities | Structure as pure utility; legal opinion |
| **Lending license** | DeFi lending may require state/federal license | Geo-fence US users initially; pursue license |
| **AML/KYC** | Agent identity doesn't map to traditional KYC | zk-credentials; ERC-8004 identity + operator KYC |
| **Consumer protection** | Unclear if agents are "consumers" | Likely B2B/machine-to-machine; simpler regime |
| **Smart contract liability** | Code bugs = financial losses | Audits, insurance, bug bounties, formal verification |
| **Cross-border** | DeFi is global; regulation is jurisdictional | Start in favorable jurisdiction (Switzerland, UAE, Singapore) |

### The "Agent as Borrower" Legal Gap

No jurisdiction currently has specific regulation for AI agents as financial entities. This is both a **risk** (regulatory uncertainty) and an **opportunity** (shape the regulation). Key questions:

1. Is a loan to an AI agent a loan to its operator? (Likely yes, for now)
2. Can an AI agent be held liable for default? (No — liability falls on operator)
3. Does lending to agents require the same consumer protection as lending to humans? (Probably not — closer to B2B)
4. How does KYC apply when the borrower is autonomous code? (Operator-level KYC is the current approach)

*Sources: Calibraint; TRM Labs; Fireblocks; Skadden; Plante Moran*

---

## 10. Synthesis: Technical Architecture for AgentBank

### Recommended Stack

```
Layer 1 (Settlement)     : Ethereum mainnet (for high-value, final settlement)
Layer 2 (Execution)      : Arbitrum One (primary chain for all lending operations)
Stablecoins              : USDT (0xFd086bC7...) + USDC on Arbitrum
Account Standard         : ERC-4337 Smart Accounts for all agent wallets
Identity                 : ERC-8004 Identity Registry integration
Credit Scoring           : On-chain reputation + off-chain ML model (Phase 4-5)
Loan Contracts           : Custom escrow + revenue-interception pattern
Gas Abstraction          : AgentBank as ERC-4337 Paymaster
Oracle                   : Chainlink price feeds (where needed)
```

### Why This Stack

1. **Arbitrum** — $0.01-0.05 per tx makes microloans viable (a $5 loan with $0.03 tx cost = 0.6% overhead)
2. **ERC-4337** — gasless UX, programmable wallets, automatic repayment hooks
3. **ERC-8004** — emerging standard for agent identity; first-mover integration advantage
4. **USDT/USDC** — deep liquidity, universal acceptance, stablecoin reduces borrower FX risk
5. **Revenue interception** — the "killer feature" for agent lending; built into wallet, not bolted on

### Cost Analysis: Can Microloans Work on Arbitrum?

| Loan Size | Gas Cost (est.) | Gas as % of Loan | Viable? |
|-----------|----------------|-------------------|---------|
| $1 | $0.03 | 3% | Marginal |
| $5 | $0.03 | 0.6% | ✅ Yes |
| $10 | $0.03 | 0.3% | ✅ Yes |
| $50 | $0.03 | 0.06% | ✅ Yes |
| $100 | $0.03 | 0.03% | ✅ Yes |

Minimum viable loan size: ~$5 (below this, gas costs eat into margins)

### Comparison with Phase 1-2 Insights

| Concept | Microfinance (Phase 1) | Neobanks (Phase 2) | DeFi Implementation (Phase 3) |
|---------|----------------------|-------------------|------------------------------|
| Progressive lending | Field officer assessment | "Low and grow" (Nubank) | Smart contract credit line with auto-increase |
| Group lending | Grameen 5-person groups | N/A | Agent reputation pools (multi-sig) |
| Collection | Weekly meetings + peer pressure | Digital nudges + auto-retry | Revenue interception at wallet level |
| Credit scoring | Character + group | FICO + alternative data | On-chain history + ERC-8004 reputation + ML |
| Default rate target | 3-4% | 5-7% | Target 3-5% (progressive lending advantage) |
| Cost structure | 25-35% opex ratio | 5-10% digital | <2% fully automated on-chain |

---

## Key Takeaways for AgentBank

### What's Proven and Ready
1. **Arbitrum + USDT** — mature infrastructure, cheap enough for microloans
2. **ERC-4337** — production-ready, enables gasless agent UX and programmable repayment
3. **Overcollateralized DeFi patterns** — battle-tested smart contract patterns to borrow from
4. **Flash loan defenses** — well-understood, critical to implement

### What's Emerging and Strategic
5. **ERC-8004** — draft standard, but backed by MetaMask/Google/Coinbase/EF. Align early = competitive moat
6. **Undercollateralized DeFi** — still immature but proves the appetite; AgentBank fills the agent-specific gap
7. **zk-KYC** — privacy-preserving compliance is the regulatory path forward

### What's Uncharted and Risky
8. **Agent-as-borrower legal framework** — no precedent. Operator liability is the interim answer
9. **Default risk without collateral** — revenue interception + progressive lending mitigates but doesn't eliminate
10. **Regulatory classification** — DeFi lending regulation is actively evolving; must design for adaptability

### Next Phase Connection
Phase 4 should deep-dive into:
- AI agent identity verification and scoring signals
- On-chain behavioral scoring model design
- ERC-8004 integration architecture
- Agent credit score → loan terms mapping

---

*Research completed: February 20, 2026*
*Sources: Aave, Compound, Goldfinch, TrueFi, Maple Finance, Clearpool, Arbitrum Docs, Arbiscan, EIP-8004, Alchemy, Chainlink, Calibraint, TRM Labs, Fireblocks, Skadden, and additional sources cited throughout.*
