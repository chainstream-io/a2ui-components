import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TopTraderTable } from './TopTraderTable';
import { useTopTraders } from '@/hooks/useTopTraders';
import { getSdk, DEMO_TOKENS } from '@sb/sdk';

const meta: Meta<typeof TopTraderTable> = {
  title: 'Live/TopTraderTable',
  component: TopTraderTable,
  parameters: { layout: 'centered' },
};
export default meta;

function LiveTopTraders({ chain, tokenAddress }: { chain: string; tokenAddress: string }) {
  const sdk = getSdk();
  const { data, isLoading, error } = useTopTraders({ sdk, chain, tokenAddress, limit: 15 });

  if (error) return <div className="text-loss text-sm p-4">Error: {error.message}</div>;
  if (isLoading) return <div className="text-muted-foreground text-sm p-4">Loading top traders...</div>;

  return <TopTraderTable traders={data} maxRows={15} />;
}

export const SOL_TopTraders: StoryObj = {
  render: () => <LiveTopTraders chain={DEMO_TOKENS.SOL.chain} tokenAddress={DEMO_TOKENS.SOL.address} />,
};

export const BONK_TopTraders: StoryObj = {
  render: () => <LiveTopTraders chain={DEMO_TOKENS.BONK.chain} tokenAddress={DEMO_TOKENS.BONK.address} />,
};
