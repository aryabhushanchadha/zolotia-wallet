import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gold-violet text-white shadow-gold',
  secondary: 'bg-surface border border-border text-text-primary',
  ghost: 'bg-transparent text-text-primary',
  danger: 'bg-danger text-white',
};

type Props = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  variant?: Variant;
  icon?: ReactNode;
  fullWidth?: boolean;
};

export function Button({ variant = 'primary', icon, fullWidth, className = '', children, ...rest }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-display font-medium text-sm ${
        fullWidth ? 'w-full' : ''
      } ${variantClasses[variant]} ${className} disabled:opacity-50`}
      {...rest}
    >
      {icon}
      {children}
    </motion.button>
  );
}
