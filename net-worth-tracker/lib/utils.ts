import {
  CategoryInfo,
  Category,
  MonthlySnapshot,
  ChartDataPoint,
  CompositionSlice,
  LineItem,
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

export function buildChartData(snapshots: MonthlySnapshot[]): ChartDataPoint[] {
  const sorted = [...snapshots].sort((a, b) => a.month.localeCompare(b.month));
  return sorted.map((s) => ({
    month: s.month,
    label: formatMonthShort(s.month),
    assets: totalAssets(s),
    liabilities: totalLiabilities(s),
    netWorth: netWorth(s),
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
