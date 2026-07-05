import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { useWalletStore } from '../state/walletStore';
import { formatTon } from '../lib/tonClient';
import { formatRelativeTime } from '../lib/format';
import { api, type LedgerEvent } from '../lib/api';

const eventMeta: Record<LedgerEvent['type'], { label: string; icon: string; incoming: boolean }> = {
  buy: { label: 'Buy', icon: '💰', incoming: true },
  sell: { label: 'Sell', icon: '💱', incoming: false },
  invest_stake: { label: 'Staked', icon: '📈', incoming: false },
  invest_unstake: { label: 'Unstaked', icon: '📈', incoming: true },
  credit_advance: { label: 'Credit advance', icon: '💳', incoming: true },
  credit_repay: { label: 'Credit repay', icon: '💳', incoming: false },
};

type Row = {
  kind: 'chain' | 'mock';
  id: string;
  label: string;
  icon: string;
  incoming: boolean;
  amountNano: bigint;
  timestamp: number;
};

export function Activity() {
  const { address, transactions } = useWalletStore();
  const [events, setEvents] = useState<LedgerEvent[]>([]);

  useEffect(() => {
    if (address) {
      api.getLedgerEvents(address).then(setEvents).catch(console.error);
    }
  }, [address]);

  const rows: Row[] = [
    ...transactions.map((tx) => ({
      kind: 'chain' as const,
      id: tx.id,
      label: tx.direction === 'in' ? 'Received' : 'Sent',
      icon: tx.direction === 'in' ? '↙️' : '↗️',
      incoming: tx.direction === 'in',
      amountNano: tx.amountNano,
      timestamp: tx.timestamp,
    })),
    ...events.map((ev) => ({
      kind: 'mock' as const,
      id: ev.id,
      label: eventMeta[ev.type].label,
      icon: eventMeta[ev.type].icon,
      incoming: eventMeta[ev.type].incoming,
      amountNano: BigInt(ev.amountNano),
      timestamp: ev.timestamp,
    })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  if (!address) {
    return <p className="text-sm text-text-secondary pt-6">Connect a wallet to see your activity.</p>;
  }

  return (
    <div className="flex flex-col gap-2 pt-4">
      {rows.length === 0 && <p className="text-sm text-text-muted">No activity yet.</p>}
      {rows.map((row) => (
        <Card key={row.id} className="flex items-center gap-3 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-raised border border-border text-base">
            {row.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{row.label}</span>
              {row.kind === 'mock' && (
                <span className="rounded-sm bg-violet-100 text-violet-700 text-[10px] font-medium px-1.5 py-0.5">
                  Demo
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted">{formatRelativeTime(row.timestamp)}</p>
          </div>
          <span className={`font-mono text-sm tabular-nums ${row.incoming ? 'text-success' : 'text-text-primary'}`}>
            {row.incoming ? '+' : '−'}
            {formatTon(row.amountNano)} TON
          </span>
        </Card>
      ))}
    </div>
  );
}
