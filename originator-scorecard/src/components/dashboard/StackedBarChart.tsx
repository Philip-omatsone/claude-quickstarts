import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import type { MetricType } from '../../types';
import { formatCurrencyAxis, formatValue } from '../../utils/format';
import { ORIGINATOR_COLORS } from '../../utils/format';

interface StackedBarChartProps {
  metricType: MetricType;
  title: string;
  unit?: 'currency' | 'percentage' | 'number';
  selectedOriginatorId?: string;
}

export default function StackedBarChartComponent({ metricType, title, unit, selectedOriginatorId }: StackedBarChartProps) {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const allMetrics = useLiveQuery(
    () => db.metrics.where('metricType').equals(metricType).sortBy('date'),
    [metricType],
  );

  if (!allMetrics || !originators || allMetrics.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-text-secondary mb-4">{title}</h3>
        <div className="h-48 flex items-center justify-center text-text-secondary text-sm">No data available</div>
      </div>
    );
  }

  const orgMap = new Map(originators.map((o) => [o.id, o.name]));
  const filtered = selectedOriginatorId
    ? allMetrics.filter((m) => m.originatorId === selectedOriginatorId)
    : allMetrics;

  // Deduplicate
  const dedupMap = new Map<string, typeof allMetrics[0]>();
  for (const m of filtered) {
    dedupMap.set(`${m.period}|${m.originatorId}`, m);
  }

  const periodMap = new Map<string, Record<string, number | string>>();
  for (const m of dedupMap.values()) {
    const name = orgMap.get(m.originatorId) ?? 'Unknown';
    if (!periodMap.has(m.period)) periodMap.set(m.period, { period: m.period });
    periodMap.get(m.period)![name] = m.value;
  }

  const data = Array.from(periodMap.values()).sort((a, b) =>
    (a.period as string).localeCompare(b.period as string),
  );

  const activeOrgs = selectedOriginatorId
    ? [orgMap.get(selectedOriginatorId) ?? 'Unknown']
    : [...new Set(Array.from(dedupMap.values()).map((m) => orgMap.get(m.originatorId) ?? 'Unknown'))];

  const detectedUnit = unit ?? (allMetrics[0]?.unit === 'currency' ? 'currency' : 'number');

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-sm font-medium text-text-secondary mb-4" style={{ fontFamily: 'var(--font-family-heading)' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => detectedUnit === 'currency' ? formatCurrencyAxis(v) : v.toLocaleString()} />
          <Tooltip formatter={(v: number | string | undefined) => formatValue(Number(v ?? 0), detectedUnit)} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
          {activeOrgs.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
          {activeOrgs.map((name, i) => (
            <Bar key={name} dataKey={name} stackId="a" fill={ORIGINATOR_COLORS[i % ORIGINATOR_COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
