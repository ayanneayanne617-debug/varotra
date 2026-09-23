import { Currency } from '../types';

// Approximate baseline exchange rates: Base is MGA
export const EXCHANGE_RATES: Record<Currency, number> = {
  MGA: 1,
  USD: 1 / 4500, // 4,500 MGA = $1 USD
  EUR: 1 / 4900, // 4,900 MGA = 1 €
};

export const formatPrice = (amountInMGA: number, currency: Currency = 'MGA'): string => {
  if (currency === 'MGA') {
    const formatted = Math.round(amountInMGA).toLocaleString('fr-FR');
    return `${formatted} Ar`;
  } else if (currency === 'EUR') {
    const inEur = amountInMGA * EXCHANGE_RATES.EUR;
    return `${inEur.toFixed(2).replace('.', ',')} €`;
  } else if (currency === 'USD') {
    const inUsd = amountInMGA * EXCHANGE_RATES.USD;
    return `$${inUsd.toFixed(2)}`;
  }
  return `${amountInMGA} Ar`;
};
