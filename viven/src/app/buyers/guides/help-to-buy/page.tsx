"use client";

import { HandHelping } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function HelpToBuyGuidePage() {
  return (
    <GuideLayout
      title="Government Schemes for Home Buyers"
      subtitle="A comprehensive overview of UK government schemes designed to help you buy a home, including the Lifetime ISA, shared ownership, First Homes, and Right to Buy."
      icon={HandHelping}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="7 min"
      relatedLinks={[
        { label: "Shared Ownership Guide", href: "/buyers/guides/shared-ownership" },
        { label: "First-Time Buyer Guide", href: "/buyers/guides/first-time-buyers" },
        { label: "Buying in London", href: "/buyers/guides/buying-in-london" },
        { label: "Stamp Duty Guide", href: "/buyers/guides/stamp-duty-guide" },
      ]}
    >
      <GuideSection title="Overview">
        <p>
          The UK government offers several schemes designed to help people get onto the property
          ladder or move up it. These programmes target first-time buyers, key workers, and existing
          social housing tenants. Each scheme has different eligibility criteria, benefits, and
          limitations. This guide covers the main schemes currently available in England, helping
          you understand which ones you may be able to take advantage of.
        </p>
        <p>
          It is worth noting that the Help to Buy Equity Loan scheme, which was one of the most
          popular government homebuying programmes, closed to new applications in October 2022
          and completed its final transactions in March 2023. The schemes described below are the
          current alternatives available to buyers.
        </p>
      </GuideSection>

      <GuideSection title="Lifetime ISA (LISA)">
        <p>
          The Lifetime ISA is a savings account that offers a 25% government bonus on contributions
          of up to £4,000 per tax year, giving you a maximum annual bonus of £1,000. You can open
          a LISA if you are aged 18 to 39, and you can continue contributing until you turn 50. The
          funds can be used towards the purchase of your first home (worth up to £450,000) or for
          retirement after age 60.
        </p>
        <p>
          The bonus is paid monthly (for cash LISAs) or when you sell investments (for stocks and
          shares LISAs). To use the funds for a home purchase, the account must have been open for
          at least 12 months. You can hold both a cash LISA and a Help to Save account, and the
          LISA can be used alongside other schemes such as shared ownership.
        </p>
        <p>
          If you withdraw money from a LISA for any purpose other than buying your first home or
          retirement after 60, you will incur a 25% withdrawal penalty. This effectively means you
          lose your government bonus and pay a penalty on top, so the LISA should be treated as a
          dedicated home-buying or retirement savings vehicle.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> If you and your partner are both first-time buyers, you can each
          open a LISA and use both towards the same property purchase. That means up to £2,000 per
          year in government bonuses between you. Open your LISAs as early as possible to start the
          12-month qualifying period.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="First Homes Scheme">
        <p>
          First Homes is a scheme that offers new-build properties to first-time buyers at a
          discount of at least 30% (and sometimes 40% or 50%) compared to the market value. The
          discount is passed on to future buyers when you sell, ensuring the property remains
          affordable in perpetuity. After the discount, the price must not exceed £250,000
          (£420,000 in London).
        </p>
        <p>
          To be eligible, you must be a first-time buyer, aged 18 or over, with a household income
          of no more than £80,000 (£90,000 in London). You must be able to secure a mortgage for
          at least 50% of the discounted price. Local councils may set additional criteria, such as
          prioritising key workers, people who live or work in the area, or those on lower incomes.
        </p>
        <p>
          When you sell a First Home, the same percentage discount is applied to the market value
          at the time of sale. For example, if you bought at a 30% discount and the property is
          worth £300,000 when you sell, the buyer would pay £210,000. This restriction is secured
          by a legal covenant on the property.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> First Homes are delivered through the planning system,
          meaning a portion of new developments may be designated as First Homes. Availability
          varies by area, and properties are typically marketed through housing associations or
          directly by developers. Check with your local council for current availability.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Shared Ownership">
        <p>
          Shared ownership allows you to buy a share of a property (between 25% and 75%) and pay
          rent on the remainder. This significantly reduces the deposit and mortgage you need. Over
          time, you can buy additional shares (&quot;staircase&quot;) up to full ownership.
        </p>
        <p>
          Eligibility requires a household income of £80,000 or less (£90,000 in London), and you
          must be a first-time buyer or an existing shared owner. The scheme is available on new-
          build properties and some resale shared ownership homes through housing associations.
        </p>
        <p>
          The new model shared ownership lease (from April 2021) includes a 10-year initial repair
          period during which the housing association covers repairs up to £500 per year, and allows
          staircasing in 1% increments for the first 15 years. For a full breakdown of how shared
          ownership works, see our dedicated shared ownership guide.
        </p>
      </GuideSection>

      <GuideSection title="Right to Buy">
        <p>
          Right to Buy allows eligible council tenants in England to purchase their council home at
          a discount. The discount depends on the type of property, how long you have been a
          tenant, and the property value. For houses, the maximum discount is £102,400 (£136,400
          in London boroughs). For flats, the maximum discount is the same but calculated
          differently as a percentage of the property value.
        </p>
        <p>
          To be eligible, you must be a secure tenant of a council or local authority property,
          your home must be self-contained, and it must be your only or main home. You usually
          need to have been a public sector tenant for at least three years (not necessarily in
          the same property or with the same landlord).
        </p>
        <p>
          Housing association tenants may qualify for the Right to Acquire scheme instead, which
          offers a smaller discount (ranging from £9,000 to £16,000 depending on the region). The
          Preserved Right to Buy applies to former council tenants whose properties were transferred
          to a housing association.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> If you buy your home through Right to Buy and sell it within
          five years, you may be required to repay some or all of the discount. The amount you must
          repay decreases by 20% for each full year you have owned the property. Your council also
          has the right of first refusal on the purchase if you sell within 10 years.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Help to Save">
        <p>
          Help to Save is a government-backed savings scheme for people on low incomes. If you
          receive Working Tax Credit or Universal Credit (with minimum earnings), you can save
          between £1 and £50 per month for four years. After two years, you receive a 50% bonus
          on the highest balance achieved (up to £600). After four years, you receive another 50%
          bonus on the increase in the highest balance since the two-year point (up to a further
          £600). The maximum total bonus is £1,200.
        </p>
        <p>
          While Help to Save is not specifically a homebuying scheme, the savings and bonus can be
          used towards a deposit. It can be held alongside a Lifetime ISA, allowing you to benefit
          from both the LISA bonus and the Help to Save bonus simultaneously.
        </p>
      </GuideSection>

      <GuideSection title="Mortgage Guarantee Scheme">
        <p>
          The Mortgage Guarantee Scheme encourages lenders to offer 95% loan-to-value (LTV)
          mortgages by providing a government guarantee on the portion of the mortgage above 80%
          LTV. This means you only need a 5% deposit, making homeownership more accessible.
        </p>
        <p>
          The scheme is available to all buyers (not just first-time buyers) purchasing properties
          worth up to £600,000. It is available on repayment mortgages only (not interest-only) and
          cannot be used for buy-to-let or second homes. Many major lenders participate in the
          scheme, and products are available through standard mortgage channels.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Government schemes can be combined in some cases. For example, you
          could use LISA savings as part of your deposit for a shared ownership purchase. Speak to
          an independent mortgage adviser who specialises in government schemes to understand which
          combination works best for your circumstances.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
