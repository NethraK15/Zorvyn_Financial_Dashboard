import { motion } from "framer-motion";
import Card from "./Card";
import { formatCurrency } from "../../utils/helpers";
import useStore from "../../store/useStore";

export default function AssetClassCard({ name, target, actual, color }) {
  const { settings } = useStore();
  const percent = Math.min(Math.round((actual / target) * 100), 100);

  return (
    <Card className="p-4 h-full border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl" hover={true}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: color }} />
        <div>
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter truncate leading-none mb-1">{name}</h4>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{percent}% Reached</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Target</p>
            <p className="text-sm font-black text-slate-900 dark:text-white leading-none mt-1">{formatCurrency(target, settings.currency)}</p>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Actual</p>
            <p className="text-sm font-black text-indigo-500 leading-none mt-1">{formatCurrency(actual, settings.currency)}</p>
          </div>
        </div>
        <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/20 dark:border-slate-700/30">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </Card>
  );
}
