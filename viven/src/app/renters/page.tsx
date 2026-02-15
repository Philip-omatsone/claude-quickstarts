"use client";

import {
  User,
  Heart,
  Users,
  Home,
  ArrowRight,
  BookOpen,
  Wrench,
  FileText,
  Sparkles,
} from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import { PostcodeSearch } from "@/components/PostcodeSearch";
import Link from "next/link";
import { motion } from "framer-motion";

const situations = [
  {
    icon: User,
    title: "Renting alone",
    description: "Solo renting guides, budgeting tips, and things to check before signing",
    href: "/guides/renters/alone",
    color: "bg-sky-50 border-sky-100",
  },
  {
    icon: Heart,
    title: "Renting as a couple",
    description: "Joint tenancies, splitting bills fairly, and what to agree before moving in",
    href: "/guides/renters/couple",
    color: "bg-rose-50 border-rose-100",
  },
  {
    icon: Users,
    title: "Renting with friends / sharers",
    description: "House shares, joint vs individual contracts, and managing shared spaces",
    href: "/guides/renters/friends",
    color: "bg-violet-50 border-violet-100",
  },
  {
    icon: Home,
    title: "Renting as a family",
    description: "Finding family-friendly areas, school catchments, and longer tenancies",
    href: "/guides/renters/family",
    color: "bg-amber-50 border-amber-100",
  },
];

const resourceTiles = [
  {
    icon: BookOpen,
    title: "Everything renters",
    description: "All our renting guides, tips, and resources in one place",
    href: "/guides/renters",
    color: "bg-emerald-50 border-emerald-100",
  },
  {
    icon: Wrench,
    title: "Free renting tools",
    description: "Cost calculators, bill splitters, checklists, and email templates",
    href: "/guides/renters/tools",
    color: "bg-blue-50 border-blue-100",
  },
  {
    icon: FileText,
    title: "Renting guides",
    description: "Deposits, contracts, bills, repairs, moving out, and more",
    href: "/guides/renters/guides",
    color: "bg-purple-50 border-purple-100",
  },
];

export default function RentersPage() {
  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-primary font-medium text-sm bg-primary-light px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4" />
            100% free — no account needed
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-6 leading-tight">
            How are you renting?
          </h1>
          <p className="text-muted mt-4 text-lg">
            Choose your situation to get personalised guides, or search for a
            postcode to get a free area report.
          </p>
        </div>

        {/* Situation Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {situations.map((situation, i) => (
            <motion.div
              key={situation.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={situation.href}
                className={`block rounded-2xl border p-6 hover:shadow-md transition-all h-full ${situation.color}`}
              >
                <IconCircle icon={situation.icon} size="lg" />
                <h3 className="font-heading font-semibold text-foreground mt-4">
                  {situation.title}
                </h3>
                <p className="text-sm text-muted mt-2">{situation.description}</p>
                <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Free Report Search */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border border-border p-8 md:p-12 flex flex-col items-center text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Get your free area report
          </h2>
          <p className="text-muted mt-3 max-w-md">
            Safety scores, broadband speeds, commute times, and a neighbourhood
            vibe score — completely free.
          </p>
          <div className="mt-8">
            <PostcodeSearch
              variant="rental"
              placeholder="Enter your postcode"
            />
          </div>
        </div>
      </section>

      {/* Resource Tiles */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center">
          Not sure? Start here
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {resourceTiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={tile.href}
                className={`block rounded-2xl border p-6 hover:shadow-md transition-all ${tile.color}`}
              >
                <IconCircle icon={tile.icon} size="lg" />
                <h3 className="font-heading font-semibold text-foreground text-lg mt-4">
                  {tile.title}
                </h3>
                <p className="text-sm text-muted mt-2">{tile.description}</p>
                <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                  Browse <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
