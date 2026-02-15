"use client";

import { Gavel } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function AuctionsGuidePage() {
  return (
    <GuideLayout
      title="Buying Property at Auction"
      subtitle="A practical guide to buying a home at auction in the UK, including how auctions work, how to prepare, the risks involved, and tips for success."
      icon={Gavel}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="8 min"
      relatedLinks={[
        { label: "Property Surveys", href: "/buyers/guides/surveys" },
        { label: "Solicitors & Conveyancing", href: "/buyers/guides/solicitors" },
        { label: "Mortgage Types Explained", href: "/buyers/guides/mortgages" },
        { label: "First-Time Buyer Guide", href: "/buyers/guides/first-time-buyers" },
      ]}
    >
      <GuideSection title="Why Buy at Auction?">
        <p>
          Property auctions can offer genuine bargains and opportunities that are not available on
          the open market. Auction properties are often priced below market value to attract
          competitive bidding, and you can find unusual or unique properties that do not appear on
          the standard property portals. Auctions also offer speed and certainty &mdash; once the
          hammer falls, contracts are exchanged immediately, with completion typically 28 days later.
        </p>
        <p>
          Properties at auction include repossessions, probate sales, properties in need of
          renovation, commercial and mixed-use buildings, land, and properties with complications
          (such as short leases or restrictive covenants) that make them difficult to sell through
          estate agents. For experienced buyers and investors, auctions can be an excellent way to
          find value.
        </p>
        <p>
          However, buying at auction also carries significant risks. The speed of the process means
          you need to do all your due diligence before bidding, and a winning bid is immediately
          legally binding. This guide explains how to navigate the process safely.
        </p>
      </GuideSection>

      <GuideSection title="Types of Property Auction">
        <p>
          <strong>Traditional (unconditional) auctions:</strong> This is the most common type. When
          the hammer falls, the buyer and seller are immediately bound by the contract. The buyer
          must pay a 10% deposit on the day (or immediately after for online auctions) and complete
          the purchase within 28 days (or as specified in the legal pack). There is no cooling-off
          period, and pulling out means losing your deposit.
        </p>
        <p>
          <strong>Modern method of auction (conditional):</strong> This newer format gives buyers
          more time and flexibility. When you win, you pay a reservation fee (typically 4% to 6%
          of the purchase price) and then have 28 to 56 days to exchange contracts and a further
          period to complete. This allows time to arrange a mortgage and complete legal checks, but
          the reservation fee is non-refundable if you pull out.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> Modern method auctions are increasingly popular online and
          are often listed alongside standard property listings. The reservation fee is paid to the
          auctioneer, not the seller, and is in addition to the purchase price. Factor this into
          your budget when calculating the total cost.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Preparing to Buy at Auction">
        <p>
          Preparation is the key to success at auction. Start by researching auction houses in your
          area and reviewing their upcoming catalogues. Most auction houses publish their catalogue
          two to four weeks before the auction, giving you time to identify lots of interest and
          carry out due diligence.
        </p>
        <p>
          <strong>View the property:</strong> Attend the open viewing (most auction properties have
          at least one or two viewing sessions). Inspect the property carefully, looking for signs
          of structural issues, damp, subsidence, or other problems. Take photos and measurements.
          If possible, view the property more than once and at different times of day.
        </p>
        <p>
          <strong>Arrange a survey:</strong> For a traditional auction, you need to commission a
          survey before the auction date, as you will not have time afterwards. A RICS Level 2 or
          Level 3 survey can identify problems that could cost thousands to repair. The survey cost
          is at risk if you do not win the lot, but it is far better than buying a property with
          serious hidden defects.
        </p>
        <p>
          <strong>Review the legal pack:</strong> Every auction lot comes with a legal pack
          containing the title deeds, property information forms, special conditions of sale, and
          search results. Have your solicitor review this pack before the auction. It may reveal
          issues such as restrictive covenants, boundary disputes, missing documentation, or
          problems with the title that could affect the property&apos;s value or your ability to
          obtain a mortgage.
        </p>
        <p>
          <strong>Arrange finance:</strong> If you need a mortgage, obtain a formal agreement in
          principle and discuss auction purchases with your broker. Some lenders are reluctant to
          lend on auction properties, particularly those in poor condition. For traditional
          auctions, you may need a bridging loan if your mortgage cannot be arranged within the
          28-day completion period. Cash buyers have a significant advantage at auction.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> Never bid at auction without having your solicitor review the
          legal pack and having a clear understanding of the property&apos;s condition and value.
          Once the hammer falls at a traditional auction, you are legally committed to the purchase.
          Walking away means losing your 10% deposit and potentially facing a claim for damages.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Setting Your Maximum Bid">
        <p>
          Before the auction, determine your maximum bid and stick to it. Factor in the purchase
          price, auction fees (usually a buyer&apos;s premium of 1% to 2% plus VAT), stamp duty,
          legal fees, survey costs, and any renovation work needed. Research comparable sold prices
          in the area to establish the property&apos;s market value, and decide the maximum you are
          willing to pay.
        </p>
        <p>
          The guide price published in the catalogue is not the expected selling price &mdash; it is
          the minimum the seller will accept, and the reserve price (the lowest price the seller
          will sell for) is usually set at or just above the guide price. Properties often sell for
          20% to 40% above the guide price, sometimes more for popular lots. Be prepared for this
          and do not get caught up in auction fever.
        </p>
        <p>
          Write your maximum bid on a piece of paper and keep it in front of you during the auction.
          When bidding reaches your limit, stop. There will always be another property and another
          auction. Overpaying in the heat of the moment can turn a good deal into a poor one.
        </p>
      </GuideSection>

      <GuideSection title="On Auction Day">
        <p>
          Arrive early, register with the auction house, and collect your bidding paddle. You will
          need to provide photo ID, proof of address, and details of your solicitor. If you are
          bidding on behalf of someone else, you will need a signed letter of authority.
        </p>
        <p>
          Have your finances confirmed: for a traditional auction, you will need to pay a 10%
          deposit immediately after winning (usually by bank transfer or banker&apos;s draft, though
          policies vary). Ensure you have the funds accessible and know the process for payment.
        </p>
        <p>
          When bidding, be clear and decisive. Make eye contact with the auctioneer and raise your
          paddle firmly. Do not be intimidated by other bidders or by rapid bidding. If the bidding
          stalls below the reserve price, the property may be withdrawn and available for
          negotiation after the auction.
        </p>
      </GuideSection>

      <GuideSection title="After Winning a Lot">
        <p>
          If your bid is successful, you will immediately sign the contract (memorandum of sale) and
          pay the deposit. Your solicitor will then handle the conveyancing process, which must be
          completed within the timeframe specified in the special conditions (usually 28 days for
          traditional auctions).
        </p>
        <p>
          Arrange buildings insurance immediately &mdash; as with a standard purchase, the risk
          passes to you from the point of exchange. Finalise your mortgage application (or draw down
          your bridging loan) and ensure your solicitor has everything they need to complete on time.
          Late completion can incur penalty interest charges specified in the contract.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Attend a few auctions as an observer before bidding. This helps you
          understand the pace, atmosphere, and tactics used by experienced bidders. You will also get
          a better sense of how guide prices relate to final selling prices in your target area,
          which will help you set realistic budgets.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Buying After the Auction">
        <p>
          Not all lots sell during the auction. Properties that fail to reach their reserve price
          (known as &quot;unsold lots&quot;) are often available for negotiation afterwards. Contact
          the auction house as soon as possible after the auction to express interest. You may be
          able to negotiate a price at or below the guide price, and the process is usually the same
          as a standard auction purchase with the same terms and conditions.
        </p>
        <p>
          Buying unsold lots can be an excellent strategy for securing a good deal with less
          competition. However, act quickly &mdash; other buyers will also be contacting the auction
          house, and good properties do not stay available for long.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
