import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ethers } from "ethers";

const DATA_DIR = process.env.DATA_DIR || "/tmp";
const REGISTRATIONS_FILE = path.join(DATA_DIR, "agentbank-testnet-registrations.json");

const RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";
const SCORE_ADDRESS = process.env.SCORE_ADDRESS || "";
const LENDING_ADDRESS = process.env.LENDING_ADDRESS || "";
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";

const SCORE_ABI = [
  "function updateScore(address agent, uint256 newScore) external",
  "function getScore(address agent) view returns (uint256)",
];

const LENDING_ABI = [
  "function getBorrowerLoans(address) view returns (uint256[])",
  "function loans(uint256) view returns (address borrower, uint256 amount, uint256 fee, uint256 dueDate, bool repaid, bool defaulted, bool feeClaimed)",
];

// Score tiers: 300 (Tier1 $0.50), 400 (Tier2 $2), 500 (Tier3 $5)
const TIER_SCORES = [300, 400, 500];
const TIER_INFO = [
  { tier: 1, score: 300, max_loan: 0.50 },
  { tier: 2, score: 400, max_loan: 2.00 },
  { tier: 3, score: 500, max_loan: 5.00 },
];

async function loadRegistrations(): Promise<any[]> {
  try {
    const data = await fs.readFile(REGISTRATIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveRegistrations(regs: any[]) {
  await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(regs, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet_address } = body;

    if (!wallet_address || !/^0x[a-fA-F0-9]{40}$/.test(wallet_address.trim())) {
      return NextResponse.json(
        { status: "error", message: "wallet_address is required (0x + 40 hex chars)" },
        { status: 400 }
      );
    }

    const addr = wallet_address.trim().toLowerCase();

    if (!DEPLOYER_KEY || !SCORE_ADDRESS || !LENDING_ADDRESS) {
      return NextResponse.json(
        { status: "error", message: "Server not configured for on-chain operations" },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(DEPLOYER_KEY, provider);
    const scoreContract = new ethers.Contract(SCORE_ADDRESS, SCORE_ABI, signer);
    const lendingContract = new ethers.Contract(LENDING_ADDRESS, LENDING_ABI, provider);

    // Get current score
    const currentScore = Number(await scoreContract.getScore(addr));

    // Get all loans for this borrower
    const loanIds = await lendingContract.getBorrowerLoans(addr);
    
    let repaidOnTime = 0;
    let totalLoans = loanIds.length;
    let defaulted = 0;

    for (const id of loanIds) {
      const loan = await lendingContract.loans(id);
      if (loan.repaid) repaidOnTime++;
      if (loan.defaulted) defaulted++;
    }

    if (totalLoans === 0) {
      return NextResponse.json({
        status: "no_loans",
        message: "You have no loans yet. Take a loan first, repay it, then come back for an upgrade!",
        current_score: currentScore,
      });
    }

    if (repaidOnTime === 0) {
      return NextResponse.json({
        status: "no_repayments",
        message: "You haven't repaid any loans yet. Repay your current loan to qualify for an upgrade.",
        current_score: currentScore,
        total_loans: totalLoans,
      });
    }

    // Calculate new tier based on repaid loans
    // Start at Tier 1 (index 0), upgrade per successful repay
    const tierIndex = Math.min(repaidOnTime, TIER_SCORES.length - 1);
    const newScore = TIER_SCORES[tierIndex];

    if (newScore <= currentScore) {
      const currentTierInfo = TIER_INFO.find(t => t.score <= currentScore) || TIER_INFO[TIER_INFO.length - 1];
      return NextResponse.json({
        status: "already_max",
        message: `You're already at Tier ${currentTierInfo.tier} (score ${currentScore}). ${currentScore >= 500 ? "Max tier reached!" : `Need more repayments to level up.`}`,
        current_score: currentScore,
        repaid_loans: repaidOnTime,
        total_loans: totalLoans,
      });
    }

    // Upgrade on-chain
    const tx = await scoreContract.updateScore(addr, newScore);
    const receipt = await tx.wait();

    // Update local registration
    const regs = await loadRegistrations();
    const reg = regs.find(r => r.wallet_address === addr);
    if (reg) {
      reg.score = newScore;
      reg.last_upgrade = new Date().toISOString();
      reg.upgrade_tx = receipt.hash;
      await saveRegistrations(regs);
    }

    const newTierInfo = TIER_INFO.find(t => t.score === newScore)!;

    return NextResponse.json({
      status: "upgraded",
      message: `🎉 Congratulations! Upgraded to Tier ${newTierInfo.tier}! Your new AgentScore is ${newScore}. Max loan: $${newTierInfo.max_loan}.`,
      previous_score: currentScore,
      new_score: newScore,
      tier: newTierInfo.tier,
      max_loan_usdt: newTierInfo.max_loan,
      repaid_loans: repaidOnTime,
      total_loans: totalLoans,
      upgrade_tx: `https://sepolia.arbiscan.io/tx/${receipt.hash}`,
    });
  } catch (e: any) {
    console.error("Upgrade error:", e.message);
    return NextResponse.json(
      { status: "error", message: "Failed to process upgrade. Try again later." },
      { status: 500 }
    );
  }
}
