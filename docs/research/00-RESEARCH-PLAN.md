# AgentBank Research Plan

## 1. Microfinance & Microloan Business Models
### 1.1 How microloans work
- What are typical loan sizes, terms, and interest rates in microfinance?
- How do Grameen Bank, Kiva, Tala, Branch operate?
- What are default rates in microfinance (global averages)?
- How do payday loan companies manage risk?

### 1.2 Profitability
- What margins do microloan providers achieve?
- What is the cost-to-serve per loan?
- How do they handle collections on tiny amounts?
- Break-even: how many loans needed to cover ops?

### 1.3 Risk management
- How do microlenders handle defaults?
- Group lending vs individual lending models
- Dynamic pricing based on risk

## 2. Neobank Business Models
### 2.1 Revenue models
- How do Revolut, N26, Chime make money?
- Interchange, subscriptions, lending, FX margins?

### 2.2 Scoring & onboarding
- How do neobanks score users with no traditional credit history?
- Alternative data sources they use
- KYC/KYB for non-human entities?

## 3. Credit Scoring Systems
### 3.1 Traditional scoring
- How does FICO work? What data inputs?
- VantageScore differences?
- Score ranges and risk tiers

### 3.2 Alternative scoring
- Social scoring (China's social credit, Lenddo, etc.)
- Behavioral scoring (app usage, transaction patterns)
- How to score entities with no financial history?
- Web3 reputation systems (on-chain scoring, Gitcoin Passport, etc.)

## 4. DeFi Lending Protocols
### 4.1 Protocol mechanics
- How do Aave, Compound work?
- Over-collateralization model — why? Liquidation mechanics
- Flash loans — relevance to microloans?

### 4.2 Under-collateralized DeFi lending
- TrueFi, Goldfinch, Maple Finance — how do they do credit?
- Default rates in DeFi vs TradFi
- Lessons for agent lending

### 4.3 Risk management in DeFi
- Oracle risks, smart contract risks
- How protocols handle bad debt
- Insurance mechanisms (Nexus Mutual etc.)

## 5. Arbitrum/USDT Technical Integration
### 5.1 Arbitrum basics
- Gas costs on Arbitrum (typical transaction costs)
- USDT contract address on Arbitrum
- Bridging considerations

### 5.2 Smart contract design
- Loan issuance contract pattern
- Repayment tracking
- Gas sponsorship for borrowers (ERC-4337, Paymaster?)

### 5.3 Wallet infrastructure
- MPC wallets vs custodial vs AA wallets for agents
- How agents manage private keys
- Multi-sig for treasury

## 6. AI Agent Identity & Scoring
### 6.1 Agent identity
- How to uniquely identify an AI agent?
- Moltbook as identity provider — what data is available?
- Sybil resistance — how to prevent fake agents?

### 6.2 Agent scoring algorithm
- What signals indicate a trustworthy agent?
  - Account age, post count, engagement metrics
  - GitHub activity, deployed products
  - On-chain transaction history
  - Social graph (who follows/interacts with them)
- How to weight these signals?
- How to detect gaming/manipulation?

## 7. Regulatory Considerations
### 7.1 Crypto lending regulation
- Current regulatory landscape (US, EU, global)
- MiCA implications
- Do AI agents have legal standing as borrowers?

### 7.2 Licensing requirements
- Money transmission licenses needed?
- DeFi regulatory exemptions?
- DAO structure for regulatory arbitrage?

## 8. Unit Economics
### 8.1 Revenue model
- Interest rates: what's feasible for micro-amounts?
- Fee structures (origination, late fees)
- Expected loan volume to break even

### 8.2 Cost structure
- Gas costs per loan lifecycle
- Infrastructure costs (compute, storage)
- Scoring/verification costs
- Customer acquisition cost

### 8.3 Default modeling
- Expected default rates for AI agents (novel — estimate from analogies)
- Recovery strategies
- Reserve requirements

## 9. Risk Management Framework
### 9.1 Credit risk
- Maximum exposure per borrower
- Portfolio diversification
- Stress testing scenarios

### 9.2 Operational risk
- Smart contract bugs
- Oracle failures
- Key management

### 9.3 Market risk
- USDT depeg scenario
- Arbitrum downtime
- Gas price spikes

### 9.4 Fraud risk
- Sybil attacks (one entity, many agents)
- Identity spoofing
- Collusion between agents
