import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface WalletAsset {
  symbol: string;
  balance: number;
  valueUsd: number;
  change24h: number;
}

export interface WalletDashboardProps {
  address: string;
  totalValueUsd: number;
  assets: WalletAsset[];
  children?: React.ReactNode;
  className?: string;
}

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ address, totalValueUsd, assets, children, className }) => {
  return (
    <Card className={cn('w-full max-w-lg', className)} data-component="WalletDashboard">
      <CardHeader>
        <CardDescription className="font-mono text-xs">{truncateAddress(address)}</CardDescription>
        <CardTitle className="text-3xl font-bold tabular-nums tracking-tight">
          ${totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {assets.length === 0 ? (
          <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">No assets</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right w-[80px]">24h</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => {
                const ChangeIcon = asset.change24h > 0 ? TrendingUp : asset.change24h < 0 ? TrendingDown : Minus;
                return (
                  <TableRow key={asset.symbol}>
                    <TableCell className="font-medium">{asset.symbol}</TableCell>
                    <TableCell className="text-right tabular-nums">{asset.balance.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">${asset.valueUsd.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn('inline-flex items-center gap-1 text-xs tabular-nums', asset.change24h > 0 ? 'text-profit' : asset.change24h < 0 ? 'text-loss' : 'text-muted-foreground')}>
                        <ChangeIcon className="size-3" />
                        {asset.change24h > 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        {children}
      </CardContent>
    </Card>
  );
};
