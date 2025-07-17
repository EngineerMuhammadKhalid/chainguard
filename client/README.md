
# Chainguard: Decentralized Storage System

Chainguard is a decentralized file storage web application built with React and Ethereum smart contracts. It allows users to securely upload, store, and share files using blockchain technology and IPFS (via Pinata).

## Features

- **Decentralized File Upload:** Upload images/files to IPFS and store references on the Ethereum blockchain.
- **Wallet Integration:** Connect your MetaMask wallet to interact with the app.
- **Access Control:** Share file access with other Ethereum addresses using smart contract permissions.
- **File Display:** View and download files you have access to, with fast and secure retrieval.
- **Security Metrics:** Basic security checks for authentication, HTTPS usage, and endpoint trust.
- **Performance Metrics:** Upload and download times are measured and displayed in the console.

## Tech Stack

- **Frontend:** React, Chart.js, Axios
- **Blockchain:** Ethereum (ethers.js), Solidity Smart Contract
- **Storage:** IPFS via Pinata

## Getting Started

### Prerequisites

- Node.js and npm
- MetaMask browser extension
- Ethereum testnet (e.g., Goerli) account with test ETH

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/EngineerMuhammadKhalid/chainguard.git
   cd chainguard/client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

### Deployment

To build and deploy the app to GitHub Pages:
```sh
npm run build
npm run deploy
```

## Usage

1. Open the app and connect your MetaMask wallet.
2. Upload an image/file. The file is pinned to IPFS and the reference is stored on-chain.
3. Use the "Share" button to grant access to other Ethereum addresses.
4. View files you have access to in the display section.

## Smart Contract

The core logic is in the `Upload.sol` smart contract, which manages file references and access control. The contract ABI and deployment details are in `src/artifacts/contracts/Upload.sol/Upload.json`.

## Project Structure

- `src/components/` — React components (FileUpload, Display, Modal)
- `src/artifacts/` — Compiled smart contract artifacts
- `public/` — Static assets and HTML
- `build/` — Production build output

## Security Notes

- Do **not** expose sensitive API keys in client-side code.
- Only interact with trusted endpoints (e.g., Pinata, Infura).
- Always use HTTPS for API calls.

## License

This project is for educational and research purposes.
