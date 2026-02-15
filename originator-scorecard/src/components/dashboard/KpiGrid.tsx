import type { KpiGroup } from '../../types';
import KpiCard from './KpiCard';

export default function KpiGrid({ groups }: { groups: KpiGroup[] }) {
  const hasData = groups.some((g) => g.kpis.some((k) => k.currentValue !== 0));

  if (!hasData) {
    return (
      <div className="text-center py-8 text-text-secondary">
        No metric data available. Add data via the Data Entry page.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => {
        const nonZero = group.kpis.filter((k) => k.currentValue !== 0);
        if (nonZero.length === 0) return null;
        return (
          <div key={group.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2" style={{ fontFamily: 'var(--font-family-body)' }}>
              {group.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {nonZero.map((kpi) => (
                <KpiCard key={kpi.metricType} kpi={kpi} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
