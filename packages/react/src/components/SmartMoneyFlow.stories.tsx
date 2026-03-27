import type { Meta, StoryObj } from '@storybook/react';
import { SmartMoneyFlow } from './SmartMoneyFlow';

const meta: Meta<typeof SmartMoneyFlow> = {
  title: 'Charts/SmartMoneyFlow',
  component: SmartMoneyFlow,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof SmartMoneyFlow>;

export const Default: Story = {
  args: {
    nodes: [
      { id: 'whale-a', label: 'Whale A' },
      { id: 'whale-b', label: 'Whale B' },
      { id: 'whale-c', label: 'Whale C' },
      { id: 'sol', label: 'SOL' },
      { id: 'bonk', label: 'BONK' },
      { id: 'wif', label: 'WIF' },
      { id: 'jup', label: 'JUP' },
    ],
    links: [
      { source: 'whale-a', target: 'sol', value: 500000 },
      { source: 'whale-a', target: 'bonk', value: 200000 },
      { source: 'whale-b', target: 'sol', value: 300000 },
      { source: 'whale-b', target: 'wif', value: 450000 },
      { source: 'whale-b', target: 'jup', value: 150000 },
      { source: 'whale-c', target: 'bonk', value: 350000 },
      { source: 'whale-c', target: 'jup', value: 250000 },
    ],
    width: 800,
    height: 500,
  },
};

export const Simple: Story = {
  args: {
    nodes: [
      { id: 'src', label: 'Smart Money' },
      { id: 'token-a', label: 'Token A' },
      { id: 'token-b', label: 'Token B' },
    ],
    links: [
      { source: 'src', target: 'token-a', value: 800000 },
      { source: 'src', target: 'token-b', value: 200000 },
    ],
    width: 600,
    height: 350,
  },
};
