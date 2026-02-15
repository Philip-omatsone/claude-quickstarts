"use client";

import { Home } from "lucide-react";
import {
  ChecklistLayout,
  type ChecklistPhase,
} from "@/components/checklists/ChecklistLayout";

const phases: ChecklistPhase[] = [
  {
    title: "Before Moving Day",
    items: [
      {
        id: "mi-1-1",
        text: "Confirm your deposit has been protected in a government-approved scheme",
        tip: "Your landlord has 30 days from receiving your deposit to protect it and provide you with prescribed information. If they don't, they cannot serve a valid Section 21 notice.",
      },
      {
        id: "mi-1-2",
        text: "Read your tenancy agreement thoroughly and keep a signed copy",
        subItems: [
          "Check the notice period and break clause",
          "Note any restrictions (pets, smoking, guests, subletting)",
          "Understand your repair responsibilities vs the landlord's",
          "Check the rent review clause",
        ],
      },
      {
        id: "mi-1-3",
        text: "Ensure you have received the required legal documents from your landlord",
        tip: "In England, landlords must provide: the EPC, Gas Safety Certificate, and the How to Rent guide before the tenancy starts.",
        subItems: [
          "Energy Performance Certificate (EPC)",
          "Gas Safety Certificate (CP12)",
          "Electrical Installation Condition Report (EICR)",
          "How to Rent guide (England only)",
          "Deposit protection certificate and prescribed information",
        ],
      },
      {
        id: "mi-1-4",
        text: "Set up a Royal Mail redirect from your old address (starts at £35.99 for 3 months)",
        tip: "You can set this up online at royalmail.com. It takes 5 working days to activate, so plan ahead.",
      },
      {
        id: "mi-1-5",
        text: "Arrange contents insurance for the new property",
        tip: "Your landlord's building insurance does not cover your belongings. Some policies also cover accidental damage to the landlord's fixtures, which can protect your deposit.",
      },
      {
        id: "mi-1-6",
        text: "Notify important contacts of your new address",
        subItems: [
          "Bank and credit cards",
          "DVLA (driving licence and vehicle registration)",
          "GP surgery and dentist",
          "Electoral register (register at your new address to maintain your credit score)",
          "Employer and pension provider",
          "HMRC if self-employed",
        ],
      },
      {
        id: "mi-1-7",
        text: "Compare and set up energy suppliers for gas and electricity",
        tip: "Use Ofgem's price comparison tool or sites like Uswitch. If the property has a prepayment meter, ask your new supplier about switching to a credit meter.",
      },
      {
        id: "mi-1-8",
        text: "Set up broadband and arrange an installation date",
        tip: "Order at least 2 weeks in advance — some providers need an engineer visit which can take time to book.",
      },
      {
        id: "mi-1-9",
        text: "Arrange a TV licence if you will be watching live TV or BBC iPlayer",
      },
      {
        id: "mi-1-10",
        text: "Book a removal van or arrange help for moving day",
        tip: "Get at least three quotes and check reviews. Book well in advance — the end of the month is always the busiest time for moves.",
      },
    ],
  },
  {
    title: "On Moving Day",
    items: [
      {
        id: "mi-2-1",
        text: "Take detailed inventory photos of every room before moving anything in",
        tip: "Photograph walls, floors, ceilings, windows, fixtures, and any existing damage. Email them to yourself so they are timestamped. This is your best protection when it comes to getting your deposit back.",
      },
      {
        id: "mi-2-2",
        text: "Take meter readings for gas, electricity, and water (if metered)",
        tip: "Photograph each meter showing the reading clearly. Send readings to your energy supplier on the same day.",
      },
      {
        id: "mi-2-3",
        text: "Complete and sign the inventory or check-in report",
        tip: "If the landlord provides an inventory, go through it carefully and note anything you disagree with. If no inventory is provided, create your own with photos — this protects you at check-out.",
      },
      {
        id: "mi-2-4",
        text: "Collect all sets of keys and check they all work",
        subItems: [
          "Front door keys",
          "Back door or garden access keys",
          "Window keys",
          "Mailbox key",
          "Garage or shed keys",
          "Communal door fobs or codes",
        ],
      },
      {
        id: "mi-2-5",
        text: "Test the smoke alarms and carbon monoxide detectors",
        tip: "Landlords in England are legally required to have working smoke alarms on every floor and carbon monoxide alarms in rooms with solid fuel appliances. Since October 2022, this extends to rooms with gas appliances too.",
      },
      {
        id: "mi-2-6",
        text: "Locate the fuse box, stopcock, and gas shut-off valve",
        tip: "Know where these are before you need them in an emergency. The stopcock is usually under the kitchen sink.",
      },
      {
        id: "mi-2-7",
        text: "Check the heating and hot water are working",
      },
      {
        id: "mi-2-8",
        text: "Test all appliances provided by the landlord",
        subItems: [
          "Oven and hob",
          "Fridge and freezer",
          "Washing machine",
          "Dishwasher (if provided)",
          "Extractor fans",
        ],
      },
      {
        id: "mi-2-9",
        text: "Report any issues or damage to the landlord or agent in writing immediately",
        tip: "Always use email or the agent's portal so you have a written record with a date stamp.",
      },
    ],
  },
  {
    title: "First Week",
    items: [
      {
        id: "mi-3-1",
        text: "Register for council tax at your new address",
        tip: "You can usually do this online through your local council's website. If you are a full-time student or live alone, you may be entitled to a discount or exemption.",
      },
      {
        id: "mi-3-2",
        text: "Register with a local GP surgery",
        tip: "You can find your nearest GP accepting new patients on the NHS website (nhs.uk).",
      },
      {
        id: "mi-3-3",
        text: "Register with a local dentist",
      },
      {
        id: "mi-3-4",
        text: "Register on the electoral roll at your new address",
        tip: "This is important for your credit score as well as your right to vote. Register at gov.uk/register-to-vote.",
      },
      {
        id: "mi-3-5",
        text: "Set up a standing order or direct debit for rent payments",
        tip: "Pay by bank transfer or standing order so you have a clear record of payments. Avoid paying in cash without a receipt.",
      },
      {
        id: "mi-3-6",
        text: "Set up water account with the local water company",
        tip: "Check if the property has a water meter. If not, you pay a fixed rate based on the rateable value of the property.",
      },
      {
        id: "mi-3-7",
        text: "Check the bin collection schedule on your council's website",
        tip: "Most councils have a postcode lookup tool that tells you your exact collection days and which bins to put out when.",
      },
      {
        id: "mi-3-8",
        text: "Introduce yourself to the neighbours",
        tip: "Building a good relationship with neighbours is helpful — they can keep an eye on the property and let you know about local issues.",
      },
      {
        id: "mi-3-9",
        text: "Save emergency contact numbers for your landlord, agent, and local services",
        subItems: [
          "Landlord or letting agent emergency line",
          "Gas emergency: 0800 111 999 (National Gas Emergency Service)",
          "Water company emergency number",
          "Local police non-emergency: 101",
          "NHS non-emergency: 111",
        ],
      },
      {
        id: "mi-3-10",
        text: "Familiarise yourself with the local area — shops, transport, GP, pharmacy",
      },
    ],
  },
];

export default function MovingInChecklistPage() {
  return (
    <ChecklistLayout
      title="Moving In Checklist"
      subtitle="Get settled into your new rental home without missing a thing"
      icon={Home}
      backHref="/renters/checklists"
      backLabel="All Checklists"
      storageKey="viven-checklist-rental-moving-in"
      phases={phases}
      intro={
        <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-sm text-foreground leading-relaxed">
          <strong>Remember:</strong> Your landlord is legally required to
          protect your deposit in a government-approved scheme within 30 days
          and provide you with key documents including the EPC, Gas Safety
          Certificate, and the How to Rent guide. If anything is missing, ask
          for it in writing before you move in.
        </div>
      }
    />
  );
}
