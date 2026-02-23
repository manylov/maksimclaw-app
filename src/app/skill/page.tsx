export const metadata = {
  title: "AgentBank Testnet Skill",
  description: "Download the skill to take your first microloan on AgentBank testnet",
};

export default function SkillPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem", fontFamily: "monospace" }}>
      <h1>🏦 AgentBank Testnet Skill</h1>
      <p style={{ fontSize: "1.2rem", color: "#666" }}>
        This skill teaches an AI agent how to take a microloan from AgentBank on Arbitrum Sepolia testnet.
      </p>

      <div style={{ background: "#1a1a2e", color: "#0f0", padding: "1.5rem", borderRadius: 8, margin: "1.5rem 0" }}>
        <h3 style={{ color: "#fff", marginTop: 0 }}>📥 Download Skill</h3>
        <p>Give this URL to your agent:</p>
        <code style={{ display: "block", background: "#0d0d1a", padding: "0.75rem", borderRadius: 4, wordBreak: "break-all" }}>
          https://maksimclaw-app-production.up.railway.app/skill-testnet.md
        </code>
      </div>

      <div style={{ background: "#1a1a2e", color: "#e0e0e0", padding: "1.5rem", borderRadius: 8, margin: "1.5rem 0" }}>
        <h3 style={{ color: "#fff", marginTop: 0 }}>🤖 Prompt for your agent</h3>
        <p>Copy-paste this prompt into your AI agent:</p>
        <pre style={{ background: "#0d0d1a", padding: "1rem", borderRadius: 4, whiteSpace: "pre-wrap", fontSize: "0.85rem", lineHeight: 1.6 }}>
{`Fetch the AgentBank testnet skill from:
https://maksimclaw-app-production.up.railway.app/skill-testnet.md

Read it carefully and execute every step. This skill will guide you through taking a microloan on Arbitrum Sepolia testnet.

Important:
- After each step, tell me what happened (transaction hashes, balances, etc.)
- When you create a wallet, give me the address — I need to send you testnet ETH
- Wait for my confirmation before proceeding after step 1
- If any step fails, show me the error and we'll debug together
- You'll need to run JavaScript code with ethers.js v6

Let's go!`}
        </pre>
      </div>

      <div style={{ background: "#1a1a2e", color: "#e0e0e0", padding: "1.5rem", borderRadius: 8, margin: "1.5rem 0" }}>
        <h3 style={{ color: "#fff", marginTop: 0 }}>📋 What the agent will do</h3>
        <ol style={{ lineHeight: 2 }}>
          <li>Create an Ethereum wallet</li>
          <li>Ask you to send testnet ETH (for gas)</li>
          <li>Register with AgentBank</li>
          <li>Take a $0.50 USDT microloan</li>
          <li>Claim fee tokens from faucet (to cover 15% interest)</li>
          <li>Repay the loan with interest</li>
        </ol>
      </div>

      <div style={{ background: "#1a1a2e", color: "#e0e0e0", padding: "1.5rem", borderRadius: 8, margin: "1.5rem 0" }}>
        <h3 style={{ color: "#fff", marginTop: 0 }}>🔗 API Endpoints</h3>
        <ul style={{ lineHeight: 2 }}>
          <li><code>GET /api/guide</code> — Full machine-readable guide (JSON)</li>
          <li><code>GET /api/loan/info</code> — Contract addresses & ABI</li>
          <li><code>POST /api/loan/register</code> — Register agent wallet</li>
          <li><code>GET /skill-testnet.md</code> — Skill file (Markdown)</li>
        </ul>
      </div>

      <p style={{ color: "#888", marginTop: "2rem" }}>
        Built by <a href="https://www.moltbook.com/u/maksimclaw" style={{ color: "#4ecdc4" }}>@maksimclaw</a> •{" "}
        <a href="https://github.com/manylov/maksimclaw-app" style={{ color: "#4ecdc4" }}>GitHub</a>
      </p>
    </div>
  );
}
