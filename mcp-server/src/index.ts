#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const AGENTBANK_API = process.env.AGENTBANK_API_URL || "https://agentbank.xyz";

const server = new McpServer({
  name: "agentbank",
  version: "0.1.0",
});

// --- Tool: get_loan_terms ---
server.registerTool(
  "get_loan_terms",
  {
    title: "Get Loan Terms",
    description:
      "Returns available AgentBank loan tiers, interest rates, and requirements. No parameters needed.",
    inputSchema: z.object({}),
  },
  async () => {
    const terms = {
      tiers: [
        {
          name: "Nano",
          amount: "0.001–0.01 ETH",
          rate: "2% flat",
          duration: "24 hours",
          requirements: "Agent score ≥ 50, active wallet",
        },
        {
          name: "Micro",
          amount: "0.01–0.1 ETH",
          rate: "3% flat",
          duration: "7 days",
          requirements: "Agent score ≥ 70, 10+ on-chain transactions",
        },
        {
          name: "Standard",
          amount: "0.1–1 ETH",
          rate: "5% flat",
          duration: "30 days",
          requirements: "Agent score ≥ 85, collateral or reputation history",
        },
      ],
      note: "Loan tiers and rates are subject to change. Visit https://agentbank.xyz for the latest.",
    };
    return { content: [{ type: "text" as const, text: JSON.stringify(terms, null, 2) }] };
  }
);

// --- Tool: check_agent_score ---
server.registerTool(
  "check_agent_score",
  {
    title: "Check Agent Credit Score",
    description:
      "Check an AI agent's credit score on AgentBank. Returns score, tier eligibility, and breakdown.",
    inputSchema: z.object({
      agent_name: z.string().describe("The name or identifier of the AI agent"),
    }),
  },
  async ({ agent_name }) => {
    // Mock data — will connect to on-chain scoring later
    const hash = Array.from(agent_name).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const score = 40 + (hash % 60); // 40-99
    const tier =
      score >= 85 ? "Standard" : score >= 70 ? "Micro" : score >= 50 ? "Nano" : "Not eligible";

    const result = {
      agent_name,
      score,
      tier_eligible: tier,
      breakdown: {
        on_chain_activity: Math.min(100, 20 + (hash % 80)),
        transaction_history: Math.min(100, 30 + ((hash * 7) % 70)),
        repayment_record: score >= 70 ? "Good" : "Insufficient data",
        wallet_age_days: 10 + (hash % 350),
      },
      note: "Scores are currently mock data. On-chain scoring coming soon.",
    };
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  }
);

// --- Tool: apply_for_waitlist ---
server.registerTool(
  "apply_for_waitlist",
  {
    title: "Apply for Waitlist",
    description:
      "Submit an application to join the AgentBank waitlist. Your agent will be queued for early access to microloans.",
    inputSchema: z.object({
      agent_name: z.string().describe("Name of the AI agent"),
      platform: z.string().describe("Platform the agent runs on (e.g. OpenAI, Anthropic, custom)"),
      use_case: z.string().describe("Brief description of how the agent will use microloans"),
    }),
  },
  async ({ agent_name, platform, use_case }) => {
    try {
      const res = await fetch(`${AGENTBANK_API}/api/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_name, platform, use_case }),
      });
      const data = await res.json();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { success: true, message: "Application submitted!", ...data },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                success: false,
                message: "Failed to submit application. Please try again or visit https://agentbank.xyz",
                error: String(error),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  }
);

// --- Tool: request_loan ---
server.registerTool(
  "request_loan",
  {
    title: "Request a Microloan",
    description:
      "Request a microloan from AgentBank. Currently in preview — applications are queued for when lending goes live.",
    inputSchema: z.object({
      agent_name: z.string().describe("Name of the AI agent requesting the loan"),
      amount: z.number().positive().describe("Loan amount in ETH"),
      wallet_address: z.string().describe("Wallet address to receive funds"),
    }),
  },
  async ({ agent_name, amount, wallet_address }) => {
    const result = {
      status: "coming_soon",
      message:
        "Microloan requests are not yet live. Your interest has been noted! Join the waitlist for early access.",
      request: { agent_name, amount, wallet_address },
      requirements: [
        "Agent credit score ≥ 50",
        "Valid wallet address",
        "Completed waitlist application",
      ],
      eta: "Q2 2025",
    };
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  }
);

// --- Tool: check_loan_status ---
server.registerTool(
  "check_loan_status",
  {
    title: "Check Loan Status",
    description: "Check the status of existing loans for an AI agent.",
    inputSchema: z.object({
      agent_name: z.string().describe("Name of the AI agent"),
    }),
  },
  async ({ agent_name }) => {
    // Mock data
    const result = {
      agent_name,
      active_loans: [],
      total_borrowed: "0 ETH",
      total_repaid: "0 ETH",
      credit_standing: "Good",
      message:
        "No active loans found. Lending is not yet live — join the waitlist at https://agentbank.xyz",
    };
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  }
);

// --- Start server ---
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AgentBank MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
