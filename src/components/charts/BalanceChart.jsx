import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Lightbulb } from "lucide-react";
import Card from "../ui/Card";
import { getBalanceTrend } from "../../utils/helpers";
import useStore from "../../store/useStore";

export default function BalanceChart() {
  const { transactions, settings } = useStore();
  const data = getBalanceTrend(transactions);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 px-4 py-3 flex flex-col gap-1 anim-scale-in">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-lg font-black text-indigo-500">
            {settings.currency}{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const showInsight = () => {
    const trend = data.length > 2 ? (data[data.length - 1].balance > data[0].balance ? "increasing" : "decreasing") : "stable";
    const growth = data.length > 2 ? Math.round(((data[data.length - 1].balance - data[0].balance) / Math.max(data[0].balance, 1)) * 100) : 0;
    alert(`Trend Insight:\n\nYour net capital is currently ${trend}. \nGrowth over this period: ${growth}%.\nKeep tracking your income to optimize savings!`);
  };

  return (
    <Card className="p-7 h-full border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl group overflow-hidden" hover={false}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">Net <span className="text-indigo-500">Capital</span></h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-2">Historical trend</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={showInsight}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
          >
            <Lightbulb className="w-3 h-3" /> Insight
          </button>
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 6" stroke="#e2e8f0" vertical={false} opacity={0.4} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} 
              tickLine={false} 
              axisLine={false} 
              dx={-10}
              tickFormatter={v => `${settings.currency}${(v/1000).toFixed(0)}k`} 
            />
            <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#6366f1" 
              strokeWidth={4} 
              fill="url(#balGrad)" 
              animationDuration={2000}
              animationEasing="ease-in-out"
              activeDot={{ r: 8, fill: "#6366f1", stroke: "#fff", strokeWidth: 3, shadow: '0 0 10px rgba(99,102,241,0.5)' }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
