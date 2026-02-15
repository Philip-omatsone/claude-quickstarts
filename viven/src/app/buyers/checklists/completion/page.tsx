"use client";

import { PartyPopper } from "lucide-react";
import {
  ChecklistLayout,
  type ChecklistPhase,
} from "@/components/checklists/ChecklistLayout";

const phases: ChecklistPhase[] = [
  {
    title: "Before Completion Day",
    items: [
      {
        id: "comp-1-1",
        text: "Confirm completion date and time with your solicitor",
        tip: "Completions typically happen between 10am and 2pm. Your solicitor will transfer the purchase funds to the seller's solicitor.",
      },
      {
        id: "comp-1-2",
        text: "Ensure all mortgage funds are ready for drawdown",
        tip: "Your solicitor will request the mortgage funds from your lender a few days before completion. Confirm this has been done.",
      },
      {
        id: "comp-1-3",
        text: "Transfer any remaining balance to your solicitor",
        tip: "This is the difference between the mortgage amount and the total purchase price (minus the deposit already paid at exchange). Verify bank details by phone.",
      },
      {
        id: "comp-1-4",
        text: "Confirm key collection arrangements with the estate agent",
        tip: "Keys are usually collected from the estate agent's office once your solicitor confirms completion. Check their opening hours.",
      },
      {
        id: "comp-1-5",
        text: "Arrange a pre-completion inspection if not already done",
        tip: "A final walkthrough ensures the property is in the agreed condition, all fixtures are present, and the seller has cleared out.",
      },
      {
        id: "comp-1-6",
        text: "Confirm your removals company or van hire for the day",
        subItems: [
          "Confirm arrival time and any access arrangements",
          "Double-check parking permits are in place at both addresses",
          "Have a backup plan in case of delays",
        ],
      },
      {
        id: "comp-1-7",
        text: "Pack your essentials box for immediate access on arrival",
        subItems: [
          "Phone chargers, kettle, mugs, tea and coffee",
          "Toilet roll, towels, soap, and cleaning spray",
          "Torch, toolkit, and extension lead",
          "Snacks and drinks for the day",
        ],
      },
    ],
  },
  {
    title: "On Completion Day",
    items: [
      {
        id: "comp-2-1",
        text: "Wait for your solicitor to confirm that completion has taken place",
        tip: "Do not go to collect keys or start moving until you have explicit confirmation from your solicitor. This usually comes by phone.",
      },
      {
        id: "comp-2-2",
        text: "Collect all sets of keys from the estate agent",
        tip: "Ask for every key — front door, back door, garage, shed, windows, alarm fob, communal areas. Check you have them all.",
      },
      {
        id: "comp-2-3",
        text: "Take photographs of all meter readings immediately",
        subItems: [
          "Gas meter reading",
          "Electricity meter reading",
          "Water meter reading (if applicable)",
        ],
        tip: "Photograph each meter clearly showing the reading. This establishes exactly when your billing starts.",
      },
      {
        id: "comp-2-4",
        text: "Check the property thoroughly before the removals team arrives",
        subItems: [
          "All rooms have been cleared by the seller",
          "Agreed fixtures and fittings are in place",
          "No damage has occurred since your last inspection",
          "Heating and hot water are working",
          "All taps and toilets flush correctly",
        ],
      },
      {
        id: "comp-2-5",
        text: "Locate the stopcock, gas valve, fuse board, and boiler controls",
        tip: "Knowing where these are from day one means you can respond quickly to any emergencies.",
      },
      {
        id: "comp-2-6",
        text: "Let in the removals team and direct furniture placement",
        tip: "Have a clear plan of which furniture goes in which room. Label rooms with signs if it helps.",
      },
      {
        id: "comp-2-7",
        text: "Check that broadband and phone connections are active or installation is booked",
      },
      {
        id: "comp-2-8",
        text: "Make the property secure before leaving or going to bed",
        subItems: [
          "Lock all doors and windows",
          "Set the alarm if there is one (check for codes from the seller)",
          "Check side gates and outbuildings are secure",
        ],
      },
    ],
  },
  {
    title: "First 24 Hours",
    items: [
      {
        id: "comp-3-1",
        text: "Contact energy suppliers with your meter readings",
        tip: "Either transfer the existing accounts into your name or set up new ones with your chosen supplier. Having meter readings from day one prevents billing disputes.",
      },
      {
        id: "comp-3-2",
        text: "Contact the water company to register at the property",
      },
      {
        id: "comp-3-3",
        text: "Register for council tax with your local authority",
        tip: "You can usually do this online. You may qualify for a 25% single person discount or other exemptions.",
      },
      {
        id: "comp-3-4",
        text: "Test all smoke alarms and carbon monoxide detectors",
        tip: "Replace batteries immediately if any are not working. Install new detectors if needed — one on every floor as a minimum.",
      },
      {
        id: "comp-3-5",
        text: "Change the locks on all external doors",
        tip: "This is the most important security step. Previous owners, their friends, tradespeople, and neighbours may all have copies of the old keys.",
      },
      {
        id: "comp-3-6",
        text: "Set up beds and make the bedrooms liveable",
        tip: "After a long and tiring day, having clean beds ready is the single best thing you can do for your wellbeing.",
      },
      {
        id: "comp-3-7",
        text: "Do a basic clean of the kitchen and bathrooms",
        tip: "Even if the property looks clean, a fresh wipe-down of surfaces, sinks, and toilets gives you a hygienic fresh start.",
      },
    ],
  },
  {
    title: "First Week",
    items: [
      {
        id: "comp-4-1",
        text: "Update your address with essential services",
        subItems: [
          "Bank and building society",
          "DVLA — driving licence and vehicle log book (V5C)",
          "HMRC — tax records and tax credits",
          "Employer and payroll",
          "Pension providers",
          "GP surgery, dentist, and optician",
          "Car, home, and life insurance providers",
          "Electoral roll (register to vote at your new address)",
        ],
      },
      {
        id: "comp-4-2",
        text: "Set up or confirm Royal Mail redirection from your old address",
        tip: "If you have not already done this, set it up immediately. Post containing personal information going to an old address is a security risk.",
      },
      {
        id: "comp-4-3",
        text: "Set up a TV licence at your new address",
        tip: "Required if you watch or record live TV on any device, or use BBC iPlayer. Register at tvlicensing.co.uk.",
      },
      {
        id: "comp-4-4",
        text: "Book a boiler service if the last one was more than 12 months ago",
        tip: "Must be done by a Gas Safe registered engineer. Annual servicing may be required by your home insurance policy.",
      },
      {
        id: "comp-4-5",
        text: "Introduce yourself to your immediate neighbours",
        tip: "A quick hello goes a long way. Neighbours can share useful local information and they are good to know in an emergency.",
      },
      {
        id: "comp-4-6",
        text: "Familiarise yourself with local amenities",
        subItems: [
          "Nearest supermarkets and shops",
          "Local GP surgeries accepting new patients",
          "Nearest hospital with A&E",
          "Bin collection days and recycling rules",
          "Local parks, leisure centres, and community facilities",
        ],
      },
      {
        id: "comp-4-7",
        text: "Create a home file for all important property documents",
        subItems: [
          "Title deeds and Land Registry documents",
          "Mortgage offer and correspondence",
          "Buildings and contents insurance policies",
          "Survey report and valuation",
          "Boiler manual, service history, and Gas Safety certificate",
          "Electrical installation certificate (EICR)",
          "Warranties for any work done by previous owners",
          "Appliance manuals and receipts",
        ],
      },
      {
        id: "comp-4-8",
        text: "Confirm your solicitor has submitted the Stamp Duty return",
        tip: "Stamp Duty Land Tax must be filed and paid within 14 days of completion. Your solicitor handles this, but confirm it is done.",
      },
      {
        id: "comp-4-9",
        text: "Confirm your solicitor has applied to register your ownership with the Land Registry",
        tip: "Registration can take several weeks. Your solicitor should apply promptly and send you confirmation once completed.",
      },
    ],
  },
];

export default function CompletionChecklistPage() {
  return (
    <ChecklistLayout
      title="Completion Day Checklist"
      subtitle="Your step-by-step guide to completion day and settling in"
      icon={PartyPopper}
      backHref="/buyers/checklists"
      backLabel="All Checklists"
      storageKey="viven-checklist-completion"
      phases={phases}
      intro={
        <div className="bg-primary-light rounded-xl p-4 text-sm text-foreground leading-relaxed">
          <p>
            Completion day is when the property officially becomes yours.
            Congratulations! There is still plenty to do, though — from collecting
            keys and taking meter readings to changing locks and registering with
            the council. This checklist keeps you on track through the excitement.
          </p>
        </div>
      }
    />
  );
}
