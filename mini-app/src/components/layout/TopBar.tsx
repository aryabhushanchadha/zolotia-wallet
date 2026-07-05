import { Logo } from '../ui/Logo';

export function TopBar() {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between px-5 pt-4 pb-3 bg-bg/90 backdrop-blur">
      <Logo animated />
      <span className="rounded-sm bg-gold-100 text-gold-700 text-xs font-medium px-2 py-1">Testnet</span>
    </div>
  );
}
