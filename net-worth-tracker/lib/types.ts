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
  | "equity_exposure"
  | "other_asset";

export type LiabilityCategory =
  | "mortgage"
  | "student_loan"
  | "credit_card"
  | "debt"
  | "other_liability";

export type Category = AssetCategory | LiabilityCategory;

export type ItemType = "asset" | "liability";

export type ProviderType =
  | "manual"
  | "monzo"
  | "trading212"
  | "chip"
  | "plum"
  | "nationwide"
  | "amex"
  | "hsbc"
  | "legal_and_general"
  | "rightmove"
  | "vanguard"
  | "british_business_bank";

export interface LineItem {
  id: string;
  name: string;
  category: Category;
  type: ItemType;
  amount: number;
  source?: ProviderType;
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
  equityExposure: number;
}

export interface CompositionSlice {
  name: string;
  value: number;
  color: string;
}

export interface ApiConnection {
  provider: ProviderType;
  label: string;
  connected: boolean;
  apiKey?: string;
  lastSync?: string;
}

// Property / Home Equity data
export interface PropertyData {
  id: string;
  name: string;
  address?: string;
  estimatedValue: number;
  mortgageBalance: number;
  interestRate: number;
  monthlyPayment?: number;
  mortgageTerm?: number; // years remaining
  purchasePrice?: number;
  purchaseDate?: string; // YYYY-MM
  valuationSource: "manual" | "rightmove";
  lastValuationDate?: string;
}

// Pension data
export interface PensionEntry {
  id: string;
  name: string;
  provider: "hsbc" | "legal_and_general" | "british_business_bank" | "manual";
  currentValue: number;
  contributions?: number; // monthly contributions
  employerContributions?: number;
  fundName?: string;
  lastUpdated?: string;
}

// Equity exposure data (e.g. Vanguard)
export interface EquityExposureEntry {
  id: string;
  name: string;
  provider: "vanguard" | "manual";
  totalValue: number;
  equityPercent: number; // 0-100
  equityValue: number; // calculated: totalValue * equityPercent / 100
  lastUpdated?: string;
}
