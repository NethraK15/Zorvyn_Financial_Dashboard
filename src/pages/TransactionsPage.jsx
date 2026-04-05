import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import TransactionModal from "../components/modals/TransactionModal";
import useStore from "../store/useStore";
import { formatCurrency, formatDate } from "../utils/helpers";
import { CATEGORY_COLORS } from "../data/transactions";
import toast from "react-hot-toast";

export default function TransactionsPage() {
  const transactions = useStore(s => s.transactions);
  const filters = useStore(s => s.filters);
  const settings = useStore(s => s.settings);
  const role = useStore(s => s.role);
  const setFilters = useStore(s => s.setFilters);
  const deleteTransaction = useStore(s => s.deleteTransaction);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const transactionsList = useMemo(() => {
    let list = [...transactions];
    if (filters.type !== "all") list = list.filter(t => t.type === filters.type);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(t => t.category.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q));
    }
    if (filters.month) {
      list = list.filter(t => t.date.startsWith(filters.month));
    } else if (filters.last30Days) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      list = list.filter(t => new Date(t.date) >= thirtyDaysAgo);
    }
    list.sort((a, b) => {
      const dir = filters.sortDir === "asc" ? 1 : -1;
      if (filters.sortBy === "date") return dir * (new Date(a.date) - new Date(b.date));
      if (filters.sortBy === "amount") return dir * (a.amount - b.amount);
      return 0;
    });
    return list;
  }, [transactions, filters]);

  const displayedTransactions = transactionsList; 

  const months = useMemo(() => {
    const set = new Set(transactions.map(t => t.date.substring(0, 7)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const handleSort = (col) => {
    if (filters.sortBy === col) {
      setFilters({ sortDir: filters.sortDir === "asc" ? "desc" : "asc" });
    } else {
      setFilters({ sortBy: col, sortDir: "desc" });
    }
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast.success("Transaction deleted");
    setDeleteConfirm(null);
  };

  const openEdit = (tx) => { setEditing(tx); setModalOpen(true); };
  const openAdd = () => { setEditing(null); setModalOpen(true); };

  const SortIcon = ({ col }) => {
    if (filters.sortBy !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />;
    return filters.sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-indigo-500" /> : <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />;
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 pb-24">
      {/* Toolbar */}
      <Card className="p-4 border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl" hover={false}>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by category or description…"
              value={filters.search}
              onChange={e => setFilters({ search: e.target.value })}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-lg shadow-indigo-500/10">
            <select
              value={filters.month}
              onChange={e => setFilters({ month: e.target.value })}
              className="bg-slate-900 text-xs font-black uppercase tracking-[1px] px-6 py-2.5 border-none focus:ring-0 outline-none cursor-pointer text-white"
            >
              <option value="" className="bg-slate-900 text-white">Full Ledger</option>
              {months.map(m => (
                <option key={m} value={m} className="bg-slate-900 text-white">
                  {new Date(m + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 flex-shrink-0">
            {["all", "income", "expense"].map(t => (
              <button key={t} onClick={() => setFilters({ type: t })}
                className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all
                  ${filters.type === t ? "bg-indigo-500 text-white shadow-lg" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                {t}
              </button>
            ))}
          </div>

          {role === "admin" && (
            <button onClick={openAdd}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest transition-all flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <Plus className="w-4 h-4" /> Add Record
            </button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card hover={false} className="overflow-hidden border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px] w-12">#</th>
                <th className="text-left px-6 py-4">
                  <button onClick={() => handleSort("date")} className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] hover:text-indigo-500 transition-colors">
                    Date <SortIcon col="date" />
                  </button>
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Description</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Category</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Type</th>
                <th className="text-right px-6 py-4">
                  <button onClick={() => handleSort("amount")} className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] hover:text-indigo-500 transition-colors ml-auto">
                    Amount <SortIcon col="amount" />
                  </button>
                </th>
                {role === "admin" && (
                  <th className="text-right px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={role === "admin" ? 7 : 6} className="py-24 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    No data records matched
                  </td>
                </tr>
              ) : (
                displayedTransactions.map((tx, i) => {
                  const isHot = tx.amount > settings.threshold && tx.type === "expense";
                  return (
                    <tr key={tx.id} className={`hover:bg-white dark:hover:bg-slate-800 transition-all group ${isHot ? "bg-rose-500/5" : ""}`}>
                      <td className="px-6 py-4 text-[10px] text-slate-300 dark:text-slate-600 font-mono italic">{i + 1}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold whitespace-nowrap">{formatDate(tx.date)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 shadow-sm"
                            style={{ background: CATEGORY_COLORS[tx.category] || "#94a3b8" }}>
                            {tx.category[0]}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-slate-100 font-black truncate max-w-[200px]">{tx.description}</span>
                            {isHot && <span className="text-[9px] font-black text-rose-500 uppercase tracking-tighter">High Expense Alert</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4"><Badge type={tx.type} /></td>
                      <td className={`px-6 py-4 text-right font-black font-mono text-sm
                        ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, settings.currency)}
                      </td>
                      {role === "admin" && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(tx)}
                              className="p-2 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                              <Pencil className="w-4 h-4" />
                            </button>
                            {deleteConfirm === tx.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDelete(tx.id)}
                                  className="px-3 py-1 rounded-lg text-[9px] font-black uppercase bg-rose-500 text-white shadow-lg shadow-rose-500/20">
                                  Confirm
                                </button>
                                <button onClick={() => setDeleteConfirm(null)}
                                  className="px-3 py-1 rounded-lg text-[9px] font-black uppercase bg-slate-200 dark:bg-slate-700">
                                  No
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(tx.id)}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />
    </div>
  );
}
