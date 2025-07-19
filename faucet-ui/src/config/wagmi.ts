import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const TATARA_TESTNET_ID = 129399

export const tataraTestnet = {
  id: TATARA_TESTNET_ID,
  name: 'Tatara Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.tatara.katanarpc.com/EkFpgodKgurRLx9b7hZvug5sZFWrTrt5K'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tatara Explorer',
      url: 'https://explorer.tatara.katana.network',
    },
  },
  testnet: true,
} as const

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}