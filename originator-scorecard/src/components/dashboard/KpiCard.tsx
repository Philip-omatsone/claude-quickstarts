import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { KpiValue } from '../../types';
import { ragBgClass } from '../../utils/rag';
import { formatValue } from '../../utils/format';

export default function KpiCard({ kpi }: { kpi: KpiValue }) {
  const changeIcon =
    kpi.changePercent !== null ? (
      kpi.changePercent > 0 ? (
        <TrendingUp size={12} />
      ) : kpi.changePercent < 0 ? (
        <TrendingDown size={12} />
      ) : (
        <Minus size={12} />
      )
    ) : null;

  const sparkData = kpi.sparklineData?.map((v, i) => ({ i, v })) ?? [];

  const changeColor =
    kpi.changePercent !== null
      ? kpi.changePercent > 0
        ? 'text-rag-green'
        : kpi.changePercent < 0
          ? 'text-rag-red'
          : 'text-text-secondary'
      : '';

  return (
    <div className={`rounded-lg border-l-4 border border-border p-3 bg-card shadow-sm ${ragBgClass(kpi.ragStatus)}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium text-text-secondary mb-0.5 truncate" style={{ fontFamily: 'var(--font-family-body)' }}>
            {kpi.label}
          </div>
          <div className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-family-body)' }}>
            {formatValue(kpi.currentValue, kpi.unit)}
          </div>
          {kpi.changePercent !== null && (
            <div className={`flex items-center gap-0.5 mt-1 text-[11px] font-medium ${changeColor}`}>
              {changeIcon}
              <span>{kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%</span>
              <span className="text-text-secondary font-normal ml-0.5">vs prior</span>
            </div>
          )}
        </div>
        {sparkData.length > 1 && (
          <div className="w-16 h-8 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={kpi.ragStatus === 'red' ? '#ef4444' : kpi.ragStatus === 'amber' ? '#f59e0b' : '#00A3A1'}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
