import React from 'react';
import { CHART_COLORS, THEME } from '@/lib/chart-colors';

export interface HolderPieChartProps {
  data: Array<{ address: string; percentage: number; label?: string }>;
  width?: number;
  height?: number;
}

export const HolderPieChart: React.FC<HolderPieChartProps> = ({ data, width = 400, height = 400 }) => {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 40;

  const totalPct = data.reduce((sum, d) => sum + d.percentage, 0);
  const entries = totalPct < 99.5
    ? [...data, { address: 'others', percentage: 100 - totalPct, label: 'Others' }]
    : data;

  let cumulative = 0;
  const slices = entries.map((d, i) => {
    const startAngle = cumulative * 3.6 * (Math.PI / 180);
    cumulative += d.percentage;
    const endAngle = cumulative * 3.6 * (Math.PI / 180);
    const largeArc = d.percentage > 50 ? 1 : 0;

    const x1 = cx + radius * Math.cos(startAngle - Math.PI / 2);
    const y1 = cy + radius * Math.sin(startAngle - Math.PI / 2);
    const x2 = cx + radius * Math.cos(endAngle - Math.PI / 2);
    const y2 = cy + radius * Math.sin(endAngle - Math.PI / 2);

    const midAngle = (startAngle + endAngle) / 2 - Math.PI / 2;
    const labelR = radius * 0.65;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);

    const isOthers = d.address === 'others';

    return {
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: isOthers ? THEME.border : CHART_COLORS[i % CHART_COLORS.length],
      label: d.label ?? d.address.slice(0, 6),
      pct: d.percentage,
      lx,
      ly,
    };
  });

  return (
    <svg width={width} height={height} data-component="HolderPieChart">
      {slices.map((s, i) => (
        <g key={i}>
          <path d={s.path} fill={s.color} stroke={THEME.background} strokeWidth={2} />
          {s.pct > 5 && (
            <text x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={11} fontWeight={600}>
              {s.label} {s.pct.toFixed(1)}%
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};
