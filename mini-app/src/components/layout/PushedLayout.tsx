import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { setBackButton } from '../../lib/telegram';

export function PushedLayout({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    setBackButton(() => navigate(-1));
    return () => setBackButton(null);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bg max-w-md mx-auto px-5 pb-8">
      <div className="sticky top-0 z-30 flex items-center gap-3 pt-4 pb-3 bg-bg/90 backdrop-blur">
        <button
          onClick={() => navigate(-1)}
          className="text-xl text-text-secondary leading-none"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="font-display text-lg font-semibold">{title}</h1>
      </div>
      {children}
    </div>
  );
}
