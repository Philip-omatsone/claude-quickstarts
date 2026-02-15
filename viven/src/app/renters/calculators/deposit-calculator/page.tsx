"use client";

import { useState, useMemo } from "react";
import { Wallet } from "lucide-react";
import {
  CalculatorLayout,
  InputField,
  ResultCard,
  InsightBox,
  formatGBP,
} from "@/components/calculators/CalculatorLayout";

export default function DepositCalculatorPage() {
  const [monthlyRent, setMonthlyRent] = useState(1200);
  const [agentFee, setAgentFee] = useState(0);
  const [referencingFee, setReferencingFee] = useState(0);
  const [removals, setRemovals] = useState(300);
  const [furnishing, setFurnishing] = useState(500);

  const calc = useMemo(() => {
    const deposit = Math.round(monthlyRent * (5 / 4.333)); // ~5 weeks
    const firstMonth = monthlyRent;
    const total = deposit + firstMonth + agentFee + referencingFee + removals + furnishing;
    return { deposit, firstMonth, total };
  }, [monthlyRent, agentFee, referencingFee, removals, furnishing]);

  return (
    <CalculatorLayout
      title="Rental Deposit Calculator"
      subtitle="Total upfront costs when renting a new place"
      icon={Wallet}
      backHref="/renters/calculators"
      backLabel="All Calculators"
      methodology={`Since June 2019, the Tenant Fees Act caps deposits at 5 weeks' rent for annual rent under £50,000, or 6 weeks' rent above £50,000. This calculator uses the 5-week cap.\n\nDeposit = (Monthly rent × 12 / 52) × 5 weeks`}
      faqs={[
        { q: "How much is a rental deposit?", a: "By law, the maximum deposit a landlord can charge is 5 weeks' rent (if annual rent is under £50,000). On £1,200/month rent, that's approximately £1,385." },
        { q: "When do I get my deposit back?", a: "Your deposit must be returned within 10 days of agreement on the amount after you move out. It must be protected in a government-approved scheme (DPS, MyDeposits, or TDS)." },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5 bg-white rounded-xl border border-border p-6">
          <InputField label="Monthly rent" value={monthlyRent} onChange={(v) => setMonthlyRent(Number(v) || 0)} prefix="£" />
          <InputField label="Agent fee (if any)" value={agentFee} onChange={(v) => setAgentFee(Number(v) || 0)} prefix="£" />
          <InputField label="Referencing fee" value={referencingFee} onChange={(v) => setReferencingFee(Number(v) || 0)} prefix="£" />
          <InputField label="Removals / van hire" value={removals} onChange={(v) => setRemovals(Number(v) || 0)} prefix="£" />
          <InputField label="Furnishing / essentials" value={furnishing} onChange={(v) => setFurnishing(Number(v) || 0)} prefix="£" />
        </div>

        <div className="space-y-4">
          <ResultCard label="Total upfront costs" value={formatGBP(calc.total)} large />
          <div className="bg-white rounded-xl border border-border p-4 space-y-2 text-sm">
            {[
              { label: "Deposit (5 weeks)", value: calc.deposit },
              { label: "First month's rent", value: calc.firstMonth },
              { label: "Agent fee", value: agentFee },
              { label: "Referencing", value: referencingFee },
              { label: "Removals", value: removals },
              { label: "Furnishing", value: furnishing },
            ].filter(i => i.value > 0).map((item) => (
              <div key={item.label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-muted">{item.label}</span>
                <span className="font-medium">{formatGBP(item.value)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-bold border-t-2">
              <span>Total</span>
              <span className="text-primary">{formatGBP(calc.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <InsightBox>
        <p>
          Since the Tenant Fees Act 2019, landlords in England can only charge the deposit (capped at 5 weeks) and the first month&apos;s rent upfront. Any other fees charged to tenants are banned. Your deposit must be protected in a government-approved scheme within 30 days.
        </p>
      </InsightBox>
    </CalculatorLayout>
  );
}
