"use client";

import { Wrench } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
  GuideStep,
} from "@/components/guides/GuideLayout";

export default function RepairsGuidePage() {
  return (
    <GuideLayout
      title="Getting Repairs Done"
      subtitle="Your rights when things break, your landlord's legal responsibilities, and what to do if they won't fix things."
      icon={Wrench}
      backHref="/renters/guides"
      backLabel="All Guides"
      readTime="7 min"
      relatedLinks={[
        { label: "Landlord Repair Email Template", href: "/renters/templates/email-landlord-repair" },
        { label: "Renting 101 Guide", href: "/renters/guides/renting-101" },
        { label: "Tenancy Agreements Guide", href: "/renters/guides/tenancy-agreements" },
        { label: "Know Your Eviction Rights", href: "/renters/guides/eviction" },
      ]}
    >
      <GuideSection title="Who Is Responsible for What?">
        <p>
          Under Section 11 of the Landlord and Tenant Act 1985, your landlord has a legal obligation
          to keep certain parts of the property in good repair. This applies to all tenancies of less
          than seven years, regardless of what the tenancy agreement says. The landlord cannot
          contract out of these responsibilities.
        </p>
        <p>
          Your landlord is responsible for: the structure and exterior of the property (including
          walls, roof, windows, and external doors), installations for the supply of water, gas, and
          electricity (including pipes, drains, gutters, basins, sinks, baths, and toilets),
          installations for space heating and water heating (including boilers and radiators), and
          common areas in blocks of flats.
        </p>
        <p>
          As a tenant, you are generally responsible for: keeping the property reasonably clean and
          tidy, minor maintenance tasks such as changing light bulbs and smoke alarm batteries,
          reporting any repair issues to your landlord promptly, not causing deliberate or negligent
          damage, and looking after the garden if the tenancy agreement requires it.
        </p>
      </GuideSection>

      <GuideCallout type="info">
        <strong>The Homes (Fitness for Human Habitation) Act 2018:</strong> Since March 2019, your
        landlord must ensure your home is fit for human habitation at the start of the tenancy and
        throughout. This covers 29 hazards including damp, excess cold, risk of falls, fire safety,
        and inadequate sanitation. If your home is unfit, you can take your landlord to court without
        needing to go through your local council first.
      </GuideCallout>

      <GuideSection title="How to Report a Repair">
        <GuideStep number={1} title="Report It in Writing">
          <p>
            Always report repair issues in writing, even if you also mention it verbally. Email is
            the best method because it creates a timestamped record. Describe the problem clearly,
            include photographs if possible, and state that you are requesting the repair under the
            landlord&apos;s obligations. Keep copies of all correspondence.
          </p>
        </GuideStep>
        <GuideStep number={2} title="Allow Reasonable Time for Response">
          <p>
            There are no fixed legal timescales for repairs, but what counts as &quot;reasonable&quot;
            depends on the urgency. Emergency repairs (no heating in winter, a burst pipe, a gas
            leak) should be addressed within 24 hours. Urgent but non-emergency repairs (a broken
            washing machine, a leaking roof) should be dealt with within a few days to a week.
            Non-urgent repairs (a cracked tile, a sticking door) might reasonably take two to four
            weeks.
          </p>
        </GuideStep>
        <GuideStep number={3} title="Follow Up If Nothing Happens">
          <p>
            If the landlord does not respond or arrange repairs within a reasonable time, send a
            follow-up letter or email. Reference your original request and the date it was made. Give
            a clear deadline for the repair to be completed. Keep your tone factual and professional.
            This correspondence could become evidence if the matter escalates.
          </p>
        </GuideStep>
      </GuideSection>

      <GuideSection title="What to Do If Your Landlord Won't Repair">
        <p>
          If your landlord ignores your repair requests or refuses to carry out their legal
          obligations, you have several options. Start with the least confrontational approach and
          escalate as needed.
        </p>
        <p>
          <strong>Contact your local council&apos;s environmental health team.</strong> They have the
          power to inspect your property and, if they find hazards, can serve an improvement notice
          or prohibition order on the landlord. This is a free service and can be very effective. The
          council uses the Housing Health and Safety Rating System (HHSRS) to assess hazards and can
          require the landlord to carry out works within a specified timeframe.
        </p>
        <p>
          <strong>Take court action under the Homes (Fitness for Human Habitation) Act 2018.</strong>{" "}
          You can apply to the county court for an order requiring the landlord to make the property
          fit for habitation. The court can also award you compensation. This route does not require
          you to go through the council first, and legal aid may be available depending on your
          circumstances.
        </p>
        <p>
          <strong>Apply for a Rent Repayment Order.</strong> If your landlord has committed certain
          housing offences (such as failing to comply with an improvement notice), you can apply to
          the First-tier Tribunal for a Rent Repayment Order, requiring the landlord to repay up to
          12 months&apos; rent.
        </p>
        <GuideCallout type="warning">
          <strong>Never withhold rent.</strong> It may be tempting to stop paying rent if your
          landlord is not carrying out repairs, but withholding rent can give the landlord grounds to
          evict you for rent arrears. Instead, continue paying rent and pursue the formal routes
          described above. The law protects you from retaliatory eviction if you have made a
          legitimate complaint about the property&apos;s condition (under the Deregulation Act 2015).
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Emergency Repairs">
        <p>
          Some repairs are genuine emergencies that require immediate action. These include gas leaks
          (call the National Gas Emergency Service on 0800 111 999), total loss of heating or hot
          water in cold weather, burst pipes or major flooding, dangerous electrical faults, and
          problems that make the property insecure (such as a broken front door lock).
        </p>
        <p>
          For gas leaks, do not wait for the landlord. Call the Gas Emergency Service immediately,
          open windows, do not use any electrical switches, and leave the property if you smell gas
          strongly. Your landlord must have a valid Gas Safety Certificate and have the gas appliances
          inspected annually by a Gas Safe registered engineer.
        </p>
        <p>
          If the landlord is not contactable in an emergency, you may need to arrange the repair
          yourself. Keep all receipts. You may be able to deduct reasonable emergency repair costs
          from future rent, but seek legal advice before doing this, as it can be complicated. It is
          better to pay the cost and pursue reimbursement separately.
        </p>
      </GuideSection>

      <GuideSection title="Retaliatory Eviction Protection">
        <p>
          Under the Deregulation Act 2015, if you have made a written complaint about the condition
          of your property and the landlord has not responded adequately, the local council can serve
          a relevant notice on the landlord. If such a notice is served, the landlord cannot evict
          you using a Section 21 notice for six months from the date of the notice. This is known as
          retaliatory eviction protection.
        </p>
        <p>
          Even without council involvement, a court can refuse to grant possession on a Section 21
          notice if it is satisfied that the landlord served the notice because the tenant raised a
          legitimate repair complaint. This protection exists to ensure tenants can exercise their
          rights without fear of losing their home.
        </p>
      </GuideSection>

      <GuideSection title="Damp and Mould">
        <p>
          Damp and mould are among the most common repair issues in UK rental properties. Following
          the tragic death of Awaab Ishak in 2020 from exposure to mould in a social housing
          property, the government introduced &quot;Awaab&apos;s Law,&quot; which sets strict
          timescales for social landlords to investigate and fix damp and mould hazards.
        </p>
        <p>
          While Awaab&apos;s Law currently applies to social housing, private landlords also have a
          duty to address damp and mould under the Homes (Fitness for Human Habitation) Act 2018.
          If your landlord claims that damp is caused by your &quot;lifestyle&quot; (not opening
          windows enough, drying clothes indoors), be aware that this is often incorrect. Structural
          issues such as poor insulation, lack of adequate ventilation, and penetrating damp from
          building defects are the landlord&apos;s responsibility to fix.
        </p>
        <GuideCallout type="tip">
          <strong>Document everything:</strong> If you have damp or mould, photograph it regularly to
          show how it develops over time. Keep a diary of ventilation habits (opening windows, using
          extractor fans) to counter any claims that your behaviour is the cause. Report the issue
          in writing and, if the landlord does not act, contact your local council&apos;s
          environmental health team.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
