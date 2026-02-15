"use client";

import { Mail } from "lucide-react";
import { TemplateLayout } from "@/components/templates/TemplateLayout";

const template = `Subject: Repair Request — [YOUR ADDRESS]

Dear [LANDLORD NAME],

I am writing to formally request that you carry out repairs at the above property, which I rent from you under a tenancy agreement dated [TENANCY START DATE].

I wish to bring the following issue(s) to your attention:

[DESCRIBE THE ISSUE IN DETAIL — e.g. "There is persistent damp and mould growth on the bedroom wall adjacent to the exterior. The issue first appeared on [DATE ISSUE FIRST NOTICED] and has worsened despite my efforts to ventilate the room."]

As you are aware, under Section 11 of the Landlord and Tenant Act 1985, you have a statutory obligation to keep in repair and proper working order the structure and exterior of the property, as well as installations for the supply of water, gas, electricity, sanitation, and heating. I believe the issue described above falls within the scope of your repairing obligations.

I would be grateful if you could arrange for the necessary repairs to be carried out within 14 days of receiving this letter. Please let me know a convenient date and time to arrange access.

I have documented the issue with photographs and am happy to provide these on request. I would also appreciate written confirmation that you have received this correspondence and intend to address the matter.

If the repairs are not carried out within a reasonable timeframe, I may need to contact my local council's Environmental Health team or seek further advice.

Thank you for your prompt attention to this matter.

Yours sincerely,
[YOUR FULL NAME]
[YOUR ADDRESS]
[YOUR EMAIL ADDRESS]
[YOUR PHONE NUMBER]
[TODAY'S DATE]`;

export default function EmailLandlordRepairPage() {
  return (
    <TemplateLayout
      title="Request Repairs from Landlord"
      subtitle="Formally request your landlord to fix an issue they are responsible for"
      icon={Mail}
      backHref="/renters/templates"
      backLabel="All Templates"
      whenToUse="Use this template when you have reported a repair issue verbally and your landlord has not taken action, or when you want to create a formal written record of your request from the outset. Under Section 11 of the Landlord and Tenant Act 1985, your landlord is responsible for keeping the structure, exterior, and key installations (heating, water, gas, electricity, sanitation) in repair. This applies to most tenancies in England and Wales where the lease is for less than seven years."
      template={template}
      warnings={[
        "Always send this by email so you have a dated, written record. If you must send a letter, use recorded delivery and keep a copy.",
        "Take photographs or video of the issue before and after sending your request. Store these safely — they may be needed as evidence later.",
        "Give your landlord a reasonable amount of time to respond (14 days is standard for non-urgent repairs). For urgent issues like no heating or hot water in winter, a shorter timeframe is appropriate.",
        "If your landlord does not respond or refuses to carry out the repairs, contact your local council's Environmental Health department. They can inspect the property and issue an improvement notice.",
        "Do not withhold rent as a way to force repairs — this can put your tenancy at risk. Seek advice from Shelter or Citizens Advice if the situation escalates.",
      ]}
    />
  );
}
