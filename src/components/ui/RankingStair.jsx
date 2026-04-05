import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Card from "./Card";
import useStore from "../../store/useStore";
import { formatCurrency } from "../../utils/helpers";

export default function RankingStair({ items }) {
  const { settings } = useStore();
  // Sort items by value descending
  const top3 = [...items].sort((a, b) => b.value - a.value).slice(0, 3);
  
  // Arrange as 2nd, 1st, 3rd for the podium look
  const podium = [
    { ...top3[1], h: "h-32", color: "bg-slate-200 dark:bg-slate-700", rank: 2, label: "2nd" },
    { ...top3[0], h: "h-44", color: "bg-indigo-500", rank: 1, label: "1st" },
    { ...top3[2], h: "h-24", color: "bg-amber-600/70", rank: 3, label: "3rd" },
  ];

  return (
    <Card className="p-6 h-full min-h-[380px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-none">
      <div className="flex items-center gap-2 mb-8">
        <Trophy className="w-5 h-5 text-indigo-500" />
        <h2 className="font-black text-slate-900 dark:text-white tracking-tight">Top Spending <span className="text-indigo-500">Categories</span></h2>
      </div>
      <div className="flex items-end justify-center gap-2 sm:gap-4 h-64 mt-4">
        {podium.map((item, idx) => (
          <motion.div 
            key={item.rank || idx}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.2, type: "spring" }}
            className="flex flex-col items-center flex-1 max-w-[120px]"
          >
            <p className="text-[10px] font-black uppercase text-slate-400 mb-2 truncate px-1 w-full text-center">{item.name || "N/A"}</p>
            <div className={`w-full ${item.h} ${item.color} rounded-t-2xl flex flex-col items-center justify-center relative shadow-lg group`}>
              <span className="text-white font-black text-2xl opacity-40 group-hover:scale-110 transition-transform">{item.label}</span>
              <div className="absolute -top-10 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <p className="text-[10px] font-black text-indigo-500">{formatCurrency(item.value || 0, settings.currency)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
