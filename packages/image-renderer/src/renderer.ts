export interface RenderOptions {
  component: string;
  data: unknown;
  width?: number;
  height?: number;
  format?: 'png' | 'jpeg';
}

export async function renderToImage(options: RenderOptions): Promise<Buffer> {
  // Server-side rendering via Puppeteer
  // 1. Spin up headless browser
  // 2. Render React component with data
  // 3. Screenshot to buffer
  throw new Error('Not implemented');
}
