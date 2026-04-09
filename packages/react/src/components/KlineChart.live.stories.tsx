import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KlineChart } from './KlineChart';
import { useKlineData } from '@/hooks/useKlineData';
import { getSdk, DEMO_TOKENS } from '@sb/sdk';

const meta: Meta<typeof KlineChart> = {
  title: 'Live/KlineChart',
  component: KlineChart,
  parameters: { layout: 'centered' },
};
export default meta;

function LiveKline({ chain, tokenAddress, resolution }: { chain: string; tokenAddress: string; resolution: string }) {
  const sdk = getSdk();
  const { data, latestBar, isLoading, error } = useKlineData({
    sdk, chain, tokenAddress, resolution, limit: 200,
  });

  if (error) return <div className="text-loss text-sm p-4">Error: {error.message}</div>;
  if (isLoading && data.length === 0) return <div className="text-muted-foreground text-sm p-4">Loading real K-line data...</div>;

  return (
    <KlineChart
      data={data}
      latestBar={latestBar}
      width={900}
      height={550}
      showVolume
      showToolbar
      showCrosshairInfo
      initialResolution={resolution}
      autoScroll
    />
  );
}

export const SOL_15m: StoryObj = {
  render: () => <LiveKline chain={DEMO_TOKENS.SOL.chain} tokenAddress={DEMO_TOKENS.SOL.address} resolution="15m" />,
};

export const BONK_1h: StoryObj = {
  render: () => <LiveKline chain={DEMO_TOKENS.BONK.chain} tokenAddress={DEMO_TOKENS.BONK.address} resolution="1h" />,
};

export const WIF_5m: StoryObj = {
  render: () => <LiveKline chain={DEMO_TOKENS.WIF.chain} tokenAddress={DEMO_TOKENS.WIF.address} resolution="5m" />,
};
