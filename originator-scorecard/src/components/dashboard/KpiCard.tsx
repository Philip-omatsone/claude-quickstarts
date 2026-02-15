import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KpiValue } from '../../types';
import { ragBgClass } from '../../utils/rag';

function formatValue(value: number, unit: string): string {
  if (unit === 'currency') {
    if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  }
  if (unit === 'percentage') return `${value.toFixed(1)}%`;
  if (unit === 'ratio') return value.toFixed(2);
  return value.toLocaleString();
}

export default function KpiCard({ kpi }: { kpi: KpiValue }) {
  const changeIcon =
    kpi.changePercent !== null ? (
      kpi.changePercent > 0 ? (
        <TrendingUp size={14} />
      ) : kpi.changePercent < 0 ? (
        <TrendingDown size={14} />
      ) : (
        <Minus size={14} />
      )
    ) : null;

  return (
    <div className={`rounded-lg border-2 p-4 bg-card shadow-sm ${ragBgClass(kpi.ragStatus)}`}>
      <div className="text-sm font-medium text-text-secondary mb-1">{kpi.label}</div>
      <div className="text-2xl font-bold text-text-primary">{formatValue(kpi.currentValue, kpi.unit)}</div>
      {kpi.changePercent !== null && (
        <div
          className={`flex items-center gap-1 mt-2 text-sm font-medium ${
            kpi.changePercent > 0
              ? 'text-rag-green'
              : kpi.changePercent < 0
                ? 'text-rag-red'
                : 'text-text-secondary'
          }`}
        >
          {changeIcon}
          <span>{kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%</span>
          <span className="text-text-secondary font-normal ml-1">vs prior</span>
        </div>
      )}
    </div>
  );
}
