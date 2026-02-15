"use client";

import { Shield } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function BuildingsInsuranceGuidePage() {
  return (
    <GuideLayout
      title="Buildings Insurance for Home Buyers"
      subtitle="A practical guide to buildings insurance in the UK, including what it covers, when you need it, how to choose a policy, and what to watch out for."
      icon={Shield}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="6 min"
      relatedLinks={[
        { label: "Exchange & Completion", href: "/buyers/guides/exchange-completion" },
        { label: "Buying Process Guide", href: "/buyers/guides/process" },
        { label: "Leasehold vs Freehold", href: "/buyers/guides/leasehold-vs-freehold" },
        { label: "First-Time Buyer Guide", href: "/buyers/guides/first-time-buyers" },
      ]}
    >
      <GuideSection title="What Is Buildings Insurance?">
        <p>
          Buildings insurance covers the cost of repairing or rebuilding your home if it is damaged
          by events such as fire, flood, storm, subsidence, falling trees, burst pipes, or impact
          from vehicles. It covers the structure of the building itself, including the walls, roof,
          floors, ceilings, windows, doors, fitted kitchens, fitted bathrooms, and permanent
          fixtures. It does not cover your personal belongings or furniture &mdash; that is covered
          by contents insurance, which is separate.
        </p>
        <p>
          Buildings insurance is not a legal requirement for homeowners, but it is almost always a
          condition of your mortgage. Your lender requires it because the property is their security
          for the loan, and they need to know it can be rebuilt if something catastrophic happens.
          Even if you buy without a mortgage, buildings insurance is strongly recommended to protect
          your investment.
        </p>
      </GuideSection>

      <GuideSection title="When Do You Need Buildings Insurance?">
        <p>
          You need buildings insurance in place from the date of exchange of contracts, not
          completion. This is because from exchange onwards, you are legally committed to buying
          the property and bear the risk of any damage to it. If the property burned down between
          exchange and completion, you would still be legally obliged to complete the purchase at
          the agreed price, and the seller&apos;s insurance would not cover you.
        </p>
        <p>
          In practice, most buyers arrange their buildings insurance to start on the expected
          exchange date and notify the insurer of the actual exchange date once it happens. If
          exchange is delayed, most insurers will adjust the start date without charge.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> Do not wait until completion day to arrange buildings insurance.
          You need cover from exchange, which could be two to four weeks before completion. Your
          mortgage lender will typically require proof of buildings insurance before releasing
          your mortgage funds.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="What Does Buildings Insurance Cover?">
        <p>
          A standard buildings insurance policy covers damage caused by a range of insured events,
          commonly referred to as &quot;perils.&quot; These typically include:
        </p>
        <p>
          <strong>Fire, smoke, and explosion:</strong> Damage caused by fire, whether accidental or
          caused by third parties, as well as smoke damage and explosions.
        </p>
        <p>
          <strong>Storm and flood:</strong> Damage from severe weather including high winds, heavy
          rain, lightning, and flooding from rivers or surface water. Note that general wear and
          tear from weather exposure is not covered.
        </p>
        <p>
          <strong>Escape of water:</strong> Damage caused by burst pipes, leaking tanks, or
          overflowing cisterns. This is one of the most common claims on buildings insurance. The
          cost of tracing and repairing the leak itself may or may not be covered depending on
          your policy.
        </p>
        <p>
          <strong>Subsidence, heave, and landslip:</strong> Movement of the ground beneath the
          property that causes structural damage. Subsidence claims can be complex and may affect
          your ability to get affordable insurance in the future.
        </p>
        <p>
          <strong>Theft and vandalism:</strong> Damage to the building caused by break-ins or
          deliberate damage by third parties.
        </p>
        <p>
          <strong>Impact:</strong> Damage caused by vehicles, aircraft, or fallen trees colliding
          with the property.
        </p>
        <p>
          Most policies also include cover for alternative accommodation if you need to move out
          while repairs are carried out, and liability cover in case someone is injured on your
          property.
        </p>
      </GuideSection>

      <GuideSection title="What Is Not Covered?">
        <p>
          Buildings insurance does not cover everything. Common exclusions include general wear and
          tear, gradual deterioration, damage caused by poor maintenance, cosmetic damage that does
          not affect the structure, damage from pests (woodworm, dry rot, etc. unless specifically
          included), and damage that existed before you took out the policy.
        </p>
        <p>
          Some policies exclude or limit cover for certain risks depending on the property&apos;s
          location or history. For example, if the property is in a flood-prone area, flood cover
          may be excluded, limited, or come with a very high excess. Properties with a history of
          subsidence may also face exclusions or higher premiums.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> The Flood Re scheme, introduced in 2016, works with
          insurers to make flood insurance more affordable for properties in high-risk areas.
          Most major insurers participate in the scheme, which caps the flood element of buildings
          insurance for eligible properties. Check whether your property is eligible if flood risk
          is a concern.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="How Much Cover Do You Need?">
        <p>
          Buildings insurance should cover the full rebuild cost of your property, not the market
          value or the purchase price. The rebuild cost is the amount it would cost to completely
          reconstruct the property from scratch, including demolition, materials, labour, and
          professional fees. This is often significantly less than the market value, which includes
          the value of the land.
        </p>
        <p>
          You can find the rebuild cost in several ways. Your mortgage valuation or survey report
          may include a rebuild estimate. You can use the calculator on the Building Cost
          Information Service (BCIS) website, which is provided by RICS. For a rough guide,
          rebuild costs typically range from £1,000 to £2,500 per square metre depending on the
          property type, location, and specification, but these figures vary considerably.
        </p>
        <p>
          Under-insuring your property is risky. If your rebuild cost is higher than your insured
          amount, the insurer may reduce any claim payout proportionally. If you are unsure about
          the correct rebuild cost, it is better to err on the side of over-insuring slightly.
        </p>
      </GuideSection>

      <GuideSection title="Choosing a Buildings Insurance Policy">
        <p>
          When comparing buildings insurance policies, look beyond the headline premium and consider
          the following factors:
        </p>
        <p>
          <strong>Excess:</strong> The amount you pay towards any claim before the insurer covers
          the rest. A higher excess typically means a lower premium, but make sure you can afford
          the excess if you need to make a claim. Subsidence excesses are usually much higher
          (often £1,000 or more).
        </p>
        <p>
          <strong>Cover limits:</strong> Check the maximum payout for different types of claim,
          including alternative accommodation, trace and access (finding and repairing leaks), and
          liability cover. Ensure these limits are adequate for your property.
        </p>
        <p>
          <strong>Accidental damage:</strong> This is usually an optional extra that covers damage
          you cause accidentally, such as putting a foot through the ceiling while in the loft or
          drilling through a pipe. It is worth considering, especially in the first few months of
          ownership when you are most likely to be doing DIY.
        </p>
        <p>
          <strong>Claims process:</strong> Read reviews about the insurer&apos;s claims handling.
          A slightly cheaper premium is poor value if the insurer is difficult to deal with when
          you actually need them. Check whether the insurer uses their own approved contractors or
          allows you to choose your own.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Use price comparison websites to get an overview of the market, but
          also check directly with insurers who may not appear on comparison sites (such as Direct
          Line and Aviva). Consider combining buildings and contents insurance in a single policy,
          as many insurers offer a discount for joint cover.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Leasehold Properties and Buildings Insurance">
        <p>
          If you are buying a leasehold flat, the buildings insurance is usually arranged by the
          freeholder or managing agent and the cost is included in your service charge. You do not
          need to arrange your own buildings insurance for the structure, but you should arrange
          contents insurance for your personal belongings.
        </p>
        <p>
          Your solicitor should check the buildings insurance arrangements during the conveyancing
          process. Confirm that the policy covers the full rebuild cost, that the excess is
          reasonable, and that the freeholder is not paying an inflated premium (and passing the
          cost to leaseholders). Leaseholders have the right to request a summary of the
          insurance policy and to challenge unreasonable charges.
        </p>
        <p>
          Even though the freeholder arranges buildings insurance, your mortgage lender needs to be
          noted on the policy. Your solicitor will handle this as part of the completion process.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
