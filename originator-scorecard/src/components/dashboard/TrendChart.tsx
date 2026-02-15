import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import type { MetricType } from '../../types';
import { ragColor } from '../../utils/rag';

interface TrendChartProps {
  metricType: MetricType;
  title: string;
  color?: string;
  referenceLine?: { value: number; label: string; status: 'green' | 'amber' | 'red' };
}

export default function TrendChart({ metricType, title, color = '#3b82f6', referenceLine }: TrendChartProps) {
  const data = useLiveQuery(
    () =>
      db.metrics
        .where('metricType')
        .equals(metricType)
        .sortBy('date')
        .then((metrics) =>
          metrics.map((m) => ({
            period: m.period,
            value: m.value,
          })),
        ),
    [metricType],
  );

  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-text-secondary mb-4">{title}</h3>
        <div className="h-48 flex items-center justify-center text-text-secondary text-sm">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-sm font-medium text-text-secondary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.1} strokeWidth={2} />
          {referenceLine && (
            <ReferenceLine
              y={referenceLine.value}
              stroke={ragColor(referenceLine.status)}
              strokeDasharray="4 4"
              label={{ value: referenceLine.label, position: 'right', fontSize: 11 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
