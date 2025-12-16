// src/App.jsx
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiAdapter } from './config' // Import from step 2
import Home from './components/Home'

const queryClient = new QueryClient()

export default function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Home /> 
      </QueryClientProvider>
    </WagmiProvider>
  )
}