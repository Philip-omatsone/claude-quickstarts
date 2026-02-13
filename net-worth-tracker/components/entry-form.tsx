"use client";

import { useState, useEffect } from "react";
import { MonthlySnapshot, LineItem, Category } from "@/lib/types";
import {
  ASSET_CATEGORIES,
  LIABILITY_CATEGORIES,
  getCategoryInfo,
  generateId,
  getCurrentMonth,
  formatCurrency,
} from "@/lib/utils";
import { X, Plus, Trash2 } from "lucide-react";

interface EntryFormProps {
  snapshots: MonthlySnapshot[];
  editingMonth: string | null;
  onSave: (snapshot: MonthlySnapshot) => void;
  onClose: () => void;
}

function CategorySection({
  category,
  label,
  color,
  items,
  onAdd,
  onRemove,
  onUpdate,
}: {
  category: Category;
  label: string;
  color: string;
  items: LineItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof LineItem, value: string | number) => void;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium text-slate-700">{label}</span>
          {subtotal > 0 && (
            <span className="text-xs text-slate-400">
              {formatCurrency(subtotal)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => onUpdate(item.id, "name", e.target.value)}
                placeholder={`e.g. ${getPlaceholder(category)}`}
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  &pound;
                </span>
                <input
                  type="number"
                  value={item.amount || ""}
                  onChange={(e) =>
                    onUpdate(
                      item.id,
                      "amount",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder="0"
                  min="0"
                  step="any"
                  className="w-32 pl-7 pr-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-right"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="p-1 text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getPlaceholder(category: Category): string {
  const placeholders: Record<string, string> = {
    cash: "Barclays Current",
    isa: "Vanguard S&S ISA",
    pension: "Workplace Pension",
    investment: "Trading 212 GIA",
    property: "Home",
    other_asset: "Valuables",
    mortgage: "Home Mortgage",
    debt: "Student Loan",
    other_liability: "Car Finance",
  };
  return placeholders[category] || "Name";
}

export default function EntryForm({
  snapshots,
  editingMonth,
  onSave,
  onClose,
}: EntryFormProps) {
  const [month, setMonth] = useState(editingMonth || getCurrentMonth());
  const [items, setItems] = useState<LineItem[]>([]);

  useEffect(() => {
    if (editingMonth) {
      const existing = snapshots.find((s) => s.month === editingMonth);
      if (existing) {
        setItems(existing.items.map((item) => ({ ...item })));
        return;
      }
    }

    // Pre-fill from most recent snapshot so users only need to update amounts
    const sorted = [...snapshots].sort((a, b) =>
      a.month.localeCompare(b.month),
    );
    const latest = sorted[sorted.length - 1];
    if (latest) {
      setItems(
        latest.items.map((item) => ({
          ...item,
          id: generateId(),
        })),
      );
    }
  }, [editingMonth, snapshots]);

  const addItem = (category: Category) => {
    const info = getCategoryInfo(category);
    setItems((prev) => [
      ...prev,
      {
        id: generateId(),
        name: "",
        category,
        type: info.type,
        amount: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter(
      (item) => item.name.trim() && item.amount > 0,
    );
    onSave({
      id: editingMonth || generateId(),
      month,
      items: validItems,
    });
  };

  const getItemsForCategory = (category: Category) =>
    items.filter((item) => item.category === category);

  const assetTotal = items
    .filter((i) => i.type === "asset")
    .reduce((s, i) => s + i.amount, 0);
  const liabilityTotal = items
    .filter((i) => i.type === "liability")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative min-h-full flex items-start justify-center p-4 pt-12">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingMonth ? "Edit Snapshot" : "New Monthly Snapshot"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Month picker */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Month
                </label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  disabled={!!editingMonth}
                  className="w-48 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* Assets */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                    Assets
                  </h3>
                  {assetTotal > 0 && (
                    <span className="text-sm font-medium text-emerald-600">
                      {formatCurrency(assetTotal)}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {ASSET_CATEGORIES.map((cat) => (
                    <CategorySection
                      key={cat.key}
                      category={cat.key}
                      label={cat.label}
                      color={cat.color}
                      items={getItemsForCategory(cat.key)}
                      onAdd={() => addItem(cat.key)}
                      onRemove={removeItem}
                      onUpdate={updateItem}
                    />
                  ))}
                </div>
              </div>

              {/* Liabilities */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                    Liabilities
                  </h3>
                  {liabilityTotal > 0 && (
                    <span className="text-sm font-medium text-red-500">
                      {formatCurrency(liabilityTotal)}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {LIABILITY_CATEGORIES.map((cat) => (
                    <CategorySection
                      key={cat.key}
                      category={cat.key}
                      label={cat.label}
                      color={cat.color}
                      items={getItemsForCategory(cat.key)}
                      onAdd={() => addItem(cat.key)}
                      onRemove={removeItem}
                      onUpdate={updateItem}
                    />
                  ))}
                </div>
              </div>

              {/* Running totals */}
              <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Net Worth
                </span>
                <span
                  className={`text-lg font-semibold ${assetTotal - liabilityTotal >= 0 ? "text-blue-600" : "text-red-500"}`}
                >
                  {formatCurrency(assetTotal - liabilityTotal)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Snapshot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
