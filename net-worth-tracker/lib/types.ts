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
  | "vanguard_equity"
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
  vanguardEquity: number;
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

// Monthly value tracking for property
export interface MonthlyPropertyValue {
  month: string; // YYYY-MM
  estimatedValue: number;
  mortgageBalance: number;
}

// Property / Home Equity data
export interface PropertyData {
  id: string;
  name: string;
  address?: string;
  estimatedValue: number;
  mortgageBalance: number;
  interestRate: number;
  mortgageTerm?: number; // years remaining
  purchasePrice?: number;
  purchaseDate?: string; // YYYY-MM
  valuationSource: "manual" | "rightmove" | "land_registry";
  lastValuationDate?: string;
  monthlyHistory?: MonthlyPropertyValue[];
}

// Monthly value tracking for pension
export interface MonthlyPensionValue {
  month: string; // YYYY-MM
  value: number;
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
  monthlyHistory?: MonthlyPensionValue[];
}

// Vanguard equity data (renamed from EquityExposureEntry)
export interface VanguardEquityEntry {
  id: string;
  name: string;
  provider: "vanguard" | "trading212" | "manual";
  totalValue: number;
  equityPercent: number; // 0-100
  equityValue: number; // calculated: totalValue * equityPercent / 100
  lastUpdated?: string;
  portfolioSummary?: string; // parsed summary from portfolio report
}

// Keep backwards compat alias
export type EquityExposureEntry = VanguardEquityEntry;

// Cash Savings entry
export interface CashSavingsEntry {
  id: string;
  name: string;
  accountType: "current_account" | "savings_account" | "cash_isa" | "credit_card";
  balance: number;
  provider?: string;
  lastUpdated?: string;
}
