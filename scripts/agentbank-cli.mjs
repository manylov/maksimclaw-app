#!/usr/bin/env node
/**
 * AgentBank CLI — interact with AgentBank testnet on Arbitrum Sepolia
 * Usage: node agentbank-cli.mjs <command> [args]
 */

import { ethers } from "ethers";

// ─── Config ───────────────────────────────────────────────────────────────────
const RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";
const CHAIN_ID = 421614;

const ADDRESSES = {
  MockUSDT: "0xB28A96B23C0678e8876442f006949Fd5512541b5",
  AgentScore: "0xDF9aeca2772f5FA7d52235B78D92E3b2c7Ee7A48",
  AgentBankLending: "0x324E3ff4a9cc369Eed860dE7823Bd61427C07849",
};

// ─── ABIs (minimal) ──────────────────────────────────────────────────────────
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

const AGENT_SCORE_ABI = [
  "function getScore(address agent) view returns (uint256)",
  "function scores(address) view returns (uint256)",
];

const LENDING_ABI = [
  "function poolBalance() view returns (uint256)",
  "function totalLoans() view returns (uint256)",
  "function getMaxLoan(uint256 score) pure returns (uint256)",
  "function requestLoan(uint256 amount) returns (uint256)",
  "function repayLoan(uint256 loanId)",
  "function loans(uint256) view returns (address borrower, uint256 amount, uint256 fee, uint256 dueDate, bool repaid, bool defaulted)",
  "function getBorrowerLoans(address borrower) view returns (uint256[])",
  "function FEE_BPS() view returns (uint256)",
  "function LOAN_DURATION() view returns (uint256)",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(RPC_URL);
const usdt = new ethers.Contract(ADDRESSES.MockUSDT, ERC20_ABI, provider);
const score = new ethers.Contract(ADDRESSES.AgentScore, AGENT_SCORE_ABI, provider);
const lending = new ethers.Contract(ADDRESSES.AgentBankLending, LENDING_ABI, provider);

function out(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

function getSigner(privateKey) {
  return new ethers.Wallet(privateKey, provider);
}

function formatUSDT(raw) {
  return Number(ethers.formatUnits(raw, 6));
}

function parseUSDT(amount) {
  return ethers.parseUnits(String(amount), 6);
}

// ─── Commands ─────────────────────────────────────────────────────────────────

async function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  out({
    command: "generate-wallet",
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    network: "Arbitrum Sepolia",
    chainId: CHAIN_ID,
    note: "Save your private key securely. You need testnet ETH for gas — ask @maksimclaw on Moltbook.",
  });
}

async function balance(address) {
  const [ethBal, usdtBal] = await Promise.all([
    provider.getBalance(address),
    usdt.balanceOf(address),
  ]);
  out({
    command: "balance",
    address,
    eth: Number(ethers.formatEther(ethBal)),
    usdt: formatUSDT(usdtBal),
    network: "Arbitrum Sepolia",
  });
}

async function getScore(address) {
  const s = await score.getScore(address);
  const maxLoan = await lending.getMaxLoan(s);
  out({
    command: "score",
    address,
    score: Number(s),
    maxLoanUSDT: formatUSDT(maxLoan),
    tierInfo: Number(s) >= 500 ? "Tier 3 ($5 max)" : Number(s) >= 400 ? "Tier 2 ($2 max)" : Number(s) >= 300 ? "Tier 1 ($0.50 max)" : "No tier (score < 300)",
  });
}

async function requestLoan(privateKey, amount) {
  const signer = getSigner(privateKey);
  const lendingW = lending.connect(signer);
  const amountRaw = parseUSDT(amount);

  const tx = await lendingW.requestLoan(amountRaw);
  const receipt = await tx.wait();

  // Parse loan ID from event
  const iface = new ethers.Interface(["event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 fee, uint256 dueDate)"]);
  let loanId = null;
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed.name === "LoanRequested") {
        loanId = Number(parsed.args.loanId);
      }
    } catch {}
  }

  out({
    command: "request-loan",
    borrower: signer.address,
    amountUSDT: Number(amount),
    loanId,
    txHash: receipt.hash,
    status: "success",
  });
}

async function repayLoan(privateKey, loanId) {
  const signer = getSigner(privateKey);
  const loanData = await lending.loans(loanId);
  const totalDue = loanData.amount + loanData.fee;

  // Approve USDT spending
  const usdtW = usdt.connect(signer);
  const allowance = await usdt.allowance(signer.address, ADDRESSES.AgentBankLending);
  if (allowance < totalDue) {
    const approveTx = await usdtW.approve(ADDRESSES.AgentBankLending, totalDue);
    await approveTx.wait();
  }

  const lendingW = lending.connect(signer);
  const tx = await lendingW.repayLoan(loanId);
  const receipt = await tx.wait();

  out({
    command: "repay-loan",
    loanId: Number(loanId),
    totalPaidUSDT: formatUSDT(totalDue),
    txHash: receipt.hash,
    status: "success",
  });
}

async function myLoans(address) {
  const loanIds = await lending.getBorrowerLoans(address);
  const loansData = [];
  for (const id of loanIds) {
    const l = await lending.loans(id);
    loansData.push({
      loanId: Number(id),
      amountUSDT: formatUSDT(l.amount),
      feeUSDT: formatUSDT(l.fee),
      totalDueUSDT: formatUSDT(l.amount + l.fee),
      dueDate: new Date(Number(l.dueDate) * 1000).toISOString(),
      repaid: l.repaid,
      defaulted: l.defaulted,
    });
  }
  out({
    command: "my-loans",
    address,
    count: loansData.length,
    loans: loansData,
  });
}

async function status() {
  const [poolBal, totalL] = await Promise.all([
    lending.poolBalance(),
    lending.totalLoans(),
  ]);
  out({
    command: "status",
    poolBalanceUSDT: formatUSDT(poolBal),
    totalLoans: Number(totalL),
    contracts: ADDRESSES,
    network: "Arbitrum Sepolia",
    chainId: CHAIN_ID,
    rpc: RPC_URL,
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const [cmd, ...args] = process.argv.slice(2);

const commands = {
  "generate-wallet": () => generateWallet(),
  "balance": () => balance(args[0]),
  "score": () => getScore(args[0]),
  "request-loan": () => requestLoan(args[0], args[1]),
  "repay-loan": () => repayLoan(args[0], args[1]),
  "my-loans": () => myLoans(args[0]),
  "status": () => status(),
};

if (!cmd || !commands[cmd]) {
  out({
    error: "Unknown command",
    usage: {
      "generate-wallet": "Create a new Arbitrum wallet",
      "balance <address>": "Check ETH + USDT balance",
      "score <address>": "Check AgentScore and tier",
      "request-loan <privateKey> <amount>": "Request a USDT loan",
      "repay-loan <privateKey> <loanId>": "Repay a loan",
      "my-loans <address>": "List your loans",
      "status": "Pool balance and stats",
    },
  });
  process.exit(1);
}

commands[cmd]().catch((e) => {
  out({ error: e.message, command: cmd });
  process.exit(1);
});
