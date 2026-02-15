"use client";

import { ListOrdered } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
  GuideStep,
} from "@/components/guides/GuideLayout";

export default function BuyingProcessGuidePage() {
  return (
    <GuideLayout
      title="The Step-by-Step Home Buying Process"
      subtitle="A complete walkthrough of every stage of buying a property in England and Wales, from initial research to getting the keys."
      icon={ListOrdered}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="12 min"
      relatedLinks={[
        { label: "First-Time Buyer Guide", href: "/buyers/guides/first-time-buyers" },
        { label: "Mortgage Types Explained", href: "/buyers/guides/mortgages" },
        { label: "Solicitors & Conveyancing", href: "/buyers/guides/solicitors" },
        { label: "Exchange & Completion", href: "/buyers/guides/exchange-completion" },
      ]}
    >
      <GuideSection title="Overview">
        <p>
          Buying a property in the UK typically takes between 12 and 20 weeks from having an offer
          accepted to completing the purchase, though it can take longer if there is a chain or
          complications arise. Understanding each step of the process helps you stay in control,
          anticipate what comes next, and avoid common delays.
        </p>
        <p>
          This guide covers the process in England and Wales. Scotland uses a different system
          involving solicitors&apos; property centres and a sealed-bid process, while Northern Ireland
          has its own variations. The broad principles remain similar, but the legal procedures
          differ.
        </p>
      </GuideSection>

      <GuideStep number={1} title="Decide to Buy and Assess Your Budget">
        <p>
          Before you begin searching for properties, take an honest look at your financial
          situation. Calculate your total savings, monthly income, and regular outgoings. Use
          mortgage affordability calculators to estimate how much you could borrow. Most UK lenders
          offer between 4 and 4.5 times your annual household income, subject to affordability
          checks.
        </p>
        <p>
          Factor in all the costs of buying &mdash; not just the deposit. You will need to budget
          for solicitor fees (£1,000 to £2,000 plus VAT), survey costs (£400 to £1,500), mortgage
          arrangement fees (up to £2,000), stamp duty, and moving costs. Having a clear budget from
          the outset prevents you from falling in love with a property you cannot afford.
        </p>
      </GuideStep>

      <GuideStep number={2} title="Get a Mortgage Agreement in Principle">
        <p>
          A Mortgage Agreement in Principle (AIP) is a conditional statement from a lender
          confirming the amount they would be prepared to lend you. It typically lasts 60 to 90 days
          and involves a credit check. Having an AIP strengthens your position as a buyer and shows
          estate agents and sellers that you are serious.
        </p>
        <p>
          To get an AIP, you will need to provide details about your income, employment, and
          financial commitments. An independent mortgage broker can help you find the best deals
          across the whole market. They can also advise whether a soft or hard credit search AIP is
          more appropriate for your circumstances.
        </p>
      </GuideStep>

      <GuideStep number={3} title="Start Your Property Search">
        <p>
          Register with property portals and local estate agents in your target areas. Set up email
          alerts for new listings that match your criteria. Attend open days and book viewings for
          properties that interest you.
        </p>
        <p>
          When viewing properties, look beyond the staging and decor. Check for signs of damp,
          cracks in walls, the condition of windows, and the state of the roof. Note the aspect of
          the garden, parking availability, and the general condition of the street. Visit at
          different times of day if possible to check noise levels and traffic.
        </p>
        <GuideCallout type="tip">
          <strong>Tip:</strong> Create a spreadsheet to compare properties you have viewed. Include
          columns for price, location, condition, commute time, and your overall impression. This
          makes it much easier to compare options objectively when you have seen multiple properties.
        </GuideCallout>
      </GuideStep>

      <GuideStep number={4} title="Make an Offer">
        <p>
          When you find the right property, make your offer through the estate agent. Research
          comparable sold prices in the area to inform your offer. In your offer, highlight your
          position: whether you are chain-free, have an AIP, and your target timeline for completion.
        </p>
        <p>
          Estate agents are legally obliged to pass all offers to the seller. Do not be afraid to
          negotiate &mdash; most properties sell for less than the asking price, especially if they
          have been on the market for a while. If your offer is rejected, the agent may come back
          with a counteroffer. Once a price is agreed, the agent will issue a memorandum of sale
          confirming the details to all parties.
        </p>
      </GuideStep>

      <GuideStep number={5} title="Instruct a Solicitor or Conveyancer">
        <p>
          As soon as your offer is accepted, instruct a solicitor or licensed conveyancer to handle
          the legal work. They will manage property searches, review the contract, handle the
          transfer of funds, and deal with the Land Registry. You can choose a local firm or an
          online conveyancer &mdash; both are equally valid options.
        </p>
        <p>
          Your solicitor will carry out several searches including local authority searches (checking
          planning applications, road schemes, and conservation areas), environmental searches
          (flood risk, contaminated land), and water and drainage searches. These can take two to
          six weeks depending on the local authority.
        </p>
      </GuideStep>

      <GuideStep number={6} title="Submit Your Full Mortgage Application">
        <p>
          With your offer accepted, submit your full mortgage application. Your lender will require
          extensive documentation including proof of identity, proof of address, bank statements
          (usually the last three months), pay slips, your P60, and details of the property. If
          you are self-employed, you will typically need two to three years of accounts or tax
          returns.
        </p>
        <p>
          The lender will arrange a mortgage valuation of the property. This is not a survey for
          your benefit &mdash; it simply confirms to the lender that the property is worth what you
          are paying. It may be a physical visit or a desktop valuation. The full application
          process typically takes two to four weeks.
        </p>
        <GuideCallout type="info">
          <strong>Good to know:</strong> Do not change jobs, take on new credit, or make unusual
          large transactions during your mortgage application. Lenders will re-check your finances
          before issuing the formal offer, and any significant changes could delay or derail your
          application.
        </GuideCallout>
      </GuideStep>

      <GuideStep number={7} title="Arrange a Property Survey">
        <p>
          While the mortgage valuation confirms value for the lender, a proper survey is for your
          benefit. A RICS Level 2 HomeBuyer Report is suitable for most standard properties built
          after 1930. For older, larger, or unusual properties, a Level 3 Building Survey provides
          a more thorough investigation.
        </p>
        <p>
          The survey may reveal issues that allow you to renegotiate the price or request repairs
          before completion. If serious problems are found (such as subsidence, severe damp, or
          structural issues), you may decide to withdraw your offer entirely. The cost of a survey
          is always worthwhile compared to the potential cost of undiscovered defects.
        </p>
      </GuideStep>

      <GuideStep number={8} title="Receive Your Mortgage Offer and Review the Contract">
        <p>
          Once the lender is satisfied with your application and valuation, they will issue a formal
          mortgage offer. This is the binding commitment to lend you the money, subject to certain
          conditions. Your solicitor will review the offer to ensure the terms are correct.
        </p>
        <p>
          Meanwhile, your solicitor will be reviewing the draft contract, title deeds, and property
          information forms provided by the seller&apos;s solicitor. They will raise enquiries
          (questions) about anything unclear or concerning. This process of raising and answering
          enquiries can take several weeks and is often the stage where the most delays occur.
        </p>
      </GuideStep>

      <GuideStep number={9} title="Exchange Contracts">
        <p>
          Exchange of contracts is the point at which the purchase becomes legally binding. Before
          exchange, your solicitor will ask you to sign the contract and transfer your deposit
          (usually 10% of the purchase price, though 5% can sometimes be negotiated). A completion
          date is agreed by all parties.
        </p>
        <p>
          The solicitors exchange contracts by reading out the agreed terms over the phone and
          confirming agreement. From this moment, pulling out would mean losing your deposit and
          potentially facing a claim for damages. Buildings insurance should be in place from the
          date of exchange, as you have a legal interest in the property from this point.
        </p>
        <GuideCallout type="warning">
          <strong>Important:</strong> Make sure you have buildings insurance arranged to start on
          the day of exchange, not completion. If the property were damaged between exchange and
          completion, you would still be legally required to buy it.
        </GuideCallout>
      </GuideStep>

      <GuideStep number={10} title="Complete and Collect the Keys">
        <p>
          Completion day is when the remaining funds are transferred from your solicitor to the
          seller&apos;s solicitor. This usually happens on a weekday, typically a Friday or the date
          agreed at exchange. Your solicitor will confirm when the money has been received by the
          seller&apos;s solicitor, at which point you can collect the keys from the estate agent.
        </p>
        <p>
          Your solicitor will then register you as the new owner with the Land Registry and pay
          any stamp duty on your behalf (using funds you have provided). The Land Registry
          registration can take several weeks or even months, but you can move in as soon as
          completion takes place. Take meter readings when you arrive, and notify the council,
          utility providers, and Royal Mail of your new address.
        </p>
      </GuideStep>

      <GuideSection title="Common Causes of Delay">
        <p>
          Understanding what can slow down the process helps you prepare and act quickly when
          needed. The most common causes of delay include slow local authority searches, lengthy
          chains where one buyer or seller falls through, mortgage application issues, and
          unresolved enquiries between solicitors.
        </p>
        <p>
          Stay in regular contact with your solicitor and mortgage broker. Chase promptly when
          documents are requested, and respond to queries the same day if possible. If you are
          in a chain, ask your estate agent for regular updates on the progress of other parties.
          Being proactive can shave weeks off the overall timeline.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
