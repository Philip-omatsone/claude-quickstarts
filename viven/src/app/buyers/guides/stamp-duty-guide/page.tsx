"use client";

import { Receipt } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function StampDutyGuidePage() {
  return (
    <GuideLayout
      title="Stamp Duty Land Tax (SDLT) Explained"
      subtitle="A clear guide to how stamp duty works in England and Northern Ireland, current rates, first-time buyer relief, and how to calculate what you owe."
      icon={Receipt}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="6 min"
      relatedLinks={[
        { label: "Stamp Duty Calculator", href: "/buyers/calculators/stamp-duty" },
        { label: "First-Time Buyer Guide", href: "/buyers/guides/first-time-buyers" },
        { label: "Buying Process Guide", href: "/buyers/guides/process" },
        { label: "Solicitors & Conveyancing", href: "/buyers/guides/solicitors" },
      ]}
    >
      <GuideSection title="What Is Stamp Duty?">
        <p>
          Stamp Duty Land Tax (SDLT) is a tax you pay when buying property or land in England and
          Northern Ireland above a certain price threshold. It is one of the most significant
          additional costs of buying a home and should be factored into your budget from the
          outset. The tax is calculated as a percentage of the property price, with different
          rates applying to different portions of the price.
        </p>
        <p>
          Scotland has its own equivalent called Land and Buildings Transaction Tax (LBTT), and
          Wales uses Land Transaction Tax (LTT). The rates and thresholds for these are different
          from SDLT, so if you are buying in Scotland or Wales, check the relevant government
          website for current rates.
        </p>
      </GuideSection>

      <GuideSection title="Current SDLT Rates for Residential Property">
        <p>
          SDLT works on a tiered system, similar to income tax. You only pay the higher rate on
          the portion of the purchase price that falls within each band. The current standard
          rates for residential property in England and Northern Ireland are:
        </p>
        <p>
          <strong>Up to £250,000:</strong> 0% (no stamp duty payable).
        </p>
        <p>
          <strong>£250,001 to £925,000:</strong> 5% on the portion above £250,000.
        </p>
        <p>
          <strong>£925,001 to £1,500,000:</strong> 10% on the portion above £925,000.
        </p>
        <p>
          <strong>Over £1,500,000:</strong> 12% on the portion above £1,500,000.
        </p>
        <p>
          For example, if you buy a property for £400,000, you would pay 0% on the first £250,000
          and 5% on the remaining £150,000, giving you a total SDLT bill of £7,500. The tax is
          progressive, so each band only applies to the portion of the price within that range.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> SDLT thresholds and rates can change in government budgets.
          Always check the current rates on the GOV.UK website or use our stamp duty calculator
          for up-to-date figures before budgeting for your purchase.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="First-Time Buyer Relief">
        <p>
          First-time buyers in England and Northern Ireland benefit from enhanced stamp duty
          thresholds. If you are buying your first home and the purchase price is £625,000 or less,
          you pay no SDLT on the first £425,000 and 5% on the portion between £425,001 and
          £625,000.
        </p>
        <p>
          For example, a first-time buyer purchasing a property for £500,000 would pay 0% on the
          first £425,000 and 5% on the remaining £75,000, giving a total SDLT bill of just £3,750.
          A non-first-time buyer purchasing the same property would pay £12,500.
        </p>
        <p>
          To qualify for first-time buyer relief, you must never have owned a property or a share
          of a property anywhere in the world. If you are buying with another person, both of you
          must be first-time buyers. If the property costs more than £625,000, you cannot claim
          first-time buyer relief at all and must pay the standard rates on the entire purchase
          price.
        </p>

        <GuideCallout type="warning">
          <strong>Important:</strong> The £625,000 ceiling means that first-time buyer relief
          is an all-or-nothing benefit for more expensive purchases. If you are looking at
          properties around this threshold, be aware that paying £625,001 instead of £625,000
          could cost you thousands more in stamp duty because you lose the entire relief.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Higher Rates for Additional Properties">
        <p>
          If you already own a residential property (including buy-to-let or inherited properties)
          and you are purchasing an additional property, you will pay a 5% surcharge on top of the
          standard SDLT rates. This higher rate applies to the entire purchase price, not just the
          amount above each threshold.
        </p>
        <p>
          However, if you are replacing your main residence (for example, buying a new home and
          selling your current one), you may be able to claim a refund of the additional rate. You
          must sell your previous main residence within 36 months of purchasing the new one to
          qualify for the refund.
        </p>
        <p>
          The additional property surcharge also applies to non-UK residents purchasing property in
          England and Northern Ireland, who pay a further 2% on top of any other applicable rates.
          This means a non-UK resident buying a second property could face a total surcharge of 7%
          above the standard rates.
        </p>
      </GuideSection>

      <GuideSection title="When and How to Pay">
        <p>
          SDLT must be paid within 14 days of the completion date. In practice, your solicitor or
          conveyancer handles the payment on your behalf. They will submit an SDLT return to HMRC
          and pay the tax using funds you have provided as part of the completion process. You
          should ensure your solicitor has the SDLT amount included in your completion statement.
        </p>
        <p>
          Even if no SDLT is due (for example, because the property is below the threshold), a
          return must still be filed with HMRC for properties over £40,000. Failure to file the
          return or pay the tax on time can result in penalties and interest charges.
        </p>
      </GuideSection>

      <GuideSection title="Reducing Your SDLT Bill">
        <p>
          While there is limited scope to reduce stamp duty, there are a few legitimate strategies
          to consider:
        </p>
        <p>
          <strong>Negotiate the price below a threshold:</strong> If the property is close to an
          SDLT band, negotiating even a small reduction in price could save you a meaningful amount
          in tax. For example, reducing the price from £260,000 to £250,000 would save £500 in
          SDLT.
        </p>
        <p>
          <strong>Claim first-time buyer relief:</strong> If you qualify, make sure your solicitor
          applies the relief on your SDLT return. It is not applied automatically.
        </p>
        <p>
          <strong>Separate chattels:</strong> Items that are not fixtures (such as freestanding
          furniture, curtains, or appliances) can sometimes be excluded from the property price
          for SDLT purposes if they are bought separately at a fair market value. Your solicitor
          can advise on what qualifies.
        </p>
        <p>
          <strong>Shared ownership:</strong> If buying through a shared ownership scheme, you may
          have the option to pay SDLT on the initial share only (market value election) or on the
          full market value. Your solicitor can advise which is more beneficial based on the share
          you are purchasing and the full property value.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Use our stamp duty calculator to model different scenarios before
          making an offer. Understanding the SDLT implications at different price points can
          inform your negotiation strategy and help you budget accurately.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
