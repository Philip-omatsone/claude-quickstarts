import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { Plus, Pencil, Trash2, X, Check, ExternalLink } from 'lucide-react';
import { db } from '../db/database';
import type { HeadlineCategory, HeadlineImpact, Headline } from '../types';

const CATEGORIES: HeadlineCategory[] = ['earnings', 'regulatory', 'market', 'risk', 'general'];
const IMPACTS: HeadlineImpact[] = ['high', 'medium', 'low'];

const categoryColors: Record<HeadlineCategory, string> = {
  earnings: 'bg-blue-100 text-blue-700',
  regulatory: 'bg-purple-100 text-purple-700',
  market: 'bg-green-100 text-green-700',
  risk: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-700',
};

const impactBadge: Record<HeadlineImpact, string> = {
  high: 'bg-red-50 text-red-600 border border-red-200',
  medium: 'bg-amber-50 text-amber-600 border border-amber-200',
  low: 'bg-gray-50 text-gray-500 border border-gray-200',
};

interface HeadlineForm {
  title: string;
  source: string;
  url: string;
  category: HeadlineCategory;
  impact: HeadlineImpact;
  date: string;
  originatorId: string;
}

const emptyForm: HeadlineForm = {
  title: '', source: '', url: '', category: 'general', impact: 'medium',
  date: new Date().toISOString().split('T')[0], originatorId: '',
};

export default function HeadlinesPage() {
  const allHeadlines = useLiveQuery(() => db.headlines.orderBy('date').reverse().toArray(), []);
  const originators = useLiveQuery(() => db.originators.toArray(), []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HeadlineForm>(emptyForm);
  const [filterCategory, setFilterCategory] = useState<HeadlineCategory | ''>('');
  const [filterImpact, setFilterImpact] = useState<HeadlineImpact | ''>('');
  const [filterOriginator, setFilterOriginator] = useState('');

  const orgMap = new Map(originators?.map((o) => [o.id, o.name]) ?? []);

  // Deduplicate by title
  const headlines = useMemo(() => {
    const seen = new Set<string>();
    return (allHeadlines ?? []).filter((h) => {
      if (seen.has(h.title)) return false;
      seen.add(h.title);
      return true;
    });
  }, [allHeadlines]);

  const filtered = headlines.filter((h) => {
    if (filterCategory && h.category !== filterCategory) return false;
    if (filterImpact && h.impact !== filterImpact) return false;
    if (filterOriginator && h.originatorId !== filterOriginator) return false;
    return true;
  });

  function startEdit(h: Headline) {
    setEditingId(h.id);
    setForm({ title: h.title, source: h.source, url: h.url ?? '', category: h.category, impact: h.impact ?? 'medium', date: new Date(h.date).toISOString().split('T')[0], originatorId: h.originatorId ?? '' });
    setShowForm(true);
  }

  function resetForm() { setForm(emptyForm); setEditingId(null); setShowForm(false); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.source) return;
    if (editingId) {
      await db.headlines.update(editingId, { title: form.title, source: form.source, url: form.url || undefined, category: form.category, impact: form.impact, date: new Date(form.date), originatorId: form.originatorId || undefined });
    } else {
      await db.headlines.add({ id: uuid(), title: form.title, source: form.source, url: form.url || undefined, category: form.category, impact: form.impact, date: new Date(form.date), originatorId: form.originatorId || undefined, createdAt: new Date() });
    }
    resetForm();
  }

  async function handleDelete(id: string) { await db.headlines.delete(id); }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Headlines</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-accent-hover transition-colors" style={{ fontFamily: 'var(--font-family-body)' }}>
            <Plus size={14} /> Add Headline
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as HeadlineCategory | '')} className="border border-border rounded-md px-2 py-1.5 text-xs bg-white">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <select value={filterImpact} onChange={(e) => setFilterImpact(e.target.value as HeadlineImpact | '')} className="border border-border rounded-md px-2 py-1.5 text-xs bg-white">
          <option value="">All Impact</option>
          {IMPACTS.map((i) => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
        </select>
        <select value={filterOriginator} onChange={(e) => setFilterOriginator(e.target.value)} className="border border-border rounded-md px-2 py-1.5 text-xs bg-white">
          <option value="">All Originators</option>
          {originators?.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text-primary" style={{ fontFamily: 'var(--font-family-heading)' }}>{editingId ? 'Edit Headline' : 'New Headline'}</h3>
            <button type="button" onClick={resetForm} className="text-text-secondary hover:text-text-primary"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-text-primary mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30" required />
            </div>
            <div><label className="block text-xs font-medium text-text-primary mb-1">Source</label><input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="e.g., Financial Times" className="w-full border border-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30" required /></div>
            <div><label className="block text-xs font-medium text-text-primary mb-1">URL</label><input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="w-full border border-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/30" /></div>
            <div><label className="block text-xs font-medium text-text-primary mb-1">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as HeadlineCategory })} className="w-full border border-border rounded-md px-3 py-1.5 text-xs bg-white">{CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}</select></div>
            <div><label className="block text-xs font-medium text-text-primary mb-1">Impact</label><select value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value as HeadlineImpact })} className="w-full border border-border rounded-md px-3 py-1.5 text-xs bg-white">{IMPACTS.map((i) => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}</select></div>
            <div><label className="block text-xs font-medium text-text-primary mb-1">Originator</label><select value={form.originatorId} onChange={(e) => setForm({ ...form, originatorId: e.target.value })} className="w-full border border-border rounded-md px-3 py-1.5 text-xs bg-white"><option value="">General</option>{originators?.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
            <div><label className="block text-xs font-medium text-text-primary mb-1">Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-border rounded-md px-3 py-1.5 text-xs" required /></div>
          </div>
          <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-accent-hover transition-colors"><Check size={14} />{editingId ? 'Update' : 'Add'} Headline</button>
        </form>
      )}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-text-secondary text-sm">No headlines found</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((h) => (
              <div key={h.id} className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${categoryColors[h.category]}`}>{h.category}</span>
                    {h.impact && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${impactBadge[h.impact]}`}>{h.impact}</span>}
                    {h.originatorId && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{orgMap.get(h.originatorId)}</span>}
                    <span className="text-[10px] text-text-secondary">{h.source}</span>
                    <span className="text-[10px] text-text-secondary">{new Date(h.date).toLocaleDateString('en-GB')}</span>
                  </div>
                  <p className="text-xs text-text-primary">{h.title}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {h.url && <a href={h.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-secondary hover:text-accent rounded"><ExternalLink size={13} /></a>}
                  <button onClick={() => startEdit(h)} className="p-1.5 text-text-secondary hover:text-accent hover:bg-gray-100 rounded"><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(h.id)} className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-4 py-2 text-xs text-text-secondary border-t border-border">{filtered.length} headline{filtered.length !== 1 ? 's' : ''}</div>
      </div>
    </div>
  );
}
