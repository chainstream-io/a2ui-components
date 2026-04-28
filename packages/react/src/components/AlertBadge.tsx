import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/ui/badge';
import { Info, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

export interface AlertBadgeProps {
  type: 'info' | 'warning' | 'danger' | 'success';
  message: string;
  timestamp?: number;
  className?: string;
}

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  danger: ShieldAlert,
  success: CheckCircle,
} as const;

const variantMap = {
  info: 'info',
  warning: 'warning',
  danger: 'loss',
  success: 'profit',
} as const;

export const AlertBadge: React.FC<AlertBadgeProps> = ({ type, message, timestamp, className }) => {
  const Icon = iconMap[type];

  return (
    <Badge variant={variantMap[type]} className={cn('gap-1.5 px-3 py-1 text-xs shadow-none', className)} data-component="AlertBadge">
      <Icon className="size-3.5" />
      <span>{message}</span>
      {timestamp != null && (
        <span className="border-l border-current/20 pl-1.5 opacity-65">{new Date(timestamp).toLocaleTimeString()}</span>
      )}
    </Badge>
  );
};
