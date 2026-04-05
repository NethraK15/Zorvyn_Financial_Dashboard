import { Settings, Save, Bell, Globe, Layout, Palette, User, Award, Target, Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Card from "../components/ui/Card";
import useStore from "../store/useStore";

const animation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export default function SettingsPage() {
  const { settings, setSettings, darkMode, setDarkMode, role, setRole } = useStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    setSettings(localSettings);
    alert("Settings updated successfully!");
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex items-center gap-4 px-2">
        <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/30">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Settings <span className="text-indigo-500">Core</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Preferences & Global Thresholds</p>
        </div>
      </div>

      <motion.div {...animation} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* User Profile & Achievements */}
        <motion.div whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(139, 92, 246, 0.15)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="md:col-span-2">
          <Card className="p-8 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl shadow-xl group">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white shrink-0 overflow-hidden relative">
                  <img src="/avatar.png" className="absolute inset-0 w-full h-full object-cover" alt="Profile Avatar" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Jane <span className="text-violet-500">Doe</span></h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                      <img src="/trophy.png" alt="Premium" className="w-4 h-4 object-contain" /> Premium Member
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active since 2024</span>
                  </div>
                </div>
              </div>

              {/* Achievements & Goals */}
              <div className="flex-1 w-full flex flex-col sm:flex-row gap-6 md:pl-8 md:border-l border-slate-100 dark:border-slate-800">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                    <Award className="w-4 h-4 text-emerald-500" /> Recent Honors
                  </div>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 0 }} 
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-emerald-400 to-emerald-500 border-[3px] border-white dark:border-slate-800 text-white rounded-xl text-[11px] font-black uppercase tracking-wider shadow-[3px_4px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_4px_0px_rgba(0,0,0,0.5)] rotate-[-4deg] cursor-pointer"
                    >
                      <Star className="w-4 h-4 text-emerald-100 fill-emerald-100" /> Great Saver
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 0 }} 
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-blue-400 to-indigo-500 border-[3px] border-white dark:border-slate-800 text-white rounded-xl text-[11px] font-black uppercase tracking-wider shadow-[3px_4px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_4px_0px_rgba(0,0,0,0.5)] rotate-[3deg] cursor-pointer translate-y-1"
                    >
                      <Target className="w-4 h-4 text-indigo-100" /> Debt Free Elite
                    </motion.div>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                    <img src="/trophy.png" alt="Milestone" className="w-5 h-5 object-contain drop-shadow-sm" /> Next Milestone
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300">"Investment Guru" Badge</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">85%</p>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">
                      Save {localSettings.currency}1,450 more to unlock!
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </Card>
        </motion.div>

        {/* Currencies and Units */}
        <motion.div whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.15)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <Card className="p-8 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl shadow-xl group h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 text-emerald-500 group-hover:text-white transition-all duration-500">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none text-left">Unit <span className="text-emerald-500">Currency</span></h2>
            </div>
            
            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Symbol Presentation</label>
                <div className="grid grid-cols-4 gap-2">
                  {['$', '€', '£', '₹'].map(s => (
                    <motion.button 
                      key={s}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setLocalSettings({...localSettings, currency: s})}
                      className={`h-12 rounded-xl text-lg font-black transition-all ${localSettings.currency === s ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-500'}`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Global Thresholds */}
        <motion.div whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.15)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <Card className="p-8 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl shadow-xl group h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-500 text-orange-500 group-hover:text-white transition-all duration-500">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none text-left">System <span className="text-orange-500">Thresholds</span></h2>
            </div>
            
            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Single Expense Warn Level</label>
                <div className="relative group-hover:scale-[1.01] transition-transform">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">{localSettings.currency}</span>
                  <input 
                    type="number" 
                    value={localSettings.threshold}
                    onChange={(e) => setLocalSettings({...localSettings, threshold: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-10 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/50 hover:border-orange-500/30 transition-all shadow-inner" 
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed px-1">Trigger visual alerts for any record exceeding this amount.</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Interface Preferences */}
        <motion.div whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.15)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="md:col-span-2">
          <Card className="p-8 border-none bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl shadow-xl group">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500 text-indigo-500 group-hover:text-white transition-all duration-500">
                <Palette className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none text-left">Interface <span className="text-indigo-500">Control</span></h2>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500/30 transition-colors">
              <div>
                <p className="text-sm font-black text-slate-700 dark:text-slate-200">Dark Mode Synthesis</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dynamic theme adaptation</p>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-14 h-8 rounded-full transition-all duration-300 flex items-center px-1 shadow-inner relative overflow-hidden ${darkMode ? 'bg-indigo-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}
              >
                {darkMode && <motion.div layoutId="themeglow" className="absolute inset-0 bg-white/20 blur-md" />}
                <motion.div layout className="w-6 h-6 rounded-full bg-white shadow-md z-10" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 mt-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500/30 transition-colors">
              <div>
                <p className="text-sm font-black text-slate-700 dark:text-slate-200">System Role Simulation</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Restrict read/write permissions</p>
              </div>
              <div className="flex bg-slate-200 dark:bg-slate-900 rounded-lg p-1">
                <button
                  onClick={() => setRole("admin")}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-md transition-all ${role === "admin" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-500" : "text-slate-500"}`}
                >Admin</button>
                <button
                  onClick={() => setRole("viewer")}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-md transition-all ${role === "viewer" ? "bg-white dark:bg-slate-700 shadow-sm text-rose-500" : "text-slate-500"}`}
                >Viewer</button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <div className="flex justify-end pt-8 pr-2">
        <button 
          onClick={handleSave}
          className="flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-3xl shadow-2xl shadow-indigo-500/40 hover:scale-[1.05] active:scale-95 transition-all text-xs font-black uppercase tracking-widest"
        >
          <Save className="w-5 h-5" /> Commit Changes
        </button>
      </div>
    </div>
  );
}
