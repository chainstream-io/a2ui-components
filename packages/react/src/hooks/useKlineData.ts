import { useState, useEffect, useRef, useCallback } from 'react';

export interface KlineBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface UseKlineDataOptions {
  /** ChainStream SDK instance (must have .token.getCandles and .stream.subscribeTokenCandles) */
  sdk: any;
  chain: string;
  tokenAddress: string;
  resolution: string;
  priceType?: 'usd' | 'native';
  /** Number of historical bars to load initially */
  limit?: number;
}

interface UseKlineDataResult {
  data: KlineBar[];
  latestBar: KlineBar | null;
  isLoading: boolean;
  error: Error | null;
}

function parseWsCandle(raw: any): KlineBar {
  return {
    time: raw.time,
    open: parseFloat(raw.open),
    high: parseFloat(raw.high),
    low: parseFloat(raw.low),
    close: parseFloat(raw.close),
    volume: parseFloat(raw.volume),
  };
}

function parseRestCandle(raw: any): KlineBar {
  return {
    time: typeof raw.timestamp === 'number' ? Math.floor(raw.timestamp / 1000) : raw.timestamp,
    open: parseFloat(raw.open),
    high: parseFloat(raw.high),
    low: parseFloat(raw.low),
    close: parseFloat(raw.close),
    volume: parseFloat(raw.volume),
  };
}

export function useKlineData(options: UseKlineDataOptions): UseKlineDataResult {
  const { sdk, chain, tokenAddress, resolution, priceType = 'usd', limit = 300 } = options;

  const [data, setData] = useState<KlineBar[]>([]);
  const [latestBar, setLatestBar] = useState<KlineBar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubRef = useRef<{ unsubscribe: () => void } | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const candles = await sdk.token.getCandles(chain, tokenAddress, {
        resolution,
        priceType,
        limit,
      });
      const bars: KlineBar[] = (Array.isArray(candles) ? candles : [])
        .map(parseRestCandle)
        .sort((a: KlineBar, b: KlineBar) => a.time - b.time);
      setData(bars);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sdk, chain, tokenAddress, resolution, priceType, limit]);

  const subscribeRealtime = useCallback(() => {
    if (!sdk?.stream?.subscribeTokenCandles) return;

    unsubRef.current = sdk.stream.subscribeTokenCandles({
      chain,
      tokenAddress,
      resolution,
      priceType,
      callback: (wsCandle: any) => {
        const bar = parseWsCandle(wsCandle);
        setLatestBar(bar);

        setData((prev) => {
          if (prev.length === 0) return [bar];
          const last = prev[prev.length - 1];
          if (last.time === bar.time) {
            return [...prev.slice(0, -1), bar];
          }
          return [...prev, bar];
        });
      },
    });
  }, [sdk, chain, tokenAddress, resolution, priceType]);

  useEffect(() => {
    fetchHistory();
    subscribeRealtime();

    return () => {
      unsubRef.current?.unsubscribe();
      unsubRef.current = null;
    };
  }, [fetchHistory, subscribeRealtime]);

  return { data, latestBar, isLoading, error };
}
