import React, { useEffect, useRef, useCallback } from 'react';
import { createChart, ColorType, type IChartApi, type ISeriesApi } from 'lightweight-charts';
import { THEME } from '@/lib/chart-colors';
import { useResponsiveChartWidth } from '@/lib/use-responsive-chart-width';

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);
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
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: THEME.border },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: THEME.border },
    });

    const series = chart.addLineSeries({
      color,
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
    });

    chartRef.current = chart;
    seriesRef.current = series;
  }, [chartWidth, height, color]);

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
    seriesRef.current.setData(data.map((d) => ({ time: d.time as any, value: d.value })));
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
      data-component="PriceLineChart"
      style={{ maxWidth: width }}
    >
      <div ref={containerRef} className="w-full min-w-0" />
    </div>
  );
};
