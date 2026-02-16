"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import {
  User, Heart, Users, Home, Shield, Wallet, ScrollText,
  ClipboardCheck, Calculator, Wrench, Scale,
} from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { type LucideIcon } from "lucide-react";

interface GuideItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface SituationData {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  guides: GuideItem[];
}

const SITUATIONS: Record<string, SituationData> = {
  alone: {
    title: "Renting Alone",
    description: "Solo renting guides, budgeting tips, and things to check before signing.",
    icon: User,
    color: "bg-sky-50 border-sky-100",
    guides: [
      {
        title: "Rent Affordability Calculator",
        description: "Work out how much you can realistically afford based on your income and outgoings",
        href: "/renters/calculators/rent-affordability",
        icon: Calculator,
      },
      {
        title: "Understanding Your Deposit",
        description: "Deposit protection schemes, how much to expect, and your rights",
        href: "/renters/guides/deposits",
        icon: Shield,
      },
      {
        title: "Managing Bills on Your Own",
        description: "Council tax, utilities, and budgeting tips for solo renters",
        href: "/renters/guides/bills",
        icon: Wallet,
      },
      {
        title: "Tenancy Agreements Explained",
        description: "ASTs, break clauses, and what to check before signing",
        href: "/renters/guides/tenancy-agreements",
        icon: ScrollText,
      },
      {
        title: "Viewing Checklist",
        description: "What to look for and ask when viewing a rental property",
        href: "/renters/checklists/viewing",
        icon: ClipboardCheck,
      },
      {
        title: "Renting 101",
        description: "The complete beginner guide to renting in the UK",
        href: "/renters/guides/renting-101",
        icon: Home,
      },
    ],
  },
  couple: {
    title: "Renting as a Couple",
    description: "Joint tenancies, splitting bills fairly, and what to agree before moving in together.",
    icon: Heart,
    color: "bg-rose-50 border-rose-100",
    guides: [
      {
        title: "Tenancy Agreements Explained",
        description: "Joint vs individual tenancies and what they mean for couples",
        href: "/renters/guides/tenancy-agreements",
        icon: ScrollText,
      },
      {
        title: "Bill Splitter Calculator",
        description: "Work out a fair split for rent and bills based on income",
        href: "/renters/calculators/rent-split",
        icon: Calculator,
      },
      {
        title: "Understanding Your Deposit",
        description: "Joint deposits, protection schemes, and what happens if you split up",
        href: "/renters/guides/deposits",
        icon: Shield,
      },
      {
        title: "Managing Bills Together",
        description: "How to handle council tax, utilities, and shared expenses",
        href: "/renters/guides/bills",
        icon: Wallet,
      },
      {
        title: "Moving In Checklist",
        description: "Everything you need to sort before and on moving day",
        href: "/renters/checklists/moving-in",
        icon: ClipboardCheck,
      },
    ],
  },
  friends: {
    title: "Renting with Friends / Sharers",
    description: "House shares, joint vs individual contracts, and managing shared spaces.",
    icon: Users,
    color: "bg-violet-50 border-violet-100",
    guides: [
      {
        title: "Flatshare Guide",
        description: "House rules, shared responsibilities, and making it work",
        href: "/renters/guides/flatshare-guide",
        icon: Home,
      },
      {
        title: "Tenancy Agreements for Sharers",
        description: "Joint liability, individual tenancies, and what you need to know",
        href: "/renters/guides/tenancy-agreements",
        icon: ScrollText,
      },
      {
        title: "Bill Splitter Calculator",
        description: "Fair bill splitting for housemates — by room size, income, or equal",
        href: "/renters/calculators/rent-split",
        icon: Calculator,
      },
      {
        title: "Bills Estimator",
        description: "Estimate your total monthly costs including all bills",
        href: "/renters/calculators/bills-estimator",
        icon: Wallet,
      },
      {
        title: "Inventory Checklist",
        description: "Document everything when you move in to protect your deposit",
        href: "/renters/checklists/inventory",
        icon: ClipboardCheck,
      },
      {
        title: "Your Rights as a Tenant",
        description: "Know what your landlord can and cannot do",
        href: "/renters/guides/eviction",
        icon: Scale,
      },
    ],
  },
  family: {
    title: "Renting as a Family",
    description: "Finding family-friendly areas, school catchments, and negotiating longer tenancies.",
    icon: Home,
    color: "bg-amber-50 border-amber-100",
    guides: [
      {
        title: "Rent Affordability Calculator",
        description: "Work out what your family can realistically afford",
        href: "/renters/calculators/rent-affordability",
        icon: Calculator,
      },
      {
        title: "Viewing Checklist",
        description: "Family-specific things to look for when viewing properties",
        href: "/renters/checklists/viewing",
        icon: ClipboardCheck,
      },
      {
        title: "Repairs & Maintenance",
        description: "Your rights when things need fixing — especially with children at home",
        href: "/renters/guides/repairs",
        icon: Wrench,
      },
      {
        title: "Renting with Pets",
        description: "Your rights and how to negotiate pet-friendly tenancies",
        href: "/renters/guides/renting-with-pets",
        icon: Home,
      },
      {
        title: "Understanding Your Deposit",
        description: "Protecting your deposit and getting it back when you move",
        href: "/renters/guides/deposits",
        icon: Shield,
      },
      {
        title: "End of Tenancy Guide",
        description: "Notice periods, cleaning, and getting your deposit back",
        href: "/renters/guides/end-of-tenancy",
        icon: ScrollText,
      },
    ],
  },
};

export default function RenterSituationPage() {
  const { situation } = useParams();
  const data = SITUATIONS[situation as string];

  if (!data) return notFound();

  const SituationIcon = data.icon;

  return (
    <div className="page-transition max-w-6xl mx-auto px-4 pt-12 pb-16">
      {/* Back link */}
      <Link
        href="/renters"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to renters
      </Link>

      {/* Hero */}
      <div className={`rounded-2xl border p-8 md:p-12 ${data.color}`}>
        <IconCircle icon={SituationIcon} size="lg" />
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-6">
          {data.title}
        </h1>
        <p className="text-muted text-lg mt-3 max-w-xl">
          {data.description}
        </p>
      </div>

      {/* Guides Grid */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold text-foreground mb-6">
          Guides & tools for you
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-all group"
            >
              <IconCircle icon={guide.icon} size="md" />
              <h3 className="font-heading font-semibold text-foreground mt-3">
                {guide.title}
              </h3>
              <p className="text-sm text-muted mt-1">{guide.description}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                Open <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Area Report CTA */}
      <div className="mt-12 bg-white rounded-2xl border border-border p-8 text-center">
        <h2 className="font-heading text-xl font-bold">
          Looking at a specific area?
        </h2>
        <p className="text-muted mt-2 max-w-md mx-auto">
          Get a free area report with safety scores, broadband speeds, transport
          links, and neighbourhood vibes.
        </p>
        <Link
          href="/renters"
          className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          Get Free Area Report
        </Link>
      </div>
    </div>
  );
}
