import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import DataTable from '../components/tables/DataTable';
import type { MetricType, MetricSource } from '../types';

export default function MetricsPage() {
  const [filterType, setFilterType] = useState<MetricType | ''>('');
  const [filterSource, setFilterSource] = useState<MetricSource | ''>('');

  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const metrics = useLiveQuery(() => db.metrics.orderBy('date').reverse().toArray(), []);

  const originatorMap = new Map(originators?.map((o) => [o.id, o.name]) ?? []);

  const filtered = (metrics ?? []).filter((m) => {
    if (filterType && m.metricType !== filterType) return false;
    if (filterSource && m.source !== filterSource) return false;
    return true;
  });

  const tableData = filtered.map((m) => ({
    id: m.id,
    originator: originatorMap.get(m.originatorId) ?? 'Unknown',
    metric: m.label,
    metricType: m.metricType,
    value: m.value,
    unit: m.unit,
    period: m.period,
    source: m.source,
    date: new Date(m.date).toLocaleDateString(),
  }));

  const columns = [
    { key: 'originator', label: 'Originator' },
    { key: 'metric', label: 'Metric' },
    {
      key: 'value',
      label: 'Value',
      render: (item: (typeof tableData)[0]) =>
        item.unit === 'currency'
          ? `$${item.value.toLocaleString()}`
          : item.unit === 'percentage'
            ? `${item.value}%`
            : item.value.toLocaleString(),
    },
    { key: 'unit', label: 'Unit' },
    { key: 'period', label: 'Period' },
    {
      key: 'source',
      label: 'Source',
      render: (item: (typeof tableData)[0]) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
          {item.source}
        </span>
      ),
    },
    { key: 'date', label: 'Date Added' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Metrics</h2>
      <DataTable
        data={tableData}
        columns={columns}
        keyField="id"
        searchFields={['originator', 'metric', 'period']}
        filters={
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as MetricType | '')}
              className="border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Types</option>
              <option value="revenue">Revenue</option>
              <option value="net_income">Net Income</option>
              <option value="operating_income">Operating Income</option>
              <option value="bad_debt_ratio">Bad Debt Ratio</option>
              <option value="provision_coverage">Provision Coverage</option>
              <option value="npl_ratio">NPL Ratio</option>
              <option value="total_assets">Total Assets</option>
            </select>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value as MetricSource | '')}
              className="border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Sources</option>
              <option value="manual">Manual</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        }
      />
    </div>
  );
}
