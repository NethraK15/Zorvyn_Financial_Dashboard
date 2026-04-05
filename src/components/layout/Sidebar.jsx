import { LayoutDashboard, ArrowLeftRight, Lightbulb, TrendingUp, X, Settings, LogOut, ShieldCheck, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "../../store/useStore";

const navItems = [
  { id: "dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { id: "transactions",  label: "Transactions",  icon: ArrowLeftRight },
  { id: "insights",      label: "Insights",      icon: Lightbulb },
  { id: "wallet",        label: "Wallet",        icon: Wallet },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { activePage, setActivePage } = useStore();
  
  const handleSettings = () => {
    setActivePage("settings");
    onClose?.();
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out? Your session data will be cleared.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleNav = (id) => {
    setActivePage(id);
    onClose?.();
  };

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden" 
            onClick={onClose} 
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ x: mobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0) }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 z-50 h-full w-[280px] flex flex-col bg-white/90 dark:bg-slate-950/80 backdrop-blur-3xl border-r border-slate-100 dark:border-slate-800/60 lg:relative lg:x-0 shadow-2xl lg:shadow-none transition-colors"
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-8 py-8">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => handleNav("dashboard")}>
            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:rotate-12 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Zorvyn</h1>
              <p className="text-[10px] text-indigo-500 font-black tracking-[2px] uppercase mt-1">Enterprise</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto scrollbar-thin">
          <div>
            <p className="px-4 text-[10px] font-black uppercase tracking-[3px] text-slate-400 dark:text-slate-600 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" /> Core Menu
            </p>
            <div className="space-y-1.5">
              {navItems.map(({ id, label, icon: Icon }, idx) => {
                const active = activePage === id;
                return (
                  <motion.button
                    key={id}
                    onClick={() => handleNav(id)}
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold transition-all relative overflow-hidden
                      ${active
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/40"
                        : "text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-500 dark:hover:text-white"
                      }`}
                  >
                    {active && (
                      <motion.div 
                        layoutId="activeGlow"
                        className="absolute inset-0 bg-white/10 blur-xl pointer-events-none"
                      />
                    )}
                    <Icon className={`w-5 h-5 flex-shrink-0 relative z-10 ${active ? "text-white" : ""}`} />
                    <span className="relative z-10">{label}</span>
                    {active && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-6 rounded-full bg-white relative z-10 shadow-[0_0_10px_white]" 
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div>
             <p className="px-4 text-[10px] font-black uppercase tracking-[3px] text-slate-400 dark:text-slate-600 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" /> Utility
            </p>
            <div className="space-y-1.5">
              <button 
                onClick={handleSettings}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-95"
              >
                <Settings className="w-5 h-5" /> Settings
              </button>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all active:scale-95"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </nav>

        {/* Profile Section */}
        <div className="p-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-4 border border-slate-100 dark:border-slate-800/60 flex items-center gap-4 group cursor-pointer hover:border-indigo-500/30 transition-all">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-inner ring-2 ring-white dark:ring-slate-950 overflow-hidden">
                <img src="/avatar.png" className="w-full h-full object-cover" alt="Jane Doe" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900 dark:text-white truncate">Jane Doe</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Gold Tier Member</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
