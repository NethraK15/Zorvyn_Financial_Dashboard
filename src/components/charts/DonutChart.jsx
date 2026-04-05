import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../ui/Card";
import { formatCurrency } from "../../utils/helpers";
import useStore from "../../store/useStore";

export default function DonutChart({ title, data, colors }) {
  const { settings } = useStore();
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="p-6 h-full border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl" hover={false}>
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">{title}</h3>
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[entry.name] || "#6366f1"} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-black uppercase text-slate-400">{payload[0].name}</p>
                      <p className="text-sm font-black text-indigo-500">{formatCurrency(payload[0].value, settings.currency)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Total</p>
          <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
            {formatCurrency(total, settings.currency)}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.slice(0, 4).map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[item.name] }} />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate w-20">{item.name}</span>
            <span className="text-[10px] font-black text-slate-900 dark:text-white">{Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
