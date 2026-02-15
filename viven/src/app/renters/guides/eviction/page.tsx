"use client";

import { AlertTriangle } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
  GuideStep,
} from "@/components/guides/GuideLayout";

export default function EvictionGuidePage() {
  return (
    <GuideLayout
      title="Know Your Eviction Rights"
      subtitle="Understanding Section 21, Section 8, the Renters Reform Bill, and what counts as illegal eviction."
      icon={AlertTriangle}
      backHref="/renters/guides"
      backLabel="All Guides"
      readTime="8 min"
      relatedLinks={[
        { label: "Tenancy Agreements Guide", href: "/renters/guides/tenancy-agreements" },
        { label: "Repairs Guide", href: "/renters/guides/repairs" },
        { label: "End of Tenancy Guide", href: "/renters/guides/end-of-tenancy" },
        { label: "Rent Increase Email Template", href: "/renters/templates/email-rent-increase" },
      ]}
    >
      <GuideSection title="Your Landlord Cannot Just Throw You Out">
        <p>
          One of the most important things to understand as a renter in England and Wales is that
          your landlord cannot simply ask you to leave and change the locks. Regardless of what your
          tenancy agreement says, your landlord must follow a strict legal process to regain
          possession of the property. Even if you are behind on rent or in breach of the tenancy
          agreement, the landlord must obtain a court order before you are legally required to leave.
        </p>
        <p>
          The legal process for eviction varies depending on the type of notice served and the
          grounds for possession. The two main routes are Section 21 (no-fault eviction) and Section
          8 (fault-based eviction) of the Housing Act 1988. Understanding the difference is crucial
          to knowing your rights.
        </p>
      </GuideSection>

      <GuideSection title="Section 21: No-Fault Eviction">
        <p>
          A Section 21 notice is sometimes called a &quot;no-fault&quot; eviction notice because the
          landlord does not need to give a reason for wanting you to leave. They simply need to serve
          the notice correctly and give you at least two months&apos; notice. The notice must be in
          writing and served using the correct prescribed form (Form 6A in England).
        </p>
        <p>
          However, a Section 21 notice is only valid if several conditions are met. The landlord
          must have protected your deposit in a government-approved scheme and provided you with the
          prescribed information. They must have provided you with a current Gas Safety Certificate,
          the government&apos;s &quot;How to Rent&quot; guide (in England), and a valid Energy
          Performance Certificate (EPC). If any of these requirements have not been met, the Section
          21 notice may be invalid.
        </p>
        <p>
          A Section 21 notice cannot be served during the first four months of the tenancy. It also
          cannot be served within six months of a relevant improvement notice or emergency remedial
          action notice being served on the landlord by the local council in relation to the property
          condition.
        </p>
        <GuideCallout type="info">
          <strong>Important:</strong> Receiving a Section 21 notice does not mean you have to leave
          immediately. The notice gives you at least two months. After the notice period expires, if
          you do not leave, the landlord must apply to the court for a possession order. The court
          process adds further time. In total, the process from notice to actual eviction can take
          several months. You should use this time to find alternative accommodation and seek advice.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Section 8: Fault-Based Eviction">
        <p>
          A Section 8 notice is served when the landlord wants to evict you for a specific reason,
          known as a &quot;ground&quot; for possession. The Housing Act 1988 sets out both mandatory
          grounds (where the court must grant possession if proved) and discretionary grounds (where
          the court can decide based on the circumstances).
        </p>
        <p>
          The most commonly used mandatory grounds include: Ground 8 (at least two months&apos; rent
          arrears at both the date of notice and the hearing), Ground 1 (the landlord used to live in
          the property and wants to return), and Ground 2 (the property is being repossessed by the
          landlord&apos;s mortgage lender). Common discretionary grounds include: Ground 10 (some
          rent is overdue), Ground 11 (persistent late payment of rent), and Ground 12 (breach of a
          tenancy term).
        </p>
        <p>
          The notice period for a Section 8 notice varies by ground. For rent arrears (Ground 8), it
          is two weeks. For most other grounds, it is two months. The notice must specify the grounds
          relied upon and provide details of why the landlord believes those grounds apply.
        </p>
      </GuideSection>

      <GuideSection title="The Renters Reform Bill">
        <p>
          The Renters (Reform) Bill, which has been progressing through Parliament, proposes the most
          significant changes to the private rented sector in decades. The headline change is the
          abolition of Section 21 no-fault evictions. Once implemented, landlords will no longer be
          able to evict tenants without giving a valid reason.
        </p>
        <p>
          Under the proposed reforms, all tenancies will become periodic from the outset, meaning
          there will be no more fixed-term tenancies. Tenants will be able to leave by giving two
          months&apos; notice at any time. Landlords will only be able to regain possession using
          reformed Section 8 grounds, which will be expanded to include situations such as the
          landlord wanting to sell the property or move in themselves.
        </p>
        <p>
          The Bill also proposes the creation of a new Private Rented Sector Ombudsman, a property
          portal where landlords must register their properties, and the right for tenants to
          request a pet (which landlords cannot unreasonably refuse). These changes have been subject
          to delays, so check the latest status to understand which provisions are currently in force.
        </p>
        <GuideCallout type="warning">
          <strong>Stay informed:</strong> The Renters Reform Bill has been amended and delayed
          multiple times. The exact implementation timeline and final provisions may differ from what
          is described here. Check the government&apos;s official guidance or organisations like
          Shelter for the latest updates before relying on these provisions.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Illegal Eviction">
        <p>
          Illegal eviction is a criminal offence under the Protection from Eviction Act 1977. Your
          landlord is committing an illegal eviction if they change the locks while you are out,
          remove your belongings, cut off utilities (gas, electricity, water) to force you to leave,
          use threats or physical violence, or enter the property and refuse to leave to make you
          feel unsafe.
        </p>
        <p>
          If you are being illegally evicted or your landlord is harassing you to leave, take the
          following steps immediately:
        </p>
        <GuideStep number={1} title="Call the Police">
          <p>
            Illegal eviction is a criminal offence. The police may be able to help you regain access
            to the property. Call 999 if you feel threatened, or 101 for non-emergency situations.
          </p>
        </GuideStep>
        <GuideStep number={2} title="Contact Your Local Council">
          <p>
            Most councils have a Tenancy Relations Officer who can intervene in illegal eviction
            cases. They can contact the landlord, help you regain access, and even prosecute the
            landlord. Find your local council&apos;s housing team online or by calling them directly.
          </p>
        </GuideStep>
        <GuideStep number={3} title="Get Legal Advice Immediately">
          <p>
            Contact Shelter&apos;s helpline (0808 800 4444), Citizens Advice, or a housing solicitor.
            You may be eligible for legal aid for illegal eviction cases. If necessary, a solicitor
            can apply for an emergency court injunction to get you back into the property and prevent
            further harassment.
          </p>
        </GuideStep>
        <GuideStep number={4} title="Document Everything">
          <p>
            Keep records of all interactions with the landlord, including text messages, emails, and
            notes of phone calls or in-person conversations. Photograph any changes to the property
            (changed locks, removed belongings). This evidence will be vital if the matter goes to
            court.
          </p>
        </GuideStep>
      </GuideSection>

      <GuideSection title="What to Do If You Receive an Eviction Notice">
        <p>
          Do not panic if you receive an eviction notice. First, check whether it is valid. An
          alarming number of eviction notices are served incorrectly, which means they may have no
          legal effect. Check that the correct form has been used, the notice period is correct, the
          landlord&apos;s details are accurate, and all required documents (Gas Safety Certificate,
          EPC, How to Rent guide) were provided during the tenancy.
        </p>
        <p>
          Seek advice as soon as possible from Citizens Advice, Shelter, or a housing solicitor. Many
          offer free initial consultations. If you are on a low income, you may qualify for legal aid.
          Even if the notice is valid, you have rights throughout the process and should not feel
          pressured into leaving before you are legally required to.
        </p>
        <p>
          If you cannot find alternative accommodation and the landlord obtains a court order, the
          actual eviction (physical removal by bailiffs) can only be carried out by county court
          bailiffs or High Court enforcement officers. The landlord cannot carry out the eviction
          themselves. You will receive at least 14 days&apos; notice of the bailiff&apos;s visit.
        </p>
        <GuideCallout type="tip">
          <strong>Free help is available:</strong> Shelter&apos;s free helpline (0808 800 4444) is
          available Monday to Friday, 8am to 8pm, and weekends 9am to 5pm. Citizens Advice offers
          free online and in-person guidance. Many local councils also have tenant support services.
          You are not alone in this situation.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
