import "../globals.css";

const agentScoreCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentScore is Ownable {
    mapping(address => uint256) public scores;

    event ScoreUpdated(address indexed agent, uint256 oldScore, uint256 newScore);

    constructor() Ownable(msg.sender) {}

    function updateScore(address agent, uint256 newScore) external onlyOwner {
        require(newScore <= 1000, "Score must be <= 1000");
        uint256 oldScore = scores[agent];
        scores[agent] = newScore;
        emit ScoreUpdated(agent, oldScore, newScore);
    }

    function batchUpdateScores(
        address[] calldata agents,
        uint256[] calldata newScores
    ) external onlyOwner {
        require(agents.length == newScores.length, "Length mismatch");
        for (uint256 i = 0; i < agents.length; i++) {
            require(newScores[i] <= 1000, "Score must be <= 1000");
            uint256 oldScore = scores[agents[i]];
            scores[agents[i]] = newScores[i];
            emit ScoreUpdated(agents[i], oldScore, newScores[i]);
        }
    }

    function getScore(address agent) external view returns (uint256) {
        return scores[agent];
    }
}`;

const lendingCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./AgentScore.sol";

contract AgentBankLending is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdt;
    AgentScore public immutable agentScore;

    uint256 public constant FEE_BPS = 1500; // 15% flat fee
    uint256 public constant LOAN_DURATION = 14 days;

    // Tier thresholds (score => max loan in USDT, 6 decimals)
    uint256 public constant TIER1_SCORE = 300; // max $0.50
    uint256 public constant TIER2_SCORE = 400; // max $2.00
    uint256 public constant TIER3_SCORE = 500; // max $5.00

    struct Loan {
        address borrower;
        uint256 amount;
        uint256 fee;
        uint256 dueDate;
        bool repaid;
        bool defaulted;
    }

    Loan[] public loans;
    mapping(address => uint256[]) public borrowerLoans;

    event LoanRequested(uint256 indexed loanId, address indexed borrower,
                        uint256 amount, uint256 fee, uint256 dueDate);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower,
                     uint256 totalPaid);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);

    constructor(address _usdt, address _agentScore) Ownable(msg.sender) {
        usdt = IERC20(_usdt);
        agentScore = AgentScore(_agentScore);
    }

    function requestLoan(uint256 amount) external returns (uint256 loanId) {
        uint256 score = agentScore.getScore(msg.sender);
        uint256 maxLoan = getMaxLoan(score);
        require(maxLoan > 0, "Score too low");
        require(amount > 0 && amount <= maxLoan, "Amount exceeds tier limit");

        uint256 fee = (amount * FEE_BPS) / 10_000;
        uint256 dueDate = block.timestamp + LOAN_DURATION;
        loanId = loans.length;
        loans.push(Loan(msg.sender, amount, fee, dueDate, false, false));
        borrowerLoans[msg.sender].push(loanId);
        usdt.safeTransfer(msg.sender, amount);
        emit LoanRequested(loanId, msg.sender, amount, fee, dueDate);
    }

    function repayLoan(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "Not your loan");
        require(!loan.repaid && !loan.defaulted, "Loan closed");
        uint256 totalDue = loan.amount + loan.fee;
        usdt.safeTransferFrom(msg.sender, address(this), totalDue);
        loan.repaid = true;
        emit LoanRepaid(loanId, msg.sender, totalDue);
    }

    function liquidate(uint256 loanId) external onlyOwner {
        Loan storage loan = loans[loanId];
        require(!loan.repaid && !loan.defaulted, "Loan closed");
        require(block.timestamp > loan.dueDate, "Not yet overdue");
        loan.defaulted = true;
        emit LoanDefaulted(loanId, loan.borrower);
    }

    function getMaxLoan(uint256 score) public pure returns (uint256) {
        if (score >= 500) return 5_000_000;  // $5.00
        if (score >= 400) return 2_000_000;  // $2.00
        if (score >= 300) return 500_000;    // $0.50
        return 0;
    }
}`;

const architecture = [
  { name: "AgentScore", desc: "On-chain reputation registry. Stores 0–1000 scores per agent address. Only the owner (AgentBank backend) can update scores. Emits ScoreUpdated events for indexing.", color: "#7c3aed" },
  { name: "AgentBankLending", desc: "USDT microloan pool. Reads AgentScore to determine tier limits. Manages full loan lifecycle: request → repay/liquidate. 15% flat fee, 14-day term.", color: "#00d4aa" },
  { name: "USDT (ERC-20)", desc: "Tether on Arbitrum (0xFd086...Cbb9). 6 decimals. Used as the sole lending currency. SafeERC20 for all transfers.", color: "#f59e0b" },
];

const tiers = [
  { score: "300+", max: "$0.50", maxRaw: "500,000", color: "#f59e0b" },
  { score: "400+", max: "$2.00", maxRaw: "2,000,000", color: "#3b82f6" },
  { score: "500+", max: "$5.00", maxRaw: "5,000,000", color: "#7c3aed" },
];

export default function ContractsPage() {
  return (
    <main>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "#0a0a0aee", backdropFilter: "blur(12px)", borderBottom: "1px solid #222" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#ededed" }}>
            <span style={{ fontSize: "1.5rem" }}>🏦</span>
            <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>AgentBank</span>
            <span style={{ color: "#444", fontSize: "0.9rem" }}>/ contracts</span>
          </a>
          <div style={{ display: "flex", gap: 24, fontSize: "0.9rem" }}>
            <a href="/docs" style={{ color: "#888" }}>Docs</a>
            <a href="/onboarding" style={{ color: "var(--accent)", fontWeight: 600 }}>Get Started →</a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, background: "#00d4aa22", color: "#00d4aa", border: "1px solid #00d4aa44", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>
            Solidity 0.8.20 · Arbitrum · OpenZeppelin
          </span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: 16 }}>Smart Contracts</h1>
          <p style={{ color: "#888", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto" }}>
            Open-source, auditable smart contracts powering AgentBank&apos;s microloan infrastructure. Built with OpenZeppelin. Ready for testnet deployment.
          </p>
        </div>

        {/* Architecture */}
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 24 }}>Architecture</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
          {architecture.map((item) => (
            <div key={item.name} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 24, borderTop: `3px solid ${item.color}` }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8, color: item.color }}>{item.name}</h3>
              <p style={{ fontSize: "0.85rem", color: "#888", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Flow diagram */}
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 32, marginBottom: 48, textAlign: "center" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, color: "#888" }}>Loan Flow</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", fontSize: "0.85rem" }}>
            <span style={{ padding: "8px 16px", background: "#1a1a1a", borderRadius: 8, border: "1px solid #333" }}>🤖 Agent</span>
            <span style={{ color: "#444" }}>→</span>
            <span style={{ padding: "8px 16px", background: "#7c3aed22", borderRadius: 8, border: "1px solid #7c3aed44", color: "#7c3aed" }}>AgentScore.getScore()</span>
            <span style={{ color: "#444" }}>→</span>
            <span style={{ padding: "8px 16px", background: "#00d4aa22", borderRadius: 8, border: "1px solid #00d4aa44", color: "#00d4aa" }}>Lending.requestLoan()</span>
            <span style={{ color: "#444" }}>→</span>
            <span style={{ padding: "8px 16px", background: "#f59e0b22", borderRadius: 8, border: "1px solid #f59e0b44", color: "#f59e0b" }}>USDT Transfer</span>
            <span style={{ color: "#444" }}>→</span>
            <span style={{ padding: "8px 16px", background: "#1a1a1a", borderRadius: 8, border: "1px solid #333" }}>🤖 Agent</span>
          </div>
        </div>

        {/* Tier table */}
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 24 }}>On-Chain Tier System</h2>
        <div style={{ overflowX: "auto", marginBottom: 48 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #222" }}>
                {["Min Score", "Max Loan", "Raw (6 dec)", "Fee (15%)", "Term"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map((t) => (
                <tr key={t.score} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 700, color: t.color }}>{t.score}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>{t.max}</td>
                  <td style={{ padding: "14px 16px", color: "#888", fontFamily: "monospace" }}>{t.maxRaw}</td>
                  <td style={{ padding: "14px 16px", color: "#888" }}>15%</td>
                  <td style={{ padding: "14px 16px", color: "#888" }}>14 days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AgentScore Contract */}
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 16 }}>AgentScore.sol</h2>
        <p style={{ color: "#888", marginBottom: 16, fontSize: "0.9rem" }}>On-chain reputation registry. Stores scores 0–1000. Owner-controlled updates with batch support.</p>
        <pre style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 12, padding: 24, fontSize: "0.8rem", lineHeight: 1.6, overflowX: "auto", color: "#00d4aa", marginBottom: 48 }}>
          {agentScoreCode}
        </pre>

        {/* Lending Contract */}
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 16 }}>AgentBankLending.sol</h2>
        <p style={{ color: "#888", marginBottom: 16, fontSize: "0.9rem" }}>USDT microloan pool with tier-based lending. Full loan lifecycle: request, repay, or liquidate.</p>
        <pre style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 12, padding: 24, fontSize: "0.8rem", lineHeight: 1.6, overflowX: "auto", color: "#00d4aa", marginBottom: 48 }}>
          {lendingCode}
        </pre>

        {/* Status */}
        <div style={{ background: "linear-gradient(135deg, #00d4aa11, #7c3aed11)", border: "1px solid #222", borderRadius: 16, padding: 40, textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>Status: Compiled &amp; Tested ✅</h2>
          <p style={{ color: "#888", marginBottom: 24 }}>15/15 tests passing. Testnet deployment coming soon.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://github.com/manylov/maksimclaw-app/tree/main/contracts" target="_blank" style={{ padding: "12px 24px", border: "1px solid #333", borderRadius: 8, color: "#ededed", fontWeight: 500, fontSize: "0.9rem" }}>
              View on GitHub →
            </a>
            <a href="/docs" style={{ padding: "12px 24px", border: "1px solid #333", borderRadius: 8, color: "#ededed", fontWeight: 500, fontSize: "0.9rem" }}>
              Read the Docs →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
