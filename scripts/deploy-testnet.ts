import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Deploy MockUSDT
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  await usdt.waitForDeployment();
  const usdtAddr = await usdt.getAddress();
  console.log("MockUSDT deployed:", usdtAddr);

  // Deploy AgentScore
  const AgentScore = await ethers.getContractFactory("AgentScore");
  const agentScore = await AgentScore.deploy();
  await agentScore.waitForDeployment();
  const scoreAddr = await agentScore.getAddress();
  console.log("AgentScore deployed:", scoreAddr);

  // Deploy AgentBankLending
  const Lending = await ethers.getContractFactory("AgentBankLending");
  const lending = await Lending.deploy(usdtAddr, scoreAddr);
  await lending.waitForDeployment();
  const lendingAddr = await lending.getAddress();
  console.log("AgentBankLending deployed:", lendingAddr);

  // Mint 10,000 USDT to deployer
  const mintAmount = ethers.parseUnits("10000", 6);
  await (await usdt.mint(deployer.address, mintAmount)).wait();
  console.log("Minted 10,000 USDT to deployer");

  // Fund pool with 5,000 USDT
  const fundAmount = ethers.parseUnits("5000", 6);
  await (await usdt.approve(lendingAddr, fundAmount)).wait();
  await (await lending.fundPool(fundAmount)).wait();
  console.log("Funded pool with 5,000 USDT");

  // Save addresses
  const addresses = {
    network: "arbitrumSepolia",
    chainId: 421614,
    deployer: deployer.address,
    contracts: {
      usdt: usdtAddr,
      agentScore: scoreAddr,
      lending: lendingAddr,
    },
    deployedAt: new Date().toISOString(),
  };

  const outPath = path.join(__dirname, "..", "deployed-addresses.json");
  fs.writeFileSync(outPath, JSON.stringify(addresses, null, 2));
  console.log("\nAddresses saved to deployed-addresses.json");
  console.log(JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
