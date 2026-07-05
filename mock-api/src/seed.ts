export type SeedPool = {
  id: string;
  name: string;
  apy: number;
  tvlNano: string;
  lockDays: number;
};

export const investPools: SeedPool[] = [
  { id: 'flexible', name: 'Zolotia Flexible', apy: 4.2, tvlNano: '182000000000000', lockDays: 0 },
  { id: 'locked-30', name: 'Zolotia Locked 30d', apy: 7.8, tvlNano: '96000000000000', lockDays: 30 },
  { id: 'locked-90', name: 'Zolotia Locked 90d', apy: 11.5, tvlNano: '54000000000000', lockDays: 90 },
];

export const DEFAULT_CREDIT_LIMIT_NANO = '10000000000'; // 10 TON demo limit
export const DEFAULT_CREDIT_APR = 9.5;
