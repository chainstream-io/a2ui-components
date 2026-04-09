import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface TokenCardProps {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap?: number;
  logoUrl?: string;
  className?: string;
}

function formatCompact(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function formatSmallPrice(price: number): string {
  const s = price.toFixed(20).replace(/0+$/, '');
  const match = s.match(/^0\.(0*)/);
  if (!match) return `$${price.toPrecision(4)}`;
  const leadingZeros = match[1].length;
  const significand = s.slice(2 + leadingZeros, 2 + leadingZeros + 4);
  if (leadingZeros >= 4) return `$0.0{${leadingZeros}}${significand}`;
  return `$${s.slice(0, 2 + leadingZeros + 4)}`;
}

function formatPrice(price: number): string {
  if (price === 0) return '$0.00';
  if (price > 0 && price < 0.0001) return formatSmallPrice(price);
  if (price < 1) return `$${price.toPrecision(4)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const TokenCard: React.FC<TokenCardProps> = ({ name, symbol, price = 0, change24h = 0, marketCap, logoUrl, className }) => {
  const safeChange = change24h || 0;
  const isPositive = safeChange >= 0;

  return (
    <Card className={cn('w-[280px] transition-colors hover:border-primary/30', className)} data-component="TokenCard">
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        {logoUrl ? (
          <img src={logoUrl} alt={symbol} className="size-10 rounded-full bg-muted" />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
            {(symbol ?? '??').slice(0, 2)}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold leading-none">{name}</span>
          <span className="text-sm text-muted-foreground">{symbol}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold tabular-nums tracking-tight">{formatPrice(price || 0)}</span>
          <span className={cn('inline-flex items-center gap-1 text-sm font-medium tabular-nums', isPositive ? 'text-profit' : 'text-loss')}>
            {isPositive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            {isPositive ? '+' : ''}{safeChange.toFixed(2)}%
          </span>
        </div>
        {marketCap != null && marketCap > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Market Cap</span>
            <span className="font-medium tabular-nums text-foreground">{formatCompact(marketCap)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
