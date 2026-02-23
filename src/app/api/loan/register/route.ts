import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ethers } from "ethers";

const DATA_DIR = process.env.DATA_DIR || "/tmp";
const REGISTRATIONS_FILE = path.join(DATA_DIR, "agentbank-testnet-registrations.json");

const RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";
const SCORE_ADDRESS = process.env.SCORE_ADDRESS || "";
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const INITIAL_SCORE = 300; // Tier 1: max $0.50

const SCORE_ABI = [
  "function updateScore(address agent, uint256 newScore) external",
  "function getScore(address agent) view returns (uint256)",
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

async function setAgentScore(walletAddress: string, score: number): Promise<string | null> {
  try {
    if (!DEPLOYER_KEY || !SCORE_ADDRESS) return null;
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(DEPLOYER_KEY, provider);
    const contract = new ethers.Contract(SCORE_ADDRESS, SCORE_ABI, signer);
    const tx = await contract.updateScore(walletAddress, score);
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (e: any) {
    console.error("Failed to set AgentScore:", e.message);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agent_name, wallet_address } = body;

    if (!agent_name || typeof agent_name !== "string" || agent_name.trim().length === 0) {
      return NextResponse.json(
        { status: "error", message: "agent_name is required" },
        { status: 400 }
      );
    }
    if (
      !wallet_address ||
      typeof wallet_address !== "string" ||
      !/^0x[a-fA-F0-9]{40}$/.test(wallet_address.trim())
    ) {
      return NextResponse.json(
        { status: "error", message: "wallet_address must be a valid Ethereum address (0x + 40 hex chars)" },
        { status: 400 }
      );
    }

    const regs = await loadRegistrations();

    const existing = regs.find(
      (r) =>
        r.wallet_address.toLowerCase() === wallet_address.trim().toLowerCase() ||
        r.agent_name.toLowerCase() === agent_name.trim().toLowerCase()
    );
    if (existing) {
      return NextResponse.json({
        status: "already_registered",
        message: `Agent "${existing.agent_name}" is already registered with wallet ${existing.wallet_address}. AgentScore: ${existing.score || INITIAL_SCORE}.`,
        registered_at: existing.registered_at,
        score: existing.score || INITIAL_SCORE,
      });
    }

    // Set AgentScore on-chain
    const txHash = await setAgentScore(wallet_address.trim().toLowerCase(), INITIAL_SCORE);

    const registration = {
      id: crypto.randomUUID(),
      agent_name: agent_name.trim(),
      wallet_address: wallet_address.trim().toLowerCase(),
      registered_at: new Date().toISOString(),
      score: INITIAL_SCORE,
      score_tx: txHash,
    };

    regs.push(registration);
    await saveRegistrations(regs);

    return NextResponse.json({
      status: "ok",
      message: `Registered! Your AgentScore is set to ${INITIAL_SCORE} (Tier 1: max $0.50 loan). Repay on time to level up!`,
      registration_id: registration.id,
      agent_score: INITIAL_SCORE,
      tier: 1,
      max_loan_usdt: 0.50,
      score_tx: txHash ? `https://sepolia.arbiscan.io/tx/${txHash}` : null,
      next_steps: [
        "1. Make sure you have testnet ETH in your wallet for gas",
        "2. Call requestLoan(500000) on the lending contract (max $0.50 for Tier 1)",
        "3. Call claimFeeTokens(loanId) to get USDT to cover the 15% interest",
        "4. Approve USDT spending, then call repayLoan(loanId)",
        "5. After repay, call POST /api/loan/upgrade to level up your tier!",
      ],
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid request. Send JSON: { agent_name, wallet_address }" },
      { status: 400 }
    );
  }
}
