import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { db } from '../db/database';
import { ragDotClass } from '../utils/rag';
import type { Covenant } from '../types';

function CovenantGauge({ covenant }: { covenant: Covenant }) {
  const pct = Math.min(100, Math.max(0, (covenant.currentLevel / covenant.threshold) * 100));
  const isBelow = covenant.direction === 'below';
  const fillPct = isBelow ? pct : Math.min(100, Math.max(0, (covenant.threshold / covenant.currentLevel) * 100));
  const color = covenant.ragStatus === 'green' ? '#22c55e' : covenant.ragStatus === 'amber' ? '#f59e0b' : '#ef4444';

  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 relative">
      <div
        className="h-2.5 rounded-full transition-all"
        style={{ width: `${fillPct}%`, backgroundColor: color }}
      />
      <div
        className="absolute top-0 h-2.5 w-0.5 bg-gray-800"
        style={{ left: `${isBelow ? 100 : (covenant.threshold / (covenant.currentLevel * 1.5)) * 100}%` }}
        title={`Threshold: ${covenant.threshold}`}
      />
    </div>
  );
}

export default function CovenantsPage() {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const covenants = useLiveQuery(() => db.covenants.toArray(), []);

  if (!originators || !covenants) {
    return <div className="p-8 text-center text-text-secondary">Loading...</div>;
  }

  const orgMap = new Map(originators.map((o) => [o.id, o.name]));

  // Alerts: amber and red covenants
  const alerts = covenants.filter((c) => c.ragStatus === 'red' || c.ragStatus === 'amber');

  // Group by originator
  const byOriginator = new Map<string, Covenant[]>();
  for (const c of covenants) {
    if (!byOriginator.has(c.originatorId)) byOriginator.set(c.originatorId, []);
    byOriginator.get(c.originatorId)!.push(c);
  }

  const trendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp size={14} className="text-rag-green" />;
    if (trend === 'deteriorating') return <TrendingDown size={14} className="text-rag-red" />;
    return <Minus size={14} className="text-text-secondary" />;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Covenants & Triggers</h2>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-rag-red" />
            <h3 className="text-sm font-semibold text-rag-red" style={{ fontFamily: 'var(--font-family-body)' }}>
              Covenant Alerts ({alerts.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {alerts.map((a) => (
              <div key={a.id} className={`flex items-center gap-2 p-2 rounded-md ${a.ragStatus === 'red' ? 'bg-red-100' : 'bg-amber-50'}`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${ragDotClass(a.ragStatus)}`} />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-text-primary truncate">{orgMap.get(a.originatorId)}: {a.name}</div>
                  <div className="text-[10px] text-text-secondary">
                    {a.currentLevel.toFixed(1)} vs {a.threshold.toFixed(1)} threshold ({a.headroomPercent.toFixed(0)}% headroom)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Covenant Table by Originator */}
      {Array.from(byOriginator.entries()).map(([orgId, orgCovenants]) => (
        <div key={orgId} className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary" style={{ fontFamily: 'var(--font-family-heading)' }}>
              {orgMap.get(orgId) ?? 'Unknown'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary">Covenant</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary">Type</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-text-secondary">Threshold</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-text-secondary">Current</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-text-secondary">Headroom</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-text-secondary">Status</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-text-secondary">Trend</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary w-32">Gauge</th>
                </tr>
              </thead>
              <tbody>
                {orgCovenants.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-2 text-xs font-medium text-text-primary">{c.name}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-text-secondary capitalize">
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-xs text-text-secondary">
                      {c.direction === 'below' ? '<' : '>'} {c.threshold.toFixed(1)}
                      {c.metricType?.includes('ratio') || c.metricType?.includes('coverage') || c.metricType?.includes('utilisation') || c.metricType?.includes('income') ? '%' : ''}
                    </td>
                    <td className="px-4 py-2 text-right text-xs font-medium text-text-primary">
                      {c.currentLevel.toFixed(1)}
                      {c.metricType?.includes('ratio') || c.metricType?.includes('coverage') || c.metricType?.includes('utilisation') || c.metricType?.includes('income') ? '%' : ''}
                    </td>
                    <td className="px-4 py-2 text-right text-xs text-text-secondary">
                      {c.headroomAbsolute.toFixed(1)} ({c.headroomPercent.toFixed(0)}%)
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className={`w-3 h-3 rounded-full mx-auto ${ragDotClass(c.ragStatus)}`} />
                    </td>
                    <td className="px-4 py-2 text-center">{trendIcon(c.trend)}</td>
                    <td className="px-4 py-2"><CovenantGauge covenant={c} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {covenants.length === 0 && (
        <div className="text-center py-12 text-text-secondary text-sm">
          No covenant data available. Add data via the Data Entry page.
        </div>
      )}
    </div>
  );
}
