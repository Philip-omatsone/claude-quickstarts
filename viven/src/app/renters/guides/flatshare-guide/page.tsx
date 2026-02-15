"use client";

import { Users } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
  GuideStep,
} from "@/components/guides/GuideLayout";

export default function FlatshareGuidePage() {
  return (
    <GuideLayout
      title="The Flatshare Guide"
      subtitle="Everything you need to know about sharing a rental property — contracts, bills, housemate harmony, and your rights."
      icon={Users}
      backHref="/renters/guides"
      backLabel="All Guides"
      readTime="7 min"
      relatedLinks={[
        { label: "Rent Split Calculator", href: "/renters/calculators/rent-split" },
        { label: "Bills Estimator", href: "/renters/calculators/bills-estimator" },
        { label: "Setting Up Bills Guide", href: "/renters/guides/bills" },
        { label: "Tenancy Agreements Guide", href: "/renters/guides/tenancy-agreements" },
      ]}
    >
      <GuideSection title="Joint Tenancy vs Individual Contracts">
        <p>
          How your tenancy is structured makes a big difference when you are sharing a property. The
          two main arrangements are a joint tenancy and individual tenancy agreements.
        </p>
        <p>
          With a <strong>joint tenancy</strong>, all tenants sign one agreement and are collectively
          responsible for the whole rent. This means if one housemate does not pay their share, the
          landlord can pursue any of the remaining tenants for the full amount. This is called
          &quot;joint and several liability.&quot; All tenants have equal rights to the whole
          property, including all communal areas. The deposit is held jointly, which can cause
          complications if one person moves out and their share needs to be transferred.
        </p>
        <p>
          With <strong>individual tenancy agreements</strong>, each tenant signs a separate contract
          for their room, plus shared use of communal areas. This is more common in purpose-built
          student accommodation and professionally managed HMOs (Houses in Multiple Occupation). Each
          tenant is only responsible for their own rent, and one person leaving does not affect the
          others. Deposits are held individually.
        </p>
        <GuideCallout type="tip">
          <strong>Which is better?</strong> Individual agreements offer more protection if you are
          sharing with people you do not know well, because you are not financially liable for their
          behaviour. Joint tenancies are more common with private landlords and can work well when
          sharing with close friends, but make sure you trust your housemates before signing. Discuss
          worst-case scenarios (someone losing their job, a relationship breakdown, wanting to move
          out early) before committing.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Finding a Flatshare">
        <p>
          <strong>SpareRoom</strong> is the UK&apos;s largest flatshare website and should be your
          first port of call. You can search for rooms in existing shared houses or advertise that
          you are looking for a room. SpareRoom offers a &quot;buddy up&quot; feature to find
          potential housemates to search for a whole property together. Listings include details about
          the current housemates, bills, house rules, and the room available.
        </p>
        <p>
          Other platforms include Ideal Flatmate, Roomgo, and Facebook groups (search for
          &quot;[your city] rooms to rent&quot; or &quot;[your city] flatshare&quot;). If you are a
          professional, some platforms specifically cater to working professionals rather than
          students.
        </p>
        <p>
          When viewing a room in an existing flatshare, spend time talking to the current housemates.
          Ask about the household dynamic, how they split bills, cleaning routines, and any house
          rules. Check the communal areas (kitchen, bathroom, living room) for cleanliness. Ask
          whether there have been any issues with the landlord or property. Trust your instincts; you
          will be living with these people.
        </p>
      </GuideSection>

      <GuideSection title="Splitting Bills Fairly">
        <p>
          Splitting bills is one of the most common sources of friction in a flatshare. The simplest
          approach is to divide all bills equally, but this is not always fair. If one person has a
          significantly larger room, they might pay a larger share of the rent (and potentially
          bills). If someone works from home full-time and others are out all day, the energy usage
          will not be even.
        </p>
        <p>
          Consider these approaches: <strong>Equal split</strong> is the simplest. Everyone pays the
          same. Works best when rooms are similar sizes and usage patterns are comparable.
          <strong>Proportional to room size</strong> is fairer when rooms vary significantly. Measure
          the rooms and calculate each person&apos;s percentage of the total space.
          <strong>Usage-based</strong> is the most complex but fairest. Some households split rent
          equally but allocate energy costs based on who is home more, for example.
        </p>
        <GuideCallout type="info">
          <strong>Practical tip:</strong> Set up a shared bank account or use a bill-splitting app
          like Splitwise, Tricount, or Settle Up. One person should be responsible for managing the
          bills account, with everyone else contributing their share by standing order on the same
          date each month. This avoids the awkwardness of chasing housemates for money. Our Rent
          Split Calculator can help you work out fair shares based on room sizes.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="House Rules and Communication">
        <p>
          Having a conversation about expectations early on can prevent most flatshare conflicts.
          Discuss the following topics before or shortly after moving in: cleaning rotas and standards,
          noise levels and quiet hours, overnight guests and how often they can stay, use of shared
          food and supplies, smoking policy, pet policy, and how to handle disagreements.
        </p>
        <p>
          A shared WhatsApp or messaging group is useful for day-to-day communication about
          household matters (someone is having a dinner party, the boiler is making a noise, the
          landlord is visiting). Keep the tone friendly and raise issues promptly rather than letting
          resentment build up. If a conversation feels difficult, suggest a household meeting where
          everyone can air concerns.
        </p>
        <p>
          Cleaning is the number one cause of flatshare arguments. A cleaning rota that rotates
          responsibility for communal areas (kitchen, bathroom, living room, bins) on a weekly basis
          is a simple and effective solution. Write it down and stick it on the fridge. Some
          households prefer to split the cost of a cleaner, which can be surprisingly affordable
          when divided between three or four people.
        </p>
      </GuideSection>

      <GuideSection title="When a Housemate Wants to Leave">
        <p>
          This is one of the trickiest situations in a flatshare, particularly with a joint tenancy.
          If you are in a <strong>periodic joint tenancy</strong>, one tenant giving notice can end
          the entire tenancy for everyone. This was established in the landmark case Hammersmith and
          Fulham LBC v Monk. If one person wants to leave during a periodic tenancy, all tenants
          should discuss the situation with the landlord to find a solution, such as the departing
          tenant being replaced on the agreement.
        </p>
        <p>
          During a <strong>fixed-term joint tenancy</strong>, one person cannot unilaterally end the
          tenancy. All tenants are bound until the end of the fixed term. If someone wants to leave
          early, they will usually need to find a replacement tenant (with the landlord&apos;s
          approval) or continue paying their share until the term ends. The remaining tenants and the
          departing tenant should agree in writing on how to handle this.
        </p>
        <p>
          With <strong>individual tenancy agreements</strong>, one person leaving is simpler. They
          give notice per their own contract, and the landlord is responsible for finding a new
          tenant for that room. The remaining tenants are not affected.
        </p>
        <GuideCallout type="warning">
          <strong>Deposit complications:</strong> In a joint tenancy, the deposit is typically held
          as one sum for all tenants. If one person leaves, negotiating the return of &quot;their
          share&quot; can be complicated because the deposit protection scheme holds it as one amount.
          The outgoing tenant, remaining tenants, and landlord all need to agree. Document any
          agreement in writing and consider whether the new housemate will contribute to the deposit
          to reimburse the person leaving.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Houses in Multiple Occupation (HMOs)">
        <p>
          If three or more people from two or more separate households share a property, it is
          likely classified as a House in Multiple Occupation (HMO). HMOs have additional safety
          and licensing requirements. If the property has five or more tenants from two or more
          households, the landlord must have a mandatory HMO licence from the local council. Many
          councils also operate additional licensing schemes that cover smaller HMOs.
        </p>
        <p>
          As a tenant in an HMO, you benefit from stricter fire safety requirements (fire doors,
          fire alarms, extinguishers), minimum room size standards (a single bedroom must be at
          least 6.51 square metres), adequate shared kitchen and bathroom facilities, and the
          landlord being a &quot;fit and proper person.&quot; If you suspect your shared property
          should be licensed but is not, check with your local council. You may be entitled to a
          Rent Repayment Order of up to 12 months&apos; rent.
        </p>
      </GuideSection>

      <GuideSection title="Flatshare Dos and Don'ts">
        <p>
          <strong>Do:</strong> Be upfront about your habits and expectations before moving in.
          Pay your share of bills on time every month. Clean up after yourself in shared spaces.
          Communicate issues early and directly. Respect quiet hours and personal space. Label your
          food if that is the household agreement. Be considerate with overnight guests.
        </p>
        <p>
          <strong>Don&apos;t:</strong> Assume everyone has the same standards of cleanliness.
          Leave passive-aggressive notes (talk in person instead). Use housemates&apos; belongings
          without asking. Let issues fester until they become explosive arguments. Commit to a
          joint tenancy with people you have not lived with before if you have other options.
          Ignore the tenancy agreement terms or assume verbal arrangements will hold up.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
