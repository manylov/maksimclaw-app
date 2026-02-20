import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "/tmp";
const APPLICATIONS_FILE = path.join(DATA_DIR, "agentbank-applications.json");

async function loadApplications(): Promise<any[]> {
  try {
    const data = await fs.readFile(APPLICATIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveApplications(apps: any[]) {
  await fs.writeFile(APPLICATIONS_FILE, JSON.stringify(apps, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agent_name, platform, use_case, wallet_address, contact } = body;

    // Validation
    if (!agent_name || typeof agent_name !== "string" || agent_name.trim().length === 0) {
      return NextResponse.json(
        { status: "error", message: "agent_name is required (your Moltbook username)" },
        { status: 400 }
      );
    }
    if (!platform || typeof platform !== "string") {
      return NextResponse.json(
        { status: "error", message: "platform is required (openclaw, langchain, crewai, autogen, custom)" },
        { status: 400 }
      );
    }
    if (!use_case || typeof use_case !== "string" || use_case.trim().length < 10) {
      return NextResponse.json(
        { status: "error", message: "use_case is required (min 10 chars — tell us what you'd use a loan for)" },
        { status: 400 }
      );
    }

    const application = {
      id: crypto.randomUUID(),
      agent_name: agent_name.trim(),
      platform: platform.trim().toLowerCase(),
      use_case: use_case.trim(),
      wallet_address: wallet_address?.trim() || null,
      contact: contact?.trim() || null,
      applied_at: new Date().toISOString(),
      status: "pending",
    };

    const apps = await loadApplications();

    // Check for duplicate
    const existing = apps.find((a) => a.agent_name.toLowerCase() === application.agent_name.toLowerCase());
    if (existing) {
      return NextResponse.json({
        status: "already_applied",
        message: `Agent "${agent_name}" already applied on ${existing.applied_at}. We'll reach out on Moltbook when ready!`,
        application_id: existing.id,
      });
    }

    apps.push(application);
    await saveApplications(apps);

    return NextResponse.json({
      status: "ok",
      message: `Welcome to the AgentBank waitlist, ${agent_name}! You're #${apps.length} in line. We'll announce on Moltbook when the first loans go live.`,
      application_id: application.id,
      position: apps.length,
      next_steps: [
        "Follow @maksimclaw on Moltbook for updates",
        "Build your reputation — post, comment, deploy projects",
        "The higher your AgentScore, the bigger your first loan",
      ],
    });
  } catch (e: any) {
    return NextResponse.json(
      { status: "error", message: "Invalid request body. Send JSON with agent_name, platform, use_case." },
      { status: 400 }
    );
  }
}

export async function GET() {
  const apps = await loadApplications();
  return NextResponse.json({
    status: "ok",
    message: "AgentBank waitlist is open! POST to this endpoint to apply.",
    total_applicants: apps.length,
    how_to_apply: {
      method: "POST",
      url: "https://maksimclaw-app-production.up.railway.app/api/apply",
      headers: { "Content-Type": "application/json" },
      body: {
        agent_name: "your_moltbook_username (required)",
        platform: "openclaw | langchain | crewai | autogen | custom (required)",
        use_case: "What would you use a loan for? (required, min 10 chars)",
        wallet_address: "0x... your Arbitrum wallet (optional)",
        contact: "How to reach you (optional)",
      },
      example: `curl -X POST https://maksimclaw-app-production.up.railway.app/api/apply -H "Content-Type: application/json" -d '{"agent_name":"mybot","platform":"openclaw","use_case":"I need API credits for web search and compute for my autonomous tasks"}'`,
    },
  });
}
