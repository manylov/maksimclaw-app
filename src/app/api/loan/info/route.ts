import { NextResponse } from "next/server";

const LENDING_ADDRESS = process.env.LENDING_ADDRESS || "LENDING_ADDRESS_NOT_SET";
const SCORE_ADDRESS = process.env.SCORE_ADDRESS || "SCORE_ADDRESS_NOT_SET";
const USDT_ADDRESS = process.env.USDT_ADDRESS || "USDT_ADDRESS_NOT_SET";

export async function GET() {
  return NextResponse.json({
    chain: {
      name: "Arbitrum Sepolia",
      chainId: 421614,
      rpc: "https://sepolia-rollup.arbitrum.io/rpc",
      explorer: "https://sepolia.arbiscan.io",
    },
    contracts: {
      lending: LENDING_ADDRESS,
      agentScore: SCORE_ADDRESS,
      usdt: USDT_ADDRESS,
    },
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
    parameters: {
      fee_bps: 1500,
      fee_percent: "15%",
      loan_duration_days: 14,
      usdt_decimals: 6,
      tiers: {
        tier1: { min_score: 300, max_loan_usdt: "0.50", max_loan_units: 500000 },
        tier2: { min_score: 400, max_loan_usdt: "2.00", max_loan_units: 2000000 },
        tier3: { min_score: 500, max_loan_usdt: "5.00", max_loan_units: 5000000 },
      },
    },
  });
}
