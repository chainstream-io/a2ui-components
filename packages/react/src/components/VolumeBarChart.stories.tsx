import type { Meta, StoryObj } from '@storybook/react';
import { VolumeBarChart } from './VolumeBarChart';
import { THEME } from '@/lib/chart-colors';

const meta: Meta<typeof VolumeBarChart> = {
  title: 'Mock/VolumeBarChart',
  component: VolumeBarChart,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof VolumeBarChart>;

function generateVolumeData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    time: 1700000000 + i * 3600,
    volume: Math.random() * 5e6 + 1e5,
    color: Math.random() > 0.5 ? `${THEME.profit}80` : `${THEME.loss}80`,
  }));
}

export const Default: Story = {
  args: {
    data: generateVolumeData(60),
    width: 700,
    height: 300,
  },
};

export const HighVolume: Story = {
  args: {
    data: Array.from({ length: 40 }, (_, i) => ({
      time: 1700000000 + i * 3600,
      volume: (i > 20 && i < 30 ? 1e7 : 2e6) + Math.random() * 1e6,
      color: i > 20 && i < 30 ? `${THEME.warning}80` : `${THEME.info}80`,
    })),
    width: 700,
    height: 300,
  },
};
