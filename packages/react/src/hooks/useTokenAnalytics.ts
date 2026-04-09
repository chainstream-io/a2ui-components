import { useState, useEffect, useCallback } from 'react';

export interface TokenOverview {
  name: string;
  symbol: string;
  logoUrl?: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
}

export interface HolderItem {
  address: string;
  percentage: number;
  label?: string;
}

export interface TokenStatsPeriod {
  volume?: number;
  volumeChange?: number;
  txns?: number;
  txnsBuy?: number;
  txnsSell?: number;
  buyers?: number;
  sellers?: number;
  priceChange?: number;
}

export interface UseTokenAnalyticsOptions {
  sdk: any;
  chain: string;
  tokenAddress: string;
}

export function useTokenAnalytics(options: UseTokenAnalyticsOptions) {
  const { sdk, chain, tokenAddress } = options;
  const [overview, setOverview] = useState<TokenOverview | null>(null);
  const [holders, setHolders] = useState<HolderItem[]>([]);
  const [statsPeriods, setStatsPeriods] = useState<Record<string, TokenStatsPeriod>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!sdk?.token || !chain || !tokenAddress) return;
    setIsLoading(true);
    setError(null);
    try {
      const [token, marketData, stats, holdersResult] = await Promise.allSettled([
        sdk.token.getToken(chain, tokenAddress),
        sdk.token.getMarketData(chain, tokenAddress),
        sdk.token.getStats(chain, tokenAddress),
        sdk.token.getTopHolders(chain, tokenAddress, { limit: 10 }),
      ]);

      const t = token.status === 'fulfilled' ? token.value : null;
      const md = marketData.status === 'fulfilled' ? marketData.value : null;
      const st = stats.status === 'fulfilled' ? stats.value : null;
      const h = holdersResult.status === 'fulfilled' ? holdersResult.value : null;

      setOverview({
        name: t?.name ?? 'Unknown',
        symbol: t?.symbol ?? '???',
        logoUrl: t?.imageUrl ?? t?.logoUrl,
        price: parseFloat(md?.priceInUsd ?? '0'),
        priceChange24h: parseFloat(md?.priceChange24hInUsd ?? '0'),
        marketCap: parseFloat(md?.marketCapInUsd ?? '0'),
      });

      const holderList = (h?.data ?? []).map((item: any) => {
        const pct = parseFloat(item.percentage ?? '0');
        return {
          address: item.walletAddress ?? item.address ?? '',
          percentage: pct > 0 && pct < 1 ? pct * 100 : pct,
          label: item.label ?? item.tag,
        };
      });
      setHolders(holderList);

      const periods: Record<string, TokenStatsPeriod> = {};
      const rawPeriods = st?.periods ?? st?.stats?.periods ?? {};
      for (const [key, val] of Object.entries(rawPeriods) as [string, any][]) {
        periods[key] = {
          volume: parseFloat(val.volumeInUsd ?? val.volume ?? '0'),
          volumeChange: val.volumeChangeRatio != null ? parseFloat(val.volumeChangeRatio) * 100 : undefined,
          txns: parseInt(val.txns ?? val.transactions ?? '0', 10),
          txnsBuy: parseInt(val.buys ?? val.txnsBuy ?? '0', 10),
          txnsSell: parseInt(val.sells ?? val.txnsSell ?? '0', 10),
          buyers: parseInt(val.buyers ?? '0', 10),
          sellers: parseInt(val.sellers ?? '0', 10),
          priceChange: val.priceChangeRatioInUsd != null ? parseFloat(val.priceChangeRatioInUsd) * 100 : undefined,
        };
      }
      setStatsPeriods(periods);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sdk, chain, tokenAddress]);

  useEffect(() => { fetch(); }, [fetch]);

  return { overview, holders, statsPeriods, isLoading, error, refetch: fetch };
}
