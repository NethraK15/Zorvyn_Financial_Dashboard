import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "../../data/transactions";
import useStore from "../../store/useStore";
import toast from "react-hot-toast";

const empty = { date: new Date().toISOString().split("T")[0], amount: "", category: "Food", type: "expense", description: "" };

export default function TransactionModal({ open, onClose, editing }) {
  const { addTransaction, updateTransaction } = useStore();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) setForm({ ...editing, amount: String(editing.amount) });
    else setForm(empty);
    setErrors({});
  }, [editing, open]);

  if (!open) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = "Enter a valid positive amount";
    if (!form.date) e.date = "Date is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const payload = { ...form, amount: Number(form.amount) };
    if (editing) {
      updateTransaction(editing.id, payload);
      toast.success("Transaction updated!");
    } else {
      addTransaction(payload);
      toast.success("Transaction added!");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark-2 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            {editing ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {["income", "expense"].map(t => (
              <button key={t} onClick={() => set("type", t)}
                className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors
                  ${form.type === t
                    ? t === "income" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                    : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                {t}
              </button>
            ))}
          </div>

          <Field label="Amount ($)" error={errors.amount}>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e => set("amount", e.target.value)}
              className={inputCls(errors.amount)} />
          </Field>

          <Field label="Date" error={errors.date}>
            <input type="date" value={form.date} onChange={e => set("date", e.target.value)} className={inputCls(errors.date)} />
          </Field>

          <Field label="Category">
            <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls()}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Description" error={errors.description}>
            <input type="text" placeholder="What's this for?" value={form.description} onChange={e => set("description", e.target.value)}
              className={inputCls(errors.description)} />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors">
            {editing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputCls(error) {
  return `w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border
    ${error ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700"}
    text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 transition-colors`;
}
