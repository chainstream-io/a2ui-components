import type { Meta, StoryObj } from '@storybook/react';
import { PriceLineChart } from './PriceLineChart';
import { THEME } from '@/lib/chart-colors';

const meta: Meta<typeof PriceLineChart> = {
  title: 'Mock/PriceLineChart',
  component: PriceLineChart,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof PriceLineChart>;

function generatePriceData(count: number, startPrice = 100) {
  let price = startPrice;
  return Array.from({ length: count }, (_, i) => {
    price += (Math.random() - 0.48) * 3;
    return { time: 1700000000 + i * 3600, value: Math.max(price, 1) };
  });
}

export const Default: Story = {
  args: {
    data: generatePriceData(100),
    width: 700,
    height: 400,
  },
};

export const CustomColor: Story = {
  args: {
    data: generatePriceData(80, 50),
    width: 700,
    height: 400,
    color: THEME.profit,
  },
};

export const ShortPeriod: Story = {
  args: {
    data: generatePriceData(20, 200),
    width: 500,
    height: 300,
  },
};
