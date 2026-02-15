"use client";

import { useState, useMemo } from "react";
import { PiggyBank } from "lucide-react";
import {
  CalculatorLayout,
  InputField,
  SliderField,
  ResultCard,
  InsightBox,
  formatGBP,
} from "@/components/calculators/CalculatorLayout";

export default function AffordabilityCalculatorPage() {
  const [income1, setIncome1] = useState(45000);
  const [income2, setIncome2] = useState(0);
  const [monthlyDebt, setMonthlyDebt] = useState(0);
  const [deposit, setDeposit] = useState(30000);
  const [term, setTerm] = useState(25);
  const [rate, setRate] = useState(4.5);

  const calc = useMemo(() => {
    const combinedIncome = income1 + income2;
    const annualDebt = monthlyDebt * 12;
    const maxBorrowing = Math.max(combinedIncome * 4.5 - annualDebt, 0);
    const maxPrice = maxBorrowing + deposit;

    // Monthly payment at current rate
    const r = rate / 100 / 12;
    const n = term * 12;
    const monthlyPayment =
      maxBorrowing > 0 && r > 0
        ? maxBorrowing * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        : 0;

    // Stress test: current rate + 3% or 6.5%, whichever is higher
    const stressRate = Math.max(rate + 3, 6.5);
    const sr = stressRate / 100 / 12;
    const stressMonthly =
      maxBorrowing > 0 && sr > 0
        ? maxBorrowing * (sr * Math.pow(1 + sr, n)) / (Math.pow(1 + sr, n) - 1)
        : 0;

    const monthlyGross = combinedIncome / 12;
    const stressRatio = monthlyGross > 0 ? (stressMonthly / monthlyGross) * 100 : 0;
    const passesStress = stressRatio <= 45;

    const paymentRatio = monthlyGross > 0 ? (monthlyPayment / monthlyGross) * 100 : 0;

    return {
      combinedIncome,
      maxBorrowing: Math.round(maxBorrowing),
      maxPrice: Math.round(maxPrice),
      monthlyPayment: Math.round(monthlyPayment),
      stressMonthly: Math.round(stressMonthly),
      stressRate,
      stressRatio: Math.round(stressRatio),
      passesStress,
      paymentRatio: Math.round(paymentRatio),
    };
  }, [income1, income2, monthlyDebt, deposit, term, rate]);

  const gaugePercent = Math.min(calc.stressRatio, 100);
  const gaugeColor =
    calc.stressRatio <= 30
      ? "#16A34A"
      : calc.stressRatio <= 45
        ? "#EAB308"
        : "#EF4444";

  return (
    <CalculatorLayout
      title="Affordability Calculator"
      subtitle="How much can you borrow and what can you afford?"
      icon={PiggyBank}
      backHref="/buyers/calculators"
      backLabel="All Calculators"
      methodology={`Most high-street lenders use a 4.5× income multiplier for standard applications. Some specialist lenders may offer up to 5.5× for higher earners or professionals.\n\nThe stress test checks whether you could still afford payments if rates rose to ${calc.stressRate}%. Lenders typically require that stressed payments don't exceed 45% of gross monthly income.`}
      faqs={[
        {
          q: "How much can I borrow for a mortgage?",
          a: "Most lenders will offer 4-4.5 times your annual salary. Joint applicants can combine incomes. Outstanding debts reduce the amount you can borrow.",
        },
        {
          q: "What is a mortgage stress test?",
          a: "Lenders check you could still afford payments if interest rates rise. They typically add 3% to the current rate (or use a minimum of 6.5%) and check the payment is below 45% of your gross income.",
        },
        {
          q: "Does my deposit affect how much I can borrow?",
          a: "Your deposit doesn't directly change how much a lender will offer, but it does affect the total property price you can afford (borrowing + deposit) and the interest rate you'll be offered.",
        },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5 bg-white rounded-xl border border-border p-6">
          <InputField
            label="Annual income (applicant 1)"
            value={income1}
            onChange={(v) => setIncome1(Number(v) || 0)}
            prefix="£"
          />
          <InputField
            label="Annual income (applicant 2, optional)"
            value={income2}
            onChange={(v) => setIncome2(Number(v) || 0)}
            prefix="£"
          />
          <InputField
            label="Monthly debt commitments"
            value={monthlyDebt}
            onChange={(v) => setMonthlyDebt(Number(v) || 0)}
            prefix="£"
          />
          <InputField
            label="Deposit available"
            value={deposit}
            onChange={(v) => setDeposit(Number(v) || 0)}
            prefix="£"
          />
          <SliderField
            label="Mortgage term"
            value={term}
            onChange={setTerm}
            min={5}
            max={40}
            displayValue={`${term} years`}
          />
          <InputField
            label="Interest rate"
            value={rate}
            onChange={(v) => setRate(Number(v) || 0)}
            suffix="%"
            step={0.1}
          />
        </div>

        <div className="space-y-4">
          <ResultCard
            label="Maximum property price"
            value={formatGBP(calc.maxPrice)}
            large
          />
          <ResultCard
            label="Maximum borrowing"
            value={formatGBP(calc.maxBorrowing)}
            sublabel={`${4.5}× combined income of ${formatGBP(calc.combinedIncome)}`}
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Monthly payment"
              value={formatGBP(calc.monthlyPayment)}
              sublabel={`${calc.paymentRatio}% of gross income`}
            />
            <ResultCard
              label="Stress test payment"
              value={formatGBP(calc.stressMonthly)}
              sublabel={`At ${calc.stressRate}%`}
            />
          </div>

          {/* Stress gauge */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Stress test ratio
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: gaugeColor }}
              >
                {calc.stressRatio}% of income
              </span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${gaugePercent}%`,
                  backgroundColor: gaugeColor,
                }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-red-500"
                style={{ left: "45%" }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted mt-1">
              <span>0%</span>
              <span className="text-red-500">45% limit</span>
              <span>100%</span>
            </div>
            <p className="text-xs mt-2 font-medium" style={{ color: gaugeColor }}>
              {calc.passesStress
                ? "Passes stress test"
                : "May not pass stress test — consider borrowing less"}
            </p>
          </div>
        </div>
      </div>

      <InsightBox>
        <p>
          Based on a 4.5× income multiplier, which is what most high-street
          lenders use. Some specialist lenders may offer up to 5.5× for higher
          earners.{" "}
          {calc.combinedIncome > 75000
            ? "With your income level, you may qualify for enhanced multipliers from professional mortgage products."
            : ""}
          {monthlyDebt > 0
            ? ` Your monthly debt of ${formatGBP(monthlyDebt)} reduces your maximum borrowing by approximately ${formatGBP(monthlyDebt * 12 * 4.5)}.`
            : ""}
        </p>
      </InsightBox>
    </CalculatorLayout>
  );
}
