import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TokenListTable } from './TokenListTable';
import { useMarketTrending } from '@/hooks/useMarketTrending';
import { useTokenSearch } from '@/hooks/useTokenSearch';
import { getSdk } from '@sb/sdk';

const meta: Meta<typeof TokenListTable> = {
  title: 'Live/TokenListTable',
  component: TokenListTable,
  parameters: { layout: 'centered' },
};
export default meta;

function LiveTrending() {
  const sdk = getSdk();
  const { data, isLoading, error } = useMarketTrending({ sdk, chain: 'solana', category: 'hot', limit: 20 });

  if (error) return <div className="text-loss text-sm p-4">Error: {error.message}</div>;
  if (isLoading) return <div className="text-muted-foreground text-sm p-4">Loading trending tokens...</div>;

  return <TokenListTable tokens={data} maxRows={20} />;
}

function LiveSearch() {
  const sdk = getSdk();
  const { data, isLoading, error } = useTokenSearch({ sdk, query: 'sol', limit: 10 });

  if (error) return <div className="text-loss text-sm p-4">Error: {error.message}</div>;
  if (isLoading) return <div className="text-muted-foreground text-sm p-4">Searching tokens...</div>;

  const tokens = data.map((t) => ({ ...t, change24h: t.priceChange24h }));
  return <TokenListTable tokens={tokens} />;
}

export const SolanaTrending: StoryObj = {
  render: () => <LiveTrending />,
};

export const SearchSOL: StoryObj = {
  render: () => <LiveSearch />,
};
