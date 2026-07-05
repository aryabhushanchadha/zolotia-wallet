import { QRCodeSVG } from 'qrcode.react';
import { AddressPill } from '../components/wallet/AddressPill';
import { useWalletStore } from '../state/walletStore';

export function Receive() {
  const address = useWalletStore((s) => s.address);

  if (!address) {
    return <p className="text-sm text-text-secondary pt-6">Connect a wallet first to see your receive address.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-5 pt-6">
      <div className="rounded-lg bg-surface border border-border p-5 shadow-card">
        <QRCodeSVG value={address} size={200} fgColor="#1c1a15" bgColor="#ffffff" />
      </div>
      <p className="text-sm text-text-secondary text-center">
        Share this address to receive TON on the testnet. Only send TON (testnet) to this address.
      </p>
      <AddressPill address={address} />
    </div>
  );
}
