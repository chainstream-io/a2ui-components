import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, type IChartApi } from 'lightweight-charts';
import { THEME } from '@/lib/chart-colors';

export interface VolumeBarChartProps {
  data: Array<{ time: number; volume: number; color?: string }>;
  width?: number;
  height?: number;
}

export const VolumeBarChart: React.FC<VolumeBarChartProps> = ({ data, width = 600, height = 300 }) => {
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
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    const series = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });

    series.setData(
      data.map((d) => ({
        time: d.time as any,
        value: d.volume,
        color: d.color ?? `${THEME.info}80`,
      })),
    );

    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [data, width, height]);

  return <div ref={containerRef} data-component="VolumeBarChart" />;
};
