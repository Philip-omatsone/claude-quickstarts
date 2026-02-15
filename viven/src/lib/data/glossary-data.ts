export interface GlossaryTerm {
  term: string;
  aka?: string[];
  definition: string;
  whyItMatters?: string;
  relatedLinks?: { label: string; href: string }[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Agreement in Principle",
    aka: ["AIP", "Decision in Principle", "Mortgage in Principle"],
    definition:
      "A conditional statement from a lender indicating how much they would be willing to lend you, based on a soft credit check and basic financial information. It is not a guaranteed mortgage offer but shows sellers and estate agents that you are a serious buyer.",
    whyItMatters:
      "Having an AIP makes your offer more credible and speeds up the buying process once your offer is accepted.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Annual Percentage Rate of Charge",
    aka: ["APRC"],
    definition:
      "The total annual cost of a mortgage expressed as a percentage, including interest, fees, and other charges over the full term of the loan. Lenders are required by law to display the APRC so borrowers can compare deals on a like-for-like basis.",
    whyItMatters:
      "APRC helps you see the true long-term cost of a mortgage, not just the headline interest rate.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Arrangement Fee",
    aka: ["Product Fee", "Booking Fee"],
    definition:
      "A fee charged by a mortgage lender for setting up your mortgage. It can range from a few hundred to several thousand pounds and can usually be added to the loan balance, though this means you pay interest on it.",
    whyItMatters:
      "A low interest rate with a high arrangement fee can sometimes cost more overall than a slightly higher rate with no fee.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Base Rate",
    aka: ["Bank Rate", "Bank of England Base Rate"],
    definition:
      "The interest rate set by the Bank of England that influences the rates commercial banks charge on mortgages, savings, and loans. Changes to the base rate affect tracker mortgages immediately and often lead to changes in variable rate mortgages.",
    whyItMatters:
      "Base rate movements directly affect your monthly mortgage payments if you are on a tracker or variable rate deal.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Bridging Loan",
    definition:
      "A short-term loan used to bridge a gap in financing, typically when you need to buy a new property before selling your current one. Interest rates are significantly higher than standard mortgages and the loan is usually repaid within 12 months.",
    whyItMatters:
      "Bridging loans can prevent you from losing a property purchase but carry high costs and risks if your existing home does not sell quickly.",
  },
  {
    term: "Building Survey",
    aka: ["Full Structural Survey", "RICS Level 3 Survey"],
    definition:
      "The most comprehensive type of property survey, involving a detailed inspection of the structure, condition, and defects of a building. It is particularly recommended for older, larger, or unusual properties, or those that have been significantly altered.",
    whyItMatters:
      "A building survey can uncover serious structural problems that could cost thousands to fix and may give you grounds to renegotiate the price.",
    relatedLinks: [
      { label: "Survey guide", href: "/buyers/guides/surveys" },
    ],
  },
  {
    term: "Buildings Insurance",
    definition:
      "Insurance that covers the cost of repairing or rebuilding your home if it is damaged by events such as fire, flood, subsidence, or storm. Most mortgage lenders require you to have buildings insurance in place from exchange of contracts.",
    whyItMatters:
      "Without buildings insurance, you would need to pay for major repairs or rebuilding costs entirely out of your own pocket.",
  },
  {
    term: "Capital Gains Tax",
    aka: ["CGT"],
    definition:
      "A tax on the profit you make when you sell an asset that has increased in value, including property. Your main home is usually exempt under Private Residence Relief, but CGT may apply to second homes, buy-to-let properties, and inherited properties.",
    whyItMatters:
      "If you are selling a property that is not your primary residence, CGT can significantly reduce your profit.",
    relatedLinks: [
      {
        label: "Stamp duty calculator",
        href: "/buyers/calculators/stamp-duty",
      },
    ],
  },
  {
    term: "Chain",
    aka: ["Property Chain"],
    definition:
      "A sequence of linked property transactions where each buyer depends on the sale of their current home to fund the purchase of the next. If one transaction falls through, it can cause the entire chain to collapse.",
    whyItMatters:
      "Long chains increase the risk of delays and failed transactions. Chain-free buyers are often preferred by sellers.",
  },
  {
    term: "Chancel Repair Liability",
    definition:
      "A historic obligation that can require property owners in certain parishes to contribute towards the cost of repairing the chancel of the local Church of England parish church. The liability can be registered against a property title at the Land Registry.",
    whyItMatters:
      "Although rarely enforced, chancel repair liability can result in unexpected and substantial bills. Indemnity insurance is available to cover the risk.",
  },
  {
    term: "Chattels",
    definition:
      "Moveable items within a property that are not permanently fixed and are not automatically included in a sale, such as freestanding furniture, curtains, and garden ornaments. Their inclusion or exclusion is negotiated between buyer and seller.",
    whyItMatters:
      "Clarifying which chattels are included in the sale avoids disputes on completion day.",
  },
  {
    term: "Completion",
    aka: ["Completion Day"],
    definition:
      "The final stage of the property buying process when the remaining purchase money is transferred from the buyer's solicitor to the seller's solicitor, ownership legally changes hands, and the buyer receives the keys to the property.",
    whyItMatters:
      "Completion is the day you officially become the legal owner and can move in.",
    relatedLinks: [
      { label: "Conveyancing guide", href: "/buyers/guides/solicitors" },
    ],
  },
  {
    term: "Conservation Area",
    definition:
      "An area of special architectural or historic interest designated by the local authority, where additional planning controls apply to preserve its character and appearance. Permitted development rights are often restricted in these areas.",
    whyItMatters:
      "Living in a conservation area can limit what changes you can make to your property, including extensions, alterations to the front, and even replacing windows.",
  },
  {
    term: "Contract",
    aka: ["Contract of Sale"],
    definition:
      "The legally binding agreement between buyer and seller that sets out the terms and conditions of the property sale, including the price, completion date, and what is included. It becomes binding at exchange of contracts.",
    whyItMatters:
      "Once contracts are exchanged, both parties are legally committed and pulling out will result in financial penalties.",
    relatedLinks: [
      { label: "Conveyancing guide", href: "/buyers/guides/solicitors" },
    ],
  },
  {
    term: "Conveyancing",
    definition:
      "The legal process of transferring ownership of a property from one person to another. It covers everything from the initial contract drafting and searches through to the final registration of the new owner with the Land Registry.",
    whyItMatters:
      "Good conveyancing protects you from legal problems with the property and ensures the transaction completes smoothly.",
    relatedLinks: [
      { label: "Solicitor guide", href: "/buyers/guides/solicitors" },
    ],
  },
  {
    term: "Council Tax",
    definition:
      "An annual tax levied by local authorities on domestic properties to fund local services such as rubbish collection, schools, and police. Each property is placed in a council tax band (A to H in England) based on its estimated value in April 1991.",
    whyItMatters:
      "Council tax is a significant ongoing cost of home ownership that varies widely by area and property band.",
  },
  {
    term: "Covenant",
    aka: ["Restrictive Covenant"],
    definition:
      "A legally binding condition written into the deeds of a property that restricts how the land or property can be used. Examples include prohibitions on running a business from the property, keeping livestock, or making alterations without consent.",
    whyItMatters:
      "Breaching a covenant can lead to legal action and may affect your ability to sell or modify your home in the future.",
  },
  {
    term: "Deeds",
    aka: ["Title Deeds"],
    definition:
      "Legal documents that prove ownership of a property and the land it sits on. Since the Land Registry went digital, most title information is held electronically, but some older properties may still have physical deeds held by the owner or their mortgage lender.",
    whyItMatters:
      "Deeds confirm who owns a property and record any restrictions, rights, or covenants attached to it.",
  },
  {
    term: "Deposit",
    definition:
      "The upfront sum of money a buyer pays towards the purchase price of a property, with the remainder typically covered by a mortgage. Most lenders require a minimum deposit of 5 to 10 percent, though larger deposits usually secure better interest rates.",
    whyItMatters:
      "The size of your deposit directly affects your loan-to-value ratio and the mortgage rates available to you.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Disbursements",
    definition:
      "Third-party costs paid by your solicitor or conveyancer on your behalf during the property purchase. These include search fees, Land Registry fees, and Stamp Duty Land Tax. They are separate from your solicitor's own professional fees.",
    whyItMatters:
      "Disbursements can add up to a significant amount on top of legal fees, so it is important to budget for them.",
    relatedLinks: [
      { label: "Solicitor guide", href: "/buyers/guides/solicitors" },
    ],
  },
  {
    term: "Early Repayment Charge",
    aka: ["ERC"],
    definition:
      "A fee charged by a mortgage lender if you repay your mortgage, or pay more than your allowed overpayment limit, during a fixed or discounted rate period. It is usually expressed as a percentage of the outstanding loan and typically decreases each year.",
    whyItMatters:
      "ERCs can cost thousands of pounds, so you should factor them in if there is any chance you might move, remortgage, or pay off your loan early.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Energy Performance Certificate",
    aka: ["EPC"],
    definition:
      "A document that rates the energy efficiency of a property on a scale from A (most efficient) to G (least efficient). Sellers and landlords are legally required to provide an EPC, which is valid for ten years and includes recommendations for improving energy efficiency.",
    whyItMatters:
      "A poor EPC rating can indicate high energy bills. Properties rated F or G may face restrictions on being rented out.",
  },
  {
    term: "Equity",
    definition:
      "The difference between the current market value of your property and the amount you still owe on your mortgage. For example, if your home is worth 300,000 pounds and your outstanding mortgage is 200,000 pounds, you have 100,000 pounds of equity.",
    whyItMatters:
      "Equity is your real stake in the property and grows as you pay down your mortgage or as the property value rises.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Estate Agent",
    definition:
      "A professional who acts on behalf of a property seller to market and sell their home. Estate agents arrange viewings, negotiate offers, and manage the sale process. They are paid a commission, usually a percentage of the sale price, by the seller.",
    whyItMatters:
      "As a buyer, you do not pay the estate agent directly, but understanding their role helps you navigate the negotiation process.",
  },
  {
    term: "Exchange of Contracts",
    aka: ["Exchange"],
    definition:
      "The point in the property transaction when the buyer and seller swap signed contracts and the agreement becomes legally binding. The buyer typically pays a deposit of 10 percent at exchange, and a completion date is set.",
    whyItMatters:
      "Until exchange, either party can pull out without legal penalty. After exchange, backing out results in losing your deposit or being sued for breach of contract.",
    relatedLinks: [
      { label: "Conveyancing guide", href: "/buyers/guides/solicitors" },
    ],
  },
  {
    term: "First-Time Buyer",
    aka: ["FTB"],
    definition:
      "A person who has never owned a property anywhere in the world and is purchasing their first home. First-time buyers in England may benefit from reduced or zero Stamp Duty Land Tax on purchases up to a certain threshold.",
    whyItMatters:
      "First-time buyer status can unlock significant tax savings and access to specific government schemes.",
    relatedLinks: [
      {
        label: "Stamp duty calculator",
        href: "/buyers/calculators/stamp-duty",
      },
    ],
  },
  {
    term: "Fittings and Contents Form",
    aka: ["TA10", "Fixtures and Fittings Form"],
    definition:
      "A standard form completed by the seller that lists all items in the property and states whether each one is included in the sale, excluded, or available for purchase at an additional cost. It covers fixtures, fittings, and chattels throughout the property.",
    whyItMatters:
      "Reviewing the TA10 carefully ensures you know exactly what you are getting when you buy the property.",
  },
  {
    term: "Fixed Rate Mortgage",
    definition:
      "A mortgage where the interest rate is locked in for a set period, typically two, three, or five years. Your monthly repayments stay the same regardless of changes to the Bank of England base rate during the fixed period.",
    whyItMatters:
      "A fixed rate gives you certainty over your monthly payments, making it easier to budget.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Fixtures",
    definition:
      "Items that are permanently attached to the property and are usually included in the sale, such as fitted kitchens, bathroom suites, built-in wardrobes, and light fittings. The distinction between fixtures and chattels determines what stays and what goes.",
    whyItMatters:
      "Understanding what counts as a fixture helps avoid disagreements about what is included in the purchase price.",
  },
  {
    term: "Freehold",
    definition:
      "A form of property ownership where you own both the building and the land it sits on outright, with no time limit on your ownership. Most houses in England and Wales are freehold. There is no ground rent or lease to worry about.",
    whyItMatters:
      "Freehold ownership gives you complete control over your property without ongoing ground rent payments or lease renewal concerns.",
  },
  {
    term: "Gazumping",
    definition:
      "When a seller accepts a higher offer from another buyer after already accepting your offer but before contracts have been exchanged. This is legal in England and Wales because neither party is committed until exchange of contracts.",
    whyItMatters:
      "Gazumping can cost you money already spent on surveys, searches, and legal fees. Moving quickly after an accepted offer helps reduce the risk.",
  },
  {
    term: "Gazundering",
    definition:
      "When a buyer lowers their offer just before exchange of contracts, often exploiting the seller's reluctance to restart the selling process. Like gazumping, this is legal but considered poor practice.",
    whyItMatters:
      "As a buyer, relying on gazundering can cause the seller to pull out. As a seller, you need to weigh the reduced offer against the cost and time of finding a new buyer.",
  },
  {
    term: "Ground Rent",
    definition:
      "An annual charge paid by a leaseholder to the freeholder for the use of the land on which the property is built. The Leasehold Reform (Ground Rent) Act 2022 set ground rents on most new leases to zero, but older leases may still have escalating ground rents.",
    whyItMatters:
      "High or escalating ground rents can make a leasehold property expensive to own and difficult to sell or remortgage.",
  },
  {
    term: "Guarantor",
    definition:
      "A person, usually a family member, who agrees to cover your mortgage payments if you are unable to make them. Some lenders offer guarantor mortgages to help buyers who might not otherwise qualify on their own income.",
    whyItMatters:
      "Having a guarantor can help you get on the property ladder, but the guarantor takes on significant financial risk.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Help to Buy",
    definition:
      "A former UK government scheme that provided equity loans of up to 20 percent (40 percent in London) to help first-time buyers purchase new-build homes. The scheme closed to new applicants in October 2022, but existing loans remain active.",
    whyItMatters:
      "While no longer available for new purchases, existing Help to Buy equity loans still affect many homeowners who need to repay or manage them.",
  },
  {
    term: "Home Buyer Report",
    aka: ["HomeBuyer Survey", "RICS Level 2 Survey"],
    definition:
      "A mid-level property survey that provides a detailed assessment of a property's condition using a traffic-light system to highlight areas of concern. It is suitable for most conventional properties in reasonable condition built after 1900.",
    whyItMatters:
      "A Home Buyer Report can reveal defects that are not obvious during a viewing and may give you leverage to renegotiate the price.",
    relatedLinks: [
      { label: "Survey guide", href: "/buyers/guides/surveys" },
    ],
  },
  {
    term: "Indemnity Insurance",
    definition:
      "A one-off insurance policy that protects against specific legal risks associated with a property, such as missing planning permission, lack of building regulations sign-off, or chancel repair liability. It is often used as an alternative to resolving the underlying issue.",
    whyItMatters:
      "Indemnity insurance can allow a transaction to proceed when resolving the legal issue would be too time-consuming or costly.",
    relatedLinks: [
      { label: "Solicitor guide", href: "/buyers/guides/solicitors" },
    ],
  },
  {
    term: "Interest-Only Mortgage",
    definition:
      "A mortgage where your monthly payments cover only the interest charged on the loan, not the capital itself. You need a separate repayment plan (such as investments or savings) to pay off the loan balance at the end of the term.",
    whyItMatters:
      "Monthly payments are lower than a repayment mortgage, but you must have a credible strategy for repaying the full loan amount at the end of the term.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Joint Tenants",
    definition:
      "A form of property co-ownership where all owners have equal rights to the whole property. If one joint tenant dies, their share automatically passes to the surviving owner(s) under the right of survivorship, regardless of any will.",
    whyItMatters:
      "Joint tenancy is common between married couples. It means you cannot leave your share of the property to someone else in your will.",
  },
  {
    term: "Land Registry",
    aka: ["HM Land Registry"],
    definition:
      "The government body responsible for recording the ownership of land and property in England and Wales. It maintains a register of title that provides proof of ownership, rights, and any charges or restrictions on a property.",
    whyItMatters:
      "The Land Registry provides the definitive record of who owns a property and what legal interests affect it.",
  },
  {
    term: "Land Transaction Tax",
    aka: ["LTT"],
    definition:
      "The property purchase tax in Wales, replacing Stamp Duty Land Tax from April 2018. It is managed by the Welsh Revenue Authority and has its own rates and thresholds that differ from those in England.",
    whyItMatters:
      "If you are buying property in Wales, you pay LTT instead of Stamp Duty, and the rates may be higher or lower depending on the purchase price.",
    relatedLinks: [
      {
        label: "Stamp duty calculator",
        href: "/buyers/calculators/stamp-duty",
      },
    ],
  },
  {
    term: "Leasehold",
    definition:
      "A form of property ownership where you own the property for a fixed period as set out in a lease, but you do not own the land it sits on. The land is owned by the freeholder. Most flats in England and Wales are leasehold. The lease length typically starts at 99 or 125 years.",
    whyItMatters:
      "Short leases (under 80 years) can make a property difficult to mortgage and expensive to extend. Always check the remaining lease length before buying.",
  },
  {
    term: "Lifetime ISA",
    aka: ["LISA"],
    definition:
      "A tax-free savings account for people aged 18 to 39, where the government adds a 25 percent bonus (up to 1,000 pounds per year) on savings up to 4,000 pounds annually. It can be used towards your first home (up to 450,000 pounds) or retirement.",
    whyItMatters:
      "A Lifetime ISA is one of the most effective ways for first-time buyers to boost their deposit savings with free government money.",
  },
  {
    term: "Listed Building",
    definition:
      "A building that has been placed on the Statutory List of Buildings of Special Architectural or Historic Interest. Listed buildings are graded I, II*, or II, and any alterations, extensions, or demolitions require listed building consent in addition to planning permission.",
    whyItMatters:
      "Owning a listed building brings extra responsibilities and restrictions. Unauthorised alterations are a criminal offence.",
  },
  {
    term: "Loan to Value",
    aka: ["LTV"],
    definition:
      "The ratio of your mortgage to the property value, expressed as a percentage. For example, if you buy a property worth 250,000 pounds with a 200,000 pound mortgage, your LTV is 80 percent.",
    whyItMatters:
      "Lower LTV ratios unlock better mortgage interest rates because the lender is taking on less risk.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Mortgage",
    definition:
      "A loan secured against a property that enables you to buy a home without paying the full price upfront. The property serves as collateral, meaning the lender can repossess it if you fail to keep up with repayments. Mortgage terms typically run for 25 to 35 years.",
    whyItMatters:
      "A mortgage is likely the largest financial commitment you will ever make. Understanding the terms and total cost is essential.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Mortgage Broker",
    aka: ["Mortgage Adviser", "Independent Financial Adviser"],
    definition:
      "A professional who searches the mortgage market on your behalf to find a suitable deal. Whole-of-market brokers can access products from all lenders, while tied brokers are limited to a panel of lenders. They can also handle the mortgage application process for you.",
    whyItMatters:
      "A good broker can access deals not available directly to the public and guide you through the often complex application process.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Mortgage Deed",
    definition:
      "The legal document that gives the mortgage lender a charge over your property as security for the loan. By signing the mortgage deed, you agree that the lender has the right to repossess the property if you default on your payments.",
    whyItMatters:
      "The mortgage deed creates the legal link between your loan and your property. It is registered at the Land Registry.",
  },
  {
    term: "Mortgage Offer",
    definition:
      "A formal document from a lender confirming they will provide you with a mortgage, subject to certain conditions. It is issued after the lender has completed their full assessment including a credit check, affordability checks, and a property valuation. Offers typically remain valid for three to six months.",
    whyItMatters:
      "A mortgage offer is a crucial milestone that confirms your funding is in place and allows the transaction to proceed towards exchange.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Mortgage Valuation",
    aka: ["Lender Valuation"],
    definition:
      "A basic assessment commissioned by the mortgage lender to confirm the property is worth the amount you are borrowing. It is carried out for the lender's benefit, not yours, and will not identify defects or maintenance issues.",
    whyItMatters:
      "A mortgage valuation is not a substitute for a proper survey. You should always commission your own survey to check the property's condition.",
    relatedLinks: [
      { label: "Survey guide", href: "/buyers/guides/surveys" },
    ],
  },
  {
    term: "Negative Equity",
    definition:
      "A situation where the outstanding balance on your mortgage is greater than the current market value of your property. This can happen if property prices fall after you buy or if you have a high loan-to-value mortgage.",
    whyItMatters:
      "Negative equity makes it very difficult to sell or remortgage your property, as you would still owe money to the lender after the sale.",
  },
  {
    term: "New Build",
    definition:
      "A property that has been newly constructed and has never been lived in before. New builds typically come with a developer warranty (often from the NHBC) covering structural defects for ten years. They may also qualify for certain government schemes and incentives.",
    whyItMatters:
      "New builds offer modern standards and warranties but can carry a premium over existing homes. Always get a snagging survey before completion.",
    relatedLinks: [
      { label: "Survey guide", href: "/buyers/guides/surveys" },
    ],
  },
  {
    term: "Offset Mortgage",
    definition:
      "A mortgage linked to your savings account so that your savings balance is offset against your mortgage debt when calculating interest. For example, if your mortgage is 200,000 pounds and you have 20,000 pounds in savings, you only pay interest on 180,000 pounds.",
    whyItMatters:
      "An offset mortgage can reduce your total interest payments while keeping your savings accessible, though rates may be slightly higher than standard products.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Party Wall",
    definition:
      "A wall shared between two adjoining properties, or a wall built along the boundary between two properties. The Party Wall etc. Act 1996 requires you to notify your neighbours and obtain agreement before carrying out certain works on or near a party wall.",
    whyItMatters:
      "Failing to serve proper party wall notices before building work can result in legal disputes and injunctions that halt your project.",
  },
  {
    term: "Planning Permission",
    definition:
      "Formal approval from the local planning authority to carry out building work or change the use of land or buildings. Some minor works fall under permitted development rights and do not need planning permission, but larger projects require a formal application.",
    whyItMatters:
      "Carrying out work without required planning permission can result in enforcement action, including being ordered to reverse the changes at your own cost.",
  },
  {
    term: "Property Information Form",
    aka: ["TA6"],
    definition:
      "A standard form completed by the seller providing detailed information about the property, including boundaries, disputes, notices, alterations, guarantees, insurance, environmental matters, and rights and informal arrangements.",
    whyItMatters:
      "The TA6 is a key document in conveyancing. Sellers must answer honestly, and their answers can have legal consequences if they turn out to be misleading.",
    relatedLinks: [
      { label: "Solicitor guide", href: "/buyers/guides/solicitors" },
    ],
  },
  {
    term: "Remortgage",
    definition:
      "The process of switching your existing mortgage to a new deal, either with your current lender or a different one, without moving home. Homeowners typically remortgage when their fixed or discounted rate period ends to avoid moving to a more expensive standard variable rate.",
    whyItMatters:
      "Remortgaging at the right time can save you thousands in interest payments over the life of your mortgage.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Repayment Mortgage",
    aka: ["Capital Repayment Mortgage"],
    definition:
      "A mortgage where each monthly payment covers both interest and a portion of the capital borrowed. By the end of the mortgage term, you will have repaid the full loan and own the property outright.",
    whyItMatters:
      "A repayment mortgage guarantees you will own your home outright at the end of the term, provided you keep up all payments.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Reservation Fee",
    aka: ["Reservation Agreement"],
    definition:
      "A fee paid by a buyer to a seller or developer to take a property off the market for an agreed period. On new builds, this is standard practice. On existing properties, it is less common but some estate agents promote pre-contract reservation agreements.",
    whyItMatters:
      "A reservation fee provides some assurance the property will not be sold to someone else while you arrange your mortgage and legal work.",
  },
  {
    term: "Retention",
    definition:
      "An amount withheld by the mortgage lender from the total loan until specified repairs or works on the property are completed. The lender releases the retained funds once they are satisfied the required work has been done.",
    whyItMatters:
      "A retention means you may need to fund essential repairs from your own pocket before the lender releases the full mortgage amount.",
  },
  {
    term: "Right to Buy",
    definition:
      "A government scheme that gives eligible council and housing association tenants the right to purchase their home at a significant discount, based on the length of their tenancy. Discounts vary by region and property type.",
    whyItMatters:
      "Right to Buy can provide a substantial discount on the market value, but there may be restrictions on selling the property within the first few years.",
  },
  {
    term: "RICS",
    aka: ["Royal Institution of Chartered Surveyors"],
    definition:
      "The professional body that regulates and accredits property surveyors, valuers, and other real estate professionals in the UK. RICS sets the standards for property surveys and its members are bound by strict codes of conduct.",
    whyItMatters:
      "Using a RICS-accredited surveyor gives you assurance that the survey is carried out to professional standards and you have a complaints process if something goes wrong.",
    relatedLinks: [
      { label: "Survey guide", href: "/buyers/guides/surveys" },
    ],
  },
  {
    term: "Searches",
    aka: ["Local Authority Searches", "Property Searches"],
    definition:
      "Enquiries carried out by your solicitor with the local authority and other bodies to uncover information about the property and surrounding area. Standard searches include local authority, environmental, water and drainage, and sometimes chancel repair and mining searches.",
    whyItMatters:
      "Searches can reveal planned developments, contaminated land, flood risks, and other issues that might affect the property's value or your enjoyment of it.",
    relatedLinks: [
      { label: "Solicitor guide", href: "/buyers/guides/solicitors" },
    ],
  },
  {
    term: "Service Charge",
    definition:
      "An annual fee paid by leaseholders to the freeholder or management company to cover the costs of maintaining and repairing the common parts of a building, such as hallways, lifts, the roof, and communal gardens.",
    whyItMatters:
      "Service charges can be substantial and may increase significantly. Always check the last three years of service charge accounts before buying a leasehold property.",
  },
  {
    term: "Share of Freehold",
    definition:
      "An arrangement where the leaseholders of a building collectively own the freehold, usually through a management company in which each flat owner holds a share. This gives leaseholders greater control over management, service charges, and lease extensions.",
    whyItMatters:
      "Owning a share of freehold gives you more control and can make lease extensions significantly cheaper than dealing with an external freeholder.",
  },
  {
    term: "Shared Ownership",
    definition:
      "A government-backed scheme that allows you to buy a share (typically 25 to 75 percent) of a property and pay rent on the remaining share to a housing association. You can increase your share over time through a process called staircasing.",
    whyItMatters:
      "Shared ownership can make home ownership accessible with a smaller deposit and lower mortgage, but you need to factor in rent payments on the unowned share.",
  },
  {
    term: "Sinking Fund",
    aka: ["Reserve Fund"],
    definition:
      "A fund built up from leaseholder contributions to cover the cost of major future works to a building, such as roof replacement, external redecoration, or lift refurbishment. It is separate from the regular service charge.",
    whyItMatters:
      "A healthy sinking fund means major works can be paid for without sudden large bills to leaseholders. Check the fund balance before buying.",
  },
  {
    term: "Snagging",
    aka: ["Snagging Survey", "Snagging List"],
    definition:
      "The process of identifying defects, unfinished work, or poor workmanship in a new-build property before or shortly after completion. A snagging survey produces a list of items for the developer to fix under their warranty obligations.",
    whyItMatters:
      "Commissioning a professional snagging survey can identify dozens of issues that the developer is obliged to fix at no cost to you.",
    relatedLinks: [
      { label: "Survey guide", href: "/buyers/guides/surveys" },
    ],
  },
  {
    term: "Solicitor",
    aka: ["Conveyancer", "Property Lawyer"],
    definition:
      "A qualified legal professional who handles the conveyancing process on your behalf. They carry out searches, review the contract, raise enquiries, manage the exchange and completion, and register your ownership with the Land Registry.",
    whyItMatters:
      "Your solicitor is your legal representative in the purchase. Choosing an experienced, responsive solicitor can make a significant difference to how smoothly the process runs.",
    relatedLinks: [
      { label: "Solicitor guide", href: "/buyers/guides/solicitors" },
    ],
  },
  {
    term: "Stamp Duty Land Tax",
    aka: ["SDLT", "Stamp Duty"],
    definition:
      "A tax payable to HMRC when you purchase property or land in England and Northern Ireland above a certain price threshold. The tax is calculated in bands, with higher rates applying to higher portions of the purchase price. Additional rates apply for second homes and buy-to-let properties.",
    whyItMatters:
      "Stamp Duty can add thousands of pounds to your purchase costs. First-time buyers benefit from higher thresholds and reduced rates.",
    relatedLinks: [
      {
        label: "Stamp duty calculator",
        href: "/buyers/calculators/stamp-duty",
      },
    ],
  },
  {
    term: "Subject to Contract",
    aka: ["STC"],
    definition:
      "A phrase used in property transactions meaning that an agreement has been reached in principle but is not yet legally binding. Either party can still withdraw without legal consequence until contracts are formally exchanged.",
    whyItMatters:
      "Seeing a property marked as sold subject to contract means a deal is agreed but could still fall through, so it may be worth registering your interest as a backup buyer.",
  },
  {
    term: "Subject to Survey",
    definition:
      "A condition attached to an offer on a property meaning the buyer's commitment is dependent on the results of a satisfactory property survey. If the survey reveals significant problems, the buyer may renegotiate or withdraw.",
    whyItMatters:
      "Making an offer subject to survey protects you from committing to a property with hidden defects.",
    relatedLinks: [
      { label: "Survey guide", href: "/buyers/guides/surveys" },
    ],
  },
  {
    term: "Subsidence",
    definition:
      "The downward movement of the ground beneath a building, causing the foundations to shift and the structure to sink unevenly. Common causes include clay soil shrinkage, tree roots, leaking drains, and former mining activity.",
    whyItMatters:
      "Subsidence can cause serious structural damage and make a property difficult to insure or mortgage. It is one of the most significant risks a buyer should investigate.",
  },
  {
    term: "Survey",
    aka: ["Property Survey"],
    definition:
      "A professional inspection of a property's condition carried out by a qualified surveyor. Surveys range from a basic RICS Level 1 (Condition Report) through a Level 2 (Home Buyer Report) to a Level 3 (Building Survey), each providing increasing levels of detail.",
    whyItMatters:
      "A survey can reveal hidden problems that could cost thousands to fix and gives you evidence to renegotiate the price or walk away before exchange.",
    relatedLinks: [
      { label: "Survey guide", href: "/buyers/guides/surveys" },
    ],
  },
  {
    term: "Tenants in Common",
    definition:
      "A form of property co-ownership where each owner holds a distinct share of the property, which can be equal or unequal. Unlike joint tenants, each owner can leave their share to whoever they choose in their will.",
    whyItMatters:
      "Tenants in common is often used by unmarried couples, friends buying together, or parents helping children buy, because it allows unequal shares and separate inheritance arrangements.",
  },
  {
    term: "Title",
    definition:
      "The legal record of ownership of a property or piece of land, held at the Land Registry. The title register shows who owns the property, how they own it, and any restrictions, charges, or rights affecting it.",
    whyItMatters:
      "Your solicitor checks the title to make sure the seller has the legal right to sell and that there are no issues that could affect your ownership.",
  },
  {
    term: "Title Insurance",
    definition:
      "An insurance policy that protects the buyer and lender against financial loss arising from defects in a property's title that were not discovered during conveyancing, such as unknown liens, boundary disputes, or fraud.",
    whyItMatters:
      "Title insurance provides a safety net against title problems that searches and enquiries might not catch.",
  },
  {
    term: "Tracker Mortgage",
    definition:
      "A type of variable rate mortgage where the interest rate is set at a fixed margin above (or occasionally below) the Bank of England base rate. If the base rate goes up or down, your mortgage rate moves by the same amount.",
    whyItMatters:
      "Tracker mortgages offer transparency because the rate follows the base rate exactly, but your payments can go up if the base rate rises.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Transfer Deed",
    aka: ["TR1"],
    definition:
      "The legal document that formally transfers ownership of a property from the seller to the buyer. It is signed by both parties and submitted to the Land Registry to update the register of title.",
    whyItMatters:
      "The transfer deed is the document that makes you the legal owner. Your solicitor prepares it and ensures it is correctly executed.",
    relatedLinks: [
      { label: "Solicitor guide", href: "/buyers/guides/solicitors" },
    ],
  },
  {
    term: "Underpinning",
    definition:
      "A method of strengthening the foundations of a building, typically required when the original foundations are no longer adequate due to subsidence, nearby excavation, or changes to the soil. It involves extending the foundations deeper or wider.",
    whyItMatters:
      "A property that has been underpinned may be harder to insure and mortgage. However, if the work was done properly and the problem resolved, it should not be a reason to avoid buying.",
  },
  {
    term: "Unregistered Land",
    definition:
      "Property or land that has not yet been recorded at the Land Registry. Ownership is proved through the original paper title deeds rather than a digital register. The proportion of unregistered land is shrinking as it must be registered upon any sale or transfer.",
    whyItMatters:
      "Buying unregistered land can be more complex and time-consuming because establishing a clear chain of ownership relies on paper documents.",
  },
  {
    term: "Valuation",
    definition:
      "A professional assessment of a property's market value, typically carried out by a RICS-qualified valuer. A mortgage valuation is done for the lender, but you can also commission an independent valuation for your own purposes, such as negotiating a purchase price.",
    whyItMatters:
      "Knowing the true market value helps you make a sensible offer and ensures you are not overpaying for a property.",
    relatedLinks: [
      { label: "Survey guide", href: "/buyers/guides/surveys" },
    ],
  },
  {
    term: "Variable Rate Mortgage",
    aka: ["Standard Variable Rate", "SVR"],
    definition:
      "A mortgage where the interest rate can be changed by the lender at any time, though it is typically influenced by the Bank of England base rate. The standard variable rate is the default rate your mortgage reverts to after a fixed or discounted deal ends.",
    whyItMatters:
      "SVRs are almost always more expensive than fixed or tracker deals. Remortgaging before your deal ends can save you significant money each month.",
    relatedLinks: [
      { label: "Mortgage guide", href: "/buyers/guides/mortgages" },
    ],
  },
  {
    term: "Wayleave",
    definition:
      "A formal agreement granting a utility company or other party the right to install and maintain equipment (such as cables, pipes, or pylons) on or across your land. A wayleave is typically a personal licence rather than a permanent right.",
    whyItMatters:
      "A wayleave on your property can restrict how you use part of your land and may affect its value or your development plans.",
  },
];
