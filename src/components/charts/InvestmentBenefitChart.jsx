import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Card from "../ui/Card";
import { TrendingUp, PieChart, ArrowUpRight } from "lucide-react";
import useStore from "../../store/useStore";
import { formatCurrency } from "../../utils/helpers";

export default function InvestmentBenefitChart() {
  const { transactions, settings } = useStore();
  
  const investTx = transactions.filter(t => t.category === "Investment");
  const cost = investTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const benefit = investTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const net = benefit - cost;

  const data = [
    { name: "Capital Deployed", value: cost, color: "#6366f1" },
    { name: "Accrued Benefits", value: benefit, color: "#10b981" },
  ];

  return (
    <Card className="p-7 h-full border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl group overflow-hidden" hover={false}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">Investment <span className="text-indigo-500">Yield</span></h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-2">Capital efficiency</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30">
          <PieChart className="w-5 h-5 text-indigo-500" />
        </div>
      </div>

      <div className="h-[220px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="6 6" stroke="#e2e8f0" vertical={false} opacity={0.2} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 800 }} 
              tickLine={false} 
              axisLine={false} 
              dy={15}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-3">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{payload[0].payload.name}</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{formatCurrency(payload[0].value, settings.currency)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={45}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[28px] border border-slate-100 dark:border-slate-700/50 flex items-center justify-between group-hover:scale-[1.02] transition-transform">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Net Performance</p>
          <p className={`text-2xl font-black tracking-tighter ${net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {net >= 0 ? '+' : ''}{formatCurrency(net, settings.currency)}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${net >= 0 ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-rose-500/30'} shadow-lg`}>
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
