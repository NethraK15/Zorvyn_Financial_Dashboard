import { motion } from "framer-motion";
import Card from "./Card";

export default function SummaryCard({ title, value, icon: Icon, color, sub, className }) {
  const colorMap = {
    teal:   { bg: "bg-teal-50 dark:bg-teal-900/20",   icon: "text-teal-600 dark:text-teal-400",  border: "border-teal-100 dark:border-teal-900/40", glow: "shadow-teal-500/20" },
    emerald:  { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-500 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-900/40", glow: "shadow-emerald-500/20" },
    rose:    { bg: "bg-rose-50 dark:bg-rose-900/20",   icon: "text-rose-500 dark:text-rose-400",  border: "border-rose-100 dark:border-rose-900/40", glow: "shadow-rose-500/20" },
    indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-100 dark:border-indigo-900/40", glow: "shadow-indigo-500/20" },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full relative group"
    >
      <Card className={`p-6 h-full border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl relative overflow-hidden ${className}`}>
        {/* Animated Shimmer Overlay */}
        <motion.div 
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-indigo-500/10 dark:via-white/5 to-transparent pointer-events-none"
        />
        
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 dark:text-slate-500 mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate">
              {value}
            </h3>
            {sub && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className={`w-1.5 h-1.5 rounded-full ${c.bg} ${c.icon} animate-pulse shadow-[0_0_8px]`} />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{sub}</p>
              </div>
            )}
          </div>
          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center shadow-lg ${c.glow}`}>
            <Icon className={`w-7 h-7 ${c.icon}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
