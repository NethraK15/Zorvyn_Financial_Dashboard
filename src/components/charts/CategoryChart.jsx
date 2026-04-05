import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import Card from "../ui/Card";
import { getCategoryBreakdown } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../data/transactions";
import useStore from "../../store/useStore";

export default function CategoryChart() {
  const { transactions, settings } = useStore();
  const raw = getCategoryBreakdown(transactions);
  const total = raw.reduce((s, r) => s + r.value, 0);
  const data = raw.map(r => ({ ...r, percent: Math.round((r.value / total) * 100) }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 px-4 py-3 flex flex-col gap-1.5 anim-scale-in">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{payload[0].name}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-black text-indigo-500">{settings.currency}{payload[0].value.toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-400">{payload[0].payload.percent}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const showInsight = () => {
    if (!data.length) return;
    const top = data[0];
    alert(`Composition Insight:\n\nYour highest spending category is ${top.name}, accounting for ${top.percent}% of your total expenses. \nYou might want to review your ${top.name} budget next month.`);
  };

  if (!data.length) return (
    <Card className="p-8 flex flex-col items-center justify-center h-full text-slate-400 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl" hover={false}>
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      </div>
      <p className="font-bold text-sm tracking-tight uppercase">Analytic records empty</p>
    </Card>
  );

  return (
    <Card className="p-7 h-full border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl group overflow-hidden" hover={false}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">Distri<span className="text-indigo-500">bution</span></h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-2">Spending clusters</p>
        </div>
        <button 
          onClick={showInsight}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
        >
          <Lightbulb className="w-3 h-3" /> Insight
        </button>
      </div>
      
      <div className="flex flex-col gap-8">
        <div className="relative h-[200px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                cx="50%" 
                cy="50%" 
                innerRadius={65} 
                outerRadius={95} 
                dataKey="value" 
                paddingAngle={4}
                animationDuration={1500}
                animationEasing="ease-in-out"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell 
                    key={entry.name} 
                    fill={CATEGORY_COLORS[entry.name] || "#6366f1"} 
                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{settings.currency}{total > 1000 ? (total/1000).toFixed(1) + 'k' : total}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.slice(0, 6).map((item, idx) => (
            <motion.div 
              key={item.name} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-default"
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm ring-2 ring-white dark:ring-slate-800" style={{ background: CATEGORY_COLORS[item.name] || "#6366f1" }} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter truncate leading-none mb-1">{item.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900 dark:text-white">{item.percent}%</span>
                  <span className="text-[10px] font-bold text-indigo-500">{settings.currency}{item.value > 1000 ? (item.value/1000).toFixed(1) + 'k' : item.value}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
