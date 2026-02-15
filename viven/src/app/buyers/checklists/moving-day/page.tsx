"use client";

import { Truck } from "lucide-react";
import {
  ChecklistLayout,
  type ChecklistPhase,
} from "@/components/checklists/ChecklistLayout";

const phases: ChecklistPhase[] = [
  {
    title: "Before Moving Day",
    items: [
      {
        id: "move-1-1",
        text: "Book a removals company or hire a van",
        tip: "Get at least 3 quotes. Book well in advance — especially for end-of-month or Friday moves. Check they have goods-in-transit insurance.",
        subItems: [
          "Confirm dates, times, and access arrangements in writing",
          "Ask about parking restrictions and whether a permit is needed",
          "Arrange cover for pets, children, or elderly relatives on the day",
        ],
      },
      {
        id: "move-1-2",
        text: "Set up Royal Mail redirection",
        tip: "Redirect post from your old address for at least 6 months. You can do this online at royalmail.com — costs start from around £35.",
      },
      {
        id: "move-1-3",
        text: "Notify your energy suppliers or switch to new ones",
        tip: "Take final meter readings at your old property and opening readings at your new one. Photograph the meters.",
      },
      {
        id: "move-1-4",
        text: "Arrange broadband and phone line for the new property",
        tip: "Broadband installation can take 2–4 weeks, so book early. Check what is available at your new address on comparison sites.",
      },
      {
        id: "move-1-5",
        text: "Start packing room by room — label every box clearly",
        subItems: [
          "Pack a separate 'first night' box with essentials (see below)",
          "Use colour-coded labels or tape for each room",
          "Wrap fragile items individually and mark boxes clearly",
          "Disassemble large furniture and bag up screws and fittings",
        ],
      },
      {
        id: "move-1-6",
        text: "Pack a 'first night' essentials box",
        tip: "You will be exhausted on moving day. Having essentials to hand saves rummaging through dozens of boxes.",
        subItems: [
          "Kettle, mugs, tea, coffee, milk, and snacks",
          "Phone chargers and extension lead",
          "Toilet roll, hand soap, and towels",
          "Bedding and pillows",
          "Basic cleaning supplies",
          "Torch and batteries",
          "Important documents and keys",
          "Medication and first aid kit",
        ],
      },
      {
        id: "move-1-7",
        text: "Confirm buildings and contents insurance is in place",
        tip: "Buildings insurance should be active from exchange of contracts. Contents insurance should start on moving day.",
      },
      {
        id: "move-1-8",
        text: "Defrost the freezer and prepare appliances for the move",
        tip: "Defrost at least 24 hours before. Use up perishable food or give it away.",
      },
      {
        id: "move-1-9",
        text: "Arrange parking permits or suspensions if needed at either address",
        tip: "Contact the local council well in advance. A removal van needs clear access and may require a parking bay suspension.",
      },
      {
        id: "move-1-10",
        text: "Return borrowed keys, fobs, and cancel any old property access",
      },
    ],
  },
  {
    title: "Moving Day",
    items: [
      {
        id: "move-2-1",
        text: "Take final meter readings at your old property and photograph them",
        tip: "Record gas, electricity, and water readings. Send these to your suppliers on the same day.",
      },
      {
        id: "move-2-2",
        text: "Do a final check of every room, cupboard, loft, shed, and garage",
        tip: "It is surprisingly easy to leave things behind — check on top of wardrobes, inside drawers, and in the loft.",
      },
      {
        id: "move-2-3",
        text: "Collect keys to your new property once completion is confirmed",
        tip: "Your solicitor will call to confirm completion. Keys are usually collected from the estate agent.",
      },
      {
        id: "move-2-4",
        text: "Take meter readings at your new property immediately on arrival",
        tip: "Photograph the gas, electricity, and water meters before unpacking anything.",
      },
      {
        id: "move-2-5",
        text: "Check the property is in the expected condition",
        subItems: [
          "All agreed fixtures and fittings are present",
          "No new damage since your last visit",
          "The property has been left clean and cleared",
        ],
      },
      {
        id: "move-2-6",
        text: "Direct the removals team — show them which boxes go in which rooms",
        tip: "Stay at the new property to direct. If possible, have someone you trust at the old property to oversee loading.",
      },
      {
        id: "move-2-7",
        text: "Check that water, gas, and electricity are all working",
        tip: "Locate the stopcock, gas shut-off valve, and fuse board/consumer unit on arrival.",
      },
      {
        id: "move-2-8",
        text: "Set up beds and essentials before the removals team leaves",
        tip: "Prioritise bedrooms and the kitchen. Everything else can wait until tomorrow.",
      },
      {
        id: "move-2-9",
        text: "Lock up securely and check all windows and doors",
      },
    ],
  },
  {
    title: "First Week in Your New Home",
    items: [
      {
        id: "move-3-1",
        text: "Change the locks on all external doors",
        tip: "You do not know how many previous key copies exist. A locksmith can rekey or replace locks for £60–£150 per door.",
      },
      {
        id: "move-3-2",
        text: "Test and locate all smoke alarms and carbon monoxide detectors",
        tip: "Replace batteries or install new detectors. Place them on every floor and near bedrooms.",
      },
      {
        id: "move-3-3",
        text: "Register for council tax at your new address",
        tip: "Contact your new local authority directly. You may be eligible for a single person discount (25% off).",
      },
      {
        id: "move-3-4",
        text: "Register with a local GP, dentist, and optician",
      },
      {
        id: "move-3-5",
        text: "Update your address with key organisations",
        subItems: [
          "Bank and building society accounts",
          "DVLA — driving licence and vehicle registration (V5C)",
          "HMRC",
          "Employer and pension providers",
          "Insurance policies (car, life, health, etc.)",
          "Electoral roll registration",
          "Subscriptions, online shopping, and delivery accounts",
        ],
      },
      {
        id: "move-3-6",
        text: "Set up a TV licence if you watch or record live TV",
        tip: "You need a licence at tvlicensing.co.uk if you watch live broadcasts on any device or use BBC iPlayer.",
      },
      {
        id: "move-3-7",
        text: "Locate and understand your home's key systems",
        subItems: [
          "Boiler controls and thermostat — read the manual",
          "Stopcock (usually under the kitchen sink)",
          "Fuse board/consumer unit",
          "Gas shut-off valve (usually near the meter)",
          "Any burglar alarm codes and manuals",
        ],
      },
      {
        id: "move-3-8",
        text: "Introduce yourself to your neighbours",
        tip: "Good relationships with neighbours make life easier and they can be a valuable source of local information.",
      },
      {
        id: "move-3-9",
        text: "Book a boiler service if one is overdue",
        tip: "Annual boiler servicing keeps your warranty valid and ensures safe operation. A Gas Safe registered engineer is required by law.",
      },
      {
        id: "move-3-10",
        text: "Start a home maintenance file",
        tip: "Keep all manuals, warranties, certificates, and receipts together. Digital copies in cloud storage work well as a backup.",
      },
    ],
  },
];

export default function MovingDayChecklistPage() {
  return (
    <ChecklistLayout
      title="Moving Day Checklist"
      subtitle="Stay organised before, during, and after your move"
      icon={Truck}
      backHref="/buyers/checklists"
      backLabel="All Checklists"
      storageKey="viven-checklist-moving-day"
      phases={phases}
      intro={
        <div className="bg-primary-light rounded-xl p-4 text-sm text-foreground leading-relaxed">
          <p>
            Moving day is one of the most stressful parts of buying a home, but
            good preparation makes all the difference. Work through this checklist
            in the weeks before your move and tick off items on the day itself to
            make sure nothing gets forgotten.
          </p>
        </div>
      }
    />
  );
}
