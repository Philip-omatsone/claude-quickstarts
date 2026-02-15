"use client";

import { useState, useMemo } from "react";
import { Zap } from "lucide-react";
import {
  CalculatorLayout,
  InputField,
  SliderField,
  ResultCard,
  InsightBox,
  formatGBP,
} from "@/components/calculators/CalculatorLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function OverpaymentCalculatorPage() {
  const [balance, setBalance] = useState(250000);
  const [term, setTerm] = useState(22);
  const [rate, setRate] = useState(4.5);
  const [monthlyOverpay, setMonthlyOverpay] = useState(200);
  const [lumpSum, setLumpSum] = useState(0);

  const calc = useMemo(() => {
    const r = rate / 100 / 12;
    const n = term * 12;
    if (balance <= 0 || r <= 0) return { original: [], overpay: [], timeSaved: 0, interestSaved: 0, newPayoffYears: term, monthlyPayment: 0 };

    const monthly = balance * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Original schedule
    const original: { year: number; balance: number }[] = [{ year: 0, balance }];
    let bal = balance;
    let totalInterestOrig = 0;
    for (let y = 1; y <= term; y++) {
      for (let m = 0; m < 12; m++) {
        const mInt = bal * r;
        totalInterestOrig += mInt;
        bal = Math.max(bal - (monthly - mInt), 0);
      }
      original.push({ year: y, balance: Math.round(bal) });
    }

    // Overpayment schedule
    const overpay: { year: number; balance: number }[] = [];
    let balOv = Math.max(balance - lumpSum, 0);
    overpay.push({ year: 0, balance: Math.round(balOv) });
    let totalInterestOv = 0;
    let payoffYear = term;
    for (let y = 1; y <= term; y++) {
      for (let m = 0; m < 12; m++) {
        if (balOv <= 0) break;
        const mInt = balOv * r;
        totalInterestOv += mInt;
        balOv = Math.max(balOv - (monthly - mInt + monthlyOverpay), 0);
      }
      overpay.push({ year: y, balance: Math.round(balOv) });
      if (balOv <= 0 && payoffYear === term) payoffYear = y;
    }

    const timeSavedMonths = (term - payoffYear) * 12;
    const timeSavedYears = Math.floor(timeSavedMonths / 12);
    const timeSavedRem = timeSavedMonths % 12;
    const interestSaved = Math.round(totalInterestOrig - totalInterestOv);

    // Merge for chart
    const chart = original.map((o, i) => ({
      year: o.year,
      original: o.balance,
      withOverpayments: overpay[i]?.balance ?? 0,
    }));

    return {
      chart,
      timeSavedYears,
      timeSavedMonths: timeSavedRem,
      interestSaved,
      newPayoffYears: payoffYear,
      monthlyPayment: Math.round(monthly),
      originalPayoff: term,
    };
  }, [balance, term, rate, monthlyOverpay, lumpSum]);

  return (
    <CalculatorLayout
      title="Overpayment Calculator"
      subtitle="See how overpayments can save you thousands"
      icon={Zap}
      backHref="/buyers/calculators"
      backLabel="All Calculators"
      methodology={`This calculator compares your original mortgage repayment schedule against one with regular overpayments and/or a lump sum. The monthly payment stays the same but the term shortens, saving interest.`}
      faqs={[
        {
          q: "Can I overpay my mortgage?",
          a: "Most lenders allow you to overpay up to 10% of the outstanding balance per year without penalty. Check your mortgage terms — early repayment charges (ERCs) may apply during a fixed rate period.",
        },
        {
          q: "Is it better to overpay or save?",
          a: "If your mortgage rate is higher than your savings rate (after tax), overpaying is usually better. But keep an emergency fund of 3-6 months' expenses first.",
        },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5 bg-white rounded-xl border border-border p-6">
          <InputField label="Current mortgage balance" value={balance} onChange={(v) => setBalance(Number(v) || 0)} prefix="£" />
          <SliderField label="Remaining term" value={term} onChange={setTerm} min={1} max={35} displayValue={`${term} years`} />
          <InputField label="Interest rate" value={rate} onChange={(v) => setRate(Number(v) || 0)} suffix="%" step={0.1} />
          <InputField label="Monthly overpayment" value={monthlyOverpay} onChange={(v) => setMonthlyOverpay(Number(v) || 0)} prefix="£" />
          <InputField label="One-off lump sum" value={lumpSum} onChange={(v) => setLumpSum(Number(v) || 0)} prefix="£" />
        </div>

        <div className="space-y-4">
          <ResultCard label="Interest saved" value={formatGBP(calc.interestSaved)} large />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Time saved"
              value={`${calc.timeSavedYears}y ${calc.timeSavedMonths}m`}
            />
            <ResultCard
              label="New payoff"
              value={`${calc.newPayoffYears} years`}
              sublabel={`Was ${term} years`}
            />
            <ResultCard label="Current payment" value={`${formatGBP(calc.monthlyPayment)}/mo`} />
            <ResultCard label="Overpayment" value={`${formatGBP(monthlyOverpay)}/mo`} />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Balance Over Time: Original vs With Overpayments
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={calc.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatGBP(Number(value))} />
            <Legend />
            <Line type="monotone" dataKey="original" stroke="#9CA3AF" strokeWidth={2} dot={false} name="Original" />
            <Line type="monotone" dataKey="withOverpayments" stroke="#16A34A" strokeWidth={2} dot={false} name="With overpayments" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <InsightBox>
        <p>
          Most lenders allow up to 10% of the balance per year in overpayments
          without penalty. Check your mortgage terms before committing to regular
          overpayments.
          {calc.interestSaved > 5000 &&
            ` At ${formatGBP(monthlyOverpay)}/month, you'd save ${formatGBP(calc.interestSaved)} in interest — that's a powerful return on your money.`}
        </p>
      </InsightBox>
    </CalculatorLayout>
  );
}
