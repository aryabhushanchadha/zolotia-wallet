import { useState } from 'react';

function truncate(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export function AddressPill({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-sm bg-surface-raised border border-border px-2.5 py-1 font-mono text-xs text-text-secondary"
    >
      {truncate(address)}
      <span>{copied ? '✓' : '⧉'}</span>
    </button>
  );
}
