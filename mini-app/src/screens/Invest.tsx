import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { useWalletStore } from '../state/walletStore';
import { formatTon, parseTonAmount } from '../lib/tonClient';
import { api, type InvestPool, type InvestPosition } from '../lib/api';

export function Invest() {
  const address = useWalletStore((s) => s.address);
  const [pools, setPools] = useState<InvestPool[]>([]);
  const [positions, setPositions] = useState<InvestPosition[]>([]);
  const [activePool, setActivePool] = useState<InvestPool | null>(null);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    api.getInvestPools().then(setPools).catch(console.error);
    if (address) api.getInvestPositions(address).then(setPositions).catch(console.error);
  };

  useEffect(load, [address]);

  const positionFor = (poolId: string) => positions.find((p) => p.poolId === poolId);

  const handleStake = async () => {
    if (!address || !activePool || Number(amount) <= 0) return;
    setBusy(true);
    try {
      await api.stake(address, activePool.id, parseTonAmount(amount).toString());
      setAmount('');
      setActivePool(null);
      load();
    } finally {
      setBusy(false);
    }
  };

  const handleUnstake = async (poolId: string) => {
    if (!address) return;
    setBusy(true);
    try {
      await api.unstake(address, poolId);
      load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-4">
      <p className="text-xs text-text-muted -mt-1">
        Simulated staking pools for demo purposes — no real yield is generated.
      </p>
      {pools.map((pool) => {
        const position = positionFor(pool.id);
        return (
          <Card key={pool.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold">{pool.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {pool.lockDays === 0 ? 'Flexible' : `${pool.lockDays}d lock`}
                </p>
              </div>
              <span className="rounded-sm bg-gold-100 text-gold-700 text-sm font-semibold px-2 py-1">
                {pool.apy}% APY
              </span>
            </div>
            {position && (
              <p className="text-sm mt-2 tabular-nums">Staked: {formatTon(BigInt(position.stakedNano))} TON</p>
            )}
            <div className="flex gap-2 mt-3">
              <Button
                variant="secondary"
                className="flex-1"
                disabled={!address}
                onClick={() => setActivePool(pool)}
              >
                Stake
              </Button>
              {position && (
                <Button variant="ghost" className="flex-1" disabled={busy} onClick={() => handleUnstake(pool.id)}>
                  Unstake
                </Button>
              )}
            </div>
          </Card>
        );
      })}

      <Sheet open={!!activePool} onClose={() => setActivePool(null)} title={`Stake in ${activePool?.name ?? ''}`}>
        <div className="flex flex-col gap-3">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in TON"
            inputMode="decimal"
            className="rounded-md border border-border bg-bg px-3 py-3 font-display text-xl outline-none"
          />
          <Button fullWidth disabled={busy || Number(amount) <= 0} onClick={handleStake}>
            Confirm stake
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
