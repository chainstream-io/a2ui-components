import { useState, useEffect, useCallback } from 'react';

export interface HolderData {
  address: string;
  percentage: number;
  label?: string;
}

export interface UseTokenHoldersOptions {
  sdk: any;
  chain: string;
  tokenAddress: string;
  limit?: number;
}

function normalizePercentage(raw: unknown): number {
  const v = parseFloat(String(raw ?? '0'));
  // If value looks like a ratio (0.054) instead of percent (5.4), convert
  return v > 0 && v < 1 ? v * 100 : v;
}

export function useTokenHolders(options: UseTokenHoldersOptions) {
  const { sdk, chain, tokenAddress, limit = 10 } = options;
  const [data, setData] = useState<HolderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!sdk?.token?.getTopHolders || !chain || !tokenAddress) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await sdk.token.getTopHolders(chain, tokenAddress, { limit });
      const holders = (result?.data ?? []).map((h: any) => ({
        address: h.walletAddress ?? h.address ?? '',
        percentage: normalizePercentage(h.percentage),
        label: h.label ?? h.tag,
      }));
      setData(holders);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sdk, chain, tokenAddress, limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
