"use client";

import { useState, useEffect, useCallback } from "react";
import { MonthlySnapshot, LineItem } from "@/lib/types";
import { loadSnapshots, addSnapshot, deleteSnapshot, saveSnapshots, loadProperties, loadPensions, loadEquityExposure } from "@/lib/storage";
import {
  formatCurrency,
  formatMonth,
  totalAssets,
  totalLiabilities,
  netWorth,
  totalEquityExposure,
  buildChartData,
  getCurrentMonth,
  generateId,
  propertyToLineItems,
  pensionToLineItems,
  equityExposureToLineItems,
} from "@/lib/utils";
import NetWorthChart from "./net-worth-chart";
import CompositionChart from "./composition-chart";
import MonthlyChanges from "./monthly-changes";
import EntryForm from "./entry-form";
import ExcelUpload from "./excel-upload";
import ApiSettings from "./api-settings";
import PropertyTab from "./property-tab";
import PensionTab from "./pension-tab";
import EquityExposureTab from "./equity-exposure-tab";
import ProjectionDashboard from "./projections/projection-dashboard";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  FileSpreadsheet,
  Plug,
  Home,
  Landmark,
  BarChart3,
  LayoutDashboard,
  Calculator,
} from "lucide-react";

type TabId = "overview" | "property" | "pensions" | "equity" | "projections";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "property", label: "Property", icon: <Home className="w-4 h-4" /> },
  { id: "pensions", label: "Pensions", icon: <Landmark className="w-4 h-4" /> },
  { id: "equity", label: "Equity Exposure", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "projections", label: "Projections", icon: <Calculator className="w-4 h-4" /> },
];

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
  const [showImport, setShowImport] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
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
  const currentEquityExposure = latest ? totalEquityExposure(latest) : 0;
  const previousNetWorth = previous ? netWorth(previous) : null;
  const momChange =
    previousNetWorth !== null ? currentNetWorth - previousNetWorth : null;
  const momPercent =
    previousNetWorth !== null && previousNetWorth !== 0
      ? ((currentNetWorth - previousNetWorth) / Math.abs(previousNetWorth)) *
        100
      : null;

  // Build a snapshot dynamically from property, pension, equity data + manual items
  const buildDynamicSnapshot = useCallback((month: string, manualItems: LineItem[]): MonthlySnapshot => {
    const properties = loadProperties();
    const pensions = loadPensions();
    const equityExposure = loadEquityExposure();

    // Categories that are auto-populated from dedicated tabs
    const autoCategories = new Set(["property", "mortgage", "pension", "equity_exposure"]);

    // Keep only manual items that aren't in auto-populated categories
    const filteredManualItems = manualItems.filter(
      (item) => !autoCategories.has(item.category),
    );

    // Build auto items from tab data
    const propertyItems = propertyToLineItems(properties);
    const pensionItems = pensionToLineItems(pensions);
    const equityItems = equityExposureToLineItems(equityExposure);

    return {
      id: generateId(),
      month,
      items: [...filteredManualItems, ...propertyItems, ...pensionItems, ...equityItems],
    };
  }, []);

  const handleSave = useCallback((snapshot: MonthlySnapshot) => {
    // When saving from the entry form, build a dynamic snapshot that combines
    // manual adjustments with auto-populated data from tabs
    const dynamicSnapshot = buildDynamicSnapshot(snapshot.month, snapshot.items);
    dynamicSnapshot.id = snapshot.id;
    const updated = addSnapshot(dynamicSnapshot);
    setSnapshots(updated);
    setShowForm(false);
    setEditingMonth(null);
  }, [buildDynamicSnapshot]);

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

  const handleImport = useCallback((imported: MonthlySnapshot[]) => {
    const existing = loadSnapshots();
    const merged = [...existing];
    for (const snap of imported) {
      const idx = merged.findIndex((s) => s.month === snap.month);
      if (idx >= 0) {
        merged[idx] = snap;
      } else {
        merged.push(snap);
      }
    }
    saveSnapshots(merged);
    setSnapshots(merged);
    setShowImport(false);
  }, []);

  const handleApiSync = useCallback(
    (_provider: string, items: LineItem[]) => {
      const month = getCurrentMonth();
      const existing = loadSnapshots();
      const current = existing.find((s) => s.month === month);

      let updatedItems: LineItem[];
      if (current) {
        const manualItems = current.items.filter(
          (item) => !item.source || item.source === "manual" || item.source !== _provider,
        );
        updatedItems = [...manualItems, ...items];
      } else {
        updatedItems = items;
      }

      const snapshot: MonthlySnapshot = {
        id: current?.id || generateId(),
        month,
        items: updatedItems,
      };

      const updated = addSnapshot(snapshot);
      setSnapshots(updated);
    },
    [],
  );

  // When tab data changes (property/pension/equity), refresh current month snapshot
  const handleTabDataChange = useCallback(() => {
    const month = getCurrentMonth();
    const existing = loadSnapshots();
    const current = existing.find((s) => s.month === month);

    // Get current manual items (non-auto categories)
    const manualItems = current?.items || [];
    const dynamicSnapshot = buildDynamicSnapshot(month, manualItems);
    dynamicSnapshot.id = current?.id || generateId();

    const updated = addSnapshot(dynamicSnapshot);
    setSnapshots(updated);
  }, [buildDynamicSnapshot]);

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApiSettings(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
              title="API Connections"
            >
              <Plug className="w-4 h-4" />
              <span className="hidden sm:inline">APIs</span>
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
              title="Import Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              title="Record manual adjustments for cash, ISAs, crypto etc. Property, pensions and equity are managed in their tabs."
            >
              <Plus className="w-4 h-4" />
              Adjust Month
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {!hasData ? (
              <div className="text-center py-20">
                <PiggyBank className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-slate-900 mb-2">
                  No data yet
                </h2>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  Start by adding your property, pensions, and equity exposure in
                  their respective tabs. Then record a snapshot or import from Excel.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => setActiveTab("property")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                  >
                    <Home className="w-4 h-4" />
                    Add Property
                  </button>
                  <button
                    onClick={() => setActiveTab("pensions")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Landmark className="w-4 h-4" />
                    Add Pensions
                  </button>
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Record Snapshot
                  </button>
                  <button
                    onClick={() => setShowImport(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Import Excel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
                    label="Equity Exposure"
                    value={formatCurrency(currentEquityExposure)}
                    icon={<BarChart3 className="w-5 h-5 text-indigo-600" />}
                    color="slate"
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
          </>
        )}

        {/* Property Tab */}
        {activeTab === "property" && (
          <PropertyTab onDataChange={handleTabDataChange} />
        )}

        {/* Pensions Tab */}
        {activeTab === "pensions" && (
          <PensionTab onDataChange={handleTabDataChange} />
        )}

        {/* Equity Exposure Tab */}
        {activeTab === "equity" && (
          <EquityExposureTab onDataChange={handleTabDataChange} />
        )}

        {/* Projections Tab */}
        {activeTab === "projections" && (
          <ProjectionDashboard />
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

      {showImport && (
        <ExcelUpload onImport={handleImport} onClose={() => setShowImport(false)} />
      )}

      {showApiSettings && (
        <ApiSettings
          onSync={handleApiSync}
          onClose={() => setShowApiSettings(false)}
        />
      )}
    </div>
  );
}
