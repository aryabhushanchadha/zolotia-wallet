import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Button } from '../ui/Button';

export function ConnectWalletButton() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  if (wallet) {
    return (
      <Button variant="secondary" onClick={() => tonConnectUI.disconnect()}>
        Disconnect
      </Button>
    );
  }

  return (
    <Button onClick={() => tonConnectUI.openModal()}>
      Connect Wallet
    </Button>
  );
}
