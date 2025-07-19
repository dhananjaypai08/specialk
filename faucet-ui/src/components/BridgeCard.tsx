'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { sepolia } from 'wagmi/chains'
import { ArrowDown, ExternalLink, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import BridgeContractABI from '@/abi/BridgeContract.json'
import { TATARA_TESTNET_ID } from '@/config/wagmi'

const CONTRACT_ADDRESS = '0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

type TransactionState = 'idle' | 'wallet-confirmation' | 'transaction-submitted' | 'confirming' | 'confirmed' | 'error'

export function BridgeCard() {
  const { address, isConnected, chain } = useAccount()
  const [amount, setAmount] = useState('')
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [transactionState, setTransactionState] = useState<TransactionState>('idle')

  const { 
    writeContract, 
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite
  } = useWriteContract()
  
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash: transactionHash,
  })

  const isCorrectNetwork = chain?.id === sepolia.id
  const canBridge = isConnected && isCorrectNetwork && amount && parseFloat(amount) > 0 && transactionState === 'idle'

  // Handle transaction state transitions
  useEffect(() => {
    if (writeError || receiptError) {
      setTransactionState('error')
      setError(writeError?.message || receiptError?.message || 'Transaction failed')
    } else if (isConfirmed && transactionHash) {
      setTransactionState('confirmed')
    } else if (isConfirming && transactionHash) {
      setTransactionState('confirming')
    } else if (transactionHash && !isConfirming) {
      setTransactionState('transaction-submitted')
    } else if (isWritePending) {
      setTransactionState('wallet-confirmation')
    }
  }, [writeError, receiptError, isConfirmed, isConfirming, transactionHash, isWritePending])

  const handleBridge = async () => {
    if (!canBridge || !address) return

    try {
      // Reset previous state
      setError(null)
      setTransactionHash(undefined)
      resetWrite()
      setTransactionState('wallet-confirmation')
      
      const amountInWei = parseEther(amount)
      
      // This will trigger MetaMask and wait for user confirmation
      const hash: any = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: BridgeContractABI.abi,
        functionName: 'bridgeAsset',
        args: [
          TATARA_TESTNET_ID,
          address,
          amountInWei,
          ZERO_ADDRESS,
          true,
          '0x'
        ],
        value: amountInWei,
      })

      // This only executes AFTER user confirms in MetaMask
      if (hash) {
        setTransactionHash(hash)
        setTransactionState('transaction-submitted')
      }
    } catch (err: any) {
      console.error('Bridge error:', err)
      setTransactionState('error')
      
      // Handle user rejection specifically
      if (err.message?.includes('User rejected') || err.message?.includes('rejected')) {
        setError('Transaction rejected by user')
      } else {
        setError(err.shortMessage || err.message || 'Transaction failed')
      }
    }
  }

  const getSepoliaExplorerUrl = (hash: string) => {
    return `https://sepolia.etherscan.io/tx/${hash}`
  }

  const resetForm = () => {
    setAmount('')
    setTransactionHash(undefined)
    setError(null)
    setTransactionState('idle')
    resetWrite()
  }

  const getButtonContent = () => {
    switch (transactionState) {
      case 'wallet-confirmation':
        return (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Waiting for wallet confirmation...</span>
          </div>
        )
      case 'transaction-submitted':
        return (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Transaction submitted...</span>
          </div>
        )
      case 'confirming':
        return (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Confirming transaction...</span>
          </div>
        )
      case 'confirmed':
        return (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-white" />
            <span>Bridge Successful!</span>
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4 text-white" />
            <span>Try Again</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center gap-2">
            <span>Bridge ETH</span>
            <div className="transition-transform group-hover:translate-x-1">
              →
            </div>
          </div>
        )
    }
  }

  const getButtonColor = () => {
    switch (transactionState) {
      case 'confirmed':
        return 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
      case 'error':
        return 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
      default:
        return 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
    }
  }

  const isButtonDisabled = !canBridge || ['wallet-confirmation', 'transaction-submitted', 'confirming'].includes(transactionState)

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bridge ETH</h2>
        <p className="text-gray-600 text-sm">Bridge your ETH from Sepolia to Tatara Testnet</p>
      </div>

      {/* Source Network */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">From</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Ethereum Sepolia</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-2xl font-semibold bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 focus:placeholder-gray-300 transition-colors"
              disabled={transactionState !== 'idle'}
              step="0.001"
              min="0"
            />
          </div>
          <div className="bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-700">ETH</span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-4">
        <div className="bg-blue-50 p-3 rounded-full border border-blue-100 shadow-sm">
          <ArrowDown className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Destination Network */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">To</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Tatara Testnet</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <span className="text-2xl font-semibold text-gray-900">
              {amount || '0.0'}
            </span>
          </div>
          <div className="bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-700">ETH</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {transactionState === 'error' && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Transaction Submitted */}
      {transactionState === 'transaction-submitted' && transactionHash && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            <span className="text-sm font-medium text-blue-800">Transaction Submitted</span>
          </div>
          <p className="text-xs text-blue-700 mb-2">Your transaction has been submitted to the network and is being processed.</p>
          <a
            href={getSepoliaExplorerUrl(transactionHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            View on Etherscan
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Transaction Confirming */}
      {transactionState === 'confirming' && transactionHash && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
            <span className="text-sm font-medium text-yellow-800">Confirming Transaction</span>
          </div>
          <p className="text-xs text-yellow-700 mb-2">Waiting for network confirmation...</p>
          <a
            href={getSepoliaExplorerUrl(transactionHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            View on Etherscan
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Success Message */}
      {transactionState === 'confirmed' && transactionHash && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-800">Bridge Successful!</span>
          </div>
          <div className="space-y-2">
            <a
              href={getSepoliaExplorerUrl(transactionHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800 transition-colors"
            >
              View on Etherscan
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="text-xs text-gray-600">
              ⏰ The bridge takes 30 minutes to 1 hour for tokens to reach your destination chain.
            </p>
          </div>
          <button
            onClick={resetForm}
            className="mt-3 text-sm text-gray-600 hover:text-gray-800 underline transition-colors"
          >
            Bridge again
          </button>
        </div>
      )}

      {/* Bridge Button */}
      {!isConnected ? (
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <span className="text-gray-600">Connect your wallet to bridge</span>
        </div>
      ) : !isCorrectNetwork ? (
        <div className="bg-orange-100 rounded-xl p-4 text-center">
          <span className="text-orange-700">Please switch to Sepolia network</span>
        </div>
      ) : (
        <button
          onClick={transactionState === 'confirmed' ? resetForm : handleBridge}
          disabled={isButtonDisabled}
          className={`group relative w-full bg-gradient-to-r ${getButtonColor()} disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none shadow-md hover:shadow-lg disabled:shadow-none`}
        >
          {getButtonContent()}
        </button>
      )}

      {/* Bridge Info */}
      <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
        <p>Bridge fees may apply • Estimated time: 30min - 1hr</p>
        <p>Destination address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
      </div>
    </div>
  )
}