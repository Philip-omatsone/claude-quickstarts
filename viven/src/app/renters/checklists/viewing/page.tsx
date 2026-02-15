"use client";

import { Eye } from "lucide-react";
import {
  ChecklistLayout,
  type ChecklistPhase,
} from "@/components/checklists/ChecklistLayout";

const phases: ChecklistPhase[] = [
  {
    title: "Before the Viewing",
    items: [
      {
        id: "rv-1-1",
        text: "Research the area on gov.uk flood risk maps and crime statistics",
        tip: "Check police.uk for local crime data and gov.uk for flood risk — both are free and take seconds.",
      },
      {
        id: "rv-1-2",
        text: "Check the property listing details carefully and note any questions",
        tip: "Save or screenshot the listing — agents sometimes amend details after initial publication.",
      },
      {
        id: "rv-1-3",
        text: "Verify the letting agent is registered with a redress scheme (e.g. The Property Ombudsman or NALS)",
        tip: "It is a legal requirement in England for agents to belong to a government-approved redress scheme.",
      },
      {
        id: "rv-1-4",
        text: "Check the EPC (Energy Performance Certificate) rating online",
        tip: "Rental properties in England and Wales must have an EPC rating of E or above. A low rating may mean high energy bills.",
      },
      {
        id: "rv-1-5",
        text: "Prepare a list of must-haves and deal-breakers",
        subItems: [
          "Budget including bills",
          "Commute time and transport links",
          "Pet policy if applicable",
          "Minimum tenancy length required",
        ],
      },
      {
        id: "rv-1-6",
        text: "Bring a phone or camera to take photos and a notepad for notes",
      },
    ],
  },
  {
    title: "Property Condition",
    items: [
      {
        id: "rv-2-1",
        text: "Check walls and ceilings for cracks, stains, or signs of damp",
        tip: "Look for dark patches, peeling paint, or a musty smell — these are classic signs of damp or condensation issues.",
      },
      {
        id: "rv-2-2",
        text: "Inspect windows for condensation, draughts, and whether they open and close properly",
        tip: "Single-glazed windows in an older property can massively increase heating costs.",
      },
      {
        id: "rv-2-3",
        text: "Check the condition of flooring throughout the property",
      },
      {
        id: "rv-2-4",
        text: "Look at the bathroom — check for mould, working extractor fan, and adequate water pressure",
        tip: "Run the taps and flush the loo during the viewing. Low water pressure is a common issue that is costly to fix.",
      },
      {
        id: "rv-2-5",
        text: "Inspect the kitchen — check worktops, cupboards, and under the sink for leaks",
      },
      {
        id: "rv-2-6",
        text: "Look for signs of pests such as droppings, gnaw marks, or holes in skirting boards",
      },
      {
        id: "rv-2-7",
        text: "Check the general cleanliness and whether it will be professionally cleaned before move-in",
      },
    ],
  },
  {
    title: "Practical Checks",
    items: [
      {
        id: "rv-3-1",
        text: "Test your mobile signal in different rooms",
        tip: "Use Ofcom's coverage checker before the viewing and verify in person — poor signal can be a real headache.",
      },
      {
        id: "rv-3-2",
        text: "Check broadband availability and speeds for the postcode",
        tip: "Use Ofcom's broadband checker or thinkbroadband.com — especially important if you work from home.",
      },
      {
        id: "rv-3-3",
        text: "Test all appliances that come with the property (oven, hob, fridge, washing machine)",
        tip: "Ask who is responsible for repairs if an appliance breaks — the landlord should maintain any they provide.",
      },
      {
        id: "rv-3-4",
        text: "Check the heating system works and ask when the boiler was last serviced",
        tip: "Landlords are legally required to have an annual gas safety check. Ask to see the Gas Safety Certificate.",
      },
      {
        id: "rv-3-5",
        text: "Locate the fuse box, stopcock (water shut-off), and gas meter",
      },
      {
        id: "rv-3-6",
        text: "Check there are enough power sockets in each room",
      },
      {
        id: "rv-3-7",
        text: "Assess storage space — wardrobes, cupboards, loft or shed access",
      },
      {
        id: "rv-3-8",
        text: "Check the security of the property — front door locks, window locks, exterior lighting",
        tip: "Landlords have a duty to ensure the property is safe and secure. Insecure doors or windows should be flagged.",
      },
      {
        id: "rv-3-9",
        text: "Note the parking situation — is there a dedicated space, permit zone, or only street parking?",
      },
      {
        id: "rv-3-10",
        text: "Check bin and recycling arrangements — where are the bins stored and what day is collection?",
      },
    ],
  },
  {
    title: "Questions to Ask",
    items: [
      {
        id: "rv-4-1",
        text: "How much is the deposit and which government-approved scheme will it be held in?",
        tip: "In England and Wales, your deposit must be placed in one of three schemes: DPS, MyDeposits, or TDS within 30 days.",
      },
      {
        id: "rv-4-2",
        text: "What bills are included in the rent (if any)?",
        subItems: [
          "Council tax band and annual cost",
          "Water (metered or fixed rate)",
          "Gas and electricity",
          "Broadband and TV licence",
        ],
      },
      {
        id: "rv-4-3",
        text: "How responsive is the landlord to maintenance requests?",
        tip: "Ask the current tenant if possible, or look for online reviews of the letting agent.",
      },
      {
        id: "rv-4-4",
        text: "What is the minimum tenancy length and what are the break clause terms?",
        tip: "Most assured shorthold tenancies (ASTs) are 6 or 12 months. A break clause lets you leave early — check the notice period.",
      },
      {
        id: "rv-4-5",
        text: "Are there any fees beyond rent and deposit?",
        tip: "The Tenant Fees Act 2019 bans most letting fees in England. Agents can only charge for rent, deposit (max 5 weeks), holding deposit (max 1 week), and permitted payments.",
      },
      {
        id: "rv-4-6",
        text: "Is the property licensed (HMO licence or selective licence if required by the council)?",
        tip: "If the property needs a licence but does not have one, the landlord cannot legally evict you via a Section 21 notice.",
      },
      {
        id: "rv-4-7",
        text: "Can you redecorate or make small changes (e.g. put up shelves)?",
      },
      {
        id: "rv-4-8",
        text: "What is the process for reporting repairs and what are the typical response times?",
      },
      {
        id: "rv-4-9",
        text: "Why is the current tenant leaving (if applicable)?",
        tip: "This can reveal useful information about the landlord, neighbours, or ongoing issues.",
      },
      {
        id: "rv-4-10",
        text: "Are there any planned works or developments nearby?",
        tip: "Check your local council planning portal for any upcoming construction that could cause noise or disruption.",
      },
    ],
  },
];

export default function RentalViewingChecklistPage() {
  return (
    <ChecklistLayout
      title="Rental Viewing Checklist"
      subtitle="Everything to check and ask when viewing a rental property"
      icon={Eye}
      backHref="/renters/checklists"
      backLabel="All Checklists"
      storageKey="viven-checklist-rental-viewing"
      phases={phases}
      intro={
        <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-sm text-foreground leading-relaxed">
          <strong>Top tip:</strong> Try to visit the property at different times
          of day if you can. A street that seems quiet on a Tuesday morning may
          be very different on a Friday evening. Take photos of everything and
          don&apos;t feel rushed — a good landlord or agent will give you time to
          look around properly.
        </div>
      }
    />
  );
}
