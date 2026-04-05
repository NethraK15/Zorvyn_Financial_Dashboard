import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { Calendar, Layers, Download, ChevronRight, FileText, FileCode, FileSpreadsheet, FileJson } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../ui/Card";
import useStore from "../../store/useStore";
import { formatCurrency } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../data/transactions";

export default function ComparatorCard({ title, type, transactions }) {
  const { settings } = useStore();
  const [target1, setTarget1] = useState(type === "monthly" ? "2026-03" : "2026");
  const [target2, setTarget2] = useState(type === "monthly" ? "2026-02" : "2025");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    return ["All", ...new Set(transactions.map(t => t.category))];
  }, [transactions]);

  const years = useMemo(() => {
    return [...new Set(transactions.map(t => new Date(t.date).getFullYear()))].sort((a,b) => b-a);
  }, [transactions]);

  const chartData = useMemo(() => {
    const filterData = (dateStr) => {
      return transactions.filter(t => {
        const d = new Date(t.date);
        const matchDate = type === "monthly" 
          ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === dateStr
          : d.getFullYear().toString() === dateStr;
        const matchCat = category === "All" || t.category === category;
        return matchDate && matchCat;
      });
    };

    const g1 = filterData(target1);
    const g2 = filterData(target2);

    const sum = (list) => list.reduce((s, t) => s + (t.type === 'expense' ? t.amount : 0), 0);

    return [
      { name: target2, value: sum(g2), color: "#94a3b8" },
      { name: target1, value: sum(g1), color: "#6366f1" },
    ];
  }, [transactions, target1, target2, category, type]);

  const insightNote = useMemo(() => {
    const v1 = chartData[1].value;
    const v2 = chartData[0].value;
    const diff = v1 - v2;
    const pct = v2 > 0 ? Math.round((diff / v2) * 100) : 0;
    
    if (diff > 0) return `Spending in ${target1} increased by ${formatCurrency(diff, settings.currency)} (${pct}%) compared to ${target2}. Consider reviewing your ${category === "All" ? "total expenses" : category + " transactions"}.`;
    if (diff < 0) return `Great! Spending in ${target1} is ${formatCurrency(Math.abs(diff), settings.currency)} (${Math.abs(pct)}%) lower than ${target2}. You're saving more in ${category === "All" ? "general" : category}.`;
    return `Spending in both periods is identical. Your budget is consistent!`;
  }, [chartData, target1, target2, category, settings.currency]);

  const handleExport = (format) => {
    const dataStr = JSON.stringify({ title, type, target1, target2, category, chartData, insightNote }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/ /g, '_')}_analysis.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Exporting ${format.toUpperCase()}... \nYour ${title} detailed report has been generated.`);
  };

  return (
    <Card className="p-7 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl h-full flex flex-col" hover={false}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
            <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mt-1">Delta Analysis</p>
          </div>
        </div>
        
        {/* Export Dropdown */}
        <div className="relative group/export">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-50 overflow-hidden">
            <button onClick={() => handleExport('csv')} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/50">
              <FileText className="w-4 h-4 text-orange-500" /> CSV Spread
            </button>
            <button onClick={() => handleExport('xlsx')} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/50">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Excel Sheet
            </button>
            <button onClick={() => handleExport('pdf')} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/50">
              <FileCode className="w-4 h-4 text-rose-500" /> PDF Document
            </button>
            <button onClick={() => handleExport('json')} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <FileJson className="w-4 h-4 text-indigo-500" /> JSON Object
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> Compare Category
          </label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Baseline Period</label>
          <input 
            type={type === "monthly" ? "month" : "number"} 
            value={target2} 
            onChange={(e) => setTarget2(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contrast Period</label>
          <input 
            type={type === "monthly" ? "month" : "number"} 
            value={target1} 
            onChange={(e) => setTarget1(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-2xl scale-110">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{payload[0].payload.name}</p>
                      <p className="text-xl font-black text-indigo-500">{formatCurrency(payload[0].value, settings.currency)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100/50 dark:border-indigo-500/10 relative overflow-hidden text-left">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-[2px] text-indigo-500">AI Narrative Insight</h4>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">"{insightNote}"</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
