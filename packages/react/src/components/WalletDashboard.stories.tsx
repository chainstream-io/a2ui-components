import type { Meta, StoryObj } from '@storybook/react';
import { WalletDashboard } from './WalletDashboard';

const meta: Meta<typeof WalletDashboard> = {
  title: 'UI/WalletDashboard',
  component: WalletDashboard,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof WalletDashboard>;

export const Default: Story = {
  args: {
    address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    totalValueUsd: 284_350.75,
    assets: [
      { symbol: 'SOL', balance: 1200, valueUsd: 224_400, change24h: 5.2 },
      { symbol: 'BONK', balance: 15_000_000, valueUsd: 35_100, change24h: -3.1 },
      { symbol: 'JUP', balance: 25_000, valueUsd: 18_750, change24h: 1.8 },
      { symbol: 'USDC', balance: 6_100, valueUsd: 6_100, change24h: 0.0 },
    ],
  },
};

export const SmallWallet: Story = {
  args: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    totalValueUsd: 520.3,
    assets: [
      { symbol: 'ETH', balance: 0.15, valueUsd: 480.3, change24h: 2.1 },
      { symbol: 'USDT', balance: 40, valueUsd: 40, change24h: 0.0 },
    ],
  },
};

export const EmptyWallet: Story = {
  args: {
    address: '0x0000000000000000000000000000000000000000',
    totalValueUsd: 0,
    assets: [],
  },
};
