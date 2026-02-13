export type AssetCategory =
  | "current_account"
  | "savings_account"
  | "cash_isa"
  | "stocks_shares_isa"
  | "lifetime_isa"
  | "gia"
  | "pension"
  | "property"
  | "crypto"
  | "other_asset";

export type LiabilityCategory =
  | "mortgage"
  | "student_loan"
  | "credit_card"
  | "debt"
  | "other_liability";

export type Category = AssetCategory | LiabilityCategory;

export type ItemType = "asset" | "liability";

export interface LineItem {
  id: string;
  name: string;
  category: Category;
  type: ItemType;
  amount: number;
  source?: "manual" | "monzo" | "trading212";
}

export interface MonthlySnapshot {
  id: string;
  month: string; // YYYY-MM
  items: LineItem[];
}

export interface CategoryInfo {
  key: Category;
  label: string;
  type: ItemType;
  color: string;
  group: string;
}

export interface ChartDataPoint {
  month: string;
  label: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

export interface CompositionSlice {
  name: string;
  value: number;
  color: string;
}

export interface ApiConnection {
  provider: "monzo" | "trading212";
  label: string;
  connected: boolean;
  apiKey?: string;
  lastSync?: string;
}
