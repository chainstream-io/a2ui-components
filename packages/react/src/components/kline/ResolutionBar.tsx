import React from 'react';
import { cn } from '@/lib/utils';
import { THEME } from '@/lib/chart-colors';

export interface ResolutionBarProps {
  resolutions: string[];
  value: string;
  onChange: (resolution: string) => void;
  className?: string;
}

const RESOLUTION_LABELS: Record<string, string> = {
  '1s': '1s', '15s': '15s', '30s': '30s',
  '1m': '1m', '3m': '3m', '5m': '5m', '15m': '15m', '30m': '30m',
  '1h': '1H', '2h': '2H', '4h': '4H', '6h': '6H', '8h': '8H', '12h': '12H',
  '1d': '1D', '3d': '3D', '1w': '1W', '1M': '1M',
};

const GROUP_BOUNDARIES = new Set(['1m', '1h', '1d']);

export const ResolutionBar: React.FC<ResolutionBarProps> = ({ resolutions, value, onChange, className }) => {
  return (
    <div
      className={cn('flex items-center gap-0.5 rounded-lg bg-secondary/50 p-1', className)}
      style={{ display: 'flex', alignItems: 'center', gap: 2, borderRadius: 8, padding: 4, backgroundColor: `${THEME.border}60` }}
    >
      {resolutions.map((r, i) => {
        const isActive = r === value;
        return (
          <React.Fragment key={r}>
            {i > 0 && GROUP_BOUNDARIES.has(r) && (
              <div
                className="mx-0.5 h-4 w-px bg-border"
                style={{ width: 1, height: 16, margin: '0 3px', backgroundColor: THEME.border }}
              />
            )}
            <button
              onClick={() => onChange(r)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium tabular-nums transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              style={{
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                transition: 'background-color 0.15s, color 0.15s',
                backgroundColor: isActive ? THEME.info : 'transparent',
                color: isActive ? '#fff' : THEME.muted,
              }}
            >
              {RESOLUTION_LABELS[r] ?? r}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
