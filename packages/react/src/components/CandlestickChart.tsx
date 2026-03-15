import React from 'react';

export interface CandlestickChartProps {
  data: Array<{ time: number; open: number; high: number; low: number; close: number; volume?: number }>;
  width?: number;
  height?: number;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, width = 600, height = 400 }) => {
  // TradingView Lightweight Charts integration
  return <div style={{ width, height }} data-component="CandlestickChart" />;
};
