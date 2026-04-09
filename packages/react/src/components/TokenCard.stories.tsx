import type { Meta, StoryObj } from '@storybook/react';
import { TokenCard } from './TokenCard';

const meta: Meta<typeof TokenCard> = {
  title: 'Mock/TokenCard',
  component: TokenCard,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof TokenCard>;

export const Bullish: Story = {
  args: {
    name: 'Solana',
    symbol: 'SOL',
    price: 187.42,
    change24h: 5.67,
    marketCap: 86_500_000_000,
    logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=040',
  },
};

export const Bearish: Story = {
  args: {
    name: 'Bonk',
    symbol: 'BONK',
    price: 0.0000234,
    change24h: -12.35,
    marketCap: 1_560_000_000,
  },
};

export const Flat: Story = {
  args: {
    name: 'USD Coin',
    symbol: 'USDC',
    price: 1.0,
    change24h: 0.01,
    marketCap: 33_000_000_000,
  },
};
