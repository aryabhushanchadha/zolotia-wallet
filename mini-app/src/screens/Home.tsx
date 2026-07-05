import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTonWallet } from '@tonconnect/ui-react';
import { BalanceHero } from '../components/wallet/BalanceHero';
import { ConnectWalletButton } from '../components/wallet/ConnectWalletButton';
import { AddressPill } from '../components/wallet/AddressPill';
import { Card } from '../components/ui/Card';
import { IconAction } from '../components/ui/IconAction';
import { useWalletStore } from '../state/walletStore';
import { formatTon } from '../lib/tonClient';
import { api, type CreditLine, type InvestPool } from '../lib/api';

const DEMO_TON_USD_RATE = 5.8;

const quickActions = [
  { to: '/send', label: 'Send', icon: '↗️', tint: 'violet' as const },
  { to: '/receive', label: 'Receive', icon: '↙️', tint: 'gold' as const },
  { to: '/buy', label: 'Buy', icon: '➕', tint: 'success' as const },
  { to: '/sell', label: 'Sell', icon: '➖', tint: 'neutral' as const },
];

export function Home() {
  const wallet = useTonWallet();
  const { address, balanceNano, loading, transactions } = useWalletStore();
  const [pools, setPools] = useState<InvestPool[]>([]);
  const [credit, setCredit] = useState<CreditLine | null>(null);

  useEffect(() => {
    api.getInvestPools().then(setPools).catch(console.error);
    if (address) {
      api.getCreditLine(address).then(setCredit).catch(console.error);
    }
  }, [address]);

  const balanceTon = balanceNano !== null ? formatTon(balanceNano) : null;
  const fiat = balanceTon ? (Number(balanceTon.replace(/,/g, '')) * DEMO_TON_USD_RATE).toFixed(2) : null;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <BalanceHero balanceTon={balanceTon} loading={loading && !!address} />

      <div className="flex items-center justify-between">
        {address ? <AddressPill address={address} /> : <span className="text-sm text-text-secondary">No wallet connected</span>}
        <ConnectWalletButton />
      </div>

      <div className="flex justify-around py-1">
        {quickActions.map((action) => (
          <IconAction key={action.to} {...action} disabled={!wallet} />
        ))}
      </div>

      <div>
        <h2 className="font-display font-semibold mb-2">Assets</h2>
        <Card className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-violet text-white font-display font-semibold text-sm">
            T
          </span>
          <div className="flex-1">
            <p className="font-medium text-sm">TON</p>
            <p className="text-xs text-text-muted">Testnet</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm tabular-nums">{balanceTon ?? '0.00'}</p>
            <p className="text-xs text-text-muted">{fiat ? `$${fiat}` : '$0.00'}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/invest">
          <Card>
            <p className="text-xs text-text-secondary">Invest</p>
            <p className="font-display text-lg font-semibold mt-1">
              {pools.length > 0 ? `${pools[0].apy}% APY` : '—'}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{pools[0]?.name ?? 'Loading pools...'}</p>
          </Card>
        </Link>
        <Link to="/credit">
          <Card>
            <p className="text-xs text-text-secondary">Credit line</p>
            <p className="font-display text-lg font-semibold mt-1">
              {credit ? `${formatTon(BigInt(credit.limitNano) - BigInt(credit.utilizedNano))} TON` : '—'}
            </p>
            <p className="text-xs text-text-muted mt-0.5">available</p>
          </Card>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display font-semibold">Recent activity</h2>
          <Link to="/activity" className="text-xs text-gold-700 font-medium">
            See all
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {transactions.length === 0 && <p className="text-sm text-text-muted">No transactions yet.</p>}
          {transactions.slice(0, 3).map((tx) => (
            <Card key={tx.id} className="flex items-center justify-between py-3">
              <span className="text-sm">{tx.direction === 'in' ? 'Received' : 'Sent'}</span>
              <span
                className={`font-mono text-sm tabular-nums ${tx.direction === 'in' ? 'text-success' : 'text-text-primary'}`}
              >
                {tx.direction === 'in' ? '+' : '−'}
                {formatTon(tx.amountNano)} TON
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
