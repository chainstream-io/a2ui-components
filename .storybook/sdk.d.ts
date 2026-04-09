declare module '@sb/sdk' {
  import type { ChainStreamClient } from '@chainstream-io/sdk';

  export function getSdk(): ChainStreamClient;

  export const DEMO_TOKENS: {
    SOL: { chain: 'sol'; address: string };
    BONK: { chain: 'sol'; address: string };
    WIF: { chain: 'sol'; address: string };
    PEPE: { chain: 'eth'; address: string };
  };

  export const DEMO_WALLETS: {
    solanaWhale: { chain: 'sol'; address: string };
  };
}
