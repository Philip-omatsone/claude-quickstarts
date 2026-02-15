"use client";

import { GraduationCap } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function FirstTimeBuyersGuidePage() {
  return (
    <GuideLayout
      title="The Complete First-Time Buyer Guide"
      subtitle="Everything you need to know about buying your first home in the UK, from saving for a deposit to picking up the keys."
      icon={GraduationCap}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="15 min"
      relatedLinks={[
        { label: "Mortgage Calculator", href: "/buyers/calculators/mortgage" },
        { label: "Stamp Duty Calculator", href: "/buyers/calculators/stamp-duty" },
        { label: "First-Time Buyer Checklist", href: "/buyers/guides/process" },
        { label: "Government Schemes", href: "/buyers/guides/help-to-buy" },
      ]}
    >
      <GuideSection title="Introduction">
        <p>
          Buying your first home is one of the biggest financial decisions you will ever make. The UK
          property market can feel overwhelming, with its own language, processes, and pitfalls. This
          comprehensive guide walks you through every stage of the journey, from working out what you
          can afford to finally getting those keys in your hand. Whether you are looking at a city
          flat or a countryside cottage, the fundamentals remain the same.
        </p>
        <p>
          As a first-time buyer in England and Northern Ireland, you benefit from stamp duty relief
          on properties up to certain thresholds, and you may also be eligible for government-backed
          schemes designed to help you onto the property ladder. Understanding these advantages early
          on can save you thousands of pounds.
        </p>
      </GuideSection>

      <GuideSection title="Saving for a Deposit">
        <p>
          The deposit is typically the largest upfront cost when buying a home. Most lenders require a
          minimum of 5% of the property price, but putting down 10%, 15%, or even 20% will unlock
          better mortgage rates and reduce your monthly payments significantly. For a property costing
          £250,000, a 5% deposit would be £12,500, while a 10% deposit would be £25,000.
        </p>
        <p>
          Start by reviewing your monthly income and outgoings. Identify areas where you can cut
          back, and set up a standing order into a dedicated savings account so you are consistently
          building your deposit pot. Many first-time buyers find it helpful to use a budget planner
          to track spending and identify savings opportunities.
        </p>
        <p>
          Consider using a Lifetime ISA (LISA), which allows you to save up to £4,000 per tax year
          and receive a 25% government bonus of up to £1,000 annually. You must be aged 18 to 39 to
          open one, and the property you buy must cost £450,000 or less. The LISA bonus is paid
          monthly, and you can use it towards your first home purchase after 12 months of opening the
          account.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Open a Lifetime ISA as soon as possible, even if you can only put in
          a small amount. The 12-month qualifying period starts from when you first pay in, so
          getting that clock ticking early gives you more flexibility on when you can buy.
        </GuideCallout>

        <p>
          Other savings options include regular savings accounts, cash ISAs, and Help to Save accounts
          (if you receive Working Tax Credit or Universal Credit). Some employers offer Save As You
          Earn (SAYE) schemes or salary sacrifice arrangements that could accelerate your savings.
        </p>
      </GuideSection>

      <GuideSection title="Understanding Your Budget">
        <p>
          Before you start browsing property listings, you need a clear picture of what you can
          afford. Lenders typically offer between 4 and 4.5 times your annual household income,
          though some specialist lenders may stretch to 5 or even 6 times for certain professionals.
          A household earning £50,000 per year might be offered a mortgage of £200,000 to £225,000.
        </p>
        <p>
          However, what a lender will offer and what you can comfortably afford are not always the
          same thing. Factor in your lifestyle, future plans, and the additional costs of
          homeownership such as maintenance, insurance, and council tax. Mortgage affordability
          calculators are a useful starting point, but speaking to an independent mortgage adviser
          will give you a much more accurate picture of your borrowing power.
        </p>
        <p>
          Remember that mortgage rates significantly affect your monthly costs. A 0.5% difference in
          interest rate on a £200,000 mortgage over 25 years could mean paying around £50 more or
          less per month. That adds up to thousands over the life of the mortgage, so shopping around
          is essential.
        </p>
      </GuideSection>

      <GuideSection title="Getting a Mortgage Agreement in Principle">
        <p>
          Before viewing properties seriously, obtain a Mortgage Agreement in Principle (AIP), also
          known as a Decision in Principle (DIP). This is a statement from a lender confirming how
          much they would be willing to lend you, subject to a full application. An AIP typically
          lasts 60 to 90 days and involves a soft or hard credit check depending on the lender.
        </p>
        <p>
          Having an AIP shows estate agents and sellers that you are a serious buyer with confirmed
          borrowing power. Many estate agents will ask to see your AIP before arranging viewings on
          popular properties. To get one, you will typically need to provide details of your income,
          outgoings, employment status, and any existing debts.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> An Agreement in Principle is not a guaranteed mortgage offer.
          The lender will conduct a full assessment when you make a formal application, including a
          detailed credit check and property valuation. Your circumstances must remain broadly the
          same between the AIP and the full application.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Choosing the Right Mortgage">
        <p>
          There are several types of mortgage available to first-time buyers. Fixed-rate mortgages
          lock in your interest rate for a set period (usually two, three, or five years), giving you
          certainty over your monthly payments. Tracker mortgages follow the Bank of England base
          rate plus a set margin, meaning payments can go up or down. Standard variable rate (SVR)
          mortgages are the lender&apos;s default rate, usually higher than fixed or tracker deals.
        </p>
        <p>
          Most first-time buyers opt for a fixed-rate mortgage because of the payment certainty it
          provides. When your fixed period ends, you will usually switch to the lender&apos;s SVR
          unless you remortgage to a new deal. It is important to set a diary reminder a few months
          before your deal expires so you can start shopping for a new rate.
        </p>
        <p>
          Your mortgage term (the total length of the mortgage) also affects affordability. A 25-year
          term is traditional, but many buyers now opt for 30 or even 35-year terms to reduce monthly
          payments. While this means you pay more interest overall, it can make the difference between
          being able to buy and not. You can usually overpay or shorten the term later when your
          finances improve.
        </p>
      </GuideSection>

      <GuideSection title="The Costs of Buying a Home">
        <p>
          Beyond the deposit, buying a home comes with several additional costs that first-time
          buyers often underestimate. Budget for these from the outset to avoid any nasty surprises.
        </p>
        <p>
          <strong>Stamp Duty Land Tax (SDLT):</strong> As a first-time buyer in England and Northern
          Ireland, you pay no stamp duty on the first £425,000 of a property priced up to £625,000.
          Above £425,000 (up to £625,000), you pay 5%. If the property costs more than £625,000, you
          lose the first-time buyer relief entirely and pay standard rates. Scotland and Wales have
          their own equivalents (LBTT and LTT respectively).
        </p>
        <p>
          <strong>Solicitor/conveyancer fees:</strong> Expect to pay between £1,000 and £2,000 plus
          VAT for legal work. This covers searches, land registry fees, and managing the transfer of
          ownership. Some firms offer fixed-fee packages.
        </p>
        <p>
          <strong>Survey costs:</strong> A basic mortgage valuation may be free with some lenders, but
          a more detailed survey (such as a RICS Level 2 HomeBuyer Report) typically costs £400 to
          £700. For older or unusual properties, a full structural survey (Level 3) could cost £600
          to £1,500 or more.
        </p>
        <p>
          <strong>Mortgage arrangement fees:</strong> Some mortgages come with booking or arrangement
          fees ranging from £0 to £2,000. These can sometimes be added to the mortgage balance,
          though you will then pay interest on them.
        </p>
        <p>
          <strong>Moving costs:</strong> Removal companies typically charge £500 to £1,500 depending
          on the distance and volume. Factor in costs for redirecting mail, updating utilities, and
          any immediate repairs or furnishings.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> If your purchase falls through after you have instructed a
          solicitor and paid for a survey, you may lose those fees. Some solicitors offer
          &quot;no completion, no fee&quot; deals, and some insurers offer home buyer protection
          insurance that covers abortive costs. Consider these options to protect yourself.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Finding the Right Property">
        <p>
          Create a list of your must-haves versus nice-to-haves. Consider factors such as commute
          times, proximity to schools, local amenities, flood risk, and future development plans in
          the area. Use online tools and property portals to research areas and compare prices.
        </p>
        <p>
          When viewing properties, take your time. Visit at different times of day to get a feel for
          noise levels, traffic, and the neighbourhood. Check mobile signal strength, broadband
          availability, and parking. Ask the estate agent about the seller&apos;s situation &mdash;
          are they part of a chain? How quickly do they want to move?
        </p>
        <p>
          Do not be afraid to view a property more than once before making an offer, and consider
          bringing a friend or family member for a second opinion. Take photos and notes so you can
          compare properties later. Pay attention to signs of damp, cracks, and the condition of
          windows, roofing, and the boiler &mdash; these can indicate costly repairs down the line.
        </p>
      </GuideSection>

      <GuideSection title="Making an Offer and Negotiating">
        <p>
          Once you have found the right property, it is time to make an offer through the estate
          agent. Your offer does not have to be the asking price. Research recent sold prices for
          similar properties in the area using the Land Registry or property portals. Consider how
          long the property has been on the market and whether the price has already been reduced.
        </p>
        <p>
          When making your offer, emphasise your strengths as a buyer: you are a first-time buyer
          with no chain, you have a mortgage agreement in principle, and you are ready to proceed
          quickly. These factors can make your offer more attractive to sellers even if it is below
          the asking price.
        </p>
        <p>
          If your offer is accepted, the estate agent will send a memorandum of sale to all parties.
          At this point, the property is &quot;sold subject to contract&quot; (SSTC), but either
          party can still pull out without penalty until contracts are exchanged. This is why it is
          important to move efficiently through the next stages.
        </p>
      </GuideSection>

      <GuideSection title="Key Tips for First-Time Buyers">
        <p>
          <strong>Get your finances in order early.</strong> Check your credit report with all three
          agencies (Experian, Equifax, TransUnion) well before applying for a mortgage. Correct any
          errors and avoid taking on new credit in the months leading up to your application.
        </p>
        <p>
          <strong>Use an independent mortgage broker.</strong> A whole-of-market broker can access
          deals from hundreds of lenders, including exclusive products not available directly. They
          handle the application process and can significantly reduce the stress of securing a
          mortgage.
        </p>
        <p>
          <strong>Do not overstretch yourself.</strong> Interest rates can rise, boilers can break
          down, and unexpected costs will arise. Make sure you have a financial buffer after
          completing your purchase &mdash; ideally three to six months&apos; worth of expenses in an
          emergency fund.
        </p>
        <p>
          <strong>Consider the long term.</strong> Think about whether the property will meet your
          needs in five to ten years. Moving house is expensive, so buying somewhere with room to
          grow (or in an area with good resale value) can save you money in the long run.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Keep all your financial documents organised in one place &mdash; pay
          slips, bank statements, tax returns, and ID documents. Your mortgage lender and solicitor
          will need these throughout the process, and having them ready will speed things up
          considerably.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
