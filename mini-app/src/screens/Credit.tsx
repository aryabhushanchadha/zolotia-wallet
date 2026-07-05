import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { useWalletStore } from '../state/walletStore';
import { formatTon, parseTonAmount } from '../lib/tonClient';
import { api, type CreditLine } from '../lib/api';

export function Credit() {
  const address = useWalletStore((s) => s.address);
  const [line, setLine] = useState<CreditLine | null>(null);
  const [mode, setMode] = useState<'advance' | 'repay' | null>(null);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (address) api.getCreditLine(address).then(setLine).catch(console.error);
  };

  useEffect(load, [address]);

  if (!address) {
    return <p className="text-sm text-text-secondary pt-6">Connect a wallet to view your credit line.</p>;
  }

  const limit = line ? BigInt(line.limitNano) : 0n;
  const utilized = line ? BigInt(line.utilizedNano) : 0n;
  const available = limit - utilized;
  const utilizationPct = limit > 0n ? Number((utilized * 100n) / limit) : 0;

  const submit = async () => {
    if (!mode || Number(amount) <= 0) return;
    setBusy(true);
    setError(null);
    try {
      const amountNano = parseTonAmount(amount).toString();
      if (mode === 'advance') {
        await api.requestAdvance(address, amountNano);
      } else {
        await api.repay(address, amountNano);
      }
      setAmount('');
      setMode(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      <p className="text-xs text-text-muted -mt-1">
        Simulated credit line for demo purposes — no real funds are advanced.
      </p>
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-secondary">Available credit</p>
          <p className="text-xs text-text-secondary">{line?.aprPercent}% APR</p>
        </div>
        <p className="font-display text-3xl font-semibold tabular-nums mt-1">{formatTon(available)} TON</p>
        <div className="h-2 rounded-full bg-gold-100 mt-3 overflow-hidden">
          <div className="h-full bg-gold-violet" style={{ width: `${utilizationPct}%` }} />
        </div>
        <p className="text-xs text-text-muted mt-1">
          {formatTon(utilized)} / {formatTon(limit)} TON used
        </p>
      </Card>

      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={() => setMode('advance')}>
          Request advance
        </Button>
        <Button variant="ghost" className="flex-1" onClick={() => setMode('repay')}>
          Repay
        </Button>
      </div>

      <Sheet open={!!mode} onClose={() => setMode(null)} title={mode === 'advance' ? 'Request advance' : 'Repay'}>
        <div className="flex flex-col gap-3">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in TON"
            inputMode="decimal"
            className="rounded-md border border-border bg-bg px-3 py-3 font-display text-xl outline-none"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button fullWidth disabled={busy || Number(amount) <= 0} onClick={submit}>
            Confirm
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
