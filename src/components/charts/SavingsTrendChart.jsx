import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../ui/Card";
import { TrendingUp, ShieldCheck } from "lucide-react";
import useStore from "../../store/useStore";
import { getBalanceTrend, formatCurrency } from "../../utils/helpers";

export default function SavingsTrendChart() {
  const { transactions, settings } = useStore();
  const data = getBalanceTrend(transactions);

  return (
    <Card className="p-7 h-full border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl group overflow-hidden" hover={false}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">Capital <span className="text-indigo-500">Preservation</span></h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-2">Savings velocity</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30">
          <ShieldCheck className="w-5 h-5 text-indigo-500" />
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-3">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{payload[0].payload.date}</p>
                      <p className="text-lg font-black text-emerald-500">{formatCurrency(payload[0].value, settings.currency)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#10b981" 
              strokeWidth={4} 
              fill="url(#savingsGrad)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
