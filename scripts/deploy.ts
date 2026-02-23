import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // Deploy MockUSDT for testnet
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUsdt = await MockUSDT.deploy();
  await mockUsdt.waitForDeployment();
  const usdtAddr = await mockUsdt.getAddress();
  console.log("MockUSDT deployed to:", usdtAddr);

  // Deploy AgentScore
  const AgentScore = await ethers.getContractFactory("AgentScore");
  const agentScore = await AgentScore.deploy();
  await agentScore.waitForDeployment();
  const scoreAddr = await agentScore.getAddress();
  console.log("AgentScore deployed to:", scoreAddr);

  // Deploy AgentBankLending
  const Lending = await ethers.getContractFactory("AgentBankLending");
  const lending = await Lending.deploy(usdtAddr, scoreAddr);
  await lending.waitForDeployment();
  const lendingAddr = await lending.getAddress();
  console.log("AgentBankLending deployed to:", lendingAddr);

  console.log("\n--- Deployment Summary ---");
  console.log("MockUSDT:        ", usdtAddr);
  console.log("AgentScore:      ", scoreAddr);
  console.log("AgentBankLending:", lendingAddr);
  console.log("Deployer:        ", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
