import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { TabBar } from './TabBar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg max-w-md mx-auto">
      <TopBar />
      <main className="flex-1 px-5 pb-6">{children}</main>
      <TabBar />
    </div>
  );
}
