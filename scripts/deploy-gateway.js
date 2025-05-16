const { ethers } = require("hardhat");

async function main() {
  // Get the previously deployed token
  // If running separately, replace this with your actual token address
  console.log("Retrieving previously deployed token...");
  
  // This requires running the script on the same network session 
  // or storing the address from a previous deployment
  const tokenAddress = "YOUR_DEPLOYED_TOKEN_ADDRESS_HERE";  // Replace with actual address
  
  // Load the token contract
  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.attach(tokenAddress);
  
  console.log("Using token at address:", tokenAddress);
  
  // Set initial token price and gas deposit
  const pricePerToken = ethers.parseEther("0.01"); // 0.01 ETH per token
  const requiredGasDeposit = ethers.parseEther("0.005"); // 0.005 ETH
  
  console.log("Deploying FiatToTokenPaymentGateway...");
  console.log("Price per token:", ethers.formatEther(pricePerToken), "ETH");
  console.log("Required gas deposit:", ethers.formatEther(requiredGasDeposit), "ETH");
  
  // Deploy the payment gateway
  const PaymentGateway = await ethers.getContractFactory("FiatToTokenPaymentGateway");
  const paymentGateway = await PaymentGateway.deploy(
    tokenAddress,
    pricePerToken,
    requiredGasDeposit
  );
  
  await paymentGateway.waitForDeployment();
  
  const gatewayAddress = await paymentGateway.getAddress();
  console.log("FiatToTokenPaymentGateway deployed to:", gatewayAddress);
  
  // Approve the gateway to spend tokens
  console.log("Approving payment gateway to spend tokens...");
  const approveTx = await testToken.approve(gatewayAddress, ethers.MaxUint256);
  await approveTx.wait();
  console.log("Gateway approved to spend tokens. TX hash:", approveTx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });