"use client";

import { Mail } from "lucide-react";
import { TemplateLayout } from "@/components/templates/TemplateLayout";

const template = `Subject: Response to Proposed Rent Increase — [YOUR ADDRESS]

Dear [LANDLORD / AGENT NAME],

Thank you for your letter/email dated [DATE OF RENT INCREASE NOTICE] proposing an increase in rent for the above property.

I note that you are proposing to increase the rent from [CURRENT RENT, e.g. £1,100 per month] to [PROPOSED RENT, e.g. £1,350 per month], representing an increase of [PERCENTAGE / AMOUNT, e.g. £250 per month / 22.7%].

I do not believe this increase is reasonable, and I would like to set out my reasons below.

1. Comparable local rents: I have researched similar properties in the local area and found that comparable rents are in the range of [COMPARABLE RENT RANGE, e.g. £1,100–£1,200 per month]. I can provide listings or references to support this. The proposed rent of [PROPOSED RENT] is significantly above the market rate for a property of this type and condition.

2. Condition of the property: [OPTIONAL — DESCRIBE ANY ISSUES, e.g. "There are outstanding repairs that have not yet been addressed, including [BRIEF DESCRIPTION]. The condition of the property does not justify a rent at the top of the market."]

3. Length of tenancy: I have been a reliable tenant since [TENANCY START DATE], always paying rent on time and maintaining the property to a good standard. I would hope this is taken into account.

For periodic tenancies, Section 13 of the Housing Act 1988 requires that any rent increase must be to a reasonable market rent. If we are unable to agree on a fair increase, I have the right to refer the matter to the First-tier Tribunal (Property Chamber), which will determine what a reasonable market rent should be.

I would welcome the opportunity to discuss this with you and reach a mutually agreeable figure. I am willing to consider a modest increase that reflects current market conditions, and I propose a revised rent of [YOUR PROPOSED RENT, e.g. £1,150 per month].

Please let me know your thoughts at your earliest convenience.

Yours sincerely,
[YOUR FULL NAME]
[YOUR ADDRESS]
[YOUR EMAIL ADDRESS]
[YOUR PHONE NUMBER]
[TODAY'S DATE]`;

export default function EmailRentIncreasePage() {
  return (
    <TemplateLayout
      title="Challenge a Rent Increase"
      subtitle="Respond to an unreasonable rent increase with evidence and your rights"
      icon={Mail}
      backHref="/renters/templates"
      backLabel="All Templates"
      whenToUse="Use this template when your landlord has proposed a rent increase that you believe is above the market rate or otherwise unreasonable. This is most relevant for periodic tenancies (rolling month-to-month or week-to-week), where Section 13 of the Housing Act 1988 gives your landlord the right to propose an increase but also gives you the right to challenge it. If you are in a fixed-term tenancy, your rent can only be increased if there is a rent review clause in your tenancy agreement, or if you agree to the increase."
      template={template}
      warnings={[
        "Know your tenancy type. If you are on a fixed-term tenancy (e.g. 12 months), your landlord generally cannot increase the rent until the fixed term ends, unless there is a specific rent review clause in your agreement.",
        "For periodic tenancies, your landlord must give proper notice using a Section 13 notice (at least one month for monthly tenancies). If they have not used the correct form or given adequate notice, the increase may not be valid.",
        "Research comparable rents before responding. Use property portals such as Rightmove or Zoopla to find similar properties in your area. Screenshots or links to listings strengthen your case.",
        "If you cannot agree with your landlord, you can refer the matter to the First-tier Tribunal (Property Chamber) before the proposed increase takes effect. The tribunal will assess what a reasonable market rent is — but note that their decision is binding and the rent could be set higher or lower than the proposed amount.",
        "Do not simply stop paying rent or pay only the old amount without communicating. Keep paying the current rent while the dispute is being resolved, and keep all correspondence in writing.",
        "Seek free advice from Shelter (shelter.org.uk) or Citizens Advice (citizensadvice.org.uk) if you are unsure of your rights or need help with a tribunal application.",
      ]}
    />
  );
}
