import * as XLSX from "xlsx";
import { MonthlySnapshot, LineItem, Category } from "./types";
import { CATEGORIES, generateId } from "./utils";

// Map common spreadsheet labels to our categories
const LABEL_TO_CATEGORY: Record<string, Category> = {
  // Current accounts
  "monzo": "current_account",
  "monzo current": "current_account",
  "barclays": "current_account",
  "barclays current": "current_account",
  "hsbc": "current_account",
  "hsbc current": "current_account",
  "lloyds": "current_account",
  "natwest": "current_account",
  "starling": "current_account",
  "chase": "current_account",
  "chase current": "current_account",
  "current account": "current_account",
  "current accounts": "current_account",

  // Savings
  "savings": "savings_account",
  "savings account": "savings_account",
  "chase savings": "savings_account",
  "marcus": "savings_account",
  "monzo savings": "savings_account",
  "easy access": "savings_account",
  "easy access savings": "savings_account",
  "notice account": "savings_account",
  "fixed saver": "savings_account",

  // ISAs
  "cash isa": "cash_isa",
  "stocks and shares isa": "stocks_shares_isa",
  "stocks & shares isa": "stocks_shares_isa",
  "s&s isa": "stocks_shares_isa",
  "ss isa": "stocks_shares_isa",
  "vanguard isa": "stocks_shares_isa",
  "vanguard s&s isa": "stocks_shares_isa",
  "trading 212 isa": "stocks_shares_isa",
  "t212 isa": "stocks_shares_isa",
  "lifetime isa": "lifetime_isa",
  "lisa": "lifetime_isa",

  // Investments
  "trading 212": "gia",
  "trading 212 gia": "gia",
  "t212 gia": "gia",
  "t212": "gia",
  "gia": "gia",
  "general investment": "gia",
  "freetrade": "gia",
  "hargreaves lansdown": "gia",
  "hl": "gia",
  "invest": "gia",
  "investments": "gia",
  "investment": "gia",

  // Pension
  "pension": "pension",
  "workplace pension": "pension",
  "sipp": "pension",
  "private pension": "pension",

  // Property
  "property": "property",
  "house": "property",
  "home": "property",
  "flat": "property",
  "property value": "property",

  // Crypto
  "crypto": "crypto",
  "bitcoin": "crypto",
  "btc": "crypto",
  "ethereum": "crypto",
  "eth": "crypto",
  "coinbase": "crypto",
  "binance": "crypto",

  // Liabilities
  "mortgage": "mortgage",
  "home mortgage": "mortgage",
  "student loan": "student_loan",
  "student loans": "student_loan",
  "plan 1": "student_loan",
  "plan 2": "student_loan",
  "credit card": "credit_card",
  "credit cards": "credit_card",
  "amex": "credit_card",
  "debt": "debt",
  "debts": "debt",
  "car finance": "debt",
  "personal loan": "debt",
  "loan": "debt",
};

function guessCategory(label: string): Category {
  const lower = label.toLowerCase().trim();
  if (LABEL_TO_CATEGORY[lower]) return LABEL_TO_CATEGORY[lower];

  // Fuzzy matching
  for (const [key, cat] of Object.entries(LABEL_TO_CATEGORY)) {
    if (lower.includes(key) || key.includes(lower)) return cat;
  }

  return "other_asset";
}

function getItemType(category: Category): "asset" | "liability" {
  const info = CATEGORIES.find((c) => c.key === category);
  return info?.type || "asset";
}

function parseMonthFromHeader(header: string): string | null {
  const trimmed = header.trim();

  // Try parsing as a date string (e.g., "Jan 2024", "January 2024", "01/2024", "2024-01")
  const monthNames = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];

  // "Jan 2024" or "January 2024"
  for (let i = 0; i < monthNames.length; i++) {
    const pattern = new RegExp(`${monthNames[i]}\\w*\\s*(\\d{4})`, "i");
    const match = trimmed.match(pattern);
    if (match) {
      return `${match[1]}-${String(i + 1).padStart(2, "0")}`;
    }
  }

  // "01/2024" or "1/2024"
  const slashMatch = trimmed.match(/^(\d{1,2})[/\-](\d{4})$/);
  if (slashMatch) {
    const month = parseInt(slashMatch[1]);
    if (month >= 1 && month <= 12) {
      return `${slashMatch[2]}-${String(month).padStart(2, "0")}`;
    }
  }

  // "2024-01"
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
  if (isoMatch) return trimmed;

  // Try parsing as Excel serial date number
  const num = Number(trimmed);
  if (!isNaN(num) && num > 40000 && num < 60000) {
    const date = XLSX.SSF.parse_date_code(num);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, "0")}`;
    }
  }

  // Try Date.parse as last resort
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 2000) {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
  }

  return null;
}

export function parseExcelFile(data: ArrayBuffer): MonthlySnapshot[] {
  const workbook = XLSX.read(data, { type: "array", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: (string | number)[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    defval: "",
  });

  if (rows.length < 2) return [];

  // Find the header row (first row with parseable month columns)
  let headerRowIndex = -1;
  let monthColumns: { index: number; month: string }[] = [];

  for (let r = 0; r < Math.min(5, rows.length); r++) {
    const row = rows[r];
    const months: { index: number; month: string }[] = [];
    for (let c = 1; c < row.length; c++) {
      const val = String(row[c]);
      const month = parseMonthFromHeader(val);
      if (month) months.push({ index: c, month });
    }
    if (months.length >= 2) {
      headerRowIndex = r;
      monthColumns = months;
      break;
    }
  }

  if (headerRowIndex === -1 || monthColumns.length === 0) {
    // Try alternate format: rows are months, columns are accounts
    return parseTransposedFormat(rows);
  }

  // Standard format: rows are accounts, columns are months
  const snapshots = new Map<string, LineItem[]>();

  for (const { month } of monthColumns) {
    snapshots.set(month, []);
  }

  // Skip summary/total rows
  const skipLabels = new Set([
    "total", "totals", "total assets", "total liabilities",
    "net worth", "net", "assets", "liabilities", "summary",
    "month", "date", "",
  ]);

  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r];
    const label = String(row[0] || "").trim();
    if (!label || skipLabels.has(label.toLowerCase())) continue;

    const category = guessCategory(label);
    const type = getItemType(category);

    for (const { index, month } of monthColumns) {
      const rawValue = row[index];
      const amount = typeof rawValue === "number"
        ? Math.abs(rawValue)
        : parseFloat(String(rawValue).replace(/[£,$,\s]/g, "")) || 0;

      if (amount > 0) {
        snapshots.get(month)!.push({
          id: generateId(),
          name: label,
          category,
          type,
          amount,
          source: "manual",
        });
      }
    }
  }

  return Array.from(snapshots.entries())
    .filter(([, items]) => items.length > 0)
    .map(([month, items]) => ({
      id: generateId(),
      month,
      items,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function parseTransposedFormat(rows: (string | number)[][]): MonthlySnapshot[] {
  // Headers in first row are account names
  if (rows.length < 2 || rows[0].length < 2) return [];

  const accountNames = rows[0].slice(1).map((h) => String(h).trim());
  const snapshots: MonthlySnapshot[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const monthStr = parseMonthFromHeader(String(row[0]));
    if (!monthStr) continue;

    const items: LineItem[] = [];
    for (let c = 0; c < accountNames.length; c++) {
      const name = accountNames[c];
      if (!name) continue;

      const rawValue = row[c + 1];
      const amount = typeof rawValue === "number"
        ? Math.abs(rawValue)
        : parseFloat(String(rawValue).replace(/[£,$,\s]/g, "")) || 0;

      if (amount > 0) {
        const category = guessCategory(name);
        items.push({
          id: generateId(),
          name,
          category,
          type: getItemType(category),
          amount,
          source: "manual",
        });
      }
    }

    if (items.length > 0) {
      snapshots.push({
        id: generateId(),
        month: monthStr,
        items,
      });
    }
  }

  return snapshots.sort((a, b) => a.month.localeCompare(b.month));
}
