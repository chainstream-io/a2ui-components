import { useState, useEffect, useCallback } from 'react';

export interface NetWorthPoint {
  time: number;
  value: number;
}

export interface UseWalletNetWorthOptions {
  sdk: any;
  chain: string;
  walletAddress: string;
}

export function useWalletNetWorth(options: UseWalletNetWorthOptions) {
  const { sdk, chain, walletAddress } = options;
  const [data, setData] = useState<NetWorthPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!sdk?.wallet?.getNetWorthChart || !chain || !walletAddress) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await sdk.wallet.getNetWorthChart(chain, walletAddress);
      const history = result?.history ?? result?.data ?? [];
      const points: NetWorthPoint[] = (Array.isArray(history) ? history : []).map((h: any) => ({
        time: typeof h.timestamp === 'number'
          ? (h.timestamp > 1e12 ? Math.floor(h.timestamp / 1000) : h.timestamp)
          : Math.floor(new Date(h.timestamp ?? h.date).getTime() / 1000),
        value: parseFloat(h.totalValueInUsd ?? h.valueUsd ?? h.value ?? '0'),
      })).sort((a: NetWorthPoint, b: NetWorthPoint) => a.time - b.time);
      setData(points);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sdk, chain, walletAddress]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
