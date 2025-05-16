const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying TestToken with the account:", deployer.address);

  const TestToken = await ethers.getContractFactory("TestToken");
  const initialSupply = ethers.parseEther("1000000");
  const testToken = await TestToken.deploy(initialSupply);

  await testToken.waitForDeployment();
  
  const tokenAddress = await testToken.getAddress();
  console.log("TestToken deployed to:", tokenAddress);
  
  // Additional checks to verify deployment
  const name = await testToken.name();
  const symbol = await testToken.symbol();
  const totalSupply = await testToken.totalSupply();
  
  console.log("Token name:", name);
  console.log("Token symbol:", symbol);
  console.log("Total supply:", ethers.formatEther(totalSupply));
  
  return tokenAddress;
}

// We recommend this pattern to be able to use async/await everywhere
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });