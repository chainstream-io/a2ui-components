import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/ui/card';

export interface PoolCardProps {
  tokenA: { symbol: string; logoUrl?: string };
  tokenB: { symbol: string; logoUrl?: string };
  dex: string;
  tvl?: number;
  volume24h?: number;
  fee?: number;
  apr?: number;
  className?: string;
}

function formatCompact(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function TokenIcon({ symbol, logoUrl }: { symbol: string; logoUrl?: string }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={symbol} className="size-7 rounded-full border border-border/70 bg-muted shadow-sm" />;
  }
  return (
    <div className="flex size-7 items-center justify-center rounded-full border border-primary/25 bg-primary/12 text-[10px] font-bold text-primary">
      {symbol.slice(0, 2)}
    </div>
  );
}

export const PoolCard: React.FC<PoolCardProps> = ({
  tokenA, tokenB, dex, tvl, volume24h, fee, apr, className,
}) => (
  <Card className={cn('w-full max-w-[300px] overflow-hidden transition-colors hover:border-primary/35 hover:bg-card', className)} data-component="PoolCard">
    <CardHeader className="flex-row items-center gap-3 space-y-0">
      <div className="flex -space-x-2">
        <TokenIcon symbol={tokenA.symbol} logoUrl={tokenA.logoUrl} />
        <TokenIcon symbol={tokenB.symbol} logoUrl={tokenB.logoUrl} />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="font-semibold leading-none">{tokenA.symbol} / {tokenB.symbol}</span>
        <span className="text-xs text-muted-foreground">{dex}</span>
      </div>
      {fee != null && (
        <span className="ml-auto rounded-full border border-info/25 bg-info/12 px-2 py-0.5 text-xs font-semibold text-info">
          {(fee * 100).toFixed(2)}%
        </span>
      )}
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-3">
        {tvl != null && (
          <div className="flex flex-col rounded-lg border border-border/50 bg-muted/35 p-3">
            <span className="text-xs text-muted-foreground">TVL</span>
            <span className="text-sm font-semibold tabular-nums">{formatCompact(tvl)}</span>
          </div>
        )}
        {volume24h != null && (
          <div className="flex flex-col rounded-lg border border-border/50 bg-muted/35 p-3">
            <span className="text-xs text-muted-foreground">Volume 24h</span>
            <span className="text-sm font-semibold tabular-nums">{formatCompact(volume24h)}</span>
          </div>
        )}
      </div>
      {apr != null && (
        <div className="flex items-center justify-between border-t border-border/60 pt-2">
          <span className="text-xs text-muted-foreground">APR</span>
          <span className="rounded-full border border-profit/30 bg-profit/12 px-2 py-0.5 text-sm font-semibold tabular-nums text-profit">{apr.toFixed(2)}%</span>
        </div>
      )}
    </CardContent>
  </Card>
);
