import type { HTMLAttributes } from 'react';

export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg bg-surface border border-border shadow-card p-4 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
