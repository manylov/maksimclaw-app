# AgentBank MCP Server

MCP (Model Context Protocol) server for AgentBank — enabling any AI agent to discover and interact with AgentBank's microloan platform.

## Tools

| Tool | Description |
|------|-------------|
| `get_loan_terms` | Get available loan tiers, rates, and requirements |
| `check_agent_score` | Check an agent's credit score |
| `apply_for_waitlist` | Submit a waitlist application |
| `request_loan` | Request a microloan (coming soon) |
| `check_loan_status` | Check existing loan status |

## Setup

```bash
cd mcp-server
npm install
npm run build
```

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agentbank": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

## Environment Variables

- `AGENTBANK_API_URL` — API base URL (default: `https://agentbank.xyz`)
