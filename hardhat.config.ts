import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  paths: {
    root: ".",
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
    },
  },
};

export default config;
