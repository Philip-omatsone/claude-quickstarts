"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import {
  CalculatorLayout,
  InputField,
  SliderField,
  ToggleGroup,
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function MortgageCalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [deposit, setDeposit] = useState(30000);
  const [depositIsPercent, setDepositIsPercent] = useState(false);
  const [term, setTerm] = useState(25);
  const [rate, setRate] = useState(4.5);
  const [mortgageType, setMortgageType] = useState("repayment");

  const depositAmount = depositIsPercent
    ? (propertyPrice * deposit) / 100
    : deposit;
  const loanAmount = Math.max(propertyPrice - depositAmount, 0);
  const ltv =
    propertyPrice > 0
      ? Math.round(((propertyPrice - depositAmount) / propertyPrice) * 100)
      : 0;

  const calc = useMemo(() => {
    const r = rate / 100 / 12;
    const n = term * 12;

    if (loanAmount <= 0 || r <= 0 || n <= 0)
      return {
        monthly: 0,
        totalRepaid: 0,
        totalInterest: 0,
        schedule: [],
        balanceData: [],
      };

    let monthly: number;
    if (mortgageType === "repayment") {
      monthly = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      monthly = loanAmount * r;
    }

    const totalRepaid =
      mortgageType === "repayment" ? monthly * n : monthly * n + loanAmount;
    const totalInterest = totalRepaid - loanAmount;

    // Yearly schedule
    const schedule: {
      year: number;
      openBal: number;
      interestPaid: number;
      principalPaid: number;
      closeBal: number;
    }[] = [];
    const balanceData: { year: number; balance: number }[] = [
      { year: 0, balance: loanAmount },
    ];

    let balance = loanAmount;
    for (let y = 1; y <= term; y++) {
      let yearInterest = 0;
      let yearPrincipal = 0;
      const openBal = balance;

      for (let m = 0; m < 12; m++) {
        const mInterest = balance * r;
        yearInterest += mInterest;
        if (mortgageType === "repayment") {
          const mPrincipal = monthly - mInterest;
          yearPrincipal += mPrincipal;
          balance = Math.max(balance - mPrincipal, 0);
        }
      }

      schedule.push({
        year: y,
        openBal: Math.round(openBal),
        interestPaid: Math.round(yearInterest),
        principalPaid: Math.round(yearPrincipal),
        closeBal: Math.round(balance),
      });
      balanceData.push({ year: y, balance: Math.round(balance) });
    }

    return {
      monthly: Math.round(monthly),
      totalRepaid: Math.round(totalRepaid),
      totalInterest: Math.round(totalInterest),
      schedule,
      balanceData,
    };
  }, [loanAmount, rate, term, mortgageType]);

  const pieData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: calc.totalInterest },
  ];

  const insight = (() => {
    const parts: string[] = [];
    if (ltv > 90)
      parts.push(
        `With an LTV of ${ltv}%, you'll likely face higher interest rates. Most competitive deals start at 85% LTV or below.`
      );
    if (term > 30)
      parts.push(
        `A ${term}-year term reduces monthly payments but increases total interest by ${formatGBP(calc.totalInterest - (loanAmount * (rate / 100 / 12) * Math.pow(1 + rate / 100 / 12, 300)) / (Math.pow(1 + rate / 100 / 12, 300) - 1) * 300 + loanAmount > 0 ? 0 : 0)} compared to a 25-year term.`
      );
    if (mortgageType === "interest-only")
      parts.push(
        `With an interest-only mortgage, you'll need a plan to repay the ${formatGBP(loanAmount)} capital at the end of the term.`
      );
    parts.push(
      "Rates shown are illustrative. Speak to a mortgage broker for personalised quotes."
    );
    return parts.join(" ");
  })();

  const [showTable, setShowTable] = useState(false);

  return (
    <CalculatorLayout
      title="Mortgage Repayment Calculator"
      subtitle="Calculate your monthly mortgage payments and total costs"
      icon={Calculator}
      backHref="/buyers/calculators"
      backLabel="All Calculators"
      methodology={`Repayment mortgage uses the annuity formula: M = P × [r(1+r)^n] / [(1+r)^n - 1] where P is the loan amount, r is the monthly interest rate, and n is the total number of payments.\n\nInterest-only: Monthly payment = Loan amount × monthly rate. The capital balance never reduces.\n\nThis calculator provides estimates only. Actual mortgage offers depend on your credit profile, income, and lender criteria.`}
      faqs={[
        {
          q: "How much deposit do I need for a mortgage?",
          a: "Most lenders require a minimum of 5% deposit, but you'll get better interest rates with 10-15% or more. The lower your LTV (loan-to-value), the more competitive rates you can access.",
        },
        {
          q: "What's the difference between repayment and interest-only?",
          a: "With a repayment mortgage, your monthly payments cover both interest and capital, so the loan is fully paid off at the end of the term. With interest-only, you only pay the interest each month — the full loan amount remains and must be repaid at the end.",
        },
        {
          q: "Should I choose a longer mortgage term?",
          a: "A longer term means lower monthly payments but more total interest paid. A 30-year term costs significantly more than a 25-year term in total interest. Choose the shortest term where the monthly payments are comfortable.",
        },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5 bg-white rounded-xl border border-border p-6">
          <InputField
            label="Property price"
            value={propertyPrice}
            onChange={(v) => setPropertyPrice(Number(v) || 0)}
            prefix="£"
          />

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <InputField
                label="Deposit"
                value={deposit}
                onChange={(v) => setDeposit(Number(v) || 0)}
                prefix={depositIsPercent ? undefined : "£"}
                suffix={depositIsPercent ? "%" : undefined}
              />
            </div>
            <button
              onClick={() => {
                if (depositIsPercent) {
                  setDeposit(
                    Math.round((deposit / 100) * propertyPrice)
                  );
                } else {
                  setDeposit(
                    propertyPrice > 0
                      ? Math.round((deposit / propertyPrice) * 100)
                      : 10
                  );
                }
                setDepositIsPercent(!depositIsPercent);
              }}
              className="px-3 py-2.5 rounded-xl border border-border text-xs font-medium text-muted hover:text-foreground transition-colors whitespace-nowrap"
            >
              {depositIsPercent ? "Show £" : "Show %"}
            </button>
          </div>

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
            min={0.1}
            max={15}
          />

          <ToggleGroup
            label="Mortgage type"
            options={[
              { value: "repayment", label: "Repayment" },
              { value: "interest-only", label: "Interest Only" },
            ]}
            value={mortgageType}
            onChange={setMortgageType}
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <ResultCard
            label="Monthly repayment"
            value={formatGBP(calc.monthly)}
            large
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Total repaid"
              value={formatGBP(calc.totalRepaid)}
            />
            <ResultCard
              label="Total interest"
              value={formatGBP(calc.totalInterest)}
            />
            <ResultCard label="Loan amount" value={formatGBP(loanAmount)} />
            <ResultCard label="LTV" value={`${ltv}%`} />
          </div>

          {/* Pie chart */}
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Principal vs Interest
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  <Cell fill="#16A34A" />
                  <Cell fill="#D1D5DB" />
                </Pie>
                <Legend />
                <Tooltip
                  formatter={(value) => formatGBP(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Balance chart */}
      <div className="mt-8 bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Mortgage Balance Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={calc.balanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12 }}
              label={{ value: "Years", position: "bottom", offset: -5 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) =>
                `£${(v / 1000).toFixed(0)}k`
              }
            />
            <Tooltip formatter={(value) => formatGBP(Number(value))} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#16A34A"
              strokeWidth={2}
              dot={false}
              name="Balance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Amortization table */}
      <div className="mt-6">
        <button
          onClick={() => setShowTable(!showTable)}
          className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
        >
          {showTable ? "Hide" : "Show"} yearly breakdown
        </button>
        {showTable && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted font-medium">
                    Year
                  </th>
                  <th className="text-right py-2 px-3 text-muted font-medium">
                    Opening Balance
                  </th>
                  <th className="text-right py-2 px-3 text-muted font-medium">
                    Interest
                  </th>
                  <th className="text-right py-2 px-3 text-muted font-medium">
                    Principal
                  </th>
                  <th className="text-right py-2 px-3 text-muted font-medium">
                    Closing Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {calc.schedule.map((row) => (
                  <tr
                    key={row.year}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-2 px-3">{row.year}</td>
                    <td className="py-2 px-3 text-right">
                      {formatGBP(row.openBal)}
                    </td>
                    <td className="py-2 px-3 text-right text-red-600">
                      {formatGBP(row.interestPaid)}
                    </td>
                    <td className="py-2 px-3 text-right text-green-600">
                      {formatGBP(row.principalPaid)}
                    </td>
                    <td className="py-2 px-3 text-right font-medium">
                      {formatGBP(row.closeBal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InsightBox>
        <p>{insight}</p>
      </InsightBox>
    </CalculatorLayout>
  );
}
