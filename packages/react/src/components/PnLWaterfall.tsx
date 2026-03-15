import React from 'react';

export interface PnLWaterfallProps {
  data: Array<{ label: string; value: number; type: 'profit' | 'loss' | 'total' }>;
  width?: number;
  height?: number;
}

export const PnLWaterfall: React.FC<PnLWaterfallProps> = ({ data, width = 600, height = 400 }) => {
  return <div style={{ width, height }} data-component="PnLWaterfall" />;
};
