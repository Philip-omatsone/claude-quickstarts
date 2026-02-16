"use client";

import {
  TrendingUp,
  ShieldCheck,
  MapPin,
  BarChart3,
  ArrowRight,
  GraduationCap,
  Repeat,
  Eye,
} from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import { PostcodeSearch } from "@/components/PostcodeSearch";
import Link from "next/link";
import { motion } from "framer-motion";

const reportFeatures = [
  {
    icon: TrendingUp,
    title: "Price History",
    description: "Full transaction history and price trend analysis for the property and surrounding area",
  },
  {
    icon: ShieldCheck,
    title: "Risk Assessment",
    description: "Flood risk, subsidence, radon, planning applications, and ground stability checks",
  },
  {
    icon: MapPin,
    title: "Area Insights",
    description: "Crime stats, school ratings, transport links, demographics, and broadband speeds",
  },
  {
    icon: BarChart3,
    title: "Market Comparison",
    description: "How the property compares to similar recent sales, price per sq ft, and market trends",
  },
];

const buyerGuides = [
  {
    icon: GraduationCap,
    title: "I am a first time buyer",
    description: "Mortgages, surveys, solicitors, stamp duty, and everything you need to know",
    href: "/guides/buyers/first-time",
    color: "bg-blue-50 border-blue-100",
  },
  {
    icon: Repeat,
    title: "I am a non-first time buyer",
    description: "Chain management, bridging, capital gains, remortgaging, and more",
    href: "/guides/buyers/experienced",
    color: "bg-purple-50 border-purple-100",
  },
  {
    icon: Eye,
    title: "Show me all buyers content",
    description: "Browse all our buying guides, tools, and resources in one place",
    href: "/guides/buyers",
    color: "bg-amber-50 border-amber-100",
  },
];

export default function BuyersPage() {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-16">
        <div className="bg-white rounded-2xl border border-border p-8 md:p-12 shadow-sm">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Buyer Report
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 leading-tight">
                Know exactly what you&apos;re buying
              </h1>
              <p className="text-muted mt-4 text-lg leading-relaxed">
                Get a comprehensive property report that covers price history,
                risk assessment, area insights, and market comparisons — free
                during early access.
              </p>

              <div className="mt-8 space-y-4">
                {reportFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <IconCircle icon={feature.icon} size="sm" />
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-background rounded-2xl p-8 flex flex-col items-center">
              <div className="text-center mb-6">
                <span className="text-5xl font-heading font-bold text-primary">
                  Free
                </span>
                <p className="text-muted mt-1">during early access</p>
              </div>

              <PostcodeSearch variant="buyer" />

              <p className="text-xs text-muted mt-4 text-center">
                Report generated instantly. No payment required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Guides Section */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center">
          Need help demystifying buying?
        </h2>
        <p className="text-muted text-center mt-3 max-w-lg mx-auto">
          Whether you&apos;re buying your first home or your fifth, we have
          guides to help you navigate the process.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {buyerGuides.map((guide, i) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={guide.href}
                className={`block rounded-2xl border p-6 hover:shadow-md transition-all ${guide.color}`}
              >
                <IconCircle icon={guide.icon} size="lg" />
                <h3 className="font-heading font-semibold text-foreground text-lg mt-4">
                  {guide.title}
                </h3>
                <p className="text-sm text-muted mt-2">{guide.description}</p>
                <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Free Buyer Tools */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="border-t border-border pt-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Free Buyer Tools
          </h2>
          <p className="text-muted mt-2">
            Calculators, checklists, and resources to help you buy with confidence.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              {
                icon: "\uD83E\uDDEE",
                title: "Stamp Duty Calculator",
                description: "See exactly what you'll pay",
                href: "/buyers/calculators/stamp-duty",
              },
              {
                icon: "\u2705",
                title: "Buyer Checklist",
                description: "Track every step of the process",
                href: "/buyers/checklists/buying",
              },
              {
                icon: "\uD83D\uDCD6",
                title: "A-Z Glossary",
                description: "Property jargon explained",
                href: "/buyers/guides/a-z",
              },
              {
                icon: "\uD83D\uDCCA",
                title: "Market Data",
                description: "Latest prices and trends",
                href: "/buyers/market",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white rounded-xl border border-border p-5 hover:border-primary hover:shadow-sm transition-all group"
              >
                <span className="text-2xl">{tool.icon}</span>
                <h3 className="font-heading font-semibold text-foreground text-sm mt-2">
                  {tool.title}
                </h3>
                <p className="text-xs text-muted mt-1">{tool.description}</p>
                <span className="text-primary text-xs font-medium mt-2 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Open <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
