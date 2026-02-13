export type AssetCategory =
  | "cash"
  | "isa"
  | "pension"
  | "investment"
  | "property"
  | "other_asset";

export type LiabilityCategory = "mortgage" | "debt" | "other_liability";

export type Category = AssetCategory | LiabilityCategory;

export type ItemType = "asset" | "liability";

export interface LineItem {
  id: string;
  name: string;
  category: Category;
  type: ItemType;
  amount: number;
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
