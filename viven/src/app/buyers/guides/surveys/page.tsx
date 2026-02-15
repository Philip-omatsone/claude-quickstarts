"use client";

import { Search } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function SurveysGuidePage() {
  return (
    <GuideLayout
      title="Property Surveys Explained"
      subtitle="Understanding the different types of property survey available in the UK, what they cover, and which one is right for your purchase."
      icon={Search}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="8 min"
      relatedLinks={[
        { label: "Buying Process Guide", href: "/buyers/guides/process" },
        { label: "Solicitors & Conveyancing", href: "/buyers/guides/solicitors" },
        { label: "New Build Snagging", href: "/buyers/guides/snagging" },
        { label: "First-Time Buyer Guide", href: "/buyers/guides/first-time-buyers" },
      ]}
    >
      <GuideSection title="Why You Need a Survey">
        <p>
          A property survey is a professional inspection of a building&apos;s condition. While not
          legally required, it is one of the most important steps in the buying process. A good
          survey can reveal hidden problems that could cost thousands to repair, give you
          negotiating leverage on price, and ultimately prevent you from making a costly mistake.
        </p>
        <p>
          It is important to understand that the mortgage valuation arranged by your lender is not a
          survey. The mortgage valuation exists solely to confirm to the lender that the property is
          adequate security for the loan. It is a brief assessment and will not identify many issues
          that a proper survey would uncover. You should always commission your own independent
          survey.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> One in five buyers who do not get a survey discover defects
          that cost an average of £5,750 to fix, according to RICS research. A survey costing
          a few hundred pounds could save you thousands and give you peace of mind.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="RICS Level 1: Condition Report">
        <p>
          The RICS Level 1 survey, formerly known as the Condition Report, is the most basic type
          of survey. It provides a simple overview of the property&apos;s condition using a
          traffic-light rating system (green, amber, red) for each element of the building. It does
          not include a valuation or detailed advice on repairs.
        </p>
        <p>
          <strong>Best for:</strong> Conventional properties in good condition, newer builds (under
          10 years old), and standard construction types. If the property appears to be in good
          order and is of a standard design, a Level 1 may be sufficient.
        </p>
        <p>
          <strong>What it covers:</strong> The overall condition of the property, including the
          roof, walls, floors, windows, services, and boundaries. It flags any urgent defects and
          potential risks but does not investigate hidden areas or provide repair costs.
        </p>
        <p>
          <strong>Typical cost:</strong> £300 to £500, depending on the property size and location.
        </p>
      </GuideSection>

      <GuideSection title="RICS Level 2: HomeBuyer Report">
        <p>
          The RICS Level 2 survey (formerly the HomeBuyer Report) is the most popular survey type
          in the UK. It provides a more detailed assessment than the Level 1, including a market
          valuation and insurance reinstatement value. The surveyor will inspect all visible and
          accessible parts of the property and provide advice on defects, repairs, and maintenance.
        </p>
        <p>
          <strong>Best for:</strong> Standard residential properties built after 1900 that appear to
          be in reasonable condition. This includes most terraced houses, semi-detached properties,
          and modern flats. It is the go-to survey for the majority of property purchases.
        </p>
        <p>
          <strong>What it covers:</strong> All visible elements of the property, including the
          structure, roof space (if accessible), walls, floors, windows, doors, bathrooms, kitchens,
          services (electrics, gas, water, heating), drainage, and the grounds. It uses a rating
          system and provides commentary on each element, plus a summary of significant issues.
        </p>
        <p>
          <strong>What it does not cover:</strong> The surveyor will not move furniture, lift
          carpets, or carry out invasive investigations. Areas that are not visible or accessible
          will not be inspected. The survey is non-destructive, meaning the surveyor cannot look
          behind walls or under floors unless access is readily available.
        </p>
        <p>
          <strong>Typical cost:</strong> £400 to £700, depending on the property value, size, and
          location.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> Some surveyors offer a combined Level 2 survey with a
          valuation, while others offer the survey without a valuation at a lower cost. If your
          lender is providing their own valuation, you may not need the surveyor to provide one too.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="RICS Level 3: Building Survey">
        <p>
          The RICS Level 3 survey (formerly the Full Structural Survey or Building Survey) is the
          most comprehensive and detailed survey available. It provides an in-depth analysis of the
          property&apos;s condition, construction, and materials, along with detailed advice on
          defects, repairs, and estimated costs.
        </p>
        <p>
          <strong>Best for:</strong> Older properties (pre-1900), listed buildings, properties of
          unusual construction (timber frame, thatched roof, etc.), properties that have been
          significantly extended or altered, properties in poor condition, and larger or more
          expensive homes where the financial risk of undiscovered defects is higher.
        </p>
        <p>
          <strong>What it covers:</strong> Everything in a Level 2 survey, plus a much more detailed
          investigation of the building fabric. The surveyor will describe the construction methods
          and materials in detail, comment on the performance of each building element, and provide
          repair recommendations with indicative costs. They will also advise on maintenance
          priorities and may recommend further specialist investigations (for example, a drain
          survey or asbestos report).
        </p>
        <p>
          <strong>Typical cost:</strong> £600 to £1,500 or more for large or complex properties.
          The surveyor spends significantly more time on site and producing the report compared
          to a Level 2.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> If you are buying a Victorian or Georgian property, a Level 3
          survey is almost always worth the additional cost. These properties can have issues with
          subsidence, damp, woodworm, outdated wiring, and failing roofs that are not always
          obvious on a casual inspection.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Specialist Surveys">
        <p>
          In addition to the standard RICS surveys, you may need specialist reports depending on
          the property and its location. Common specialist surveys include:
        </p>
        <p>
          <strong>Damp and timber survey:</strong> Investigates the presence and extent of rising
          damp, penetrating damp, condensation, woodworm, wet rot, and dry rot. Typically costs
          £200 to £400.
        </p>
        <p>
          <strong>Drainage survey (CCTV):</strong> A camera is sent through the drainage system to
          check for blockages, cracks, tree root ingress, and other issues. Costs around £200 to
          £400.
        </p>
        <p>
          <strong>Asbestos survey:</strong> Identifies the presence and condition of asbestos-
          containing materials. Essential for properties built before 2000. Costs vary depending
          on property size.
        </p>
        <p>
          <strong>Electrical inspection (EICR):</strong> A qualified electrician inspects the wiring
          and electrical installations. Required for rental properties but also advisable for
          purchases, especially in older homes. Typically costs £200 to £350.
        </p>
        <p>
          <strong>Japanese knotweed survey:</strong> If there are signs of this invasive plant, a
          specialist survey can assess the extent of the problem and advise on treatment costs.
          Japanese knotweed can affect mortgage lending, so this may be recommended by your lender.
        </p>
      </GuideSection>

      <GuideSection title="How to Choose a Surveyor">
        <p>
          Always use a surveyor who is a member of RICS (Royal Institution of Chartered Surveyors)
          or RPSA (Residential Property Surveyors Association). These professional bodies require
          their members to carry professional indemnity insurance, follow codes of conduct, and
          maintain their competence through continuing professional development.
        </p>
        <p>
          Look for a surveyor with experience of the property type and local area. A surveyor who
          knows the local geology, common building methods, and area-specific issues (such as
          mining subsidence in certain regions) will provide a more useful report. Ask for
          recommendations from your solicitor, mortgage broker, or friends who have recently bought.
        </p>
        <p>
          When you receive the survey report, read it thoroughly and discuss any concerns with
          your surveyor. They should be happy to explain their findings and answer questions. If
          significant issues are identified, discuss the implications with your solicitor and
          consider whether to renegotiate the price, request repairs, or walk away from the
          purchase.
        </p>
      </GuideSection>

      <GuideSection title="Using Your Survey to Negotiate">
        <p>
          A survey that identifies defects can be a powerful negotiating tool. If the survey reveals
          issues that will cost money to rectify, you can ask the seller to reduce the price by the
          estimated repair cost, carry out the repairs before completion, or provide an allowance
          for the work to be done after you move in.
        </p>
        <p>
          Be reasonable in your renegotiation &mdash; minor cosmetic issues are not grounds for a
          significant price reduction. However, structural problems, damp, roof repairs, or the need
          for a full rewire can legitimately justify renegotiating. Present the surveyor&apos;s
          findings to the estate agent and back up your request with the estimated costs from the
          survey report.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
