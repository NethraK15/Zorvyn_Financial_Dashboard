import { motion } from "framer-motion";
import Card from "../ui/Card";
import { TrendingUp } from "lucide-react";

export default function SavingsRateRing({ rate }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <Card className="p-6 h-full flex flex-col items-center justify-center border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl" hover={false}>
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">Savings Rate Ring</h3>
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            className="text-slate-100 dark:text-slate-800"
          />
          <motion.circle
            cx="88"
            cy="88"
            r={radius}
            fill="transparent"
            stroke="url(#ringGrad)"
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-black text-slate-900 dark:text-white">{rate}%</p>
          <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-[10px] font-black tracking-tighter uppercase">Efficient</span>
          </div>
        </div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-6 uppercase tracking-widest text-center px-4">You saved {rate}% of your income this month.</p>
    </Card>
  );
}
