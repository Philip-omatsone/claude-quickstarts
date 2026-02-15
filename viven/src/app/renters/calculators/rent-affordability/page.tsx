"use client";

import { useState, useMemo } from "react";
import { PiggyBank } from "lucide-react";
import {
  CalculatorLayout,
  InputField,
  ResultCard,
  InsightBox,
  formatGBP,
} from "@/components/calculators/CalculatorLayout";

export default function RentAffordabilityPage() {
  const [annualIncome, setAnnualIncome] = useState(35000);
  const [monthlyDebt, setMonthlyDebt] = useState(0);
  const [incomeTwo, setIncomeTwo] = useState(0);

  const calc = useMemo(() => {
    const combined = annualIncome + incomeTwo;
    const monthlyGross = combined / 12;
    const monthlyNet = monthlyGross * 0.72; // Rough estimate after tax/NI
    const available = monthlyNet - monthlyDebt;

    return {
      comfortable: Math.round(available * 0.3), // 30% rule
      stretch: Math.round(available * 0.35),
      max: Math.round(available * 0.4),
      monthlyNet: Math.round(monthlyNet),
      remaining30: Math.round(available * 0.7),
      remaining35: Math.round(available * 0.65),
    };
  }, [annualIncome, incomeTwo, monthlyDebt]);

  return (
    <CalculatorLayout
      title="Rent Affordability Calculator"
      subtitle="How much rent can you comfortably afford?"
      icon={PiggyBank}
      backHref="/renters/calculators"
      backLabel="All Calculators"
      methodology={`Based on the 30% rule: spend no more than 30% of your net income on rent. We estimate net income as ~72% of gross (after income tax and National Insurance). The "stretch" figure is 35%, and "maximum" is 40% — but above 30% you'll have less for savings and lifestyle.`}
      faqs={[
        { q: "How much should I spend on rent?", a: "The general guideline is no more than 30% of your take-home pay. In expensive cities like London, many people spend 35-40%, but this leaves less room for saving." },
        { q: "Do landlords check my income?", a: "Most landlords or agents require your annual income to be at least 2.5× the annual rent. Some require 3×. They'll ask for payslips and bank statements as proof." },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5 bg-white rounded-xl border border-border p-6">
          <InputField label="Annual income" value={annualIncome} onChange={(v) => setAnnualIncome(Number(v) || 0)} prefix="£" />
          <InputField label="Second income (optional)" value={incomeTwo} onChange={(v) => setIncomeTwo(Number(v) || 0)} prefix="£" />
          <InputField label="Monthly debt / commitments" value={monthlyDebt} onChange={(v) => setMonthlyDebt(Number(v) || 0)} prefix="£" />
        </div>

        <div className="space-y-4">
          <ResultCard label="Comfortable (30% of net)" value={`${formatGBP(calc.comfortable)}/mo`} large sublabel={`${formatGBP(calc.remaining30)}/mo remaining`} />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="Stretch (35%)" value={`${formatGBP(calc.stretch)}/mo`} sublabel={`${formatGBP(calc.remaining35)}/mo remaining`} />
            <ResultCard label="Maximum (40%)" value={`${formatGBP(calc.max)}/mo`} />
          </div>
          <ResultCard label="Est. monthly take-home" value={`${formatGBP(calc.monthlyNet)}/mo`} sublabel="Approx. after tax & NI" />

          {/* Visual indicator */}
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Spending Zones</h3>
            <div className="h-6 rounded-full overflow-hidden flex">
              <div className="bg-green-400 h-full" style={{ width: "30%" }} />
              <div className="bg-amber-400 h-full" style={{ width: "10%" }} />
              <div className="bg-red-400 h-full" style={{ width: "10%" }} />
              <div className="bg-gray-200 h-full" style={{ width: "50%" }} />
            </div>
            <div className="flex text-[10px] text-muted mt-1 justify-between">
              <span>0%</span>
              <span className="text-green-600">30%</span>
              <span className="text-amber-600">40%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      <InsightBox>
        <p>
          At {formatGBP(calc.comfortable)}/month, you&apos;ll have {formatGBP(calc.remaining30)} left for bills, food, savings, and lifestyle. In London, the average rent for a 1-bed is around £1,500 — if that exceeds your comfortable range, consider flatshares or zones 3-4.
        </p>
      </InsightBox>
    </CalculatorLayout>
  );
}
