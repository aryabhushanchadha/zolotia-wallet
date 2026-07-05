import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { isValidTonAddress, parseTonAmount } from '../lib/tonClient';
import { useWalletStore } from '../state/walletStore';
import { hapticNotify } from '../lib/telegram';

type Status = 'idle' | 'confirming' | 'success' | 'error';

export function Send() {
  const [tonConnectUI] = useTonConnectUI();
  const address = useWalletStore((s) => s.address);
  const refresh = useWalletStore((s) => s.refresh);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const addressValid = recipient.length === 0 || isValidTonAddress(recipient);
  const canSend = address && isValidTonAddress(recipient) && Number(amount) > 0;

  const handleSend = async () => {
    if (!canSend) return;
    setStatus('confirming');
    setError(null);
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{ address: recipient, amount: parseTonAmount(amount).toString() }],
      });
      setStatus('success');
      hapticNotify('success');
      await refresh();
    } catch (err) {
      setStatus('error');
      hapticNotify('error');
      setError(err instanceof Error ? err.message : 'Transaction failed or was rejected.');
    }
  };

  if (!address) {
    return <p className="text-sm text-text-secondary pt-6">Connect a wallet first to send TON.</p>;
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 pt-10 text-center">
        <span className="text-4xl">✅</span>
        <h2 className="font-display text-lg font-semibold">Sent!</h2>
        <p className="text-sm text-text-secondary">Your testnet transaction was submitted.</p>
        <Button onClick={() => setStatus('idle')}>Send another</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Card>
        <label className="text-xs text-text-secondary font-medium">Recipient address</label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value.trim())}
          placeholder="EQ... or UQ..."
          className="w-full mt-1 bg-transparent font-mono text-sm outline-none placeholder:text-text-muted"
        />
        {!addressValid && <p className="text-xs text-danger mt-1">Not a valid TON address</p>}
      </Card>

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

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button fullWidth disabled={!canSend || status === 'confirming'} onClick={handleSend}>
        {status === 'confirming' ? 'Confirm in your wallet…' : 'Send'}
      </Button>
    </div>
  );
}
