"use client";

import { TaxBreakdown, StampDutyResult, SalarySacrificeComparison, PensionAllowance } from "@/lib/projections/types";
import { calculateFullTaxBreakdown, calculateStampDuty, compareSalarySacrifice, calculatePensionAllowance } from "@/lib/projections/tax-engine";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

function TaxRow({ label, value, highlight, negative }: { label: string; value: number; highlight?: boolean; negative?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${highlight ? "font-semibold" : ""}`}>
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm font-medium ${negative ? "text-red-600" : highlight ? "text-slate-900" : "text-slate-700"}`}>
        {negative && value > 0 ? "-" : ""}{formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}

export function TaxBreakdownPanel({ grossIncome, pensionContrib }: { grossIncome: number; pensionContrib: number }) {
  const tax = calculateFullTaxBreakdown(grossIncome, pensionContrib);

  return (
    <div className="space-y-1">
      <TaxRow label="Gross Income" value={tax.grossIncome} highlight />
      <div className="border-t border-slate-100 my-2" />
      <TaxRow label="Personal Allowance" value={tax.personalAllowance} />
      <TaxRow label="Taxable Income" value={tax.taxableIncome} />
      <div className="border-t border-slate-100 my-2" />
      <TaxRow label="Basic Rate Tax (20%)" value={tax.basicRateTax} negative />
      <TaxRow label="Higher Rate Tax (40%)" value={tax.higherRateTax} negative />
      <TaxRow label="Additional Rate Tax (45%)" value={tax.additionalRateTax} negative />
      <TaxRow label="Total Income Tax" value={tax.incomeTax} negative highlight />
      <div className="border-t border-slate-100 my-2" />
      <TaxRow label="Employee NI" value={tax.employeeNI} negative />
      <TaxRow label="Employer NI" value={tax.employerNI} negative />
      <TaxRow label="Student Loan" value={tax.studentLoanRepayment} negative />
      <div className="border-t border-slate-100 my-2" />
      <TaxRow label="Total Deductions" value={tax.totalDeductions} negative highlight />
      <TaxRow label="Net Annual Income" value={tax.netIncome} highlight />
      <TaxRow label="Net Monthly Income" value={tax.netIncome / 12} highlight />
      <div className="border-t border-slate-100 my-2" />
      <div className="flex items-center justify-between py-1">
        <span className="text-xs text-slate-500">Effective Tax Rate</span>
        <span className="text-xs font-medium text-slate-600">{tax.effectiveTaxRate.toFixed(1)}%</span>
      </div>
      <div className="flex items-center justify-between py-1">
        <span className="text-xs text-slate-500">Marginal Tax Rate</span>
        <span className="text-xs font-medium text-slate-600">{tax.marginalTaxRate.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export function StampDutyCalculator() {
  const [price, setPrice] = useState(500000);
  const [isAdditional, setIsAdditional] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  const result = calculateStampDuty(price, isAdditional, isFirstTime);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Property Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">&pound;</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              step={10000}
              className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isAdditional} onChange={(e) => setIsAdditional(e.target.checked)} className="rounded" />
            Additional property
          </label>
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFirstTime} onChange={(e) => setIsFirstTime(e.target.checked)} className="rounded" />
            First-time buyer
          </label>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-900">Total Stamp Duty</span>
          <span className="text-lg font-bold text-slate-900">{formatCurrency(result.stampDuty)}</span>
        </div>
        <div className="text-xs text-slate-500 mb-3">Effective rate: {result.effectiveRate.toFixed(2)}%</div>
        <div className="space-y-1">
          {result.bands.map((band, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {formatCurrency(band.from)} — {formatCurrency(band.to)} @ {(band.rate * 100).toFixed(0)}%
              </span>
              <span className="text-slate-700 font-medium">{formatCurrency(band.tax)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SalarySacrificePanel({ grossSalary, employeePercent, employerPercent }: { grossSalary: number; employeePercent: number; employerPercent: number }) {
  const [sacrificeAmount, setSacrificeAmount] = useState(
    Math.max(0, grossSalary - 100000), // default: sacrifice down to £100k to recover PA
  );

  const result = compareSalarySacrifice(grossSalary, employeePercent, employerPercent, sacrificeAmount);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Annual Salary Sacrifice Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">&pound;</span>
          <input
            type="number"
            value={sacrificeAmount}
            onChange={(e) => setSacrificeAmount(parseFloat(e.target.value) || 0)}
            step={500}
            min={0}
            max={grossSalary * 0.5}
            className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {grossSalary > 100000 && (
          <p className="text-xs text-amber-600 mt-1">
            Tip: Sacrificing {formatCurrency(grossSalary - 100000)} brings you below £100k and recovers your full personal allowance.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs font-semibold text-slate-500 mb-2">WITHOUT Sacrifice</div>
          <TaxRow label="Gross Salary" value={result.withoutSacrifice.grossSalary} />
          <TaxRow label="Income Tax" value={result.withoutSacrifice.incomeTax} negative />
          <TaxRow label="Employee NI" value={result.withoutSacrifice.employeeNI} negative />
          <TaxRow label="Pension" value={result.withoutSacrifice.pensionContribution} negative />
          <div className="border-t border-slate-200 my-2" />
          <TaxRow label="Take Home" value={result.withoutSacrifice.netPay} highlight />
          <TaxRow label="Total into Pension" value={result.withoutSacrifice.totalPensionInflow} />
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs font-semibold text-blue-600 mb-2">WITH Sacrifice</div>
          <TaxRow label="Gross Salary" value={result.withSacrifice.grossSalary} />
          <TaxRow label="Sacrificed" value={sacrificeAmount} negative />
          <TaxRow label="Income Tax" value={result.withSacrifice.incomeTax} negative />
          <TaxRow label="Employee NI" value={result.withSacrifice.employeeNI} negative />
          <TaxRow label="Pension" value={result.withSacrifice.pensionContribution} negative />
          <div className="border-t border-blue-200 my-2" />
          <TaxRow label="Take Home" value={result.withSacrifice.netPay} highlight />
          <TaxRow label="Total into Pension" value={result.withSacrifice.totalPensionInflow} />
          <TaxRow label="Employer NI Saved" value={result.withSacrifice.employerNISaving} />
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="text-sm font-semibold text-emerald-800 mb-1">
          Net Benefit: {formatCurrency(result.netBenefit)}/year
        </div>
        <div className="text-xs text-emerald-700">
          Extra {formatCurrency(result.pensionBoost)} goes into your pension annually through sacrifice + employer NI saving.
          Your take-home reduces by {formatCurrency(result.withoutSacrifice.netPay - result.withSacrifice.netPay)}.
        </div>
      </div>
    </div>
  );
}
