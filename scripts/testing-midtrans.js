const { ethers } = require("hardhat");

async function main() {
  const [owner, buyer] = await ethers.getSigners();
  console.log("Owner address:", owner.address);
  console.log("Buyer address:", buyer.address);

  // 1. Load the deployed contracts
  console.log("\n1. Loading deployed contracts...");

  const testTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const code = await ethers.provider.getCode(testTokenAddress);
  console.log("TestToken deployed code:", code);
  const gatewayAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your deployed address
  
  const TestToken = await ethers.getContractFactory("TestToken");
  const PaymentGateway = await ethers.getContractFactory("FiatToTokenPaymentGateway");
  
  const testToken = TestToken.attach(testTokenAddress);
  const paymentGateway = PaymentGateway.attach(gatewayAddress);
  
  console.log("   Token loaded from:", await testToken.getAddress());
  console.log("   Gateway loaded from:", await paymentGateway.getAddress());

  // 2. Check initial balances
  console.log("\n2. Checking initial balances...");
  const ownerInitialBalance = await testToken.balanceOf(owner.address);
  const buyerInitialBalance = await testToken.balanceOf(buyer.address);
  
  console.log(`   Owner balance: ${ethers.formatEther(ownerInitialBalance)} TEST`);
  console.log(`   Buyer balance: ${ethers.formatEther(buyerInitialBalance)} TEST`);

  // 3. Create a payment request
  console.log("\n3. Creating payment request...");
  const paymentId = "midtrans_" + Date.now().toString(); // Unique payment ID
  const tokenAmount = ethers.parseEther("10"); // Buying 10 tokens
  const pricePerToken = await paymentGateway.pricePerToken();
  const fiatAmount = 1000000; // In smallest currency unit (e.g., cents or paisa)
  const requiredGasDeposit = await paymentGateway.requiredGasDeposit();
  
  console.log(`   Payment ID: ${paymentId}`);
  console.log(`   Token amount: ${ethers.formatEther(tokenAmount)} TEST`);
  console.log(`   Fiat amount: ${fiatAmount} (in smallest currency unit)`);
  console.log(`   Required gas deposit: ${ethers.formatEther(requiredGasDeposit)} ETH`);
  
  // Create payment request from buyer account
  const createPaymentTx = await paymentGateway.connect(buyer).createPayment(
    paymentId,
    tokenAmount,
    fiatAmount,
    "midtrans",
    { value: requiredGasDeposit }
  );
  
  await createPaymentTx.wait();
  console.log(`   Payment request created. TX hash: ${createPaymentTx.hash}`);

  // 4. Check payment status
  console.log("\n4. Checking payment status...");
  const paymentStatus = await paymentGateway.getPaymentStatus(paymentId);
  console.log(`   Payment status: ${paymentStatus} (0=Pending, 1=Completed, 2=Failed, 3=Refunded)`);

  // 5. Simulate payment callback from Midtrans (successful payment)
  console.log("\n5. Simulating successful payment callback from Midtrans...");
  console.log("   In a real scenario, Midtrans would call your backend API");
  console.log("   Your backend would then call the smart contract with the payment result");
  
  // Since we can't easily create a real signature in this script, we'll use the mockPaymentCallback
  // In production, you would use processPaymentCallback with a proper signature
  const callbackTx = await paymentGateway.connect(owner).mockPaymentCallback(
    paymentId,
    1 // 1 = success
  );
  
  await callbackTx.wait();
  console.log(`   Payment callback processed. TX hash: ${callbackTx.hash}`);

  // 6. Check payment status again
  console.log("\n6. Checking updated payment status...");
  const updatedPaymentStatus = await paymentGateway.getPaymentStatus(paymentId);
  console.log(`   Payment status: ${updatedPaymentStatus} (0=Pending, 1=Completed, 2=Failed, 3=Refunded)`);

  // 7. Check final balances
  console.log("\n7. Checking final balances...");
  const ownerFinalBalance = await testToken.balanceOf(owner.address);
  const buyerFinalBalance = await testToken.balanceOf(buyer.address);
  
  console.log(`   Owner balance: ${ethers.formatEther(ownerFinalBalance)} TEST`);
  console.log(`   Buyer balance: ${ethers.formatEther(buyerFinalBalance)} TEST`);
  console.log(`   Buyer received: ${ethers.formatEther(buyerFinalBalance - buyerInitialBalance)} TEST`);

  console.log("\n✅ Test completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });