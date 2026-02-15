export interface Originator {
  id: string;
  name: string;
  sector: string;
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
  | 'custom';

export type MetricUnit = 'currency' | 'percentage' | 'ratio' | 'number';

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

export interface Headline {
  id: string;
  originatorId?: string;
  title: string;
  source: string;
  url?: string;
  category: HeadlineCategory;
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
}

export interface RagThreshold {
  metricType: MetricType;
  greenMin?: number;
  greenMax?: number;
  amberMin?: number;
  amberMax?: number;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}
