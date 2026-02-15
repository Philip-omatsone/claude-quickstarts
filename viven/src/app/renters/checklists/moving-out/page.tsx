"use client";

import { LogOut } from "lucide-react";
import {
  ChecklistLayout,
  type ChecklistPhase,
} from "@/components/checklists/ChecklistLayout";

const phases: ChecklistPhase[] = [
  {
    title: "1 Month Before",
    items: [
      {
        id: "mo-1-1",
        text: "Give your landlord or agent the correct written notice",
        tip: "Check your tenancy agreement for the required notice period — typically one or two months. A rolling periodic tenancy usually requires one month's notice ending on a rent day. Always give notice in writing (email is fine) and keep a copy.",
      },
      {
        id: "mo-1-2",
        text: "Confirm the exact move-out date and any check-out appointment with the agent",
        tip: "Some agents charge for a professional check-out — check if this is included in your tenancy terms.",
      },
      {
        id: "mo-1-3",
        text: "Review the original inventory report and check-in photos",
        tip: "Compare the property's current condition with the original inventory. This helps you identify anything that needs fixing or cleaning before you leave.",
      },
      {
        id: "mo-1-4",
        text: "Arrange professional cleaning if required by your tenancy agreement",
        tip: "Many tenancies require the property to be returned in the same condition as when you moved in. A professional end-of-tenancy clean (typically £150-£350) is often expected and can help protect your deposit.",
      },
      {
        id: "mo-1-5",
        text: "Arrange any necessary repairs for damage beyond fair wear and tear",
        tip: "Fix things like holes in walls from picture hooks, scuffed paintwork, or stained carpets. It is usually cheaper to fix issues yourself than to have deductions taken from your deposit.",
      },
      {
        id: "mo-1-6",
        text: "Set up a Royal Mail redirect to your new address",
      },
      {
        id: "mo-1-7",
        text: "Start notifying key contacts of your change of address",
        subItems: [
          "Bank, credit cards, and financial institutions",
          "DVLA (licence and vehicle registration)",
          "GP, dentist, and optician",
          "Employer and pension provider",
          "HMRC if self-employed",
          "Electoral register",
          "Insurance providers",
          "Subscriptions and deliveries",
        ],
      },
      {
        id: "mo-1-8",
        text: "Give notice to your broadband, energy, and water suppliers",
        tip: "Check minimum contract periods and cancellation terms. You may be able to transfer broadband to your new address rather than paying an early termination fee.",
      },
      {
        id: "mo-1-9",
        text: "Book a removal van or arrange help",
        tip: "End-of-month dates fill up quickly. Book early and get at least three quotes.",
      },
    ],
  },
  {
    title: "1 Week Before",
    items: [
      {
        id: "mo-2-1",
        text: "Begin a thorough deep clean of the entire property",
        subItems: [
          "Clean the oven inside and out (often the most disputed item at check-out)",
          "Descale taps, showerhead, and toilet",
          "Clean inside all cupboards and drawers",
          "Wipe skirting boards and door frames",
          "Clean windows inside",
          "Vacuum and mop all floors",
          "Clean extractor fans and remove any mould",
          "Defrost and clean the fridge and freezer",
        ],
      },
      {
        id: "mo-2-2",
        text: "Check all light bulbs are working and replace any that have blown",
        tip: "Replace with the same type of bulb that was there when you moved in.",
      },
      {
        id: "mo-2-3",
        text: "Fill any holes in walls and touch up paintwork if needed",
        tip: "Use filler for small holes and let it dry before sanding smooth. If you redecorated during the tenancy, check whether you agreed to restore the original colours.",
      },
      {
        id: "mo-2-4",
        text: "Remove all personal belongings, including items from the loft, shed, and garden",
      },
      {
        id: "mo-2-5",
        text: "Ensure all furniture provided by the landlord is in the correct rooms as per the inventory",
      },
      {
        id: "mo-2-6",
        text: "Sort out any items you want to dispose of — book a council bulky waste collection if needed",
        tip: "Most councils offer bulky waste collection for a small fee (usually £20-£40). Do not leave unwanted items at the property.",
      },
      {
        id: "mo-2-7",
        text: "Check the garden is tidy (if applicable) — mow the lawn, trim hedges, clear paths",
      },
    ],
  },
  {
    title: "On the Day",
    items: [
      {
        id: "mo-3-1",
        text: "Take detailed photos of every room to document the condition you are leaving the property in",
        tip: "Photograph the same areas as your check-in photos. Email them to yourself for a timestamp. These are essential evidence if there is a deposit dispute.",
      },
      {
        id: "mo-3-2",
        text: "Take final meter readings for gas, electricity, and water",
        tip: "Photograph each meter clearly showing the reading. Submit readings to your suppliers on the day you leave.",
      },
      {
        id: "mo-3-3",
        text: "Do a final clean — hoover throughout and wipe down all surfaces",
      },
      {
        id: "mo-3-4",
        text: "Check every room, cupboard, and drawer for any forgotten items",
        subItems: [
          "Kitchen cupboards and drawers",
          "Bathroom cabinets",
          "Wardrobes and under beds",
          "Loft or storage areas",
          "Shed or garage",
          "Windowsills and behind doors",
        ],
      },
      {
        id: "mo-3-5",
        text: "Turn off all lights, heating, and appliances",
      },
      {
        id: "mo-3-6",
        text: "Close and lock all windows",
      },
      {
        id: "mo-3-7",
        text: "Return all keys to the landlord or agent and get written confirmation",
        tip: "Return keys in person and ask for a receipt, or send them recorded delivery so you can prove when they were returned. Rent continues until all keys are handed back.",
      },
    ],
  },
  {
    title: "After Moving Out",
    items: [
      {
        id: "mo-4-1",
        text: "Request your deposit back in writing from your landlord or agent",
        tip: "Your landlord should return your deposit within 10 days of you both agreeing how much you will get back. If they propose deductions, ask for an itemised list with evidence.",
      },
      {
        id: "mo-4-2",
        text: "Cancel or transfer your council tax registration",
        tip: "Contact the council for both your old and new addresses. You should not be paying council tax on a property you have left.",
      },
      {
        id: "mo-4-3",
        text: "Confirm final bills and closing accounts with all utility providers",
        subItems: [
          "Gas and electricity",
          "Water",
          "Broadband",
          "TV licence",
        ],
      },
      {
        id: "mo-4-4",
        text: "Cancel or update your contents insurance",
      },
      {
        id: "mo-4-5",
        text: "If you dispute any deposit deductions, raise a dispute through the deposit scheme",
        tip: "You can raise a free dispute through the deposit protection scheme (DPS, MyDeposits, or TDS). They will review evidence from both sides and make a binding decision. You have the right to dispute within the scheme's time limits.",
      },
      {
        id: "mo-4-6",
        text: "Keep copies of all tenancy documents, correspondence, and photos for at least 6 years",
        tip: "In England the limitation period for most civil claims is 6 years. Keep everything in case of future disputes.",
      },
    ],
  },
];

export default function MovingOutChecklistPage() {
  return (
    <ChecklistLayout
      title="Moving Out Checklist"
      subtitle="Leave your rental in great shape and get your full deposit back"
      icon={LogOut}
      backHref="/renters/checklists"
      backLabel="All Checklists"
      storageKey="viven-checklist-rental-moving-out"
      phases={phases}
      intro={
        <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-sm text-foreground leading-relaxed">
          <strong>Deposit protection:</strong> The key to getting your full
          deposit back is documentation. Compare the property against the
          original inventory, take timestamped photos on your last day, and
          always communicate with your landlord in writing. If deductions are
          proposed, you have the right to challenge them through the deposit
          protection scheme free of charge.
        </div>
      }
    />
  );
}
