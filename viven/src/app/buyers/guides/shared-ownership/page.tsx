"use client";

import { Users } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function SharedOwnershipGuidePage() {
  return (
    <GuideLayout
      title="Shared Ownership Explained"
      subtitle="A detailed guide to the shared ownership scheme in England, how it works, who qualifies, and the pros and cons of buying a share of a property."
      icon={Users}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="8 min"
      relatedLinks={[
        { label: "Government Schemes", href: "/buyers/guides/help-to-buy" },
        { label: "First-Time Buyer Guide", href: "/buyers/guides/first-time-buyers" },
        { label: "Leasehold vs Freehold", href: "/buyers/guides/leasehold-vs-freehold" },
        { label: "Buying in London", href: "/buyers/guides/buying-in-london" },
      ]}
    >
      <GuideSection title="What Is Shared Ownership?">
        <p>
          Shared ownership is a government-backed scheme that allows you to buy a share of a
          property (between 25% and 75%) and pay rent on the remaining share. It is designed to
          help people who cannot afford to buy a home outright on the open market. The scheme is
          available on both new-build properties and some resale properties, and is administered
          by housing associations across England.
        </p>
        <p>
          You take out a mortgage on the share you buy, and pay a subsidised rent to the housing
          association on the share they retain. Over time, you can buy additional shares (a process
          called &quot;staircasing&quot;) until you eventually own the property outright, if you
          choose to. Shared ownership properties are sold on a leasehold basis, even if the property
          is a house.
        </p>
      </GuideSection>

      <GuideSection title="Who Can Apply?">
        <p>
          To be eligible for shared ownership in England, you must meet the following criteria:
        </p>
        <p>
          Your household income must be £80,000 a year or less (£90,000 or less in London). You
          must be a first-time buyer, or a previous homeowner who cannot afford to buy now, or an
          existing shared owner looking to move. You must not own another property at the time of
          purchasing (unless you are selling it).
        </p>
        <p>
          The scheme is also available to people with long-term disabilities under the Home
          Ownership for People with Long-Term Disabilities (HOLD) scheme, and to older people
          (55 and over) under the Older People&apos;s Shared Ownership (OPSO) scheme, where the
          maximum share you can buy is 75% and no rent is charged once you reach that level.
        </p>
        <p>
          Priority is often given to military personnel and existing social housing tenants. Housing
          associations may also have their own additional criteria, so check with the specific
          provider for the property you are interested in.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> Since April 2021, the new model shared ownership lease
          introduced a 10-year period during which the housing association is responsible for the
          cost of any repairs and maintenance up to a cap of £500 per year. This only applies to
          properties sold under the new model lease, not older shared ownership properties.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="How the Costs Work">
        <p>
          The costs of shared ownership include a mortgage on your share, rent on the housing
          association&apos;s share, and a service charge. Here is how each element works:
        </p>
        <p>
          <strong>Deposit:</strong> You need a deposit of 5% to 10% of the share you are buying,
          not the full property value. For example, if the property is worth £300,000 and you are
          buying a 40% share (£120,000), a 5% deposit would be just £6,000. This makes shared
          ownership significantly more accessible than buying on the open market.
        </p>
        <p>
          <strong>Mortgage:</strong> You take out a mortgage on the share you are purchasing. Not
          all lenders offer shared ownership mortgages, but the number has grown significantly in
          recent years. Your mortgage broker can advise on available products.
        </p>
        <p>
          <strong>Rent:</strong> You pay rent on the housing association&apos;s share, typically set
          at 2.75% of the value of the unsold share per year. Using the example above, rent on the
          remaining 60% (£180,000) would be approximately £4,950 per year, or £412.50 per month.
          Rent increases are usually capped at RPI plus 0.5% or CPI plus 1% per year.
        </p>
        <p>
          <strong>Service charge:</strong> If the property is a flat or part of a managed
          development, you will pay a service charge covering maintenance of communal areas,
          buildings insurance, and management fees. This varies widely but is typically £1,000 to
          £3,000 per year for a flat.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> When budgeting for shared ownership, make sure you account for
          the mortgage payment, rent, service charge, and council tax together. The combined costs
          can sometimes approach or even exceed the cost of buying on the open market, particularly
          if you buy a small share. Always calculate the total monthly cost before committing.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Staircasing: Buying More Shares">
        <p>
          Staircasing is the process of buying additional shares in your shared ownership property.
          You can usually staircase in increments of 10% or more at a time. When you staircase,
          the additional share is valued at the current market value, not the original purchase
          price. This means if the property has increased in value, you will pay more for additional
          shares; if it has fallen, you will pay less.
        </p>
        <p>
          Each time you staircase, you will need a RICS valuation (typically £200 to £400) to
          determine the current market value. You will also need to pay solicitor fees for each
          transaction. Once you own 100%, you own the property outright. For houses, you may also
          be able to acquire the freehold at this point.
        </p>
        <p>
          Under the new model lease, you can staircase in smaller increments of 1% at a time
          during the first 15 years, up to a maximum of 15% purchased this way. This makes
          gradual ownership more accessible and avoids the need for a formal valuation each time
          (the value is based on the original price adjusted by the House Price Index).
        </p>
      </GuideSection>

      <GuideSection title="Selling a Shared Ownership Property">
        <p>
          Selling a shared ownership property works differently from selling on the open market.
          The housing association usually has a &quot;nomination period&quot; (typically 8 to 12
          weeks) during which they have the right to find a buyer from their waiting list. If they
          cannot find a buyer within this period, you can sell on the open market.
        </p>
        <p>
          If you own less than 100%, the buyer must also meet the shared ownership eligibility
          criteria. If you have staircased to 100%, you can sell to anyone on the open market
          without restriction. Bear in mind that selling a shared ownership property can take
          longer than a standard sale due to the nomination period and the need for the buyer
          to be approved by the housing association.
        </p>
      </GuideSection>

      <GuideSection title="Advantages of Shared Ownership">
        <p>
          The main advantages include a lower deposit requirement, making homeownership accessible
          to those who cannot save a large deposit. Monthly costs can be lower than renting
          privately in the same area. You build equity in the property as you pay off your
          mortgage and can benefit from house price increases on the share you own. You have the
          security and stability of owning your own home, including the right to decorate and
          make improvements (with permission for structural changes).
        </p>
      </GuideSection>

      <GuideSection title="Disadvantages and Considerations">
        <p>
          Shared ownership is not without its downsides. Rent increases can erode affordability
          over time, and you are paying both rent and a mortgage, which is a dual financial
          commitment. Service charges on some developments can be high and may increase
          significantly. Because shared ownership properties are leasehold, you may face
          restrictions on alterations and subletting.
        </p>
        <p>
          Selling can be more complex and slower than selling a standard property. If house prices
          rise, staircasing to 100% becomes more expensive. If prices fall, you could find yourself
          in negative equity on your share while still paying rent on the housing association&apos;s
          share. Not all mortgage lenders offer shared ownership products, which can limit your
          options and potentially result in higher interest rates.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Before committing to shared ownership, calculate the total cost of
          ownership over five to ten years, including rent increases, service charge increases, and
          the cost of staircasing. Compare this to the total cost of renting or buying on the open
          market (perhaps with a smaller property or in a different area) to make sure shared
          ownership is genuinely the best option for you.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
