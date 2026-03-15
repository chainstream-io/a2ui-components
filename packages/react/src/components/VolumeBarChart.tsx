import React from 'react';

export interface VolumeBarChartProps {
  data: Array<{ time: number; volume: number; color?: string }>;
  width?: number;
  height?: number;
}

export const VolumeBarChart: React.FC<VolumeBarChartProps> = ({ data, width = 600, height = 300 }) => {
  return <div style={{ width, height }} data-component="VolumeBarChart" />;
};
