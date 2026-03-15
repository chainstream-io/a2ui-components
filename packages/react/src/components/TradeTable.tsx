import React from 'react';

export interface Trade {
  id: string;
  time: number;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
}

export interface TradeTableProps {
  trades: Trade[];
  maxRows?: number;
}

export const TradeTable: React.FC<TradeTableProps> = ({ trades, maxRows = 50 }) => {
  return (
    <div data-component="TradeTable">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Side</th>
            <th>Price</th>
            <th>Amount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {trades.slice(0, maxRows).map((trade) => (
            <tr key={trade.id}>
              <td>{new Date(trade.time).toLocaleTimeString()}</td>
              <td style={{ color: trade.side === 'buy' ? '#4caf50' : '#f44336' }}>{trade.side}</td>
              <td>{trade.price}</td>
              <td>{trade.amount}</td>
              <td>{trade.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
