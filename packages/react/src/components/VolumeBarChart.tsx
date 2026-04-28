import React, { useEffect, useRef, useCallback } from 'react';
import { createChart, ColorType, type IChartApi, type ISeriesApi } from 'lightweight-charts';
import { THEME } from '@/lib/chart-colors';
import { useResponsiveChartWidth } from '@/lib/use-responsive-chart-width';

export interface VolumeBarChartProps {
  data: Array<{ time: number; volume: number; color?: string }>;
  width?: number;
  height?: number;
}

export const VolumeBarChart: React.FC<VolumeBarChartProps> = ({ data, width = 600, height = 300 }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const chartWidth = useResponsiveChartWidth(wrapperRef, width);

  const initChart = useCallback(() => {
    if (!containerRef.current) return;
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      width: chartWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: THEME.foreground,
      },
      grid: {
        vertLines: { color: THEME.gridLine },
        horzLines: { color: THEME.gridLine },
      },
      rightPriceScale: { borderColor: THEME.border },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: THEME.border },
    });

    const series = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });

    chartRef.current = chart;
    seriesRef.current = series;
  }, [chartWidth, height]);

  useEffect(() => {
    initChart();
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [initChart]);

  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;
    seriesRef.current.setData(
      data.map((d) => ({
        time: d.time as any,
        value: d.volume,
        color: d.color ?? `${THEME.info}80`,
      })),
    );
    chartRef.current.timeScale().fitContent();
  }, [data]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({ width: chartWidth, height });
    }
  }, [chartWidth, height]);

  return (
    <div
      ref={wrapperRef}
      className="w-full min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card/70 p-2 backdrop-blur-xl"
      data-component="VolumeBarChart"
      style={{ maxWidth: width }}
    >
      <div ref={containerRef} className="w-full min-w-0" />
    </div>
  );
};
