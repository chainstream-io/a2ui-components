import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TokenCard } from './TokenCard';
import { useTokenAnalytics } from '@/hooks/useTokenAnalytics';
import { getSdk, DEMO_TOKENS } from '@sb/sdk';

const meta: Meta<typeof TokenCard> = {
  title: 'Live/TokenCard',
  component: TokenCard,
  parameters: { layout: 'centered' },
};
export default meta;

function LiveTokenCard({ chain, tokenAddress }: { chain: string; tokenAddress: string }) {
  const sdk = getSdk();
  const { overview, isLoading, error } = useTokenAnalytics({ sdk, chain, tokenAddress });

  if (error) return <div className="text-loss text-sm p-4">Error: {error.message}</div>;
  if (isLoading || !overview) return <div className="text-muted-foreground text-sm p-4">Loading token data...</div>;

  return (
    <TokenCard
      name={overview.name}
      symbol={overview.symbol}
      price={overview.price}
      change24h={overview.priceChange24h}
      marketCap={overview.marketCap}
      logoUrl={overview.logoUrl}
    />
  );
}

export const SOL: StoryObj = {
  render: () => <LiveTokenCard chain={DEMO_TOKENS.SOL.chain} tokenAddress={DEMO_TOKENS.SOL.address} />,
};

export const BONK: StoryObj = {
  render: () => <LiveTokenCard chain={DEMO_TOKENS.BONK.chain} tokenAddress={DEMO_TOKENS.BONK.address} />,
};

export const WIF: StoryObj = {
  render: () => <LiveTokenCard chain={DEMO_TOKENS.WIF.chain} tokenAddress={DEMO_TOKENS.WIF.address} />,
};
