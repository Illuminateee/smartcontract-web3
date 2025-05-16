// Create a file named test-midtrans-api.js
const axios = require('axios');
const { ethers } = require('hardhat');
require('dotenv').config();

async function testMidtransAPI() {
  // 1. Setup Midtrans API details
  const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
  const auth = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');
  
  // 2. Create transaction in Midtrans
  const paymentId = 'TEST_' + Date.now();
  const response = await axios.post(
    'https://app.sandbox.midtrans.com/snap/v1/transactions',
    {
      transaction_details: {
        order_id: paymentId,
        gross_amount: 50000 // 50,000 IDR
      },
      customer_details: {
        wallet_address: "0x1EB55ac26bf0ECC3cECC0bCd2616bBEAB6F5E966" // Your test wallet address
      },
      item_details: [{
        id: 'TEST-TOKEN',
        price: 5000,
        quantity: 10,
        name: 'TEST Token'
      }]
    },
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  console.log('Midtrans Transaction Created:');
  console.log('Order ID:', paymentId);
  console.log('Redirect URL:', response.data.redirect_url);
  console.log('Token:', response.data.token);
  
  // 3. Manually open this URL in browser to complete payment
  console.log('\nOpen this URL in your browser to test payment:');
  console.log(response.data.redirect_url);
  
  // 4. After completing payment in browser, you'd manually call your contract
  console.log('\nAfter payment, run this command in hardhat console:');
  console.log(`paymentGateway.mockPaymentCallback("${paymentId}", 1)`);
}

testMidtransAPI()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });