'use client'

import { ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            <p>© 2025 Specialk. Built for Sepolia ↔ Tatara Testnet.</p>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://sepolia.etherscan.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
            >
              Sepolia Explorer
              <ExternalLink className="h-3 w-3" />
            </a>
            
            <a
              href="https://docs.katana.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
            >
              Documentation
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href="https://t.me/katanadevs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
            >
              Telegram
              <ExternalLink className="h-3 w-3" />
            </a>
            
            <div className="text-gray-400">
              <span className="inline-flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}