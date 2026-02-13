"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  ReferenceLine,
} from "recharts";
import { MonthlyProjection, MonteCarloResult, SensitivityResult } from "@/lib/projections/types";

function formatCurrencyShort(value: number): string {
  if (Math.abs(value) >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `£${(value / 1000).toFixed(0)}k`;
  return `£${value.toFixed(0)}`;
}

function formatMonthLabel(month: string): string {
  const [y, m] = month.split("-");
  const date = new Date(parseInt(y), parseInt(m) - 1);
  return date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

// ─── Net Worth Over Time (Stacked by Asset Class) ────────────────────

export function NetWorthProjectionChart({ data }: { data: MonthlyProjection[] }) {
  // Sample every 12 months for readability
  const sampled = data.filter((_, i) => i % 12 === 0 || i === data.length - 1);

  const chartData = sampled.map((d) => ({
    month: formatMonthLabel(d.month),
    "Property Equity": Math.round(d.propertyEquity),
    Pensions: Math.round(d.pensionPot),
    ISAs: Math.round(d.isaBalance),
    "Other Investments": Math.round(d.giaBalance),
    Cash: Math.round(d.cashBalance),
    Mortgage: -Math.round(d.mortgageBalance),
    "Net Worth": Math.round(d.netWorth),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number) => formatCurrencyShort(value)}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Area type="monotone" dataKey="Property Equity" stackId="1" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.6} />
        <Area type="monotone" dataKey="Pensions" stackId="1" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.6} />
        <Area type="monotone" dataKey="ISAs" stackId="1" fill="#14b8a6" stroke="#14b8a6" fillOpacity={0.6} />
        <Area type="monotone" dataKey="Other Investments" stackId="1" fill="#10b981" stroke="#10b981" fillOpacity={0.6} />
        <Area type="monotone" dataKey="Cash" stackId="1" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.6} />
        <Area type="monotone" dataKey="Mortgage" stackId="2" fill="#ef4444" stroke="#ef4444" fillOpacity={0.3} />
        <Line type="monotone" dataKey="Net Worth" stroke="#1e293b" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ─── Monte Carlo Fan Chart ───────────────────────────────────────────

export function MonteCarloChart({ result }: { result: MonteCarloResult }) {
  // Sample every 12 months
  const step = 12;
  const indices: number[] = [];
  for (let i = 0; i < result.months.length; i += step) indices.push(i);
  if (indices[indices.length - 1] !== result.months.length - 1) {
    indices.push(result.months.length - 1);
  }

  const chartData = indices.map((i) => ({
    month: formatMonthLabel(result.months[i]),
    p10: Math.round(result.percentiles.p10[i]),
    p25: Math.round(result.percentiles.p25[i]),
    p50: Math.round(result.percentiles.p50[i]),
    p75: Math.round(result.percentiles.p75[i]),
    p90: Math.round(result.percentiles.p90[i]),
    mean: Math.round(result.mean[i]),
    // For area between p10-p90
    "p10-p25": Math.round(result.percentiles.p25[i] - result.percentiles.p10[i]),
    "p25-p50": Math.round(result.percentiles.p50[i] - result.percentiles.p25[i]),
    "p50-p75": Math.round(result.percentiles.p75[i] - result.percentiles.p50[i]),
    "p75-p90": Math.round(result.percentiles.p90[i] - result.percentiles.p75[i]),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number, name: string) => [formatCurrencyShort(value), name]}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {/* Base: p10 */}
        <Area type="monotone" dataKey="p10" stackId="fan" fill="transparent" stroke="transparent" />
        <Area type="monotone" dataKey="p10-p25" stackId="fan" fill="#dbeafe" stroke="transparent" fillOpacity={0.7} name="10th-25th" />
        <Area type="monotone" dataKey="p25-p50" stackId="fan" fill="#93c5fd" stroke="transparent" fillOpacity={0.7} name="25th-50th" />
        <Area type="monotone" dataKey="p50-p75" stackId="fan" fill="#60a5fa" stroke="transparent" fillOpacity={0.7} name="50th-75th" />
        <Area type="monotone" dataKey="p75-p90" stackId="fan" fill="#3b82f6" stroke="transparent" fillOpacity={0.7} name="75th-90th" />
        <Line type="monotone" dataKey="p50" stroke="#1e40af" strokeWidth={2} dot={false} name="Median" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Income vs Expenses Waterfall ────────────────────────────────────

export function IncomeExpensesChart({ data }: { data: MonthlyProjection[] }) {
  // Show latest month's breakdown
  const latest = data[data.length - 1];
  if (!latest) return null;

  // Take annual averages for the first, middle, and last year
  const years: { label: string; data: MonthlyProjection }[] = [];
  for (let y = 0; y < data.length; y += 60) { // every 5 years
    const idx = Math.min(y, data.length - 1);
    years.push({ label: formatMonthLabel(data[idx].month), data: data[idx] });
  }
  if (years[years.length - 1].data.monthIndex !== data[data.length - 1].monthIndex) {
    years.push({ label: formatMonthLabel(data[data.length - 1].month), data: data[data.length - 1] });
  }

  const chartData = years.map((y) => ({
    month: y.label,
    "Gross Income": Math.round(y.data.totalGrossIncome),
    Tax: -Math.round(y.data.person1Tax.totalDeductions / 12 + (y.data.person2Tax?.totalDeductions ?? 0) / 12),
    "Net Income": Math.round(y.data.totalNetIncome),
    Mortgage: -Math.round(y.data.mortgagePayment),
    Living: -Math.round(y.data.livingExpenses),
    Childcare: -Math.round(y.data.childcareCosts),
    "ISA Saving": -Math.round(y.data.isaContribution),
    "Pension Saving": -Math.round(y.data.pensionContribution),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value: number) => formatCurrencyShort(Math.abs(value))} contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Net Income" fill="#10b981" />
        <Bar dataKey="Mortgage" fill="#ef4444" />
        <Bar dataKey="Living" fill="#f59e0b" />
        <Bar dataKey="Childcare" fill="#f97316" />
        <Bar dataKey="ISA Saving" fill="#14b8a6" />
        <Bar dataKey="Pension Saving" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Tax Burden Over Time ────────────────────────────────────────────

export function TaxBurdenChart({ data }: { data: MonthlyProjection[] }) {
  const sampled = data.filter((_, i) => i % 12 === 0 || i === data.length - 1);

  const chartData = sampled.map((d) => ({
    month: formatMonthLabel(d.month),
    "Income Tax": Math.round(d.person1Tax.incomeTax / 12 + (d.person2Tax?.incomeTax ?? 0) / 12),
    "National Insurance": Math.round(d.person1Tax.employeeNI / 12 + (d.person2Tax?.employeeNI ?? 0) / 12),
    "Student Loan": Math.round(d.person1Tax.studentLoanRepayment / 12 + (d.person2Tax?.studentLoanRepayment ?? 0) / 12),
    "Effective Rate": +(d.person1Tax.effectiveTaxRate).toFixed(1),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="left" tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} />
        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar yAxisId="left" dataKey="Income Tax" stackId="tax" fill="#ef4444" />
        <Bar yAxisId="left" dataKey="National Insurance" stackId="tax" fill="#f97316" />
        <Bar yAxisId="left" dataKey="Student Loan" stackId="tax" fill="#eab308" />
        <Line yAxisId="right" type="monotone" dataKey="Effective Rate" stroke="#1e293b" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ─── Crossover Chart ─────────────────────────────────────────────────

export function CrossoverChart({ data, crossoverMonth }: { data: MonthlyProjection[]; crossoverMonth: number | null }) {
  const sampled = data.filter((_, i) => i % 12 === 0 || i === data.length - 1);

  const chartData = sampled.map((d) => ({
    month: formatMonthLabel(d.month),
    "Monthly Expenses": Math.round(d.totalExpenses),
    "Investment Income": Math.round(d.investmentIncome),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value: number) => formatCurrencyShort(value)} contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Area type="monotone" dataKey="Monthly Expenses" fill="#fef3c7" stroke="#f59e0b" fillOpacity={0.5} />
        <Line type="monotone" dataKey="Investment Income" stroke="#10b981" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ─── Sensitivity Analysis Chart ──────────────────────────────────────

export function SensitivityChart({ results }: { results: SensitivityResult[] }) {
  const chartData = results.map((r) => ({
    variable: r.variable,
    impact: Math.round(r.impact),
    isPositive: r.impact >= 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, results.length * 45)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 150, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="variable" tick={{ fontSize: 11 }} width={140} />
        <Tooltip formatter={(value: number) => formatCurrencyShort(value)} contentStyle={{ fontSize: 12 }} />
        <ReferenceLine x={0} stroke="#94a3b8" />
        <Bar dataKey="impact" name="Impact per +1%">
          {chartData.map((entry, index) => (
            <rect key={index} fill={entry.isPositive ? "#10b981" : "#ef4444"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Scenario Comparison Chart ───────────────────────────────────────

export function ScenarioComparisonChart({
  scenarios,
}: {
  scenarios: { name: string; data: MonthlyProjection[] }[];
}) {
  if (scenarios.length === 0) return null;

  // Use first scenario as base for month labels
  const baseData = scenarios[0].data;
  const sampled = baseData.filter((_, i) => i % 12 === 0 || i === baseData.length - 1).map((_, idx, arr) => {
    const monthIdx = baseData.indexOf(arr[idx]);
    const point: Record<string, string | number> = { month: formatMonthLabel(baseData[monthIdx].month) };
    for (const s of scenarios) {
      const matchingMonth = s.data[monthIdx];
      if (matchingMonth) {
        point[s.name] = Math.round(matchingMonth.netWorth);
      }
    }
    return point;
  });

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={sampled} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value: number) => formatCurrencyShort(value)} contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {scenarios.map((s, i) => (
          <Line
            key={s.name}
            type="monotone"
            dataKey={s.name}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
