import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/activity', label: 'Activity', icon: '📜' },
  { to: '/invest', label: 'Invest', icon: '📈' },
  { to: '/credit', label: 'Credit', icon: '💳' },
  { to: '/wallet', label: 'Wallet', icon: '👛' },
];

export function TabBar() {
  return (
    <nav className="sticky bottom-0 z-30 flex justify-around border-t border-border bg-surface-raised px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md text-xs font-medium ${
              isActive ? 'text-gold-700' : 'text-text-muted'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <motion.span animate={{ scale: isActive ? 1.15 : 1 }} className="text-lg leading-none">
                {tab.icon}
              </motion.span>
              {tab.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
