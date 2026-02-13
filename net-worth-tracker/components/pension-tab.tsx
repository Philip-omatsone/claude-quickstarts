"use client";

import { useState, useEffect } from "react";
import { PensionEntry } from "@/lib/types";
import { loadPensions, savePensions } from "@/lib/storage";
import { formatCurrency, generateId } from "@/lib/utils";
import { Plus, Trash2, Landmark, AlertTriangle, ExternalLink } from "lucide-react";

interface PensionTabProps {
  onDataChange: () => void;
}

const PENSION_PROVIDERS: {
  value: PensionEntry["provider"];
  label: string;
  helpUrl?: string;
  note?: string;
}[] = [
  {
    value: "hsbc",
    label: "HSBC Future Focus",
    helpUrl: "https://www.hsbc.co.uk/pensions/",
    note: "No public API. Enter fund value from the HSBC Future Focus pension portal.",
  },
  {
    value: "legal_and_general",
    label: "Legal & General",
    helpUrl: "https://manage.legalandgeneral.com/",
    note: "No public API. Enter plan value from manage.legalandgeneral.com.",
  },
  {
    value: "british_business_bank",
    label: "British Business Bank",
    helpUrl: "https://www.british-business-bank.co.uk/",
    note: "No public API. Enter value from the British Business Bank pension portal.",
  },
  {
    value: "manual",
    label: "Other / Manual",
    note: "Enter values manually for any other pension provider.",
  },
];

export default function PensionTab({ onDataChange }: PensionTabProps) {
  const [pensions, setPensions] = useState<PensionEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPensions(loadPensions());
    setLoaded(true);
  }, []);

  const save = (updated: PensionEntry[]) => {
    savePensions(updated);
    setPensions(updated);
    onDataChange();
  };

  const addPension = (provider: PensionEntry["provider"] = "manual") => {
    const providerInfo = PENSION_PROVIDERS.find((p) => p.value === provider);
    save([
      ...pensions,
      {
        id: generateId(),
        name: provider === "manual" ? "" : providerInfo?.label || "",
        provider,
        currentValue: 0,
        lastUpdated: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const removePension = (id: string) => {
    save(pensions.filter((p) => p.id !== id));
  };

  const updatePension = (id: string, updates: Partial<PensionEntry>) => {
    save(pensions.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  if (!loaded) return null;

  const totalPensions = pensions.reduce((s, p) => s + p.currentValue, 0);
  const totalContributions = pensions.reduce(
    (s, p) => s + (p.contributions || 0) + (p.employerContributions || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-purple-200 ring-1 ring-purple-100 p-5">
          <div className="text-sm text-slate-500 mb-1">Total Pension Value</div>
          <div className="text-2xl font-semibold text-purple-700">
            {formatCurrency(totalPensions)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-1">Monthly Contributions</div>
          <div className="text-2xl font-semibold text-slate-900">
            {formatCurrency(totalContributions)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Personal + employer
          </div>
        </div>
      </div>

      {/* API Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-purple-800">
          <strong>Pension APIs:</strong> HSBC Future Focus, Legal &amp; General, and British
          Business Bank do not offer public APIs for pension data. Enter your fund values
          manually from each provider&apos;s portal. Update monthly for accurate tracking.
        </div>
      </div>

      {/* Pension Entries */}
      {pensions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Landmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No pensions added yet</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {PENSION_PROVIDERS.map((pp) => (
              <button
                key={pp.value}
                onClick={() => addPension(pp.value)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 text-sm font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                {pp.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {pensions.map((pension) => {
            const providerInfo = PENSION_PROVIDERS.find(
              (p) => p.value === pension.provider,
            );
            return (
              <div
                key={pension.id}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Landmark className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={pension.name}
                        onChange={(e) =>
                          updatePension(pension.id, { name: e.target.value })
                        }
                        placeholder="Pension name"
                        className="text-lg font-medium text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300"
                      />
                      <div className="text-xs text-slate-400">
                        {providerInfo?.label || "Manual"}
                        {providerInfo?.helpUrl && (
                          <>
                            {" "}
                            &middot;{" "}
                            <a
                              href={providerInfo.helpUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-500 hover:text-purple-600 inline-flex items-center gap-0.5"
                            >
                              Portal
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removePension(pension.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {providerInfo?.note && (
                  <div className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 mb-4">
                    {providerInfo.note}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Value */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Current Fund Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        &pound;
                      </span>
                      <input
                        type="number"
                        value={pension.currentValue || ""}
                        onChange={(e) =>
                          updatePension(pension.id, {
                            currentValue: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        min="0"
                        step="100"
                        className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Fund Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Fund Name
                    </label>
                    <input
                      type="text"
                      value={pension.fundName || ""}
                      onChange={(e) =>
                        updatePension(pension.id, { fundName: e.target.value })
                      }
                      placeholder="e.g. Global Equity Fund"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Personal Contributions */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Your Monthly Contribution
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        &pound;
                      </span>
                      <input
                        type="number"
                        value={pension.contributions || ""}
                        onChange={(e) =>
                          updatePension(pension.id, {
                            contributions: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        min="0"
                        step="10"
                        className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Employer Contributions */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Employer Monthly Contribution
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        &pound;
                      </span>
                      <input
                        type="number"
                        value={pension.employerContributions || ""}
                        onChange={(e) =>
                          updatePension(pension.id, {
                            employerContributions: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        min="0"
                        step="10"
                        className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Provider Select */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Provider
                    </label>
                    <select
                      value={pension.provider}
                      onChange={(e) =>
                        updatePension(pension.id, {
                          provider: e.target.value as PensionEntry["provider"],
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      {PENSION_PROVIDERS.map((pp) => (
                        <option key={pp.value} value={pp.value}>
                          {pp.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Last Updated */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Last Updated
                    </label>
                    <input
                      type="date"
                      value={pension.lastUpdated || ""}
                      onChange={(e) =>
                        updatePension(pension.id, {
                          lastUpdated: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Pension buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {PENSION_PROVIDERS.map((pp) => (
              <button
                key={pp.value}
                onClick={() => addPension(pp.value)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100"
              >
                <Plus className="w-3.5 h-3.5" />
                {pp.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
