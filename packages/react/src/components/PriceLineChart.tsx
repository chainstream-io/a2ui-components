import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, type IChartApi } from 'lightweight-charts';
import { THEME } from '@/lib/chart-colors';

export interface PriceLineChartProps {
  data: Array<{ time: number; value: number }>;
  width?: number;
  height?: number;
  color?: string;
}

export const PriceLineChart: React.FC<PriceLineChartProps> = ({
  data,
  width = 600,
  height = 400,
  color = THEME.info,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: THEME.background },
        textColor: THEME.foreground,
      },
      grid: {
        vertLines: { color: THEME.gridLine },
        horzLines: { color: THEME.gridLine },
      },
      crosshair: { mode: 0 },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    const series = chart.addLineSeries({
      color,
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
    });

    series.setData(data.map((d) => ({ time: d.time as any, value: d.value })));
    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [data, width, height, color]);

  return <div ref={containerRef} data-component="PriceLineChart" />;
};
