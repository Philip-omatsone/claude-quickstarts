"use client";

import { Mail } from "lucide-react";
import { TemplateLayout } from "@/components/templates/TemplateLayout";

const template = `Subject: Request for Return of Tenancy Deposit — [YOUR ADDRESS]

Dear [LANDLORD / AGENT NAME],

I am writing to formally request the return of my tenancy deposit following the end of my tenancy at the above address.

My tenancy ended on [TENANCY END DATE]. I returned the keys on [DATE KEYS RETURNED] and left the property in a clean and good condition, consistent with its state at the start of the tenancy, allowing for fair wear and tear.

The details of my deposit are as follows:

- Deposit amount: [DEPOSIT AMOUNT, e.g. £1,200]
- Deposit protection scheme: [SCHEME NAME, e.g. Deposit Protection Service / MyDeposits / Tenancy Deposit Scheme]
- Tenancy start date: [TENANCY START DATE]
- Tenancy end date: [TENANCY END DATE]

Under the Housing Act 2004, my deposit must be protected in a government-approved tenancy deposit scheme for the duration of the tenancy. The deposit (or the agreed amount after any lawful deductions) should be returned within 10 days of both parties agreeing how much should be returned.

I do not believe any deductions are warranted. The property was returned in the same condition as at the start of the tenancy, accounting for reasonable wear and tear. I have photographs from both the check-in and check-out to support this.

I would be grateful if you could confirm the amount to be returned and arrange for the deposit to be released within 10 days of receiving this email. If you intend to make any deductions, please provide an itemised list with evidence to justify each deduction.

If we are unable to reach agreement, I intend to use the free Alternative Dispute Resolution (ADR) service provided by [SCHEME NAME] to resolve the matter.

Thank you for your attention to this matter.

Yours sincerely,
[YOUR FULL NAME]
[YOUR CURRENT ADDRESS]
[YOUR EMAIL ADDRESS]
[YOUR PHONE NUMBER]
[TODAY'S DATE]`;

export default function EmailDepositReturnPage() {
  return (
    <TemplateLayout
      title="Request Deposit Return"
      subtitle="Ask for your tenancy deposit back after moving out"
      icon={Mail}
      backHref="/renters/templates"
      backLabel="All Templates"
      whenToUse="Use this template after your tenancy has ended and you have returned the keys. If your landlord has not initiated the return of your deposit within 10 days, or if they are proposing deductions you disagree with, this letter sets out your position formally. Your deposit must be protected in one of the three government-approved schemes (DPS, MyDeposits, or TDS) — if it was not protected, you may be entitled to compensation of up to 3x the deposit amount."
      template={template}
      warnings={[
        "Do not accept unfair deductions without challenge. Landlords cannot deduct for fair wear and tear — for example, minor scuffs on walls, worn carpets, or faded curtains after a multi-year tenancy are normal.",
        "Every government-approved deposit scheme offers a free Alternative Dispute Resolution (ADR) service. If you and your landlord cannot agree, use this service before considering court action — it is free, impartial, and binding.",
        "If your deposit was never protected in a scheme, or if you were not given the prescribed information within 30 days of paying it, your landlord may be liable to pay you compensation of 1x to 3x the deposit amount. Seek advice from Shelter or Citizens Advice.",
        "Keep copies of your check-in inventory, check-out inventory, and any photographs from the start and end of the tenancy. These are your strongest evidence in a dispute.",
        "Your landlord cannot make deductions for pre-existing damage, improvements you made with permission, or professional cleaning unless it was required by the tenancy agreement and the property was professionally cleaned at the start.",
      ]}
    />
  );
}
