import React from 'react';

export interface TokenCardProps {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap?: number;
  logoUrl?: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({ name, symbol, price, change24h, marketCap, logoUrl }) => {
  return (
    <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e0e0e0' }} data-component="TokenCard">
      {logoUrl && <img src={logoUrl} alt={symbol} style={{ width: 32, height: 32 }} />}
      <div>{name} ({symbol})</div>
      <div>${price.toLocaleString()}</div>
      <div style={{ color: change24h >= 0 ? '#4caf50' : '#f44336' }}>{change24h.toFixed(2)}%</div>
      {marketCap && <div>MCap: ${marketCap.toLocaleString()}</div>}
    </div>
  );
};
