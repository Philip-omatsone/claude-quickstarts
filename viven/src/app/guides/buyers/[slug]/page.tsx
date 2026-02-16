"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import {
  FileText,
  Home,
  Calculator,
  Scale,
  Stamp,
  HandHelping,
  Users,
  Gavel,
  Repeat,
  Landmark,
  PiggyBank,
  ArrowDownUp,
  Building,
  Hammer,
  GraduationCap,
  Shield,
  ClipboardCheck,
  Search,
  BarChart3,
} from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { type LucideIcon } from "lucide-react";

interface GuideItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface GuidePageData {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  guides: GuideItem[];
}

const GUIDE_PAGES: Record<string, GuidePageData> = {
  "first-time": {
    title: "First-Time Buyer Guide",
    description:
      "Everything you need to know about buying your first home — mortgages, surveys, solicitors, stamp duty, and more.",
    icon: GraduationCap,
    color: "bg-blue-50 border-blue-100",
    guides: [
      {
        title: "How much can I afford?",
        description:
          "Work out your budget based on income, deposit, and current rates",
        href: "/buyers/calculators/affordability",
        icon: Calculator,
      },
      {
        title: "Understanding Mortgages",
        description:
          "Fixed vs variable, how much to put down, and how to get approved",
        href: "/buyers/guides/mortgages",
        icon: FileText,
      },
      {
        title: "Stamp Duty Explained",
        description:
          "First-time buyer relief and how much you'll actually pay",
        href: "/buyers/calculators/stamp-duty",
        icon: Stamp,
      },
      {
        title: "The Buying Process Step by Step",
        description: "From offer to completion — what happens and when",
        href: "/buyers/guides/buying-process",
        icon: ClipboardCheck,
      },
      {
        title: "Surveys and Valuations",
        description: "Level 1, 2, or 3? What you need and what it costs",
        href: "/buyers/guides/surveys",
        icon: Search,
      },
      {
        title: "Solicitors and Conveyancing",
        description: "What they do, how to choose one, and typical costs",
        href: "/buyers/guides/conveyancing",
        icon: Scale,
      },
      {
        title: "Help to Buy Schemes",
        description: "Government schemes to help you get on the ladder",
        href: "/buyers/guides/help-to-buy",
        icon: HandHelping,
      },
      {
        title: "Get a Property Report",
        description:
          "Check any property before you commit — free during early access",
        href: "/buyers",
        icon: BarChart3,
      },
    ],
  },
  experienced: {
    title: "Non-First Time Buyer Guide",
    description:
      "Chain management, bridging finance, capital gains, remortgaging, and everything for your next move.",
    icon: Repeat,
    color: "bg-purple-50 border-purple-100",
    guides: [
      {
        title: "Managing a Chain",
        description:
          "Tips for smooth chain transactions and avoiding delays",
        href: "/buyers/guides/chain-management",
        icon: Repeat,
      },
      {
        title: "Bridging Finance",
        description: "Short-term lending options when timing doesn't align",
        href: "/buyers/guides/bridging-finance",
        icon: Landmark,
      },
      {
        title: "Capital Gains Tax",
        description: "CGT on property sales — rates, reliefs, and exemptions",
        href: "/buyers/guides/capital-gains",
        icon: PiggyBank,
      },
      {
        title: "Remortgaging",
        description: "When and how to remortgage for a better deal",
        href: "/buyers/guides/remortgaging",
        icon: ArrowDownUp,
      },
      {
        title: "Downsizing",
        description:
          "Making the most of downsizing — equity release and timing",
        href: "/buyers/guides/downsizing",
        icon: Building,
      },
      {
        title: "Buy-to-Let",
        description: "Investment property essentials — tax, yields, and rules",
        href: "/buyers/guides/buy-to-let",
        icon: Home,
      },
      {
        title: "Buying at Auction",
        description: "Guide to property auctions — risks, process, and tips",
        href: "/buyers/guides/auction-buying",
        icon: Hammer,
      },
      {
        title: "Get a Property Report",
        description:
          "Check any property before you commit — free during early access",
        href: "/buyers",
        icon: BarChart3,
      },
    ],
  },
  // Individual guide topic pages
  mortgages: {
    title: "Understanding Mortgages",
    description:
      "Types of mortgages, how to get approved, and what affects your rate.",
    icon: FileText,
    color: "bg-emerald-50 border-emerald-100",
    guides: [
      {
        title: "Mortgage Affordability Calculator",
        description: "See how much you could borrow based on your income",
        href: "/buyers/calculators/affordability",
        icon: Calculator,
      },
      {
        title: "Stamp Duty Calculator",
        description: "See exactly what you'll pay in stamp duty",
        href: "/buyers/calculators/stamp-duty",
        icon: Stamp,
      },
      {
        title: "First-Time Buyer Guide",
        description: "Complete guide for first-time buyers",
        href: "/guides/buyers/first-time",
        icon: GraduationCap,
      },
    ],
  },
  surveys: {
    title: "Property Surveys Explained",
    description:
      "What type of survey do you need? Level 1, 2, or 3 — costs, coverage, and when to get each.",
    icon: Home,
    color: "bg-amber-50 border-amber-100",
    guides: [
      {
        title: "The Buying Process",
        description: "Step-by-step guide from offer to completion",
        href: "/buyers/guides/buying-process",
        icon: ClipboardCheck,
      },
      {
        title: "Choosing a Solicitor",
        description: "Conveyancing process and costs",
        href: "/guides/buyers/solicitors",
        icon: Scale,
      },
    ],
  },
  solicitors: {
    title: "Choosing a Solicitor",
    description:
      "What conveyancers do, how to choose one, and typical costs for buying a property.",
    icon: Scale,
    color: "bg-sky-50 border-sky-100",
    guides: [
      {
        title: "The Buying Process",
        description: "Step-by-step guide from offer to completion",
        href: "/buyers/guides/buying-process",
        icon: ClipboardCheck,
      },
      {
        title: "Surveys Explained",
        description: "What type of survey do you need?",
        href: "/guides/buyers/surveys",
        icon: Home,
      },
    ],
  },
  "stamp-duty": {
    title: "Stamp Duty Guide",
    description:
      "Stamp Duty Land Tax rates, first-time buyer relief, and how much you'll pay.",
    icon: Stamp,
    color: "bg-rose-50 border-rose-100",
    guides: [
      {
        title: "Stamp Duty Calculator",
        description: "Calculate your exact stamp duty bill",
        href: "/buyers/calculators/stamp-duty",
        icon: Calculator,
      },
      {
        title: "First-Time Buyer Guide",
        description: "Complete guide including SDLT relief",
        href: "/guides/buyers/first-time",
        icon: GraduationCap,
      },
    ],
  },
  "help-to-buy": {
    title: "Help to Buy Schemes",
    description:
      "Government schemes to help you get on the property ladder — eligibility, how to apply, and alternatives.",
    icon: HandHelping,
    color: "bg-green-50 border-green-100",
    guides: [
      {
        title: "First-Time Buyer Guide",
        description: "Everything you need for your first purchase",
        href: "/guides/buyers/first-time",
        icon: GraduationCap,
      },
      {
        title: "Shared Ownership",
        description: "How shared ownership works",
        href: "/guides/buyers/shared-ownership",
        icon: Users,
      },
    ],
  },
  "shared-ownership": {
    title: "Shared Ownership",
    description:
      "How shared ownership works — eligibility, staircasing, costs, and what to watch out for.",
    icon: Users,
    color: "bg-violet-50 border-violet-100",
    guides: [
      {
        title: "Help to Buy Schemes",
        description: "Other government schemes to consider",
        href: "/guides/buyers/help-to-buy",
        icon: HandHelping,
      },
      {
        title: "Mortgage Guide",
        description: "Understanding mortgages for shared ownership",
        href: "/guides/buyers/mortgages",
        icon: FileText,
      },
    ],
  },
  "making-an-offer": {
    title: "Making an Offer",
    description:
      "Bidding strategies, negotiation tips, and what happens after your offer is accepted.",
    icon: Gavel,
    color: "bg-orange-50 border-orange-100",
    guides: [
      {
        title: "Surveys Explained",
        description: "Book a survey after your offer is accepted",
        href: "/guides/buyers/surveys",
        icon: Home,
      },
      {
        title: "Choosing a Solicitor",
        description: "You'll need a solicitor once your offer is accepted",
        href: "/guides/buyers/solicitors",
        icon: Scale,
      },
    ],
  },
  "chain-management": {
    title: "Managing a Chain",
    description:
      "Tips for navigating property chains — reducing delays, communication, and when to worry.",
    icon: Repeat,
    color: "bg-indigo-50 border-indigo-100",
    guides: [
      {
        title: "Bridging Finance",
        description: "Options when timing doesn't align",
        href: "/guides/buyers/bridging-finance",
        icon: Landmark,
      },
      {
        title: "Experienced Buyer Guide",
        description: "Full guide for non-first time buyers",
        href: "/guides/buyers/experienced",
        icon: Repeat,
      },
    ],
  },
  "bridging-finance": {
    title: "Bridging Finance",
    description:
      "Short-term lending to bridge the gap — when to use it, costs, and alternatives.",
    icon: Landmark,
    color: "bg-teal-50 border-teal-100",
    guides: [
      {
        title: "Managing a Chain",
        description: "Tips for smooth chain transactions",
        href: "/guides/buyers/chain-management",
        icon: Repeat,
      },
      {
        title: "Remortgaging",
        description: "When and how to remortgage",
        href: "/guides/buyers/remortgaging",
        icon: ArrowDownUp,
      },
    ],
  },
  "capital-gains": {
    title: "Capital Gains Tax",
    description:
      "CGT on property sales — rates, reliefs, exemptions, and how to calculate what you owe.",
    icon: PiggyBank,
    color: "bg-yellow-50 border-yellow-100",
    guides: [
      {
        title: "Buy-to-Let Guide",
        description: "Investment property tax essentials",
        href: "/guides/buyers/buy-to-let",
        icon: Home,
      },
      {
        title: "Downsizing Guide",
        description: "CGT implications when downsizing",
        href: "/guides/buyers/downsizing",
        icon: Building,
      },
    ],
  },
  remortgaging: {
    title: "Remortgaging",
    description:
      "When and how to remortgage — finding better rates, equity release, and what it costs.",
    icon: ArrowDownUp,
    color: "bg-cyan-50 border-cyan-100",
    guides: [
      {
        title: "Mortgage Guide",
        description: "Understanding mortgage types and rates",
        href: "/guides/buyers/mortgages",
        icon: FileText,
      },
      {
        title: "Experienced Buyer Guide",
        description: "Full guide for non-first time buyers",
        href: "/guides/buyers/experienced",
        icon: Repeat,
      },
    ],
  },
  downsizing: {
    title: "Downsizing",
    description:
      "Making the most of downsizing — equity release, timing your move, and financial planning.",
    icon: Building,
    color: "bg-stone-50 border-stone-200",
    guides: [
      {
        title: "Capital Gains Tax",
        description: "Tax implications when selling",
        href: "/guides/buyers/capital-gains",
        icon: PiggyBank,
      },
      {
        title: "Managing a Chain",
        description: "Navigating your property chain",
        href: "/guides/buyers/chain-management",
        icon: Repeat,
      },
    ],
  },
  "buy-to-let": {
    title: "Buy-to-Let",
    description:
      "Investment property essentials — yields, tax, landlord obligations, and finding tenants.",
    icon: Home,
    color: "bg-emerald-50 border-emerald-100",
    guides: [
      {
        title: "Capital Gains Tax",
        description: "CGT on investment property sales",
        href: "/guides/buyers/capital-gains",
        icon: PiggyBank,
      },
      {
        title: "Stamp Duty Guide",
        description: "Additional SDLT surcharge for second properties",
        href: "/guides/buyers/stamp-duty",
        icon: Stamp,
      },
    ],
  },
  "auction-buying": {
    title: "Buying at Auction",
    description:
      "Guide to property auctions — process, risks, financing, and tips for success.",
    icon: Hammer,
    color: "bg-red-50 border-red-100",
    guides: [
      {
        title: "Bridging Finance",
        description: "Auction purchases often need fast finance",
        href: "/guides/buyers/bridging-finance",
        icon: Landmark,
      },
      {
        title: "Surveys Explained",
        description: "Get a survey before auction day",
        href: "/guides/buyers/surveys",
        icon: Home,
      },
    ],
  },
};

export default function BuyerGuidePage() {
  const { slug } = useParams();
  const data = GUIDE_PAGES[slug as string];

  if (!data) return notFound();

  const GuideIcon = data.icon;

  return (
    <div className="page-transition max-w-6xl mx-auto px-4 pt-12 pb-16">
      {/* Back link */}
      <Link
        href="/guides/buyers"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to buyers guides
      </Link>

      {/* Hero */}
      <div className={`rounded-2xl border p-8 md:p-12 ${data.color}`}>
        <IconCircle icon={GuideIcon} size="lg" />
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-6">
          {data.title}
        </h1>
        <p className="text-muted text-lg mt-3 max-w-xl">{data.description}</p>
      </div>

      {/* Coming Soon notice — these dynamic pages don't have full guide content yet */}
      <div className="mt-8 bg-white rounded-2xl border border-amber-200 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-3xl">🚧</span>
          <h2 className="font-heading text-xl font-bold text-foreground">Coming Soon</h2>
          <p className="text-muted max-w-md">
            We&apos;re working on this comprehensive guide. In the meantime, explore
            the related guides below or get a free property report.
          </p>
          <Link
            href="/buyers"
            className="inline-flex items-center gap-2 mt-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
          >
            Get Free Property Report
          </Link>
        </div>
      </div>

      {/* Related Guides & Tools */}
      {data.guides.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6">
            Related guides & tools
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
      )}

      {/* Property Report CTA */}
      <div className="mt-12 bg-white rounded-2xl border border-border p-8 text-center">
        <h2 className="font-heading text-xl font-bold">
          Looking at a specific property?
        </h2>
        <p className="text-muted mt-2 max-w-md mx-auto">
          Get a free property report with price history, risk assessment,
          area insights, and market comparisons.
        </p>
        <Link
          href="/buyers"
          className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          Get Free Property Report
        </Link>
      </div>
    </div>
  );
}
