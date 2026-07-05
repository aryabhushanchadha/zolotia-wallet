import { motion } from 'framer-motion';
import { Skeleton } from '../ui/Skeleton';
import { Sparkline } from '../ui/Sparkline';

const DEMO_TON_USD_RATE = 5.8;

function mockChange(seed: number): number {
  return Math.sin(seed) * 6.5;
}

export function BalanceHero({ balanceTon, loading }: { balanceTon: string | null; loading: boolean }) {
  const numericBalance = balanceTon ? Number(balanceTon.replace(/,/g, '')) : 0;
  const fiat = balanceTon ? (numericBalance * DEMO_TON_USD_RATE).toFixed(2) : null;
  const change = mockChange(numericBalance || 1);
  const isUp = change >= 0;

  return (
    <div className="rounded-lg bg-gold-violet text-white p-6 shadow-gold">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/80 font-medium">Total balance</p>
          {loading || balanceTon === null ? (
            <Skeleton className="h-10 w-40 mt-2 bg-white/30" />
          ) : (
            <motion.p
              key={balanceTon}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl font-semibold tabular-nums mt-1"
            >
              {balanceTon} TON
            </motion.p>
          )}
        </div>
        {balanceTon !== null && !loading && <Sparkline seed={numericBalance || 1} />}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-xs text-white/70">
          {fiat ? `≈ $${fiat} · demo rate` : 'Connect a wallet to see your balance'}
        </p>
        {balanceTon !== null && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded-sm ${
              isUp ? 'bg-white/20 text-white' : 'bg-black/15 text-white'
            }`}
          >
            {isUp ? '+' : ''}
            {change.toFixed(1)}% 24h
          </span>
        )}
      </div>
    </div>
  );
}
