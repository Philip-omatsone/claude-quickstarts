"use client";

import { Building2 } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function NewBuildsGuidePage() {
  return (
    <GuideLayout
      title="Buying a New Build Property"
      subtitle="A comprehensive guide to purchasing a new-build home in the UK, covering the benefits, risks, snagging, warranties, and how to negotiate the best deal."
      icon={Building2}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="8 min"
      relatedLinks={[
        { label: "New Build Snagging Guide", href: "/buyers/guides/snagging" },
        { label: "Buying Process Guide", href: "/buyers/guides/process" },
        { label: "Leasehold vs Freehold", href: "/buyers/guides/leasehold-vs-freehold" },
        { label: "Government Schemes", href: "/buyers/guides/help-to-buy" },
      ]}
    >
      <GuideSection title="Why Consider a New Build?">
        <p>
          New-build properties offer several advantages over older homes. They are built to current
          building regulations, meaning they are typically more energy-efficient, better insulated,
          and cheaper to heat. Modern construction standards also mean they should require minimal
          maintenance in the first few years. New builds come with a structural warranty (usually
          10 years), and many come with a developer&apos;s warranty for the first two years covering
          defects and snagging issues.
        </p>
        <p>
          Buying new also means you can sometimes choose fixtures, fittings, and finishes before the
          property is completed. You avoid the risk of inheriting someone else&apos;s DIY disasters,
          outdated wiring, or hidden damp problems. The property will have a fresh EPC (Energy
          Performance Certificate) rating, typically A or B, which can reduce your energy bills and
          make the property more attractive for future resale.
        </p>
        <p>
          However, new builds are not without their challenges. They can come with a premium price
          tag, may have smaller rooms than equivalent older properties, and the quality of finish
          can vary between developers. Understanding the process and your rights as a buyer is
          essential to getting a good deal.
        </p>
      </GuideSection>

      <GuideSection title="Buying Off-Plan">
        <p>
          Many new-build properties are sold off-plan, meaning you commit to buying before
          construction is complete. You typically reserve the property with a reservation fee
          (usually £500 to £2,000), then exchange contracts during the construction phase. The
          completion date depends on the build schedule and may be several months or even years away.
        </p>
        <p>
          Buying off-plan has advantages: you may get a lower price by buying early in the
          development, and you can often choose your plot and personalise specifications. However, it
          also carries risks. Completion dates can slip (sometimes by months), the finished product
          may not match the show home or marketing materials, and the market could move against you
          during the build period.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> Be cautious about relying on marketing images and show homes.
          Show homes are often furnished with undersized furniture to make rooms appear larger, and
          computer-generated images (CGIs) can be misleading. Always check the actual floor plans
          and dimensions, and if possible, visit completed properties on the same or a similar
          development by the same builder.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="The Reservation and Exchange Process">
        <p>
          The process of buying a new build differs from buying a second-hand property. After
          paying a reservation fee, you typically have 28 days to exchange contracts. This is a much
          shorter timeline than a standard purchase, so it is important to have your mortgage
          agreement in principle and solicitor already in place before you reserve.
        </p>
        <p>
          The developer&apos;s solicitor prepares the contract, and your solicitor reviews it on
          your behalf. New-build contracts are often more complex than standard contracts and may
          include provisions about build specifications, completion timescales, and what happens if
          there are delays. Your solicitor should pay particular attention to the long-stop date
          (the latest date by which the developer must complete the build), the specification of
          the property, and any management company or service charge arrangements.
        </p>
        <p>
          The deposit for a new build is typically 10% of the purchase price, paid at exchange. If
          the developer has agreed to contribute towards your deposit or costs, this will be set out
          in the contract. Some developers offer part-exchange schemes where they buy your existing
          property as part of the deal, though the price offered for your property is usually below
          market value.
        </p>
      </GuideSection>

      <GuideSection title="Negotiating with Developers">
        <p>
          New-build properties are more negotiable than many buyers realise. Developers have sales
          targets and build schedules, and they are often willing to negotiate, particularly towards
          the end of a financial quarter or when a development is nearing completion and unsold
          units remain.
        </p>
        <p>
          Rather than simply asking for a price reduction, consider negotiating for additional
          extras or incentives. Common developer incentives include:
        </p>
        <p>
          <strong>Upgrades and extras:</strong> Upgraded kitchens, flooring, bathroom fittings,
          garden landscaping, turf, fencing, or integrated appliances. These can be worth thousands
          of pounds and cost the developer much less to provide than a direct price reduction.
        </p>
        <p>
          <strong>Contribution to costs:</strong> Some developers will pay your stamp duty, legal
          fees, or contribute towards your deposit. Be aware that some of these incentives may need
          to be declared to your mortgage lender and could affect the valuation.
        </p>
        <p>
          <strong>Part-exchange:</strong> If you have a property to sell, the developer may offer to
          buy it as part of the deal. This eliminates the risk of a chain, though the price offered
          is typically 80% to 90% of market value.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> The best time to negotiate is when the developer needs to sell.
          Visit developments towards the end of their financial year (often June or December), when
          plots have been on the market for a while, or when only a few units remain. Also, do not
          negotiate based only on the show home &mdash; the specific plot, floor level, and aspect
          all affect value.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="New Build Warranties">
        <p>
          Most new-build properties in the UK come with a structural warranty, typically from the
          NHBC (National House Building Council), LABC Warranty, or Premier Guarantee. These
          warranties usually last 10 years and provide protection in two phases:
        </p>
        <p>
          <strong>Years 1 to 2 (Builder&apos;s warranty period):</strong> The developer is
          responsible for fixing any defects that do not meet the warranty provider&apos;s
          standards. This covers issues with the build quality, fixtures, fittings, and finishes.
          Report any problems to the developer in writing and keep a record of all communications.
        </p>
        <p>
          <strong>Years 3 to 10 (Insurance period):</strong> The warranty provider covers the cost
          of repairing damage caused by defects in specified parts of the structure, including
          foundations, load-bearing walls, roof structure, and weather-proofing. This does not
          cover cosmetic issues, wear and tear, or problems caused by poor maintenance.
        </p>
        <p>
          Before completion, ensure you receive the warranty documentation and understand what is
          covered. The warranty is attached to the property, not the owner, so it transfers to
          future buyers if you sell within the warranty period. Mortgage lenders require a valid
          warranty to be in place before lending on a new-build property.
        </p>
      </GuideSection>

      <GuideSection title="Snagging">
        <p>
          Snagging refers to identifying and reporting defects or unfinished work in a new-build
          property. Common snagging issues include poor paintwork, ill-fitting doors and windows,
          gaps in sealant, scratched surfaces, uneven tiling, and drainage issues. While these are
          typically cosmetic, some can indicate more serious underlying problems.
        </p>
        <p>
          You have the right to carry out a snagging inspection before completion, though some
          developers may resist this. At the very least, compile a snagging list as soon as
          possible after moving in and submit it to the developer in writing. Most developers will
          address snagging issues within a reasonable timeframe, but you may need to chase
          persistently.
        </p>
        <p>
          Consider hiring a professional snagging company to carry out an independent inspection.
          They will produce a comprehensive report detailing every defect found, which you can
          present to the developer. Professional snagging inspections typically cost £300 to £600
          and can identify issues you might miss, potentially saving you money in the long run.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> Under the Consumer Code for Home Builders, developers must
          provide a complaints procedure and ensure any reported issues are dealt with in a timely
          manner. If you are unable to resolve disputes with the developer, you can escalate to the
          warranty provider or an independent dispute resolution service.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
