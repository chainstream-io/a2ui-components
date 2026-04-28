import React from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';

export interface Trade {
  id: string;
  time: number;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
}

export interface TradeTableProps {
  trades: Trade[];
  maxRows?: number;
  className?: string;
}

export const TradeTable: React.FC<TradeTableProps> = ({ trades, maxRows = 50, className }) => {
  const visible = trades.slice(0, maxRows);

  if (visible.length === 0) {
    return (
      <div className={cn('flex h-32 items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/60 text-sm text-muted-foreground backdrop-blur-xl', className)} data-component="TradeTable">
        No trades yet
      </div>
    );
  }

  return (
    <div className={cn('w-full min-w-0', className)} data-component="TradeTable">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px]">Time</TableHead>
            <TableHead className="w-[60px]">Side</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell className="tabular-nums text-muted-foreground">
                {new Date(trade.time).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold uppercase', trade.side === 'buy' ? 'border-profit/30 bg-profit/12 text-profit' : 'border-loss/30 bg-loss/12 text-loss')}>
                  {trade.side}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums">{trade.price.toLocaleString()}</TableCell>
              <TableCell className="text-right tabular-nums">{trade.amount.toLocaleString()}</TableCell>
              <TableCell className="text-right tabular-nums font-medium">{trade.total.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
