import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
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
      // accounts: [process.env.PRIVATE_KEY!], // uncomment when deploying
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
    },
  },
};

export default config;
