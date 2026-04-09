import { useState, useEffect, useCallback } from 'react';

export interface TopTraderItem {
  address: string;
  label?: string;
  pnl: number;
  buyVolume: number;
  sellVolume: number;
  txCount: number;
}

export interface UseTopTradersOptions {
  sdk: any;
  chain: string;
  tokenAddress: string;
  limit?: number;
}

export function useTopTraders(options: UseTopTradersOptions) {
  const { sdk, chain, tokenAddress, limit = 20 } = options;
  const [data, setData] = useState<TopTraderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!sdk?.trade?.getTopTraders || !chain || !tokenAddress) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await sdk.trade.getTopTraders(chain, { tokenAddress, limit });
      const traders = (result?.data ?? []).map((t: any) => {
        const buyVol = parseFloat(t.buyAmountInUsd ?? t.buyVolume ?? '0');
        const sellVol = parseFloat(t.sellAmountInUsd ?? t.sellVolume ?? '0');
        return {
          address: t.walletAddress ?? t.address ?? '',
          label: t.label ?? t.tag,
          pnl: sellVol - buyVol,
          buyVolume: buyVol,
          sellVolume: sellVol,
          txCount: (t.tradeCount ?? t.buyCount + t.sellCount) || 0,
        };
      });
      setData(traders);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sdk, chain, tokenAddress, limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
