import { cryptoCatalog, type CryptoComponent } from '../schema/crypto-catalog';

export function validateComponent(type: string): CryptoComponent | null {
  return cryptoCatalog[type] ?? null;
}
