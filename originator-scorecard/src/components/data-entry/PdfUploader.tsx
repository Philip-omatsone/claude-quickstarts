import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '../../db/database';
import { extractTextFromPdf, extractMetricsFromText } from '../../utils/pdf-extractor';
import type { MetricType, MetricUnit } from '../../types';

const UNIT_MAP: Record<string, MetricUnit> = {
  revenue: 'currency',
  net_income: 'currency',
  operating_income: 'currency',
  total_assets: 'currency',
  bad_debt_ratio: 'percentage',
  provision_coverage: 'percentage',
  npl_ratio: 'percentage',
};

export default function PdfUploader() {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const [extractedText, setExtractedText] = useState('');
  const [extractedMetrics, setExtractedMetrics] = useState<{ label: string; value: number; type: string; selected: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imported, setImported] = useState(false);
  const [originatorId, setOriginatorId] = useState('');
  const [period, setPeriod] = useState(`${new Date().getFullYear()}-FY`);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setImported(false);
    setLoading(true);

    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      const metrics = extractMetricsFromText(text);
      setExtractedMetrics(metrics.map((m) => ({ ...m, selected: true })));
      if (metrics.length === 0) {
        setError('No financial metrics could be automatically extracted. You can review the text below.');
      }
    } catch {
      setError('Failed to parse PDF. Ensure the file is a valid PDF document.');
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    if (!originatorId) {
      setError('Please select an originator');
      return;
    }

    const selected = extractedMetrics.filter((m) => m.selected);
    if (selected.length === 0) return;

    const now = new Date();
    const periodDate = parsePeriodToDate(period);

    for (const metric of selected) {
      await db.metrics.add({
        id: uuid(),
        originatorId,
        metricType: (metric.type as MetricType) || 'custom',
        label: metric.label,
        value: metric.value,
        period,
        date: periodDate,
        unit: UNIT_MAP[metric.type] ?? 'number',
        source: 'pdf',
        createdAt: now,
      });
    }

    setImported(true);
    setExtractedMetrics([]);
    setExtractedText('');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <FileText size={32} className="mx-auto text-text-secondary mb-2" />
        <p className="text-sm text-text-secondary mb-3">
          Upload a PDF annual report to extract financial metrics
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          onChange={handleFile}
          className="text-sm"
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 p-3 text-text-secondary text-sm">
          <Loader2 size={16} className="animate-spin" />
          Extracting text from PDF...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {imported && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          <Check size={16} />
          Metrics imported successfully!
        </div>
      )}

      {extractedMetrics.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Extracted Metrics</h4>
          <div className="flex gap-3">
            <select
              value={originatorId}
              onChange={(e) => setOriginatorId(e.target.value)}
              className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select originator...</option>
              {originators?.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Period (e.g., 2025-FY)"
              className="w-32 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="border border-border rounded-md overflow-hidden">
            {extractedMetrics.map((m, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 border-b border-border last:border-0">
                <input
                  type="checkbox"
                  checked={m.selected}
                  onChange={() => {
                    const updated = [...extractedMetrics];
                    updated[i] = { ...updated[i], selected: !updated[i].selected };
                    setExtractedMetrics(updated);
                  }}
                  className="shrink-0"
                />
                <span className="text-sm flex-1">{m.label}</span>
                <span className="text-sm font-medium">{m.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            Import Selected
          </button>
        </div>
      )}

      {extractedText && (
        <div>
          <h4 className="text-sm font-medium mb-2">Extracted Text</h4>
          <textarea
            readOnly
            value={extractedText}
            className="w-full h-48 border border-border rounded-md p-3 text-xs font-mono bg-gray-50 resize-y"
          />
        </div>
      )}
    </div>
  );
}

function parsePeriodToDate(period: string): Date {
  const [yearStr, rest] = period.split('-');
  const year = parseInt(yearStr);
  if (isNaN(year)) return new Date();
  if (!rest || rest === 'FY') return new Date(year, 11, 31);
  const quarter = parseInt(rest.replace('Q', ''));
  if (isNaN(quarter)) return new Date(year, 11, 31);
  return new Date(year, quarter * 3 - 1, 28);
}
