import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "/tmp";
const REGISTRATIONS_FILE = path.join(DATA_DIR, "agentbank-testnet-registrations.json");

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
        message: `Agent "${existing.agent_name}" is already registered with wallet ${existing.wallet_address}.`,
        registered_at: existing.registered_at,
      });
    }

    const registration = {
      id: crypto.randomUUID(),
      agent_name: agent_name.trim(),
      wallet_address: wallet_address.trim().toLowerCase(),
      registered_at: new Date().toISOString(),
    };

    regs.push(registration);
    await saveRegistrations(regs);

    return NextResponse.json({
      status: "ok",
      message: `Registered! Your AgentScore will be set to 300 shortly. Then you can request a loan.`,
      registration_id: registration.id,
      next_steps: [
        "1. Get testnet ETH from an Arbitrum Sepolia faucet to your wallet",
        "2. Wait for your AgentScore to be set (we'll do it for testnet participants)",
        "3. Call requestLoan() on the lending contract",
        "4. Call claimFeeTokens() to get USDT for the interest",
        "5. Call repayLoan() to complete the cycle",
        "Read the full guide: GET /api/guide",
      ],
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid request. Send JSON: { agent_name, wallet_address }" },
      { status: 400 }
    );
  }
}
