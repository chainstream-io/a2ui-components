import React from 'react';

export interface HolderPieChartProps {
  data: Array<{ address: string; percentage: number; label?: string }>;
  width?: number;
  height?: number;
}

export const HolderPieChart: React.FC<HolderPieChartProps> = ({ data, width = 400, height = 400 }) => {
  return <div style={{ width, height }} data-component="HolderPieChart" />;
};
