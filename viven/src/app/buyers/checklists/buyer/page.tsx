"use client";

import { ClipboardCheck } from "lucide-react";
import {
  ChecklistLayout,
  type ChecklistPhase,
} from "@/components/checklists/ChecklistLayout";

const phases: ChecklistPhase[] = [
  {
    title: "Phase 1: Getting Started",
    items: [
      { id: "bc-1-1", text: "Work out your budget (income, savings, debts)" },
      { id: "bc-1-2", text: "Get a mortgage Agreement in Principle (AIP)", tip: "Most estate agents require this before accepting viewings" },
      { id: "bc-1-3", text: "Research areas — commute, schools, amenities, crime" },
      { id: "bc-1-4", text: "Set up property alerts on Rightmove, Zoopla, OnTheMarket" },
      { id: "bc-1-5", text: "Understand stamp duty and factor it into your budget", tip: "First-time buyers pay no SDLT on the first £425k" },
      { id: "bc-1-6", text: "Start saving proof of funds, ID, and address history" },
      { id: "bc-1-7", text: "Check your credit score and fix any issues" },
    ],
  },
  {
    title: "Phase 2: Found a Property",
    items: [
      { id: "bc-2-1", text: "View the property (ideally twice, at different times of day)" },
      { id: "bc-2-2", text: "Run a Viven property report — check flood risk, crime, EPC, price history" },
      { id: "bc-2-3", text: "Check council tax band and planning applications nearby" },
      { id: "bc-2-4", text: "Research recent comparable sales in the street" },
      { id: "bc-2-5", text: "Check lease length if leasehold (under 80 years = red flag)", tip: "Extending a lease under 80 years is significantly more expensive" },
      { id: "bc-2-6", text: "Note any issues: damp, cracks, roof condition, boundaries" },
      { id: "bc-2-7", text: "Ask the agent about the seller's situation and chain" },
    ],
  },
  {
    title: "Phase 3: Offer Accepted",
    items: [
      { id: "bc-3-1", text: "Instruct a solicitor/conveyancer", tip: "Get 3 quotes — expect £1,000–£2,000 for a standard purchase" },
      { id: "bc-3-2", text: "Submit full mortgage application" },
      { id: "bc-3-3", text: "Book a survey (Level 2 Homebuyer or Level 3 Full Building)" },
      { id: "bc-3-4", text: "Provide ID and proof of funds to your solicitor" },
      { id: "bc-3-5", text: "Ask your solicitor about indemnity insurance if needed" },
      { id: "bc-3-6", text: "Request the fixtures and fittings list" },
      { id: "bc-3-7", text: "Confirm your deposit amount and source" },
    ],
  },
  {
    title: "Phase 4: Pre-Exchange",
    items: [
      { id: "bc-4-1", text: "Review the survey report — negotiate on issues if needed" },
      { id: "bc-4-2", text: "Receive and review your mortgage offer" },
      { id: "bc-4-3", text: "Solicitor raises enquiries with the seller's solicitor" },
      { id: "bc-4-4", text: "Review local authority search results" },
      { id: "bc-4-5", text: "Review environmental and drainage search results" },
      { id: "bc-4-6", text: "Arrange buildings insurance (required from exchange)" },
      { id: "bc-4-7", text: "Review the contract and transfer deed" },
      { id: "bc-4-8", text: "Sign contract and transfer deposit to your solicitor" },
      { id: "bc-4-9", text: "Agree a completion date with all parties" },
    ],
  },
  {
    title: "Phase 5: Exchange to Completion",
    items: [
      { id: "bc-5-1", text: "Exchange contracts — you are now legally committed", tip: "Buildings insurance must be in place from this point" },
      { id: "bc-5-2", text: "Transfer remaining funds to your solicitor" },
      { id: "bc-5-3", text: "Arrange removals and redirect your post" },
      { id: "bc-5-4", text: "Read meters on the day of completion" },
      { id: "bc-5-5", text: "Completion day — solicitor confirms funds received" },
      { id: "bc-5-6", text: "Collect keys from the estate agent" },
      { id: "bc-5-7", text: "Register with council tax and utilities" },
      { id: "bc-5-8", text: "Update your address with banks, DVLA, GP, employer" },
      { id: "bc-5-9", text: "Solicitor registers you at HM Land Registry" },
    ],
  },
];

export default function BuyerChecklistPage() {
  return (
    <ChecklistLayout
      title="Buyer Checklist"
      subtitle="Your complete guide from first search to getting the keys"
      icon={ClipboardCheck}
      backHref="/buyers/checklists"
      backLabel="All checklists"
      storageKey="viven-buyer-checklist"
      phases={phases}
    />
  );
}
