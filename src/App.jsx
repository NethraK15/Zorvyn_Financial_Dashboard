import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import InsightsPage from "./pages/InsightsPage";
import SettingsPage from "./pages/SettingsPage";
import WalletPage from "./pages/WalletPage";
import useStore from "./store/useStore";

export default function App() {
  const { activePage, darkMode } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const pages = {
    dashboard: <DashboardPage />,
    transactions: <TransactionsPage />,
    insights: <InsightsPage />,
    wallet: <WalletPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-dark font-body relative">
      {/* Dynamic Background Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, 50, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-fuchsia-500/20 dark:bg-fuchsia-600/20 rounded-full blur-[140px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen"
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], x: [0, -80, 0], y: [0, 120, 0], rotate: [0, -90, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="fixed top-[20%] left-[30%] w-[35vw] h-[35vw] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen"
      />

      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {pages[activePage]}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            background: darkMode ? "#1e293b" : "#fff",
            color: darkMode ? "#f1f5f9" : "#1e293b",
            border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          },
          success: { iconTheme: { primary: "#14b8a6", secondary: "#fff" } },
        }}
      />
    </div>
  );
}
