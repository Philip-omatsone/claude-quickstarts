"use client";

import { useState } from "react";
import { ProjectionScenario, OverpaymentVsInvestResult } from "@/lib/projections/types";
import { compareOverpaymentVsInvest, oneMoreYearAnalysis } from "@/lib/projections/decision-engine";
import { optimiseSalarySacrifice } from "@/lib/projections/investment-engine";
import { formatCurrency } from "@/lib/utils";
import { Scale, ArrowRight, Target, Zap } from "lucide-react";

interface DecisionComparisonProps {
  scenario: ProjectionScenario;
}

export default function DecisionComparison({ scenario }: DecisionComparisonProps) {
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [activeComparison, setActiveComparison] = useState<"overpay" | "sacrifice" | "oneyear">("overpay");

  return (
    <div className="space-y-6">
      {/* Comparison Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "overpay" as const, label: "Overpay vs Invest", icon: <Scale className="w-4 h-4" /> },
          { id: "sacrifice" as const, label: "Salary Sacrifice", icon: <Zap className="w-4 h-4" /> },
          { id: "oneyear" as const, label: "One More Year", icon: <Target className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveComparison(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              activeComparison === tab.id
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overpay vs Invest */}
      {activeComparison === "overpay" && (
        <OverpayVsInvestPanel scenario={scenario} monthlyAmount={monthlyAmount} setMonthlyAmount={setMonthlyAmount} />
      )}

      {/* Salary Sacrifice Optimisation */}
      {activeComparison === "sacrifice" && (
        <SalarySacrificeOptPanel scenario={scenario} />
      )}

      {/* One More Year */}
      {activeComparison === "oneyear" && (
        <OneMoreYearPanel scenario={scenario} />
      )}
    </div>
  );
}

function OverpayVsInvestPanel({
  scenario,
  monthlyAmount,
  setMonthlyAmount,
}: {
  scenario: ProjectionScenario;
  monthlyAmount: number;
  setMonthlyAmount: (v: number) => void;
}) {
  const result = compareOverpaymentVsInvest(
    monthlyAmount,
    scenario.property,
    scenario.isa.allocation,
    scenario.household.person1.grossSalary,
    scenario.pension.employeePercent,
    scenario.pension.employerPercent,
    scenario.projectionMonths,
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Monthly Amount to Compare</label>
        <div className="relative w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">&pound;</span>
          <input
            type="number"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(parseFloat(e.target.value) || 0)}
            step={100}
            min={0}
            className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">Where should {formatCurrency(monthlyAmount)}/month go?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-amber-600 mb-3">MORTGAGE OVERPAYMENT</div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-slate-500">Interest Saved</span>
              <div className="text-lg font-semibold text-slate-900">{formatCurrency(result.overpaymentScenario.interestSaved)}</div>
            </div>
            <div>
              <span className="text-xs text-slate-500">Years Reduced</span>
              <div className="text-sm font-medium text-slate-700">{result.overpaymentScenario.yearsReduced.toFixed(1)} years</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-emerald-600 mb-3">ISA (TAX-FREE)</div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-slate-500">Projected Value</span>
              <div className="text-lg font-semibold text-slate-900">{formatCurrency(result.isaScenario.projectedValue)}</div>
            </div>
            <div>
              <span className="text-xs text-slate-500">Net Value</span>
              <div className="text-sm font-medium text-emerald-600">{formatCurrency(result.isaScenario.netValue)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-purple-600 mb-3">PENSION (SALARY SACRIFICE)</div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-slate-500">Projected Value</span>
              <div className="text-lg font-semibold text-slate-900">{formatCurrency(result.pensionScenario.projectedValue)}</div>
            </div>
            <div>
              <span className="text-xs text-slate-500">Tax Relief Gained</span>
              <div className="text-sm font-medium text-purple-600">{formatCurrency(result.pensionScenario.taxRelief)}</div>
            </div>
            <div>
              <span className="text-xs text-slate-500">Net Value (after drawdown tax)</span>
              <div className="text-sm font-medium text-slate-700">{formatCurrency(result.pensionScenario.netValue)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-blue-800 mb-1">Recommendation</div>
        <p className="text-sm text-blue-700">{result.recommendation}</p>
        <p className="text-xs text-blue-600 mt-2">
          Break-even mortgage rate: {result.breakEvenRate.toFixed(1)}%. Your mortgage is at {scenario.property.interestRate}%.
        </p>
      </div>
    </div>
  );
}

function SalarySacrificeOptPanel({ scenario }: { scenario: ProjectionScenario }) {
  const result = optimiseSalarySacrifice(
    scenario.household.person1.grossSalary,
    scenario.pension.employeePercent,
    scenario.pension.employerPercent,
  );

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Optimal Salary Sacrifice for {scenario.household.person1.name}</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <span className="text-xs text-slate-500">Current Salary</span>
            <div className="text-lg font-semibold text-slate-900">{formatCurrency(scenario.household.person1.grossSalary)}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Optimal Sacrifice</span>
            <div className="text-lg font-semibold text-blue-600">{formatCurrency(result.optimalSacrificeAmount)}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Net Pay After</span>
            <div className="text-lg font-semibold text-slate-900">{formatCurrency(result.netPayAfterSacrifice)}</div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Pension Boost</span>
            <div className="text-lg font-semibold text-emerald-600">{formatCurrency(result.pensionBoost)}</div>
          </div>
        </div>

        {result.personalAllowanceRecovered > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              This recovers {formatCurrency(result.personalAllowanceRecovered)} of personal allowance
              that was being tapered above £100k. The 60% marginal rate zone makes sacrifice especially valuable.
            </p>
          </div>
        )}

        {scenario.household.person1.grossSalary > 100000 && (
          <div className="mt-4 bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-600">
              <strong>Personal Allowance Taper:</strong> Between £100,000 and £125,140, you lose £1 of personal allowance
              for every £2 earned. This creates an effective 60% marginal tax rate. Sacrificing salary to bring your
              adjusted net income below £100,000 recovers the full £12,570 allowance — saving {formatCurrency(12570 * 0.40)} in tax.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OneMoreYearPanel({ scenario }: { scenario: ProjectionScenario }) {
  const [currentAge, setCurrentAge] = useState(33);
  const [monthlySavings, setMonthlySavings] = useState(2000);
  const [targetSpend, setTargetSpend] = useState(35000);

  const totalPension = scenario.pension.currentPot + (scenario.pension2?.currentPot ?? 0);
  const totalInvestments = scenario.household.person1.currentISA +
    (scenario.household.person2?.currentISA ?? 0) +
    scenario.household.person1.currentCash +
    (scenario.household.person2?.currentCash ?? 0);

  const result = oneMoreYearAnalysis(
    currentAge,
    scenario.household.person1.grossSalary + (scenario.household.person2?.grossSalary ?? 0),
    monthlySavings,
    totalInvestments,
    totalPension,
    6.0, // expected return
    targetSpend,
    scenario.pension.employeePercent + scenario.pension.employerPercent,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Current Age</label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(parseInt(e.target.value) || 30)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Monthly Savings</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">&pound;</span>
            <input
              type="number"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(parseFloat(e.target.value) || 0)}
              className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Target Annual Spend</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">&pound;</span>
            <input
              type="number"
              value={targetSpend}
              onChange={(e) => setTargetSpend(parseFloat(e.target.value) || 0)}
              className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-500 mb-3">RETIRE NOW</div>
          <div className="text-lg font-semibold text-slate-900 mb-1">
            {result.retireNow.sustainableYears >= 100 ? "Indefinitely" : `${result.retireNow.sustainableYears} years`}
          </div>
          <p className="text-xs text-slate-500">
            at {formatCurrency(result.retireNow.monthlyDrawdown)}/month
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-emerald-600 mb-3">WORK ONE MORE YEAR</div>
          <div className="text-lg font-semibold text-slate-900 mb-1">
            {result.retireOneMoreYear.sustainableYears >= 100 ? "Indefinitely" : `${result.retireOneMoreYear.sustainableYears} years`}
          </div>
          <p className="text-xs text-emerald-700">
            +{formatCurrency(result.benefit.extraNetWorth)} net worth
          </p>
          <p className="text-xs text-emerald-600">
            +{result.benefit.extraSustainableYears.toFixed(1)} sustainable years
          </p>
        </div>
      </div>
    </div>
  );
}
