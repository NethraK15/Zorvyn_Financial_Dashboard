export function formatCurrency(amount, symbol = "$") {
  return symbol + Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 0 });
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getMonthYear(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function getMonthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function calcSummary(transactions) {
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function getCategoryBreakdown(transactions) {
  const map = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function getBalanceTrend(transactions) {
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  let running = 0;
  const byDate = {};
  sorted.forEach(t => {
    running += t.type === "income" ? t.amount : -t.amount;
    byDate[t.date] = running;
  });
  return Object.entries(byDate).map(([date, balance]) => ({
    date: formatDate(date),
    balance,
  }));
}

export function getMonthlyComparison(transactions) {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

  const thisMonthTx = transactions.filter(t => getMonthYear(t.date) === thisMonth);
  const prevMonthTx = transactions.filter(t => getMonthYear(t.date) === prevMonth);

  const thisExpenses = thisMonthTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const prevExpenses = prevMonthTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const thisIncome = thisMonthTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const prevIncome = prevMonthTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);

  const pctChange = (curr, prev) => prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100);

  // Category comparison
  const thisCats = {};
  thisMonthTx.filter(t => t.type === "expense").forEach(t => { thisCats[t.category] = (thisCats[t.category] || 0) + t.amount; });
  const prevCats = {};
  prevMonthTx.filter(t => t.type === "expense").forEach(t => { prevCats[t.category] = (prevCats[t.category] || 0) + t.amount; });

  const categoryInsights = Object.keys({ ...thisCats, ...prevCats }).map(cat => ({
    category: cat,
    thisMonth: thisCats[cat] || 0,
    prevMonth: prevCats[cat] || 0,
    change: pctChange(thisCats[cat] || 0, prevCats[cat] || 0),
  })).sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  return {
    thisExpenses, prevExpenses, expenseChange: pctChange(thisExpenses, prevExpenses),
    thisIncome, prevIncome, incomeChange: pctChange(thisIncome, prevIncome),
    categoryInsights,
  };
}

export function getInvestmentAllocation(transactions) {
  const assets = ["Equity MF", "PPF", "NPS", "Gold", "Stocks", "ELSS", "FD", "Real Estate", "Dividends", "Investment"];
  const map = {};
  transactions.filter(t => assets.includes(t.category)).forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function getIncomeAllocation(transactions) {
  const sources = ["Salary", "Business", "Rental", "Dividends", "Freelance", "Investment"];
  const map = {};
  transactions.filter(t => sources.includes(t.category) && t.type === "income").forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function getAnnualFYData(transactions) {
  // Fiscal Year: April 2025 - March 2026
  const months = [
    { m: 3, label: "Apr" }, { m: 4, label: "May" }, { m: 5, label: "Jun" },
    { m: 6, label: "Jul" }, { m: 7, label: "Aug" }, { m: 8, label: "Sep" },
    { m: 9, label: "Oct" }, { m: 10, label: "Nov" }, { m: 11, label: "Dec" },
    { m: 0, label: "Jan" }, { m: 1, label: "Feb" }, { m: 2, label: "Mar" }
  ];
  
  return months.map(({ m, label }) => {
    const year = m >= 3 ? 2025 : 2026;
    const monthStr = `${year}-${String(m + 1).padStart(2, "0")}`;
    const filtered = transactions.filter(t => t.date.startsWith(monthStr));
    
    const income = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter(t => t.type === "expense" && !["Equity MF", "PPF", "NPS", "Gold", "Stocks", "ELSS", "FD", "Real Estate"].includes(t.category)).reduce((s, t) => s + t.amount, 0);
    const investment = filtered.filter(t => ["Equity MF", "PPF", "NPS", "Gold", "Stocks", "ELSS", "FD", "Real Estate"].includes(t.category)).reduce((s, t) => s + t.amount, 0);
    
    return { name: label, income, expense, investment };
  });
}

export function generateId() {
  return "t" + Date.now() + Math.random().toString(36).slice(2, 7);
}
