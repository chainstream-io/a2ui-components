import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { ArrowUpDown } from 'lucide-react';
import { THEME } from '@/lib/chart-colors';

export interface TopTraderItem {
  address: string;
  label?: string;
  pnl: number;
  buyVolume: number;
  sellVolume: number;
  txCount: number;
}

export interface TopTraderTableProps {
  traders: TopTraderItem[];
  maxRows?: number;
  className?: string;
}

type SortKey = 'pnl' | 'buyVolume' | 'sellVolume' | 'txCount';

function formatCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export const TopTraderTable: React.FC<TopTraderTableProps> = ({ traders, maxRows = 50, className }) => {
  const [sortKey, setSortKey] = useState<SortKey>('pnl');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else { setSortKey(key); setSortAsc(false); }
  };

  const sorted = useMemo(() => {
    const list = traders.slice(0, maxRows);
    return [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return sortAsc ? av - bv : bv - av;
    });
  }, [traders, maxRows, sortKey, sortAsc]);

  if (sorted.length === 0) {
    return (
      <div className={cn('flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground', className)} data-component="TopTraderTable">
        No trader data
      </div>
    );
  }

  const maxAbsPnl = Math.max(...sorted.map((t) => Math.abs(t.pnl)), 1);

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
    <div className={className} data-component="TopTraderTable">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40px]">#</TableHead>
            <TableHead>Trader</TableHead>
            <TableHead className="text-right"><SortHeader label="PnL" field="pnl" /></TableHead>
            <TableHead className="w-[120px]" />
            <TableHead className="text-right"><SortHeader label="Buy Vol" field="buyVolume" /></TableHead>
            <TableHead className="text-right"><SortHeader label="Sell Vol" field="sellVolume" /></TableHead>
            <TableHead className="text-right"><SortHeader label="Txns" field="txCount" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((trader, i) => {
            const pnlPct = Math.abs(trader.pnl) / maxAbsPnl;
            const barColor = trader.pnl >= 0 ? THEME.profit : THEME.loss;
            return (
              <TableRow key={trader.address}>
                <TableCell className="text-muted-foreground tabular-nums">{i + 1}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs">
                    {trader.label || truncateAddress(trader.address)}
                  </span>
                </TableCell>
                <TableCell className={cn('text-right tabular-nums font-medium text-sm', trader.pnl >= 0 ? 'text-profit' : 'text-loss')}>
                  {trader.pnl >= 0 ? '+' : ''}{formatCompact(trader.pnl)}
                </TableCell>
                <TableCell>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pnlPct * 100}%`, backgroundColor: barColor }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums text-sm">{formatCompact(trader.buyVolume)}</TableCell>
                <TableCell className="text-right tabular-nums text-sm">{formatCompact(trader.sellVolume)}</TableCell>
                <TableCell className="text-right tabular-nums text-sm text-muted-foreground">{trader.txCount.toLocaleString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
