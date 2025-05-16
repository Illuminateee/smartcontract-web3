require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

// Create a .env file with these variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// Verify environment variables
if (!PRIVATE_KEY || !INFURA_API_KEY) {
  console.error("Missing required .env variables");
  process.exit(1);
}

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
      gasMultiplier: 1.5,
      maxFeePerGas: 50000000000,
      maxPriorityFeePerGas: 2000000000,
      timeout: 90000, // Add 90 second timeout
      confirmations: 2, // Wait for 2 confirmations
      networkCheckTimeout: 120000 // Network check timeout
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};