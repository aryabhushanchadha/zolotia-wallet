import { useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { AppRoutes } from './router';
import { useWalletStore } from './state/walletStore';

export default function App() {
  const rawAddress = useTonAddress(false);
  const setAddress = useWalletStore((s) => s.setAddress);

  useEffect(() => {
    setAddress(rawAddress || null);
  }, [rawAddress, setAddress]);

  return <AppRoutes />;
}
