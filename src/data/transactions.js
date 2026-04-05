export const CATEGORIES = [
  "Food", "Travel", "Shopping", "Health", "Entertainment", "Housing", "Education", 
  "Salary", "Business", "Rental", "Dividends", 
  "Equity MF", "PPF", "NPS", "Gold", "Stocks", "ELSS", "FD", "Real Estate",
  "Freelance", "Investment"
];

export const CATEGORY_COLORS = {
  Food: "#14b8a6",
  Travel: "#6366f1",
  Shopping: "#f59e0b",
  Health: "#ef4444",
  Entertainment: "#ec4899",
  Housing: "#8b5cf6",
  Education: "#3b82f6",
  Salary: "#10b981",
  Business: "#0d9488",
  Rental: "#0891b2",
  Dividends: "#0284c7",
  "Equity MF": "#4f46e5",
  PPF: "#7c3aed",
  NPS: "#c026d3",
  Gold: "#eab308",
  Stocks: "#2563eb",
  ELSS: "#9333ea",
  FD: "#475569",
  "Real Estate": "#1e293b",
  Freelance: "#06b6d4",
  Investment: "#84cc16",
};

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const now = new Date();

// --- Comprehensive Mock Data Seeding ---
const generateFYTransactions = () => {
  const data = [];
  const start = new Date("2025-04-01");
  const end = new Date("2026-03-31");
  
  // Generate 15 months of data to ensure current context is always covered
  for (let m = 0; m < 15; m++) {
    const curMonth = new Date(start.getFullYear(), start.getMonth() + m, 1);
    const mStr = fmt(curMonth).substring(0, 7);
    
    // Core Income
    data.push({ id: `inc-sal-${m}`, date: `${mStr}-05`, amount: 6200, category: "Salary", type: "income", description: "Standard Monthly Salary" });
    data.push({ id: `inc-bus-${m}`, date: `${mStr}-15`, amount: 1500 + Math.random() * 500, category: "Business", type: "income", description: "Digital Store Profit" });
    data.push({ id: `inc-rent-${m}`, date: `${mStr}-20`, amount: 2000, category: "Rental", type: "income", description: "Studio Apartment Rent" });
    
    // Quarterly Yields
    if (m % 3 === 0) {
      data.push({ id: `inc-div-${m}`, date: `${mStr}-10`, amount: 800 + Math.random() * 200, category: "Dividends", type: "income", description: "Portfolio Yield (Q)" });
    }

    // Standard Expenses
    data.push({ id: `exp-food-${m}`, date: `${mStr}-08`, amount: 450 + Math.random() * 100, category: "Food", type: "expense", description: "Groceries & Dining" });
    data.push({ id: `exp-rent-${m}`, date: `${mStr}-01`, amount: 1800, category: "Housing", type: "expense", description: "Monthly Rent Payment" });
    data.push({ id: `exp-hlth-${m}`, date: `${mStr}-12`, amount: 200, category: "Health", type: "expense", description: "Insurance & Fitness" });

    // Investments (Recurring)
    data.push({ id: `inv-mf-${m}`, date: `${mStr}-10`, amount: 3000, category: "Equity MF", type: "expense", description: "Index SIP" });
    data.push({ id: `inv-stock-${m}`, date: `${mStr}-18`, amount: 1500 + Math.random() * 1000, category: "Stocks", type: "expense", description: "Blue Chip Stock" });
    data.push({ id: `inv-ppf-${m}`, date: `${mStr}-22`, amount: 1000, category: "PPF", type: "expense", description: "Prov Fund" });
    data.push({ id: `inv-nps-${m}`, date: `${mStr}-25`, amount: 2000, category: "NPS", type: "expense", description: "Retirement Tier 1" });
    data.push({ id: `inv-elss-${m}`, date: `${mStr}-28`, amount: 1500, category: "ELSS", type: "expense", description: "Tax Saver Fund" });
  }


  // Major One-off Assets
  data.push({ id: `inv-re-1`, date: "2025-09-15", amount: 150000, category: "Real Estate", type: "expense", description: "Commercial Plot Deposit" });
  data.push({ id: `inv-gold-1`, date: "2025-11-05", amount: 15000, category: "Gold", type: "expense", description: "Sovereign Gold Bonds" });
  data.push({ id: `inv-fd-1`, date: "2026-02-10", amount: 20000, category: "FD", type: "expense", description: "Fixed Deposit" });

  return data;
};

export const mockTransactions = generateFYTransactions();

