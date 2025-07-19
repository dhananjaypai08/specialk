import { Navbar } from '@/components/Navbar'
import { BridgeCard } from '@/components/BridgeCard'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <BridgeCard />
      </main>
      <Footer />
    </div>
  )
}