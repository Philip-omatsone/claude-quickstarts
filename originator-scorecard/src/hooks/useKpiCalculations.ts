import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { KpiValue, MetricType, MetricUnit } from '../types';
import { getRagStatus } from '../utils/rag';

const KPI_METRICS: { type: MetricType; label: string; unit: MetricUnit }[] = [
  { type: 'revenue', label: 'Revenue', unit: 'currency' },
  { type: 'net_income', label: 'Net Income', unit: 'currency' },
  { type: 'operating_income', label: 'Operating Income', unit: 'currency' },
  { type: 'bad_debt_ratio', label: 'Bad Debt Ratio', unit: 'percentage' },
  { type: 'provision_coverage', label: 'Provision Coverage', unit: 'percentage' },
  { type: 'npl_ratio', label: 'NPL Ratio', unit: 'percentage' },
];

export function useKpiCalculations(originatorId?: string): KpiValue[] {
  const metrics = useLiveQuery(async () => {
    let query = db.metrics.orderBy('date');
    if (originatorId) {
      query = db.metrics.where('originatorId').equals(originatorId).sortBy('date') as never;
      return db.metrics.where('originatorId').equals(originatorId).sortBy('date');
    }
    return query.toArray();
  }, [originatorId]);

  if (!metrics) return [];

  return KPI_METRICS.map(({ type, label, unit }) => {
    const typeMetrics = metrics
      .filter((m) => m.metricType === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const current = typeMetrics[0];
    const previous = typeMetrics[1] ?? null;

    const currentValue = current?.value ?? 0;
    const previousValue = previous?.value ?? null;
    const changePercent =
      previousValue !== null && previousValue !== 0
        ? ((currentValue - previousValue) / Math.abs(previousValue)) * 100
        : null;

    return {
      metricType: type,
      label,
      currentValue,
      previousValue,
      changePercent,
      ragStatus: getRagStatus(type, currentValue, previousValue),
      unit,
    };
  });
}
