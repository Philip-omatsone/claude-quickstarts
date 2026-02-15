"use client";

import { DoorOpen } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
  GuideStep,
} from "@/components/guides/GuideLayout";

export default function EndOfTenancyGuidePage() {
  return (
    <GuideLayout
      title="End of Tenancy Guide"
      subtitle="How to leave your rental property properly — notice periods, deposit returns, cleaning, and final checks."
      icon={DoorOpen}
      backHref="/renters/guides"
      backLabel="All Guides"
      readTime="7 min"
      relatedLinks={[
        { label: "Moving Out Checklist", href: "/renters/checklists/moving-out" },
        { label: "Deposit Return Email Template", href: "/renters/templates/email-deposit-return" },
        { label: "Deposit Protection Guide", href: "/renters/guides/deposits" },
        { label: "Inventory Checklist", href: "/renters/checklists/inventory" },
      ]}
    >
      <GuideSection title="Giving Notice">
        <p>
          How and when you give notice depends on the type of tenancy you have. If you are in a
          <strong> fixed-term tenancy</strong> and the term is coming to an end, check your contract.
          Some agreements require you to give notice before the end date (often one or two months),
          while others simply allow the tenancy to expire on the last day. If you do not give notice
          and do not leave, the tenancy usually becomes periodic (rolling month to month).
        </p>
        <p>
          If you are on a <strong>periodic tenancy</strong> (either because it was set up that way
          or because your fixed term has ended), you must give at least one month&apos;s notice for
          a monthly tenancy, timed to end on the last day of a rental period. For example, if your
          rent is due on the 1st of the month and you want to leave on 31 March, you must give notice
          by 28 February at the latest. Check your tenancy agreement, as it may require a longer
          notice period.
        </p>
        <p>
          If you want to leave during a <strong>fixed-term tenancy</strong> before the end date,
          check whether there is a break clause. If there is, follow the break clause procedure
          exactly. If there is no break clause, speak to your landlord. Many will agree to an early
          surrender of the tenancy, particularly if you help find a replacement tenant. Get any
          agreement in writing. Without the landlord&apos;s agreement, you remain liable for rent
          until the end of the fixed term.
        </p>
        <GuideCallout type="info">
          <strong>Always give notice in writing.</strong> Send an email or letter clearly stating
          your name, the property address, the date you intend to leave, and that this constitutes
          your formal notice to end the tenancy. Keep a copy and, if sending by post, use recorded
          delivery. Verbal notice is not sufficient.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Preparing the Property">
        <GuideStep number={1} title="Review the Check-In Inventory">
          <p>
            Dig out your check-in inventory and photographs from when you moved in. This is your
            reference point for the condition the property should be returned in, accounting for fair
            wear and tear. Go through it room by room and note anything that needs attention.
          </p>
        </GuideStep>
        <GuideStep number={2} title="Carry Out Minor Repairs">
          <p>
            Fill any small holes in walls from picture hooks using filler (available cheaply from any
            hardware store). Touch up any scuff marks with matching paint if possible. Replace any
            light bulbs that have blown. Fix or replace anything you have damaged beyond fair wear
            and tear. These small investments can save significant deposit deductions.
          </p>
        </GuideStep>
        <GuideStep number={3} title="Deep Clean the Property">
          <p>
            The property should be returned in a similar state of cleanliness to when you moved in.
            This typically means a thorough clean of every room, including inside the oven, behind
            appliances, inside cupboards, limescale removal in bathrooms, and window cleaning. Many
            tenants hire a professional end-of-tenancy cleaning service, which typically costs £150
            to £400 depending on property size. Keep the receipt as proof.
          </p>
        </GuideStep>
        <GuideStep number={4} title="Clear All Belongings">
          <p>
            Remove all your possessions from the property, including from sheds, garages, loft
            spaces, and gardens. Do not leave behind any furniture, bags, or items you no longer
            want. The landlord can charge for disposal of abandoned items and deduct the cost from
            your deposit.
          </p>
        </GuideStep>
        <GuideStep number={5} title="Deal with the Garden">
          <p>
            If your tenancy agreement makes you responsible for the garden, ensure it is tidy. Mow
            the lawn, trim hedges, clear weeds from paths, and remove any items you brought in. The
            garden should be in a similar condition to when you moved in, allowing for seasonal
            differences.
          </p>
        </GuideStep>
      </GuideSection>

      <GuideSection title="Final Day Checklist">
        <p>
          On your last day in the property, work through this checklist to make sure nothing is
          overlooked:
        </p>
        <p>
          Take <strong>final meter readings</strong> for gas, electricity, and water. Photograph each
          meter clearly. Submit the readings to your utility providers and close or transfer your
          accounts. This prevents you being charged for the next tenant&apos;s usage.
        </p>
        <p>
          Take <strong>comprehensive photographs and videos</strong> of every room, showing the
          condition of walls, floors, carpets, appliances, fixtures, and any areas that were noted
          in the check-in inventory. Include close-ups of any areas of potential dispute. These are
          timestamped and serve as crucial evidence for the deposit return process.
        </p>
        <p>
          Return <strong>all keys</strong> to the landlord or agent. This includes front door keys,
          back door keys, window keys, garage keys, and any fobs or access cards. Get written
          confirmation (email or signed receipt) that all keys have been returned. Your tenancy does
          not formally end until the keys are returned, and you may be charged rent for any
          additional days.
        </p>
        <GuideCallout type="warning">
          <strong>Do not forget:</strong> Cancel or redirect your post with Royal Mail (£36 for 3
          months). Inform your bank, employer, HMRC, DVLA, GP, dentist, and any subscription
          services of your new address. Cancel your TV licence if you are moving somewhere that
          already has one, or transfer it to your new address. Inform your contents insurer of the
          move.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="The Check-Out Inspection">
        <p>
          Most landlords or agents will arrange a check-out inspection, either on your final day or
          shortly after you leave. This is where they compare the property&apos;s current condition
          with the check-in inventory to identify any damage or cleaning issues. If possible, attend
          the check-out so you can discuss any findings on the spot and agree or dispute them
          immediately.
        </p>
        <p>
          If the landlord or agent identifies issues, they should provide you with an itemised list
          of proposed deductions, along with evidence (photographs, quotes for repairs). You are
          entitled to challenge any deduction you believe is unfair. Common areas of dispute include
          cleaning standards, definitions of fair wear and tear, and the cost attributed to
          specific items of damage.
        </p>
        <p>
          If a professional inventory clerk conducts the check-out, their report will carry
          significant weight in any deposit dispute. Make sure the report accurately reflects the
          property&apos;s condition. If you disagree with anything in the report, note your
          disagreement at the time and provide your own photographic evidence.
        </p>
      </GuideSection>

      <GuideSection title="Getting Your Deposit Back">
        <p>
          Once you have left the property and returned the keys, request the return of your deposit
          in writing. Provide your forwarding address and bank details. Your landlord should respond
          within ten days. If the deposit is held in a custodial scheme (DPS, MyDeposits custodial,
          or TDS custodial), you can request the deposit directly through the scheme&apos;s website.
        </p>
        <p>
          If the landlord proposes deductions and you agree with them, the agreed amount will be
          deducted and the remainder returned to you. If you disagree with any deductions, try to
          negotiate directly with the landlord first. Provide your evidence (photographs, receipts,
          the check-in inventory) to support your case.
        </p>
        <p>
          If you cannot reach agreement, either party can raise a dispute through the deposit
          protection scheme. An independent adjudicator will review the evidence from both sides and
          make a binding decision. The process is free and typically takes a few weeks. The
          adjudicator will consider the check-in and check-out inventories, photographs, receipts,
          and the tenancy agreement.
        </p>
        <GuideCallout type="tip">
          <strong>Maximise your chances of a full refund:</strong> The deposit dispute process is
          evidence-based. The tenant who can provide clear, dated photographs of the property at
          move-in and move-out, a signed inventory, and receipts for professional cleaning almost
          always receives a favourable outcome. Start documenting from day one of your tenancy, not
          just at the end.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Forwarding Your Post">
        <p>
          Set up a Royal Mail redirect before your move. You can do this online at
          royalmail.com/redirects. It costs from £36 for 3 months, £52 for 6 months, or £72 for
          12 months (per surname). This ensures any post sent to your old address is forwarded to
          your new one, giving you time to update your address with all organisations.
        </p>
        <p>
          Make a list of everyone who has your address and update them: bank and credit card
          providers, HMRC (for tax purposes), DVLA (for driving licence and vehicle registration),
          your employer, your GP and dentist, subscription services (online shopping, magazines),
          the electoral roll (register at your new address for voting and credit rating purposes),
          and any insurance providers. Failing to update your address with DVLA can result in a fine
          of up to £1,000.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
