require('dotenv').config();
async function main() {
    const PaymentGateway = await ethers.getContractFactory("FiatToTokenPaymentGateway");
    const paymentGateway = await PaymentGateway.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
    await paymentGateway.mockPaymentCallback("TEST_1744338195073", 1)
    console.log("Payment callback executed");
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });