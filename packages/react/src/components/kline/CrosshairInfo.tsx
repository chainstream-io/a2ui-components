import React from 'react';
import { cn } from '@/lib/utils';
import { THEME } from '@/lib/chart-colors';

export interface CrosshairData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  change?: number;
}

export interface CrosshairInfoProps {
  data: CrosshairData | null;
  className?: string;
}

function formatNum(n: number, decimals = 2): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  if (n < 0.0001 && n > 0) return n.toExponential(2);
  return n.toFixed(decimals);
}

export const CrosshairInfo: React.FC<CrosshairInfoProps> = ({ data, className }) => {
  if (!data) return null;

  const isUp = data.close >= data.open;
  const change = data.change ?? ((data.close - data.open) / data.open) * 100;
  const priceColor = isUp ? THEME.profit : THEME.loss;
  const changeColor = change >= 0 ? THEME.profit : THEME.loss;

  return (
    <div
      className={cn('flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs tabular-nums', className)}
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 12px', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}
    >
      <span style={{ color: THEME.muted }}>{data.time}</span>
      <span>
        <span style={{ color: THEME.muted }}>O </span>
        <span style={{ color: priceColor }}>{formatNum(data.open)}</span>
      </span>
      <span>
        <span style={{ color: THEME.muted }}>H </span>
        <span style={{ color: priceColor }}>{formatNum(data.high)}</span>
      </span>
      <span>
        <span style={{ color: THEME.muted }}>L </span>
        <span style={{ color: priceColor }}>{formatNum(data.low)}</span>
      </span>
      <span>
        <span style={{ color: THEME.muted }}>C </span>
        <span style={{ color: priceColor }}>{formatNum(data.close)}</span>
      </span>
      <span style={{ color: changeColor, fontWeight: 500 }}>
        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
      </span>
      {data.volume != null && (
        <span>
          <span style={{ color: THEME.muted }}>Vol </span>
          <span style={{ color: THEME.foreground }}>{formatNum(data.volume, 0)}</span>
        </span>
      )}
    </div>
  );
};
