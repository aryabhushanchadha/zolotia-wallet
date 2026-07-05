const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request to ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type InvestPool = {
  id: string;
  name: string;
  apy: number;
  tvlNano: string;
  lockDays: number;
};

export type InvestPosition = {
  poolId: string;
  stakedNano: string;
  stakedAt: number;
};

export type CreditLine = {
  limitNano: string;
  utilizedNano: string;
  aprPercent: number;
};

export type LedgerEvent = {
  id: string;
  type: 'buy' | 'sell' | 'invest_stake' | 'invest_unstake' | 'credit_advance' | 'credit_repay';
  amountNano: string;
  timestamp: number;
  status: 'simulated';
};

export const api = {
  getInvestPools: () => request<InvestPool[]>('/api/invest/pools'),
  getInvestPositions: (address: string) => request<InvestPosition[]>(`/api/invest/positions/${address}`),
  stake: (address: string, poolId: string, amountNano: string) =>
    request<InvestPosition>('/api/invest/stake', {
      method: 'POST',
      body: JSON.stringify({ address, poolId, amountNano }),
    }),
  unstake: (address: string, poolId: string) =>
    request<{ ok: true }>('/api/invest/unstake', {
      method: 'POST',
      body: JSON.stringify({ address, poolId }),
    }),

  getCreditLine: (address: string) => request<CreditLine>(`/api/credit/line/${address}`),
  requestAdvance: (address: string, amountNano: string) =>
    request<CreditLine>('/api/credit/advance', {
      method: 'POST',
      body: JSON.stringify({ address, amountNano }),
    }),
  repay: (address: string, amountNano: string) =>
    request<CreditLine>('/api/credit/repay', {
      method: 'POST',
      body: JSON.stringify({ address, amountNano }),
    }),

  getQuote: (side: 'buy' | 'sell', amountNano: string) =>
    request<{ rate: number; fiatEquivalent: number }>('/api/buysell/quote', {
      method: 'POST',
      body: JSON.stringify({ side, amountNano }),
    }),
  executeBuy: (address: string, amountNano: string) =>
    request<LedgerEvent>('/api/buysell/execute', {
      method: 'POST',
      body: JSON.stringify({ address, side: 'buy', amountNano }),
    }),
  executeSell: (address: string, amountNano: string) =>
    request<LedgerEvent>('/api/buysell/execute', {
      method: 'POST',
      body: JSON.stringify({ address, side: 'sell', amountNano }),
    }),

  getLedgerEvents: (address: string) => request<LedgerEvent[]>(`/api/ledger/${address}`),
};
