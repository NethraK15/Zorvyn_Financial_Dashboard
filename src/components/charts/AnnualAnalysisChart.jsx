import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "../ui/Card";
import { formatCurrency } from "../../utils/helpers";
import useStore from "../../store/useStore";

export default function AnnualAnalysisChart({ data }) {
  const { settings } = useStore();

  return (
    <Card className="p-7 h-full border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl group overflow-hidden" hover={false}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">Fiscal Year <span className="text-indigo-500">Analysis</span></h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-2">Apr 2025 - Mar 2026</p>
        </div>
      </div>
      
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="6 6" stroke="#e2e8f0" vertical={false} opacity={0.4} />
            <XAxis 
              dataKey="name" 
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
              cursor={{ fill: 'transparent' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-2">{label}</p>
                      {payload.map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-8 mb-1">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{p.name}</span>
                          <span className="text-xs font-black" style={{ color: p.color }}>{formatCurrency(p.value, settings.currency)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }} />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="investment" name="Investment" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
