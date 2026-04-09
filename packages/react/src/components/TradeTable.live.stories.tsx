import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TradeTable } from './TradeTable';
import { useRecentTrades } from '@/hooks/useRecentTrades';
import { getSdk, DEMO_TOKENS } from '@sb/sdk';

const meta: Meta<typeof TradeTable> = {
  title: 'Live/TradeTable',
  component: TradeTable,
  parameters: { layout: 'centered' },
};
export default meta;

function LiveTrades({ chain, tokenAddress }: { chain: string; tokenAddress: string }) {
  const sdk = getSdk();
  const { data, isLoading, error } = useRecentTrades({ sdk, chain, tokenAddress, limit: 20 });

  if (error) return <div className="text-loss text-sm p-4">Error: {error.message}</div>;
  if (isLoading) return <div className="text-muted-foreground text-sm p-4">Loading trades...</div>;

  return <TradeTable trades={data} maxRows={20} />;
}

export const SOL_Trades: StoryObj = {
  render: () => <LiveTrades chain={DEMO_TOKENS.SOL.chain} tokenAddress={DEMO_TOKENS.SOL.address} />,
};

export const BONK_Trades: StoryObj = {
  render: () => <LiveTrades chain={DEMO_TOKENS.BONK.chain} tokenAddress={DEMO_TOKENS.BONK.address} />,
};
