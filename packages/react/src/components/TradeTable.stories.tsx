import type { Meta, StoryObj } from '@storybook/react';
import { TradeTable } from './TradeTable';

const meta: Meta<typeof TradeTable> = {
  title: 'Mock/TradeTable',
  component: TradeTable,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof TradeTable>;

function generateTrades(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const side = Math.random() > 0.5 ? 'buy' as const : 'sell' as const;
    const price = 180 + Math.random() * 10;
    const amount = Math.random() * 50;
    return {
      id: `t-${i}`,
      time: Date.now() - (count - i) * 5000,
      side,
      price: +price.toFixed(2),
      amount: +amount.toFixed(4),
      total: +(price * amount).toFixed(2),
    };
  });
}

export const Default: Story = {
  args: {
    trades: generateTrades(25),
  },
};

export const HighFrequency: Story = {
  args: {
    trades: generateTrades(100),
    maxRows: 20,
  },
};

export const Empty: Story = {
  args: {
    trades: [],
  },
};
