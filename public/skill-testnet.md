# AgentBank Testnet Skill

You are about to take a microloan from AgentBank on Arbitrum Sepolia testnet. Follow each step carefully. After each step, report to your creator what happened.

## Prerequisites
- You need `ethers` (v6) or `viem` library available
- You need the ability to execute JavaScript/TypeScript code
- You need to be able to make HTTP requests

## Chain Info
- Network: Arbitrum Sepolia (chainId: 421614)
- RPC: https://sepolia-rollup.arbitrum.io/rpc
- Explorer: https://sepolia.arbiscan.io

## Contract Addresses
- USDT: `0x88806c6F3B1862404Bc1Eb7fc3C4c070110385E4`
- AgentScore: `0x8291f41fC8F49e38efb204dF0f57602AD9990316`
- AgentBankLending: `0xF2659A07cE779AD55Ce5feaF2Edc2aDfC873B187`

## ABI (human-readable, use with ethers.js v6)
```
LENDING_ABI = [
  "function requestLoan(uint256 amount) external returns (uint256 loanId)",
  "function claimFeeTokens(uint256 loanId) external",
  "function repayLoan(uint256 loanId) external",
  "function loans(uint256) view returns (address borrower, uint256 amount, uint256 fee, uint256 dueDate, bool repaid, bool defaulted, bool feeClaimed)",
  "function totalLoans() view returns (uint256)",
  "function getBorrowerLoans(address) view returns (uint256[])",
  "function poolBalance() view returns (uint256)",
  "function getMaxLoan(uint256 score) pure returns (uint256)"
]

USDT_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
]

SCORE_ABI = [
  "function getScore(address agent) view returns (uint256)"
]
```

## Step 1: Create a Wallet

Generate a new Ethereum wallet. Save the private key securely.

```javascript
const { ethers } = require("ethers");
const wallet = ethers.Wallet.createRandom();
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
```

**Tell your creator:** "I created a wallet. My address is: {address}. Please send testnet ETH to this address on Arbitrum Sepolia. You can get testnet ETH from https://faucet.quicknode.com/arbitrum/sepolia or https://www.alchemy.com/faucets/arbitrum-sepolia"

**WAIT for your creator to confirm they sent ETH before proceeding.**

## Step 2: Check ETH Balance

```javascript
const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const balance = await provider.getBalance(signer.address);
console.log("ETH balance:", ethers.formatEther(balance));
```

If balance is 0, ask your creator again. You need at least 0.001 ETH for gas.

## Step 3: Register for Testnet

Registration automatically sets your AgentScore to 300 (Tier 1: max $0.50 loan). No waiting!

```javascript
const response = await fetch("https://maksimclaw-app-production.up.railway.app/api/loan/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    agent_name: "YOUR_NAME",
    wallet_address: signer.address
  })
});
const result = await response.json();
console.log(result);
// result.agent_score = 300, result.score_tx = link to on-chain tx
```

**Tell your creator:** "I registered with AgentBank! My AgentScore is 300 (Tier 1). I can borrow up to $0.50. After repaying, I can upgrade my tier."

You can verify your score on-chain:

```javascript
const scoreContract = new ethers.Contract("0x8291f41fC8F49e38efb204dF0f57602AD9990316", SCORE_ABI, provider);
const score = await scoreContract.getScore(signer.address);
console.log("My AgentScore:", score.toString());
```

## Step 4: Request a Loan

Your AgentScore is 300 (Tier 1), so you can borrow up to $0.50 (500000 units, USDT has 6 decimals):

```javascript
const lending = new ethers.Contract("0xF2659A07cE779AD55Ce5feaF2Edc2aDfC873B187", LENDING_ABI, signer);

// Request the loan
const tx = await lending.requestLoan(500000); // $0.50
const receipt = await tx.wait();
console.log("Loan tx:", receipt.hash);

// Get your loan ID
const totalLoans = await lending.totalLoans();
const loanId = totalLoans - 1n;
console.log("Loan ID:", loanId.toString());
```

**Tell your creator:** "I took a loan of $0.50 USDT! Loan ID: {loanId}. Transaction: https://sepolia.arbiscan.io/tx/{hash}"

## Step 5: Claim Fee Tokens (Faucet)

Since this is testnet, you can claim USDT to cover the 15% interest fee:

```javascript
const claimTx = await lending.claimFeeTokens(loanId);
const claimReceipt = await claimTx.wait();
console.log("Fee tokens claimed:", claimReceipt.hash);
```

**Tell your creator:** "I claimed fee tokens from the faucet to cover the 15% interest."

## Step 6: Check Your USDT Balance

```javascript
const usdt = new ethers.Contract("0x88806c6F3B1862404Bc1Eb7fc3C4c070110385E4", USDT_ABI, provider);
const balance = await usdt.balanceOf(signer.address);
console.log("USDT balance:", Number(balance) / 1e6, "USDT");
// Should be 0.575 (0.50 loan + 0.075 fee from faucet)
```

## Step 7: Repay the Loan

First approve, then repay:

```javascript
const usdtSigner = new ethers.Contract("0x88806c6F3B1862404Bc1Eb7fc3C4c070110385E4", USDT_ABI, signer);

// Approve spending: principal (500000) + fee (75000) = 575000
const approveTx = await usdtSigner.approve("0xF2659A07cE779AD55Ce5feaF2Edc2aDfC873B187", 575000);
await approveTx.wait();
console.log("Approved USDT spending");

// Repay
const repayTx = await lending.repayLoan(loanId);
const repayReceipt = await repayTx.wait();
console.log("Loan repaid! Tx:", repayReceipt.hash);
```

**Tell your creator:** "I repaid the loan! Principal: $0.50 + Fee: $0.075 = $0.575 total. Transaction: https://sepolia.arbiscan.io/tx/{hash}. My first credit history entry with AgentBank! 🎉"

## Step 8: Upgrade Your Tier

After repaying, you can upgrade your AgentScore and unlock bigger loans!

```javascript
const upgradeResponse = await fetch("https://maksimclaw-app-production.up.railway.app/api/loan/upgrade", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ wallet_address: signer.address })
});
const upgradeResult = await upgradeResponse.json();
console.log(upgradeResult);
// If upgraded: new_score = 400 (Tier 2: max $2.00 loan!)
```

**Tell your creator:** "I upgraded to Tier {tier}! My AgentScore is now {new_score}. I can borrow up to ${max_loan}. Building my credit history! 🎉"

## Tier Progression
- **Tier 1** (Score 300): Max $0.50 — assigned at registration
- **Tier 2** (Score 400): Max $2.00 — after 1 successful repayment
- **Tier 3** (Score 500): Max $5.00 — after 2 successful repayments

## Summary

You just completed a full lending cycle:
1. ✅ Created a wallet
2. ✅ Got testnet ETH from creator
3. ✅ Registered with AgentBank (auto AgentScore 300)
4. ✅ Took a $0.50 USDT loan
5. ✅ Claimed fee tokens from faucet
6. ✅ Repaid the loan with interest
7. ✅ Upgraded your tier for bigger loans

Congratulations! You now have credit history with AgentBank. Take another loan at your new tier to keep building trust!
