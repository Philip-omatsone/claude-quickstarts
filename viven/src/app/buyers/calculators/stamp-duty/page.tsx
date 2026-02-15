"use client";

import { useState, useMemo } from "react";
import { Receipt } from "lucide-react";
import {
  CalculatorLayout,
  InputField,
  ToggleGroup,
  ResultCard,
  InsightBox,
  formatGBP,
} from "@/components/calculators/CalculatorLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// SDLT bands (England & NI) — from April 2025
const BANDS_STANDARD = [
  { from: 0, to: 125000, rate: 0 },
  { from: 125001, to: 250000, rate: 0.02 },
  { from: 250001, to: 925000, rate: 0.05 },
  { from: 925001, to: 1500000, rate: 0.10 },
  { from: 1500001, to: Infinity, rate: 0.12 },
];

const BANDS_FTB = [
  { from: 0, to: 300000, rate: 0 },
  { from: 300001, to: 500000, rate: 0.05 },
  // If > £625k, standard rates apply (handled in logic)
];

const ADDITIONAL_SURCHARGE = 0.05;

// Scotland LBTT
const BANDS_SCOTLAND_STANDARD = [
  { from: 0, to: 145000, rate: 0 },
  { from: 145001, to: 250000, rate: 0.02 },
  { from: 250001, to: 325000, rate: 0.05 },
  { from: 325001, to: 750000, rate: 0.10 },
  { from: 750001, to: Infinity, rate: 0.12 },
];

const BANDS_SCOTLAND_FTB = [
  { from: 0, to: 175000, rate: 0 },
  { from: 175001, to: 250000, rate: 0.02 },
  { from: 250001, to: 325000, rate: 0.05 },
  { from: 325001, to: 750000, rate: 0.10 },
  { from: 750001, to: Infinity, rate: 0.12 },
];

const SCOTLAND_ADS = 0.06;

// Wales LTT
const BANDS_WALES_STANDARD = [
  { from: 0, to: 225000, rate: 0 },
  { from: 225001, to: 400000, rate: 0.06 },
  { from: 400001, to: 750000, rate: 0.075 },
  { from: 750001, to: 1500000, rate: 0.10 },
  { from: 1500001, to: Infinity, rate: 0.12 },
];

const WALES_HIGHER = 0.04;

function calcTax(
  price: number,
  bands: { from: number; to: number; rate: number }[],
  surcharge: number = 0
): { total: number; breakdown: { band: string; amount: number; rate: number; tax: number }[] } {
  let total = 0;
  const breakdown: { band: string; amount: number; rate: number; tax: number }[] = [];

  for (const band of bands) {
    if (price <= band.from) break;
    const taxable = Math.min(price, band.to === Infinity ? price : band.to) - band.from + (band.from === 0 ? 0 : 0);
    const amountInBand = Math.min(price - band.from, (band.to === Infinity ? price : band.to) - band.from);
    if (amountInBand <= 0) continue;
    const effectiveRate = band.rate + surcharge;
    const tax = amountInBand * effectiveRate;
    total += tax;
    breakdown.push({
      band: band.to === Infinity
        ? `${formatGBP(band.from)}+`
        : `${formatGBP(band.from)} – ${formatGBP(band.to)}`,
      amount: Math.round(amountInBand),
      rate: effectiveRate,
      tax: Math.round(tax),
    });
  }

  return { total: Math.round(total), breakdown };
}

export default function StampDutyCalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [buyerType, setBuyerType] = useState("ftb");
  const [country, setCountry] = useState("england");
  const [compareMode, setCompareMode] = useState(false);

  const result = useMemo(() => {
    if (country === "scotland") {
      const bands =
        buyerType === "ftb" ? BANDS_SCOTLAND_FTB : BANDS_SCOTLAND_STANDARD;
      const surcharge = buyerType === "additional" ? SCOTLAND_ADS : 0;
      return calcTax(propertyPrice, bands, surcharge);
    }

    if (country === "wales") {
      const surcharge = buyerType === "additional" ? WALES_HIGHER : 0;
      return calcTax(propertyPrice, BANDS_WALES_STANDARD, surcharge);
    }

    // England & NI
    if (buyerType === "ftb" && propertyPrice <= 625000) {
      return calcTax(propertyPrice, BANDS_FTB);
    }

    const surcharge = buyerType === "additional" ? ADDITIONAL_SURCHARGE : 0;
    return calcTax(propertyPrice, BANDS_STANDARD, surcharge);
  }, [propertyPrice, buyerType, country]);

  const comparison = useMemo(() => {
    if (!compareMode) return null;
    const types = ["ftb", "standard", "additional"] as const;
    return types.map((type) => {
      let r;
      if (country === "scotland") {
        const bands =
          type === "ftb" ? BANDS_SCOTLAND_FTB : BANDS_SCOTLAND_STANDARD;
        const surcharge = type === "additional" ? SCOTLAND_ADS : 0;
        r = calcTax(propertyPrice, bands, surcharge);
      } else if (country === "wales") {
        const surcharge = type === "additional" ? WALES_HIGHER : 0;
        r = calcTax(propertyPrice, BANDS_WALES_STANDARD, surcharge);
      } else {
        if (type === "ftb" && propertyPrice <= 625000) {
          r = calcTax(propertyPrice, BANDS_FTB);
        } else {
          const surcharge = type === "additional" ? ADDITIONAL_SURCHARGE : 0;
          r = calcTax(propertyPrice, BANDS_STANDARD, surcharge);
        }
      }
      return {
        type,
        label:
          type === "ftb"
            ? "First-time buyer"
            : type === "standard"
              ? "Next home"
              : "Additional property",
        total: r.total,
      };
    });
  }, [compareMode, propertyPrice, country]);

  const effectiveRate =
    propertyPrice > 0
      ? ((result.total / propertyPrice) * 100).toFixed(2)
      : "0.00";

  const taxName =
    country === "scotland"
      ? "LBTT"
      : country === "wales"
        ? "LTT"
        : "Stamp Duty (SDLT)";

  const chartData = result.breakdown.map((b) => ({
    band: b.band,
    tax: b.tax,
    rate: `${(b.rate * 100).toFixed(0)}%`,
  }));

  const ftbSaving = useMemo(() => {
    if (buyerType !== "ftb" || country !== "england") return 0;
    const standardResult = calcTax(propertyPrice, BANDS_STANDARD);
    return standardResult.total - result.total;
  }, [buyerType, propertyPrice, country, result.total]);

  return (
    <CalculatorLayout
      title={`${taxName} Calculator`}
      subtitle="Calculate your stamp duty land tax"
      icon={Receipt}
      backHref="/buyers/calculators"
      backLabel="All Calculators"
      methodology={`Stamp duty is calculated on a tiered basis — you only pay each rate on the portion of the price within that band (similar to income tax).\n\nFirst-time buyers in England pay 0% on the first £300,000 and 5% on the portion from £300,001 to £500,000 (only on properties up to £625,000).\n\nAdditional properties (buy-to-let, second homes) attract a 5% surcharge on all bands.\n\nScotland uses LBTT with different bands, and Wales uses LTT.`}
      faqs={[
        {
          q: "How much stamp duty do I pay on a £300,000 house?",
          a: "As a first-time buyer in England, you pay £0 in stamp duty on a £300,000 property. As a next-home buyer, you'd pay £2,500. As an additional property buyer, £17,500.",
        },
        {
          q: "When do I pay stamp duty?",
          a: "Stamp duty must be paid within 14 days of completion. Your solicitor will handle this as part of the conveyancing process and will usually collect the funds before completion.",
        },
        {
          q: "Do first-time buyers pay stamp duty?",
          a: "First-time buyers in England and NI pay no stamp duty on properties up to £300,000, and 5% on the portion between £300,001 and £500,000. This relief only applies to properties costing £625,000 or less.",
        },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5 bg-white rounded-xl border border-border p-6">
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

          <ToggleGroup
            label="Country"
            options={[
              { value: "england", label: "England & NI" },
              { value: "scotland", label: "Scotland" },
              { value: "wales", label: "Wales" },
            ]}
            value={country}
            onChange={setCountry}
          />

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="accent-primary"
            />
            <span className="text-muted">
              Compare all buyer types side by side
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <ResultCard
            label={`${taxName} payable`}
            value={formatGBP(result.total)}
            large
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Effective tax rate"
              value={`${effectiveRate}%`}
            />
            <ResultCard
              label="Property price"
              value={formatGBP(propertyPrice)}
            />
          </div>

          {ftbSaving > 0 && (
            <div className="bg-primary-light border border-primary/20 rounded-xl p-3 text-center">
              <p className="text-sm text-primary font-medium">
                You save {formatGBP(ftbSaving)} as a first-time buyer
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Band breakdown */}
      <div className="mt-8 bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Tax by Band
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted font-medium">Band</th>
                <th className="text-right py-2 px-3 text-muted font-medium">Amount in band</th>
                <th className="text-right py-2 px-3 text-muted font-medium">Rate</th>
                <th className="text-right py-2 px-3 text-muted font-medium">Tax</th>
              </tr>
            </thead>
            <tbody>
              {result.breakdown.map((b, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-2 px-3">{b.band}</td>
                  <td className="py-2 px-3 text-right">{formatGBP(b.amount)}</td>
                  <td className="py-2 px-3 text-right">{(b.rate * 100).toFixed(0)}%</td>
                  <td className="py-2 px-3 text-right font-medium">{formatGBP(b.tax)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="py-2 px-3" colSpan={3}>Total</td>
                <td className="py-2 px-3 text-right text-primary">{formatGBP(result.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {chartData.length > 0 && (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tickFormatter={(v) => formatGBP(v)} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="band" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={(value) => formatGBP(Number(value))} />
                <Bar dataKey="tax" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#D1D5DB" : "#16A34A"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Comparison mode */}
      {comparison && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          {comparison.map((c) => (
            <div
              key={c.type}
              className={`rounded-xl border p-4 text-center ${c.type === buyerType ? "border-primary bg-primary-light" : "border-border bg-white"}`}
            >
              <p className="text-xs text-muted">{c.label}</p>
              <p className="text-lg font-heading font-bold mt-1">
                {formatGBP(c.total)}
              </p>
            </div>
          ))}
        </div>
      )}

      <InsightBox>
        <p>
          {buyerType === "ftb" && propertyPrice <= 300000
            ? "Great news — as a first-time buyer, you won't pay any stamp duty on this property."
            : buyerType === "additional"
              ? `The 5% additional property surcharge adds ${formatGBP(propertyPrice * 0.05)} to your stamp duty bill. Factor this into your investment calculations.`
              : `At ${formatGBP(propertyPrice)}, your effective tax rate is ${effectiveRate}%. Remember to budget for this alongside your deposit and other buying costs.`}
        </p>
      </InsightBox>
    </CalculatorLayout>
  );
}
