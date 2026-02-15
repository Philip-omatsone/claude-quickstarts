import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { Plus, Check, Trash2 } from 'lucide-react';
import { db } from '../../db/database';
import type { MetricType, MetricUnit } from '../../types';
import { getCurrentPeriod, getPeriodOptions, parsePeriodToDate } from '../../utils/format';

const METRIC_OPTIONS: { value: MetricType; label: string; unit: MetricUnit }[] = [
  { value: 'revenue', label: 'Revenue', unit: 'currency' },
  { value: 'net_income', label: 'Net Income', unit: 'currency' },
  { value: 'operating_income', label: 'Operating Income', unit: 'currency' },
  { value: 'bad_debt_ratio', label: 'Bad Debt Ratio', unit: 'percentage' },
  { value: 'provision_coverage', label: 'Provision Coverage', unit: 'percentage' },
  { value: 'npl_ratio', label: 'NPL Ratio', unit: 'percentage' },
  { value: 'total_aum', label: 'Total AuM', unit: 'currency' },
  { value: 'warehouse_utilisation', label: 'Warehouse Utilisation', unit: 'percentage' },
  { value: 'new_advance_volume', label: 'New Advance Volume', unit: 'currency' },
  { value: 'cost_to_income', label: 'Cost-to-Income', unit: 'percentage' },
  { value: 'return_on_assets', label: 'Return on Assets', unit: 'percentage' },
  { value: 'dpd_30', label: '30+ DPD Arrears', unit: 'percentage' },
  { value: 'dpd_60', label: '60+ DPD Arrears', unit: 'percentage' },
  { value: 'dpd_90', label: '90+ DPD Arrears', unit: 'percentage' },
  { value: 'recovery_rate', label: 'Recovery Rate', unit: 'percentage' },
  { value: 'write_off_rate', label: 'Write-off Rate', unit: 'percentage' },
];

interface BulkRow { metricType: MetricType; value: string }

const PERIOD_OPTIONS = getPeriodOptions();

export default function BulkEntryForm() {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const [originatorId, setOriginatorId] = useState('');
  const [period, setPeriod] = useState(getCurrentPeriod());
  const [rows, setRows] = useState<BulkRow[]>(
    METRIC_OPTIONS.slice(0, 8).map((m) => ({ metricType: m.value, value: '' })),
  );
  const [saved, setSaved] = useState(false);

  function addRow() {
    const used = new Set(rows.map((r) => r.metricType));
    const next = METRIC_OPTIONS.find((m) => !used.has(m.value));
    if (next) setRows([...rows, { metricType: next.value, value: '' }]);
  }

  function removeRow(i: number) {
    setRows(rows.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, field: keyof BulkRow, val: string) {
    const updated = [...rows];
    updated[i] = { ...updated[i], [field]: val };
    setRows(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!originatorId) return;

    const toSave = rows.filter((r) => r.value.trim() !== '');
    if (toSave.length === 0) return;

    const now = new Date();
    const date = parsePeriodToDate(period);

    const metrics = toSave.map((r) => {
      const def = METRIC_OPTIONS.find((m) => m.value === r.metricType)!;
      return {
        id: uuid(), originatorId, metricType: r.metricType,
        label: def.label, value: parseFloat(r.value),
        period, date, unit: def.unit,
        source: 'manual' as const, createdAt: now,
      };
    });

    await db.metrics.bulkAdd(metrics);
    setRows(rows.map((r) => ({ ...r, value: '' })));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <p className="text-xs text-text-secondary">Enter multiple metrics for one originator in a single submission.</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-text-primary mb-1">Originator</label>
          <select value={originatorId} onChange={(e) => setOriginatorId(e.target.value)} className="w-full border border-border rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-accent/30" required>
            <option value="">Select originator...</option>
            {originators?.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-primary mb-1">Period</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full border border-border rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
            {PERIOD_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="border border-border rounded-md overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-border">
              <th className="px-3 py-2 text-left font-medium text-text-secondary">Metric</th>
              <th className="px-3 py-2 text-left font-medium text-text-secondary">Value</th>
              <th className="px-3 py-2 w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const def = METRIC_OPTIONS.find((m) => m.value === row.metricType);
              const unit = def?.unit === 'currency' ? '\u00a3' : def?.unit === 'percentage' ? '%' : '';
              return (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-3 py-1.5">
                    <select value={row.metricType} onChange={(e) => updateRow(i, 'metricType', e.target.value)} className="w-full border border-border rounded px-2 py-1 text-xs bg-white">
                      {METRIC_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-1">
                      {unit && <span className="text-text-secondary text-[10px]">{unit}</span>}
                      <input type="number" step="any" value={row.value} onChange={(e) => updateRow(i, 'value', e.target.value)} placeholder="Enter value" className="w-full border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-accent/30" />
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    <button type="button" onClick={() => removeRow(i)} className="p-1 text-text-secondary hover:text-rag-red"><Trash2 size={12} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={addRow} className="flex items-center gap-1 px-2 py-1 border border-border rounded-md text-xs text-text-secondary hover:bg-gray-50">
          <Plus size={12} /> Add Row
        </button>
        <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-accent-hover transition-colors">
          {saved ? <Check size={14} /> : <Plus size={14} />}
          {saved ? 'Saved!' : `Save ${rows.filter((r) => r.value.trim()).length} Metrics`}
        </button>
      </div>
    </form>
  );
}
