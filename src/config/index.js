// src/config/index.js

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { chainList } from './chainConfig'

// 1. Get a project ID at https://cloud.reown.com
export const projectId = '90973c606815134be36df5bbf2f4eb13'

// 2. Set up the networks you want to support
export const networks = chainList

// 3. Set up the Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// 4. Create the AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'wallet connection',
    description: 'AppKit Example',
    // url: 'https://myapp.com',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  }
})