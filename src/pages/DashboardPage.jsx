import { useMemo, useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Plus, Calendar, Landmark, Briefcase, Coins, Home, Activity, LayoutDashboard, BarChart3, PieChart as PieIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SummaryCard from "../components/ui/SummaryCard";
import DonutChart from "../components/charts/DonutChart";
import SavingsRateRing from "../components/ui/SavingsRateRing";
import AssetClassCard from "../components/ui/AssetClassCard";
import AnnualAnalysisChart from "../components/charts/AnnualAnalysisChart";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import useStore from "../store/useStore";
import { useApi } from "../hooks/useApi";
import api from "../services/api";
import { calcSummary, formatCurrency, formatDate, getCategoryBreakdown, getInvestmentAllocation, getIncomeAllocation, getAnnualFYData } from "../utils/helpers";
import { CATEGORY_COLORS } from "../data/transactions";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

const ASSET_TARGETS = {
  "Equity MF": 50000,
  "PPF": 20000,
  "NPS": 15000,
  "Gold": 5000,
  "Stocks": 40000,
  "ELSS": 10000,
  "FD": 20000,
  "Real Estate": 200000
};

// Skeleton shimmer component for loading states
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`} />;
}

export default function DashboardPage() {
  const [view, setView] = useState("overview"); // overview, income, investments, annual
  const transactions = useStore(s => s.transactions);
  const settings = useStore(s => s.settings);
  const setActivePage = useStore(s => s.setActivePage);

  // ── Mock API Calls ──────────────────────────────────────────────────────────
  const { data: apiSummary, loading: summaryLoading, error: summaryError, refetch: refetchSummary, lastUpdated: summaryUpdatedAt } = useApi(api.getDashboardSummary);
  const { data: ratesData, loading: ratesLoading, refetch: refetchRates } = useApi(() => api.getExchangeRates(settings.currency));
  const { data: forecastData, loading: forecastLoading, refetch: refetchForecast } = useApi(api.getSpendingForecast);

  const [apiPing, setApiPing] = useState(null);
  useEffect(() => {
    const start = Date.now();
    api.getDashboardSummary().then(() => setApiPing(Date.now() - start)).catch(() => setApiPing(-1));
  }, []);

  // Filter for THIS month (using string matching to avoid TZ shifts)
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthTx = useMemo(() => transactions.filter(t => t.date.startsWith(currentMonth)), [transactions, currentMonth]);

  const { income, expenses, balance } = useMemo(() => calcSummary(thisMonthTx), [thisMonthTx]);

  // Custom Investment Calculation for Dashboard (Exclude from general expense for "Investment" card)
  const currentInvestments = useMemo(() => {
    const assets = Object.keys(ASSET_TARGETS);
    return thisMonthTx.filter(t => assets.includes(t.category)).reduce((s, t) => s + t.amount, 0);
  }, [thisMonthTx]);

  const currentExpensesNoInv = expenses - currentInvestments;

  // Savings rate
  const savingsRate = income > 0 ? Math.round(((income - currentExpensesNoInv - currentInvestments) / income) * 100) : 0;

  // All-time Net Worth
  const allTimeSnapshot = useMemo(() => calcSummary(transactions), [transactions]);

  // Allocation data
  const expenseAllocation = useMemo(() => getCategoryBreakdown(thisMonthTx), [thisMonthTx]);
  const investmentAllocation = useMemo(() => getInvestmentAllocation(transactions), [transactions]);
  const incomeAllocation = useMemo(() => getIncomeAllocation(transactions), [transactions]);
  const annualData = useMemo(() => getAnnualFYData(transactions), [transactions]);

  const recent = useMemo(() => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6), [transactions]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 sm:p-8 space-y-12 max-w-[1500px] mx-auto pb-32"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div variants={item}>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            Hello, <span className="text-indigo-500">Jane Doe !!</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Welcome back to your financial engine</p>
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap gap-4">
          <motion.div 
            whileHover={{ y: -2, scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
            className="p-4 bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl flex gap-6 items-center shadow-lg cursor-pointer transition-colors hover:border-indigo-500/30"
          >
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Net worth</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(allTimeSnapshot.balance, settings.currency)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-indigo-500" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2, scale: 1.05, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
            className="p-4 bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl flex gap-6 items-center shadow-lg cursor-pointer transition-colors hover:border-emerald-500/30"
          >
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Inflow</p>
              <p className="text-xl font-black text-emerald-500">{formatCurrency(allTimeSnapshot.income, settings.currency)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2, scale: 1.05, boxShadow: "0 10px 25px -5px rgba(244, 63, 94, 0.4)" }}
            className="p-4 bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl flex gap-6 items-center shadow-lg cursor-pointer transition-colors hover:border-rose-500/30"
          >
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Outflow</p>
              <p className="text-xl font-black text-rose-500">{formatCurrency(allTimeSnapshot.expenses, settings.currency)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-rose-500" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Dashboard Sub-tab Selector */}
      <motion.div variants={item} className="sticky top-0 z-20 pt-2 pb-4 pointer-events-none">
        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100/80 dark:bg-slate-950/90 backdrop-blur-2xl rounded-[20px] border border-slate-200 dark:border-slate-800 w-fit relative overflow-hidden shadow-xl mx-auto md:mx-0 pointer-events-auto">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "income", label: "Income Deep-dive", icon: TrendingUp },
            { id: "investments", label: "Wealth Inventory", icon: Briefcase },
            { id: "annual", label: "Fiscal Analysis", icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => {
            const active = view === id;
            return (
              <motion.button
                key={id}
                onClick={() => setView(id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 z-10
                  ${active 
                    ? "text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]" 
                    : "text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white"
                  }`}
              >
                {active && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl z-[-1]"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${active ? "animate-pulse" : ""}`} />
                {label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-12"
          >
            {/* Monthly Snapshot */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Monthly <span className="text-indigo-500">Snapshot</span></h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Monthly Income" value={formatCurrency(income, settings.currency)} icon={TrendingUp} color="emerald" sub="Total inflows" />
                <SummaryCard title="Operational Exp" value={formatCurrency(currentExpensesNoInv, settings.currency)} icon={ArrowDownRight} color="rose" sub="Non-investment spending" />
                <SummaryCard title="Capital Invested" value={formatCurrency(currentInvestments, settings.currency)} icon={Briefcase} color="indigo" sub="Asset deployments" />
                <SummaryCard title="Surplus Savings" value={formatCurrency(balance, settings.currency)} icon={Wallet} color="teal" sub="Liquidity buffer" />
              </div>
            </section>

            {/* Mixed Allocation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SavingsRateRing rate={savingsRate} />
              <DonutChart title="Expense Split" data={expenseAllocation} colors={CATEGORY_COLORS} />
              <DonutChart title="Income Sources" data={incomeAllocation} colors={CATEGORY_COLORS} />
              <DonutChart title="Investment Mix" data={investmentAllocation} colors={CATEGORY_COLORS} />
            </div>

            {/* Recent Table */}
            <Card hover={false} className="border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Unified <span className="text-indigo-500">Ledger</span></h2>
                <button onClick={() => setActivePage("transactions")} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b-2 border-indigo-500/20 hover:border-indigo-500 transition-all pb-1">Full Ledger</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {recent.map((tx, idx) => (
                  <div key={tx.id} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold" style={{ background: CATEGORY_COLORS[tx.category] || "#6366f1" }}>{tx.category[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-slate-800 dark:text-slate-100 truncate">{tx.description}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{tx.category} · {formatDate(tx.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>{tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, settings.currency)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {view === "income" && (
          <motion.div
            key="income"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <DonutChart title="Source Categorization" data={incomeAllocation} colors={CATEGORY_COLORS} />
              </div>
              <Card className="lg:col-span-2 p-8 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl shadow-xl">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8">Income <span className="text-emerald-500">History</span></h3>
                <div className="space-y-2">
                  {transactions.filter(t => t.type === "income").slice(0, 10).map((tx, idx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">{tx.category[0]}</div>
                        <div>
                          <p className="text-sm font-black text-slate-800 dark:text-slate-100">{tx.description}</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">{tx.category} · {formatDate(tx.date)}</p>
                        </div>
                      </div>
                      <p className="text-lg font-black text-emerald-500">+{formatCurrency(tx.amount, settings.currency)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {view === "investments" && (
          <motion.div
            key="investments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(ASSET_TARGETS).map(([name, target]) => {
                const actual = transactions.filter(t => t.category === name).reduce((s, t) => s + t.amount, 0);
                return <AssetClassCard key={name} name={name} target={target} actual={actual} color={CATEGORY_COLORS[name]} />;
              })}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <DonutChart title="Portfolio Diversification" data={investmentAllocation} colors={CATEGORY_COLORS} />
              </div>
              <Card className="lg:col-span-2 p-8 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl shadow-xl">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8">Deployment <span className="text-indigo-500">History</span></h3>
                <div className="space-y-2">
                  {transactions.filter(t => Object.keys(ASSET_TARGETS).includes(t.category)).slice(0, 10).map((tx, idx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm" style={{ background: CATEGORY_COLORS[tx.category] }}>{tx.category[0]}</div>
                        <div>
                          <p className="text-sm font-black text-slate-800 dark:text-slate-100">{tx.description}</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">{tx.category} · {formatDate(tx.date)}</p>
                        </div>
                      </div>
                      <p className={`text-lg font-black ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, settings.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {view === "annual" && (
          <motion.div
            key="annual"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <AnnualAnalysisChart data={annualData} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 p-8 border-none bg-white/50 dark:bg-slate-950/90 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Fiscal <span className="text-indigo-500">Calendar</span></h3>
                  <span className="text-[10px] font-black uppercase text-slate-400">Mar 2026</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {annualData.map((d, i) => (
                    <button key={i} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all group
                      ${i === 11 ? "bg-indigo-500 text-white border-indigo-500 shadow-xl" : "bg-white/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-indigo-400"}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest">{d.name}</span>
                      <div className={`w-2 h-2 rounded-full ${d.income > d.expense ? "bg-emerald-400" : "bg-rose-400 shadow-inner"}`} />
                    </button>
                  ))}
                </div>
              </Card>
              <Card className="p-8 border-none bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/20">
                <div className="flex flex-col h-full">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Portfolio Yield Efficiency</p>
                  <h3 className="text-3xl font-black mt-3">+12.8% <span className="text-sm opacity-60 font-medium">YoY</span></h3>
                  <div className="mt-auto space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase"><span>Compounded yield</span><span>9.4%</span></div>
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden leading-none"><div className="bg-white h-full w-[85%]" /></div>
                    </div>
                    <p className="text-[11px] font-medium leading-relaxed opacity-90">Target portfolio trajectory (FY26): <span className="font-black underline">{formatCurrency(allTimeSnapshot.balance * 1.15, settings.currency)}</span></p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── API Integration Panel ─────────────────────────────────────────── */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">

        {/* API Health Banner */}
        <Card className="col-span-full p-6 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${summaryError ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">API Connection Status</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {summaryError ? '⚠ Connection Error' : summaryLoading ? 'Establishing Connection…' : `✓ Zorvyn Mock API  —  ${apiPing ? apiPing + 'ms latency' : 'connected'}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {summaryUpdatedAt && (
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Last Synced</p>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{summaryUpdatedAt.toLocaleTimeString()}</p>
                </div>
              )}
              <button
                onClick={() => { refetchSummary(); refetchRates(); refetchForecast(); }}
                className="px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20"
              >
                Refresh All
              </button>
            </div>
          </div>

          {/* API KPI row from server */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {summaryLoading ? (
              [1,2,3,4].map(i => <Skeleton key={i} className="h-16" />)
            ) : summaryError ? (
              <p className="col-span-4 text-center text-sm text-rose-500 font-bold py-4">{summaryError}</p>
            ) : [
              { label: 'Total Income (API)', value: formatCurrency(apiSummary?.income || 0, settings.currency), color: 'text-emerald-500' },
              { label: 'Total Expenses (API)', value: formatCurrency(apiSummary?.expenses || 0, settings.currency), color: 'text-rose-500' },
              { label: 'Net Worth (API)', value: formatCurrency(apiSummary?.netWorth || 0, settings.currency), color: 'text-indigo-500' },
              { label: 'Savings Rate (API)', value: `${apiSummary?.savingsRate || 0}%`, color: 'text-amber-500' },
            ].map(kpi => (
              <div key={kpi.label} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.label}</p>
                <p className={`text-xl font-black ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Exchange Rates */}
        <Card className="p-6 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Exchange Rates</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">Base: {ratesData?.base || settings.currency}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-lg font-black">fx</div>
          </div>
          <div className="space-y-3">
            {ratesLoading ? (
              [1,2,3,4].map(i => <Skeleton key={i} className="h-10" />)
            ) : ratesData ? (
              Object.entries(ratesData.rates).map(([code, rate]) => (
                <div key={code} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">{code}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{rate.toFixed(4)}</span>
                </div>
              ))
            ) : null}
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-4">Updated: {ratesData?.updatedAt ? new Date(ratesData.updatedAt).toLocaleTimeString() : '—'}</p>
        </Card>

        {/* Spending Forecast */}
        <Card className="lg:col-span-2 p-6 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Spending Forecast</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">
                Next 30 Days — <span className="text-indigo-500">{forecastData ? formatCurrency(forecastData.avgMonthly, settings.currency) : '…'}</span> projected
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-violet-500" />
            </div>
          </div>
          {forecastLoading ? (
            <div className="grid grid-cols-4 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}</div>
          ) : forecastData ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {forecastData.weeklyForecast.map((w, i) => {
                const maxVal = Math.max(...forecastData.weeklyForecast.map(x => x.predicted));
                const pct = Math.round((w.predicted / maxVal) * 100);
                return (
                  <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 gap-3">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-20 flex items-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                        className="w-full rounded-full bg-gradient-to-t from-indigo-500 to-violet-400"
                      />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{w.week}</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white">{formatCurrency(w.predicted, settings.currency)}</p>
                  </div>
                );
              })}
            </div>
          ) : null}
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-4">Forecast based on trailing 3-month avg. via Zorvyn Analytics API</p>
        </Card>

      </motion.div>

    </motion.div>
  );
}

