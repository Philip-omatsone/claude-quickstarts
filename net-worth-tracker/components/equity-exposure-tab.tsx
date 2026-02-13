"use client";

import { useState, useEffect } from "react";
import { EquityExposureEntry } from "@/lib/types";
import { loadEquityExposure, saveEquityExposure } from "@/lib/storage";
import { formatCurrency, generateId } from "@/lib/utils";
import { Plus, Trash2, BarChart3, AlertTriangle, ExternalLink } from "lucide-react";

interface EquityExposureTabProps {
  onDataChange: () => void;
}

export default function EquityExposureTab({ onDataChange }: EquityExposureTabProps) {
  const [entries, setEntries] = useState<EquityExposureEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(loadEquityExposure());
    setLoaded(true);
  }, []);

  const save = (updated: EquityExposureEntry[]) => {
    saveEquityExposure(updated);
    setEntries(updated);
    onDataChange();
  };

  const addEntry = () => {
    save([
      ...entries,
      {
        id: generateId(),
        name: "",
        provider: "vanguard",
        totalValue: 0,
        equityPercent: 100,
        equityValue: 0,
        lastUpdated: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const removeEntry = (id: string) => {
    save(entries.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, updates: Partial<EquityExposureEntry>) => {
    const updated = entries.map((e) => {
      if (e.id !== id) return e;
      const merged = { ...e, ...updates };
      // Recalculate equity value when total or percent changes
      merged.equityValue = (merged.totalValue * merged.equityPercent) / 100;
      return merged;
    });
    save(updated);
  };

  if (!loaded) return null;

  const totalEquityValue = entries.reduce((s, e) => s + e.equityValue, 0);
  const totalInvestmentValue = entries.reduce((s, e) => s + e.totalValue, 0);
  const avgEquityPercent =
    totalInvestmentValue > 0
      ? (totalEquityValue / totalInvestmentValue) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-indigo-200 ring-1 ring-indigo-100 p-5">
          <div className="text-sm text-slate-500 mb-1">Total Equity Exposure</div>
          <div className="text-2xl font-semibold text-indigo-700">
            {formatCurrency(totalEquityValue)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-1">Total Investment Value</div>
          <div className="text-2xl font-semibold text-slate-900">
            {formatCurrency(totalInvestmentValue)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-1">Avg. Equity Allocation</div>
          <div className="text-2xl font-semibold text-slate-900">
            {avgEquityPercent.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Vanguard Notice */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-800">
          <strong>Vanguard &amp; Equity Tracking:</strong> Vanguard does not offer a public
          API. Enter your total fund value and equity allocation percentage from{" "}
          <a
            href="https://www.vanguardinvestor.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline inline-flex items-center gap-1"
          >
            vanguardinvestor.co.uk
            <ExternalLink className="w-3 h-3" />
          </a>
          . For mixed funds (e.g. LifeStrategy), enter the equity % shown in the fund details.
        </div>
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No equity exposure entries yet</p>
          <button
            onClick={addEntry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Investment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <input
                    type="text"
                    value={entry.name}
                    onChange={(e) =>
                      updateEntry(entry.id, { name: e.target.value })
                    }
                    placeholder="e.g. Vanguard LifeStrategy 80"
                    className="text-lg font-medium text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300"
                  />
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Value */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Total Fund Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      &pound;
                    </span>
                    <input
                      type="number"
                      value={entry.totalValue || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, {
                          totalValue: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      min="0"
                      step="100"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Equity Percent */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Equity Allocation (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={entry.equityPercent || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, {
                          equityPercent: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="100"
                      min="0"
                      max="100"
                      step="1"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      %
                    </span>
                  </div>
                </div>

                {/* Computed Equity Value */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Equity Value (calculated)
                  </label>
                  <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-indigo-700 font-medium">
                    {formatCurrency(entry.equityValue)}
                  </div>
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Provider
                  </label>
                  <select
                    value={entry.provider}
                    onChange={(e) =>
                      updateEntry(entry.id, {
                        provider: e.target.value as "vanguard" | "manual",
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="vanguard">Vanguard</option>
                    <option value="manual">Other / Manual</option>
                  </select>
                </div>

                {/* Last Updated */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Last Updated
                  </label>
                  <input
                    type="date"
                    value={entry.lastUpdated || ""}
                    onChange={(e) =>
                      updateEntry(entry.id, { lastUpdated: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Equity bar */}
              {entry.totalValue > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Equity allocation</span>
                    <span>{entry.equityPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(entry.equityPercent, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addEntry}
            className="inline-flex items-center gap-2 px-4 py-2 text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Investment
          </button>
        </div>
      )}
    </div>
  );
}
