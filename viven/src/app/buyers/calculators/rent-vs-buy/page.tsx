"use client";

import { useState, useMemo } from "react";
import { Scale } from "lucide-react";
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

export default function RentVsBuyPage() {
  const [monthlyRent, setMonthlyRent] = useState(1200);
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [deposit, setDeposit] = useState(30000);
  const [mortgageRate, setMortgageRate] = useState(4.5);
  const [term, setTerm] = useState(25);
  const [hpiGrowth, setHpiGrowth] = useState(3);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [investReturn, setInvestReturn] = useState(5);
  const [stayYears, setStayYears] = useState(10);

  const calc = useMemo(() => {
    const loanAmount = propertyPrice - deposit;
    const r = mortgageRate / 100 / 12;
    const n = term * 12;
    const monthly = loanAmount > 0 && r > 0
      ? loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : 0;

    // Buying costs (simplified)
    const stampDuty = propertyPrice <= 300000 ? 0 : Math.round((propertyPrice - 300000) * 0.05);
    const buyingFees = 5000;
    const sellingFees = Math.round(propertyPrice * Math.pow(1 + hpiGrowth / 100, stayYears) * 0.02); // 2% estate agent

    const chart: { year: number; rentWealth: number; buyWealth: number }[] = [];
    const table: { year: number; rentCost: number; buyCost: number; rentWealth: number; buyWealth: number }[] = [];

    // Renting: invest the deposit + difference
    let rentInvestment = deposit + stampDuty + buyingFees;
    let rentTotalCost = 0;
    let currentRent = monthlyRent;

    // Buying: mortgage + maintenance + insurance
    let mortgageBalance = loanAmount;
    let buyTotalCost = deposit + stampDuty + buyingFees;
    let propertyValue = propertyPrice;

    let breakeven = 0;

    for (let y = 1; y <= stayYears; y++) {
      // Renting year
      const yearRent = currentRent * 12;
      rentTotalCost += yearRent;

      const yearMortgage = monthly * 12;
      const maintenance = propertyValue * 0.01;
      const insurance = 300;
      const yearBuyCost = yearMortgage + maintenance + insurance;

      // Invest the difference if renting is cheaper
      const monthlyBuyCost = yearBuyCost / 12;
      const saving = monthlyBuyCost - currentRent;
      if (saving > 0) {
        rentInvestment += saving * 12;
      }

      // Grow investment
      rentInvestment *= 1 + investReturn / 100;

      // Update property value and mortgage
      propertyValue *= 1 + hpiGrowth / 100;
      for (let m = 0; m < 12; m++) {
        if (mortgageBalance > 0) {
          const mInt = mortgageBalance * r;
          mortgageBalance = Math.max(mortgageBalance - (monthly - mInt), 0);
        }
      }
      buyTotalCost += yearBuyCost;

      currentRent *= 1 + rentIncrease / 100;

      const buyWealth = Math.round(propertyValue - mortgageBalance - (y === stayYears ? sellingFees : 0));
      const rentWealth = Math.round(rentInvestment);

      if (buyWealth > rentWealth && breakeven === 0) breakeven = y;

      chart.push({ year: y, rentWealth, buyWealth });
      table.push({
        year: y,
        rentCost: Math.round(rentTotalCost),
        buyCost: Math.round(buyTotalCost),
        rentWealth,
        buyWealth,
      });
    }

    const finalBuyWealth = chart[chart.length - 1]?.buyWealth ?? 0;
    const finalRentWealth = chart[chart.length - 1]?.rentWealth ?? 0;
    const buyingWins = finalBuyWealth > finalRentWealth;

    return { chart, table, breakeven, finalBuyWealth, finalRentWealth, buyingWins, monthly: Math.round(monthly) };
  }, [propertyPrice, deposit, mortgageRate, term, hpiGrowth, rentIncrease, investReturn, stayYears, monthlyRent]);

  const [showTable, setShowTable] = useState(false);

  return (
    <CalculatorLayout
      title="Rent vs Buy Comparison"
      subtitle="Compare the financial outcomes of renting versus buying"
      icon={Scale}
      backHref="/buyers/calculators"
      backLabel="All Calculators"
      methodology={`Buying: Tracks property equity (value minus mortgage), including stamp duty, buying fees, maintenance (1% p.a.), and selling costs (2% agent fee).\n\nRenting: Invests the deposit and any monthly savings in a portfolio at the specified return rate. Rent increases annually.\n\nThis is a simplified model. Real outcomes depend on many factors including tax, actual house prices, and personal circumstances.`}
    >
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4 bg-white rounded-xl border border-border p-5">
          <InputField label="Monthly rent" value={monthlyRent} onChange={(v) => setMonthlyRent(Number(v) || 0)} prefix="£" />
          <InputField label="Property price" value={propertyPrice} onChange={(v) => setPropertyPrice(Number(v) || 0)} prefix="£" />
          <InputField label="Deposit" value={deposit} onChange={(v) => setDeposit(Number(v) || 0)} prefix="£" />
          <InputField label="Mortgage rate" value={mortgageRate} onChange={(v) => setMortgageRate(Number(v) || 0)} suffix="%" step={0.1} />
          <SliderField label="House price growth" value={hpiGrowth} onChange={setHpiGrowth} min={0} max={8} step={0.5} displayValue={`${hpiGrowth}%/yr`} />
          <SliderField label="Rent increases" value={rentIncrease} onChange={setRentIncrease} min={0} max={8} step={0.5} displayValue={`${rentIncrease}%/yr`} />
          <SliderField label="Investment return" value={investReturn} onChange={setInvestReturn} min={0} max={12} step={0.5} displayValue={`${investReturn}%/yr`} />
          <SliderField label="How long will you stay?" value={stayYears} onChange={setStayYears} min={1} max={30} displayValue={`${stayYears} years`} />
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label={`Net wealth — Buying (${stayYears}yr)`}
              value={formatGBP(calc.finalBuyWealth)}
              large={calc.buyingWins}
            />
            <ResultCard
              label={`Net wealth — Renting (${stayYears}yr)`}
              value={formatGBP(calc.finalRentWealth)}
              large={!calc.buyingWins}
            />
          </div>

          <div className={`rounded-xl border p-4 text-center text-sm font-medium ${calc.buyingWins ? "bg-primary-light border-primary/20 text-primary" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
            {calc.buyingWins
              ? `Buying wins by ${formatGBP(calc.finalBuyWealth - calc.finalRentWealth)} after ${stayYears} years`
              : `Renting + investing wins by ${formatGBP(calc.finalRentWealth - calc.finalBuyWealth)} after ${stayYears} years`}
            {calc.breakeven > 0 && calc.buyingWins && ` (breakeven at year ${calc.breakeven})`}
          </div>

          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Net Wealth Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={calc.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatGBP(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="buyWealth" stroke="#16A34A" strokeWidth={2} dot={false} name="Buying" />
                <Line type="monotone" dataKey="rentWealth" stroke="#3B82F6" strokeWidth={2} dot={false} name="Renting + Investing" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button onClick={() => setShowTable(!showTable)} className="text-sm text-primary font-medium">
          {showTable ? "Hide" : "Show"} year-by-year comparison
        </button>
        {showTable && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted font-medium">Year</th>
                  <th className="text-right py-2 px-2 text-muted font-medium">Rent Cost (Cumulative)</th>
                  <th className="text-right py-2 px-2 text-muted font-medium">Buy Cost (Cumulative)</th>
                  <th className="text-right py-2 px-2 text-muted font-medium">Rent Wealth</th>
                  <th className="text-right py-2 px-2 text-muted font-medium">Buy Wealth</th>
                </tr>
              </thead>
              <tbody>
                {calc.table.map((row) => (
                  <tr key={row.year} className="border-b border-border last:border-0">
                    <td className="py-1.5 px-2">{row.year}</td>
                    <td className="py-1.5 px-2 text-right">{formatGBP(row.rentCost)}</td>
                    <td className="py-1.5 px-2 text-right">{formatGBP(row.buyCost)}</td>
                    <td className="py-1.5 px-2 text-right text-blue-600">{formatGBP(row.rentWealth)}</td>
                    <td className="py-1.5 px-2 text-right text-green-600">{formatGBP(row.buyWealth)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InsightBox>
        <p>
          This comparison is sensitive to assumptions about house price growth and investment returns.
          {calc.breakeven > 0 ? ` With current assumptions, buying breaks even after ${calc.breakeven} years. If you're planning to stay less than that, renting may be financially better.` : " Try adjusting the growth rates to see how different scenarios play out."}
        </p>
      </InsightBox>
    </CalculatorLayout>
  );
}
