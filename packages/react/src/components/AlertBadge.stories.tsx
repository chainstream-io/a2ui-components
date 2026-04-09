import type { Meta, StoryObj } from '@storybook/react';
import { AlertBadge } from './AlertBadge';

const meta: Meta<typeof AlertBadge> = {
  title: 'Mock/AlertBadge',
  component: AlertBadge,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof AlertBadge>;

export const Info: Story = {
  args: {
    type: 'info',
    message: 'New listing detected on Raydium',
    timestamp: Date.now(),
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'Top holder owns 45% of supply',
    timestamp: Date.now(),
  },
};

export const Danger: Story = {
  args: {
    type: 'danger',
    message: 'Honeypot risk — sell tax 99%',
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Audit passed by CertiK',
    timestamp: Date.now(),
  },
};
