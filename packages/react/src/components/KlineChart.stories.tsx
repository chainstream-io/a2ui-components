import React, { useEffect, useState, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KlineChart, type KlineBar } from './KlineChart';

const meta: Meta<typeof KlineChart> = {
  title: 'Mock/KlineChart',
  component: KlineChart,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof KlineChart>;

// --- Mock data generators ---

function generateKlineData(count: number, startPrice = 100, intervalSec = 3600): KlineBar[] {
  const now = Math.floor(Date.now() / 1000);
  let price = startPrice;

  return Array.from({ length: count }, (_, i) => {
    const open = price;
    const change = (Math.random() - 0.48) * startPrice * 0.03;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * startPrice * 0.015;
    const low = Math.min(open, close) - Math.random() * startPrice * 0.015;
    const volume = (Math.random() * 5 + 0.5) * 1e6;
    price = close;

    return {
      time: now - (count - i) * intervalSec,
      open: +open.toFixed(4),
      high: +high.toFixed(4),
      low: +low.toFixed(4),
      close: +close.toFixed(4),
      volume: +volume.toFixed(0),
    };
  });
}

const staticData = generateKlineData(200, 187, 3600);

// --- Stories ---

export const Default: Story = {
  args: {
    data: staticData,
    width: 900,
    height: 550,
    showVolume: true,
    showToolbar: true,
    showCrosshairInfo: true,
  },
};

export const WithoutVolume: Story = {
  args: {
    data: staticData,
    width: 900,
    height: 500,
    showVolume: false,
    showToolbar: true,
  },
};

export const MinimalChart: Story = {
  args: {
    data: generateKlineData(80, 0.0000234, 300),
    width: 600,
    height: 350,
    showVolume: false,
    showToolbar: false,
    showCrosshairInfo: false,
  },
};

export const AllResolutions: Story = {
  args: {
    data: generateKlineData(120, 50, 60),
    width: 900,
    height: 550,
    resolutions: ['1s', '15s', '30s', '1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'],
    initialResolution: '5m',
  },
};

// Live simulation story using a wrapper component
function LiveSimulationWrapper() {
  const [data, setData] = useState<KlineBar[]>(() => generateKlineData(100, 187, 60));
  const [latestBar, setLatestBar] = useState<KlineBar | null>(null);
  const priceRef = useRef(data[data.length - 1]?.close ?? 187);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const currentMinute = now - (now % 60);
      const prev = priceRef.current;
      const change = (Math.random() - 0.48) * prev * 0.005;
      const close = prev + change;
      const high = Math.max(prev, close) + Math.random() * prev * 0.002;
      const low = Math.min(prev, close) - Math.random() * prev * 0.002;
      const volume = (Math.random() * 2 + 0.2) * 1e5;
      priceRef.current = close;

      const bar: KlineBar = {
        time: currentMinute,
        open: +prev.toFixed(4),
        high: +high.toFixed(4),
        low: +low.toFixed(4),
        close: +close.toFixed(4),
        volume: +volume.toFixed(0),
      };

      setLatestBar(bar);
      setData((d) => {
        const last = d[d.length - 1];
        if (last && last.time === bar.time) {
          const merged = {
            ...bar,
            open: last.open,
            high: Math.max(last.high, bar.high),
            low: Math.min(last.low, bar.low),
            volume: last.volume + bar.volume,
          };
          return [...d.slice(0, -1), merged];
        }
        return [...d, bar];
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-2 text-xs text-muted-foreground">
        Simulating real-time updates every 800ms (1m candles)
      </div>
      <KlineChart
        data={data}
        latestBar={latestBar}
        width={900}
        height={550}
        showVolume={true}
        showToolbar={true}
        resolutions={['1m', '5m', '15m', '1h']}
        initialResolution="1m"
        autoScroll={true}
      />
    </div>
  );
}

export const LiveSimulation: Story = {
  render: () => <LiveSimulationWrapper />,
};
