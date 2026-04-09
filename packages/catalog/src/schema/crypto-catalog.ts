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
  KlineChart: {
    type: 'KlineChart',
    description: 'Full-featured K-line chart with volume overlay, resolution bar, crosshair info, and real-time updates via WebSocket',
    dataBinding: { path: '/klines', format: 'ohlcv' },
    props: {
      showVolume: true,
      showToolbar: true,
      showCrosshairInfo: true,
      autoScroll: true,
    },
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
  TokenListTable: {
    type: 'TokenListTable',
    description: 'Sortable token list/ranking table with price, 24h change, market cap, and volume',
    dataBinding: { path: '/token_list' },
  },
  NetWorthChart: {
    type: 'NetWorthChart',
    description: 'Wallet net worth area chart with trend indicator',
    dataBinding: { path: '/net_worth_history' },
  },
  TopTraderTable: {
    type: 'TopTraderTable',
    description: 'Top traders leaderboard with PnL bar chart, buy/sell volume, and transaction count',
    dataBinding: { path: '/top_traders' },
  },
  TokenStatsPanel: {
    type: 'TokenStatsPanel',
    description: 'Multi-period token statistics panel showing volume, transactions, makers, and price changes',
    dataBinding: { path: '/token_stats' },
  },
  PoolCard: {
    type: 'PoolCard',
    description: 'DEX liquidity pool card showing token pair, TVL, volume, fee tier, and APR',
    dataBinding: { path: '/pool_info' },
  },
};
