import React from 'react';

export interface AlertBadgeProps {
  type: 'info' | 'warning' | 'danger' | 'success';
  message: string;
  timestamp?: number;
}

const colorMap: Record<AlertBadgeProps['type'], string> = {
  info: '#2196F3',
  warning: '#ff9800',
  danger: '#f44336',
  success: '#4caf50',
};

export const AlertBadge: React.FC<AlertBadgeProps> = ({ type, message, timestamp }) => {
  return (
    <div
      data-component="AlertBadge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 12px',
        borderRadius: 16,
        backgroundColor: `${colorMap[type]}20`,
        color: colorMap[type],
        fontSize: 13,
      }}
    >
      <span>{message}</span>
      {timestamp && <span style={{ opacity: 0.7 }}>{new Date(timestamp).toLocaleTimeString()}</span>}
    </div>
  );
};
