import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected, walletconnect } from '../connectors'

export const NETWORK_LABELS: { [chainId in number]?: string } = {
  1: 'Ethereum',  
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Görli',
  42: 'Kovan',
  56: 'Binance',
  137: 'Matic'
}

export const TOKEN_ADDRESS = '0xc18B0B4BC745Eeb8c5D890b705E47E96F38d92F4';
export const GOVERNOR_ADDRESS = '0xdf9524E97DeFbad4C5F6753Cd93A2a01463F0A60';

// export const GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs/';
// export const GATEWAY_URL = 'https://cloudflare-ipfs.com/ipfs/';

export const GATEWAY_URL = 'https://holidayreindeers.mypinata.cloud/ipfs/';
export const COLLECTION_HASH = '';
export const OWNER_COLLECTION_HASH = 'QmYJtGUfCj4WqpHX9DM8iVT452zEMewfukvAYcq5WvTM5s';
// export const GATEWAY_URL = 'https://dweb.link/ipfs/';

// export const MERGE_SPLIT_URL = 'http://localhost:3001/';
export const MERGE_SPLIT_URL = 'https://holiday-reindeer-art-engine.herokuapp.com/';
export const NFT_ADDRESS = '0xaccdb87ffdf78a59aa805207067838d3c771e322';
export const NFT_ELF_STATION_ADDRESS = '';
export const NFT_REINDEER_STAKING_ADDRESS = '';

export interface WalletInfo {
    connector?: AbstractConnector
    name: string
    iconName: string
    description: string
    href: string | null
    color: string
    primary?: true
    mobile?: true
    mobileOnly?: true
  }

  export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    INJECTED: {
      connector: injected,
      name: 'Injected',
      iconName: 'arrow-right.svg',
      description: 'Injected web3 provider.',
      href: null,
      color: '#010101',
      primary: true
    },
    METAMASK: {
      connector: injected,
      name: 'MetaMask',
      iconName: 'metamask.png',
      description: 'Easy-to-use browser extension.',
      href: null,
      color: '#E8831D'
    },
    WALLET_CONNECT: {
      connector: walletconnect,
      name: 'WalletConnect',
      iconName: 'walletConnectIcon.svg',
      description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
      href: null,
      color: '#4196FC',
      mobile: true
    }
  }

export const NetworkContextName = 'NETWORK'  
