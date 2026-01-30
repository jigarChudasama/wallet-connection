import { http } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { chainList } from './chainConfig'

// Get a project ID at https://cloud.reown.com
export const projectId = '90973c606815134be36df5bbf2f4eb13'

export const networks = chainList

const transports = Object.fromEntries(
  networks.map(chain => [chain.id, http()])
)

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  transports
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'wallet connection',
    description: 'AppKit Example',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  }
})