"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import {
  FileText,
  Shield,
  Wallet,
  Wrench,
  Truck,
  Calculator,
  Mail,
  ClipboardCheck,
  Coins,
  ScrollText,
} from "lucide-react";

const generalGuides = [
  { icon: Shield, title: "Understanding Your Deposit", slug: "deposits", desc: "Deposit protection schemes and your rights" },
  { icon: ScrollText, title: "Tenancy Contracts Explained", slug: "tenancy-agreements", desc: "ASTs, break clauses, and what to check" },
  { icon: Wallet, title: "Managing Bills", slug: "bills", desc: "Council tax, utilities, and budgeting tips" },
  { icon: Wrench, title: "Repairs & Maintenance", slug: "repairs", desc: "Your rights and landlord responsibilities" },
  { icon: Truck, title: "Moving Out Guide", slug: "end-of-tenancy", desc: "Notice periods, inventory, and deposit return" },
  { icon: FileText, title: "Renting Rights", slug: "eviction", desc: "Know your legal rights as a tenant" },
];

const freeTools = [
  { icon: Calculator, title: "Cost Calculator", href: "/renters/calculators/bills-estimator", desc: "Calculate total monthly renting costs" },
  { icon: Coins, title: "Bill Splitter", href: "/renters/calculators/rent-split", desc: "Fair bill splitting for housemates" },
  { icon: ClipboardCheck, title: "Moving Checklist", href: "/renters/checklists/moving-in", desc: "Everything you need before moving in" },
  { icon: Mail, title: "Email Templates", href: "/renters/templates", desc: "Ready-made emails for landlords and agents" },
];

export default function RentersGuidesPage() {
  return (
    <div className="page-transition max-w-6xl mx-auto px-4 pt-12 pb-16">
      <h1 className="font-heading text-4xl font-bold text-foreground text-center">
        Renters Guides & Tools
      </h1>
      <p className="text-muted text-center mt-3 max-w-lg mx-auto">
        Free guides and tools to make renting easier, fairer, and less stressful.
      </p>

      {/* General Guides */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          Renting Guides
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generalGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/renters/guides/${guide.slug}`}
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

      {/* Free Tools */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          Free Tools
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {freeTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-primary-light rounded-2xl border border-green-200 p-5 hover:shadow-md transition-all group"
            >
              <IconCircle icon={tool.icon} size="md" />
              <h3 className="font-heading font-semibold text-foreground mt-3">
                {tool.title}
              </h3>
              <p className="text-sm text-muted mt-1">{tool.desc}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                Use tool <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
