import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppShell } from './components/layout/AppShell';
import { PushedLayout } from './components/layout/PushedLayout';
import { PageTransition } from './components/layout/PageTransition';
import { Home } from './screens/Home';
import { Activity } from './screens/Activity';
import { Invest } from './screens/Invest';
import { Credit } from './screens/Credit';
import { Wallet } from './screens/Wallet';
import { Send } from './screens/Send';
import { Receive } from './screens/Receive';
import { BuySell } from './screens/BuySell';

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppShell><PageTransition><Home /></PageTransition></AppShell>} />
        <Route path="/activity" element={<AppShell><PageTransition><Activity /></PageTransition></AppShell>} />
        <Route path="/invest" element={<AppShell><PageTransition><Invest /></PageTransition></AppShell>} />
        <Route path="/credit" element={<AppShell><PageTransition><Credit /></PageTransition></AppShell>} />
        <Route path="/wallet" element={<AppShell><PageTransition><Wallet /></PageTransition></AppShell>} />

        <Route path="/send" element={<PushedLayout title="Send TON"><PageTransition><Send /></PageTransition></PushedLayout>} />
        <Route path="/receive" element={<PushedLayout title="Receive TON"><PageTransition><Receive /></PageTransition></PushedLayout>} />
        <Route path="/buy" element={<PushedLayout title="Buy TON"><PageTransition><BuySell side="buy" /></PageTransition></PushedLayout>} />
        <Route path="/sell" element={<PushedLayout title="Sell TON"><PageTransition><BuySell side="sell" /></PageTransition></PushedLayout>} />
      </Routes>
    </AnimatePresence>
  );
}
