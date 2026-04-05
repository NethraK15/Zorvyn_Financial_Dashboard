export default function Card({ children, className = "", hover = true }) {
  return (
    <div className={`
      bg-white dark:bg-surface-dark-2 rounded-2xl border border-slate-100 dark:border-slate-800
      shadow-card ${hover ? "hover:shadow-card-hover hover:-translate-y-0.5" : ""}
      transition-all duration-200 ${className}
    `}>
      {children}
    </div>
  );
}
