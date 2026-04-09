import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TokenStatsPanel } from './TokenStatsPanel';
import { useTokenAnalytics } from '@/hooks/useTokenAnalytics';
import { getSdk, DEMO_TOKENS } from '@sb/sdk';

const meta: Meta<typeof TokenStatsPanel> = {
  title: 'Live/TokenStatsPanel',
  component: TokenStatsPanel,
  parameters: { layout: 'centered' },
};
export default meta;

function LiveStats({ chain, tokenAddress }: { chain: string; tokenAddress: string }) {
  const sdk = getSdk();
  const { statsPeriods, isLoading, error } = useTokenAnalytics({ sdk, chain, tokenAddress });

  if (error) return <div className="text-loss text-sm p-4">Error: {error.message}</div>;
  if (isLoading) return <div className="text-muted-foreground text-sm p-4">Loading stats...</div>;

  return <TokenStatsPanel periods={statsPeriods} />;
}

export const SOL_Stats: StoryObj = {
  render: () => <LiveStats chain={DEMO_TOKENS.SOL.chain} tokenAddress={DEMO_TOKENS.SOL.address} />,
};

export const BONK_Stats: StoryObj = {
  render: () => <LiveStats chain={DEMO_TOKENS.BONK.chain} tokenAddress={DEMO_TOKENS.BONK.address} />,
};
