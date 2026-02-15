"use client";

import { ClipboardList } from "lucide-react";
import {
  ChecklistLayout,
  type ChecklistPhase,
} from "@/components/checklists/ChecklistLayout";

const phases: ChecklistPhase[] = [
  {
    title: "Phase 1 — Getting Ready",
    items: [
      {
        id: "ftb-1-1",
        text: "Check your credit report and fix any errors",
        tip: "Use Experian, Equifax, or TransUnion — you can access free statutory reports. Errors can delay mortgage offers.",
        subItems: [
          "Register on the electoral roll at your current address",
          "Pay off or reduce outstanding debts where possible",
          "Avoid applying for new credit in the 6 months before your mortgage application",
        ],
      },
      {
        id: "ftb-1-2",
        text: "Work out your budget including all buying costs",
        tip: "Budget for more than just the deposit — Stamp Duty, solicitor fees, surveys, and moving costs add up fast.",
        subItems: [
          "Deposit (typically 5–20% of the purchase price)",
          "Solicitor/conveyancer fees (£1,000–£2,000+)",
          "Survey costs (£250–£600+ depending on type)",
          "Mortgage arrangement and valuation fees",
          "Stamp Duty Land Tax (first-time buyers pay 0% on the first £425,000)",
          "Removal costs and initial furnishing",
        ],
      },
      {
        id: "ftb-1-3",
        text: "Get a mortgage Agreement in Principle (AIP)",
        tip: "An AIP shows sellers and agents you are a serious buyer. Most are valid for 60–90 days.",
      },
      {
        id: "ftb-1-4",
        text: "Research government schemes you may be eligible for",
        subItems: [
          "First Homes scheme — new-build homes at 30–50% discount",
          "Shared Ownership — buy a share and pay rent on the rest",
          "Lifetime ISA — up to £1,000/year government bonus towards your deposit",
          "Right to Buy — if you are a council or housing association tenant",
        ],
      },
      {
        id: "ftb-1-5",
        text: "Speak to a mortgage broker or adviser",
        tip: "A whole-of-market broker can access deals you cannot find directly. Some charge a fee, others are paid by the lender.",
      },
      {
        id: "ftb-1-6",
        text: "Start saving evidence of your income and outgoings",
        subItems: [
          "Last 3 months' payslips (or 2–3 years' accounts if self-employed)",
          "Last 3 months' bank statements",
          "Proof of deposit savings and any gifted deposit letters",
          "Photo ID (passport or driving licence) and proof of address",
        ],
      },
    ],
  },
  {
    title: "Phase 2 — Searching & Viewing",
    items: [
      {
        id: "ftb-2-1",
        text: "Define your must-haves and nice-to-haves",
        tip: "Be realistic — prioritise location, size, and condition. You can always add nice-to-haves later.",
        subItems: [
          "Number of bedrooms and bathrooms",
          "Garden, parking, or outside space",
          "Proximity to transport, schools, or workplace",
          "Freehold vs leasehold preference",
        ],
      },
      {
        id: "ftb-2-2",
        text: "Register with local estate agents and set up portal alerts",
        tip: "Rightmove, Zoopla, and OnTheMarket are the main UK portals. Set alerts so you see new listings immediately.",
      },
      {
        id: "ftb-2-3",
        text: "Research the local area thoroughly",
        subItems: [
          "Check flood risk maps on the Environment Agency website",
          "Look at local council planning applications for nearby developments",
          "Visit at different times of day and on weekends",
          "Check broadband speeds and mobile coverage",
          "Research council tax bands for properties you like",
        ],
      },
      {
        id: "ftb-2-4",
        text: "View properties and take notes for each one",
        tip: "Take photos, videos, and written notes at every viewing. It is easy to mix up properties after several viewings.",
      },
      {
        id: "ftb-2-5",
        text: "Arrange second viewings for shortlisted properties",
        tip: "Visit at a different time of day. Bring someone you trust for a second opinion.",
      },
      {
        id: "ftb-2-6",
        text: "Check the property's EPC rating",
        tip: "Energy Performance Certificates rate A–G. Lower ratings mean higher energy bills. Check on the EPC Register.",
      },
    ],
  },
  {
    title: "Phase 3 — Making an Offer",
    items: [
      {
        id: "ftb-3-1",
        text: "Research comparable sold prices in the area",
        tip: "Use the Land Registry's Price Paid data or Rightmove's sold prices to understand what similar homes have sold for.",
      },
      {
        id: "ftb-3-2",
        text: "Decide your offer amount and make it through the estate agent",
        tip: "First offers are often 5–10% below asking. Consider how long it has been on the market, the seller's position, and local demand.",
      },
      {
        id: "ftb-3-3",
        text: "Negotiate if needed — be prepared to increase or walk away",
        tip: "As a first-time buyer with no chain, you are an attractive buyer. Use this as leverage.",
      },
      {
        id: "ftb-3-4",
        text: "Get your offer accepted in writing",
        tip: "Ask the estate agent to confirm your accepted offer in writing, including any conditions agreed.",
      },
      {
        id: "ftb-3-5",
        text: "Request that the property is taken off the market",
        tip: "This is standard practice once an offer is accepted and reduces the risk of gazumping.",
      },
    ],
  },
  {
    title: "Phase 4 — Mortgage & Legal",
    items: [
      {
        id: "ftb-4-1",
        text: "Submit your full mortgage application",
        tip: "Do this promptly after your offer is accepted. Delays here slow the entire process.",
        subItems: [
          "Provide all requested documents quickly",
          "Respond to any queries from the lender without delay",
          "Keep your financial situation stable — avoid changing jobs or taking on new debt",
        ],
      },
      {
        id: "ftb-4-2",
        text: "Instruct a solicitor or licensed conveyancer",
        tip: "Get quotes from at least 3 firms. Check reviews and ensure they are on your mortgage lender's panel.",
      },
      {
        id: "ftb-4-3",
        text: "Commission a property survey",
        subItems: [
          "RICS Home Survey Level 1 (basic condition report)",
          "RICS Home Survey Level 2 (more detailed, formerly HomeBuyer Report)",
          "RICS Home Survey Level 3 (comprehensive, formerly Building Survey — recommended for older properties)",
        ],
        tip: "Never skip the survey. Mortgage valuations are for the lender, not for you. A survey can reveal expensive hidden issues.",
      },
      {
        id: "ftb-4-4",
        text: "Review the survey results and raise any concerns",
        tip: "If the survey highlights significant issues, get specialist quotes. You may want to renegotiate the price.",
      },
      {
        id: "ftb-4-5",
        text: "Review your solicitor's property searches",
        subItems: [
          "Local authority search",
          "Environmental search",
          "Water and drainage search",
          "Chancel repair liability search",
        ],
      },
      {
        id: "ftb-4-6",
        text: "Receive and review your formal mortgage offer",
        tip: "Read every page carefully. Check the interest rate, term, monthly payments, and any special conditions.",
      },
      {
        id: "ftb-4-7",
        text: "Arrange buildings insurance to start from exchange",
        tip: "You are legally responsible for the property from exchange, not completion. Have insurance ready.",
      },
    ],
  },
  {
    title: "Phase 5 — Exchange & Completion",
    items: [
      {
        id: "ftb-5-1",
        text: "Approve and sign the contract from your solicitor",
        tip: "Read everything. Ask your solicitor to explain anything you do not understand.",
      },
      {
        id: "ftb-5-2",
        text: "Transfer your deposit to your solicitor's account",
        tip: "Beware of email interception fraud — always confirm bank details by phone using a known number.",
      },
      {
        id: "ftb-5-3",
        text: "Agree a completion date with all parties",
        tip: "Completion usually happens 1–4 weeks after exchange. Friday is the most popular day but also the riskiest if things go wrong.",
      },
      {
        id: "ftb-5-4",
        text: "Exchange contracts — you are now legally committed",
        tip: "After exchange, pulling out means losing your deposit and potentially facing legal action.",
      },
      {
        id: "ftb-5-5",
        text: "Do a final pre-completion inspection of the property",
        tip: "Check that the property is in the agreed condition, all fixtures are present, and nothing has been damaged.",
      },
      {
        id: "ftb-5-6",
        text: "Wait for your solicitor to confirm completion",
        tip: "Your solicitor will transfer the funds and confirm when you can collect the keys — usually from the estate agent.",
      },
    ],
  },
  {
    title: "Phase 6 — Post-Completion",
    items: [
      {
        id: "ftb-6-1",
        text: "Collect your keys and inspect the property",
        tip: "Take meter readings immediately and photograph them.",
      },
      {
        id: "ftb-6-2",
        text: "Set up or transfer utilities and council tax",
        subItems: [
          "Gas and electricity",
          "Water",
          "Broadband and phone",
          "Council tax (contact your local authority)",
          "TV licence",
        ],
      },
      {
        id: "ftb-6-3",
        text: "Register with the local GP, dentist, and optician",
      },
      {
        id: "ftb-6-4",
        text: "Update your address everywhere",
        subItems: [
          "Bank and building society",
          "HMRC and DVLA",
          "Employer and pension provider",
          "Insurance policies",
          "Electoral roll",
          "Royal Mail redirection (set up if not done already)",
          "Subscriptions and online accounts",
        ],
      },
      {
        id: "ftb-6-5",
        text: "Change the locks on all external doors",
        tip: "You do not know how many copies of the keys exist. Changing locks is inexpensive peace of mind.",
      },
      {
        id: "ftb-6-6",
        text: "Test smoke and carbon monoxide alarms",
        tip: "Replace batteries or install new detectors if needed. This is a legal requirement for rented properties and best practice for all homes.",
      },
      {
        id: "ftb-6-7",
        text: "Keep all property documents in a safe place",
        subItems: [
          "Title deeds (your solicitor will register these with the Land Registry)",
          "Mortgage offer and terms",
          "Survey report",
          "Building regulations and planning certificates",
          "Warranties and guarantees (boiler, appliances, etc.)",
        ],
      },
    ],
  },
];

export default function FirstTimeBuyerChecklistPage() {
  return (
    <ChecklistLayout
      title="First-Time Buyer Checklist"
      subtitle="Everything you need to do from saving your deposit to getting your keys"
      icon={ClipboardList}
      backHref="/buyers/checklists"
      backLabel="All Checklists"
      storageKey="viven-checklist-ftb"
      phases={phases}
      intro={
        <div className="bg-primary-light rounded-xl p-4 text-sm text-foreground leading-relaxed">
          <p>
            Buying your first home in the UK is exciting but can feel overwhelming.
            This checklist guides you through every step — from getting your finances
            in order to settling into your new home. Tick off each item as you go
            and your progress will be saved automatically.
          </p>
        </div>
      }
    />
  );
}
