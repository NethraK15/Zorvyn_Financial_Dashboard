import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Card from "../ui/Card";
import { PiggyBank, ArrowUpRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import useStore from "../../store/useStore";
import { calcSummary, formatCurrency } from "../../utils/helpers";

const GOALS = [
  { name: "Emergency Fund", target: 50000, current: 32000, color: "#6366f1" },
  { name: "New Property", target: 500000, current: 45000, color: "#10b981" },
  { name: "Retirement", target: 2000000, current: 120000, color: "#f59e0b" },
];

export default function SavingsChart() {
  const { transactions, settings } = useStore();
  const { income, expenses } = calcSummary(transactions);
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  return (
    <Card className="p-7 h-full border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl group overflow-hidden" hover={false}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">Savings <span className="text-emerald-500">Analytics</span></h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-2">Capital preservation</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-black uppercase tracking-tighter">{savingsRate}% Rate</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {GOALS.map((goal, idx) => {
          const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
          return (
            <div key={goal.name} className="space-y-2 group/goal">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: goal.color }} />
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">{goal.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900 dark:text-white">{formatCurrency(goal.current, settings.currency)} <span className="text-slate-400 dark:text-slate-500">/ {formatCurrency(goal.target, settings.currency)}</span></p>
                </div>
              </div>
              <div className="relative h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/20 dark:border-slate-700/30">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, delay: idx * 0.2 }}
                  className="h-full rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)]"
                  style={{ backgroundColor: goal.color }}
                />
              </div>
              <div className="flex justify-between items-center px-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{percent}% Reached</span>
                <button className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter opacity-0 group-hover/goal:opacity-100 transition-opacity flex items-center gap-1 translate-y-1 group-hover/goal:translate-y-0 transition-transform duration-300">
                  Boost <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 flex items-center gap-4 group cursor-pointer relative overflow-hidden">
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 relative z-10 group-hover:rotate-12 transition-transform">
          <PiggyBank className="w-6 h-6" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Reserve</p>
          <p className="text-xl font-black tracking-tight">{formatCurrency(GOALS.reduce((s, g) => s + g.current, 0), settings.currency)}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>
    </Card>
  );
}
