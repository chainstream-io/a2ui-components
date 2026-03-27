import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, CrosshairMode, type IChartApi, type ISeriesApi, type CandlestickData, type HistogramData, type Time } from 'lightweight-charts';
import { THEME } from '@/lib/chart-colors';
import { cn } from '@/lib/utils';
import { ResolutionBar } from './kline/ResolutionBar';
import { CrosshairInfo, type CrosshairData } from './kline/CrosshairInfo';
import type { KlineBar } from '@/hooks/useKlineData';

export type { KlineBar };

const DEFAULT_RESOLUTIONS = ['1s', '1m', '5m', '15m', '30m', '1h', '4h', '12h', '1d', '1w'];

export interface KlineChartProps {
  /** Static data mode */
  data?: KlineBar[];
  /** Real-time incremental update — latest bar from WebSocket */
  latestBar?: KlineBar | null;

  /** SDK-managed mode props (use with useKlineData hook externally) */
  onResolutionChange?: (resolution: string) => void;

  width?: number;
  height?: number;
  showVolume?: boolean;
  showToolbar?: boolean;
  showCrosshairInfo?: boolean;
  resolutions?: string[];
  initialResolution?: string;
  autoScroll?: boolean;
  className?: string;
}

export const KlineChart: React.FC<KlineChartProps> = ({
  data = [],
  latestBar,
  onResolutionChange,
  width = 800,
  height = 500,
  showVolume = true,
  showToolbar = true,
  showCrosshairInfo = true,
  resolutions = DEFAULT_RESOLUTIONS,
  initialResolution = '15m',
  autoScroll = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [resolution, setResolution] = useState(initialResolution);
  const [crosshairData, setCrosshairData] = useState<CrosshairData | null>(null);
  const dataMapRef = useRef<Map<number, KlineBar>>(new Map());

  const toolbarHeight = showToolbar ? 36 : 0;
  const infoHeight = showCrosshairInfo ? 24 : 0;
  const chartHeight = height - toolbarHeight - infoHeight;

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width,
      height: chartHeight,
      layout: {
        background: { type: ColorType.Solid, color: THEME.background },
        textColor: THEME.foreground,
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: THEME.gridLine },
        horzLines: { color: THEME.gridLine },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: `${THEME.muted}40`, width: 1, style: 3, labelBackgroundColor: THEME.border },
        horzLine: { color: `${THEME.muted}40`, width: 1, style: 3, labelBackgroundColor: THEME.border },
      },
      rightPriceScale: {
        borderColor: THEME.border,
        scaleMargins: showVolume ? { top: 0.05, bottom: 0.25 } : { top: 0.05, bottom: 0.05 },
      },
      timeScale: {
        borderColor: THEME.border,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
      },
      handleScroll: { vertTouchDrag: false },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: THEME.profit,
      downColor: THEME.loss,
      borderDownColor: THEME.loss,
      borderUpColor: THEME.profit,
      wickDownColor: THEME.loss,
      wickUpColor: THEME.profit,
    });

    candleSeriesRef.current = candleSeries;

    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });

      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });

      volumeSeriesRef.current = volumeSeries;
    }

    // Crosshair move handler
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData) {
        setCrosshairData(null);
        return;
      }

      const candle = param.seriesData.get(candleSeries) as CandlestickData | undefined;
      if (!candle) {
        setCrosshairData(null);
        return;
      }

      const bar = dataMapRef.current.get(candle.time as number);
      const timeStr = new Date((candle.time as number) * 1000).toLocaleString();

      setCrosshairData({
        time: timeStr,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: bar?.volume,
        change: candle.open !== 0 ? ((candle.close - candle.open) / candle.open) * 100 : 0,
      });
    });

    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [width, chartHeight, showVolume]);

  // Set full data
  useEffect(() => {
    if (!candleSeriesRef.current || data.length === 0) return;

    const map = new Map<number, KlineBar>();
    const candleData: CandlestickData[] = [];
    const volumeData: HistogramData[] = [];

    const sorted = [...data].sort((a, b) => a.time - b.time);

    for (const bar of sorted) {
      map.set(bar.time, bar);
      candleData.push({
        time: bar.time as Time,
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
      });
      if (showVolume) {
        volumeData.push({
          time: bar.time as Time,
          value: bar.volume,
          color: bar.close >= bar.open ? `${THEME.profit}40` : `${THEME.loss}40`,
        });
      }
    }

    dataMapRef.current = map;
    candleSeriesRef.current.setData(candleData);
    volumeSeriesRef.current?.setData(volumeData);
    chartRef.current?.timeScale().fitContent();
  }, [data, showVolume]);

  // Incremental update from latestBar
  useEffect(() => {
    if (!latestBar || !candleSeriesRef.current) return;

    dataMapRef.current.set(latestBar.time, latestBar);

    candleSeriesRef.current.update({
      time: latestBar.time as Time,
      open: latestBar.open,
      high: latestBar.high,
      low: latestBar.low,
      close: latestBar.close,
    });

    volumeSeriesRef.current?.update({
      time: latestBar.time as Time,
      value: latestBar.volume,
      color: latestBar.close >= latestBar.open ? `${THEME.profit}40` : `${THEME.loss}40`,
    });

    if (autoScroll) {
      chartRef.current?.timeScale().scrollToRealTime();
    }
  }, [latestBar, autoScroll]);

  // Resize
  useEffect(() => {
    chartRef.current?.applyOptions({ width, height: chartHeight });
  }, [width, chartHeight]);

  const handleResolutionChange = useCallback((r: string) => {
    setResolution(r);
    onResolutionChange?.(r);
  }, [onResolutionChange]);

  return (
    <div
      className={cn('flex flex-col', className)}
      data-component="KlineChart"
      style={{ width, backgroundColor: THEME.background, color: THEME.foreground }}
    >
      {showToolbar && (
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 4px 6px' }}>
          <ResolutionBar
            resolutions={resolutions}
            value={resolution}
            onChange={handleResolutionChange}
          />
        </div>
      )}
      {showCrosshairInfo && (
        <div style={{ height: 24, padding: '0 4px 2px' }}>
          <CrosshairInfo data={crosshairData} />
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
};
