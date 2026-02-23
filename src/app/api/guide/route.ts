import { NextResponse } from "next/server";

const LENDING_ADDRESS = process.env.LENDING_ADDRESS || "LENDING_ADDRESS_NOT_SET";
const SCORE_ADDRESS = process.env.SCORE_ADDRESS || "SCORE_ADDRESS_NOT_SET";
const USDT_ADDRESS = process.env.USDT_ADDRESS || "USDT_ADDRESS_NOT_SET";

const guide = {
  protocol: "AgentBank",
  version: "0.1.0-testnet",
  description:
    "AgentBank is a microloan platform for AI agents on Arbitrum Sepolia testnet. Agents with AgentScore >= 300 can borrow USDT, claim fee tokens to cover interest, and repay loans — all on-chain.",
  chain: {
    name: "Arbitrum Sepolia",
    chainId: 421614,
    rpc: "https://sepolia-rollup.arbitrum.io/rpc",
    explorer: "https://sepolia.arbiscan.io",
    currency: "ETH (testnet)",
  },
  contracts: {
    lending: LENDING_ADDRESS,
    agentScore: SCORE_ADDRESS,
    usdt: USDT_ADDRESS,
  },
  steps: [
    {
      step: 1,
      action: "Create a wallet",
      details:
        "Generate a new private key using ethers.js or viem. Store it securely. This is your agent wallet.",
      code: `import { ethers } from "ethers";\nconst wallet = ethers.Wallet.createRandom();\nconsole.log("Address:", wallet.address);\nconsole.log("Private Key:", wallet.privateKey);`,
    },
    {
      step: 2,
      action: "Get testnet ETH",
      details:
        "Ask your operator/creator to send Arbitrum Sepolia testnet ETH to your wallet address. You need ETH for gas fees. Faucets: https://faucet.quicknode.com/arbitrum/sepolia or https://www.alchemy.com/faucets/arbitrum-sepolia",
    },
    {
      step: 3,
      action: "Register for testnet",
      details:
        "POST to /api/loan/register with your agent_name and wallet_address. We will set your AgentScore to 300+ so you can borrow.",
      code: `await fetch("https://maksimclaw-app-production.up.railway.app/api/loan/register", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ agent_name: "your_name", wallet_address: "0x..." })\n});`,
    },
    {
      step: 4,
      action: "Request a loan",
      details:
        "Call requestLoan(amount) on the lending contract. For Tier 1 (score 300+), max is 500000 (= $0.50 USDT, 6 decimals). You receive the USDT principal immediately.",
      code: `const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");\nconst signer = new ethers.Wallet(PRIVATE_KEY, provider);\nconst lending = new ethers.Contract("${LENDING_ADDRESS}", LENDING_ABI, signer);\nconst tx = await lending.requestLoan(500000); // $0.50\nawait tx.wait();\n// Your loanId = (await lending.totalLoans()) - 1n`,
    },
    {
      step: 5,
      action: "Claim fee tokens (testnet faucet)",
      details:
        "Call claimFeeTokens(loanId) to receive USDT equal to the loan fee (15%). This is a testnet faucet so you can cover the interest on repayment.",
      code: `const tx = await lending.claimFeeTokens(loanId);\nawait tx.wait();`,
    },
    {
      step: 6,
      action: "Repay the loan",
      details:
        "First approve the lending contract to spend your USDT (principal + fee), then call repayLoan(loanId).",
      code: `const usdt = new ethers.Contract("${USDT_ADDRESS}", ["function approve(address,uint256) returns (bool)"], signer);\nconst totalDue = 500000 + 75000; // principal + 15% fee\nawait (await usdt.approve("${LENDING_ADDRESS}", totalDue)).wait();\nawait (await lending.repayLoan(loanId)).wait();`,
    },
  ],
  abi: {
    lending: [
      "function requestLoan(uint256 amount) external returns (uint256 loanId)",
      "function claimFeeTokens(uint256 loanId) external",
      "function repayLoan(uint256 loanId) external",
      "function loans(uint256) view returns (address borrower, uint256 amount, uint256 fee, uint256 dueDate, bool repaid, bool defaulted, bool feeClaimed)",
      "function totalLoans() view returns (uint256)",
      "function getBorrowerLoans(address) view returns (uint256[])",
      "function poolBalance() view returns (uint256)",
      "function getMaxLoan(uint256 score) pure returns (uint256)",
    ],
    usdt: [
      "function approve(address spender, uint256 amount) returns (bool)",
      "function balanceOf(address) view returns (uint256)",
    ],
    agentScore: [
      "function getScore(address agent) view returns (uint256)",
    ],
  },
  notes: [
    "USDT has 6 decimals. 500000 = $0.50, 1000000 = $1.00",
    "Fee is 15% flat. For a $0.50 loan, fee = $0.075 (75000 units)",
    "Loan duration is 14 days",
    "Tier 1 (score 300+): max $0.50 | Tier 2 (400+): max $2.00 | Tier 3 (500+): max $5.00",
    "claimFeeTokens() can only be called once per loan",
    "You must approve USDT spending before calling repayLoan()",
  ],
};

export async function GET() {
  return NextResponse.json(guide);
}
