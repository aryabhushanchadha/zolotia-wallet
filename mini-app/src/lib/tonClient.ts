import { TonClient, Address, fromNano, toNano } from '@ton/ton';

const endpoint = import.meta.env.VITE_TONCENTER_ENDPOINT ?? 'https://testnet.toncenter.com/api/v2/jsonRPC';

let client: TonClient | null = null;

function getClient(): TonClient {
  if (!client) {
    client = new TonClient({ endpoint });
  }
  return client;
}

export type ChainTransaction = {
  id: string;
  timestamp: number;
  amountNano: bigint;
  direction: 'in' | 'out';
  comment?: string;
};

export async function getTestnetBalance(rawAddress: string): Promise<bigint> {
  const address = Address.parse(rawAddress);
  const balance = await getClient().getBalance(address);
  return balance;
}

export async function getTestnetTransactions(rawAddress: string, limit = 10): Promise<ChainTransaction[]> {
  const address = Address.parse(rawAddress);
  const txs = await getClient().getTransactions(address, { limit });
  return txs.map((tx) => {
    const inMsg = tx.inMessage;
    const outMsg = tx.outMessages.values()[0];
    const isIncoming = inMsg?.info.type === 'internal';

    let amount = 0n;
    if (isIncoming && inMsg?.info.type === 'internal') {
      amount = inMsg.info.value.coins;
    } else if (outMsg?.info.type === 'internal') {
      amount = outMsg.info.value.coins;
    }

    return {
      id: tx.hash().toString('hex'),
      timestamp: tx.now * 1000,
      amountNano: amount,
      direction: isIncoming ? 'in' : 'out',
    };
  });
}

export function formatTon(nano: bigint, fractionDigits = 4): string {
  const whole = fromNano(nano);
  const num = Number(whole);
  return num.toLocaleString('en-US', { maximumFractionDigits: fractionDigits });
}

export function parseTonAmount(amount: string): bigint {
  return toNano(amount);
}

export function isValidTonAddress(raw: string): boolean {
  try {
    Address.parse(raw);
    return true;
  } catch {
    return false;
  }
}
