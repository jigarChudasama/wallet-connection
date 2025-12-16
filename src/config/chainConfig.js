import { NETWORK_TYPE } from '../utils/constant';
import { mainnet, sepolia, bsc, bscTestnet, polygon, polygonAmoy } from '@reown/appkit/networks';

export const chainTypes = {
    BNB: 'BNB',
    ETH: 'ETH',
    POLYGON: 'POLYGON'
};

export const chains = NETWORK_TYPE === 'mainnet' ?
    {
        [chainTypes.BNB]: bsc,
        [chainTypes.ETH]: mainnet,
        [chainTypes.POLYGON]: polygon
    }
    :
    {
        [chainTypes.BNB]: bscTestnet,
        [chainTypes.ETH]: sepolia,
        [chainTypes.POLYGON]: polygonAmoy
    };

// Convert object to an array for AppKit
export const chainList = Object.values(chains);