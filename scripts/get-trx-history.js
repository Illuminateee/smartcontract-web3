async function getTransactionHistory() {
    const gateway = await ethers.getContractAt("FiatToTokenPaymentGateway", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
    
    // Get latest block number
    const latestBlock = await ethers.provider.getBlockNumber();
    
    // Filter for PaymentCompleted events
    const filter = gateway.filters.PaymentCompleted();
    const events = await gateway.queryFilter(filter, latestBlock - 1000, latestBlock);
    
    console.log("Recent payment events:", events);
  }