import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PriceLineChart } from './PriceLineChart';
import { VolumeBarChart } from './VolumeBarChart';
import { useTokenPriceHistory } from '@/hooks/useTokenPriceHistory';
import { getSdk, DEMO_TOKENS } from '@sb/sdk';

const meta: Meta<typeof PriceLineChart> = {
  title: 'Live/PriceLineChart',
  component: PriceLineChart,
  parameters: { layout: 'centered' },
};
export default meta;

function LivePriceLine({ chain, tokenAddress, resolution }: { chain: string; tokenAddress: string; resolution: string }) {
  const sdk = getSdk();
  const { priceData, isLoading, error } = useTokenPriceHistory({ sdk, chain, tokenAddress, resolution });

  if (error) return <div className="text-loss text-sm p-4">Error: {error.message}</div>;
  if (isLoading) return <div className="text-muted-foreground text-sm p-4">Loading price history...</div>;

  return <PriceLineChart data={priceData} width={700} height={400} />;
}

function LiveVolumeBar({ chain, tokenAddress, resolution }: { chain: string; tokenAddress: string; resolution: string }) {
  const sdk = getSdk();
  const { volumeData, isLoading, error } = useTokenPriceHistory({ sdk, chain, tokenAddress, resolution });

  if (error) return <div className="text-loss text-sm p-4">Error: {error.message}</div>;
  if (isLoading) return <div className="text-muted-foreground text-sm p-4">Loading volume data...</div>;

  return <VolumeBarChart data={volumeData} width={700} height={300} />;
}

export const SOL_Daily: StoryObj = {
  render: () => <LivePriceLine chain={DEMO_TOKENS.SOL.chain} tokenAddress={DEMO_TOKENS.SOL.address} resolution="1d" />,
};

export const BONK_Hourly: StoryObj = {
  render: () => <LivePriceLine chain={DEMO_TOKENS.BONK.chain} tokenAddress={DEMO_TOKENS.BONK.address} resolution="1h" />,
};

export const SOL_Volume: StoryObj = {
  name: 'SOL Volume (VolumeBarChart)',
  render: () => <LiveVolumeBar chain={DEMO_TOKENS.SOL.chain} tokenAddress={DEMO_TOKENS.SOL.address} resolution="1h" />,
};
