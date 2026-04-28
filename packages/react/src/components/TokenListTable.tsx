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

const TOKEN_LOGO_FIELDS = [
  'logoUrl',
  'logo',
  'image',
  'imageUrl',
  'icon',
  'uri',
  'tokenLogo',
  'currencyLogo',
  'logo_url',
  'logoURI',
] as const;

type TokenLogoField = (typeof TOKEN_LOGO_FIELDS)[number];
type TokenWithLogoAliases = TokenListItem & Partial<Record<TokenLogoField, string | null | undefined>>;

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

function getTokenLogoUrl(token: TokenListItem): string | undefined {
  const tokenWithAliases = token as TokenWithLogoAliases;

  for (const field of TOKEN_LOGO_FIELDS) {
    const value = tokenWithAliases[field];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function TokenLogo({ token }: { token: TokenListItem }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const logoUrl = getTokenLogoUrl(token);
  const symbol = token.symbol ?? '??';

  if (!logoUrl || logoUrl === failedSrc) {
    return (
      <div className="flex size-6 items-center justify-center rounded-full border border-primary/25 bg-primary/12 text-[10px] font-bold text-primary">
        {symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${symbol} logo`}
      className="size-6 rounded-full border border-border/35 bg-muted"
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(logoUrl)}
    />
  );
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
      <div className={cn('flex h-32 items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/60 text-sm text-muted-foreground backdrop-blur-xl', className)} data-component="TokenListTable">
        No tokens found
      </div>
    );
  }

  const hasMarketCap = tokens.some((t) => t.marketCap != null && t.marketCap > 0);
  const hasVolume = tokens.some((t) => t.volume24h != null && t.volume24h > 0);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-accent/45 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
      onClick={() => handleSort(field)}
    >
      {label}
      <ArrowUpDown className={cn('size-3', sortKey === field ? 'text-primary' : 'text-muted-foreground/50')} />
    </button>
  );

  return (
    <div className={cn('w-full min-w-0', className)} data-component="TokenListTable">
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
                    <TokenLogo token={token} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">{token.name}</span>
                      <span className="text-xs text-muted-foreground">{token.symbol}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">{formatPrice(price)}</TableCell>
                <TableCell className="text-right">
                  <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums', isPositive ? 'border-profit/30 bg-profit/12 text-profit' : 'border-loss/30 bg-loss/12 text-loss')}>
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
