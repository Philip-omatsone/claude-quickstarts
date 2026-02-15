"use client";

import { Mail } from "lucide-react";
import { TemplateLayout } from "@/components/templates/TemplateLayout";

const template = `Subject: Request for Tenant Reference Letter — [YOUR ADDRESS]

Dear [LANDLORD / AGENT NAME],

I hope this message finds you well. I am writing to kindly request a tenant reference letter in connection with my tenancy at the above address.

As you know, I have been a tenant at [YOUR ADDRESS] since [TENANCY START DATE]. My tenancy is due to end on [TENANCY END DATE / or "I am currently on a periodic tenancy and intend to give notice shortly"]. I am in the process of securing a new rental property and the prospective landlord/letting agent has asked me to provide a reference from my current landlord.

I would be very grateful if you could provide a brief reference letter confirming the following:

- The dates of my tenancy (from [TENANCY START DATE] to [TENANCY END DATE or present])
- That rent of [MONTHLY RENT AMOUNT] was paid on time and in full throughout the tenancy
- That the property has been kept in good condition
- That there have been no breaches of the tenancy agreement
- Any other comments you feel are appropriate regarding my conduct as a tenant

If the prospective landlord or agent would prefer to contact you directly, please let me know your preferred method of contact and I will pass on your details. Their details are as follows:

- Agent/Landlord name: [NEW AGENT / LANDLORD NAME]
- Email: [NEW AGENT / LANDLORD EMAIL]
- Phone: [NEW AGENT / LANDLORD PHONE]

I have always endeavoured to be a respectful and reliable tenant, and I hope you will be happy to confirm this. I would appreciate it if the reference could be provided within [TIMEFRAME, e.g. 7 days], as I have a deadline to meet for the new tenancy application.

Thank you very much for your time and for being a good landlord during my tenancy.

Yours sincerely,
[YOUR FULL NAME]
[YOUR ADDRESS]
[YOUR EMAIL ADDRESS]
[YOUR PHONE NUMBER]
[TODAY'S DATE]`;

export default function ReferenceLetterPage() {
  return (
    <TemplateLayout
      title="Request a Tenant Reference Letter"
      subtitle="Ask your landlord to provide a reference for your next tenancy"
      icon={Mail}
      backHref="/renters/templates"
      backLabel="All Templates"
      whenToUse="Use this template when you are applying for a new rental property and the prospective landlord or letting agent requires a reference from your current or previous landlord. Most letting agents will request at least one landlord reference as part of their tenant referencing process. Sending a polite, clear request makes it easy for your landlord to respond quickly and helps keep your application on track."
      template={template}
      warnings={[
        "Send this request as early as possible. Letting agents often work to tight deadlines, and a delayed reference can hold up your application or cause you to lose a property.",
        "If your landlord does not respond within a few days, follow up with a polite reminder. Some landlords are slow to respond to admin requests — a phone call can help speed things along.",
        "Your landlord is not legally obligated to provide a reference, but most will do so as a matter of goodwill. If they refuse, explain the situation to the new letting agent — they may accept alternative references such as an employer or accountant.",
        "If you have had any disputes with your landlord (e.g. over repairs or deposit deductions), be aware that they may mention this in a reference. A landlord must not give a misleading reference, but they are not required to be positive.",
        "Keep a copy of any reference letter you receive. You may be able to reuse it for future applications, saving time and effort.",
      ]}
    />
  );
}
