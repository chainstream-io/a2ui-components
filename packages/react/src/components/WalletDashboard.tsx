import React from 'react';

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
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ address, totalValueUsd, assets, children }) => {
  return (
    <div data-component="WalletDashboard" style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: '#888' }}>{address}</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>${totalValueUsd.toLocaleString()}</div>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {assets.map((asset) => (
          <div key={asset.symbol} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{asset.symbol}</span>
            <span>{asset.balance}</span>
            <span>${asset.valueUsd.toLocaleString()}</span>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};
