import { useState, useEffect, useCallback } from 'react';
import type { KlineBar } from './useKlineData';

export interface UseTokenPriceHistoryOptions {
  sdk: any;
  chain: string;
  tokenAddress: string;
  resolution?: string;
  limit?: number;
}

export function useTokenPriceHistory(options: UseTokenPriceHistoryOptions) {
  const { sdk, chain, tokenAddress, resolution = '1h', limit = 200 } = options;
  const [candles, setCandles] = useState<KlineBar[]>([]);
  const [priceData, setPriceData] = useState<Array<{ time: number; value: number }>>([]);
  const [volumeData, setVolumeData] = useState<Array<{ time: number; volume: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!sdk?.token?.getCandles || !chain || !tokenAddress) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await sdk.token.getCandles(chain, tokenAddress, { resolution, limit });
      const raw = Array.isArray(result) ? result : [];
      const bars: KlineBar[] = raw.map((c: any) => ({
        time: typeof c.timestamp === 'number' ? Math.floor(c.timestamp / 1000) : (c.time ?? c.timestamp),
        open: parseFloat(c.open ?? '0'),
        high: parseFloat(c.high ?? '0'),
        low: parseFloat(c.low ?? '0'),
        close: parseFloat(c.close ?? '0'),
        volume: parseFloat(c.volume ?? '0'),
      })).sort((a: KlineBar, b: KlineBar) => a.time - b.time);

      setCandles(bars);
      setPriceData(bars.map((b) => ({ time: b.time, value: b.close })));
      setVolumeData(bars.map((b) => ({ time: b.time, volume: b.volume })));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sdk, chain, tokenAddress, resolution, limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { candles, priceData, volumeData, isLoading, error, refetch: fetch };
}
