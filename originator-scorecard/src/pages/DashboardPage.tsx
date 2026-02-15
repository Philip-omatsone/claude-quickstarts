import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { db } from '../db/database';
import { useKpiCalculations } from '../hooks/useKpiCalculations';
import KpiGrid from '../components/dashboard/KpiGrid';
import TrendChart from '../components/dashboard/TrendChart';
import HeadlinesFeed from '../components/dashboard/HeadlinesFeed';

async function seedDemoData() {
  const count = await db.originators.count();
  if (count > 0) return;

  const orgId = uuid();
  const now = new Date();

  await db.originators.add({
    id: orgId,
    name: 'Acme Financial Corp',
    sector: 'Banking',
    createdAt: now,
  });

  const periods = ['2023-FY', '2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1'];
  const baseDate = new Date('2023-12-31');

  const revenueValues = [4200000000, 1150000000, 1200000000, 1280000000, 1350000000, 1420000000];
  const netIncomeValues = [680000000, 190000000, 205000000, 195000000, 220000000, 240000000];
  const operatingValues = [920000000, 250000000, 270000000, 260000000, 290000000, 310000000];
  const badDebtValues = [1.8, 2.1, 2.3, 2.0, 1.9, 1.7];
  const provCoverageValues = [105, 102, 98, 100, 103, 108];
  const nplValues = [2.5, 2.8, 3.1, 2.9, 2.6, 2.4];

  const metrics = periods.flatMap((period, i) => {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + i * 3);
    return [
      { metricType: 'revenue' as const, label: 'Revenue', value: revenueValues[i], unit: 'currency' as const },
      { metricType: 'net_income' as const, label: 'Net Income', value: netIncomeValues[i], unit: 'currency' as const },
      { metricType: 'operating_income' as const, label: 'Operating Income', value: operatingValues[i], unit: 'currency' as const },
      { metricType: 'bad_debt_ratio' as const, label: 'Bad Debt Ratio', value: badDebtValues[i], unit: 'percentage' as const },
      { metricType: 'provision_coverage' as const, label: 'Provision Coverage', value: provCoverageValues[i], unit: 'percentage' as const },
      { metricType: 'npl_ratio' as const, label: 'NPL Ratio', value: nplValues[i], unit: 'percentage' as const },
    ].map((m) => ({
      id: uuid(),
      originatorId: orgId,
      ...m,
      period,
      date,
      source: 'manual' as const,
      createdAt: now,
    }));
  });

  await db.metrics.bulkAdd(metrics);

  const headlines = [
    { title: 'Acme Financial reports strong Q1 2025 earnings', source: 'Financial Times', category: 'earnings' as const, date: new Date('2025-04-15') },
    { title: 'Regulators announce new capital adequacy requirements', source: 'Reuters', category: 'regulatory' as const, date: new Date('2025-03-20') },
    { title: 'Banking sector outlook upgraded to positive', source: 'Bloomberg', category: 'market' as const, date: new Date('2025-03-10') },
    { title: 'NPL ratios decline across major originators', source: 'S&P Global', category: 'risk' as const, date: new Date('2025-02-28') },
    { title: 'Acme announces digital transformation initiative', source: 'WSJ', category: 'general' as const, date: new Date('2025-02-15') },
  ].map((h) => ({
    id: uuid(),
    originatorId: orgId,
    ...h,
    createdAt: now,
  }));

  await db.headlines.bulkAdd(headlines);
}

export default function DashboardPage() {
  const originators = useLiveQuery(() => db.originators.toArray(), []);

  useEffect(() => {
    seedDemoData();
  }, []);

  const kpis = useKpiCalculations();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
        {originators && originators.length > 0 && (
          <p className="text-sm text-text-secondary mt-1">
            Tracking {originators.length} originator{originators.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      <KpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart
          metricType="revenue"
          title="Revenue Trend"
          color="#3b82f6"
        />
        <TrendChart
          metricType="bad_debt_ratio"
          title="Bad Debt Ratio Trend"
          color="#ef4444"
          referenceLine={{ value: 2, label: 'Green threshold', status: 'green' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart
          metricType="npl_ratio"
          title="NPL Ratio Trend"
          color="#f59e0b"
          referenceLine={{ value: 3, label: 'Green threshold', status: 'green' }}
        />
        <HeadlinesFeed />
      </div>
    </div>
  );
}
