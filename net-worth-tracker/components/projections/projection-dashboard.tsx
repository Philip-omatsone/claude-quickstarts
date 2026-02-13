"use client";

import { useState, useCallback, useRef } from "react";
import { ProjectionScenario, ProjectionResult, MonthlyProjection } from "@/lib/projections/types";
import { createDefaultScenario } from "@/lib/projections/defaults";
import { runFullProjection, runDeterministicProjection } from "@/lib/projections/core-engine";
import { formatCurrency } from "@/lib/utils";
import ScenarioConfig from "./scenario-config";
import LifeEventsEditor from "./life-events-editor";
import {
  NetWorthProjectionChart,
  MonteCarloChart,
  IncomeExpensesChart,
  TaxBurdenChart,
  CrossoverChart,
  SensitivityChart,
  ScenarioComparisonChart,
} from "./projection-charts";
import { TaxBreakdownPanel, StampDutyCalculator, SalarySacrificePanel } from "./tax-summary";
import DecisionComparison from "./decision-comparison";
import {
  Play,
  Settings,
  Calendar,
  BarChart3,
  Calculator,
  Scale,
  TrendingUp,
  Loader2,
  AlertTriangle,
  Target,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
} from "lucide-react";

type DashboardTab = "config" | "results" | "tax" | "decisions" | "scenarios";

function SummaryCard({ label, value, subtitle, color }: { label: string; value: string; subtitle?: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    amber: "text-amber-600 bg-amber-50 border-amber-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200",
    red: "text-red-600 bg-red-50 border-red-200",
    slate: "text-slate-600 bg-slate-50 border-slate-200",
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] || colorMap.slate}`}>
      <div className="text-xs font-medium opacity-70 mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      {subtitle && <div className="text-xs opacity-70 mt-0.5">{subtitle}</div>}
    </div>
  );
}

function CollapsibleSection({ title, icon, children, defaultOpen = true }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

export default function ProjectionDashboard() {
  const [scenarios, setScenarios] = useState<ProjectionScenario[]>([createDefaultScenario()]);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [results, setResults] = useState<ProjectionResult | null>(null);
  const [allResults, setAllResults] = useState<Map<string, ProjectionResult>>(new Map());
  const [activeTab, setActiveTab] = useState<DashboardTab>("config");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState("");
  const workerRef = useRef<number | null>(null);

  const activeScenario = scenarios[activeScenarioIdx];

  const updateScenario = useCallback((updated: ProjectionScenario) => {
    setScenarios((prev) => prev.map((s, i) => (i === activeScenarioIdx ? updated : s)));
  }, [activeScenarioIdx]);

  const duplicateScenario = useCallback(() => {
    const source = scenarios[activeScenarioIdx];
    const copy: ProjectionScenario = {
      ...source,
      id: `scenario_${Date.now().toString(36)}`,
      name: `${source.name} (copy)`,
    };
    setScenarios((prev) => [...prev, copy]);
    setActiveScenarioIdx(scenarios.length);
  }, [scenarios, activeScenarioIdx]);

  const removeScenario = useCallback((idx: number) => {
    if (scenarios.length <= 1) return;
    setScenarios((prev) => prev.filter((_, i) => i !== idx));
    setActiveScenarioIdx((prev) => Math.min(prev, scenarios.length - 2));
  }, [scenarios]);

  const runProjection = useCallback(async () => {
    setRunning(true);
    setProgress("Running deterministic projection...");

    // Run in chunks using setTimeout to keep UI responsive
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      setProgress("Running Monte Carlo simulation (10,000 scenarios)...");
      await new Promise((resolve) => setTimeout(resolve, 50));

      const result = runFullProjection(activeScenario);
      setResults(result);
      setAllResults((prev) => {
        const next = new Map(prev);
        next.set(activeScenario.id, result);
        return next;
      });
      setActiveTab("results");
      setProgress("");
    } catch (error) {
      setProgress(`Error: ${error}`);
    } finally {
      setRunning(false);
    }
  }, [activeScenario]);

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: "config", label: "Configure", icon: <Settings className="w-4 h-4" /> },
    { id: "results", label: "Results", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "tax", label: "Tax Tools", icon: <Calculator className="w-4 h-4" /> },
    { id: "decisions", label: "Decisions", icon: <Scale className="w-4 h-4" /> },
    { id: "scenarios", label: "Compare", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const det = results?.deterministic;
  const final = det?.[det.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Financial Projection Engine</h2>
          <p className="text-sm text-slate-500">Monte Carlo simulation with full UK tax modelling</p>
        </div>
        <button
          onClick={runProjection}
          disabled={running}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-semibold"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? "Running..." : "Run Projection"}
        </button>
      </div>

      {progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-700 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {progress}
        </div>
      )}

      {/* Scenario Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveScenarioIdx(i)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              i === activeScenarioIdx
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s.name}
            {scenarios.length > 1 && i === activeScenarioIdx && (
              <button
                onClick={(e) => { e.stopPropagation(); removeScenario(i); }}
                className="ml-1 text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </button>
        ))}
        <button
          onClick={duplicateScenario}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 bg-white border border-dashed border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <Copy className="w-3.5 h-3.5" />
          Duplicate
        </button>
      </div>

      {/* Tab Navigation */}
      <nav className="flex gap-1 border-b border-slate-200 -mb-px">
        {tabs.map((tab) => (
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

      {/* ─── Configure Tab ─── */}
      {activeTab === "config" && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Scenario Name</label>
            <input
              type="text"
              value={activeScenario.name}
              onChange={(e) => updateScenario({ ...activeScenario, name: e.target.value })}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          <ScenarioConfig scenario={activeScenario} onChange={updateScenario} />

          <CollapsibleSection
            title="Life Events Timeline"
            icon={<Calendar className="w-4 h-4 text-indigo-600" />}
            defaultOpen={false}
          >
            <LifeEventsEditor
              events={activeScenario.lifeEvents}
              onChange={(events) => updateScenario({ ...activeScenario, lifeEvents: events })}
            />
          </CollapsibleSection>
        </div>
      )}

      {/* ─── Results Tab ─── */}
      {activeTab === "results" && (
        <>
          {!results ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No projection results yet</p>
              <button
                onClick={runProjection}
                disabled={running}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <Play className="w-4 h-4" />
                Run Projection
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <SummaryCard
                  label={`Net Worth (Year ${Math.round(results.scenario.projectionMonths / 12)})`}
                  value={formatCurrency(final?.netWorth ?? 0)}
                  color="blue"
                />
                <SummaryCard
                  label="Property Equity"
                  value={formatCurrency(final?.propertyEquity ?? 0)}
                  color="amber"
                />
                <SummaryCard
                  label="Pension Pots"
                  value={formatCurrency(final?.pensionPot ?? 0)}
                  color="purple"
                />
                <SummaryCard
                  label="ISA Balance"
                  value={formatCurrency(final?.isaBalance ?? 0)}
                  color="emerald"
                />
                <SummaryCard
                  label="Monte Carlo Failure"
                  value={`${results.monteCarlo.failureRate.toFixed(1)}%`}
                  subtitle="Scenarios with negative NW"
                  color={results.monteCarlo.failureRate > 10 ? "red" : "emerald"}
                />
                <SummaryCard
                  label="Crossover Point"
                  value={results.crossoverMonth !== null ? `Year ${Math.round(results.crossoverMonth / 12)}` : "N/A"}
                  subtitle="Investment income > expenses"
                  color="slate"
                />
              </div>

              {/* Net Worth Over Time */}
              <CollapsibleSection
                title="Net Worth Over Time (by Asset Class)"
                icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
              >
                <NetWorthProjectionChart data={results.deterministic} />
              </CollapsibleSection>

              {/* Monte Carlo */}
              <CollapsibleSection
                title={`Monte Carlo Simulation (${results.scenario.monteCarlo.numSimulations.toLocaleString()} scenarios)`}
                icon={<BarChart3 className="w-4 h-4 text-indigo-600" />}
              >
                <MonteCarloChart result={results.monteCarlo} />
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {([
                    ["10th", results.monteCarlo.percentiles.p10],
                    ["25th", results.monteCarlo.percentiles.p25],
                    ["50th (Median)", results.monteCarlo.percentiles.p50],
                    ["75th", results.monteCarlo.percentiles.p75],
                    ["90th", results.monteCarlo.percentiles.p90],
                  ] as [string, number[]][]).map(([label, values]) => (
                    <div key={label} className="text-center bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-500 mb-1">{label} Percentile</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {formatCurrency(values[values.length - 1])}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Income vs Expenses */}
              <CollapsibleSection
                title="Income vs Expenses Over Time"
                icon={<BarChart3 className="w-4 h-4 text-amber-600" />}
                defaultOpen={false}
              >
                <IncomeExpensesChart data={results.deterministic} />
              </CollapsibleSection>

              {/* Tax Burden */}
              <CollapsibleSection
                title="Tax Burden Over Time"
                icon={<Calculator className="w-4 h-4 text-red-600" />}
                defaultOpen={false}
              >
                <TaxBurdenChart data={results.deterministic} />
              </CollapsibleSection>

              {/* Crossover Point */}
              <CollapsibleSection
                title="Financial Independence Crossover"
                icon={<Target className="w-4 h-4 text-emerald-600" />}
                defaultOpen={false}
              >
                <CrossoverChart data={results.deterministic} crossoverMonth={results.crossoverMonth} />
                {results.crossoverMonth !== null ? (
                  <p className="text-sm text-emerald-700 mt-3">
                    Investment income exceeds monthly expenses at month {results.crossoverMonth} (year {Math.round(results.crossoverMonth / 12)}).
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 mt-3">
                    Investment income does not exceed expenses within the projection period.
                  </p>
                )}
              </CollapsibleSection>

              {/* Sensitivity Analysis */}
              <CollapsibleSection
                title="Sensitivity Analysis"
                icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
                defaultOpen={false}
              >
                <p className="text-xs text-slate-500 mb-3">
                  Impact on final net worth from a +1% change in each variable.
                </p>
                <SensitivityChart results={results.sensitivityAnalysis} />
              </CollapsibleSection>
            </div>
          )}
        </>
      )}

      {/* ─── Tax Tools Tab ─── */}
      {activeTab === "tax" && (
        <div className="space-y-6">
          <CollapsibleSection
            title={`Tax Breakdown — ${activeScenario.household.person1.name} (${formatCurrency(activeScenario.household.person1.grossSalary)})`}
            icon={<Calculator className="w-4 h-4 text-red-600" />}
            defaultOpen
          >
            <TaxBreakdownPanel
              grossIncome={activeScenario.household.person1.grossSalary}
              pensionContrib={
                activeScenario.pension.salarySacrifice
                  ? activeScenario.household.person1.grossSalary * (activeScenario.pension.employeePercent / 100)
                  : 0
              }
            />
          </CollapsibleSection>

          {activeScenario.household.person2 && (
            <CollapsibleSection
              title={`Tax Breakdown — ${activeScenario.household.person2.name} (${formatCurrency(activeScenario.household.person2.grossSalary)})`}
              icon={<Calculator className="w-4 h-4 text-red-600" />}
              defaultOpen={false}
            >
              <TaxBreakdownPanel
                grossIncome={activeScenario.household.person2.grossSalary}
                pensionContrib={0}
              />
            </CollapsibleSection>
          )}

          <CollapsibleSection
            title="Salary Sacrifice Analysis"
            icon={<Scale className="w-4 h-4 text-blue-600" />}
          >
            <SalarySacrificePanel
              grossSalary={activeScenario.household.person1.grossSalary}
              employeePercent={activeScenario.pension.employeePercent}
              employerPercent={activeScenario.pension.employerPercent}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Stamp Duty Calculator"
            icon={<Calculator className="w-4 h-4 text-amber-600" />}
            defaultOpen={false}
          >
            <StampDutyCalculator />
          </CollapsibleSection>
        </div>
      )}

      {/* ─── Decisions Tab ─── */}
      {activeTab === "decisions" && (
        <DecisionComparison scenario={activeScenario} />
      )}

      {/* ─── Scenario Comparison Tab ─── */}
      {activeTab === "scenarios" && (
        <div className="space-y-6">
          {allResults.size < 2 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-2">Run at least two scenarios to compare</p>
              <p className="text-xs text-slate-400">
                Duplicate a scenario, change parameters, and run both to see them overlaid.
              </p>
            </div>
          ) : (
            <CollapsibleSection
              title="Net Worth Comparison"
              icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
            >
              <ScenarioComparisonChart
                scenarios={Array.from(allResults.entries()).map(([id, r]) => ({
                  name: r.scenario.name,
                  data: r.deterministic,
                }))}
              />
            </CollapsibleSection>
          )}
        </div>
      )}
    </div>
  );
}
