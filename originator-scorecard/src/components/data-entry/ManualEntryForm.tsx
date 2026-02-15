import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { Plus, Check } from 'lucide-react';
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
  { value: 'live_contracts', label: 'Live Contracts', unit: 'number' },
  { value: 'weighted_avg_term', label: 'Wtd Avg Remaining Term', unit: 'months' },
  { value: 'dpd_30', label: '30+ DPD Arrears', unit: 'percentage' },
  { value: 'dpd_60', label: '60+ DPD Arrears', unit: 'percentage' },
  { value: 'dpd_90', label: '90+ DPD Arrears', unit: 'percentage' },
  { value: 'write_off_rate', label: 'Write-off Rate', unit: 'percentage' },
  { value: 'recovery_rate', label: 'Recovery Rate', unit: 'percentage' },
  { value: 'new_advance_volume', label: 'New Advance Volume', unit: 'currency' },
  { value: 'avg_deal_size', label: 'Average Deal Size', unit: 'currency' },
  { value: 'approval_rate', label: 'Approval Rate', unit: 'percentage' },
  { value: 'weighted_avg_yield', label: 'Wtd Avg Yield', unit: 'percentage' },
  { value: 'cost_to_income', label: 'Cost-to-Income', unit: 'percentage' },
  { value: 'return_on_assets', label: 'Return on Assets', unit: 'percentage' },
  { value: 'total_assets', label: 'Total Assets', unit: 'currency' },
  { value: 'hp_split', label: 'HP Split', unit: 'percentage' },
  { value: 'finance_lease_split', label: 'Finance Lease Split', unit: 'percentage' },
  { value: 'operating_lease_split', label: 'Operating Lease Split', unit: 'percentage' },
  { value: 'avg_contract_term', label: 'Avg Contract Term', unit: 'months' },
  { value: 'custom', label: 'Custom', unit: 'number' },
];

const PERIOD_OPTIONS = getPeriodOptions();

// Validation thresholds
const VALIDATION: Partial<Record<MetricType, { min: number; max: number; label: string }>> = {
  bad_debt_ratio: { min: 0, max: 20, label: 'Bad Debt Ratio' },
  npl_ratio: { min: 0, max: 30, label: 'NPL Ratio' },
  provision_coverage: { min: 0, max: 300, label: 'Provision Coverage' },
  warehouse_utilisation: { min: 0, max: 100, label: 'Warehouse Utilisation' },
  approval_rate: { min: 0, max: 100, label: 'Approval Rate' },
  cost_to_income: { min: 0, max: 200, label: 'Cost-to-Income' },
  return_on_assets: { min: -10, max: 20, label: 'Return on Assets' },
};

export default function ManualEntryForm() {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const [originatorId, setOriginatorId] = useState('');
  const [newOriginatorName, setNewOriginatorName] = useState('');
  const [newOriginatorSector, setNewOriginatorSector] = useState('');
  const [showNewOriginator, setShowNewOriginator] = useState(false);
  const [metricType, setMetricType] = useState<MetricType>('revenue');
  const [customLabel, setCustomLabel] = useState('');
  const [value, setValue] = useState('');
  const [period, setPeriod] = useState(getCurrentPeriod());
  const [saved, setSaved] = useState(false);
  const [warning, setWarning] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const selectedMetric = METRIC_OPTIONS.find((m) => m.value === metricType)!;

  function validateValue(val: string, type: MetricType): string {
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    const check = VALIDATION[type];
    if (!check) return '';
    if (num < check.min || num > check.max) {
      return `${check.label} of ${num} seems unusual (expected ${check.min}-${check.max}). Please verify.`;
    }
    return '';
  }

  function handleValueChange(val: string) {
    setValue(val);
    setWarning(validateValue(val, metricType));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (showPreview) {
      // Actually save
      let finalOriginatorId = originatorId;
      if (showNewOriginator && newOriginatorName.trim()) {
        finalOriginatorId = uuid();
        await db.originators.add({ id: finalOriginatorId, name: newOriginatorName.trim(), sector: newOriginatorSector.trim() || 'Unknown', createdAt: new Date() });
        setShowNewOriginator(false);
        setNewOriginatorName('');
        setNewOriginatorSector('');
      }
      if (!finalOriginatorId || !value) return;
      await db.metrics.add({
        id: uuid(), originatorId: finalOriginatorId, metricType,
        label: metricType === 'custom' ? customLabel || 'Custom Metric' : selectedMetric.label,
        value: parseFloat(value), period, date: parsePeriodToDate(period),
        unit: selectedMetric.unit, source: 'manual', createdAt: new Date(),
      });
      setValue('');
      setShowPreview(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setShowPreview(true);
    }
  }

  const unitLabel = selectedMetric.unit === 'currency' ? '\u00a3' : selectedMetric.unit === 'percentage' ? '%' : selectedMetric.unit === 'months' ? 'months' : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-xs font-medium text-text-primary mb-1">Originator</label>
        {showNewOriginator ? (
          <div className="space-y-2">
            <input type="text" placeholder="Company name" value={newOriginatorName} onChange={(e) => setNewOriginatorName(e.target.value)} className="w-full border border-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30" required />
            <input type="text" placeholder="Sector (e.g., Asset Finance)" value={newOriginatorSector} onChange={(e) => setNewOriginatorSector(e.target.value)} className="w-full border border-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <button type="button" onClick={() => setShowNewOriginator(false)} className="text-[10px] text-accent hover:underline">Select existing instead</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <select value={originatorId} onChange={(e) => setOriginatorId(e.target.value)} className="flex-1 border border-border rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-accent/30" required={!showNewOriginator}>
              <option value="">Select originator...</option>
              {originators?.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <button type="button" onClick={() => setShowNewOriginator(true)} className="flex items-center gap-1 px-2 py-1.5 border border-border rounded-md text-xs hover:bg-gray-50"><Plus size={12} /> New</button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-text-primary mb-1">Metric Type</label>
        <select value={metricType} onChange={(e) => { setMetricType(e.target.value as MetricType); setWarning(''); }} className="w-full border border-border rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
          {METRIC_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      {metricType === 'custom' && (
        <div>
          <label className="block text-xs font-medium text-text-primary mb-1">Custom Label</label>
          <input type="text" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} placeholder="Metric name" className="w-full border border-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30" />
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-text-primary mb-1">Value ({unitLabel})</label>
        <input type="number" step="any" value={value} onChange={(e) => handleValueChange(e.target.value)} placeholder="Enter value" className="w-full border border-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30" required />
        {warning && <p className="text-[10px] text-rag-amber mt-1">{warning}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-text-primary mb-1">Period</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full border border-border rounded-md px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
          {PERIOD_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {showPreview && (
        <div className="bg-gray-50 rounded-md p-3 text-xs space-y-1 border border-border">
          <p className="font-medium text-text-primary">Preview:</p>
          <p>Originator: {showNewOriginator ? newOriginatorName : originators?.find((o) => o.id === originatorId)?.name}</p>
          <p>Metric: {metricType === 'custom' ? customLabel : selectedMetric.label}</p>
          <p>Value: {unitLabel === '\u00a3' ? `\u00a3${parseFloat(value || '0').toLocaleString()}` : `${value}${unitLabel === '%' ? '%' : ''}`}</p>
          <p>Period: {period}</p>
          <button type="button" onClick={() => setShowPreview(false)} className="text-[10px] text-accent hover:underline mt-1">Edit</button>
        </div>
      )}

      <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-accent-hover transition-colors">
        {saved ? <Check size={14} /> : <Plus size={14} />}
        {saved ? 'Saved!' : showPreview ? 'Confirm & Save' : 'Preview'}
      </button>
    </form>
  );
}
