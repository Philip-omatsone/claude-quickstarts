"use client";

import { MapPin } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function BuyingInLondonGuidePage() {
  return (
    <GuideLayout
      title="Buying a Property in London"
      subtitle="A London-specific guide covering zones, transport, pricing, shared ownership, government schemes, and practical tips for navigating the capital's property market."
      icon={MapPin}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="10 min"
      relatedLinks={[
        { label: "Shared Ownership Guide", href: "/buyers/guides/shared-ownership" },
        { label: "Government Schemes", href: "/buyers/guides/help-to-buy" },
        { label: "Stamp Duty Guide", href: "/buyers/guides/stamp-duty-guide" },
        { label: "Leasehold vs Freehold", href: "/buyers/guides/leasehold-vs-freehold" },
      ]}
    >
      <GuideSection title="The London Property Market">
        <p>
          London&apos;s property market is unique in the UK. Average house prices are significantly
          higher than the national average, and the market is characterised by intense competition,
          fast-paced transactions, and a diverse range of property types from Victorian terraces to
          modern high-rise apartments. Understanding the dynamics of the London market is essential
          for making a successful purchase.
        </p>
        <p>
          Despite the high prices, London offers exceptional transport links, employment
          opportunities, cultural amenities, and a cosmopolitan lifestyle that continues to attract
          buyers from across the UK and around the world. The city&apos;s property market is also
          remarkably varied &mdash; prices, property types, and neighbourhood character can change
          dramatically from one street to the next.
        </p>
      </GuideSection>

      <GuideSection title="Understanding London Zones">
        <p>
          London is divided into transport zones numbered 1 (central) to 6 (outer suburbs), with
          some areas extending to zone 9. Property prices generally decrease as you move outward,
          though this is not always the case &mdash; desirable outer London areas like Richmond
          (zone 4) can be more expensive than some zone 2 locations.
        </p>
        <p>
          <strong>Zone 1 (Central London):</strong> Westminster, City of London, parts of Camden,
          Southwark, and Lambeth. Expect to pay a significant premium for central living. Flats
          dominate the market, and many are leasehold. Ideal for those who work centrally and want
          to walk or cycle to work.
        </p>
        <p>
          <strong>Zone 2:</strong> Includes popular areas like Brixton, Hackney, Islington,
          Clapham, and Peckham. A mix of Victorian and Georgian housing alongside modern
          developments. These areas often offer better value than zone 1 while remaining well-
          connected to central London.
        </p>
        <p>
          <strong>Zones 3 to 4:</strong> Areas like Wimbledon, Greenwich, Ealing, and Walthamstow.
          More space for your money, a greater mix of houses and flats, and often a more suburban
          feel while still being within 30 to 45 minutes of central London by tube or train.
        </p>
        <p>
          <strong>Zones 5 to 6 and beyond:</strong> Outer London boroughs and commuter towns
          including areas like Bromley, Croydon, Barnet, and Havering. Larger properties and
          gardens are more common, and prices are significantly lower than inner London, though
          commute times are longer.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Do not just look at the zone number &mdash; consider the specific
          transport links. A zone 3 property near a fast tube line might have a shorter commute to
          central London than a zone 2 property with less convenient connections. Use TfL&apos;s
          journey planner to check actual commute times from specific stations to your workplace.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Crossrail and Transport Impact on Prices">
        <p>
          The Elizabeth Line (Crossrail) has had a significant impact on property prices along its
          route. Areas like Abbey Wood, Woolwich, Stratford, and Ealing Broadway have seen price
          growth driven by improved connectivity. When evaluating a property, consider both current
          and planned transport infrastructure, as new stations and line extensions can significantly
          boost values.
        </p>
        <p>
          The Overground, DLR, and National Rail services also provide important connections,
          particularly in south and east London where tube coverage is sparser. Many buyers
          overlook areas served by these networks, which can offer better value than equivalent
          locations on the tube.
        </p>
        <p>
          Cycling infrastructure has also improved dramatically, with dedicated cycle lanes on many
          major routes. If you are comfortable cycling, areas within a 30-minute ride of central
          London that may be less well-served by public transport can offer excellent value.
        </p>
      </GuideSection>

      <GuideSection title="London-Specific Financial Considerations">
        <p>
          <strong>Higher price thresholds:</strong> Many government schemes have higher thresholds
          for London. The shared ownership income cap is £90,000 (versus £80,000 outside London),
          and the First Homes price cap after discount is £420,000 (versus £250,000 elsewhere).
          Right to Buy discounts are also higher in London boroughs.
        </p>
        <p>
          <strong>Stamp duty:</strong> London&apos;s higher property prices mean stamp duty is a
          more significant cost. First-time buyer relief (no SDLT up to £425,000 on properties up
          to £625,000) is particularly valuable in London, where even modest properties can exceed
          £300,000. Use a stamp duty calculator to budget accurately at different price points.
        </p>
        <p>
          <strong>Mortgage considerations:</strong> Some lenders offer higher income multiples for
          London buyers (up to 5.5 or 6 times income) to account for the higher property prices.
          Professional mortgage brokers who specialise in the London market can help you access
          these enhanced lending options.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> Some London boroughs offer their own home-buying assistance
          programmes, including shared ownership schemes, discounted market housing, and grants for
          key workers. Check your target borough&apos;s website for locally available schemes that
          may not be widely advertised.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Shared Ownership in London">
        <p>
          Shared ownership is one of the most popular routes onto the property ladder in London.
          With a household income cap of £90,000, it is designed to help those who cannot afford
          to buy on the open market. You buy a share (25% to 75%) of a property and pay rent on the
          rest. London has a large number of shared ownership developments, particularly in areas
          undergoing regeneration.
        </p>
        <p>
          Housing associations in London include Peabody, L&Q, Notting Hill Genesis, Metropolitan
          Thames Valley, and Clarion. Each has its own portfolio of properties and may have slightly
          different eligibility criteria. Register with multiple housing associations to maximise
          your options, and check Share to Buy (the government-backed portal) for available
          properties across all providers.
        </p>
        <p>
          Be aware that service charges on London shared ownership properties can be high,
          particularly in newer developments with extensive communal facilities (gyms, concierges,
          roof terraces). Always check the service charge amount and whether it has increased
          significantly in recent years before committing.
        </p>
      </GuideSection>

      <GuideSection title="Leasehold Considerations in London">
        <p>
          The majority of flats in London are leasehold, and many houses in certain areas (
          particularly new-build estates) are also leasehold. Understanding leasehold is especially
          important for London buyers because a short lease (under 80 years) can significantly
          reduce a property&apos;s value and make it difficult to obtain a mortgage.
        </p>
        <p>
          Check the remaining lease length before making an offer. If it is under 80 years, factor
          in the cost of a lease extension. Once a lease drops below 80 years, the cost of extension
          increases significantly because &quot;marriage value&quot; (50% of the increase in the
          property&apos;s value resulting from the extension) becomes payable to the freeholder. The
          Leasehold Reform (Ground Rent) Act 2022 ensures new leases have zero ground rent, but
          existing leases may still have escalating ground rent clauses.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> Be very cautious of properties with fewer than 70 years
          remaining on the lease. Many lenders will not offer mortgages on leases this short, and
          the cost of extending can be substantial. Always have your solicitor check the lease
          terms in detail before committing to a London property purchase.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Up-and-Coming Areas">
        <p>
          London&apos;s property market is constantly evolving, with areas cycling through phases
          of regeneration and gentrification. Identifying areas on the rise can offer better value
          and potential for growth. Look for indicators such as new transport links, significant
          development projects, arrival of independent shops and restaurants, and improving school
          ratings.
        </p>
        <p>
          However, buying in an up-and-coming area carries risks. Regeneration can stall, promised
          transport links can be delayed, and neighbourhood character can change in unpredictable
          ways. Do thorough research, visit the area multiple times at different hours, talk to
          local residents, and check the local council&apos;s planning portal for both approved and
          proposed developments.
        </p>
        <p>
          Consider areas along the Elizabeth Line that have not yet seen the full impact of improved
          connectivity, south-east London locations served by the DLR, and outer London boroughs
          with good National Rail links that are benefiting from the shift towards hybrid working.
        </p>
      </GuideSection>

      <GuideSection title="Practical Tips for London Buyers">
        <p>
          <strong>Be prepared to act fast:</strong> Good properties in popular London areas can
          receive multiple offers within days of listing. Have your mortgage agreement in principle
          ready, your solicitor instructed, and your finances organised before you start seriously
          viewing.
        </p>
        <p>
          <strong>Consider ex-council properties:</strong> Former council flats and houses,
          particularly those sold under Right to Buy, can offer significantly better value per
          square foot than privately built equivalents in the same area. Many are well-built,
          spacious, and in excellent locations. Check service charge levels and whether major works
          are planned, as these can be costly in large council estates.
        </p>
        <p>
          <strong>Look beyond the tube map:</strong> Some of London&apos;s best-value areas are not
          on the tube network but have excellent bus, Overground, or National Rail connections.
          South London in particular has large areas with good connectivity but lower prices than
          equivalent north London locations.
        </p>
        <p>
          <strong>Factor in all costs:</strong> London-specific costs include higher council tax
          rates, congestion charges if you drive centrally, higher insurance premiums, and
          potentially steep service charges for leasehold properties. Build all of these into your
          affordability calculations.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> When viewing properties in London, check broadband speeds (essential
          for home working), local parking restrictions (especially CPZ zones and permit costs), and
          upcoming planning applications that could affect your outlook or amenity. The council
          planning portal and Ofcom broadband checker are invaluable free tools.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
