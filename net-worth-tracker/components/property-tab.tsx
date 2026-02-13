"use client";

import { useState, useEffect } from "react";
import { PropertyData } from "@/lib/types";
import { loadProperties, saveProperties } from "@/lib/storage";
import { formatCurrency, generateId } from "@/lib/utils";
import { Plus, Trash2, Home, AlertTriangle, ExternalLink } from "lucide-react";

interface PropertyTabProps {
  onDataChange: () => void;
}

export default function PropertyTab({ onDataChange }: PropertyTabProps) {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProperties(loadProperties());
    setLoaded(true);
  }, []);

  const save = (updated: PropertyData[]) => {
    saveProperties(updated);
    setProperties(updated);
    onDataChange();
  };

  const addProperty = () => {
    save([
      ...properties,
      {
        id: generateId(),
        name: "",
        estimatedValue: 0,
        mortgageBalance: 0,
        interestRate: 0,
        valuationSource: "manual",
      },
    ]);
  };

  const removeProperty = (id: string) => {
    save(properties.filter((p) => p.id !== id));
  };

  const updateProperty = (id: string, updates: Partial<PropertyData>) => {
    const updated = properties.map((p) =>
      p.id === id ? { ...p, ...updates } : p,
    );
    save(updated);
  };

  if (!loaded) return null;

  const totalValue = properties.reduce((s, p) => s + p.estimatedValue, 0);
  const totalMortgage = properties.reduce((s, p) => s + p.mortgageBalance, 0);
  const totalEquity = totalValue - totalMortgage;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-1">Property Value</div>
          <div className="text-2xl font-semibold text-slate-900">
            {formatCurrency(totalValue)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-500 mb-1">Mortgage Outstanding</div>
          <div className="text-2xl font-semibold text-red-600">
            {formatCurrency(totalMortgage)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 ring-1 ring-amber-100 p-5">
          <div className="text-sm text-slate-500 mb-1">Home Equity</div>
          <div className="text-2xl font-semibold text-amber-700">
            {formatCurrency(totalEquity)}
          </div>
          {totalValue > 0 && (
            <div className="text-sm text-amber-600 mt-1">
              {((totalEquity / totalValue) * 100).toFixed(1)}% LTV equity
            </div>
          )}
        </div>
      </div>

      {/* Rightmove AVM Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Rightmove AVM:</strong> Rightmove does not offer a public API for automated
          valuations. As a workaround, visit{" "}
          <a
            href="https://www.rightmove.co.uk/house-prices.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline inline-flex items-center gap-1"
          >
            rightmove.co.uk/house-prices
            <ExternalLink className="w-3 h-3" />
          </a>{" "}
          to look up your property estimate, then enter it below. You can also use
          Zoopla, a surveyor valuation, or your lender&apos;s valuation.
        </div>
      </div>

      {/* Properties */}
      {properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No properties added yet</p>
          <button
            onClick={addProperty}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-amber-600" />
                  </div>
                  <input
                    type="text"
                    value={prop.name}
                    onChange={(e) =>
                      updateProperty(prop.id, { name: e.target.value })
                    }
                    placeholder="Property name (e.g. Home)"
                    className="text-lg font-medium text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300"
                  />
                </div>
                <button
                  onClick={() => removeProperty(prop.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={prop.address || ""}
                    onChange={(e) =>
                      updateProperty(prop.id, { address: e.target.value })
                    }
                    placeholder="Full address or postcode"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Estimated Value */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Estimated Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      &pound;
                    </span>
                    <input
                      type="number"
                      value={prop.estimatedValue || ""}
                      onChange={(e) =>
                        updateProperty(prop.id, {
                          estimatedValue: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      min="0"
                      step="1000"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Valuation Source */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Valuation Source
                  </label>
                  <select
                    value={prop.valuationSource}
                    onChange={(e) =>
                      updateProperty(prop.id, {
                        valuationSource: e.target.value as "manual" | "rightmove",
                        lastValuationDate: new Date().toISOString().split("T")[0],
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  >
                    <option value="manual">Manual / Surveyor</option>
                    <option value="rightmove">Rightmove Estimate</option>
                  </select>
                </div>

                {/* Mortgage Balance */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Mortgage Balance
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      &pound;
                    </span>
                    <input
                      type="number"
                      value={prop.mortgageBalance || ""}
                      onChange={(e) =>
                        updateProperty(prop.id, {
                          mortgageBalance: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      min="0"
                      step="100"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Interest Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={prop.interestRate || ""}
                      onChange={(e) =>
                        updateProperty(prop.id, {
                          interestRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      %
                    </span>
                  </div>
                </div>

                {/* Monthly Payment */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Monthly Payment
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      &pound;
                    </span>
                    <input
                      type="number"
                      value={prop.monthlyPayment || ""}
                      onChange={(e) =>
                        updateProperty(prop.id, {
                          monthlyPayment: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      min="0"
                      step="1"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Remaining Term */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Remaining Term (years)
                  </label>
                  <input
                    type="number"
                    value={prop.mortgageTerm || ""}
                    onChange={(e) =>
                      updateProperty(prop.id, {
                        mortgageTerm: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="25"
                    min="0"
                    max="40"
                    step="1"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Purchase Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      &pound;
                    </span>
                    <input
                      type="number"
                      value={prop.purchasePrice || ""}
                      onChange={(e) =>
                        updateProperty(prop.id, {
                          purchasePrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      min="0"
                      step="1000"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="month"
                    value={prop.purchaseDate || ""}
                    onChange={(e) =>
                      updateProperty(prop.id, {
                        purchaseDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Equity summary for this property */}
              {prop.estimatedValue > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Equity in this property</span>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-amber-700">
                      {formatCurrency(prop.estimatedValue - prop.mortgageBalance)}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({((1 - prop.mortgageBalance / prop.estimatedValue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addProperty}
            className="inline-flex items-center gap-2 px-4 py-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Another Property
          </button>
        </div>
      )}
    </div>
  );
}
