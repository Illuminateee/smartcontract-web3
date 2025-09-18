
# Payment Gateway Project

This project is a smart contract-based payment gateway using Hardhat and web3 technologies. It enables fiat-to-token payments and includes sample contracts and deployment scripts.

## Features
- Fiat to token payment gateway smart contract
- ERC20 token contract for testing
- Deployment scripts for contracts
- Example usage scripts
- Test scripts

## Project Structure
- `contracts/` - Solidity smart contracts
- `scripts/` - Deployment and utility scripts
- `test/` - Test scripts
- `artifacts/` - Compiled contract artifacts
- `cache/` - Hardhat cache files
- `cmd/` - Additional command scripts

## Getting Started

### Prerequisites
- Node.js
- npm
- Hardhat

### Installation
1. Clone the repository:
	```sh
	git clone <repo-url>
	cd payment-gateway-project
	```
2. Install dependencies:
	```sh
	npm install
	```

### Compile Contracts
```sh
npx hardhat compile
```

### Deploy Contracts
```sh
npx hardhat run scripts/deploy-all.js --network <network-name>
```

### Run Example Payment
```sh
node run-payment.js
```

## Testing
```sh
npx hardhat test
```

## License
MIT
