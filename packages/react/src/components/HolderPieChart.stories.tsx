import type { Meta, StoryObj } from '@storybook/react';
import { HolderPieChart } from './HolderPieChart';

const meta: Meta<typeof HolderPieChart> = {
  title: 'Mock/HolderPieChart',
  component: HolderPieChart,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof HolderPieChart>;

export const Default: Story = {
  args: {
    data: [
      { address: '0xdead...beef', percentage: 25, label: 'Deployer' },
      { address: '0xaaaa...1111', percentage: 18, label: 'Binance' },
      { address: '0xbbbb...2222', percentage: 12, label: 'Whale A' },
      { address: '0xcccc...3333', percentage: 10, label: 'Whale B' },
      { address: '0xdddd...4444', percentage: 8 },
      { address: '0xeeee...5555', percentage: 7 },
      { address: '0xffff...6666', percentage: 6 },
      { address: '0x1111...7777', percentage: 5 },
      { address: '0x2222...8888', percentage: 5 },
      { address: '0x3333...9999', percentage: 4 },
    ],
    width: 450,
    height: 450,
  },
};

export const Concentrated: Story = {
  args: {
    data: [
      { address: '0xdead...beef', percentage: 65, label: 'Top Holder' },
      { address: '0xaaaa...1111', percentage: 20, label: 'Second' },
      { address: '0xbbbb...2222', percentage: 15, label: 'Others' },
    ],
    width: 400,
    height: 400,
  },
};
