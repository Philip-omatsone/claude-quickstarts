"use client";

import { Lightbulb } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
  GuideStep,
} from "@/components/guides/GuideLayout";

export default function BillsGuidePage() {
  return (
    <GuideLayout
      title="Setting Up Bills When You Move In"
      subtitle="A complete guide to council tax, energy, water, broadband, TV licence, and budgeting for your rental."
      icon={Lightbulb}
      backHref="/renters/guides"
      backLabel="All Guides"
      readTime="6 min"
      relatedLinks={[
        { label: "Bills Estimator Calculator", href: "/renters/calculators/bills-estimator" },
        { label: "Rent Split Calculator", href: "/renters/calculators/rent-split" },
        { label: "Moving In Checklist", href: "/renters/checklists/moving-in" },
        { label: "Flatshare Guide", href: "/renters/guides/flatshare-guide" },
      ]}
    >
      <GuideSection title="Council Tax">
        <p>
          Council tax is a local tax set by your council to pay for services like rubbish collection,
          street lighting, and local policing. The amount you pay depends on the valuation band of
          your property (A to H in England, based on the property&apos;s value in 1991) and your
          local council&apos;s rate. You can check your property&apos;s council tax band on the
          government&apos;s website.
        </p>
        <p>
          You need to register for council tax with your local council as soon as you move in.
          Contact them with your move-in date, the property address, and the names of all adults
          living there. Most councils allow you to register and pay online. You can usually choose to
          pay monthly (over 10 or 12 months) by direct debit.
        </p>
        <p>
          If you live alone, you are entitled to a 25% single person discount. Full-time students are
          exempt from council tax entirely; if everyone in the household is a full-time student, the
          property is exempt. You will need to provide proof from your university. Other people who
          are &quot;disregarded&quot; for council tax purposes include certain carers, people with
          severe mental impairment, and some apprentices.
        </p>
        <GuideCallout type="tip">
          <strong>Saving money:</strong> If you are on a low income, you may be eligible for Council
          Tax Reduction (formerly Council Tax Benefit). Each council runs its own scheme, so check
          with yours. Also, if you believe your property is in the wrong council tax band, you can
          challenge it. If successful, you could save hundreds of pounds per year and may receive a
          backdated refund.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Energy (Gas and Electricity)">
        <p>
          When you move into a rental property, you are automatically supplied by whoever provided
          energy to the previous occupant. However, you are free to switch to any supplier you like,
          unless your tenancy agreement specifically states otherwise (which is rare and potentially
          unfair). Take meter readings on your first day and submit them to the current supplier.
        </p>
        <p>
          To find the best deal, use a comparison website such as Ofgem&apos;s price comparison
          tool, Uswitch, or Compare the Market. Since the energy crisis of 2022-2023, the market has
          been volatile, so check whether a fixed-rate tariff offers savings compared to the energy
          price cap. If you are on a prepayment meter, you can ask the supplier to switch you to a
          credit meter at no charge. Credit meters are generally cheaper and more convenient.
        </p>
        <p>
          Your landlord is responsible for ensuring the property has a valid Energy Performance
          Certificate (EPC) rated at least E. If the property is rated F or G, the landlord may be
          in breach of the Minimum Energy Efficiency Standards (MEES) regulations and you should
          report this to your local council.
        </p>
      </GuideSection>

      <GuideSection title="Water">
        <p>
          Unlike gas and electricity, you cannot choose your water supplier. Your supply is
          determined by where you live. The main water companies in England include Thames Water,
          United Utilities, Severn Trent, Anglian Water, Yorkshire Water, and others depending on
          the region. You can find your supplier by checking the Water Services Regulation Authority
          (Ofwat) website.
        </p>
        <p>
          Contact your water company to set up your account when you move in. If the property has a
          water meter, you will pay based on usage. If there is no meter, you will pay a fixed annual
          charge based on the property&apos;s rateable value. In most cases, a metered supply works
          out cheaper for smaller households (one or two people), while an unmetered supply may be
          cheaper for larger households.
        </p>
        <p>
          If you are on a low income, you may qualify for a social tariff or affordability scheme
          offered by your water company. These can significantly reduce your bills. WaterSure is a
          scheme that caps bills at the average household rate if you receive certain benefits and
          either have a large family or a medical condition requiring extra water use.
        </p>
      </GuideSection>

      <GuideSection title="Broadband and Phone">
        <p>
          Setting up broadband is straightforward but requires some planning. Most broadband
          contracts are 12, 18, or 24 months. If you are on a short tenancy, look for a shorter
          contract or a no-contract rolling monthly plan to avoid early termination fees. Some
          providers offer specific packages for renters.
        </p>
        <p>
          Check what broadband infrastructure is available at your property before signing up. You
          can check full fibre (FTTP) availability on the Openreach or Virgin Media websites, or use
          comparison sites like Broadband Choices or MoneySupermarket. Speeds and availability vary
          significantly between areas and even between neighbouring streets.
        </p>
        <p>
          If you are in a flatshare, discuss with your housemates who will hold the broadband account
          and how the cost will be split. It is simpler to have one person manage the account and
          collect contributions from others. Apps like Splitwise can help track shared expenses.
        </p>
        <GuideCallout type="info">
          <strong>Moving mid-contract:</strong> If you move before your broadband contract ends, many
          providers will let you transfer the contract to your new address at no extra cost, as long
          as they cover the new area. If they cannot provide service at the new address, you can
          usually leave the contract without penalty. Always check the provider&apos;s moving policy
          before signing up.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="TV Licence">
        <p>
          You need a TV licence if you watch or record live television on any channel or device
          (including phones, tablets, and laptops), or if you watch or stream programmes on BBC
          iPlayer (live, catch-up, or on-demand). The standard colour TV licence costs £169.50 per
          year (as of 2024/25). You can pay monthly, quarterly, or annually.
        </p>
        <p>
          If you only watch on-demand streaming services like Netflix, Disney+, or Amazon Prime Video
          and never watch live TV or BBC iPlayer, you do not need a TV licence. However, you should
          make a formal declaration at tvlicensing.co.uk to confirm this, otherwise you may receive
          letters and visits from TV Licensing enforcement.
        </p>
        <p>
          In a shared house, you may only need one licence for the whole property if you all share a
          communal living area with a single tenancy agreement. However, if you each have a separate
          tenancy agreement for your individual room (as in some HMOs), each tenant may need their
          own licence for any device they use in their private room. Check the TV Licensing website
          for the specific rules.
        </p>
      </GuideSection>

      <GuideSection title="Contents Insurance">
        <p>
          Your landlord&apos;s buildings insurance does not cover your personal belongings. If there
          is a fire, flood, or burglary, your possessions would not be covered unless you have your
          own contents insurance. A basic policy typically costs between £5 and £15 per month and
          covers items like electronics, furniture, clothing, and jewellery.
        </p>
        <p>
          When taking out a policy, make sure it covers the risks relevant to you. Check whether it
          includes accidental damage, cover for items taken outside the home (such as laptops and
          phones), and any high-value individual items. Some policies also cover temporary
          accommodation costs if the property becomes uninhabitable.
        </p>
        <GuideCallout type="warning">
          <strong>Do not skip contents insurance.</strong> It is one of the most affordable
          protections available to renters. Imagine losing all your possessions in a fire or flood
          and having to replace everything out of pocket. A few pounds a month could save you
          thousands. Compare quotes on sites like GoCompare, MoneySupermarket, or directly with
          insurers like Lemonade or Urban Jungle, who specialise in renter-friendly policies.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Budgeting for Bills">
        <p>
          As a rough guide, expect your total monthly bills (excluding rent) to be between £150 and
          £300 per person, depending on the property size, location, and your usage. Council tax is
          typically the largest single bill after rent, followed by energy. Here is a rough monthly
          breakdown for a single person in an average one-bed flat: council tax £100-£150 (after
          single person discount), energy £80-£130, water £20-£40, broadband £25-£35, TV licence
          £14, and contents insurance £5-£15.
        </p>
        <p>
          Set up direct debits for all your bills to avoid missed payments and late fees. Consider
          opening a separate bank account just for bills if you are in a shared house, with everyone
          contributing their share by standing order each month. This keeps things transparent and
          avoids arguments. Our Bills Estimator and Rent Split calculators can help you plan.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
