import { ChainStreamClient } from '@chainstream-io/sdk';

const CS_API_KEY = (import.meta as any).env?.VITE_CHAINSTREAM_API_KEY ?? '';

let _sdk: ChainStreamClient | null = null;

export function getSdk(): ChainStreamClient {
  if (!_sdk) {
    _sdk = new ChainStreamClient('', {
      apiKey: CS_API_KEY,
      serverUrl: window.location.origin,
    });
  }
  return _sdk;
}

export const DEMO_TOKENS = {
  SOL:  { chain: 'sol', address: 'So11111111111111111111111111111111111111112' },
  BONK: { chain: 'sol', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
  WIF:  { chain: 'sol', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
  PEPE: { chain: 'eth', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933' },
} as const;

export const DEMO_WALLETS = {
  solanaWhale: { chain: 'sol', address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1' },
} as const;
