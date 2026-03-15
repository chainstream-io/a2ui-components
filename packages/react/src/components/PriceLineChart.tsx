import React from 'react';

export interface PriceLineChartProps {
  data: Array<{ time: number; value: number }>;
  width?: number;
  height?: number;
  color?: string;
}

export const PriceLineChart: React.FC<PriceLineChartProps> = ({ data, width = 600, height = 400, color = '#2196F3' }) => {
  return <div style={{ width, height }} data-component="PriceLineChart" />;
};
