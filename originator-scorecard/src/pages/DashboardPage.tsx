import { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { seedDemoData } from '../db/seed';
import { useKpiGroups } from '../hooks/useKpiCalculations';
import KpiGrid from '../components/dashboard/KpiGrid';
import TrendChart from '../components/dashboard/TrendChart';
import StackedBarChart from '../components/dashboard/StackedBarChart';
import DoughnutChart from '../components/dashboard/DoughnutChart';
import HeadlinesFeed from '../components/dashboard/HeadlinesFeed';
import { getPeriodOptions } from '../utils/format';

export default function DashboardPage() {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  useEffect(() => {
    seedDemoData();
  }, []);

  const kpiGroups = useKpiGroups(selectedOrgId || undefined, selectedPeriod || undefined);

  const periodOptions = getPeriodOptions();

  // Compute asset type breakdown for doughnut chart
  const latestAssetMetrics = useLiveQuery(async () => {
    const orgId = selectedOrgId || undefined;
    const types = ['hp_split', 'finance_lease_split', 'operating_lease_split'] as const;
    const results: { name: string; value: number }[] = [];
    for (const t of types) {
      let metrics;
      if (orgId) {
        metrics = await db.metrics.where('[originatorId+metricType]').equals([orgId, t]).sortBy('date');
      } else {
        metrics = await db.metrics.where('metricType').equals(t).sortBy('date');
      }
      if (metrics.length > 0) {
        // Average across originators if "All", or take latest
        if (orgId) {
          results.push({ name: t === 'hp_split' ? 'Hire Purchase' : t === 'finance_lease_split' ? 'Finance Lease' : 'Operating Lease', value: metrics[metrics.length - 1].value });
        } else {
          // Average of latest values per originator
          const byOrg = new Map<string, number>();
          for (const m of metrics) byOrg.set(m.originatorId, m.value);
          const avg = Array.from(byOrg.values()).reduce((a, b) => a + b, 0) / byOrg.size;
          results.push({ name: t === 'hp_split' ? 'Hire Purchase' : t === 'finance_lease_split' ? 'Finance Lease' : 'Operating Lease', value: avg });
        }
      }
    }
    return results;
  }, [selectedOrgId]);

  // Region data for geographic bar chart
  const regionData = useMemo(() => {
    if (!originators) return [];
    const regions = new Map<string, number>();
    for (const o of originators) {
      const r = o.region ?? 'Unknown';
      regions.set(r, (regions.get(r) ?? 0) + 1);
    }
    return Array.from(regions.entries()).map(([name, value]) => ({ name, value }));
  }, [originators]);

  return (
    <div className="space-y-6">
      {/* Header with selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
          {originators && originators.length > 0 && (
            <p className="text-xs text-text-secondary mt-1" style={{ fontFamily: 'var(--font-family-body)' }}>
              Tracking {originators.length} originator{originators.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-border rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
            style={{ fontFamily: 'var(--font-family-body)' }}
          >
            <option value="">Latest Period</option>
            {periodOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Originator pills */}
      {originators && originators.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedOrgId('')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedOrgId === ''
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
            style={{ fontFamily: 'var(--font-family-body)' }}
          >
            All Originators
          </button>
          {originators.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelectedOrgId(o.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedOrgId === o.id
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
              style={{ fontFamily: 'var(--font-family-body)' }}
            >
              {o.name}
            </button>
          ))}
        </div>
      )}

      {/* KPI Groups */}
      <KpiGrid groups={kpiGroups} />

      {/* Trend Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart
          metricType="revenue"
          title="Revenue Trend"
          selectedOriginatorId={selectedOrgId || undefined}
        />
        <TrendChart
          metricType="bad_debt_ratio"
          title="Bad Debt Ratio Trend"
          referenceLine={{ value: 3, label: 'Covenant', status: 'red' }}
          selectedOriginatorId={selectedOrgId || undefined}
        />
      </div>

      {/* Trend Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart
          metricType="npl_ratio"
          title="NPL Ratio Trend"
          referenceLine={{ value: 5, label: 'Covenant', status: 'red' }}
          selectedOriginatorId={selectedOrgId || undefined}
        />
        <TrendChart
          metricType="total_aum"
          title="AuM Growth"
          selectedOriginatorId={selectedOrgId || undefined}
        />
      </div>

      {/* New Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StackedBarChart
          metricType="new_advance_volume"
          title="Origination Volume by Quarter"
          selectedOriginatorId={selectedOrgId || undefined}
        />
        <TrendChart
          metricType="warehouse_utilisation"
          title="Facility Utilisation"
          referenceLine={{ value: 90, label: 'Max facility', status: 'red' }}
          selectedOriginatorId={selectedOrgId || undefined}
        />
      </div>

      {/* Doughnut + Region + Headlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DoughnutChart title="Asset Type Breakdown" data={latestAssetMetrics ?? []} />
        <DoughnutChart title="Geographic Concentration" data={regionData} />
        <HeadlinesFeed />
      </div>
    </div>
  );
}
