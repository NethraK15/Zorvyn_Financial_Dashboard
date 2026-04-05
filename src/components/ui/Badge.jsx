export default function Badge({ type }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold
      ${type === "income"
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
      }`}>
      {type === "income" ? "▲ Income" : "▼ Expense"}
    </span>
  );
}
