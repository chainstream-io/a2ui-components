import { useState, useEffect, useCallback } from 'react';

export interface TrendingToken {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  logoUrl?: string;
}

export type RankingCategory = 'hot' | 'new' | 'migrated' | 'finalStretch' | 'stocks';

export interface UseMarketTrendingOptions {
  sdk: any;
  chain: string;
  category?: RankingCategory;
  limit?: number;
}

function num(v: unknown): number {
  const n = parseFloat(String(v ?? '0'));
  return isNaN(n) ? 0 : n;
}

function parseToken(t: any): TrendingToken {
  const md = t.marketData ?? {};
  const stats24h = t.stats?.periods?.['24h'] ?? {};
  return {
    name: t.name ?? 'Unknown',
    symbol: t.symbol ?? '???',
    price: num(md.priceInUsd ?? t.priceInUsd),
    change24h: num(stats24h.priceChangeRatioInUsd ?? md.priceChange24hInUsd),
    marketCap: num(md.marketCapInUsd ?? t.marketCap),
    volume24h: num(stats24h.volumeInUsd ?? md.volumeInUsd),
    logoUrl: t.imageUrl ?? t.logoUrl,
  };
}

export function useMarketTrending(options: UseMarketTrendingOptions) {
  const { sdk, chain, category = 'hot', limit = 20 } = options;
  const [data, setData] = useState<TrendingToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!sdk?.ranking || !chain) return;
    setIsLoading(true);
    setError(null);
    try {
      const methodMap: Record<RankingCategory, (chain: string, ...args: any[]) => Promise<any>> = {
        hot: (c) => sdk.ranking.getHotTokens(c, '24h', { limit }),
        new: (c) => sdk.ranking.getNewTokens(c, { limit }),
        migrated: (c) => sdk.ranking.getMigratedTokens(c, { limit }),
        finalStretch: (c) => sdk.ranking.getFinalStretchTokens(c, { limit }),
        stocks: (c) => sdk.ranking.getStocksTokens(c, { limit }),
      };
      const result = await methodMap[category](chain);
      const tokens = (Array.isArray(result) ? result : result?.data ?? []).map(parseToken);
      setData(tokens.slice(0, limit));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sdk, chain, category, limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
