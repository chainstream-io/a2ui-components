import type { Meta, StoryObj } from '@storybook/react';
import { PnLWaterfall } from './PnLWaterfall';

const meta: Meta<typeof PnLWaterfall> = {
  title: 'Mock/PnLWaterfall',
  component: PnLWaterfall,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof PnLWaterfall>;

export const Default: Story = {
  args: {
    data: [
      { label: 'SOL', value: 5200, type: 'profit' as const },
      { label: 'BONK', value: -1800, type: 'loss' as const },
      { label: 'WIF', value: 3100, type: 'profit' as const },
      { label: 'JUP', value: -900, type: 'loss' as const },
      { label: 'RNDR', value: 1500, type: 'profit' as const },
      { label: 'Fees', value: -350, type: 'loss' as const },
      { label: 'Net PnL', value: 6750, type: 'total' as const },
    ],
    width: 650,
    height: 400,
  },
};

export const AllLosses: Story = {
  args: {
    data: [
      { label: 'PEPE', value: -3200, type: 'loss' as const },
      { label: 'SHIB', value: -1500, type: 'loss' as const },
      { label: 'DOGE', value: -800, type: 'loss' as const },
      { label: 'Total', value: -5500, type: 'total' as const },
    ],
    width: 500,
    height: 350,
  },
};
