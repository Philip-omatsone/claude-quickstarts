import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { db } from '../db/database';
import type { HeadlineCategory, Headline } from '../types';

const CATEGORIES: HeadlineCategory[] = ['earnings', 'regulatory', 'market', 'risk', 'general'];

const categoryColors: Record<HeadlineCategory, string> = {
  earnings: 'bg-blue-100 text-blue-700',
  regulatory: 'bg-purple-100 text-purple-700',
  market: 'bg-green-100 text-green-700',
  risk: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-700',
};

interface HeadlineForm {
  title: string;
  source: string;
  url: string;
  category: HeadlineCategory;
  date: string;
}

const emptyForm: HeadlineForm = {
  title: '',
  source: '',
  url: '',
  category: 'general',
  date: new Date().toISOString().split('T')[0],
};

export default function HeadlinesPage() {
  const headlines = useLiveQuery(() => db.headlines.orderBy('date').reverse().toArray(), []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HeadlineForm>(emptyForm);

  function startEdit(h: Headline) {
    setEditingId(h.id);
    setForm({
      title: h.title,
      source: h.source,
      url: h.url ?? '',
      category: h.category,
      date: new Date(h.date).toISOString().split('T')[0],
    });
    setShowForm(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.source) return;

    if (editingId) {
      await db.headlines.update(editingId, {
        title: form.title,
        source: form.source,
        url: form.url || undefined,
        category: form.category,
        date: new Date(form.date),
      });
    } else {
      await db.headlines.add({
        id: uuid(),
        title: form.title,
        source: form.source,
        url: form.url || undefined,
        category: form.category,
        date: new Date(form.date),
        createdAt: new Date(),
      });
    }

    resetForm();
  }

  async function handleDelete(id: string) {
    await db.headlines.delete(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Headlines</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <Plus size={16} />
            Add Headline
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-primary">
              {editingId ? 'Edit Headline' : 'New Headline'}
            </h3>
            <button type="button" onClick={resetForm} className="text-text-secondary hover:text-text-primary">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Source</label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="e.g., Financial Times"
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">URL (optional)</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..."
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as HeadlineCategory })}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <Check size={16} />
            {editingId ? 'Update' : 'Add'} Headline
          </button>
        </form>
      )}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {!headlines || headlines.length === 0 ? (
          <div className="p-8 text-center text-text-secondary text-sm">No headlines yet</div>
        ) : (
          <div className="divide-y divide-border">
            {headlines.map((h) => (
              <div key={h.id} className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[h.category]}`}
                    >
                      {h.category}
                    </span>
                    <span className="text-xs text-text-secondary">{h.source}</span>
                    <span className="text-xs text-text-secondary">
                      {new Date(h.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary">{h.title}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(h)}
                    className="p-1.5 text-text-secondary hover:text-primary hover:bg-gray-100 rounded"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
