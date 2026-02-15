"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  CalculatorLayout,
  InputField,
  SliderField,
  ResultCard,
  InsightBox,
  formatGBP,
} from "@/components/calculators/CalculatorLayout";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
} from "recharts";

export default function EquityOverTimePage() {
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [deposit, setDeposit] = useState(30000);
  const [term, setTerm] = useState(25);
  const [rate, setRate] = useState(4.5);
  const [hpiGrowth, setHpiGrowth] = useState(3);
  const [overpayment, setOverpayment] = useState(0);

  const loanAmount = Math.max(propertyPrice - deposit, 0);

  const data = useMemo(() => {
    const r = rate / 100 / 12;
    const n = term * 12;
    if (loanAmount <= 0 || r <= 0) return { chart: [], milestones: [], table: [] };

    const baseMonthly = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyGrowth = Math.pow(1 + hpiGrowth / 100, 1 / 12) - 1;

    const chart: { year: number; equity: number; mortgage: number; propertyValue: number; cumulativeInterest: number }[] = [];
    const table: { year: number; propertyValue: number; mortgageBalance: number; equity: number; equityPct: number; yearInterest: number; cumulativeInterest: number }[] = [];

    let balance = loanAmount;
    let balanceOv = loanAmount;
    let pv = propertyPrice;
    let cumInterest = 0;
    let cumInterestOv = 0;

    chart.push({ year: 0, equity: deposit, mortgage: loanAmount, propertyValue: propertyPrice, cumulativeInterest: 0 });

    let fifty = 0;
    let paidOff = term;
    let paidOffOv = term;

    for (let y = 1; y <= term; y++) {
      let yearInterest = 0;
      let yearInterestOv = 0;

      for (let m = 0; m < 12; m++) {
        pv *= 1 + monthlyGrowth;

        // Standard
        const mInt = balance * r;
        yearInterest += mInt;
        const mPrinc = baseMonthly - mInt;
        balance = Math.max(balance - mPrinc, 0);

        // With overpayment
        if (balanceOv > 0) {
          const mIntOv = balanceOv * r;
          yearInterestOv += mIntOv;
          const totalPay = baseMonthly + overpayment;
          const mPrincOv = totalPay - mIntOv;
          balanceOv = Math.max(balanceOv - mPrincOv, 0);
          if (balanceOv <= 0 && paidOffOv === term) paidOffOv = y;
        }
      }

      cumInterest += yearInterest;
      cumInterestOv += yearInterestOv;

      const equity = Math.round(pv - balance);
      const equityPct = pv > 0 ? Math.round((equity / pv) * 100) : 0;

      if (equityPct >= 50 && fifty === 0) fifty = y;
      if (balance <= 0 && paidOff === term) paidOff = y;

      chart.push({
        year: y,
        equity: Math.round(equity),
        mortgage: Math.round(balance),
        propertyValue: Math.round(pv),
        cumulativeInterest: Math.round(cumInterest),
      });

      table.push({
        year: y,
        propertyValue: Math.round(pv),
        mortgageBalance: Math.round(balance),
        equity: Math.round(equity),
        equityPct,
        yearInterest: Math.round(yearInterest),
        cumulativeInterest: Math.round(cumInterest),
      });
    }

    const milestones: string[] = [];
    if (fifty > 0) milestones.push(`You'll own 50% of your home by year ${fifty}`);
    const equityAt10 = table.find((t) => t.year === 10);
    if (equityAt10) milestones.push(`If house prices grow at ${hpiGrowth}%, your equity reaches ${formatGBP(equityAt10.equity)} by year 10`);

    if (overpayment > 0) {
      const interestSaved = Math.round(cumInterest - cumInterestOv);
      const yearsSaved = paidOff - paidOffOv;
      if (interestSaved > 0 || yearsSaved > 0)
        milestones.push(`Overpaying ${formatGBP(overpayment)}/month saves ${formatGBP(interestSaved)} in interest and clears your mortgage ${yearsSaved} years early`);
    }

    return { chart, milestones, table };
  }, [propertyPrice, deposit, loanAmount, term, rate, hpiGrowth, overpayment]);

  const [showTable, setShowTable] = useState(false);

  return (
    <CalculatorLayout
      title="Equity & Interest Over Time"
      subtitle="Visualise how your equity grows as you pay off your mortgage"
      icon={TrendingUp}
      backHref="/buyers/calculators"
      backLabel="All Calculators"
      methodology={`Equity = Property Value - Remaining Mortgage. Property value grows by the annual HPI rate compounded monthly. Mortgage balance reduces based on the standard annuity amortisation formula, plus any overpayments.`}
    >
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4 bg-white rounded-xl border border-border p-5">
          <InputField label="Property price" value={propertyPrice} onChange={(v) => setPropertyPrice(Number(v) || 0)} prefix="£" />
          <InputField label="Deposit" value={deposit} onChange={(v) => setDeposit(Number(v) || 0)} prefix="£" />
          <SliderField label="Mortgage term" value={term} onChange={setTerm} min={5} max={40} displayValue={`${term} yrs`} />
          <InputField label="Interest rate" value={rate} onChange={(v) => setRate(Number(v) || 0)} suffix="%" step={0.1} />
          <SliderField label="Annual house price growth" value={hpiGrowth} onChange={setHpiGrowth} min={0} max={10} step={0.5} displayValue={`${hpiGrowth}%`} />
          <InputField label="Monthly overpayment" value={overpayment} onChange={(v) => setOverpayment(Number(v) || 0)} prefix="£" />
        </div>

        <div className="md:col-span-2 space-y-4">
          {data.milestones.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-4 space-y-2">
              {data.milestones.map((m, i) => (
                <p key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">→</span> {m}
                </p>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Equity vs Mortgage Over Time</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: "Years", position: "bottom", offset: -5 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatGBP(Number(value))} />
                <Legend />
                <Area type="monotone" dataKey="equity" stackId="1" stroke="#16A34A" fill="#DCFCE7" name="Your Equity" />
                <Area type="monotone" dataKey="mortgage" stackId="1" stroke="#9CA3AF" fill="#F3F4F6" name="Mortgage Balance" />
                <Line type="monotone" dataKey="cumulativeInterest" stroke="#EF4444" strokeDasharray="5 5" dot={false} name="Total Interest Paid" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button onClick={() => setShowTable(!showTable)} className="text-sm text-primary font-medium hover:text-primary-dark transition-colors">
          {showTable ? "Hide" : "Show"} year-by-year table
        </button>
        {showTable && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted font-medium">Year</th>
                  <th className="text-right py-2 px-2 text-muted font-medium">Property Value</th>
                  <th className="text-right py-2 px-2 text-muted font-medium">Mortgage</th>
                  <th className="text-right py-2 px-2 text-muted font-medium">Equity</th>
                  <th className="text-right py-2 px-2 text-muted font-medium">Equity %</th>
                  <th className="text-right py-2 px-2 text-muted font-medium">Interest (Year)</th>
                  <th className="text-right py-2 px-2 text-muted font-medium">Interest (Total)</th>
                </tr>
              </thead>
              <tbody>
                {data.table.map((row) => (
                  <tr key={row.year} className="border-b border-border last:border-0">
                    <td className="py-1.5 px-2">{row.year}</td>
                    <td className="py-1.5 px-2 text-right">{formatGBP(row.propertyValue)}</td>
                    <td className="py-1.5 px-2 text-right">{formatGBP(row.mortgageBalance)}</td>
                    <td className="py-1.5 px-2 text-right text-green-600 font-medium">{formatGBP(row.equity)}</td>
                    <td className="py-1.5 px-2 text-right">{row.equityPct}%</td>
                    <td className="py-1.5 px-2 text-right text-red-500">{formatGBP(row.yearInterest)}</td>
                    <td className="py-1.5 px-2 text-right">{formatGBP(row.cumulativeInterest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
