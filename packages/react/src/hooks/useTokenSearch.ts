import { useState, useEffect, useCallback } from 'react';

export interface TokenSearchItem {
  name: string;
  symbol: string;
  chain: string;
  address: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  logoUrl?: string;
}

export interface UseTokenSearchOptions {
  sdk: any;
  query?: string;
  chain?: string;
  limit?: number;
}

function num(v: unknown): number {
  const n = parseFloat(String(v ?? '0'));
  return isNaN(n) ? 0 : n;
}

function parseToken(t: any): TokenSearchItem {
  const md = t.marketData ?? {};
  const stats24h = t.stats?.periods?.['24h'] ?? {};
  return {
    name: t.name ?? 'Unknown',
    symbol: t.symbol ?? '???',
    chain: t.chain ?? '',
    address: t.address ?? '',
    price: num(md.priceInUsd ?? t.priceInUsd),
    priceChange24h: num(stats24h.priceChangeRatioInUsd ?? md.priceChange24hInUsd),
    marketCap: num(md.marketCapInUsd ?? t.marketCap),
    volume24h: num(stats24h.volumeInUsd ?? md.volumeInUsd),
    logoUrl: t.imageUrl ?? t.logoUrl,
  };
}

export function useTokenSearch(options: UseTokenSearchOptions) {
  const { sdk, query, chain, limit = 20 } = options;
  const [data, setData] = useState<TokenSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!sdk?.token?.search) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await sdk.token.search({ keyword: query, chain, limit });
      const items = (result?.data ?? []).map(parseToken);
      setData(items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sdk, query, chain, limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
