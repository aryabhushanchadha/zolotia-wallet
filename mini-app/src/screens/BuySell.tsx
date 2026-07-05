import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useWalletStore } from '../state/walletStore';
import { parseTonAmount } from '../lib/tonClient';
import { api } from '../lib/api';
import { hapticNotify } from '../lib/telegram';

export function BuySell({ side }: { side: 'buy' | 'sell' }) {
  const address = useWalletStore((s) => s.address);
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<{ rate: number; fiatEquivalent: number } | null>(null);
  const [status, setStatus] = useState<'idle' | 'busy' | 'success'>('idle');

  useEffect(() => {
    if (Number(amount) > 0) {
      api.getQuote(side, parseTonAmount(amount).toString()).then(setQuote).catch(console.error);
    } else {
      setQuote(null);
    }
  }, [amount, side]);

  if (!address) {
    return <p className="text-sm text-text-secondary pt-6">Connect a wallet first to {side} TON.</p>;
  }

  const execute = async () => {
    if (Number(amount) <= 0) return;
    setStatus('busy');
    try {
      const amountNano = parseTonAmount(amount).toString();
      if (side === 'buy') await api.executeBuy(address, amountNano);
      else await api.executeSell(address, amountNano);
      setStatus('success');
      hapticNotify('success');
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 pt-10 text-center">
        <span className="text-4xl">🎉</span>
        <h2 className="font-display text-lg font-semibold">Simulated {side} complete</h2>
        <p className="text-sm text-text-secondary">This was a demo transaction — no real funds moved.</p>
        <Button
          onClick={() => {
            setStatus('idle');
            setAmount('');
          }}
        >
          Do another
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="rounded-md bg-gold-100 text-gold-700 text-xs font-medium px-3 py-2 text-center">
        Simulated — no real funds are used
      </div>
      <Card>
        <label className="text-xs text-text-secondary font-medium">Amount (TON)</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          inputMode="decimal"
          className="w-full mt-1 bg-transparent font-display text-2xl outline-none placeholder:text-text-muted"
        />
      </Card>
      {quote && (
        <p className="text-sm text-text-secondary">
          Rate: 1 TON ≈ ${quote.rate} · You'll {side === 'buy' ? 'pay' : 'receive'} ≈ ${quote.fiatEquivalent}
        </p>
      )}
      <Button fullWidth disabled={Number(amount) <= 0 || status === 'busy'} onClick={execute}>
        {status === 'busy' ? 'Processing…' : `Confirm simulated ${side}`}
      </Button>
    </div>
  );
}
