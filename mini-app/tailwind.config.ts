import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--z-bg)',
        surface: 'var(--z-surface)',
        'surface-raised': 'var(--z-surface-raised)',
        border: 'var(--z-border)',
        gold: {
          100: 'var(--z-gold-100)',
          300: 'var(--z-gold-300)',
          500: 'var(--z-gold-500)',
          700: 'var(--z-gold-700)',
        },
        violet: {
          100: 'var(--z-violet-100)',
          500: 'var(--z-violet-500)',
          700: 'var(--z-violet-700)',
        },
        text: {
          primary: 'var(--z-text-primary)',
          secondary: 'var(--z-text-secondary)',
          muted: 'var(--z-text-muted)',
        },
        success: {
          DEFAULT: 'var(--z-success)',
          100: 'var(--z-success-100)',
        },
        danger: 'var(--z-danger)',
        warning: 'var(--z-warning)',
        info: 'var(--z-info)',
      },
      borderRadius: {
        sm: 'var(--z-radius-sm)',
        md: 'var(--z-radius-md)',
        lg: 'var(--z-radius-lg)',
      },
      boxShadow: {
        card: 'var(--z-shadow-card)',
        gold: 'var(--z-shadow-gold)',
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', 'sans-serif'],
        body: ['"Inter Variable"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gold-violet': 'linear-gradient(135deg, var(--z-gold-500) 0%, var(--z-violet-500) 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
