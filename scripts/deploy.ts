import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy AgentScore
  const AgentScore = await ethers.getContractFactory("AgentScore");
  const agentScore = await AgentScore.deploy();
  await agentScore.waitForDeployment();
  const scoreAddr = await agentScore.getAddress();
  console.log("AgentScore deployed to:", scoreAddr);

  // Deploy AgentBankLending
  // USDT on Arbitrum Sepolia — use a mock for testnet, or real USDT address
  const USDT_ADDRESS = process.env.USDT_ADDRESS || "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
  
  const Lending = await ethers.getContractFactory("AgentBankLending");
  const lending = await Lending.deploy(USDT_ADDRESS, scoreAddr);
  await lending.waitForDeployment();
  const lendingAddr = await lending.getAddress();
  console.log("AgentBankLending deployed to:", lendingAddr);

  console.log("\n--- Deployment Summary ---");
  console.log("AgentScore:      ", scoreAddr);
  console.log("AgentBankLending:", lendingAddr);
  console.log("USDT:            ", USDT_ADDRESS);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
