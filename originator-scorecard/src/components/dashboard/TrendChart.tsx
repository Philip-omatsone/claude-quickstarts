import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import type { MetricType } from '../../types';
import { ragColor } from '../../utils/rag';
import { formatCurrencyAxis, formatValue } from '../../utils/format';
import { ORIGINATOR_COLORS } from '../../utils/format';

interface TrendChartProps {
  metricType: MetricType;
  title: string;
  unit?: 'currency' | 'percentage' | 'number';
  referenceLine?: { value: number; label: string; status: 'green' | 'amber' | 'red' };
  selectedOriginatorId?: string;
}

export default function TrendChart({ metricType, title, unit, referenceLine, selectedOriginatorId }: TrendChartProps) {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const allMetrics = useLiveQuery(
    () => db.metrics.where('metricType').equals(metricType).sortBy('date'),
    [metricType],
  );

  if (!allMetrics || !originators || allMetrics.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-text-secondary mb-4">{title}</h3>
        <div className="h-48 flex items-center justify-center text-text-secondary text-sm">
          No data available
        </div>
      </div>
    );
  }

  const orgMap = new Map(originators.map((o) => [o.id, o.name]));

  // Build data: one row per period, with one key per originator
  const periodMap = new Map<string, Record<string, number>>();
  const filteredMetrics = selectedOriginatorId
    ? allMetrics.filter((m) => m.originatorId === selectedOriginatorId)
    : allMetrics;

  // Deduplicate by period+originator (keep last entry)
  const dedupKey = (m: typeof allMetrics[0]) => `${m.period}|${m.originatorId}`;
  const dedupMap = new Map<string, typeof allMetrics[0]>();
  for (const m of filteredMetrics) {
    dedupMap.set(dedupKey(m), m);
  }

  for (const m of dedupMap.values()) {
    const name = orgMap.get(m.originatorId) ?? 'Unknown';
    if (!periodMap.has(m.period)) periodMap.set(m.period, { period: m.period } as unknown as Record<string, number>);
    const row = periodMap.get(m.period)!;
    row[name] = m.value;
  }

  const data = Array.from(periodMap.values()).sort((a, b) => {
    const pa = a['period'] as unknown as string;
    const pb = b['period'] as unknown as string;
    return pa.localeCompare(pb);
  });

  const activeOrgs = selectedOriginatorId
    ? [orgMap.get(selectedOriginatorId) ?? 'Unknown']
    : [...new Set(Array.from(dedupMap.values()).map((m) => orgMap.get(m.originatorId) ?? 'Unknown'))];

  const detectedUnit = unit ?? (allMetrics[0]?.unit === 'currency' ? 'currency' : allMetrics[0]?.unit === 'percentage' ? 'percentage' : 'number');

  const yAxisFormatter = (v: number) => {
    if (detectedUnit === 'currency') return formatCurrencyAxis(v);
    if (detectedUnit === 'percentage') return `${v}%`;
    return v.toLocaleString();
  };

  const tooltipFormatter = (v: number | undefined) => {
    return formatValue(v ?? 0, detectedUnit);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-sm font-medium text-text-secondary mb-4" style={{ fontFamily: 'var(--font-family-heading)' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={yAxisFormatter} />
          <Tooltip
            formatter={tooltipFormatter}
            contentStyle={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          {activeOrgs.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
          {activeOrgs.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={ORIGINATOR_COLORS[i % ORIGINATOR_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
          {referenceLine && (
            <ReferenceLine
              y={referenceLine.value}
              stroke={ragColor(referenceLine.status)}
              strokeDasharray="4 4"
              label={{ value: referenceLine.label, position: 'right', fontSize: 10 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
