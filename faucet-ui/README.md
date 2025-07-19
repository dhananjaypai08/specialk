# Tatara Faucet Bridge

A clean and modern bridge interface for transferring ETH from Ethereum Sepolia to Tatara Testnet. Built with Next.js, TypeScript, Tailwind CSS, and Wagmi.

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- A Web3 wallet (MetaMask recommended)
- Some Sepolia ETH for testing

## Installation & Setup

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd faucet-ui
bun install
```

2. **Environment Setup:**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your WalletConnect Project ID (optional):
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```


## Running the Application

```bash
# Development mode
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── abi/
│   └── BridgeContract.json          # Contract ABI and address
├── app/
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout with providers
│   ├── page.tsx                     # Main page
│   └── providers.tsx                # Wagmi and React Query providers
├── components/
│   ├── BridgeCard.tsx              # Main bridge interface
│   ├── Footer.tsx                  # Footer component
│   └── Navbar.tsx                  # Navigation with wallet connection
└── config/
    └── wagmi.ts                    # Wagmi configuration and chains
```

## Configuration Notes

### Network Configuration
- **Source**: Ethereum Sepolia (fixed)
- **Destination**: Tatara Testnet (fixed)
- **Token**: ETH only (native)

### Contract Interaction
The bridge calls the `bridgeAsset` function with these parameters:
- ETH amount is sent as `value` in the transaction
- Amount parameter is scaled by 10^8 as per requirements
- Uses zero address for native ETH token
- Forces global exit root update
- Empty permit data

## Troubleshooting

### Common Issues

1. **"Please switch to Sepolia network"**: The app only works on Sepolia testnet
2. **Contract call fails**: Ensure you have enough Sepolia ETH and the contract ABI is correct
3. **Wallet not connecting**: Try refreshing the page and ensuring MetaMask is unlocked

### Getting Sepolia ETH
- Use a Sepolia faucet like [sepoliafaucet.com](https://sepoliafaucet.com/)
- Ensure you're on the Sepolia network in your wallet
