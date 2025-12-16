import { NETWORK_TYPE } from '../utils/constant';

import {
    // Mainnets
    mainnet,
    bsc,
    polygon,
    arbitrum,
    optimism,
    avalanche,
    base,

    // Testnets
    sepolia,
    bscTestnet,
    polygonAmoy,
    arbitrumSepolia,
    optimismSepolia,
    avalancheFuji,
    baseSepolia
} from '@reown/appkit/networks';

export const chainTypes = {
    ETH: 'ETH',
    BNB: 'BNB',
    POLYGON: 'POLYGON',
    ARBITRUM: 'ARBITRUM',
    OPTIMISM: 'OPTIMISM',
    AVALANCHE: 'AVALANCHE',
    BASE: 'BASE'
};

export const chains = NETWORK_TYPE === 'mainnet' ?
    {
        [chainTypes.ETH]: mainnet,
        [chainTypes.BNB]: bsc,
        [chainTypes.POLYGON]: polygon,
        [chainTypes.ARBITRUM]: arbitrum,
        [chainTypes.OPTIMISM]: optimism,
        [chainTypes.AVALANCHE]: avalanche,
        [chainTypes.BASE]: base
    }
    :
    // ================= TESTNET (Fake Money) =================
    {
        [chainTypes.ETH]: sepolia,
        [chainTypes.BNB]: bscTestnet,
        [chainTypes.POLYGON]: polygonAmoy,
        [chainTypes.ARBITRUM]: arbitrumSepolia,
        [chainTypes.OPTIMISM]: optimismSepolia,
        [chainTypes.AVALANCHE]: avalancheFuji,
        [chainTypes.BASE]: baseSepolia
    };

// 4. Export the list for AppKit
export const chainList = Object.values(chains);