import { motion } from 'framer-motion';

export function Logo({ size = 28, animated = false }: { size?: number; animated?: boolean }) {
  const Coin = animated ? motion.svg : 'svg';
  const animProps = animated
    ? {
        animate: { rotate: [0, 8, -8, 0] },
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      }
    : {};

  return (
    <span className="inline-flex items-center gap-1.5 font-display font-semibold text-text-primary select-none">
      <span>Zol</span>
      <Coin width={size} height={size} viewBox="0 0 28 28" {...animProps}>
        <defs>
          <radialGradient id="zolotia-coin" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="var(--z-gold-300)" />
            <stop offset="100%" stopColor="var(--z-violet-500)" />
          </radialGradient>
        </defs>
        <circle cx="14" cy="14" r="12.5" fill="url(#zolotia-coin)" stroke="var(--z-gold-700)" strokeWidth="1" />
        <circle cx="14" cy="14" r="8.5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      </Coin>
      <span>tia</span>
    </span>
  );
}
