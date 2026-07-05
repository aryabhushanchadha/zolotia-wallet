import { create } from 'zustand';
import { getTestnetBalance, getTestnetTransactions, type ChainTransaction } from '../lib/tonClient';

type WalletState = {
  address: string | null;
  balanceNano: bigint | null;
  transactions: ChainTransaction[];
  loading: boolean;
  setAddress: (address: string | null) => void;
  refresh: () => Promise<void>;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  balanceNano: null,
  transactions: [],
  loading: false,

  setAddress: (address) => {
    set({ address, balanceNano: null, transactions: [] });
    if (address) {
      get().refresh();
    }
  },

  refresh: async () => {
    const { address } = get();
    if (!address) return;
    set({ loading: true });
    try {
      const [balanceNano, transactions] = await Promise.all([
        getTestnetBalance(address),
        getTestnetTransactions(address, 15),
      ]);
      set({ balanceNano, transactions, loading: false });
    } catch (err) {
      console.error('Failed to refresh wallet state:', err);
      set({ loading: false });
    }
  },
}));
