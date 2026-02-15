"use client";

import { Scale } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function SolicitorsGuidePage() {
  return (
    <GuideLayout
      title="Conveyancing & Solicitors Explained"
      subtitle="What a conveyancing solicitor does, how to choose one, typical costs, and what to expect during the legal side of buying a property."
      icon={Scale}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="8 min"
      relatedLinks={[
        { label: "Buying Process Guide", href: "/buyers/guides/process" },
        { label: "Exchange & Completion", href: "/buyers/guides/exchange-completion" },
        { label: "Leasehold vs Freehold", href: "/buyers/guides/leasehold-vs-freehold" },
        { label: "Property Surveys", href: "/buyers/guides/surveys" },
      ]}
    >
      <GuideSection title="What Is Conveyancing?">
        <p>
          Conveyancing is the legal process of transferring ownership of a property from one person
          to another. In England and Wales, this process is handled by a solicitor or licensed
          conveyancer who acts on your behalf to ensure the property is legally sound, carry out
          necessary searches, handle the contract, manage the transfer of funds, and register you
          as the new owner with the Land Registry.
        </p>
        <p>
          Conveyancing begins when your offer is accepted and ends after completion, when the
          property is registered in your name. The process typically takes 8 to 12 weeks, though
          it can take longer in complex cases or when there is a chain of buyers and sellers.
        </p>
      </GuideSection>

      <GuideSection title="Solicitor vs Licensed Conveyancer">
        <p>
          Both solicitors and licensed conveyancers can handle residential property transactions.
          A solicitor is a qualified lawyer who may specialise in conveyancing among other areas of
          law. A licensed conveyancer is a specialist property lawyer who focuses exclusively on
          property transactions.
        </p>
        <p>
          Both are regulated (solicitors by the Solicitors Regulation Authority, conveyancers by
          the Council for Licensed Conveyancers) and must carry professional indemnity insurance.
          The choice between them often comes down to cost and personal preference. Licensed
          conveyancers tend to be slightly cheaper, while solicitors may offer a broader range of
          legal expertise if any unusual issues arise during the transaction.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> Some estate agents will recommend a particular solicitor
          or conveyancer. You are under no obligation to use the one they suggest. Shop around and
          choose based on reputation, reviews, responsiveness, and cost rather than convenience.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="What Does a Conveyancer Do?">
        <p>
          Your conveyancer handles a wide range of tasks throughout the buying process. Here is a
          breakdown of the key activities:
        </p>
        <p>
          <strong>Property searches:</strong> Your conveyancer will carry out a series of searches
          to uncover any issues that might affect the property or your use of it. These include
          local authority searches (checking for planning applications, road schemes, tree
          preservation orders, and conservation areas), environmental searches (flood risk,
          contaminated land, radon), water and drainage searches, and sometimes mining or chancel
          repair searches depending on the location.
        </p>
        <p>
          <strong>Title investigation:</strong> They will examine the title deeds to confirm the
          seller&apos;s legal right to sell and check for any restrictions, covenants, or rights
          of way that affect the property. This might include easements (such as a neighbour&apos;s
          right to access a shared drain) or restrictive covenants (such as a prohibition on
          running a business from the property).
        </p>
        <p>
          <strong>Raising enquiries:</strong> After reviewing the contract and supporting documents,
          your conveyancer will raise enquiries with the seller&apos;s solicitor about anything
          unclear, missing, or concerning. This might include questions about boundaries, planning
          permissions for extensions, building regulations compliance certificates, or guarantees
          for work carried out.
        </p>
        <p>
          <strong>Reviewing the mortgage offer:</strong> Your conveyancer will review your mortgage
          offer to ensure the terms are correct and the conditions are met. They may also act for
          your mortgage lender (known as &quot;dual representation&quot;), which is common for
          standard residential purchases.
        </p>
        <p>
          <strong>Exchanging contracts:</strong> Once all enquiries are resolved and you are ready
          to proceed, your conveyancer will arrange the exchange of contracts. This involves
          confirming the terms of the contract over the phone with the seller&apos;s solicitor and
          transferring the deposit.
        </p>
        <p>
          <strong>Completing the purchase:</strong> On completion day, your conveyancer transfers
          the remaining funds to the seller&apos;s solicitor, confirms completion, and handles
          post-completion tasks including paying stamp duty and registering the change of ownership
          with the Land Registry.
        </p>
      </GuideSection>

      <GuideSection title="Typical Conveyancing Costs">
        <p>
          Conveyancing costs comprise the solicitor&apos;s fees and disbursements (third-party
          costs). Here is a breakdown of what you can expect to pay:
        </p>
        <p>
          <strong>Solicitor&apos;s fee:</strong> £800 to £1,500 plus VAT (20%). Some firms offer
          fixed-fee packages, while others charge on an hourly basis. Fixed fees give you certainty,
          but check what is included &mdash; some firms charge extra for dealing with leasehold
          properties, new builds, shared ownership, Help to Buy, or gifted deposits.
        </p>
        <p>
          <strong>Local authority searches:</strong> £150 to £400, depending on the council. Some
          councils are faster than others &mdash; a slow search can hold up the whole process.
        </p>
        <p>
          <strong>Environmental search:</strong> £30 to £50 for a standard report.
        </p>
        <p>
          <strong>Water and drainage search:</strong> £30 to £60.
        </p>
        <p>
          <strong>Land Registry fees:</strong> £20 to £270, depending on the purchase price and
          whether the application is made electronically.
        </p>
        <p>
          <strong>Stamp Duty Land Tax:</strong> Your solicitor submits the return and pays the duty
          on your behalf, using funds you have provided. The amount depends on the purchase price
          and whether you are a first-time buyer.
        </p>
        <p>
          <strong>Bank transfer fees:</strong> £25 to £50 per transfer. There are usually two or
          three transfers during the process.
        </p>
        <p>
          In total, you should budget £1,500 to £3,000 for all legal costs including disbursements
          and VAT. Leasehold purchases tend to be at the higher end due to the additional work
          involved in reviewing the lease and management arrangements.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> Be wary of very cheap conveyancing quotes. Firms that undercut
          the market often handle a very high volume of cases per fee earner, which can lead to slow
          communication and delays. A slightly higher fee for a responsive, experienced solicitor
          often pays for itself in a smoother, faster transaction.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="How to Choose a Conveyancer">
        <p>
          When choosing a conveyancer, consider the following factors:
        </p>
        <p>
          <strong>Reputation and reviews:</strong> Check online reviews on Google, Trustpilot, and
          the Solicitors Regulation Authority website. Ask friends, family, or your mortgage broker
          for recommendations. A solicitor with consistently good reviews is more likely to provide
          a smooth experience.
        </p>
        <p>
          <strong>Communication:</strong> One of the biggest complaints about conveyancing is poor
          communication. Ask the firm how they will keep you updated (email, phone, online portal),
          how quickly they typically respond to queries, and whether you will have a named point of
          contact.
        </p>
        <p>
          <strong>Experience:</strong> Choose a firm with experience handling the type of property
          you are buying. If you are purchasing a leasehold flat, a new build, or a property through
          a government scheme, make sure they have specific expertise in those areas.
        </p>
        <p>
          <strong>Panel membership:</strong> If you have already chosen a mortgage lender, check
          that the solicitor is on the lender&apos;s panel. Most high-street firms are on most
          lender panels, but it is worth confirming to avoid delays.
        </p>
        <p>
          <strong>Fixed fee vs hourly rate:</strong> Fixed-fee conveyancing gives you certainty, but
          check what is included. Ask about additional charges for leasehold properties, new builds,
          or unusual circumstances. Get a full cost breakdown in writing before instructing them.
        </p>
      </GuideSection>

      <GuideSection title="Timeline and Common Delays">
        <p>
          The conveyancing timeline varies depending on the complexity of the transaction and the
          responsiveness of all parties. A straightforward freehold purchase with no chain might
          complete in 8 to 10 weeks. A leasehold purchase in a long chain could take 16 weeks or
          more.
        </p>
        <p>
          Common causes of delay include slow local authority searches, unresolved enquiries with
          the seller&apos;s solicitor, missing or outdated documents (such as building regulations
          certificates), delays in the chain, and mortgage offer conditions that need to be
          satisfied. You can help speed things up by responding promptly to requests from your
          solicitor, providing all documents as quickly as possible, and maintaining regular
          communication.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Ask your solicitor for a conveyancing timeline at the outset, and
          request weekly email updates on progress. If you have not heard anything for more than a
          week, do not hesitate to chase. Staying engaged in the process helps keep things moving.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
