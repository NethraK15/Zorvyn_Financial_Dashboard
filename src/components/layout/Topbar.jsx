import { Menu, Moon, Sun, ChevronDown, Search, Bell, Command, Info, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useStore from "../../store/useStore";

const pageLabels = {
  dashboard: "Overview",
  transactions: "History",
  insights: "Analytics",
  settings: "Preferences",
};

export default function Topbar({ onMenuClick }) {
  const { role, setRole, darkMode, setDarkMode, activePage, filters, setFilters } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Unusual Spending', message: 'You spent $450 at Apple Store, which is 60% over your tech budget.', type: 'alert', time: '10m ago', read: false },
    { id: 2, title: 'Salary Credited', message: 'Your monthly salary has been successfully credited to your main account.', type: 'success', time: '2h ago', read: false },
    { id: 3, title: 'Bill Reminder', message: 'Electricity bill of $120 is due in 3 days. Please schedule the payment.', type: 'info', time: '1d ago', read: true }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleSearch = (e) => {
    setFilters({ search: e.target.value });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-10 h-24 bg-white/60 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800/60 transition-colors">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm text-slate-500 hover:text-indigo-500 transition-all border border-slate-100 dark:border-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
            {pageLabels[activePage]}
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[2px] text-indigo-500 mt-2 opacity-80">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Middle Search - Desktop */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-10">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            value={filters.search}
            onChange={handleSearch}
            placeholder="Search records..."
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-2xl py-3 pl-12 pr-14 text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
            <Command className="w-3 h-3" /> K
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-indigo-500 transition-all shadow-sm"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-4 w-80 sm:w-96 bg-white/90 dark:bg-slate-950/95 backdrop-blur-3xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50 text-left"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-md">{unreadCount} New</span>
                  )}
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto w-full">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      onClick={() => setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n))}
                      className={`p-4 border-b border-slate-100 dark:border-slate-800/50 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 flex gap-4 ${!notification.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                    >
                      <div className={`mt-1 flex-shrink-0 ${notification.type === 'alert' ? 'text-rose-500' : notification.type === 'success' ? 'text-emerald-500' : 'text-blue-500'}`}>
                        {notification.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-bold ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{notification.title}</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{notification.time}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{notification.message}</p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                    className="text-[10px] font-black tracking-widest uppercase text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Role Switcher */}
        <div className="relative hidden md:block">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="appearance-none cursor-pointer text-[13px] font-black uppercase tracking-wider pl-5 pr-10 py-3 rounded-2xl
              bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800
              text-slate-900 dark:text-white hover:border-indigo-500 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="admin">Admin Perspective</option>
            <option value="viewer">Viewer Only</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
        </div>

        <div className="w-px h-8 bg-slate-100 dark:bg-slate-800/60 mx-1 hidden sm:block" />

        {/* Dark Mode */}
        <motion.button
          whileTap={{ rotate: 180, scale: 0.8 }}
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:scale-105 transition-all shadow-xl shadow-slate-950/20 dark:shadow-white/10"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>
    </header>
  );
}
