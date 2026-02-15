"use client";

import { FileCheck } from "lucide-react";
import {
  ChecklistLayout,
  type ChecklistPhase,
} from "@/components/checklists/ChecklistLayout";

const phases: ChecklistPhase[] = [
  {
    title: "Legal Checks",
    items: [
      {
        id: "pre-1-1",
        text: "Confirm your solicitor has received and reviewed all property searches",
        subItems: [
          "Local authority search — planning history, road schemes, conservation areas",
          "Environmental search — contamination, flood risk, ground stability",
          "Water and drainage search — public sewer locations, water supply",
          "Chancel repair liability search",
        ],
        tip: "Searches can take 2–8 weeks depending on the local authority. Chase your solicitor regularly for updates.",
      },
      {
        id: "pre-1-2",
        text: "Review the title register and title plan from the Land Registry",
        tip: "Check for restrictive covenants, rights of way, or easements that could affect how you use the property.",
      },
      {
        id: "pre-1-3",
        text: "Check the seller's Property Information Form (TA6) for any issues",
        subItems: [
          "Disputes with neighbours",
          "Boundary disagreements",
          "Insurance claims history",
          "Alterations and whether building regulations were obtained",
          "Guarantees and warranties (damp-proofing, roofing, windows, etc.)",
        ],
      },
      {
        id: "pre-1-4",
        text: "Review the Fittings and Contents Form (TA10)",
        tip: "This lists what the seller is including, removing, or offering for sale. Check it matches what you expect from the viewing.",
      },
      {
        id: "pre-1-5",
        text: "If leasehold: review the lease terms carefully",
        subItems: [
          "Remaining lease length (below 80 years is a concern)",
          "Ground rent amount and escalation clauses",
          "Service charges — current and projected",
          "Management company details and any known issues",
          "Permission requirements for alterations or subletting",
        ],
        tip: "Doubling ground rent clauses can make a property unmortgageable. Ensure your solicitor flags any problematic terms.",
      },
      {
        id: "pre-1-6",
        text: "Raise any remaining enquiries with your solicitor",
        tip: "Now is the time to ask every question. Once contracts are exchanged, you are legally committed.",
      },
      {
        id: "pre-1-7",
        text: "Review the draft contract and ensure you understand all terms",
        tip: "Ask your solicitor to explain anything unclear — especially completion dates, penalties for late completion, and any special conditions.",
      },
      {
        id: "pre-1-8",
        text: "Check for any planning applications or developments nearby",
        tip: "Search the local council's planning portal. A large development next door could affect your property's value and your enjoyment of it.",
      },
    ],
  },
  {
    title: "Financial Preparation",
    items: [
      {
        id: "pre-2-1",
        text: "Confirm your mortgage offer is still valid and not expiring soon",
        tip: "Most mortgage offers are valid for 3–6 months. If yours is close to expiring, contact your lender or broker immediately.",
      },
      {
        id: "pre-2-2",
        text: "Review your mortgage offer terms one final time",
        subItems: [
          "Interest rate and type (fixed, variable, tracker)",
          "Monthly payment amount",
          "Mortgage term length",
          "Early repayment charges",
          "Any special conditions that must be met before drawdown",
        ],
      },
      {
        id: "pre-2-3",
        text: "Confirm the deposit amount and ensure funds are ready to transfer",
        tip: "Your solicitor will need the deposit in their account before exchange. Allow time for bank transfers — same-day (CHAPS) transfers may incur a fee.",
      },
      {
        id: "pre-2-4",
        text: "Verify your solicitor's bank details by phone (fraud prevention)",
        tip: "Email interception fraud is common in property transactions. NEVER rely solely on emailed bank details. Call your solicitor on a known number to confirm.",
      },
      {
        id: "pre-2-5",
        text: "Understand the Stamp Duty Land Tax you will owe",
        tip: "First-time buyers pay 0% on the first £425,000 (up to £625,000 total). Use HMRC's Stamp Duty calculator for an exact figure.",
        subItems: [
          "Your solicitor will handle the Stamp Duty return",
          "Payment is due within 14 days of completion",
          "Check if any reliefs or exemptions apply to you",
        ],
      },
      {
        id: "pre-2-6",
        text: "Arrange buildings insurance to start from the exchange date",
        tip: "You become legally responsible for the property from exchange, not completion. Most mortgage lenders require buildings insurance as a condition of the loan.",
      },
      {
        id: "pre-2-7",
        text: "Budget for immediate post-completion costs",
        subItems: [
          "Removals or van hire",
          "Lock changes",
          "Any immediate repairs or decorating",
          "New furniture or appliances",
          "Connection fees (broadband, etc.)",
        ],
      },
    ],
  },
  {
    title: "Practical Steps",
    items: [
      {
        id: "pre-3-1",
        text: "Conduct a final inspection of the property before exchange",
        tip: "Check the property is still in the condition you agreed to buy it in. Report any issues to your solicitor before exchanging.",
        subItems: [
          "All agreed fixtures and fittings are still present",
          "No new damage or deterioration",
          "Any agreed repairs have been completed",
          "The property has not been altered since your last visit",
        ],
      },
      {
        id: "pre-3-2",
        text: "Agree a completion date that works for all parties",
        tip: "Fridays are the most popular but riskiest day — if something goes wrong there is no next working day to fix it. Mid-week completions are safer.",
      },
      {
        id: "pre-3-3",
        text: "Confirm the chain status — is everyone in the chain ready to exchange?",
        tip: "Your solicitor should confirm that all parties in the chain are ready. One delay can hold everyone up.",
      },
      {
        id: "pre-3-4",
        text: "Start planning your move — get removal quotes and book early",
        tip: "End-of-month dates and Fridays are busiest. Booking 4–6 weeks ahead gives you the best choice of companies and prices.",
      },
      {
        id: "pre-3-5",
        text: "Notify your landlord if you are renting (check notice period)",
        tip: "Most assured shorthold tenancies require one month's written notice. Check your tenancy agreement for the exact terms.",
      },
      {
        id: "pre-3-6",
        text: "Start setting up mail redirection and address changes",
        tip: "Royal Mail redirection can be arranged in advance to start on your moving date.",
      },
      {
        id: "pre-3-7",
        text: "Create a checklist of items to take to the new property on day one",
        subItems: [
          "Important documents (ID, mortgage paperwork, insurance)",
          "Keys from the estate agent",
          "Cleaning supplies for the new property",
          "Basic toolkit for reassembling furniture",
        ],
      },
    ],
  },
];

export default function PreExchangeChecklistPage() {
  return (
    <ChecklistLayout
      title="Pre-Exchange Checklist"
      subtitle="Everything to confirm before you exchange contracts"
      icon={FileCheck}
      backHref="/buyers/checklists"
      backLabel="All Checklists"
      storageKey="viven-checklist-pre-exchange"
      phases={phases}
      intro={
        <div className="bg-primary-light rounded-xl p-4 text-sm text-foreground leading-relaxed">
          <p>
            Exchange of contracts is the point of no return — once you exchange,
            you are legally committed to buying the property. Use this checklist
            to make sure every legal, financial, and practical detail has been
            covered before you take that step.
          </p>
        </div>
      }
    />
  );
}
