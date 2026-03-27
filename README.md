# ChainStream A2UI Components

A2UI Crypto Catalog — 10 个交互式链上数据可视化组件。

## Packages

| Package | npm | Description |
|---------|-----|-------------|
| `@chainstream/a2ui-catalog` | Catalog schema | 组件 JSON Schema 定义 + 验证器 |
| `@chainstream/a2ui-react` | React renderer | 10 个 React 组件 (TradingView Lightweight Charts) |
| `@chainstream/a2ui-image-renderer` | Image fallback | Puppeteer 服务端渲染截图 |

## Components

| Component | Description |
|-----------|-------------|
| `KlineChart` | 专业级 K 线图 (OHLCV + 成交量 + 时间周期切换 + 实时更新) |
| `PriceLineChart` | 价格走势折线图 |
| `VolumeBarChart` | 交易量柱状图 |
| `HolderPieChart` | 持仓分布饼图 (Top 10) |
| `PnLWaterfall` | 盈亏瀑布图 |
| `TokenCard` | 代币信息卡片 |
| `TradeTable` | 实时交易明细表 |
| `WalletDashboard` | 钱包总览面板 |
| `AlertBadge` | 风险/信号告警标签 |
| `SmartMoneyFlow` | 聪明钱资金流向 Sankey 图 |

## Development

```bash
pnpm install
pnpm run storybook     # Storybook on :6006
pnpm run build         # Build all packages
```
