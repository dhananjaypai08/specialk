'use client'

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { Wallet, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navbar() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const isCorrectNetwork = chain?.id === sepolia.id

  useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      switchChain({ chainId: sepolia.id })
    }
  }, [isConnected, isCorrectNetwork, switchChain])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConnect = () => {
    const injectedConnector = connectors.find(connector => connector.id === 'injected')
    if (injectedConnector) {
      connect({ connector: injectedConnector })
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900">Tatara Bridge Faucet</span>
          </div>

          {/* Wallet Connection */}
          <div className="relative">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{formatAddress(address!)}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                      Network: {chain?.name || 'Unknown'}
                    </div>
                    {!isCorrectNetwork && (
                      <button
                        onClick={() => switchChain({ chainId: sepolia.id })}
                        className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-50"
                      >
                        Switch to Sepolia
                      </button>
                    )}
                    <button
                      onClick={() => {
                        disconnect()
                        setIsDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}