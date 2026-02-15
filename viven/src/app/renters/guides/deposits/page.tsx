"use client";

import { Shield } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
  GuideStep,
} from "@/components/guides/GuideLayout";

export default function DepositsGuidePage() {
  return (
    <GuideLayout
      title="Deposit Protection & Your Rights"
      subtitle="How tenancy deposits work in England and Wales, and how to get yours back in full."
      icon={Shield}
      backHref="/renters/guides"
      backLabel="All Guides"
      readTime="7 min"
      relatedLinks={[
        { label: "Deposit Calculator", href: "/renters/calculators/deposit-calculator" },
        { label: "End of Tenancy Guide", href: "/renters/guides/end-of-tenancy" },
        { label: "Deposit Return Email Template", href: "/renters/templates/email-deposit-return" },
        { label: "Inventory Checklist", href: "/renters/checklists/inventory" },
      ]}
    >
      <GuideSection title="What Is a Tenancy Deposit?">
        <p>
          A tenancy deposit is a sum of money you pay to your landlord or letting agent at the start
          of your tenancy. It acts as security against unpaid rent, damage to the property beyond
          normal wear and tear, or breaches of your tenancy agreement. At the end of the tenancy,
          the deposit should be returned to you in full, provided you have met your obligations.
        </p>
        <p>
          Under the Tenant Fees Act 2019, the maximum deposit a landlord can charge in England is
          five weeks&apos; rent where the total annual rent is less than £50,000, or six weeks&apos;
          rent where the annual rent is £50,000 or more. This applies to Assured Shorthold Tenancies
          only. In Wales, the cap is also broadly similar under relevant legislation.
        </p>
      </GuideSection>

      <GuideSection title="Deposit Protection Schemes">
        <p>
          In England and Wales, your landlord is legally required to protect your deposit in one of
          three government-approved tenancy deposit schemes within 30 days of receiving it. The three
          schemes are:
        </p>
        <p>
          <strong>Deposit Protection Service (DPS)</strong> — This is a custodial (free) scheme. The
          landlord pays your deposit to the DPS, which holds it for the duration of the tenancy. At
          the end, either party can request the deposit back, and it is released once both sides
          agree on any deductions.
        </p>
        <p>
          <strong>MyDeposits</strong> — Offers both custodial and insured options. With the insured
          scheme, the landlord keeps the deposit but pays MyDeposits a fee to insure it. If the
          landlord fails to return the deposit, MyDeposits will pay you and recover the money from
          the landlord.
        </p>
        <p>
          <strong>Tenancy Deposit Scheme (TDS)</strong> — Also offers custodial and insured options.
          Similar to MyDeposits, the custodial version holds the money centrally, while the insured
          version means the landlord holds it but it is insured against non-return.
        </p>
        <GuideCallout type="info">
          <strong>Prescribed Information:</strong> Your landlord must provide you with &quot;prescribed
          information&quot; about the deposit protection within 30 days of receiving the deposit.
          This includes: which scheme protects the deposit, the scheme&apos;s contact details, the
          deposit amount, the property address, what the deposit can be used for, how to apply for
          release, and what to do if there is a dispute.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="What Happens If Your Deposit Is Not Protected?">
        <p>
          If your landlord fails to protect your deposit in a government-approved scheme within 30
          days, or fails to provide you with the prescribed information, you have strong legal
          rights. The landlord cannot serve a valid Section 21 notice to evict you until the deposit
          has been properly protected and the prescribed information provided, or the deposit has been
          returned in full.
        </p>
        <p>
          You can also apply to the county court for a court order requiring the landlord to either
          protect the deposit within 14 days or return it to you. The court can award you
          compensation of between one and three times the deposit amount. This is a significant
          penalty and gives landlords a strong incentive to comply.
        </p>
        <p>
          If you suspect your deposit has not been protected, check with each of the three schemes.
          You can search online using your name, the property address, or your tenancy start date.
          If you discover your deposit is unprotected, seek advice from Citizens Advice or Shelter
          before taking any action.
        </p>
      </GuideSection>

      <GuideSection title="Getting Your Deposit Back">
        <GuideStep number={1} title="Request the Deposit in Writing">
          <p>
            At the end of your tenancy, contact your landlord or agent in writing (email is ideal)
            to request the return of your deposit. Provide your forwarding address and bank details.
            If the deposit is held in a custodial scheme, you may be able to request it directly
            through the scheme&apos;s website.
          </p>
        </GuideStep>
        <GuideStep number={2} title="Check-Out Inspection">
          <p>
            Most landlords or agents will carry out a check-out inspection at the end of the tenancy.
            They will compare the property&apos;s condition against the check-in inventory. Attend
            this inspection if possible so you can discuss any issues on the spot. If you cannot
            attend, ensure a friend or representative can be there on your behalf.
          </p>
        </GuideStep>
        <GuideStep number={3} title="Agree or Dispute Deductions">
          <p>
            If the landlord proposes deductions, they must provide evidence for each one. You are
            entitled to challenge any deduction you believe is unfair. Common deductions include
            cleaning costs, damage repairs, and unpaid rent or bills. The landlord cannot deduct for
            fair wear and tear, which is the natural deterioration that occurs through normal use
            over time.
          </p>
        </GuideStep>
        <GuideStep number={4} title="Raise a Dispute If Needed">
          <p>
            If you and the landlord cannot agree on deductions, either party can raise a dispute
            through the deposit protection scheme. The scheme will appoint an independent adjudicator
            who will review the evidence from both sides and make a binding decision. This is free
            and avoids the need for court proceedings.
          </p>
        </GuideStep>
      </GuideSection>

      <GuideCallout type="warning">
        <strong>Common unfair deductions to challenge:</strong> Repainting walls that were
        simply lived in normally (fair wear and tear), professional cleaning charges when the
        property was left in a reasonable state, replacing carpets that were already worn when you
        moved in, and charges for items that were already damaged in the check-in inventory. Always
        compare deduction claims against your move-in photos and inventory.
      </GuideCallout>

      <GuideSection title="How to Protect Yourself">
        <p>
          The single most important thing you can do to protect your deposit is to document the
          property&apos;s condition at the start and end of your tenancy. When you move in, take
          dated photographs and videos of every room, including close-ups of any existing damage,
          marks, or wear. Check the inventory report carefully and add annotations if anything is
          missing or inaccurate.
        </p>
        <p>
          During your tenancy, report any maintenance issues promptly in writing so there is a
          record that damage was not caused by you. Keep receipts for any professional cleaning you
          arrange at the end of the tenancy. On your last day, take another full set of photographs
          and final meter readings.
        </p>
        <p>
          Keep copies of all correspondence with your landlord or agent throughout the tenancy. If a
          dispute arises, this evidence trail will be crucial. The adjudication process is
          evidence-based, so the party with the better documentation almost always wins.
        </p>
      </GuideSection>

      <GuideSection title="Fair Wear and Tear">
        <p>
          Fair wear and tear is one of the most common areas of dispute between landlords and
          tenants. It refers to the natural deterioration that occurs through everyday living. Small
          scuffs on walls, light marks on carpets from furniture, and minor fading of paint are all
          examples of fair wear and tear. Your landlord cannot deduct from your deposit for these.
        </p>
        <p>
          However, large holes in walls, stains from spills, burns, pet damage, and broken fixtures
          go beyond fair wear and tear and you may be liable for the cost of repair or replacement.
          Even then, the landlord must account for the age and condition of the item. If a carpet was
          already five years old and had a life expectancy of ten years, the landlord can only claim
          for the remaining value, not the cost of a brand-new carpet. This is known as
          &quot;betterment&quot; and landlords are not entitled to it.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
