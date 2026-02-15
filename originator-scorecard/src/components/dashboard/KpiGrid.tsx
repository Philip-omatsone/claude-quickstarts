import type { KpiValue } from '../../types';
import KpiCard from './KpiCard';

export default function KpiGrid({ kpis }: { kpis: KpiValue[] }) {
  if (kpis.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        No metric data available. Add data via the Data Entry page.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.metricType} kpi={kpi} />
      ))}
    </div>
  );
}
