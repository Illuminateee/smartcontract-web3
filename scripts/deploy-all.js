const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Deploy TestToken
  console.log("\n1. Deploying TestToken...");
  const TestToken = await ethers.getContractFactory("TestToken");
  const initialSupply = ethers.parseEther("1000000");
  const testToken = await TestToken.deploy(initialSupply);
  await testToken.waitForDeployment();
  
  const tokenAddress = await testToken.getAddress();
  console.log("   TestToken deployed to:", tokenAddress);
  
  // Verify token details
  console.log("   Token name:", await testToken.name());
  console.log("   Token symbol:", await testToken.symbol());
  console.log("   Total supply:", ethers.formatEther(await testToken.totalSupply()), "TEST");

  // Deploy payment gateway
  console.log("\n2. Deploying FiatToTokenPaymentGateway...");
  const pricePerToken = ethers.parseEther("0.01"); // 0.01 ETH per token
  const requiredGasDeposit = ethers.parseEther("0.005"); // 0.005 ETH
  
  const PaymentGateway = await ethers.getContractFactory("FiatToTokenPaymentGateway");
  const paymentGateway = await PaymentGateway.deploy(
    tokenAddress,
    pricePerToken,
    requiredGasDeposit
  );
  
  await paymentGateway.waitForDeployment();
  
  const gatewayAddress = await paymentGateway.getAddress();
  console.log("   FiatToTokenPaymentGateway deployed to:", gatewayAddress);
  console.log("   Price per token:", ethers.formatEther(await paymentGateway.pricePerToken()), "ETH");
  console.log("   Required gas deposit:", ethers.formatEther(await paymentGateway.requiredGasDeposit()), "ETH");
  
  // Approve the gateway to spend tokens
  console.log("\n3. Setting up token allowance for gateway...");
  const approveTx = await testToken.approve(gatewayAddress, ethers.MaxUint256);
  await approveTx.wait();
  console.log("   Gateway approved to spend tokens. TX hash:", approveTx.hash);
  
  // Verify approval
  const allowance = await testToken.allowance(deployer.address, gatewayAddress);
  console.log("   Allowance confirmed:", ethers.formatEther(allowance), "TEST");

  console.log("\n✅ Deployment complete!");
  console.log("   TestToken:", tokenAddress);
  console.log("   FiatToTokenPaymentGateway:", gatewayAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });