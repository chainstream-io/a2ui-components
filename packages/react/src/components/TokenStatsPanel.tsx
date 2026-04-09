import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatPeriod {
  volume?: number;
  volumeChange?: number;
  txns?: number;
  txnsBuy?: number;
  txnsSell?: number;
  makers?: number;
  buyers?: number;
  sellers?: number;
  priceChange?: number;
}

export interface TokenStatsPanelProps {
  periods: Record<string, StatPeriod>;
  className?: string;
}

function formatCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

const PERIOD_ORDER = ['5m', '15m', '1h', '4h', '6h', '24h', '7d', '30d'];

function ChangeIndicator({ value }: { value: number | undefined }) {
  if (value == null) return <span className="text-muted-foreground">—</span>;
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium tabular-nums', value > 0 ? 'text-profit' : value < 0 ? 'text-loss' : 'text-muted-foreground')}>
      <Icon className="size-3" />
      {value > 0 ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}

export const TokenStatsPanel: React.FC<TokenStatsPanelProps> = ({ periods, className }) => {
  const orderedKeys = PERIOD_ORDER.filter((k) => k in periods);
  if (orderedKeys.length === 0 && Object.keys(periods).length > 0) {
    orderedKeys.push(...Object.keys(periods).slice(0, 6));
  }
  if (orderedKeys.length === 0) {
    return (
      <div className={cn('flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground', className)} data-component="TokenStatsPanel">
        No stats available
      </div>
    );
  }

  return (
    <Card className={cn('w-full', className)} data-component="TokenStatsPanel">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Token Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Metric</th>
                {orderedKeys.map((k) => (
                  <th key={k} className="pb-2 text-right text-xs font-medium text-muted-foreground">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr>
                <td className="py-2 text-muted-foreground">Volume</td>
                {orderedKeys.map((k) => (
                  <td key={k} className="py-2 text-right tabular-nums">
                    {periods[k].volume != null ? `$${formatCompact(periods[k].volume!)}` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Vol Change</td>
                {orderedKeys.map((k) => (
                  <td key={k} className="py-2 text-right">
                    <ChangeIndicator value={periods[k].volumeChange} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Transactions</td>
                {orderedKeys.map((k) => (
                  <td key={k} className="py-2 text-right tabular-nums">
                    {periods[k].txns != null ? formatCompact(periods[k].txns!) : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Buy / Sell</td>
                {orderedKeys.map((k) => {
                  const p = periods[k];
                  const buy = p.txnsBuy ?? p.buyers;
                  const sell = p.txnsSell ?? p.sellers;
                  return (
                    <td key={k} className="py-2 text-right tabular-nums text-xs">
                      {buy != null && sell != null ? (
                        <>
                          <span className="text-profit">{formatCompact(buy)}</span>
                          <span className="text-muted-foreground"> / </span>
                          <span className="text-loss">{formatCompact(sell)}</span>
                        </>
                      ) : '—'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Price Change</td>
                {orderedKeys.map((k) => (
                  <td key={k} className="py-2 text-right">
                    <ChangeIndicator value={periods[k].priceChange} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
