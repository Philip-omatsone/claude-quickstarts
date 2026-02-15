import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import { db } from '../db/database';
import { formatValue, getPeriodOptions, ORIGINATOR_COLORS } from '../utils/format';
import type { MetricType, MetricUnit } from '../types';

interface ComparisonMetric {
  label: string;
  metricType: MetricType;
  unit: MetricUnit;
  group: string;
}

const COMPARISON_METRICS: ComparisonMetric[] = [
  { label: 'Revenue', metricType: 'revenue', unit: 'currency', group: 'Financials' },
  { label: 'Net Income', metricType: 'net_income', unit: 'currency', group: 'Financials' },
  { label: 'Operating Income', metricType: 'operating_income', unit: 'currency', group: 'Financials' },
  { label: 'Cost-to-Income', metricType: 'cost_to_income', unit: 'percentage', group: 'Financials' },
  { label: 'Return on Assets', metricType: 'return_on_assets', unit: 'percentage', group: 'Financials' },
  { label: 'Bad Debt Ratio', metricType: 'bad_debt_ratio', unit: 'percentage', group: 'Credit Quality' },
  { label: 'NPL Ratio', metricType: 'npl_ratio', unit: 'percentage', group: 'Credit Quality' },
  { label: '30+ DPD', metricType: 'dpd_30', unit: 'percentage', group: 'Credit Quality' },
  { label: 'Provision Coverage', metricType: 'provision_coverage', unit: 'percentage', group: 'Credit Quality' },
  { label: 'Recovery Rate', metricType: 'recovery_rate', unit: 'percentage', group: 'Credit Quality' },
  { label: 'New Advance Volume', metricType: 'new_advance_volume', unit: 'currency', group: 'Origination' },
  { label: 'Avg Deal Size', metricType: 'avg_deal_size', unit: 'currency', group: 'Origination' },
  { label: 'Approval Rate', metricType: 'approval_rate', unit: 'percentage', group: 'Origination' },
  { label: 'Wtd Avg Yield', metricType: 'weighted_avg_yield', unit: 'percentage', group: 'Origination' },
  { label: 'Total AuM', metricType: 'total_aum', unit: 'currency', group: 'Portfolio' },
  { label: 'Warehouse Utilisation', metricType: 'warehouse_utilisation', unit: 'percentage', group: 'Portfolio' },
  { label: 'Live Contracts', metricType: 'live_contracts', unit: 'number', group: 'Portfolio' },
  { label: 'HP Split', metricType: 'hp_split', unit: 'percentage', group: 'Portfolio' },
  { label: 'Finance Lease Split', metricType: 'finance_lease_split', unit: 'percentage', group: 'Portfolio' },
];

const RADAR_METRICS: { label: string; metricType: MetricType; higherIsBetter: boolean }[] = [
  { label: 'Revenue Growth', metricType: 'revenue', higherIsBetter: true },
  { label: 'Credit Quality', metricType: 'bad_debt_ratio', higherIsBetter: false },
  { label: 'Profitability', metricType: 'return_on_assets', higherIsBetter: true },
  { label: 'Efficiency', metricType: 'cost_to_income', higherIsBetter: false },
  { label: 'Origination', metricType: 'approval_rate', higherIsBetter: true },
  { label: 'Recovery', metricType: 'recovery_rate', higherIsBetter: true },
];

export default function ComparisonPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const allMetrics = useLiveQuery(() => db.metrics.toArray(), []);
  const periodOptions = getPeriodOptions();

  if (!originators || !allMetrics) {
    return <div className="p-8 text-center text-text-secondary">Loading...</div>;
  }

  // Build value map: metricType -> originatorId -> latest value for period
  const valueMap = new Map<string, Map<string, number>>();
  for (const m of allMetrics) {
    if (selectedPeriod && m.period !== selectedPeriod) continue;
    const key = m.metricType;
    if (!valueMap.has(key)) valueMap.set(key, new Map());
    const orgValues = valueMap.get(key)!;
    const existing = orgValues.get(m.originatorId);
    if (!existing || new Date(m.date).getTime() > 0) {
      orgValues.set(m.originatorId, m.value);
    }
  }

  // If no period selected, keep only latest value per originator per metric
  if (!selectedPeriod) {
    const latestMap = new Map<string, Map<string, { value: number; date: number }>>();
    for (const m of allMetrics) {
      const key = m.metricType;
      if (!latestMap.has(key)) latestMap.set(key, new Map());
      const orgValues = latestMap.get(key)!;
      const existing = orgValues.get(m.originatorId);
      const mDate = new Date(m.date).getTime();
      if (!existing || mDate > existing.date) {
        orgValues.set(m.originatorId, { value: m.value, date: mDate });
      }
    }
    valueMap.clear();
    for (const [key, orgValues] of latestMap) {
      const newOrgValues = new Map<string, number>();
      for (const [orgId, { value }] of orgValues) {
        newOrgValues.set(orgId, value);
      }
      valueMap.set(key, newOrgValues);
    }
  }

  const groups = [...new Set(COMPARISON_METRICS.map((m) => m.group))];

  // Radar chart data
  const radarData = RADAR_METRICS.map((rm) => {
    const orgValues = valueMap.get(rm.metricType);
    const row: Record<string, string | number> = { metric: rm.label };
    if (orgValues) {
      const allVals = Array.from(orgValues.values());
      const minVal = Math.min(...allVals);
      const maxVal = Math.max(...allVals);
      const range = maxVal - minVal || 1;
      for (const o of originators) {
        const v = orgValues.get(o.id);
        if (v !== undefined) {
          const normalized = rm.higherIsBetter
            ? ((v - minVal) / range) * 100
            : ((maxVal - v) / range) * 100;
          row[o.name] = Math.round(normalized);
        }
      }
    }
    return row;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Originator Comparison</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-border rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
          style={{ fontFamily: 'var(--font-family-body)' }}
        >
          <option value="">Latest Available</option>
          {periodOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Radar Chart */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-text-secondary mb-4" style={{ fontFamily: 'var(--font-family-heading)' }}>
          Performance Radar (normalised)
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
            {originators.map((o, i) => (
              <Radar
                key={o.id}
                name={o.name}
                dataKey={o.name}
                stroke={ORIGINATOR_COLORS[i % ORIGINATOR_COLORS.length]}
                fill={ORIGINATOR_COLORS[i % ORIGINATOR_COLORS.length]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
      {groups.map((group) => {
        const metrics = COMPARISON_METRICS.filter((m) => m.group === group);
        return (
          <div key={group} className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary" style={{ fontFamily: 'var(--font-family-body)' }}>
                {group}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary w-48">Metric</th>
                    {originators.map((o) => (
                      <th key={o.id} className="px-4 py-2 text-right text-xs font-medium text-text-secondary">{o.name}</th>
                    ))}
                    <th className="px-4 py-2 text-right text-xs font-medium text-text-secondary">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => {
                    const orgValues = valueMap.get(metric.metricType);
                    const values = originators.map((o) => orgValues?.get(o.id) ?? null);
                    const nonNull = values.filter((v): v is number => v !== null);
                    const best = nonNull.length > 0 ? Math.max(...nonNull) : null;
                    const worst = nonNull.length > 0 ? Math.min(...nonNull) : null;
                    const isLowerBetter = ['bad_debt_ratio', 'npl_ratio', 'dpd_30', 'dpd_60', 'dpd_90', 'cost_to_income', 'write_off_rate', 'warehouse_utilisation'].includes(metric.metricType);
                    const delta = best !== null && worst !== null ? Math.abs(best - worst) : null;

                    return (
                      <tr key={metric.metricType} className="border-b border-border last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs text-text-primary font-medium">{metric.label}</td>
                        {values.map((v, i) => {
                          const isBest = v !== null && ((isLowerBetter && v === worst) || (!isLowerBetter && v === best));
                          const isWorst = v !== null && ((isLowerBetter && v === best) || (!isLowerBetter && v === worst));
                          return (
                            <td
                              key={originators[i].id}
                              className={`px-4 py-2 text-right text-xs font-medium ${
                                isBest && nonNull.length > 1 ? 'text-rag-green' : isWorst && nonNull.length > 1 ? 'text-rag-red' : 'text-text-primary'
                              }`}
                            >
                              {v !== null ? formatValue(v, metric.unit) : '-'}
                            </td>
                          );
                        })}
                        <td className="px-4 py-2 text-right text-xs text-text-secondary">
                          {delta !== null ? formatValue(delta, metric.unit) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
