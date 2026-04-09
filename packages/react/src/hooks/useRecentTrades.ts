import { useState, useEffect, useRef, useCallback } from 'react';

export interface TradeItem {
  id: string;
  time: number;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
}

export interface UseRecentTradesOptions {
  sdk: any;
  chain: string;
  tokenAddress?: string;
  walletAddress?: string;
  limit?: number;
  realtime?: boolean;
}

function parseTrade(t: any, i: number): TradeItem {
  const type = (t.type ?? t.side ?? '').toUpperCase();
  const base = t.transactionSignature ?? t.txHash ?? t.id ?? `t_${i}`;
  return {
    id: `${base}_${i}`,
    time: t.blockTimestamp ?? t.timestamp ?? Date.now() - i * 30_000,
    side: type === 'SELL' ? 'sell' : 'buy',
    price: parseFloat(t.tokenPriceInUsd ?? t.priceInUsd ?? t.price ?? '0'),
    amount: parseFloat(t.tokenAmount ?? t.amount ?? '0'),
    total: parseFloat(t.tokenAmountInUsd ?? t.totalInUsd ?? t.total ?? '0'),
  };
}

export function useRecentTrades(options: UseRecentTradesOptions) {
  const { sdk, chain, tokenAddress, walletAddress, limit = 20, realtime = false } = options;
  const [data, setData] = useState<TradeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubRef = useRef<{ unsubscribe: () => void } | null>(null);

  const fetch = useCallback(async () => {
    if (!sdk?.trade?.getTrades || !chain) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await sdk.trade.getTrades(chain, { tokenAddress, walletAddress, limit });
      const trades = (result?.data ?? []).map(parseTrade);
      setData(trades);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sdk, chain, tokenAddress, walletAddress, limit]);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    if (!realtime || !sdk?.stream) return;
    const subFn = tokenAddress
      ? sdk.stream.subscribeTokenTrade?.bind(sdk.stream)
      : walletAddress
        ? sdk.stream.subscribeWalletTrade?.bind(sdk.stream)
        : null;
    if (!subFn) return;

    const addr = tokenAddress ?? walletAddress;
    unsubRef.current = subFn({
      chain,
      [tokenAddress ? 'tokenAddress' : 'walletAddress']: addr,
      callback: (ws: any) => {
        const trade = parseTrade(ws, 0);
        setData((prev) => [trade, ...prev].slice(0, limit));
      },
    });

    return () => {
      unsubRef.current?.unsubscribe();
      unsubRef.current = null;
    };
  }, [sdk, chain, tokenAddress, walletAddress, realtime, limit]);

  return { data, isLoading, error, refetch: fetch };
}
