import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Download, ChevronUp, ChevronDown, ChevronsUpDown, Search, Pencil, Check, X } from 'lucide-react';
import { db } from '../db/database';
import { formatValue, getPeriodOptions } from '../utils/format';
import type { MetricType, MetricSource, SortConfig } from '../types';

type GroupBy = 'none' | 'originator' | 'metric';

export default function MetricsPage() {
  const [filterType, setFilterType] = useState<MetricType | ''>('');
  const [filterSource, setFilterSource] = useState<MetricSource | ''>('');
  const [filterOriginator, setFilterOriginator] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const metrics = useLiveQuery(() => db.metrics.orderBy('date').reverse().toArray(), []);
  const periodOptions = getPeriodOptions();

  const originatorMap = new Map(originators?.map((o) => [o.id, o.name]) ?? []);

  // Deduplicate by originatorId+metricType+period (keep latest)
  const deduped = useMemo(() => {
    const seen = new Map<string, typeof metrics extends (infer T)[] | undefined ? T : never>();
    for (const m of metrics ?? []) {
      const key = `${m.originatorId}|${m.metricType}|${m.period}`;
      const existing = seen.get(key);
      if (!existing || new Date(m.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        seen.set(key, m);
      }
    }
    return Array.from(seen.values());
  }, [metrics]);

  // Compute QoQ map
  const qoqMap = useMemo(() => {
    const map = new Map<string, number | null>();
    const byOrgMetric = new Map<string, { period: string; value: number }[]>();
    for (const m of deduped) {
      const key = `${m.originatorId}|${m.metricType}`;
      if (!byOrgMetric.has(key)) byOrgMetric.set(key, []);
      byOrgMetric.get(key)!.push({ period: m.period, value: m.value });
    }
    for (const [key, entries] of byOrgMetric) {
      entries.sort((a, b) => a.period.localeCompare(b.period));
      for (let i = 0; i < entries.length; i++) {
        const prev = i > 0 ? entries[i - 1].value : null;
        const qoq = prev !== null && prev !== 0 ? ((entries[i].value - prev) / Math.abs(prev)) * 100 : null;
        map.set(`${key}|${entries[i].period}`, qoq);
      }
    }
    return map;
  }, [deduped]);

  const filtered = deduped.filter((m) => {
    if (filterType && m.metricType !== filterType) return false;
    if (filterSource && m.source !== filterSource) return false;
    if (filterOriginator && m.originatorId !== filterOriginator) return false;
    if (filterPeriod && m.period !== filterPeriod) return false;
    if (search) {
      const lower = search.toLowerCase();
      const orgName = originatorMap.get(m.originatorId) ?? '';
      if (!orgName.toLowerCase().includes(lower) && !m.label.toLowerCase().includes(lower) && !m.period.toLowerCase().includes(lower)) return false;
    }
    return true;
  });

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    return [...filtered].sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      if (sort.key === 'originator') { aVal = originatorMap.get(a.originatorId) ?? ''; bVal = originatorMap.get(b.originatorId) ?? ''; }
      else if (sort.key === 'value') { aVal = a.value; bVal = b.value; }
      else if (sort.key === 'period') { aVal = a.period; bVal = b.period; }
      else if (sort.key === 'metric') { aVal = a.label; bVal = b.label; }
      else { aVal = String((a as unknown as Record<string, unknown>)[sort.key] ?? ''); bVal = String((b as unknown as Record<string, unknown>)[sort.key] ?? ''); }
      if (aVal === bVal) return 0;
      const cmp = aVal < bVal ? -1 : 1;
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort, originatorMap]);

  function toggleSort(key: string) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  }

  async function saveEdit(id: string) {
    const val = parseFloat(editValue);
    if (!isNaN(val)) { await db.metrics.update(id, { value: val }); }
    setEditingId(null);
  }

  function exportCsv() {
    const header = 'Originator,Metric,Value,Unit,Period,Source,Date,QoQ Change\n';
    const rows = sorted.map((m) => {
      const qoq = qoqMap.get(`${m.originatorId}|${m.metricType}|${m.period}`);
      return `"${originatorMap.get(m.originatorId) ?? ''}","${m.label}",${m.value},"${m.unit}","${m.period}","${m.source}","${new Date(m.date).toLocaleDateString('en-GB')}","${qoq != null ? qoq.toFixed(1) + '%' : ''}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'metrics-export.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  // Grouping
  const groups = useMemo(() => {
    if (groupBy === 'none') return [{ label: '', items: sorted }];
    const map = new Map<string, typeof sorted>();
    for (const m of sorted) {
      const key = groupBy === 'originator' ? (originatorMap.get(m.originatorId) ?? 'Unknown') : m.label;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
  }, [sorted, groupBy, originatorMap]);

  const SortIcon = ({ col }: { col: string }) => sort?.key === col ? (sort.direction === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : <ChevronsUpDown size={13} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Metrics</h2>
        <button onClick={exportCsv} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-accent-hover transition-colors" style={{ fontFamily: 'var(--font-family-body)' }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-3 border-b border-border flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-border rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <select value={filterOriginator} onChange={(e) => setFilterOriginator(e.target.value)} className="border border-border rounded-md px-2 py-1.5 text-xs bg-white">
            <option value="">All Originators</option>
            {originators?.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as MetricType | '')} className="border border-border rounded-md px-2 py-1.5 text-xs bg-white">
            <option value="">All Types</option>
            <option value="revenue">Revenue</option><option value="net_income">Net Income</option><option value="operating_income">Operating Income</option>
            <option value="bad_debt_ratio">Bad Debt Ratio</option><option value="provision_coverage">Provision Coverage</option><option value="npl_ratio">NPL Ratio</option>
            <option value="total_aum">Total AuM</option><option value="warehouse_utilisation">Warehouse Util.</option><option value="new_advance_volume">New Advances</option>
          </select>
          <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} className="border border-border rounded-md px-2 py-1.5 text-xs bg-white">
            <option value="">All Periods</option>
            {periodOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value as MetricSource | '')} className="border border-border rounded-md px-2 py-1.5 text-xs bg-white">
            <option value="">All Sources</option><option value="manual">Manual</option><option value="csv">CSV</option><option value="pdf">PDF</option>
          </select>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)} className="border border-border rounded-md px-2 py-1.5 text-xs bg-white">
            <option value="none">No Grouping</option><option value="originator">Group by Originator</option><option value="metric">Group by Metric</option>
          </select>
        </div>

        {groups.map((group) => (
          <div key={group.label || '__all'}>
            {group.label && <div className="px-4 py-2 bg-gray-50 border-b border-border text-xs font-semibold text-text-secondary uppercase tracking-wider">{group.label}</div>}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    {['originator', 'metric', 'value', 'unit', 'period', 'QoQ', 'source', 'date'].map((col) => (
                      <th key={col} className="px-3 py-2 text-left font-medium text-text-secondary cursor-pointer select-none hover:bg-gray-100" onClick={() => toggleSort(col)}>
                        <div className="flex items-center gap-1">{col.charAt(0).toUpperCase() + col.slice(1)} <SortIcon col={col} /></div>
                      </th>
                    ))}
                    <th className="px-3 py-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {group.items.length === 0 ? (
                    <tr><td colSpan={9} className="px-3 py-6 text-center text-text-secondary">No data found</td></tr>
                  ) : group.items.map((m) => {
                    const qoq = qoqMap.get(`${m.originatorId}|${m.metricType}|${m.period}`);
                    const isEditing = editingId === m.id;
                    return (
                      <tr key={m.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2">{originatorMap.get(m.originatorId) ?? 'Unknown'}</td>
                        <td className="px-3 py-2">{m.label}</td>
                        <td className="px-3 py-2">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input type="number" step="any" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-24 border border-border rounded px-1.5 py-0.5 text-xs" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(m.id); if (e.key === 'Escape') setEditingId(null); }} />
                              <button onClick={() => saveEdit(m.id)} className="text-rag-green"><Check size={13} /></button>
                              <button onClick={() => setEditingId(null)} className="text-rag-red"><X size={13} /></button>
                            </div>
                          ) : (
                            <span className="cursor-pointer hover:underline" onClick={() => { setEditingId(m.id); setEditValue(String(m.value)); }}>
                              {formatValue(m.value, m.unit)}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-text-secondary">{m.unit}</td>
                        <td className="px-3 py-2">{m.period}</td>
                        <td className="px-3 py-2">
                          {qoq != null && (
                            <span className={`font-medium ${qoq > 0 ? 'text-rag-green' : qoq < 0 ? 'text-rag-red' : 'text-text-secondary'}`}>
                              {qoq > 0 ? '+' : ''}{qoq.toFixed(1)}%
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2"><span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 capitalize">{m.source}</span></td>
                        <td className="px-3 py-2 text-text-secondary">{new Date(m.date).toLocaleDateString('en-GB')}</td>
                        <td className="px-3 py-2">
                          {!isEditing && <button onClick={() => { setEditingId(m.id); setEditValue(String(m.value)); }} className="p-1 text-text-secondary hover:text-accent rounded"><Pencil size={12} /></button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        <div className="px-3 py-2 text-xs text-text-secondary border-t border-border">{sorted.length} record{sorted.length !== 1 ? 's' : ''}</div>
      </div>
    </div>
  );
}
