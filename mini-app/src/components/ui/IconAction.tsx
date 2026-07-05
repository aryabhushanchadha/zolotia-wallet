import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Tint = 'violet' | 'gold' | 'success' | 'neutral';

const tintClasses: Record<Tint, string> = {
  violet: 'bg-violet-100 text-violet-700',
  gold: 'bg-gold-100 text-gold-700',
  success: 'bg-success-100 text-success',
  neutral: 'bg-surface-raised text-text-secondary border border-border',
};

export function IconAction({
  to,
  icon,
  label,
  tint,
  disabled,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  tint: Tint;
  disabled?: boolean;
}) {
  return (
    <Link
      to={disabled ? '#' : to}
      onClick={(e) => disabled && e.preventDefault()}
      className={`flex flex-col items-center gap-1.5 ${disabled ? 'opacity-40' : ''}`}
    >
      <motion.span
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className={`flex h-14 w-14 items-center justify-center rounded-full text-xl ${tintClasses[tint]}`}
      >
        {icon}
      </motion.span>
      <span className="text-xs font-medium text-text-primary">{label}</span>
    </Link>
  );
}
