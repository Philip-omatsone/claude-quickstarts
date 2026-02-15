"use client";

import { Eye } from "lucide-react";
import {
  ChecklistLayout,
  type ChecklistPhase,
} from "@/components/checklists/ChecklistLayout";

const phases: ChecklistPhase[] = [
  {
    title: "Outside the Property",
    items: [
      {
        id: "view-1-1",
        text: "Check the roof for missing or damaged tiles, sagging, or moss build-up",
        tip: "Bring binoculars if possible. Roof repairs can be very expensive — especially on period properties.",
      },
      {
        id: "view-1-2",
        text: "Look at the gutters and downpipes for damage, blockages, or staining",
        tip: "Water stains on external walls may indicate overflowing gutters and potential damp issues.",
      },
      {
        id: "view-1-3",
        text: "Inspect external walls for cracks, bulging, or damaged rendering",
        subItems: [
          "Hairline cracks are usually cosmetic",
          "Diagonal or stepped cracks may indicate subsidence",
          "Check pointing between bricks for deterioration",
        ],
      },
      {
        id: "view-1-4",
        text: "Check the condition of windows and external doors",
        tip: "Look for rotten frames, failed double glazing (condensation between panes), and whether they open and close easily.",
      },
      {
        id: "view-1-5",
        text: "Assess the boundaries, fencing, and garden condition",
        subItems: [
          "Check who is responsible for boundary walls and fences",
          "Look for signs of Japanese knotweed or other invasive plants",
          "Note mature trees close to the property (root damage risk)",
        ],
      },
      {
        id: "view-1-6",
        text: "Check parking, access, and the general neighbourhood",
        tip: "Visit at different times of day. Check street parking availability, noise levels, and traffic.",
      },
      {
        id: "view-1-7",
        text: "Look for signs of damp on external walls",
        tip: "Check the damp-proof course (DPC) — it should be visible a few bricks above ground level and not bridged by soil or paving.",
      },
    ],
  },
  {
    title: "Inside — Room by Room",
    items: [
      {
        id: "view-2-1",
        text: "Check walls and ceilings for cracks, stains, or damp patches",
        tip: "Brown stains on ceilings often indicate a current or past leak. Ask the seller directly.",
      },
      {
        id: "view-2-2",
        text: "Test light switches, power sockets, and check the fuse board",
        tip: "An old fuse box without an RCD (residual current device) will likely need replacing. Budget £200–£500.",
      },
      {
        id: "view-2-3",
        text: "Run taps and flush toilets to check water pressure",
        tip: "Low pressure may indicate ageing pipes or issues with the mains supply. Test both hot and cold.",
      },
      {
        id: "view-2-4",
        text: "Open and close all windows and check for draughts",
        tip: "Sash windows in older properties often need refurbishment. Check for draughtproofing and smooth operation.",
      },
      {
        id: "view-2-5",
        text: "Inspect the kitchen — age and condition of units, worktops, and appliances",
        subItems: [
          "Check under the sink for leaks or damp",
          "Note what appliances are included in the sale",
          "Look at extraction and ventilation",
          "Check for signs of pests (droppings, damage to kickboards)",
        ],
      },
      {
        id: "view-2-6",
        text: "Inspect bathrooms — tiles, grouting, sealant, and ventilation",
        tip: "Black mould around baths and showers indicates poor ventilation and could mean hidden damp.",
      },
      {
        id: "view-2-7",
        text: "Check the boiler — type, age, and last service date",
        tip: "Boilers typically last 10–15 years. A replacement costs £2,000–£4,000+ installed. Ask to see the service history.",
      },
      {
        id: "view-2-8",
        text: "Look at flooring throughout — lift edges of carpet if possible",
        tip: "Carpet can hide damaged floorboards, uneven subfloors, or damp. Ask permission before lifting.",
      },
      {
        id: "view-2-9",
        text: "Check loft space — insulation, roof timbers, and any signs of leaks",
        tip: "At least 270mm of loft insulation is recommended. Look for daylight through the roof and signs of vermin.",
      },
      {
        id: "view-2-10",
        text: "Assess storage space — built-in wardrobes, cupboards, loft, and shed",
      },
      {
        id: "view-2-11",
        text: "Note the overall layout and natural light levels",
        tip: "South-facing gardens and rear aspects get the most sunlight. Consider how you would use each room.",
      },
      {
        id: "view-2-12",
        text: "Smell for damp, mustiness, or heavy air freshener (which can mask issues)",
        tip: "If a property smells heavily of air freshener or scented candles, look more carefully for damp and mould.",
      },
    ],
  },
  {
    title: "Questions to Ask the Seller or Agent",
    items: [
      {
        id: "view-3-1",
        text: "Why are they selling and how long has the property been on the market?",
        tip: "Motivation and time on market can affect how negotiable the price is.",
      },
      {
        id: "view-3-2",
        text: "How long have they owned the property?",
      },
      {
        id: "view-3-3",
        text: "Is the property freehold or leasehold? If leasehold, how many years remain?",
        tip: "Leases under 80 years become much more expensive to extend. Check ground rent and service charges too.",
      },
      {
        id: "view-3-4",
        text: "What is included in the sale (fixtures, fittings, appliances)?",
        tip: "Get this confirmed in writing. The TA10 (Fittings and Contents) form will detail everything.",
      },
      {
        id: "view-3-5",
        text: "Have there been any alterations or extensions? Were they approved?",
        tip: "Ask about building regulations sign-off and planning permission. Unapproved works can cause problems with your mortgage.",
      },
      {
        id: "view-3-6",
        text: "What are the average monthly utility bills?",
      },
      {
        id: "view-3-7",
        text: "What is the council tax band?",
        tip: "Check your local council website for the exact annual amount. You can challenge the banding if you believe it is wrong.",
      },
      {
        id: "view-3-8",
        text: "Are there any ongoing disputes with neighbours or boundary issues?",
        tip: "The seller is legally required to disclose disputes on the property information form (TA6).",
      },
      {
        id: "view-3-9",
        text: "What is the broadband and mobile signal like?",
        tip: "Check Ofcom's coverage checker independently — do not rely solely on the seller's experience.",
      },
      {
        id: "view-3-10",
        text: "Are there any planned developments nearby?",
        tip: "Check the local council's planning portal for any large developments that could affect the area.",
      },
      {
        id: "view-3-11",
        text: "When would the seller ideally like to complete?",
        tip: "Aligning timelines makes your offer more attractive and reduces the risk of the chain collapsing.",
      },
    ],
  },
];

export default function ViewingChecklistPage() {
  return (
    <ChecklistLayout
      title="Property Viewing Checklist"
      subtitle="What to look for and ask at every property viewing"
      icon={Eye}
      backHref="/buyers/checklists"
      backLabel="All Checklists"
      storageKey="viven-checklist-viewing"
      phases={phases}
      intro={
        <div className="bg-primary-light rounded-xl p-4 text-sm text-foreground leading-relaxed">
          <p>
            It is easy to get swept up in the excitement of a viewing and miss
            important details. Use this checklist at every property you visit —
            print it out or tick items off on your phone as you go. The more
            thorough you are now, the fewer surprises later.
          </p>
        </div>
      }
    />
  );
}
