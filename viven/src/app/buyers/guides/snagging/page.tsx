"use client";

import { ClipboardCheck } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function SnaggingGuidePage() {
  return (
    <GuideLayout
      title="New Build Snagging Guide"
      subtitle="A comprehensive guide to identifying and reporting defects in your new-build property, with a room-by-room checklist and advice on getting issues resolved."
      icon={ClipboardCheck}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="7 min"
      relatedLinks={[
        { label: "Buying New Builds", href: "/buyers/guides/new-builds" },
        { label: "Property Surveys", href: "/buyers/guides/surveys" },
        { label: "Exchange & Completion", href: "/buyers/guides/exchange-completion" },
        { label: "Buying Process Guide", href: "/buyers/guides/process" },
      ]}
    >
      <GuideSection title="What Is Snagging?">
        <p>
          Snagging is the process of identifying defects, unfinished work, and poor-quality finishes
          in a new-build property. Despite the high prices charged for new builds, it is extremely
          common for properties to be handed over with a range of issues, from minor cosmetic
          blemishes to more significant construction defects. A thorough snagging inspection helps
          ensure your new home is built to the standard you are paying for.
        </p>
        <p>
          The term &quot;snag&quot; covers anything that is not built to the specification set out
          in the sales literature, does not meet the standards required by building regulations, or
          is simply poor workmanship. Common snags include badly applied paint, gaps in sealant,
          scratched surfaces, ill-fitting doors, uneven flooring, and incomplete external works.
          While many of these are cosmetic, some can indicate more serious underlying issues.
        </p>
      </GuideSection>

      <GuideSection title="When to Carry Out a Snagging Inspection">
        <p>
          Ideally, you should carry out a snagging inspection before legal completion, while you
          still have maximum leverage over the developer. However, some developers resist pre-
          completion inspections and may only allow access after you have completed. Even if the
          developer does not allow a formal pre-completion inspection, you should have at least one
          pre-completion visit (sometimes called a &quot;home demonstration&quot; or &quot;new home
          orientation&quot;) during which you can note obvious issues.
        </p>
        <p>
          If you cannot inspect before completion, carry out your snagging inspection as soon as
          possible after moving in. You have the full two-year builder&apos;s warranty period to
          report defects, but it is far easier to get issues fixed when the developer&apos;s
          tradespeople are still on site and working on the development.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> Even if the developer allows a pre-completion inspection, do a
          second thorough check after moving in. Some issues only become apparent when you start
          living in the property &mdash; for example, poor water pressure during peak times,
          heating problems when the weather turns cold, or drainage issues during heavy rain.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="DIY vs Professional Snagging">
        <p>
          You can carry out a snagging inspection yourself or hire a professional snagging company.
          A professional inspection typically costs £300 to £600 depending on the size of the
          property, and the inspector will produce a detailed report with photographs that you can
          present to the developer.
        </p>
        <p>
          Professional snagging inspectors know exactly what to look for and have the tools and
          experience to identify issues that a layperson might miss. They will check everything
          from floor levels and wall alignment to the operation of every window, door, socket, and
          tap. Their reports carry more weight with developers and can help resolve disputes if the
          developer is reluctant to fix issues.
        </p>
        <p>
          If you prefer to do it yourself, allow at least three to four hours for a thorough
          inspection of a standard three-bedroom house. Bring a torch, a spirit level, a tape
          measure, a ladder (if needed), sticky notes or coloured tape to mark defects, and a
          notebook or phone for recording issues and taking photos.
        </p>
      </GuideSection>

      <GuideSection title="External Checks">
        <p>
          Start your inspection outside the property. Walk around the entire exterior and check the
          following:
        </p>
        <p>
          <strong>Brickwork and render:</strong> Look for cracked, chipped, or poorly pointed
          bricks. Check that the mortar joints are consistent and properly finished. Render should
          be smooth and free from cracks or bubbles. Check the damp-proof course (DPC) is visible
          and unobstructed &mdash; no soil, paving, or render should bridge above it.
        </p>
        <p>
          <strong>Roof:</strong> Check for missing, cracked, or misaligned tiles or slates from
          ground level. Inspect the gutters and downpipes for proper alignment and check that they
          are securely fixed. Look for any signs of lead flashing around chimneys, vents, and
          where the roof meets walls.
        </p>
        <p>
          <strong>Windows and doors:</strong> Check all external window and door frames for damage,
          scratches, and proper sealing. Open and close every window and door to check they operate
          smoothly. Check that locks and handles work correctly and that rubber seals are properly
          fitted.
        </p>
        <p>
          <strong>Drainage and grounds:</strong> Check that paths, patios, and driveways slope away
          from the property to prevent water pooling against walls. Inspect manhole covers for
          proper seating and check that drainage grates are clear. If fencing, turf, or landscaping
          was included, check these are complete and properly installed.
        </p>
      </GuideSection>

      <GuideSection title="Internal Room-by-Room Checks">
        <p>
          Work through each room methodically, checking the following in every space:
        </p>
        <p>
          <strong>Walls and ceilings:</strong> Look for cracks, dents, nail pops, uneven plaster,
          and poor paintwork. Pay particular attention to corners, edges, and around light fittings
          where finish quality often drops. Check that walls are plumb using a spirit level.
        </p>
        <p>
          <strong>Floors:</strong> Walk across every floor, feeling for unevenness, squeaking, or
          bouncing. Check that skirting boards are straight, properly fitted, and sealed at joints.
          If hard flooring is fitted, check for scratches, chips, and proper alignment of tiles or
          planks.
        </p>
        <p>
          <strong>Doors:</strong> Open and close every internal door. Check that they hang straight,
          close properly without sticking, and have properly fitted handles and hinges. Fire doors
          should have intumescent strips and close-fitting frames.
        </p>
        <p>
          <strong>Windows:</strong> Open and close every window from inside. Check locks, handles,
          trickle vents, and weather seals. Look for scratches or marks on the glass and check that
          condensation channels drain properly.
        </p>
        <p>
          <strong>Electrics:</strong> Test every socket with a socket tester (available for a few
          pounds from DIY stores). Check all light switches work, and inspect the consumer unit
          (fuse board) for proper labelling.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> Focus extra attention on the kitchen and bathroom(s), as
          these are where the most defects are typically found. Check that all appliances work, taps
          run without leaking, toilets flush properly, showers have adequate pressure, and all
          sealant around baths, showers, sinks, and worktops is complete and neatly applied.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Kitchen-Specific Checks">
        <p>
          Open and close every cupboard door and drawer. Check alignment, that soft-close mechanisms
          work, and that handles are secure. Run every tap and check water pressure. Test the oven,
          hob, extractor fan, and any other fitted appliances. Check worktop joints for gaps and
          ensure the sealant between the worktop and the wall (and around the sink) is complete.
          Check that splashbacks are properly fitted and that tile grout is consistent.
        </p>
      </GuideSection>

      <GuideSection title="Bathroom-Specific Checks">
        <p>
          Fill and drain each bath, sink, and shower tray. Check for leaks underneath and slow
          drainage. Run the shower and check water pressure and temperature consistency. Flush every
          toilet and check that the cistern refills correctly. Inspect all sealant around baths,
          showers, and basins &mdash; this is one of the most common areas for poor workmanship.
          Check that towel rails, toilet roll holders, and any other fittings are secure.
        </p>
      </GuideSection>

      <GuideSection title="Heating and Services">
        <p>
          Turn on the central heating and check that every radiator heats up properly. Check the
          hot water system delivers consistent hot water to all taps. If the property has underfloor
          heating, test each zone. Locate and check the boiler, making sure it has been commissioned
          and that you have the operating manual and warranty documentation.
        </p>
        <p>
          Check the ventilation system, including extractor fans in the kitchen and bathrooms and
          any whole-house mechanical ventilation with heat recovery (MVHR) system. These should be
          working and free from construction dust and debris.
        </p>
      </GuideSection>

      <GuideSection title="Reporting and Resolving Snags">
        <p>
          Compile your snagging list in writing, with a clear description and photograph of each
          defect and its location. Number each item for easy reference. Submit the list to the
          developer&apos;s customer care team (or site manager if the development is still under
          construction) by email, keeping a copy for your records with proof of sending.
        </p>
        <p>
          The developer should acknowledge your list and provide a timeline for addressing the
          issues. Minor cosmetic snags may be batched and fixed in a single visit, while more
          significant issues may require specialist tradespeople. Follow up regularly and keep
          records of all communications.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> If the developer is slow to respond or refuses to fix defects
          covered by their warranty, escalate the issue. First, use the developer&apos;s formal
          complaints procedure. If that fails, contact the warranty provider (usually NHBC, LABC,
          or Premier Guarantee). You can also escalate to the Consumer Code for Home Builders
          independent dispute resolution scheme. Do not let the two-year builder&apos;s warranty
          period expire without getting all reportable defects documented and addressed.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
