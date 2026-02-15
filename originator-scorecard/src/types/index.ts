export interface Originator {
  id: string;
  name: string;
  sector: string;
  region?: string;
  employeeCount?: number;
  turnoverBand?: string;
  createdAt: Date;
}

export type MetricType =
  | 'revenue'
  | 'net_income'
  | 'operating_income'
  | 'bad_debt_ratio'
  | 'provision_coverage'
  | 'npl_ratio'
  | 'total_assets'
  | 'total_aum'
  | 'warehouse_utilisation'
  | 'live_contracts'
  | 'weighted_avg_term'
  | 'dpd_30'
  | 'dpd_60'
  | 'dpd_90'
  | 'write_off_rate'
  | 'recovery_rate'
  | 'new_advance_volume'
  | 'avg_deal_size'
  | 'approval_rate'
  | 'weighted_avg_yield'
  | 'cost_to_income'
  | 'return_on_assets'
  | 'hp_split'
  | 'finance_lease_split'
  | 'operating_lease_split'
  | 'avg_contract_term'
  | 'residual_value_exposure'
  | 'custom';

export type MetricUnit = 'currency' | 'percentage' | 'ratio' | 'number' | 'months';

export type MetricSource = 'manual' | 'csv' | 'pdf';

export interface FinancialMetric {
  id: string;
  originatorId: string;
  metricType: MetricType;
  label: string;
  value: number;
  period: string;
  date: Date;
  unit: MetricUnit;
  source: MetricSource;
  createdAt: Date;
}

export type HeadlineCategory = 'earnings' | 'regulatory' | 'market' | 'risk' | 'general';
export type HeadlineImpact = 'high' | 'medium' | 'low';

export interface Headline {
  id: string;
  originatorId?: string;
  title: string;
  source: string;
  url?: string;
  category: HeadlineCategory;
  impact?: HeadlineImpact;
  date: Date;
  createdAt: Date;
}

export type RagStatus = 'green' | 'amber' | 'red';

export interface KpiValue {
  metricType: MetricType;
  label: string;
  currentValue: number;
  previousValue: number | null;
  changePercent: number | null;
  ragStatus: RagStatus;
  unit: MetricUnit;
  sparklineData?: number[];
}

export interface RagThreshold {
  metricType: MetricType;
  greenMin?: number;
  greenMax?: number;
  amberMin?: number;
  amberMax?: number;
}

export interface Covenant {
  id: string;
  originatorId: string;
  name: string;
  type: 'financial' | 'portfolio' | 'reporting';
  metricType?: MetricType;
  threshold: number;
  direction: 'above' | 'below';
  currentLevel: number;
  headroomAbsolute: number;
  headroomPercent: number;
  ragStatus: RagStatus;
  trend: 'improving' | 'stable' | 'deteriorating';
  createdAt: Date;
}

export interface OriginatorAnalysis {
  id: string;
  originatorId: string;
  summary: string;
  strengths: string[];
  risks: string[];
  outlook: string;
  keyMetrics: { label: string; value: string; trend: 'improving' | 'stable' | 'deteriorating' }[];
  creditAssessment: string;
  recommendedActions: string[];
  generatedAt: Date;
}

export interface DocumentReport {
  id: string;
  originatorId?: string;
  fileName: string;
  summary: string;
  reportType: string;
  reportPeriod: string | null;
  keyFindings: string[];
  riskFactors: string[];
  positiveIndicators: string[];
  metricsExtracted: number;
  uploadedAt: Date;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface KpiGroup {
  title: string;
  kpis: KpiValue[];
}
