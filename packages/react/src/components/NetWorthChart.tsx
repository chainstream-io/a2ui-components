import React, { useEffect, useRef, useCallback } from 'react';
import { createChart, ColorType, type IChartApi, type ISeriesApi } from 'lightweight-charts';
import { THEME } from '@/lib/chart-colors';

export interface NetWorthDataPoint {
  time: number;
  value: number;
}

export interface NetWorthChartProps {
  data: NetWorthDataPoint[];
  width?: number;
  height?: number;
  className?: string;
}

export const NetWorthChart: React.FC<NetWorthChartProps> = ({
  data,
  width = 600,
  height = 300,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  const isPositiveTrend = data.length >= 2 && data[data.length - 1].value >= data[0].value;
  const lineColor = isPositiveTrend ? THEME.profit : THEME.loss;

  const initChart = useCallback(() => {
    if (!containerRef.current) return;
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: THEME.foreground,
      },
      grid: {
        vertLines: { color: THEME.gridLine },
        horzLines: { color: THEME.gridLine },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      crosshair: { mode: 0 },
      timeScale: { timeVisible: true, secondsVisible: false, borderVisible: false },
    });

    const series = chart.addAreaSeries({
      lineColor,
      topColor: `${lineColor}40`,
      bottomColor: `${lineColor}05`,
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          if (price >= 1e6) return `$${(price / 1e6).toFixed(1)}M`;
          if (price >= 1e3) return `$${(price / 1e3).toFixed(1)}K`;
          return `$${price.toFixed(2)}`;
        },
      },
    });

    chartRef.current = chart;
    seriesRef.current = series;
  }, [width, height, lineColor]);

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
      data.map((d) => ({ time: d.time as any, value: d.value })),
    );
    chartRef.current.timeScale().fitContent();
  }, [data]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({ width, height });
    }
  }, [width, height]);

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ width, height }}
      >
        No net worth data
      </div>
    );
  }

  const latest = data[data.length - 1].value;
  const earliest = data[0].value;
  const change = earliest > 0 ? ((latest - earliest) / earliest) * 100 : 0;

  return (
    <div className={className} data-component="NetWorthChart">
      <div className="mb-2 flex items-baseline gap-3 px-1">
        <span className="text-lg font-bold tabular-nums text-foreground">
          ${latest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        {change !== 0 && (
          <span className={`text-sm font-medium tabular-nums ${isPositiveTrend ? 'text-profit' : 'text-loss'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        )}
      </div>
      <div ref={containerRef} />
    </div>
  );
};
