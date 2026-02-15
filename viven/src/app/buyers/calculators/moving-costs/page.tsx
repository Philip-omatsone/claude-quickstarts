"use client";

import { useState, useMemo } from "react";
import { Truck } from "lucide-react";
import {
  CalculatorLayout,
  InputField,
  ToggleGroup,
  ResultCard,
  InsightBox,
  formatGBP,
} from "@/components/calculators/CalculatorLayout";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// SDLT quick calc (England, simplified)
function quickSDLT(price: number, buyerType: string): number {
  if (buyerType === "ftb" && price <= 625000) {
    if (price <= 300000) return 0;
    return Math.round((price - 300000) * 0.05);
  }
  const surcharge = buyerType === "additional" ? 0.05 : 0;
  let tax = 0;
  const bands = [
    { to: 125000, rate: 0 },
    { to: 250000, rate: 0.02 },
    { to: 925000, rate: 0.05 },
    { to: 1500000, rate: 0.10 },
    { to: Infinity, rate: 0.12 },
  ];
  let prev = 0;
  for (const b of bands) {
    if (price <= prev) break;
    const taxable = Math.min(price, b.to) - prev;
    tax += taxable * (b.rate + surcharge);
    prev = b.to;
  }
  return Math.round(tax);
}

// Land Registry fees
function landRegistryFee(price: number): number {
  if (price <= 80000) return 20;
  if (price <= 100000) return 40;
  if (price <= 200000) return 100;
  if (price <= 500000) return 150;
  if (price <= 1000000) return 295;
  return 500;
}

export default function MovingCostsCalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [buyerType, setBuyerType] = useState("ftb");
  const [deposit, setDeposit] = useState(30000);
  const [mortgageFee, setMortgageFee] = useState(999);
  const [surveyType, setSurveyType] = useState("homebuyer");
  const [solicitorFees, setSolicitorFees] = useState(1200);
  const [searches, setSearches] = useState(300);
  const [removals, setRemovals] = useState(800);
  const [brokerFee, setBrokerFee] = useState(500);
  const [insurance, setInsurance] = useState(300);

  const surveyCost = surveyType === "valuation" ? 300 : surveyType === "homebuyer" ? 550 : 1000;
  const stampDuty = useMemo(() => quickSDLT(propertyPrice, buyerType), [propertyPrice, buyerType]);
  const lrFee = useMemo(() => landRegistryFee(propertyPrice), [propertyPrice]);
  const bankTransfer = 35;
  const idVerification = 15;

  const totalFees =
    stampDuty +
    solicitorFees +
    searches +
    surveyCost +
    mortgageFee +
    brokerFee +
    removals +
    lrFee +
    bankTransfer +
    idVerification +
    insurance;

  const totalUpfront = deposit + totalFees;

  const costItems = [
    { name: "Deposit", value: deposit, color: "#16A34A" },
    { name: "Stamp Duty", value: stampDuty, color: "#EAB308" },
    { name: "Solicitor", value: solicitorFees + searches, color: "#3B82F6" },
    { name: "Survey", value: surveyCost, color: "#8B5CF6" },
    { name: "Mortgage fee", value: mortgageFee, color: "#EC4899" },
    { name: "Broker", value: brokerFee, color: "#F97316" },
    { name: "Removals", value: removals, color: "#14B8A6" },
    { name: "Other", value: lrFee + bankTransfer + idVerification + insurance, color: "#6B7280" },
  ].filter((c) => c.value > 0);

  // Monthly costs estimate
  const loanAmount = propertyPrice - deposit;
  const r = 0.045 / 12;
  const n = 25 * 12;
  const monthlyMortgage =
    loanAmount > 0
      ? loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : 0;
  const monthlyInsurance = Math.round(insurance / 12);
  const councilTax = 150; // estimate
  const energy = 130; // estimate
  const totalMonthly = Math.round(monthlyMortgage) + monthlyInsurance + councilTax + energy;

  return (
    <CalculatorLayout
      title="Total Moving Costs Calculator"
      subtitle="See the true total cost of buying a home"
      icon={Truck}
      backHref="/buyers/calculators"
      backLabel="All Calculators"
      methodology={`This calculator totals every cost involved in buying a property: deposit, stamp duty (auto-calculated), solicitor fees, searches, survey, mortgage arrangement fee, broker fee, removals, Land Registry fee, bank transfer fees, and buildings insurance.\n\nLand Registry fees are based on the official scale. Stamp duty is calculated using the current SDLT rates for England & NI.`}
      faqs={[
        {
          q: "How much does it cost to buy a house beyond the deposit?",
          a: "Typically 3-5% of the property price in fees and costs on top of your deposit. On a £300,000 property, expect £8,000-£15,000 in additional costs including stamp duty, solicitor, survey, and broker fees.",
        },
        {
          q: "Which survey should I get?",
          a: "A HomeBuyer Report (Level 2) is suitable for most standard properties built after 1900 in reasonable condition. A Full Building Survey (Level 3) is recommended for older, unusual, or properties you plan to renovate.",
        },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 bg-white rounded-xl border border-border p-6">
          <InputField
            label="Property price"
            value={propertyPrice}
            onChange={(v) => setPropertyPrice(Number(v) || 0)}
            prefix="£"
          />
          <ToggleGroup
            label="Buyer type"
            options={[
              { value: "ftb", label: "First-time" },
              { value: "standard", label: "Next home" },
              { value: "additional", label: "Additional" },
            ]}
            value={buyerType}
            onChange={setBuyerType}
          />
          <InputField
            label="Deposit"
            value={deposit}
            onChange={(v) => setDeposit(Number(v) || 0)}
            prefix="£"
          />
          <InputField
            label="Mortgage arrangement fee"
            value={mortgageFee}
            onChange={(v) => setMortgageFee(Number(v) || 0)}
            prefix="£"
          />
          <ToggleGroup
            label="Survey type"
            options={[
              { value: "valuation", label: "Valuation" },
              { value: "homebuyer", label: "HomeBuyer" },
              { value: "full", label: "Full Survey" },
            ]}
            value={surveyType}
            onChange={setSurveyType}
          />
          <InputField
            label="Solicitor fees"
            value={solicitorFees}
            onChange={(v) => setSolicitorFees(Number(v) || 0)}
            prefix="£"
          />
          <InputField
            label="Searches (local authority)"
            value={searches}
            onChange={(v) => setSearches(Number(v) || 0)}
            prefix="£"
          />
          <InputField
            label="Removals"
            value={removals}
            onChange={(v) => setRemovals(Number(v) || 0)}
            prefix="£"
          />
          <InputField
            label="Broker fee"
            value={brokerFee}
            onChange={(v) => setBrokerFee(Number(v) || 0)}
            prefix="£"
          />
          <InputField
            label="Buildings insurance (annual)"
            value={insurance}
            onChange={(v) => setInsurance(Number(v) || 0)}
            prefix="£"
          />
        </div>

        <div className="space-y-4">
          <ResultCard
            label="What you'll need in the bank"
            value={formatGBP(totalUpfront)}
            large
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="Deposit" value={formatGBP(deposit)} />
            <ResultCard label="Stamp Duty" value={formatGBP(stampDuty)} sublabel="Auto-calculated" />
            <ResultCard label="All fees" value={formatGBP(totalFees - stampDuty)} />
            <ResultCard label="Fees as % of price" value={`${((totalFees / propertyPrice) * 100).toFixed(1)}%`} />
          </div>

          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Cost Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={costItems}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    (percent ?? 0) > 0.03 ? `${name}` : ""
                  }
                >
                  {costItems.map((item, i) => (
                    <Cell key={i} fill={item.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => formatGBP(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly costs */}
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Estimated Monthly Costs from Day 1
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Mortgage</span>
                <span className="font-medium">{formatGBP(Math.round(monthlyMortgage))}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Buildings insurance</span>
                <span className="font-medium">{formatGBP(monthlyInsurance)}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Council tax (est.)</span>
                <span className="font-medium">{formatGBP(councilTax)}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Energy (est.)</span>
                <span className="font-medium">{formatGBP(energy)}/mo</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-bold">
                <span>Total monthly</span>
                <span className="text-primary">{formatGBP(totalMonthly)}/mo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemised table */}
      <div className="mt-8 bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Full Itemised Breakdown
        </h3>
        <div className="space-y-2 text-sm">
          {[
            { label: "Deposit", value: deposit },
            { label: "Stamp Duty (SDLT)", value: stampDuty },
            { label: "Solicitor / Conveyancer", value: solicitorFees },
            { label: "Local Authority Searches", value: searches },
            { label: `Survey (${surveyType === "valuation" ? "Valuation" : surveyType === "homebuyer" ? "HomeBuyer Report" : "Full Building Survey"})`, value: surveyCost },
            { label: "Mortgage arrangement fee", value: mortgageFee },
            { label: "Mortgage broker fee", value: brokerFee },
            { label: "Land Registry fee", value: lrFee },
            { label: "Bank transfer fee", value: bankTransfer },
            { label: "Electronic ID verification", value: idVerification },
            { label: "Buildings insurance", value: insurance },
            { label: "Removals", value: removals },
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-1.5 border-b border-border last:border-0">
              <span className="text-muted">{item.label}</span>
              <span className="font-medium">{formatGBP(item.value)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 font-bold text-base border-t-2 border-foreground">
            <span>Total</span>
            <span className="text-primary">{formatGBP(totalUpfront)}</span>
          </div>
        </div>
      </div>

      <InsightBox>
        <p>
          Beyond the deposit, you&apos;re looking at {formatGBP(totalFees)} in fees
          and costs — that&apos;s {((totalFees / propertyPrice) * 100).toFixed(1)}%
          of the property price. The biggest surprise for most first-time buyers
          is how much solicitor searches and surveys add up. Budget an extra 3-5%
          of the property price for total moving costs.
        </p>
      </InsightBox>
    </CalculatorLayout>
  );
}
