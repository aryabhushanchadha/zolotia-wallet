import type { ReactNode } from 'react';

export function ListRow({
  label,
  value,
  onClick,
  danger,
  chevron,
}: {
  label: string;
  value?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  chevron?: boolean;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`flex w-full items-center justify-between px-4 py-3.5 text-left ${
        onClick ? 'active:bg-surface-raised' : ''
      }`}
    >
      <span className={`text-sm ${danger ? 'text-danger font-medium' : 'text-text-primary'}`}>{label}</span>
      <span className="flex items-center gap-1.5 text-sm text-text-secondary min-w-0">
        {value}
        {chevron && <span className="text-text-muted">›</span>}
      </span>
    </Tag>
  );
}
