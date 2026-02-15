"use client";

import { ClipboardList } from "lucide-react";
import {
  ChecklistLayout,
  type ChecklistPhase,
} from "@/components/checklists/ChecklistLayout";

const phases: ChecklistPhase[] = [
  {
    title: "Hallway & Entrance",
    items: [
      {
        id: "ri-1-1",
        text: "Front door — check condition of door, frame, locks, handle, letterbox, and doorbell",
        tip: "Note any scratches, dents, or issues with the lock mechanism. Test the doorbell if there is one.",
      },
      {
        id: "ri-1-2",
        text: "Walls — photograph condition including any marks, scuffs, cracks, or nail holes",
      },
      {
        id: "ri-1-3",
        text: "Ceiling — check for cracks, stains, discolouration, or signs of damp",
      },
      {
        id: "ri-1-4",
        text: "Flooring — note the type (carpet, laminate, tiles) and photograph any stains, damage, or wear",
      },
      {
        id: "ri-1-5",
        text: "Light fittings and switches — test all lights and note the bulb type and condition of fittings",
      },
      {
        id: "ri-1-6",
        text: "Skirting boards and door frames — check for chips, scuffs, or damage",
      },
      {
        id: "ri-1-7",
        text: "Smoke alarm — test the alarm and note its location",
        tip: "Landlords must have a working smoke alarm on every floor. Press the test button to check it works.",
      },
      {
        id: "ri-1-8",
        text: "Fuse box — note its location and take a photo of the circuit labels",
      },
    ],
  },
  {
    title: "Living Room",
    items: [
      {
        id: "ri-2-1",
        text: "Walls — photograph all four walls noting marks, holes, cracks, or damp patches",
      },
      {
        id: "ri-2-2",
        text: "Ceiling — check for cracks, stains, or light fitting damage",
      },
      {
        id: "ri-2-3",
        text: "Windows — check glass for cracks, test opening/closing mechanism, check locks, note condition of frames and sills",
        tip: "Photograph any condensation between double-glazed panes — this indicates a failed seal and is the landlord's responsibility.",
      },
      {
        id: "ri-2-4",
        text: "Curtains or blinds — note type, colour, condition, and whether the rail or pole is secure",
      },
      {
        id: "ri-2-5",
        text: "Flooring — photograph condition including any stains, burns, or damaged areas",
      },
      {
        id: "ri-2-6",
        text: "Radiator — check it heats up evenly and note any dents, rust, or paint damage",
        tip: "If the radiator is cold at the top but warm at the bottom, it may need bleeding. Note this on the inventory.",
      },
      {
        id: "ri-2-7",
        text: "Power sockets — test each socket and note any cracked or loose faceplates",
      },
      {
        id: "ri-2-8",
        text: "Furniture provided — list and photograph each item noting its condition",
        subItems: [
          "Sofa — stains, tears, cushion condition",
          "Tables — scratches, ring marks, wobble",
          "Shelving or cabinets — scratches, alignment, doors",
          "TV stand or unit — condition and any damage",
        ],
      },
      {
        id: "ri-2-9",
        text: "Fireplace (if present) — note type and condition, check if operational",
      },
    ],
  },
  {
    title: "Kitchen",
    items: [
      {
        id: "ri-3-1",
        text: "Walls and tiles — check for cracks, grout condition, grease staining, and damage",
      },
      {
        id: "ri-3-2",
        text: "Worktops — photograph any scratches, burn marks, chips, or stains",
      },
      {
        id: "ri-3-3",
        text: "Cupboards and drawers — open every one; check doors, handles, hinges, and interior cleanliness",
        tip: "Note any sticky drawers, broken soft-close hinges, or damaged shelves.",
      },
      {
        id: "ri-3-4",
        text: "Sink and taps — check for leaks, dripping, limescale, and drainage speed",
      },
      {
        id: "ri-3-5",
        text: "Oven and hob — test all burners/elements, check grill, note cleanliness and condition",
        tip: "The oven is one of the most common sources of deposit disputes. Photograph the inside carefully.",
      },
      {
        id: "ri-3-6",
        text: "Fridge and freezer — check temperature, seals, shelves, and cleanliness",
      },
      {
        id: "ri-3-7",
        text: "Washing machine — run a quick cycle, check for leaks, and note condition of the drum and detergent drawer",
      },
      {
        id: "ri-3-8",
        text: "Dishwasher (if provided) — run a cycle, check seals, and inspect interior",
      },
      {
        id: "ri-3-9",
        text: "Extractor fan or cooker hood — test it works and note the condition of the filter",
      },
      {
        id: "ri-3-10",
        text: "Flooring — photograph condition, note any lifting tiles, stained lino, or damaged areas",
      },
      {
        id: "ri-3-11",
        text: "Under the sink — check for leaks, mould, or damage to the cabinet interior",
        tip: "This is a common spot for slow leaks that cause damage. Photograph the area clearly.",
      },
      {
        id: "ri-3-12",
        text: "Boiler (if in kitchen) — note the make, model, and location; take a photo of the service sticker",
        tip: "The landlord must provide a current Gas Safety Certificate (CP12). Check the date of the last service.",
      },
    ],
  },
  {
    title: "Bedroom",
    items: [
      {
        id: "ri-4-1",
        text: "Walls — photograph all walls noting marks, holes, cracks, or damp",
      },
      {
        id: "ri-4-2",
        text: "Ceiling — check for cracks, stains, or artex condition",
      },
      {
        id: "ri-4-3",
        text: "Windows — test opening mechanism, check locks, note condition of glass, frames, and sills",
      },
      {
        id: "ri-4-4",
        text: "Curtains or blinds — note type, colour, and condition; check rail or pole is secure",
      },
      {
        id: "ri-4-5",
        text: "Flooring — photograph condition including under furniture if possible",
      },
      {
        id: "ri-4-6",
        text: "Wardrobe — check doors, handles, rails, shelves, and interior condition",
        subItems: [
          "Sliding doors — track condition and alignment",
          "Hanging rail — securely fixed and not bowed",
          "Shelves — stable and not warped",
          "Interior — clean and free from damage",
        ],
      },
      {
        id: "ri-4-7",
        text: "Bed frame (if provided) — check for stability, scratches, and that all slats are present",
      },
      {
        id: "ri-4-8",
        text: "Mattress (if provided) — photograph both sides noting any stains, sagging, or damage",
        tip: "Mattress cleanliness can be a deposit issue. If the mattress is stained when you move in, photograph it and note it on the inventory.",
      },
      {
        id: "ri-4-9",
        text: "Chest of drawers and bedside tables — check all drawers open and close, note any damage",
      },
      {
        id: "ri-4-10",
        text: "Radiator — check it heats evenly and note condition",
      },
      {
        id: "ri-4-11",
        text: "Power sockets and light switches — test all and note any faults",
      },
      {
        id: "ri-4-12",
        text: "Door — check handle, lock, hinges, and note any damage to the door or frame",
        tip: "If the bedroom door does not have a working lock and you are in a shared house (HMO), this may be a licensing requirement.",
      },
    ],
  },
  {
    title: "Bathroom",
    items: [
      {
        id: "ri-5-1",
        text: "Walls and tiles — check for cracked or loose tiles, grout condition, and signs of mould",
        tip: "Black mould around silicone sealant is very common. Note it carefully and photograph it — it should ideally be resealed before you move in.",
      },
      {
        id: "ri-5-2",
        text: "Ceiling — check for peeling paint, mould spots, or damp stains",
      },
      {
        id: "ri-5-3",
        text: "Bath — check for chips, cracks, staining, and that the plug and chain work",
      },
      {
        id: "ri-5-4",
        text: "Shower — test water pressure and temperature, check the showerhead, hose, rail, and screen or curtain",
        tip: "Run the shower for a couple of minutes and check the water drains away properly.",
      },
      {
        id: "ri-5-5",
        text: "Toilet — flush and check it refills properly, inspect the seat, and look for any cracks in the bowl or cistern",
      },
      {
        id: "ri-5-6",
        text: "Sink and taps — check for leaks, limescale, chips, and that both hot and cold water work",
      },
      {
        id: "ri-5-7",
        text: "Sealant — check all silicone sealant around the bath, shower, and sink for mould or gaps",
        tip: "Poorly maintained sealant causes water damage to floors and walls. Note any areas where it is peeling or mouldy.",
      },
      {
        id: "ri-5-8",
        text: "Extractor fan — test it works (it should come on with the light or pull cord)",
        tip: "A working extractor fan is essential for preventing condensation and mould in the bathroom.",
      },
      {
        id: "ri-5-9",
        text: "Mirror and cabinet — note condition and check any cabinet doors and shelves",
      },
      {
        id: "ri-5-10",
        text: "Towel rail or radiator — check it heats up and note any rust or damage",
      },
      {
        id: "ri-5-11",
        text: "Flooring — check for water damage, lifting, or damaged tiles especially around the bath and toilet base",
      },
    ],
  },
  {
    title: "General & Exterior",
    items: [
      {
        id: "ri-6-1",
        text: "Carbon monoxide detector — test and note its location",
        tip: "Landlords must provide a carbon monoxide alarm in any room with a fixed combustion appliance (gas boiler, gas fire, etc.).",
      },
      {
        id: "ri-6-2",
        text: "Meter readings — photograph gas, electricity, and water meters with their readings",
      },
      {
        id: "ri-6-3",
        text: "Stopcock — locate the water shut-off valve and confirm it turns",
        tip: "Usually found under the kitchen sink or in a utility cupboard. You need to know where this is in case of a leak.",
      },
      {
        id: "ri-6-4",
        text: "Keys — count and photograph all keys provided",
        subItems: [
          "Front door",
          "Back door",
          "Window keys",
          "Mailbox",
          "Shed or garage",
          "Communal areas or fobs",
        ],
      },
      {
        id: "ri-6-5",
        text: "Garden (if applicable) — photograph the overall condition of lawn, borders, fencing, patio, and any garden furniture or tools provided",
      },
      {
        id: "ri-6-6",
        text: "Shed or garage (if applicable) — check the door, lock, roof, and contents",
      },
      {
        id: "ri-6-7",
        text: "Bins — note the number and colour of bins provided and their condition",
      },
      {
        id: "ri-6-8",
        text: "Communal areas (if a flat) — note the general condition of shared hallways, stairwells, and entryways",
      },
      {
        id: "ri-6-9",
        text: "Any instruction manuals or documents left in the property",
        tip: "Check for boiler, oven, washing machine, and alarm manuals. Note which ones are present.",
      },
      {
        id: "ri-6-10",
        text: "Sign and date the completed inventory and keep your own copy",
        tip: "If you disagree with anything on the landlord's inventory, note your amendments clearly, sign it, and send a copy back within 7 days. This protects you at the end of the tenancy.",
      },
    ],
  },
];

export default function InventoryChecklistPage() {
  return (
    <ChecklistLayout
      title="Room-by-Room Inventory Checklist"
      subtitle="Document the condition of your rental property thoroughly on move-in"
      icon={ClipboardList}
      backHref="/renters/checklists"
      backLabel="All Checklists"
      storageKey="viven-checklist-rental-inventory"
      phases={phases}
      intro={
        <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-sm text-foreground leading-relaxed">
          <strong>Why this matters:</strong> A thorough inventory is your single
          best protection against unfair deposit deductions when you move out.
          For every item, take clear photos showing the current condition and
          email them to yourself so they are timestamped. If the landlord
          provides an inventory, go through it carefully and note anything you
          disagree with in writing within 7 days. If no inventory is provided,
          this checklist serves as your own record.
        </div>
      }
    />
  );
}
