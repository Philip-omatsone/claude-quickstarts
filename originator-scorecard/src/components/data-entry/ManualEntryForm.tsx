import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { Plus, Check } from 'lucide-react';
import { db } from '../../db/database';
import type { MetricType, MetricUnit } from '../../types';

const METRIC_OPTIONS: { value: MetricType; label: string; unit: MetricUnit }[] = [
  { value: 'revenue', label: 'Revenue', unit: 'currency' },
  { value: 'net_income', label: 'Net Income', unit: 'currency' },
  { value: 'operating_income', label: 'Operating Income', unit: 'currency' },
  { value: 'bad_debt_ratio', label: 'Bad Debt Ratio', unit: 'percentage' },
  { value: 'provision_coverage', label: 'Provision Coverage', unit: 'percentage' },
  { value: 'npl_ratio', label: 'NPL Ratio', unit: 'percentage' },
  { value: 'total_assets', label: 'Total Assets', unit: 'currency' },
  { value: 'custom', label: 'Custom', unit: 'number' },
];

const CURRENT_YEAR = new Date().getFullYear();
const PERIOD_OPTIONS = [
  ...Array.from({ length: 3 }, (_, y) =>
    [`${CURRENT_YEAR - y}-FY`, ...Array.from({ length: 4 }, (_, q) => `${CURRENT_YEAR - y}-Q${q + 1}`)],
  ).flat(),
];

export default function ManualEntryForm() {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const [originatorId, setOriginatorId] = useState('');
  const [newOriginatorName, setNewOriginatorName] = useState('');
  const [newOriginatorSector, setNewOriginatorSector] = useState('');
  const [showNewOriginator, setShowNewOriginator] = useState(false);
  const [metricType, setMetricType] = useState<MetricType>('revenue');
  const [customLabel, setCustomLabel] = useState('');
  const [value, setValue] = useState('');
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0]);
  const [saved, setSaved] = useState(false);

  const selectedMetric = METRIC_OPTIONS.find((m) => m.value === metricType)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let finalOriginatorId = originatorId;

    if (showNewOriginator && newOriginatorName.trim()) {
      finalOriginatorId = uuid();
      await db.originators.add({
        id: finalOriginatorId,
        name: newOriginatorName.trim(),
        sector: newOriginatorSector.trim() || 'Unknown',
        createdAt: new Date(),
      });
      setShowNewOriginator(false);
      setNewOriginatorName('');
      setNewOriginatorSector('');
    }

    if (!finalOriginatorId || !value) return;

    const periodDate = parsePeriodToDate(period);

    await db.metrics.add({
      id: uuid(),
      originatorId: finalOriginatorId,
      metricType,
      label: metricType === 'custom' ? customLabel || 'Custom Metric' : selectedMetric.label,
      value: parseFloat(value),
      period,
      date: periodDate,
      unit: selectedMetric.unit,
      source: 'manual',
      createdAt: new Date(),
    });

    setValue('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Originator</label>
        {showNewOriginator ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Company name"
              value={newOriginatorName}
              onChange={(e) => setNewOriginatorName(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
            <input
              type="text"
              placeholder="Sector (e.g., Banking)"
              value={newOriginatorSector}
              onChange={(e) => setNewOriginatorSector(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setShowNewOriginator(false)}
              className="text-xs text-primary hover:underline"
            >
              Select existing instead
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <select
              value={originatorId}
              onChange={(e) => setOriginatorId(e.target.value)}
              className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              required={!showNewOriginator}
            >
              <option value="">Select originator...</option>
              {originators?.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewOriginator(true)}
              className="flex items-center gap-1 px-3 py-2 border border-border rounded-md text-sm hover:bg-gray-50"
            >
              <Plus size={14} />
              New
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Metric Type</label>
        <select
          value={metricType}
          onChange={(e) => setMetricType(e.target.value as MetricType)}
          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {METRIC_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {metricType === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Custom Label</label>
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Metric name"
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Value ({selectedMetric.unit === 'currency' ? '$' : selectedMetric.unit === 'percentage' ? '%' : ''})
        </label>
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Period</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {PERIOD_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
      >
        {saved ? <Check size={16} /> : <Plus size={16} />}
        {saved ? 'Saved!' : 'Add Metric'}
      </button>
    </form>
  );
}

function parsePeriodToDate(period: string): Date {
  const [yearStr, rest] = period.split('-');
  const year = parseInt(yearStr);
  if (rest === 'FY') return new Date(year, 11, 31);
  const quarter = parseInt(rest.replace('Q', ''));
  return new Date(year, quarter * 3 - 1, 28);
}
