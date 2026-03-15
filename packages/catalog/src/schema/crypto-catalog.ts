export interface CryptoComponent {
  type: string;
  description: string;
  dataBinding: {
    path: string;
    format?: string;
  };
  props?: Record<string, unknown>;
}

export const cryptoCatalog: Record<string, CryptoComponent> = {
  CandlestickChart: {
    type: 'CandlestickChart',
    description: 'OHLCV candlestick chart',
    dataBinding: { path: '/klines', format: 'ohlcv' },
  },
  PriceLineChart: {
    type: 'PriceLineChart',
    description: 'Price trend line chart',
    dataBinding: { path: '/price_history' },
  },
  VolumeBarChart: {
    type: 'VolumeBarChart',
    description: 'Trading volume bar chart',
    dataBinding: { path: '/volume_data' },
  },
  HolderPieChart: {
    type: 'HolderPieChart',
    description: 'Top 10 holder distribution pie chart',
    dataBinding: { path: '/holders' },
  },
  PnLWaterfall: {
    type: 'PnLWaterfall',
    description: 'Profit and loss waterfall chart',
    dataBinding: { path: '/pnl_detail' },
  },
  TokenCard: {
    type: 'TokenCard',
    description: 'Token info card (price, change, market cap)',
    dataBinding: { path: '/token_info' },
  },
  TradeTable: {
    type: 'TradeTable',
    description: 'Real-time trade detail table with live append',
    dataBinding: { path: '/trades' },
  },
  WalletDashboard: {
    type: 'WalletDashboard',
    description: 'Wallet overview layout composing sub-components',
    dataBinding: { path: '/' },
  },
  AlertBadge: {
    type: 'AlertBadge',
    description: 'Risk/signal alert badge',
    dataBinding: { path: '/alerts' },
  },
  SmartMoneyFlow: {
    type: 'SmartMoneyFlow',
    description: 'Smart money flow Sankey diagram',
    dataBinding: { path: '/money_flow' },
  },
};
