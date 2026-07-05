import { useState } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { ListRow } from '../components/ui/ListRow';
import { useWalletStore } from '../state/walletStore';

function truncate(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function Wallet() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const address = useWalletStore((s) => s.address);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-5 pt-4">
      <div>
        <p className="text-xs text-text-secondary font-medium mb-2 px-1">Network</p>
        <div className="rounded-md bg-surface border border-border divide-y divide-border overflow-hidden">
          <ListRow label="Network" value="TON Testnet" />
          {address ? (
            <ListRow label="Address" value={truncate(address)} onClick={copyAddress} chevron={!copied} />
          ) : (
            <ListRow label="Address" value="Not connected" />
          )}
          {wallet && <ListRow label="Connected wallet" value={wallet.device.appName} />}
        </div>
        {copied && <p className="text-xs text-success mt-1.5 px-1">Address copied</p>}
      </div>

      <div className="rounded-md bg-surface border border-border overflow-hidden">
        {wallet ? (
          <ListRow label="Disconnect" danger onClick={() => tonConnectUI.disconnect()} />
        ) : (
          <ListRow label="Connect wallet" onClick={() => tonConnectUI.openModal()} chevron />
        )}
      </div>

      <p className="text-xs text-text-muted px-1">
        Zolotia is non-custodial: it never holds your private keys. All signing happens in your connected wallet app.
      </p>
    </div>
  );
}
