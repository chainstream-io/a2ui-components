import React from 'react';
import { THEME } from '@/lib/chart-colors';

export interface PnLWaterfallProps {
  data: Array<{ label: string; value: number; type: 'profit' | 'loss' | 'total' }>;
  width?: number;
  height?: number;
}

const TYPE_COLORS = { profit: THEME.profit, loss: THEME.loss, total: THEME.info };

export const PnLWaterfall: React.FC<PnLWaterfallProps> = ({ data, width = 600, height = 400 }) => {
  const padding = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  let running = 0;
  const bars = data.map((d) => {
    if (d.type === 'total') {
      const bar = { ...d, y: Math.min(0, d.value), h: Math.abs(d.value), base: running };
      running = d.value;
      return bar;
    }
    const start = running;
    running += d.value;
    return { ...d, y: d.value >= 0 ? start : running, h: Math.abs(d.value), base: start };
  });

  const allValues = bars.flatMap((b) => [b.y, b.y + b.h]);
  const minVal = Math.min(0, ...allValues);
  const maxVal = Math.max(0, ...allValues);
  const range = maxVal - minVal || 1;

  const barWidth = (chartW / data.length) * 0.6;
  const gap = chartW / data.length;

  const scaleY = (v: number) => padding.top + chartH - ((v - minVal) / range) * chartH;
  const zeroY = scaleY(0);

  return (
    <svg width={width} height={height} data-component="PnLWaterfall">
      <line x1={padding.left} y1={zeroY} x2={width - padding.right} y2={zeroY} stroke={THEME.border} strokeWidth={1} />

      {bars.map((bar, i) => {
        const x = padding.left + i * gap + (gap - barWidth) / 2;
        const top = scaleY(bar.y + bar.h);
        const barH = Math.abs(scaleY(bar.y) - scaleY(bar.y + bar.h));

        return (
          <g key={i}>
            <rect x={x} y={top} width={barWidth} height={Math.max(barH, 1)} fill={TYPE_COLORS[bar.type]} rx={3} />
            <text x={x + barWidth / 2} y={top - 6} textAnchor="middle" fill={THEME.foreground} fontSize={11} fontWeight={500}>
              {bar.value >= 0 ? '+' : ''}
              {bar.value.toLocaleString()}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - padding.bottom + 16}
              textAnchor="middle"
              fill={THEME.muted}
              fontSize={10}
              transform={`rotate(-30, ${x + barWidth / 2}, ${height - padding.bottom + 16})`}
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
