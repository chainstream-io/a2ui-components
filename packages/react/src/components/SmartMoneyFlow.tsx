import React from 'react';
import { CHART_COLORS, THEME } from '@/lib/chart-colors';

export interface FlowNode {
  id: string;
  label: string;
}

export interface FlowLink {
  source: string;
  target: string;
  value: number;
}

export interface SmartMoneyFlowProps {
  nodes: FlowNode[];
  links: FlowLink[];
  width?: number;
  height?: number;
}

export const SmartMoneyFlow: React.FC<SmartMoneyFlowProps> = ({ nodes, links, width = 800, height = 500 }) => {
  const padding = { top: 30, right: 120, bottom: 30, left: 120 };
  const chartH = height - padding.top - padding.bottom;

  const sourceIds = [...new Set(links.map((l) => l.source))];
  const targetIds = [...new Set(links.map((l) => l.target))];

  const sourceTotal = links.reduce((sum, l) => sum + l.value, 0);
  const targetTotals: Record<string, number> = {};
  targetIds.forEach((id) => {
    targetTotals[id] = links.filter((l) => l.target === id).reduce((s, l) => s + l.value, 0);
  });

  const nodeWidth = 16;

  const sourcePositions: Record<string, { x: number; y: number; h: number }> = {};
  let sy = padding.top;
  sourceIds.forEach((id) => {
    const total = links.filter((l) => l.source === id).reduce((s, l) => s + l.value, 0);
    const h = Math.max((total / sourceTotal) * chartH, 8);
    sourcePositions[id] = { x: padding.left, y: sy, h };
    sy += h + 4;
  });

  const targetPositions: Record<string, { x: number; y: number; h: number }> = {};
  let ty = padding.top;
  targetIds.forEach((id) => {
    const h = Math.max((targetTotals[id] / sourceTotal) * chartH, 8);
    targetPositions[id] = { x: width - padding.right - nodeWidth, y: ty, h };
    ty += h + 4;
  });

  const sourceOffsets: Record<string, number> = {};
  sourceIds.forEach((id) => {
    sourceOffsets[id] = 0;
  });
  const targetOffsets: Record<string, number> = {};
  targetIds.forEach((id) => {
    targetOffsets[id] = 0;
  });

  const flowPaths = links.map((link, i) => {
    const sp = sourcePositions[link.source];
    const tp = targetPositions[link.target];
    if (!sp || !tp) return null;

    const linkH = Math.max((link.value / sourceTotal) * chartH, 2);
    const sy0 = sp.y + sourceOffsets[link.source];
    const ty0 = tp.y + targetOffsets[link.target];
    sourceOffsets[link.source] += linkH;
    targetOffsets[link.target] += linkH;

    const sx = sp.x + nodeWidth;
    const tx = tp.x;
    const mx = (sx + tx) / 2;

    const d = `M ${sx} ${sy0} C ${mx} ${sy0}, ${mx} ${ty0}, ${tx} ${ty0} L ${tx} ${ty0 + linkH} C ${mx} ${ty0 + linkH}, ${mx} ${sy0 + linkH}, ${sx} ${sy0 + linkH} Z`;
    const color = CHART_COLORS[i % CHART_COLORS.length];

    return <path key={i} d={d} fill={color} fillOpacity={0.35} stroke={color} strokeWidth={0.5} />;
  });

  const nodeLabel = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;

  return (
    <svg width={width} height={height} data-component="SmartMoneyFlow">
      {flowPaths}

      {sourceIds.map((id, i) => {
        const p = sourcePositions[id];
        return (
          <g key={`s-${id}`}>
            <rect x={p.x} y={p.y} width={nodeWidth} height={p.h} fill={CHART_COLORS[i % CHART_COLORS.length]} rx={3} />
            <text x={p.x - 6} y={p.y + p.h / 2} textAnchor="end" dominantBaseline="central" fill={THEME.foreground} fontSize={11}>
              {nodeLabel(id)}
            </text>
          </g>
        );
      })}

      {targetIds.map((id, i) => {
        const p = targetPositions[id];
        return (
          <g key={`t-${id}`}>
            <rect x={p.x} y={p.y} width={nodeWidth} height={p.h} fill={CHART_COLORS[(sourceIds.length + i) % CHART_COLORS.length]} rx={3} />
            <text x={p.x + nodeWidth + 6} y={p.y + p.h / 2} textAnchor="start" dominantBaseline="central" fill={THEME.foreground} fontSize={11}>
              {nodeLabel(id)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
