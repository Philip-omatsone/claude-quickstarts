import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { db } from '../../db/database';
import { parseCsv, type CsvRow } from '../../utils/csv-parser';
import type { MetricType, MetricUnit } from '../../types';

const METRIC_MAP: Record<string, { type: MetricType; unit: MetricUnit }> = {
  revenue: { type: 'revenue', unit: 'currency' },
  net_income: { type: 'net_income', unit: 'currency' },
  'net income': { type: 'net_income', unit: 'currency' },
  operating_income: { type: 'operating_income', unit: 'currency' },
  'operating income': { type: 'operating_income', unit: 'currency' },
  bad_debt_ratio: { type: 'bad_debt_ratio', unit: 'percentage' },
  'bad debt ratio': { type: 'bad_debt_ratio', unit: 'percentage' },
  provision_coverage: { type: 'provision_coverage', unit: 'percentage' },
  'provision coverage': { type: 'provision_coverage', unit: 'percentage' },
  npl_ratio: { type: 'npl_ratio', unit: 'percentage' },
  'npl ratio': { type: 'npl_ratio', unit: 'percentage' },
  total_assets: { type: 'total_assets', unit: 'currency' },
  'total assets': { type: 'total_assets', unit: 'currency' },
};

export default function CsvUploader() {
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const [preview, setPreview] = useState<CsvRow[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [imported, setImported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setImported(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { headers: h, rows } = parseCsv(text);
      if (rows.length === 0) {
        setError('Could not parse CSV. Ensure columns include: originator, metric, value, period.');
        setPreview(null);
        return;
      }
      setHeaders(h);
      setPreview(rows);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!preview) return;

    const originatorMap = new Map(originators?.map((o) => [o.name.toLowerCase(), o.id]) ?? []);
    const now = new Date();

    for (const row of preview) {
      let orgId = originatorMap.get(row.originator.toLowerCase());
      if (!orgId) {
        orgId = uuid();
        await db.originators.add({
          id: orgId,
          name: row.originator,
          sector: 'Unknown',
          createdAt: now,
        });
        originatorMap.set(row.originator.toLowerCase(), orgId);
      }

      const metricInfo = METRIC_MAP[row.metric.toLowerCase()] ?? { type: 'custom' as MetricType, unit: 'number' as MetricUnit };

      await db.metrics.add({
        id: uuid(),
        originatorId: orgId,
        metricType: metricInfo.type,
        label: row.metric,
        value: row.value,
        period: row.period,
        date: row.period ? parsePeriodToDate(row.period) : now,
        unit: metricInfo.unit,
        source: 'csv',
        createdAt: now,
      });
    }

    setImported(true);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <Upload size={32} className="mx-auto text-text-secondary mb-2" />
        <p className="text-sm text-text-secondary mb-3">
          Upload a CSV file with columns: originator, metric, value, period
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="text-sm"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {imported && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          <Check size={16} />
          Data imported successfully!
        </div>
      )}

      {preview && (
        <div>
          <h4 className="text-sm font-medium mb-2">Preview ({preview.length} rows)</h4>
          <div className="border border-border rounded-md overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  {headers.map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium text-text-secondary capitalize">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-3 py-2">{row.originator}</td>
                    <td className="px-3 py-2">{row.metric}</td>
                    <td className="px-3 py-2">{row.value}</td>
                    <td className="px-3 py-2">{row.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.length > 20 && (
            <p className="text-xs text-text-secondary mt-1">Showing first 20 of {preview.length} rows</p>
          )}
          <button
            onClick={handleImport}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            Import {preview.length} rows
          </button>
        </div>
      )}
    </div>
  );
}

function parsePeriodToDate(period: string): Date {
  const [yearStr, rest] = period.split('-');
  const year = parseInt(yearStr);
  if (isNaN(year)) return new Date();
  if (!rest) return new Date(year, 11, 31);
  if (rest === 'FY') return new Date(year, 11, 31);
  const quarter = parseInt(rest.replace('Q', ''));
  if (isNaN(quarter)) return new Date(year, 11, 31);
  return new Date(year, quarter * 3 - 1, 28);
}
