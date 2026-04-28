export const CHART_COLORS = [
  '#9b7cff', // chart-1: purple/primary
  '#35d6ff', // chart-2: cyan/info
  '#35d987', // chart-3: green/profit
  '#f8bf4c', // chart-4: amber/warning
  '#f472b6', // chart-5: pink/accent
  '#ff6b73', // chart-6: red/loss
  '#2dd4bf', // chart-7: teal
  '#fb923c', // chart-8: orange
];

export const THEME = {
  profit: '#35d987',
  loss: '#ff6b73',
  info: '#35d6ff',
  warning: '#f8bf4c',
  primary: '#9b7cff',
  accent: '#f472b6',
  background: '#111424',
  surface: '#171b2e',
  surfaceElevated: '#202541',
  foreground: '#eef0fb',
  muted: '#9aa3bf',
  border: 'rgba(226, 232, 255, 0.16)',
  gridLine: 'rgba(226, 232, 255, 0.08)',
} as const;
