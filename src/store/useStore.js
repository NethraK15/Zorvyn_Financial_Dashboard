import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTransactions } from "../data/transactions";
import { generateId } from "../utils/helpers";

const useStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      role: "admin",
      darkMode: false,
      filters: { search: "", type: "all", sortBy: "date", sortDir: "desc", last30Days: false, month: new Date().toISOString().substring(0, 7) },
      activePage: "dashboard",
      settings: { currency: "$", threshold: 1000 },

      setRole: (role) => set({ role }),
      setDarkMode: (v) => set({ darkMode: v }),
      setActivePage: (page) => set({ activePage: page }),
      setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
      setSettings: (settings) => set((s) => ({ settings: { ...s.settings, ...settings } })),

      addTransaction: (tx) => set((s) => ({ transactions: [{ ...tx, id: generateId() }, ...s.transactions] })),
      updateTransaction: (id, data) => set((s) => ({ transactions: s.transactions.map(t => t.id === id ? { ...t, ...data } : t) })),
      deleteTransaction: (id) => set((s) => ({ transactions: s.transactions.filter(t => t.id !== id) })),

      getFiltered: () => {
        const { transactions, filters } = get();
        let list = [...transactions];
        if (filters.type !== "all") list = list.filter(t => t.type === filters.type);
        if (filters.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(t => t.category.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q));
        }
        if (filters.last30Days) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          list = list.filter(t => new Date(t.date) >= thirtyDaysAgo);
        }
        list.sort((a, b) => {
          const dir = filters.sortDir === "asc" ? 1 : -1;
          if (filters.sortBy === "date") return dir * (new Date(a.date) - new Date(b.date));
          if (filters.sortBy === "amount") return dir * (a.amount - b.amount);
          return 0;
        });
        return list;
      },

      walletCards: [
        { id: "c1", number: "**** **** **** 4829", name: "Jane Doe", expiry: "12/28", network: "visa", color: "from-slate-900 via-slate-800 to-black", balance: 14500.50, limit: 30000, type: "Credit" },
        { id: "c2", number: "**** **** **** 9102", name: "Jane Doe", expiry: "08/27", network: "mastercard", color: "from-indigo-600 via-purple-600 to-fuchsia-600", balance: 2400.00, limit: null, type: "Debit" }
      ],
      addCard: (card) => set((s) => ({ walletCards: [...s.walletCards, { ...card, id: generateId() }] })),
      updateCard: (id, data) => set((s) => ({ walletCards: s.walletCards.map(c => c.id === id ? { ...c, ...data } : c) })),
      deleteCard: (id) => set((s) => ({ walletCards: s.walletCards.filter(c => c.id !== id) })),
    }),
    { name: "zorvyn-dashboard-v3", partialize: (s) => ({ transactions: s.transactions, darkMode: s.darkMode, role: s.role, settings: s.settings, walletCards: s.walletCards }) }
  )
);

export default useStore;
