"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
} from "lucide-react";

const firstTimeBuyer = [
  { icon: FileText, title: "Understanding Mortgages", slug: "mortgages", desc: "Types, rates, and how to get approved" },
  { icon: Home, title: "Property Surveys Explained", slug: "surveys", desc: "What type of survey do you need?" },
  { icon: Scale, title: "Choosing a Solicitor", slug: "solicitors", desc: "Conveyancing process and costs" },
  { icon: Stamp, title: "Stamp Duty Guide", slug: "stamp-duty", desc: "Rates, reliefs, and calculators" },
  { icon: HandHelping, title: "Help to Buy Schemes", slug: "help-to-buy", desc: "Government schemes explained" },
  { icon: Users, title: "Shared Ownership", slug: "shared-ownership", desc: "How shared ownership works" },
  { icon: Gavel, title: "Making an Offer", slug: "making-an-offer", desc: "Bidding strategies and negotiation" },
];

const experiencedBuyer = [
  { icon: Repeat, title: "Managing a Chain", slug: "chain-management", desc: "Tips for smooth chain transactions" },
  { icon: Landmark, title: "Bridging Finance", slug: "bridging-finance", desc: "Short-term lending options" },
  { icon: PiggyBank, title: "Capital Gains Tax", slug: "capital-gains", desc: "CGT on property sales" },
  { icon: ArrowDownUp, title: "Remortgaging", slug: "remortgaging", desc: "When and how to remortgage" },
  { icon: Building, title: "Downsizing", slug: "downsizing", desc: "Making the most of downsizing" },
  { icon: Home, title: "Buy-to-Let", slug: "buy-to-let", desc: "Investment property essentials" },
  { icon: Hammer, title: "Buying at Auction", slug: "auction-buying", desc: "Guide to property auctions" },
];

export default function BuyersGuidesPage() {
  return (
    <div className="page-transition max-w-6xl mx-auto px-4 pt-12 pb-16">
      <h1 className="font-heading text-4xl font-bold text-foreground text-center">
        Buyers Guides
      </h1>
      <p className="text-muted text-center mt-3 max-w-lg mx-auto">
        Everything you need to know about buying a property in the UK.
      </p>

      {/* First Time Buyers */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          First Time Buyers
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {firstTimeBuyer.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/buyers/${guide.slug}`}
              className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-all group"
            >
              <IconCircle icon={guide.icon} size="md" />
              <h3 className="font-heading font-semibold text-foreground mt-3">
                {guide.title}
              </h3>
              <p className="text-sm text-muted mt-1">{guide.desc}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                Read guide <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Experienced Buyers */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          Non-First Time Buyers
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {experiencedBuyer.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/buyers/${guide.slug}`}
              className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-all group"
            >
              <IconCircle icon={guide.icon} size="md" />
              <h3 className="font-heading font-semibold text-foreground mt-3">
                {guide.title}
              </h3>
              <p className="text-sm text-muted mt-1">{guide.desc}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                Read guide <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
