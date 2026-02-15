"use client";

import { FileText } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function LeaseholdVsFreeholdGuidePage() {
  return (
    <GuideLayout
      title="Leasehold vs Freehold Explained"
      subtitle="Understanding the difference between leasehold and freehold ownership in England and Wales, including ground rent, service charges, lease extensions, and your rights."
      icon={FileText}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="8 min"
      relatedLinks={[
        { label: "Buying in London", href: "/buyers/guides/buying-in-london" },
        { label: "Solicitors & Conveyancing", href: "/buyers/guides/solicitors" },
        { label: "New Build Guide", href: "/buyers/guides/new-builds" },
        { label: "Shared Ownership Guide", href: "/buyers/guides/shared-ownership" },
      ]}
    >
      <GuideSection title="Freehold Ownership">
        <p>
          When you buy a freehold property, you own both the building and the land it sits on
          outright, with no time limit on your ownership. You are responsible for maintaining the
          property and have full control over alterations and improvements (subject to planning
          permission and building regulations). There is no ground rent to pay and no freeholder
          to answer to.
        </p>
        <p>
          Most houses in England and Wales are freehold. Freehold ownership is the simplest and
          most straightforward form of property ownership. You can stay in the property for as long
          as you wish, pass it on in your will, and sell it without needing anyone&apos;s permission.
          The only ongoing obligations are to your mortgage lender (if you have one), the local
          council (council tax), and compliance with general law.
        </p>
      </GuideSection>

      <GuideSection title="Leasehold Ownership">
        <p>
          Leasehold ownership means you own the property for a fixed period of time, as set out in
          a lease agreement with the freeholder (also called the landlord). When the lease expires,
          ownership reverts to the freeholder. Leases on residential properties are typically
          granted for 99, 125, or 999 years, though some older leases may have started at shorter
          terms and now have much less time remaining.
        </p>
        <p>
          Most flats in England and Wales are leasehold because the freehold of the building is
          held by a single entity (often a company, housing association, or individual), and each
          flat owner holds a lease. Some newer houses are also sold as leasehold, particularly on
          new-build estates, though this practice has been controversial and is being reformed.
        </p>
        <p>
          As a leaseholder, you own the right to live in the property for the duration of the lease,
          but you do not own the building or the land. The freeholder retains ownership of the
          structure, common areas, and grounds. The lease sets out the rights and obligations of
          both parties, including what you can and cannot do with the property.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> A lease is a &quot;wasting asset&quot; &mdash; its value
          decreases as the remaining term gets shorter. A flat with 120 years on the lease is worth
          more than the same flat with 70 years on the lease, even though the physical property is
          identical. This is why lease length is such an important factor in valuing leasehold
          properties.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Ground Rent">
        <p>
          Ground rent is a payment made by the leaseholder to the freeholder, as specified in the
          lease. It is essentially rent for the land on which the property stands. Ground rent can
          vary enormously &mdash; from a nominal &quot;peppercorn&quot; (effectively zero) to
          hundreds of pounds per year.
        </p>
        <p>
          Some leases, particularly those created in the early 2000s to mid-2010s, contain
          escalating ground rent clauses where the ground rent doubles every 10 or 25 years. These
          can cause ground rent to reach thousands of pounds per year over the life of the lease,
          and have made some properties difficult to sell or mortgage.
        </p>
        <p>
          The Leasehold Reform (Ground Rent) Act 2022 ensures that ground rent on new leases
          granted after 30 June 2022 is set at zero (a peppercorn). This applies to new builds and
          new leases, but does not retrospectively change the terms of existing leases. If you are
          buying a property with an existing lease, check the ground rent terms very carefully.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> If the ground rent exceeds £250 per year (£1,000 in London),
          the lease may be classified as an Assured Shorthold Tenancy under the Housing Act 1988,
          giving the freeholder the theoretical right to seek possession. While this is rare in
          practice, it can cause problems with mortgage lenders. Check this with your solicitor.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Service Charges">
        <p>
          Service charges cover the cost of maintaining and managing the building and common areas.
          They are payable by leaseholders and typically cover building insurance, maintenance and
          repairs to the structure, cleaning of common areas, gardening and landscaping, lift
          maintenance, management fees, and contributions to a sinking fund or reserve fund for
          future major works.
        </p>
        <p>
          Service charges vary widely. A small purpose-built block with no lift might charge £1,000
          to £2,000 per year, while a luxury development with a concierge, gym, and swimming pool
          could charge £5,000 to £10,000 or more. Before buying a leasehold property, request the
          last three years of service charge accounts and check whether any major works are planned.
        </p>
        <p>
          You have the right to challenge unreasonable service charges through the First-tier
          Tribunal (Property Chamber). The freeholder or managing agent must provide a clear
          breakdown of charges and consult leaseholders before carrying out major works costing more
          than £250 per leaseholder (known as Section 20 consultation).
        </p>
      </GuideSection>

      <GuideSection title="Lease Extensions">
        <p>
          If you own a leasehold property and have been the registered owner for at least two years,
          you have the legal right to extend your lease by 90 years on top of the current remaining
          term, with the ground rent reduced to zero (peppercorn). This is known as a statutory
          lease extension under the Leasehold Reform, Housing and Urban Development Act 1993.
        </p>
        <p>
          The cost of a lease extension depends on several factors: the current lease length, the
          property value, the ground rent, and the capitalization rate used in the calculation. As a
          general rule, the shorter the remaining lease, the more expensive the extension. The cost
          increases dramatically once the lease drops below 80 years, because the freeholder becomes
          entitled to a share of the &quot;marriage value&quot; (the increase in the property&apos;s
          value resulting from the longer lease).
        </p>
        <p>
          For example, extending a lease from 75 years to 165 years (90-year extension) on a flat
          worth £300,000 might cost £20,000 to £30,000. Extending the same lease from 60 years
          would be significantly more expensive, potentially £40,000 to £60,000 or more. This is
          why it is advisable to extend your lease before it falls below 80 years.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> If you are buying a leasehold property with fewer than 85 years
          remaining, factor the cost of a lease extension into your budget. You can start the
          extension process once you have been the registered owner for two years. Some sellers may
          be willing to start the process before sale or reduce the price to account for the
          extension cost.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Collective Enfranchisement and Right to Manage">
        <p>
          <strong>Collective enfranchisement:</strong> If you and other leaseholders in your
          building are dissatisfied with the freeholder, you may have the right to collectively
          purchase the freehold. At least 50% of the qualifying leaseholders must participate, and
          the building must meet certain criteria (for example, at least two-thirds of the flats
          must be held by qualifying tenants). The cost is shared between the participating
          leaseholders and includes the price of the freehold plus legal and valuation costs.
        </p>
        <p>
          <strong>Right to Manage:</strong> Even without buying the freehold, leaseholders can take
          over the management of their building through the Right to Manage (RTM). This allows you
          to appoint your own managing agent, control the service charge, and have a say in how the
          building is maintained. At least 50% of the qualifying tenants must participate, and the
          process does not require you to prove any fault by the current management.
        </p>
      </GuideSection>

      <GuideSection title="Leasehold Reform">
        <p>
          The UK government has been implementing significant leasehold reforms to protect
          leaseholders and improve the fairness of the system. Key reforms include the abolition
          of ground rent on new leases (from June 2022), proposed changes to make lease extensions
          cheaper and simpler, and planned reforms to allow leaseholders of houses to buy their
          freehold more easily.
        </p>
        <p>
          The Leasehold and Freehold Reform Act 2024 introduced further changes including removing
          the requirement to own a leasehold for two years before extending, increasing the standard
          lease extension term from 90 to 990 years, and reforms to how the premium for lease
          extensions is calculated. These changes are being implemented in stages, so check the
          latest position with your solicitor.
        </p>
        <p>
          If you are considering buying a leasehold property, stay informed about these reforms as
          they could significantly affect lease extension costs and your rights as a leaseholder.
          Your solicitor should be able to advise on how current and upcoming legislation affects
          the specific property you are looking at.
        </p>
      </GuideSection>

      <GuideSection title="Key Checks When Buying Leasehold">
        <p>
          Before buying a leasehold property, make sure your solicitor checks the following:
        </p>
        <p>
          <strong>Remaining lease length:</strong> Aim for at least 80 years, ideally 90 or more.
          Below 80 years, mortgage options narrow and extension costs increase sharply.
        </p>
        <p>
          <strong>Ground rent terms:</strong> Check the current amount and any escalation clauses.
          Avoid properties with doubling ground rent clauses unless the seller agrees to address
          this before sale.
        </p>
        <p>
          <strong>Service charge history:</strong> Request the last three years of accounts. Check
          the trend and whether a sinking fund exists for major works.
        </p>
        <p>
          <strong>Major works:</strong> Ask whether any major works are planned (such as roof
          replacement, external repainting, or lift replacement) as these could result in a
          significant one-off charge.
        </p>
        <p>
          <strong>Restrictions:</strong> Check for restrictions on alterations, subletting, pets,
          and use of the property. These can affect your lifestyle and the property&apos;s
          attractiveness for future resale.
        </p>
        <p>
          <strong>Insurance:</strong> Confirm who arranges the buildings insurance and whether
          the premium is reasonable. Some freeholders charge excessive commissions on insurance
          policies.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
