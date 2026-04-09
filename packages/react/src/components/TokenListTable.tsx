import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';

export interface TokenListItem {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
  logoUrl?: string;
}

export interface TokenListTableProps {
  tokens: TokenListItem[];
  maxRows?: number;
  className?: string;
}

type SortKey = 'price' | 'change24h' | 'marketCap' | 'volume24h';

function formatCompact(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function formatPrice(price: number): string {
  if (price === 0) return '$0.00';
  if (price > 0 && price < 0.0001) {
    const s = price.toFixed(20).replace(/0+$/, '');
    const match = s.match(/^0\.(0*)/);
    if (!match) return `$${price.toPrecision(4)}`;
    const zeros = match[1].length;
    const sig = s.slice(2 + zeros, 2 + zeros + 4);
    if (zeros >= 4) return `$0.0{${zeros}}${sig}`;
    return `$${s.slice(0, 2 + zeros + 4)}`;
  }
  if (price < 1) return `$${price.toPrecision(4)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const TokenListTable: React.FC<TokenListTableProps> = ({ tokens, maxRows = 50, className }) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sorted = useMemo(() => {
    const list = tokens.slice(0, maxRows);
    if (!sortKey) return list;
    return [...list].sort((a, b) => {
      const av = (a[sortKey] as number) ?? 0;
      const bv = (b[sortKey] as number) ?? 0;
      return sortAsc ? av - bv : bv - av;
    });
  }, [tokens, maxRows, sortKey, sortAsc]);

  if (sorted.length === 0) {
    return (
      <div className={cn('flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground', className)} data-component="TokenListTable">
        No tokens found
      </div>
    );
  }

  const hasMarketCap = tokens.some((t) => t.marketCap != null && t.marketCap > 0);
  const hasVolume = tokens.some((t) => t.volume24h != null && t.volume24h > 0);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button
      type="button"
      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      {label}
      <ArrowUpDown className={cn('size-3', sortKey === field ? 'text-primary' : 'text-muted-foreground/50')} />
    </button>
  );

  return (
    <div className={className} data-component="TokenListTable">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40px]">#</TableHead>
            <TableHead>Token</TableHead>
            <TableHead className="text-right"><SortHeader label="Price" field="price" /></TableHead>
            <TableHead className="text-right"><SortHeader label="24h" field="change24h" /></TableHead>
            {hasMarketCap && <TableHead className="text-right"><SortHeader label="Market Cap" field="marketCap" /></TableHead>}
            {hasVolume && <TableHead className="text-right"><SortHeader label="Volume" field="volume24h" /></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((token, i) => {
            const price = token.price || 0;
            const change = token.change24h || 0;
            const isPositive = change >= 0;
            return (
              <TableRow key={`${token.symbol}-${i}`}>
                <TableCell className="text-muted-foreground tabular-nums">{i + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {token.logoUrl ? (
                      <img src={token.logoUrl} alt={token.symbol} className="size-6 rounded-full bg-muted" />
                    ) : (
                      <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                        {(token.symbol ?? '??').slice(0, 2)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">{token.name}</span>
                      <span className="text-xs text-muted-foreground">{token.symbol}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">{formatPrice(price)}</TableCell>
                <TableCell className="text-right">
                  <span className={cn('inline-flex items-center gap-1 text-xs font-medium tabular-nums', isPositive ? 'text-profit' : 'text-loss')}>
                    {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </TableCell>
                {hasMarketCap && (
                  <TableCell className="text-right tabular-nums text-sm">
                    {token.marketCap ? formatCompact(token.marketCap) : '—'}
                  </TableCell>
                )}
                {hasVolume && (
                  <TableCell className="text-right tabular-nums text-sm">
                    {token.volume24h ? formatCompact(token.volume24h) : '—'}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
