"use client";

import { Dog } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
  GuideStep,
} from "@/components/guides/GuideLayout";

export default function RentingWithPetsGuidePage() {
  return (
    <GuideLayout
      title="Renting with Pets in the UK"
      subtitle="Your rights as a pet owner, how to negotiate with landlords, and changes in the law that are working in your favour."
      icon={Dog}
      backHref="/renters/guides"
      backLabel="All Guides"
      readTime="6 min"
      relatedLinks={[
        { label: "Renting 101 Guide", href: "/renters/guides/renting-101" },
        { label: "Tenancy Agreements Guide", href: "/renters/guides/tenancy-agreements" },
        { label: "Deposit Protection Guide", href: "/renters/guides/deposits" },
        { label: "Viewing Checklist", href: "/renters/checklists/viewing" },
      ]}
    >
      <GuideSection title="The Current Situation for Pet Owners">
        <p>
          Renting with a pet in the UK has historically been difficult. Many landlords include blanket
          &quot;no pets&quot; clauses in their tenancy agreements, and some letting agents
          automatically filter out pet owners. According to research, around 55% of UK adults own a
          pet, yet only a small fraction of rental listings explicitly allow them. This mismatch
          leaves millions of renters facing difficult choices.
        </p>
        <p>
          However, the landscape is changing. The government has recognised that blanket pet bans are
          unfair and has taken steps to make it easier for responsible pet owners to rent. The
          Renters (Reform) Bill includes provisions that would give tenants the right to request a
          pet, which landlords cannot unreasonably refuse. While the Bill&apos;s timeline has shifted,
          the direction of travel is clear: renting with pets is becoming more accepted.
        </p>
        <p>
          Even under current law, a &quot;no pets&quot; clause is not necessarily the end of the
          conversation. Many landlords will consider allowing pets if you approach them in the right
          way, particularly if you can demonstrate that you are a responsible pet owner.
        </p>
      </GuideSection>

      <GuideSection title="Your Legal Rights">
        <p>
          Under the Tenant Fees Act 2019, landlords in England cannot require you to pay a higher
          deposit because you have a pet. The deposit cap remains at five weeks&apos; rent regardless
          of whether pets are permitted. Previously, some landlords charged a separate &quot;pet
          deposit,&quot; but this is no longer legal as it would count as a prohibited payment.
        </p>
        <p>
          However, landlords can require you to take out pet damage insurance as a condition of
          allowing a pet. This is not a fee or deposit but an insurance policy that covers the cost
          of any damage caused by your pet. Policies are typically affordable, ranging from £10 to
          £30 per month, and can give the landlord peace of mind.
        </p>
        <GuideCallout type="info">
          <strong>The Renters (Reform) Bill and pets:</strong> Under the proposed legislation,
          tenants will have the right to request permission to keep a pet. The landlord must consider
          the request and cannot unreasonably refuse. If they do refuse, they must provide a written
          explanation. Landlords will be able to require pet insurance as a condition of consent. This
          represents a significant shift from the current position where landlords can impose blanket
          bans.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Negotiating with Your Landlord">
        <GuideStep number={1} title="Create a Pet CV">
          <p>
            Put together a document about your pet that includes their breed, age, temperament, and
            any training they have received. Include a photograph. If your pet has been well-behaved
            in previous rental properties, ask your former landlord for a reference. Mention any
            vaccinations, microchipping, and regular veterinary care. This shows you are a
            responsible owner.
          </p>
        </GuideStep>
        <GuideStep number={2} title="Offer to Meet in Person">
          <p>
            If possible, offer to bring your pet to meet the landlord or agent. This is particularly
            effective for dogs, where the landlord may have concerns about size or breed. Meeting a
            calm, well-trained pet in person can dispel fears much more effectively than written
            communication alone.
          </p>
        </GuideStep>
        <GuideStep number={3} title="Propose Safeguards">
          <p>
            Offer practical safeguards such as taking out pet damage insurance, agreeing to
            professional cleaning at the end of the tenancy (at your expense), or allowing periodic
            property inspections to check for damage. These concrete commitments demonstrate that you
            take the landlord&apos;s concerns seriously.
          </p>
        </GuideStep>
        <GuideStep number={4} title="Get Permission in Writing">
          <p>
            If the landlord agrees to allow your pet, ensure this is documented in writing, ideally
            as a formal amendment to the tenancy agreement or a separate pet agreement. Verbal
            permission is not reliable. The written agreement should specify the type and number of
            pets allowed, any conditions, and confirm that the standard deposit terms still apply.
          </p>
        </GuideStep>
      </GuideSection>

      <GuideCallout type="warning">
        <strong>Never sneak a pet in.</strong> Keeping a pet in breach of your tenancy agreement is
        risky. The landlord could use it as grounds for eviction (breach of tenancy terms under
        Section 8, Ground 12). You could also lose your deposit if the pet causes any damage. It is
        always better to have an honest conversation with the landlord and seek written permission.
      </GuideCallout>

      <GuideSection title="Finding Pet-Friendly Properties">
        <p>
          While the overall supply of pet-friendly rentals is limited, there are ways to improve your
          chances. On Rightmove, you can filter listings by &quot;pets allowed&quot; (though not all
          landlords use this tag). OpenRent tends to have more pet-friendly listings because
          landlords deal directly with tenants and are often more flexible. SpareRoom allows you to
          search for pet-friendly rooms in shared houses.
        </p>
        <p>
          Specialist websites like Lets with Pets (managed by the Dogs Trust) maintain a directory of
          pet-friendly letting agents across the UK. The RSPCA also campaigns for pet-friendly
          renting and provides resources for tenants. Some housing associations and build-to-rent
          developments have explicit pet-friendly policies.
        </p>
        <p>
          Consider properties with gardens, ground-floor flats, or houses rather than upper-floor
          flats, as landlords are generally more receptive to pets in these types of properties. Rural
          and suburban locations also tend to be more pet-friendly than city-centre apartments.
        </p>
      </GuideSection>

      <GuideSection title="Protecting Your Deposit">
        <p>
          If you are renting with a pet, protecting your deposit is especially important. When you
          move in, take thorough photographs of all carpets, flooring, doors, and skirting boards.
          These are the areas most likely to be affected by pet-related wear. During your tenancy,
          address any damage promptly. Replace scratched door frames or stained carpets before the
          end of the tenancy if possible.
        </p>
        <p>
          At the end of the tenancy, arrange a professional deep clean that includes pet-specific
          cleaning such as carpet shampooing to remove pet hair and odours. Keep the receipt as
          evidence. If you took out pet damage insurance, check whether any issues are covered before
          you leave.
        </p>
        <GuideCallout type="tip">
          <strong>Prevention is cheaper than cure.</strong> Invest in scratch protectors for doors,
          washable throws for sofas, and good-quality doormats. Trim your pet&apos;s claws regularly
          to minimise floor scratching. Use enzymatic cleaners to deal with any accidents promptly.
          These small steps throughout your tenancy can save you significant deductions at the end.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Assistance and Emotional Support Animals">
        <p>
          If you have a registered assistance dog (such as a guide dog or hearing dog), landlords
          are generally expected to make reasonable adjustments under the Equality Act 2010. Refusing
          to let to someone with an assistance dog could constitute disability discrimination. This
          applies even if the tenancy agreement contains a no-pets clause.
        </p>
        <p>
          The situation is less clear for emotional support animals, which do not have the same
          formal legal recognition as registered assistance dogs in the UK. However, if you have a
          mental health condition that qualifies as a disability under the Equality Act, a landlord
          may be required to consider reasonable adjustments, which could include allowing an
          emotional support animal. Seek advice from the Equality Advisory Support Service (EASS) or
          a housing solicitor if you face difficulties.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
