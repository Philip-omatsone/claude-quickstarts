import {
  CategoryInfo,
  Category,
  MonthlySnapshot,
  ChartDataPoint,
  CompositionSlice,
  LineItem,
  PropertyData,
  PensionEntry,
  VanguardEquityEntry,
  CashSavingsEntry,
} from "./types";

export const CATEGORIES: CategoryInfo[] = [
  { key: "current_account", label: "Current Accounts", type: "asset", color: "#3b82f6", group: "Cash" },
  { key: "savings_account", label: "Savings Accounts", type: "asset", color: "#0ea5e9", group: "Cash" },
  { key: "cash_isa", label: "Cash ISA", type: "asset", color: "#06b6d4", group: "ISAs" },
  { key: "stocks_shares_isa", label: "Stocks & Shares ISA", type: "asset", color: "#14b8a6", group: "ISAs" },
  { key: "lifetime_isa", label: "Lifetime ISA", type: "asset", color: "#0d9488", group: "ISAs" },
  { key: "gia", label: "General Investment", type: "asset", color: "#10b981", group: "Investments" },
  { key: "pension", label: "Pension", type: "asset", color: "#8b5cf6", group: "Pension" },
  { key: "property", label: "Property", type: "asset", color: "#f59e0b", group: "Property" },
  { key: "crypto", label: "Crypto", type: "asset", color: "#f97316", group: "Crypto" },
  { key: "vanguard_equity", label: "Vanguard Equity", type: "asset", color: "#6366f1", group: "Vanguard Equity" },
  { key: "other_asset", label: "Other Assets", type: "asset", color: "#6b7280", group: "Other" },
  { key: "mortgage", label: "Mortgage", type: "liability", color: "#ef4444", group: "Mortgage" },
  { key: "student_loan", label: "Student Loan", type: "liability", color: "#dc2626", group: "Loans" },
  { key: "credit_card", label: "Credit Cards", type: "liability", color: "#e11d48", group: "Debts" },
  { key: "debt", label: "Other Debts", type: "liability", color: "#f97316", group: "Debts" },
  { key: "other_liability", label: "Other Liabilities", type: "liability", color: "#78716c", group: "Other" },
];

export const ASSET_CATEGORIES = CATEGORIES.filter((c) => c.type === "asset");
export const LIABILITY_CATEGORIES = CATEGORIES.filter((c) => c.type === "liability");

export function getCategoryInfo(key: Category): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.key === key);
}

export function formatCurrency(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  return (
    sign +
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(abs)
  );
}

export function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(parseInt(year), parseInt(m) - 1);
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function formatMonthShort(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(parseInt(year), parseInt(m) - 1);
  return date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function totalAssets(snapshot: MonthlySnapshot): number {
  return snapshot.items
    .filter((item) => item.type === "asset")
    .reduce((sum, item) => sum + item.amount, 0);
}

export function totalLiabilities(snapshot: MonthlySnapshot): number {
  return snapshot.items
    .filter((item) => item.type === "liability")
    .reduce((sum, item) => sum + item.amount, 0);
}

export function netWorth(snapshot: MonthlySnapshot): number {
  return totalAssets(snapshot) - totalLiabilities(snapshot);
}

export function totalVanguardEquity(snapshot: MonthlySnapshot): number {
  return snapshot.items
    .filter((item) => item.category === "vanguard_equity")
    .reduce((sum, item) => sum + item.amount, 0);
}

// Keep old name for backwards compat
export const totalEquityExposure = totalVanguardEquity;

export function buildChartData(snapshots: MonthlySnapshot[]): ChartDataPoint[] {
  const sorted = [...snapshots].sort((a, b) => a.month.localeCompare(b.month));
  return sorted.map((s) => ({
    month: s.month,
    label: formatMonthShort(s.month),
    assets: totalAssets(s),
    liabilities: totalLiabilities(s),
    netWorth: netWorth(s),
    vanguardEquity: totalVanguardEquity(s),
  }));
}

export function buildCompositionData(snapshot: MonthlySnapshot): CompositionSlice[] {
  const groups: Record<string, { value: number; color: string }> = {};

  for (const item of snapshot.items) {
    if (item.type !== "asset") continue;
    const info = getCategoryInfo(item.category);
    if (!info) continue;
    if (!groups[info.group]) {
      groups[info.group] = { value: 0, color: info.color };
    }
    groups[info.group].value += item.amount;
  }

  return Object.entries(groups)
    .filter(([, data]) => data.value > 0)
    .map(([name, data]) => ({
      name,
      value: data.value,
      color: data.color,
    }));
}

export function categoryTotal(items: LineItem[], category: Category): number {
  return items
    .filter((item) => item.category === category)
    .reduce((sum, item) => sum + item.amount, 0);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Calculate monthly mortgage payment using the standard amortisation formula:
 * M = P[r(1+r)^n] / [(1+r)^n - 1]
 * where P = balance, r = monthly rate, n = total months
 */
export function calculateMonthlyPayment(
  balance: number,
  annualRate: number,
  termYears: number,
): number {
  if (balance <= 0 || annualRate <= 0 || termYears <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  const payment = (balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(payment * 100) / 100;
}

// Build line items from property data (for snapshot generation)
export function propertyToLineItems(properties: PropertyData[]): LineItem[] {
  const items: LineItem[] = [];
  for (const prop of properties) {
    if (prop.estimatedValue > 0) {
      items.push({
        id: generateId(),
        name: prop.name || "Property",
        category: "property",
        type: "asset",
        amount: prop.estimatedValue,
        source: prop.valuationSource === "rightmove" ? "rightmove" : "manual",
      });
    }
    if (prop.mortgageBalance > 0) {
      items.push({
        id: generateId(),
        name: `${prop.name || "Property"} Mortgage`,
        category: "mortgage",
        type: "liability",
        amount: prop.mortgageBalance,
        source: "manual",
      });
    }
  }
  return items;
}

// Build line items from pension data
export function pensionToLineItems(pensions: PensionEntry[]): LineItem[] {
  return pensions
    .filter((p) => p.currentValue > 0)
    .map((p) => ({
      id: generateId(),
      name: p.name,
      category: "pension" as Category,
      type: "asset" as const,
      amount: p.currentValue,
      source: p.provider === "manual" ? "manual" as const : p.provider,
    }));
}

// Build line items from Vanguard equity data
export function vanguardEquityToLineItems(entries: VanguardEquityEntry[]): LineItem[] {
  return entries
    .filter((e) => e.equityValue > 0)
    .map((e) => ({
      id: generateId(),
      name: e.name,
      category: "vanguard_equity" as Category,
      type: "asset" as const,
      amount: e.equityValue,
      source: e.provider === "manual" ? "manual" as const : e.provider,
    }));
}

// Keep old name for backwards compat
export const equityExposureToLineItems = vanguardEquityToLineItems;

// Build line items from cash savings data
export function cashSavingsToLineItems(entries: CashSavingsEntry[]): LineItem[] {
  return entries
    .filter((e) => e.balance !== 0)
    .map((e) => ({
      id: generateId(),
      name: e.name,
      category: e.accountType as Category,
      type: e.accountType === "credit_card" ? "liability" as const : "asset" as const,
      amount: Math.abs(e.balance),
      source: "manual" as const,
    }));
}

// Calculate net cash savings (assets minus credit card balances)
export function netCashSavings(entries: CashSavingsEntry[]): number {
  return entries.reduce((sum, e) => {
    if (e.accountType === "credit_card") return sum - Math.abs(e.balance);
    return sum + e.balance;
  }, 0);
}
