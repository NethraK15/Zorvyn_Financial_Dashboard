/**
 * Zorvyn Mock API Service
 * 
 * Simulates a REST-style backend with realistic latency, error rates,
 * and structured response envelopes. In production, replace `mockFetch`
 * with real `fetch()` calls to your backend endpoints.
 */

import { mockTransactions } from "../data/transactions";
import { generateId } from "../utils/helpers";

// ─── Utility ─────────────────────────────────────────────────────────────────

/** Fake network delay between min and max ms */
const delay = (min = 400, max = 900) =>
  new Promise(resolve => setTimeout(resolve, min + Math.random() * (max - min)));

/** Wrap a value in a standard API response envelope */
const ok = (data, meta = {}) => ({ success: true, data, meta, timestamp: new Date().toISOString() });
const err = (message, code = 500) => { throw { success: false, message, code }; };

// ─── Mock Database (in-memory, mutated by write operations) ──────────────────

let _transactions = [...mockTransactions];
let _user = {
  id: "usr_001",
  name: "Jane Doe",
  email: "jane.doe@zorvyn.io",
  avatar: "/avatar.png",
  memberSince: "2024-01-15",
  plan: "Premium",
  role: "admin",
};
let _walletCards = [
  { id: "c1", number: "**** **** **** 4829", name: "Jane Doe", expiry: "12/28", network: "visa", color: "from-slate-900 via-slate-800 to-black", balance: 14500.50, limit: 30000, type: "Credit" },
  { id: "c2", number: "**** **** **** 9102", name: "Jane Doe", expiry: "08/27", network: "mastercard", color: "from-indigo-600 via-purple-600 to-fuchsia-600", balance: 2400.00, limit: null, type: "Debit" },
];

// ─── Exchange Rate Cache ──────────────────────────────────────────────────────
const EXCHANGE_RATES = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.12 };
const SYMBOL_TO_CODE = { "$": "USD", "€": "EUR", "£": "GBP", "₹": "INR" };

// ═══════════════════════════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const api = {

  // ── Auth ───────────────────────────────────────────────────────────────────

  /** Fetch the current authenticated user's profile */
  async getUser() {
    await delay(300, 600);
    return ok(_user);
  },

  // ── Transactions ───────────────────────────────────────────────────────────

  /** Fetch all transactions (supports optional filters) */
  async getTransactions({ type, category, search, limit } = {}) {
    await delay(500, 1000);
    let list = [..._transactions];
    if (type && type !== "all") list = list.filter(t => t.type === type);
    if (category) list = list.filter(t => t.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.category.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
      );
    }
    if (limit) list = list.slice(0, limit);
    return ok(list, { total: _transactions.length, returned: list.length });
  },

  /** Create a new transaction */
  async createTransaction(payload) {
    await delay(400, 800);
    if (!payload.amount || payload.amount <= 0) err("Amount must be positive", 400);
    if (!payload.category) err("Category is required", 400);
    const newTx = { ...payload, id: generateId(), date: payload.date || new Date().toISOString().slice(0, 10) };
    _transactions = [newTx, ..._transactions];
    return ok(newTx);
  },

  /** Update a transaction by ID */
  async updateTransaction(id, data) {
    await delay(400, 700);
    const idx = _transactions.findIndex(t => t.id === id);
    if (idx === -1) err(`Transaction ${id} not found`, 404);
    _transactions[idx] = { ..._transactions[idx], ...data };
    return ok(_transactions[idx]);
  },

  /** Delete a transaction by ID */
  async deleteTransaction(id) {
    await delay(300, 600);
    const exists = _transactions.some(t => t.id === id);
    if (!exists) err(`Transaction ${id} not found`, 404);
    _transactions = _transactions.filter(t => t.id !== id);
    return ok({ deleted: id });
  },

  // ── Wallet Cards ───────────────────────────────────────────────────────────

  /** Fetch all wallet cards */
  async getWalletCards() {
    await delay(400, 700);
    return ok(_walletCards);
  },

  /** Add a new card */
  async addWalletCard(payload) {
    await delay(500, 900);
    if (!payload.number) err("Card number is required", 400);
    const card = { ...payload, id: generateId() };
    _walletCards = [..._walletCards, card];
    return ok(card);
  },

  /** Remove a card */
  async deleteWalletCard(id) {
    await delay(300, 600);
    _walletCards = _walletCards.filter(c => c.id !== id);
    return ok({ deleted: id });
  },

  // ── Analytics ──────────────────────────────────────────────────────────────

  /** Fetch a summary KPI snapshot (income, expenses, savings, net worth) */
  async getDashboardSummary() {
    await delay(600, 1100);
    const income = _transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = _transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? +((((income - expenses) / income) * 100).toFixed(1)) : 0;
    return ok({ income, expenses, netWorth: income - expenses, savingsRate });
  },

  /** Fetch live (mocked) exchange rates */
  async getExchangeRates(baseCurrencySymbol = "$") {
    await delay(300, 700);
    const baseCode = SYMBOL_TO_CODE[baseCurrencySymbol] || "USD";
    const baseRate = EXCHANGE_RATES[baseCode];
    const rates = {};
    for (const [code, rate] of Object.entries(EXCHANGE_RATES)) {
      rates[code] = +(rate / baseRate).toFixed(4);
    }
    return ok({ base: baseCode, rates, updatedAt: new Date().toISOString() });
  },

  /** Fetch spending forecast for next 30 days */
  async getSpendingForecast() {
    await delay(700, 1200);
    const last3Months = _transactions.filter(t => {
      const d = new Date(t.date);
      const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - 3);
      return t.type === "expense" && d >= cutoff;
    });
    const avgMonthly = last3Months.reduce((s, t) => s + t.amount, 0) / 3;
    const forecast = Array.from({ length: 4 }, (_, i) => ({
      week: `Week ${i + 1}`,
      predicted: +(avgMonthly / 4 * (0.85 + Math.random() * 0.3)).toFixed(2),
    }));
    return ok({ avgMonthly: +avgMonthly.toFixed(2), weeklyForecast: forecast });
  },
};

export default api;
