"use client";

import { useState, useEffect, useCallback } from "react";
import { MonthlySnapshot } from "@/lib/types";
import { loadSnapshots, addSnapshot, deleteSnapshot } from "@/lib/storage";
import {
  formatCurrency,
  formatMonth,
  totalAssets,
  totalLiabilities,
  netWorth,
  buildChartData,
} from "@/lib/utils";
import NetWorthChart from "./net-worth-chart";
import CompositionChart from "./composition-chart";
import MonthlyChanges from "./monthly-changes";
import EntryForm from "./entry-form";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from "lucide-react";

function SummaryCard({
  label,
  value,
  subtitle,
  icon,
  color,
  highlight,
}: {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl border p-5 ${
        highlight ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      {subtitle && (
        <div
          className={`text-sm mt-1 font-medium ${
            color === "emerald"
              ? "text-emerald-600"
              : color === "red"
                ? "text-red-500"
                : "text-slate-500"
          }`}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSnapshots(loadSnapshots());
    setLoaded(true);
  }, []);

  const sorted = [...snapshots].sort((a, b) =>
    a.month.localeCompare(b.month),
  );
  const latest = sorted[sorted.length - 1];
  const previous = sorted.length >= 2 ? sorted[sorted.length - 2] : null;

  const currentAssets = latest ? totalAssets(latest) : 0;
  const currentLiabilities = latest ? totalLiabilities(latest) : 0;
  const currentNetWorth = latest ? netWorth(latest) : 0;
  const previousNetWorth = previous ? netWorth(previous) : null;
  const momChange =
    previousNetWorth !== null ? currentNetWorth - previousNetWorth : null;
  const momPercent =
    previousNetWorth !== null && previousNetWorth !== 0
      ? ((currentNetWorth - previousNetWorth) / Math.abs(previousNetWorth)) *
        100
      : null;

  const handleSave = useCallback((snapshot: MonthlySnapshot) => {
    const updated = addSnapshot(snapshot);
    setSnapshots(updated);
    setShowForm(false);
    setEditingMonth(null);
  }, []);

  const handleDelete = useCallback((month: string) => {
    const updated = deleteSnapshot(month);
    setSnapshots(updated);
  }, []);

  const handleEdit = useCallback((month: string) => {
    setEditingMonth(month);
    setShowForm(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingMonth(null);
    setShowForm(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowForm(false);
    setEditingMonth(null);
  }, []);

  if (!loaded) return null;

  const chartData = buildChartData(snapshots);
  const hasData = snapshots.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900">
              Net Worth Tracker
            </h1>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Month
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasData ? (
          <div className="text-center py-20">
            <PiggyBank className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-slate-900 mb-2">
              No data yet
            </h2>
            <p className="text-slate-500 mb-6">
              Add your first monthly snapshot to start tracking your net worth.
            </p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add First Month
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <SummaryCard
                label="Total Assets"
                value={formatCurrency(currentAssets)}
                icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
                color="emerald"
              />
              <SummaryCard
                label="Total Liabilities"
                value={formatCurrency(currentLiabilities)}
                icon={<TrendingDown className="w-5 h-5 text-red-500" />}
                color="red"
              />
              <SummaryCard
                label="Net Worth"
                value={formatCurrency(currentNetWorth)}
                icon={<Wallet className="w-5 h-5 text-blue-600" />}
                color="blue"
                highlight
              />
              <SummaryCard
                label="Month-on-Month"
                value={
                  momChange !== null
                    ? `${momChange >= 0 ? "+" : ""}${formatCurrency(momChange)}`
                    : "\u2014"
                }
                subtitle={
                  momPercent !== null
                    ? `${momPercent >= 0 ? "+" : ""}${momPercent.toFixed(1)}%`
                    : undefined
                }
                icon={
                  momChange !== null ? (
                    momChange >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )
                  ) : (
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                  )
                }
                color={
                  momChange !== null
                    ? momChange >= 0
                      ? "emerald"
                      : "red"
                    : "slate"
                }
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-sm font-medium text-slate-500 mb-4">
                  Net Worth Over Time
                </h2>
                <NetWorthChart data={chartData} />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-sm font-medium text-slate-500 mb-4">
                  Asset Composition &mdash;{" "}
                  {latest ? formatMonth(latest.month) : ""}
                </h2>
                <CompositionChart snapshot={latest} />
              </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-medium text-slate-500 mb-4">
                Monthly History
              </h2>
              <MonthlyChanges
                snapshots={sorted}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </>
        )}
      </main>

      {showForm && (
        <EntryForm
          snapshots={snapshots}
          editingMonth={editingMonth}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
