"use client";

import { useState, useMemo } from "react";
import { Lightbulb } from "lucide-react";
import {
  CalculatorLayout,
  InputField,
  ToggleGroup,
  ResultCard,
  InsightBox,
  formatGBP,
} from "@/components/calculators/CalculatorLayout";

const COUNCIL_TAX_ESTIMATES: Record<string, number> = {
  A: 95, B: 110, C: 130, D: 150, E: 180, F: 210, G: 250, H: 300,
};

export default function BillsEstimatorPage() {
  const [bedrooms, setBedrooms] = useState("2");
  const [councilTaxBand, setCouncilTaxBand] = useState("C");
  const [energy, setEnergy] = useState(130);
  const [water, setWater] = useState(35);
  const [broadband, setBroadband] = useState(30);
  const [tvLicense, setTvLicense] = useState(13);
  const [insurance, setInsurance] = useState(15);
  const [phone, setPhone] = useState(25);

  const councilTax = COUNCIL_TAX_ESTIMATES[councilTaxBand] || 150;

  const total = useMemo(
    () => councilTax + energy + water + broadband + tvLicense + insurance + phone,
    [councilTax, energy, water, broadband, tvLicense, insurance, phone]
  );

  return (
    <CalculatorLayout
      title="Bills Estimator"
      subtitle="Estimate your monthly household bills"
      icon={Lightbulb}
      backHref="/renters/calculators"
      backLabel="All Calculators"
      methodology={`Council tax estimates are based on average Band ${councilTaxBand} rates across England. Actual amounts vary by local authority. Energy is based on Ofgem price cap estimates. Water varies by region.`}
      faqs={[
        { q: "How much are bills for a 2-bed flat?", a: "For a typical 2-bed flat, expect to pay around £350-£500/month in total bills including council tax, energy, water, broadband, and insurance." },
        { q: "Are bills included in rent?", a: "Some rentals are 'bills inclusive' but most are not. Always clarify exactly what's included before signing. Even 'all bills included' may exclude council tax." },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 bg-white rounded-xl border border-border p-6">
          <ToggleGroup
            label="Bedrooms"
            options={[
              { value: "1", label: "1 bed" },
              { value: "2", label: "2 bed" },
              { value: "3", label: "3 bed" },
              { value: "4", label: "4+ bed" },
            ]}
            value={bedrooms}
            onChange={setBedrooms}
          />
          <ToggleGroup
            label="Council tax band"
            options={[
              { value: "A", label: "A" },
              { value: "B", label: "B" },
              { value: "C", label: "C" },
              { value: "D", label: "D" },
            ]}
            value={councilTaxBand}
            onChange={setCouncilTaxBand}
          />
          <InputField label="Energy (gas + electric)" value={energy} onChange={(v) => setEnergy(Number(v) || 0)} prefix="£" suffix="/mo" />
          <InputField label="Water" value={water} onChange={(v) => setWater(Number(v) || 0)} prefix="£" suffix="/mo" />
          <InputField label="Broadband" value={broadband} onChange={(v) => setBroadband(Number(v) || 0)} prefix="£" suffix="/mo" />
          <InputField label="TV licence" value={tvLicense} onChange={(v) => setTvLicense(Number(v) || 0)} prefix="£" suffix="/mo" />
          <InputField label="Contents insurance" value={insurance} onChange={(v) => setInsurance(Number(v) || 0)} prefix="£" suffix="/mo" />
          <InputField label="Mobile phone" value={phone} onChange={(v) => setPhone(Number(v) || 0)} prefix="£" suffix="/mo" />
        </div>

        <div className="space-y-4">
          <ResultCard label="Total monthly bills" value={`${formatGBP(total)}/mo`} large />
          <ResultCard label="Annual bills" value={formatGBP(total * 12)} />
          <div className="bg-white rounded-xl border border-border p-4 space-y-2">
            {[
              { label: "Council tax", value: councilTax, color: "bg-blue-400" },
              { label: "Energy", value: energy, color: "bg-amber-400" },
              { label: "Water", value: water, color: "bg-sky-400" },
              { label: "Broadband", value: broadband, color: "bg-purple-400" },
              { label: "TV licence", value: tvLicense, color: "bg-gray-400" },
              { label: "Insurance", value: insurance, color: "bg-green-400" },
              { label: "Phone", value: phone, color: "bg-pink-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                <span className="text-sm text-muted flex-1">{item.label}</span>
                <span className="text-sm font-medium">{formatGBP(item.value)}/mo</span>
                <span className="text-xs text-muted w-10 text-right">{total > 0 ? Math.round((item.value / total) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InsightBox>
        <p>
          Council tax and energy are typically the biggest bills. If you&apos;re on a low income, you may be eligible for council tax reduction — check with your local authority. The single person discount (25% off) applies if you live alone.
        </p>
      </InsightBox>
    </CalculatorLayout>
  );
}
