# ChainStream A2UI Components

A2UI Crypto Catalog — 14 个交互式链上数据可视化组件 + 9 个 SDK data hooks。

## Packages

| Package | npm | Description |
|---------|-----|-------------|
| `@chainstream-io/a2ui-catalog` | Catalog schema | 组件 JSON Schema 定义 + 验证器 |
| `@chainstream-io/a2ui-react` | React renderer | React 组件 + SDK hooks (TradingView Lightweight Charts) |
| `@chainstream-io/a2ui-image-renderer` | Image fallback | Puppeteer 服务端渲染截图 |

## Components

| Component | Description |
|-----------|-------------|
| `KlineChart` | 专业级 K 线图 (OHLCV + 成交量 + 时间周期切换 + 实时更新) |
| `PriceLineChart` | 价格走势折线图 |
| `VolumeBarChart` | 交易量柱状图 |
| `HolderPieChart` | 持仓分布饼图 (Top 10) |
| `PnLWaterfall` | 盈亏瀑布图 |
| `TokenCard` | 代币信息卡片 |
| `TokenListTable` | 代币列表/排行表格（可排序） |
| `TradeTable` | 实时交易明细表 |
| `NetWorthChart` | 钱包净值面积图 |
| `AlertBadge` | 风险/信号告警标签 |
| `SmartMoneyFlow` | 聪明钱资金流向 Sankey 图 |
| `TopTraderTable` | 顶级交易员排行榜（含 PnL 柱状图） |
| `TokenStatsPanel` | 多周期代币统计面板 |
| `PoolCard` | DEX 流动性池卡片 |

## SDK Hooks

内置 data-fetching hooks，通过 `ChainStreamProvider` 注入 API Key 后即可获取实时链上数据。

| Hook | Description |
|------|-------------|
| `useKlineData` | K 线数据 (OHLCV candles) |
| `useTokenSearch` | 代币搜索（按名称/符号） |
| `useTokenAnalytics` | 代币深度分析（metadata + stats + marketdata） |
| `useTokenPriceHistory` | 代币历史价格 |
| `useTokenHolders` | 代币持仓人分布 |
| `useWalletNetWorth` | 钱包净值与持仓 |
| `useRecentTrades` | 最近交易明细 |
| `useMarketTrending` | 市场热门/趋势代币 |
| `useTopTraders` | 顶级交易员排行 |

## Development

```bash
pnpm install
pnpm run storybook     # Storybook on :6006 (含 live stories 实时调用 SDK)
pnpm run build         # Build all packages
```
