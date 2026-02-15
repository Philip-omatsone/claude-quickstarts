"use client";

import { BookOpen } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
  GuideStep,
} from "@/components/guides/GuideLayout";

export default function Renting101GuidePage() {
  return (
    <GuideLayout
      title="The Complete Guide to Renting in the UK"
      subtitle="Everything you need to know about finding, securing, and settling into a rental property."
      icon={BookOpen}
      backHref="/renters/guides"
      backLabel="All Guides"
      readTime="12 min"
      relatedLinks={[
        { label: "Rent Affordability Calculator", href: "/renters/calculators/rent-affordability" },
        { label: "Deposit Calculator", href: "/renters/calculators/deposit-calculator" },
        { label: "Viewing Checklist", href: "/renters/checklists/viewing" },
        { label: "Moving In Checklist", href: "/renters/checklists/moving-in" },
        { label: "Understanding Tenancy Agreements", href: "/renters/guides/tenancy-agreements" },
        { label: "Setting Up Bills Guide", href: "/renters/guides/bills" },
      ]}
    >
      <GuideSection title="Before You Start Looking">
        <p>
          Renting in the UK can feel overwhelming, particularly if it is your first time. Between
          estate agents, referencing checks, deposit schemes, and tenancy agreements, there is a lot
          to navigate. This guide walks you through the entire process from start to finish so you
          can approach each step with confidence.
        </p>
        <p>
          Before you even open Rightmove or Zoopla, you need to get your finances in order. Work out
          your maximum monthly rent by following the 30% rule: your rent should ideally be no more
          than 30% of your gross monthly income. Remember that rent is just one expense. You will
          also need to budget for council tax, energy bills, water, broadband, contents insurance,
          and a TV licence if you watch live television or use BBC iPlayer.
        </p>
        <p>
          You will need savings upfront. Most landlords require a tenancy deposit (capped at five
          weeks&apos; rent for annual rents under £50,000) plus the first month&apos;s rent in advance.
          Some agents still charge a holding deposit (capped at one week&apos;s rent under the Tenant
          Fees Act 2019). Beyond that, you may need to cover moving costs, new furniture, and
          connection fees for utilities.
        </p>
      </GuideSection>

      <GuideSection title="Finding a Property">
        <p>
          The main property portals in the UK are Rightmove, Zoopla, and OnTheMarket. For rooms in
          shared houses, SpareRoom is the go-to platform. You can also check local letting agents
          directly, look at OpenRent for landlord-listed properties (often with lower fees), or
          browse Facebook Marketplace and local community groups.
        </p>
        <p>
          When searching, set up email alerts with your criteria. Properties in popular areas can be
          snapped up within hours, so being quick to respond is essential. When you find a property
          you like, call the agent immediately rather than just emailing. A phone call demonstrates
          genuine interest and gets you a viewing slot faster.
        </p>
        <GuideCallout type="tip">
          <strong>Pro tip:</strong> If you are renting in a competitive area like London, Bristol, or
          Manchester, prepare a &quot;renter&apos;s CV&quot; in advance. Include your employment details, a
          reference from a previous landlord, proof of income, and a brief personal introduction.
          Handing this to the agent at a viewing can set you apart from other applicants.
        </GuideCallout>
        <p>
          Be wary of rental scams. Never send money before viewing a property in person. If a deal
          seems too good to be true, it probably is. Legitimate agents and landlords will not ask for
          large sums via bank transfer before you have signed a contract. Always verify that an agent
          is registered with a redress scheme such as The Property Ombudsman or the Property Redress
          Scheme, and that they are a member of a Client Money Protection scheme.
        </p>
      </GuideSection>

      <GuideSection title="Viewing a Property">
        <p>
          Viewing a property is your chance to assess whether it will be a comfortable and safe place
          to live. Do not feel rushed. Take your time and inspect every room carefully. Check that
          taps, lights, and the heating system work. Look for signs of damp such as dark patches on
          walls, peeling wallpaper, or a musty smell. Open windows to check they are not painted
          shut. Test the water pressure in the shower. Look behind furniture if possible.
        </p>
        <p>
          Ask the agent or landlord key questions: How long has the property been empty? Why did the
          last tenant leave? What is the Energy Performance Certificate (EPC) rating? (It must be at
          least an E by law, and proposals are in place to raise this to C.) Who manages repairs and
          what is the typical response time? Is the property in a conservation area or subject to any
          restrictions?
        </p>
        <p>
          Take photos and videos during the viewing. These will help you compare multiple properties
          later and can serve as an informal record of the property&apos;s condition before you move
          in.
        </p>
      </GuideSection>

      <GuideSection title="The Application Process">
        <GuideStep number={1} title="Express Interest and Pay a Holding Deposit">
          <p>
            Once you have decided on a property, tell the agent you would like to proceed. They will
            typically ask for a holding deposit, which is capped at one week&apos;s rent. This takes
            the property off the market while your application is processed. The holding deposit must
            be returned if the landlord decides not to let to you, or put towards your first
            month&apos;s rent or tenancy deposit if you proceed. It can only be retained if you fail
            referencing, provide false information, or pull out.
          </p>
        </GuideStep>
        <GuideStep number={2} title="Referencing and Credit Checks">
          <p>
            The agent or landlord will run reference checks through a company like Homelet, Goodlord,
            or OpenRent Referencing. They will check your credit history, contact your employer to
            verify income, and ask your previous landlord for a reference. If you are a student or
            new to renting, you may be asked to provide a UK-based guarantor who agrees to cover
            your rent if you cannot pay. Referencing typically takes three to five working days.
          </p>
        </GuideStep>
        <GuideStep number={3} title="Review and Sign the Tenancy Agreement">
          <p>
            Once referencing is complete, you will receive a tenancy agreement. This is a legally
            binding contract, so read every clause carefully. Check the tenancy length, rent amount,
            break clause terms, deposit protection details, and any restrictions (such as pet or
            subletting clauses). Do not hesitate to ask for changes or clarification before signing.
            See our Tenancy Agreements guide for a detailed breakdown.
          </p>
        </GuideStep>
        <GuideStep number={4} title="Pay the Deposit and First Month's Rent">
          <p>
            Before or on the day you collect the keys, you will need to pay your tenancy deposit and
            the first month&apos;s rent. Your deposit must be protected in a government-approved
            scheme within 30 days. You should receive confirmation of which scheme holds your deposit
            and what your rights are. Keep this information safe.
          </p>
        </GuideStep>
      </GuideSection>

      <GuideCallout type="info">
        <strong>Know your rights under the Tenant Fees Act 2019:</strong> In England, letting agents
        and landlords are banned from charging most fees to tenants. They can only charge rent, a
        refundable tenancy deposit (capped at five weeks&apos; rent), a holding deposit (capped at
        one week&apos;s rent), and charges for changes to the tenancy requested by you, early
        termination, or lost keys. Any other fees are illegal. In Wales, similar protections exist
        under the Renting Homes (Fees etc.) (Wales) Act 2019.
      </GuideCallout>

      <GuideSection title="Moving In">
        <p>
          On moving day, conduct a thorough check-in inventory. This is one of the most important
          things you can do to protect your deposit. Go through every room and note the condition of
          walls, floors, carpets, appliances, and fixtures. Take date-stamped photographs of
          everything, including any existing damage, marks, or wear. If the landlord or agent provides
          an inventory report, review it carefully and add your own comments if anything is
          inaccurate.
        </p>
        <p>
          Take meter readings for gas, electricity, and water on the day you move in and photograph
          the meters. Contact each utility provider to set up your accounts. Register for council tax
          with your local authority. Set up a Royal Mail redirect if you are moving from a previous
          address. Arrange contents insurance to protect your belongings, as the landlord&apos;s
          buildings insurance does not cover your possessions.
        </p>
        <p>
          Test the smoke alarms and carbon monoxide detectors. By law, your landlord must ensure
          there is at least one smoke alarm on every storey and a carbon monoxide alarm in any room
          with a solid fuel burning appliance (since October 2022, this extends to rooms with gas
          appliances too). Make sure you know where the stopcock, fuse box, and gas shut-off valve
          are located.
        </p>
      </GuideSection>

      <GuideSection title="During Your Tenancy">
        <p>
          Pay your rent on time every month. Set up a standing order to avoid missed payments, which
          could affect your credit score and give your landlord grounds for possession proceedings.
          Keep your home in good condition. You are typically responsible for minor maintenance such
          as changing light bulbs, keeping the property clean, and not causing damage.
        </p>
        <p>
          Your landlord is responsible for structural and exterior repairs, the heating and hot water
          system, gas appliances and pipework, electrical wiring, and sanitary installations such as
          basins, sinks, baths, and toilets. If something needs fixing, report it in writing (email
          is best) so you have a paper trail. See our Repairs guide for advice on what to do if your
          landlord does not carry out repairs.
        </p>
        <p>
          Your landlord must give you at least 24 hours&apos; written notice before visiting the
          property, and visits should be at a reasonable time. They cannot enter without your
          permission except in a genuine emergency. You have the right to &quot;quiet enjoyment&quot;
          of the property, meaning your landlord should not interfere with your peaceful occupation.
        </p>
      </GuideSection>

      <GuideCallout type="warning">
        <strong>Rent increases:</strong> During a fixed-term tenancy, your landlord can only increase
        the rent if you agree or if there is a rent review clause in the contract. For periodic
        tenancies, they must use a Section 13 notice, giving you at least one month&apos;s notice.
        You can challenge an excessive increase by applying to a First-tier Tribunal. Keep an eye on
        local market rents so you know whether a proposed increase is reasonable.
      </GuideCallout>

      <GuideSection title="Ending Your Tenancy">
        <p>
          When your fixed term ends, your tenancy usually becomes a periodic tenancy (rolling month
          to month) unless you sign a new fixed-term contract. To leave, you normally need to give at
          least one month&apos;s notice in writing, but check your contract as it may specify a longer
          notice period. Time your notice carefully to align with your rent payment dates.
        </p>
        <p>
          Before you leave, clean the property thoroughly, ideally to the same standard as when you
          moved in. Refer to your check-in inventory. Fix any damage you caused (beyond fair wear and
          tear). Take meter readings and photographs on your last day. Return all keys to the agent
          or landlord and get written confirmation of their return.
        </p>
        <p>
          Your deposit should be returned within ten days of both you and your landlord agreeing on
          any deductions. If you cannot reach agreement, you can raise a dispute through the deposit
          protection scheme. They will review the evidence from both sides and make a decision.
          Having a detailed inventory and photographs from move-in and move-out is crucial for
          protecting your money.
        </p>
      </GuideSection>

      <GuideSection title="Key Contacts and Resources">
        <p>
          If you run into problems during your tenancy, there are several organisations that can
          help. Citizens Advice provides free legal guidance on housing issues. Shelter offers expert
          advice on housing rights and can help if you are at risk of homelessness. Your local
          council&apos;s environmental health team can inspect properties where the landlord is not
          maintaining safe conditions. For deposit disputes, contact the relevant deposit protection
          scheme. If you believe your landlord is breaking the law, you can also contact your local
          Trading Standards office.
        </p>
        <p>
          Renting does not have to be stressful. Understanding your rights and responsibilities from
          the outset puts you in a much stronger position. Bookmark this guide and our related
          resources below, and come back to them whenever you need a refresher.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
