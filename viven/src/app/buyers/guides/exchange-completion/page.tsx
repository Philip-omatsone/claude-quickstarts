"use client";

import { Key } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function ExchangeCompletionGuidePage() {
  return (
    <GuideLayout
      title="Exchange & Completion Explained"
      subtitle="Understanding the critical final stages of buying a property, from exchanging contracts to picking up the keys on completion day."
      icon={Key}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="8 min"
      relatedLinks={[
        { label: "Buying Process Guide", href: "/buyers/guides/process" },
        { label: "Solicitors & Conveyancing", href: "/buyers/guides/solicitors" },
        { label: "Buildings Insurance", href: "/buyers/guides/buildings-insurance" },
        { label: "First-Time Buyer Guide", href: "/buyers/guides/first-time-buyers" },
      ]}
    >
      <GuideSection title="Overview">
        <p>
          Exchange and completion are the two final milestones in the property buying process. They
          are distinct legal events, and understanding the difference between them is essential.
          Exchange of contracts is when the purchase becomes legally binding, while completion is
          when the money changes hands and you take ownership of the property. These can happen on
          the same day (known as a simultaneous exchange and completion) or with a gap between them,
          typically one to four weeks.
        </p>
      </GuideSection>

      <GuideSection title="Before Exchange: Getting Everything in Place">
        <p>
          Before contracts can be exchanged, several things need to be in order. Your solicitor must
          have received satisfactory results from all property searches, resolved any outstanding
          enquiries with the seller&apos;s solicitor, and reviewed the final contract. You must have
          a formal mortgage offer in place, buildings insurance arranged to start on the date of
          exchange, and your deposit funds ready to transfer.
        </p>
        <p>
          Your solicitor will send you a report on the title, summarising their findings from the
          searches and enquiries. Read this carefully and raise any questions before proceeding. You
          will also receive a completion statement detailing all the financial aspects of the
          transaction, including the purchase price, deposit, mortgage advance, solicitor&apos;s
          fees, disbursements, and stamp duty.
        </p>
        <p>
          If you are in a chain (a sequence of linked transactions), all parties in the chain must
          be ready to exchange at the same time. This can be the most frustrating part of the
          process, as a delay by any one party holds up everyone. Your solicitor and estate agent
          will coordinate with the other parties to agree an exchange date.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> Your solicitor will ask you to sign the contract and
          transfer the deposit before the agreed exchange date so they have everything ready.
          The deposit is usually 10% of the purchase price, though a 5% deposit can sometimes be
          negotiated, particularly for first-time buyers.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="What Happens at Exchange">
        <p>
          Exchange of contracts is carried out by the solicitors, not by you directly. The two
          solicitors speak by phone and formally confirm the agreed terms of the contract. They
          each hold a signed copy of the contract, and once the terms are confirmed, the contracts
          are said to be &quot;exchanged.&quot; The deposit is transferred from the buyer&apos;s
          solicitor to the seller&apos;s solicitor on the same day.
        </p>
        <p>
          From the moment of exchange, the purchase is legally binding on both sides. If the buyer
          pulls out after exchange, they forfeit their deposit and may be sued for damages. If the
          seller pulls out, they must return the deposit and may also face a claim for damages. This
          legal commitment is what makes exchange such a significant milestone.
        </p>
        <p>
          At exchange, a completion date is formally agreed and written into the contract. This is
          the date on which the remaining funds will be transferred and you will take possession of
          the property. In a chain, the completion date must work for all parties.
        </p>
      </GuideSection>

      <GuideSection title="Between Exchange and Completion">
        <p>
          The period between exchange and completion is typically one to four weeks, though it can
          be shorter (even the same day) or longer by agreement. During this period, you should
          finalise your moving arrangements, including booking removal companies, arranging utility
          transfers, and setting up mail redirection through Royal Mail.
        </p>
        <p>
          Your buildings insurance should already be in place from the date of exchange. This is
          critical because from exchange onwards, you have a legal interest in the property and
          would still be required to complete the purchase even if the property were damaged or
          destroyed. Your mortgage lender will typically require proof of buildings insurance before
          releasing the mortgage funds.
        </p>
        <p>
          Your solicitor will request the mortgage funds from your lender a few days before
          completion. They will also prepare the transfer deed and any other documents needed for
          the Land Registry application. Ensure that any remaining funds you need to contribute
          (the difference between the mortgage advance, deposit, and total due) are in your
          solicitor&apos;s account in good time.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> Never transfer large sums of money based solely on email
          instructions. Solicitor email accounts are a target for fraud. Always confirm bank
          details by phone using the number on your solicitor&apos;s letterhead (not one from an
          email) before transferring any funds.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="What Happens on Completion Day">
        <p>
          Completion day is the day you officially become the owner of your new home. Here is what
          happens, step by step:
        </p>
        <p>
          <strong>Morning:</strong> Your solicitor transfers the remaining purchase funds (the
          mortgage advance plus your equity contribution minus the deposit already paid) to the
          seller&apos;s solicitor. The transfer is made via the banking system and typically arrives
          by mid-morning, though delays can occur, especially on busy days such as the last Friday
          of the month.
        </p>
        <p>
          <strong>Confirmation:</strong> Once the seller&apos;s solicitor confirms receipt of the
          funds, completion has taken place. The seller&apos;s solicitor notifies the estate agent,
          who releases the keys to you. Your solicitor will call or email you to confirm that
          completion has happened and you can collect the keys.
        </p>
        <p>
          <strong>Collecting keys:</strong> You collect the keys from the estate agent&apos;s
          office. In some cases, the seller may leave the keys at the property itself, but
          collecting from the agent is more common. Check that you have all sets of keys, including
          any for garages, sheds, or communal areas.
        </p>
        <p>
          <strong>Moving in:</strong> Once you have the keys, the property is yours. Take meter
          readings for gas, electricity, and water as soon as you arrive. Photograph the readings
          for your records. Test the heating, hot water, and all appliances. Check that the property
          is in the condition agreed &mdash; the seller should have left it clean and removed all
          their belongings unless otherwise agreed.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Try to complete on a day other than Friday. Fridays are the most
          popular completion day, which means the banking system is busiest and delays are more
          likely. Completing on a Tuesday, Wednesday, or Thursday gives you a smoother day and
          the weekend to unpack before returning to work.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="After Completion">
        <p>
          After completion, your solicitor handles several important tasks. They will pay your
          Stamp Duty Land Tax (SDLT) to HMRC within 14 days and submit the Land Registry
          application to register you as the new owner. Land Registry processing can take several
          weeks or even months, but you are the legal owner from completion regardless.
        </p>
        <p>
          You should take the following steps in the first few days after completion:
        </p>
        <p>
          <strong>Notify the council:</strong> Register for council tax at your new address and
          cancel it at your old one. If you are eligible for any council tax discounts (such as
          the single person discount), apply for these at the same time.
        </p>
        <p>
          <strong>Set up utilities:</strong> Contact gas, electricity, and water providers to
          register the accounts in your name and provide your opening meter readings.
        </p>
        <p>
          <strong>Redirect mail:</strong> Set up a Royal Mail redirection from your old address.
          This costs a modest fee and ensures you do not miss any important correspondence during
          the transition.
        </p>
        <p>
          <strong>Change your address:</strong> Update your address with your bank, employer,
          GP, dentist, DVLA (for your driving licence and vehicle registration), electoral roll,
          and any subscriptions or memberships.
        </p>
        <p>
          <strong>Secure the property:</strong> Consider changing the locks, as you have no way
          of knowing how many copies of the keys exist. Check that all windows and doors lock
          properly and review the home security arrangements.
        </p>
      </GuideSection>

      <GuideSection title="Simultaneous Exchange and Completion">
        <p>
          In some cases, exchange and completion happen on the same day. This is more common in
          chain-free transactions or where speed is essential. While it avoids the waiting period
          between exchange and completion, it also increases the risk &mdash; if something goes
          wrong on the day, you could be left without a home and without legal recourse.
        </p>
        <p>
          Your solicitor and mortgage broker can advise whether a simultaneous exchange and
          completion is appropriate for your circumstances. If you do proceed on this basis,
          ensure your buildings insurance is arranged in advance and your removal company is
          booked provisionally, as you will not have absolute certainty until the contracts are
          exchanged on the morning of the same day.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
