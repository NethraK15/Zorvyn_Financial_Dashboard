import { TrendingUp, TrendingDown, Minus, Award, BarChart2, AlertCircle, FileSpreadsheet, Download, FileText, Sparkles, Lightbulb, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Card from "../components/ui/Card";
import SavingsChart from "../components/charts/SavingsChart";
import SavingsTrendChart from "../components/charts/SavingsTrendChart";
import ComparatorCard from "../components/charts/ComparatorCard";
import useStore from "../store/useStore";
import { getMonthlyComparison, getCategoryBreakdown, formatCurrency, calcSummary } from "../utils/helpers";
import { CATEGORY_COLORS } from "../data/transactions";

function ChangeChip({ pct }) {
  if (pct === 0) return <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400"><Minus className="w-3 h-3" />No change</span>;
  const up = pct > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-red-500" : "text-emerald-500"}`}>
      {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
      {Math.abs(pct)}% {up ? "more" : "less"} than last month
    </span>
  );
}

function InsightCard({ icon: Icon, iconColor, iconBg, title, value, sub, chip }) {
  return (
    <Card className="p-6 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all h-full">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm border border-white/20 dark:border-slate-800/50`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
          <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
          {sub && <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-wide">{sub}</p>}
          {chip && <div className="mt-3">{chip}</div>}
        </div>
      </div>
    </Card>
  );
}

export default function InsightsPage() {
  const { transactions, settings } = useStore();
  const cmp = getMonthlyComparison(transactions);
  const breakdown = getCategoryBreakdown(transactions);
  const topCategory = breakdown[0];
  const totalExpenses = breakdown.reduce((s, b) => s + b.value, 0);

  const now = new Date();
  const thisMonthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const prevMonthLabel = new Date(now.getFullYear(), now.getMonth() - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const downloadCashFlow = () => {
    const s = settings.currency;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cash Flow Statement - Artha Enterprise</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: auto; color: #1e293b; background: #f8fafc; }
            .card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
            h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; font-weight: 900; }
            h2 { color: #334155; margin-top: 40px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 2px; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding: 16px 0; }
            .total { font-weight: 900; font-size: 1.1rem; color: #0f172a; margin-top: 20px; border-top: 2px solid #cbd5e1; border-bottom: none; }
            .subtotal { font-weight: 700; color: #475569; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Artha Financials</h1>
            <p><strong>Entity:</strong> Artha Enterprise<br/><strong>Period:</strong> Q1 2026<br/><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h2>Operating Activities</h2>
            <div class="row"><span>Net Income</span><span>${s}450,000</span></div>
            <div class="row"><span>Adjustments to Reconcile</span><span>${s}120,000</span></div>
            <div class="row subtotal"><span>Net Cash from Operating Activities</span><span>${s}570,000</span></div>
            
            <h2>Investing Activities</h2>
            <div class="row"><span>Capital Expenditures</span><span>(${s}80,000)</span></div>
            <div class="row subtotal"><span>Net Cash from Investing Activities</span><span>(${s}80,000)</span></div>
            
            <h2>Financing Activities</h2>
            <div class="row"><span>Debt Mitigation (Loan Repayment)</span><span>(${s}50,000)</span></div>
            <div class="row subtotal"><span>Net Cash from Financing Activities</span><span>(${s}50,000)</span></div>
            
            <div class="row total"><span>NET LIQUIDITY INCREASE</span><span>${s}440,000</span></div>
            <div class="row total" style="color: #4f46e5; font-size: 1.4rem;"><span>Ending Cash Balance</span><span>${s}1,250,000</span></div>
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Artha_CashFlow_Q1_2026.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            Deep <span className="text-indigo-500">Analytics</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Financial pattern recognition</p>
        </div>
        <button 
          onClick={downloadCashFlow}
          className="flex items-center gap-3 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-black uppercase tracking-widest"
        >
          <FileText className="w-5 h-5 text-indigo-500" /> Cash Flow Statement
        </button>
      </div>

      {/* Top insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InsightCard
          icon={Award}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          title="Highest Spending"
          value={topCategory ? topCategory.name : "N/A"}
          sub={topCategory ? `${formatCurrency(topCategory.value, settings.currency)} total spent` : undefined}
          chip={topCategory ? (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {Math.round((topCategory.value / totalExpenses) * 100)}% of total expenses
            </span>
          ) : null}
        />
        <InsightCard
          icon={TrendingDown}
          iconColor="text-red-500 dark:text-red-400"
          iconBg="bg-red-50 dark:bg-red-900/20"
          title={`${thisMonthLabel} Expenses`}
          value={formatCurrency(cmp.thisExpenses, settings.currency)}
          sub={`vs ${formatCurrency(cmp.prevExpenses, settings.currency)} in ${prevMonthLabel}`}
          chip={<ChangeChip pct={cmp.expenseChange} />}
        />
        <InsightCard
          icon={TrendingUp}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
          title={`${thisMonthLabel} Income`}
          value={formatCurrency(cmp.thisIncome, settings.currency)}
          sub={`vs ${formatCurrency(cmp.prevIncome, settings.currency)} in ${prevMonthLabel}`}
          chip={<ChangeChip pct={-cmp.incomeChange} />}
        />
      </div>

      {/* Primary Comparators Sector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ComparatorCard title="Monthly Delta Comparison" type="monthly" transactions={transactions} />
        <ComparatorCard title="Yearly Horizon Analysis" type="yearly" transactions={transactions} />
      </div>

      {/* Productivity & Velocity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SavingsTrendChart />
        </div>
        <div>
          <SavingsChart />
        </div>
      </div>

      {/* Savings Strategies & Notes */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Strategic <span className="text-indigo-500">Savings Notes</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -5, scale: 1.02, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.15)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Card className="p-6 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-sm h-full" hover={false}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-2">Pro-Tip: Auto-Invest</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">Enable "Standing Instructions" for your Mutual Fund SIPs. By automating the deduction, you treat savings as a non-negotiable expense.</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5, scale: 1.02, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.15)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Card className="p-6 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-sm h-full" hover={false}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-2">Liability reduction</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">Your "Operational Expense" this month is trending 12% lower. Redirect this surplus into your PPF for tax-free compounded growth.</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5, scale: 1.02, boxShadow: "0 10px 30px rgba(245, 158, 11, 0.15)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Card className="p-6 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-sm h-full" hover={false}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-2">Emergency Buffer</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">Ensure you maintain 6 months of absolute expenses in a liquid FD. Your current buffer covers 4.2 months based on recent volatility.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
