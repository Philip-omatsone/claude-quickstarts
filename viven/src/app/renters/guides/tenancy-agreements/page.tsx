"use client";

import { FileText } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
  GuideStep,
} from "@/components/guides/GuideLayout";

export default function TenancyAgreementsGuidePage() {
  return (
    <GuideLayout
      title="Understanding Your Tenancy Agreement"
      subtitle="A plain-English breakdown of tenancy contracts, clauses, and what to watch for before you sign."
      icon={FileText}
      backHref="/renters/guides"
      backLabel="All Guides"
      readTime="8 min"
      relatedLinks={[
        { label: "Renting 101 Guide", href: "/renters/guides/renting-101" },
        { label: "Deposit Protection Guide", href: "/renters/guides/deposits" },
        { label: "End of Tenancy Guide", href: "/renters/guides/end-of-tenancy" },
        { label: "Rent Increase Email Template", href: "/renters/templates/email-rent-increase" },
      ]}
    >
      <GuideSection title="What Is a Tenancy Agreement?">
        <p>
          A tenancy agreement is a legally binding contract between you (the tenant) and your
          landlord. It sets out the terms of your tenancy, including how much rent you pay, how long
          the tenancy lasts, and what responsibilities each party has. In England and Wales, most
          private renters have an Assured Shorthold Tenancy (AST), which is the default type of
          tenancy created when you rent from a private landlord.
        </p>
        <p>
          Your tenancy agreement does not have to be in writing to be legally valid, but having a
          written agreement makes it far easier to resolve disputes. Most landlords and agents will
          provide a written contract. You should always request one and keep a signed copy for your
          records.
        </p>
        <p>
          Even without a written agreement, you still have legal rights as a tenant. Certain rights
          are implied by law and cannot be overridden by a contract, such as the right to live in a
          property that is safe and in good repair, and protection from unfair eviction.
        </p>
      </GuideSection>

      <GuideSection title="Assured Shorthold Tenancy (AST)">
        <p>
          The Assured Shorthold Tenancy is by far the most common type of private residential
          tenancy in England. An AST gives you the right to live in the property for an agreed
          period (the fixed term), after which the tenancy usually becomes periodic (rolling on a
          week-by-week or month-by-month basis). Most ASTs have a fixed term of 6 or 12 months,
          though longer terms of two or three years are becoming more common.
        </p>
        <p>
          During the fixed term, neither you nor the landlord can end the tenancy early unless
          there is a break clause in the contract, or both parties agree. Once the fixed term ends,
          the landlord could serve a Section 21 notice to regain possession (though the Renters
          Reform Bill proposes to abolish Section 21 notices). As a tenant, you can usually leave a
          periodic tenancy by giving one month&apos;s notice.
        </p>
        <GuideCallout type="info">
          <strong>Renters Reform Bill:</strong> The UK Government&apos;s Renters (Reform) Bill
          proposes significant changes to tenancy law. Key proposals include abolishing Section 21
          &quot;no-fault&quot; evictions and moving all tenancies to periodic (rolling) arrangements
          from the start. While these changes have been delayed multiple times, they may come into
          force during your tenancy. Stay informed about the latest developments.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Periodic Tenancies">
        <p>
          A periodic tenancy arises when your fixed term ends and you continue living in the
          property without signing a new fixed-term contract. It rolls on either weekly or monthly
          (matching your rent payment frequency). A periodic tenancy offers flexibility because you
          can leave by giving notice, but it also means the landlord can seek possession more easily
          (subject to giving the required notice).
        </p>
        <p>
          You may also start on a periodic tenancy from day one if no fixed term is agreed. This is
          sometimes called a &quot;contractual periodic tenancy&quot; if set out in the agreement, or
          a &quot;statutory periodic tenancy&quot; if it arises automatically by law at the end of a
          fixed term.
        </p>
        <p>
          The notice period for ending a periodic tenancy is usually one month for monthly tenancies
          (matching a full rental period) and four weeks for weekly tenancies. Check your contract,
          as it may specify a longer notice period, though the landlord cannot require more than two
          months for a monthly periodic tenancy.
        </p>
      </GuideSection>

      <GuideSection title="Break Clauses">
        <p>
          A break clause is a provision in a fixed-term tenancy that allows either you or the
          landlord (or both) to end the tenancy early. For example, a 12-month tenancy might include
          a break clause at the 6-month mark, allowing either party to give two months&apos; notice
          from that point.
        </p>
        <p>
          If your contract has a break clause, check the wording carefully. Key things to look for
          include: who can activate it (just you, just the landlord, or both), how much notice is
          required, whether there are conditions that must be met (such as being up to date with
          rent), and the earliest date it can be used.
        </p>
        <GuideCallout type="warning">
          <strong>Watch out:</strong> Some break clauses are one-sided, meaning only the landlord can
          use them. If you are signing a long fixed-term agreement (12 months or more), negotiate for
          a mutual break clause. This gives you flexibility if your circumstances change, such as a
          job relocation. A landlord-only break clause provides you with no protection.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Joint Tenancies">
        <p>
          If you are renting with flatmates and all your names are on one tenancy agreement, you
          have a joint tenancy. This means you are all equally responsible for the full rent and any
          other obligations in the contract. If one person does not pay their share, the landlord can
          pursue any of the remaining tenants for the full amount. This is known as &quot;joint and
          several liability.&quot;
        </p>
        <p>
          Joint tenancies can be tricky if one person wants to leave before the end of the fixed
          term. In a periodic joint tenancy, one tenant giving notice can end the entire tenancy for
          everyone (this was confirmed in the Hammersmith v Monk case). During a fixed term, all
          tenants usually need to agree for anyone to be released from the contract.
        </p>
        <p>
          If you are sharing a property, discuss with your flatmates before signing what will happen
          if someone needs to leave early. Consider whether individual tenancy agreements (one per
          room) might be more appropriate, though these are less common with private landlords and
          more typical in Houses in Multiple Occupation (HMOs) managed by professional landlords.
        </p>
      </GuideSection>

      <GuideSection title="Key Clauses to Check Before Signing">
        <GuideStep number={1} title="Rent Amount and Payment Terms">
          <p>
            Confirm the exact monthly rent, when it is due, and how it should be paid (standing
            order, bank transfer, etc.). Check whether the rent includes any bills or if everything
            is separate. Note whether there is a rent review clause allowing the landlord to increase
            rent during the fixed term.
          </p>
        </GuideStep>
        <GuideStep number={2} title="Deposit Amount and Protection">
          <p>
            The agreement should state the deposit amount and confirm it will be protected in one of
            the three government-approved schemes (DPS, MyDeposits, or TDS). The deposit cannot
            exceed five weeks&apos; rent for annual rents under £50,000. You must receive prescribed
            information about the deposit within 30 days.
          </p>
        </GuideStep>
        <GuideStep number={3} title="Repair and Maintenance Responsibilities">
          <p>
            The contract should clarify who is responsible for what. By law (Section 11 of the
            Landlord and Tenant Act 1985), the landlord must maintain the structure, exterior,
            heating, hot water, and sanitary installations. The tenant is typically responsible for
            minor upkeep and reporting any issues promptly.
          </p>
        </GuideStep>
        <GuideStep number={4} title="Restrictions and Permissions">
          <p>
            Look for clauses about pets, subletting, smoking, decorating, and making alterations.
            Some restrictions may be negotiable. If you want to keep a pet, discuss this before
            signing and ask for the agreement to be amended in writing. Verbal permission is not
            enough.
          </p>
        </GuideStep>
        <GuideStep number={5} title="Notice Period and Termination">
          <p>
            Check how much notice you need to give to leave, how much notice the landlord must give
            you, and whether there is a break clause. Also look for any early termination fees,
            though these must be reasonable and reflect the landlord&apos;s actual losses under the
            Tenant Fees Act 2019.
          </p>
        </GuideStep>
      </GuideSection>

      <GuideSection title="Unfair Terms">
        <p>
          Under the Consumer Rights Act 2015, any term in a tenancy agreement that creates a
          significant imbalance between your rights and the landlord&apos;s, to your detriment, may
          be considered unfair and therefore unenforceable. Examples of potentially unfair terms
          include clauses requiring you to use a specific cleaning company at the end of the tenancy,
          excessive charges for minor damage, or terms that give the landlord unrestricted right of
          access.
        </p>
        <p>
          If you believe a clause is unfair, raise it with the landlord or agent before signing. If
          they refuse to change it, seek advice from Citizens Advice or Shelter. You can still sign
          the agreement and later challenge the unfair clause, but it is always better to address
          concerns upfront.
        </p>
        <GuideCallout type="tip">
          <strong>Top tip:</strong> Always keep a signed copy of your tenancy agreement, any emails
          or correspondence with the landlord, and records of all payments. If a dispute arises, this
          documentation is your best defence. Store digital copies securely in case the paper
          originals are lost.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="When Things Go Wrong">
        <p>
          If your landlord breaches the tenancy agreement (for example, by failing to carry out
          repairs or entering the property without notice), document everything and raise the issue
          in writing first. If the problem is not resolved, you can seek advice from Citizens Advice,
          Shelter, or a housing solicitor. In some cases, you may be able to apply to the courts for
          a remedy.
        </p>
        <p>
          If you need to leave a fixed-term tenancy early and there is no break clause, talk to your
          landlord. Many will agree to an early surrender of the tenancy if you help find a
          replacement tenant. Get any agreement to end the tenancy early in writing. If the landlord
          will not agree, you are legally responsible for rent until the end of the fixed term, even
          if you have moved out.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
