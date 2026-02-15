import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { KpiValue, KpiGroup, MetricType, MetricUnit } from '../types';
import { getRagStatus } from '../utils/rag';

interface KpiDef { type: MetricType; label: string; unit: MetricUnit }

const PORTFOLIO_OVERVIEW: KpiDef[] = [
  { type: 'total_aum', label: 'Total AuM', unit: 'currency' },
  { type: 'warehouse_utilisation', label: 'Warehouse Utilisation', unit: 'percentage' },
  { type: 'live_contracts', label: 'Live Contracts', unit: 'number' },
  { type: 'weighted_avg_term', label: 'Wtd Avg Remaining Term', unit: 'months' },
];

const CREDIT_QUALITY: KpiDef[] = [
  { type: 'bad_debt_ratio', label: 'Bad Debt Ratio', unit: 'percentage' },
  { type: 'npl_ratio', label: 'NPL Ratio', unit: 'percentage' },
  { type: 'dpd_30', label: '30+ DPD Arrears', unit: 'percentage' },
  { type: 'dpd_60', label: '60+ DPD Arrears', unit: 'percentage' },
  { type: 'dpd_90', label: '90+ DPD Arrears', unit: 'percentage' },
  { type: 'provision_coverage', label: 'Provision Coverage', unit: 'percentage' },
  { type: 'write_off_rate', label: 'Write-off Rate', unit: 'percentage' },
  { type: 'recovery_rate', label: 'Recovery Rate', unit: 'percentage' },
];

const ORIGINATION: KpiDef[] = [
  { type: 'new_advance_volume', label: 'New Advance Volume', unit: 'currency' },
  { type: 'avg_deal_size', label: 'Average Deal Size', unit: 'currency' },
  { type: 'approval_rate', label: 'Approval Rate', unit: 'percentage' },
  { type: 'weighted_avg_yield', label: 'Wtd Avg Yield', unit: 'percentage' },
];

const FINANCIALS: KpiDef[] = [
  { type: 'revenue', label: 'Revenue', unit: 'currency' },
  { type: 'operating_income', label: 'Operating Income', unit: 'currency' },
  { type: 'net_income', label: 'Net Income', unit: 'currency' },
  { type: 'cost_to_income', label: 'Cost-to-Income', unit: 'percentage' },
  { type: 'return_on_assets', label: 'Return on Assets', unit: 'percentage' },
];

const ALL_KPIS = [...PORTFOLIO_OVERVIEW, ...CREDIT_QUALITY, ...ORIGINATION, ...FINANCIALS];

function computeKpi(
  defs: KpiDef[],
  metrics: { metricType: string; value: number; date: Date; period: string }[],
  selectedPeriod?: string,
): KpiValue[] {
  return defs.map(({ type, label, unit }) => {
    const typeMetrics = metrics
      .filter((m) => m.metricType === type)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Deduplicate: keep only the latest entry per period
    const byPeriod = new Map<string, typeof typeMetrics[0]>();
    for (const m of typeMetrics) {
      byPeriod.set(m.period, m);
    }
    const deduped = Array.from(byPeriod.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let current: typeof deduped[0] | undefined;
    let previous: typeof deduped[0] | undefined;

    if (selectedPeriod) {
      current = deduped.find((m) => m.period === selectedPeriod);
      const currentIdx = deduped.indexOf(current!);
      previous = currentIdx > 0 ? deduped[currentIdx - 1] : undefined;
    } else {
      current = deduped[deduped.length - 1];
      previous = deduped.length > 1 ? deduped[deduped.length - 2] : undefined;
    }

    const currentValue = current?.value ?? 0;
    const previousValue = previous?.value ?? null;
    const changePercent =
      previousValue !== null && previousValue !== 0
        ? ((currentValue - previousValue) / Math.abs(previousValue)) * 100
        : null;

    const sparklineData = deduped.slice(-6).map((m) => m.value);

    return {
      metricType: type,
      label,
      currentValue,
      previousValue,
      changePercent,
      ragStatus: getRagStatus(type, currentValue, previousValue),
      unit,
      sparklineData,
    };
  });
}

export function useKpiCalculations(originatorId?: string, selectedPeriod?: string): KpiValue[] {
  const metrics = useLiveQuery(async () => {
    if (originatorId) {
      return db.metrics.where('originatorId').equals(originatorId).sortBy('date');
    }
    return db.metrics.orderBy('date').toArray();
  }, [originatorId]);

  if (!metrics) return [];

  return computeKpi(ALL_KPIS, metrics, selectedPeriod);
}

export function useKpiGroups(originatorId?: string, selectedPeriod?: string): KpiGroup[] {
  const metrics = useLiveQuery(async () => {
    if (originatorId) {
      return db.metrics.where('originatorId').equals(originatorId).sortBy('date');
    }
    return db.metrics.orderBy('date').toArray();
  }, [originatorId]);

  if (!metrics) return [];

  return [
    { title: 'Portfolio Overview', kpis: computeKpi(PORTFOLIO_OVERVIEW, metrics, selectedPeriod) },
    { title: 'Credit Quality', kpis: computeKpi(CREDIT_QUALITY, metrics, selectedPeriod) },
    { title: 'Origination', kpis: computeKpi(ORIGINATION, metrics, selectedPeriod) },
    { title: 'Financials', kpis: computeKpi(FINANCIALS, metrics, selectedPeriod) },
  ];
}
