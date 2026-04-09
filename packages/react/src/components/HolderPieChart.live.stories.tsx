import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HolderPieChart } from './HolderPieChart';
import { useTokenHolders } from '@/hooks/useTokenHolders';
import { getSdk, DEMO_TOKENS } from '@sb/sdk';

const meta: Meta<typeof HolderPieChart> = {
  title: 'Live/HolderPieChart',
  component: HolderPieChart,
  parameters: { layout: 'centered' },
};
export default meta;

function LiveHolders({ chain, tokenAddress }: { chain: string; tokenAddress: string }) {
  const sdk = getSdk();
  const { data, isLoading, error } = useTokenHolders({ sdk, chain, tokenAddress, limit: 10 });

  if (error) return <div className="text-loss text-sm p-4">Error: {error.message}</div>;
  if (isLoading) return <div className="text-muted-foreground text-sm p-4">Loading holders...</div>;

  return <HolderPieChart data={data} width={450} height={450} />;
}

export const BONK_Holders: StoryObj = {
  render: () => <LiveHolders chain={DEMO_TOKENS.BONK.chain} tokenAddress={DEMO_TOKENS.BONK.address} />,
};

export const WIF_Holders: StoryObj = {
  render: () => <LiveHolders chain={DEMO_TOKENS.WIF.chain} tokenAddress={DEMO_TOKENS.WIF.address} />,
};
