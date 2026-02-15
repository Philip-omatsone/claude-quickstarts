"use client";

import Link from "next/link";
import { ClipboardList, Eye, Truck, FileCheck, PartyPopper, ArrowRight } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import { motion } from "framer-motion";

const checklists = [
  {
    icon: ClipboardList,
    title: "First-Time Buyer",
    description: "The complete checklist from getting mortgage-ready to picking up the keys",
    href: "/buyers/checklists/first-time-buyer",
    items: "50+ items across 6 phases",
    color: "bg-green-50 border-green-100",
  },
  {
    icon: Eye,
    title: "Property Viewing",
    description: "Everything to check and ask at each viewing — take this with you",
    href: "/buyers/checklists/viewing",
    items: "30+ items",
    color: "bg-blue-50 border-blue-100",
  },
  {
    icon: Truck,
    title: "Moving Day",
    description: "Don't forget anything — from booking removals to reading meters",
    href: "/buyers/checklists/moving-day",
    items: "25+ items",
    color: "bg-amber-50 border-amber-100",
  },
  {
    icon: FileCheck,
    title: "Pre-Exchange",
    description: "Critical checks before you exchange contracts and commit",
    href: "/buyers/checklists/pre-exchange",
    items: "20+ items",
    color: "bg-purple-50 border-purple-100",
  },
  {
    icon: PartyPopper,
    title: "Completion Day",
    description: "Everything to do on the day you get the keys and the week after",
    href: "/buyers/checklists/completion",
    items: "20+ items",
    color: "bg-rose-50 border-rose-100",
  },
];

export default function BuyerChecklistsHub() {
  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-12 pb-16">
      <div className="text-center mb-10">
        <span className="text-primary font-medium text-sm uppercase tracking-wider">
          Buyer Tools
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
          Checklists
        </h1>
        <p className="text-muted mt-3 max-w-lg mx-auto">
          Interactive checklists that save your progress. Tick items off as you
          go — your progress is saved in your browser.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {checklists.map((cl, i) => (
          <motion.div
            key={cl.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={cl.href}
              className={`block rounded-2xl border p-6 hover:shadow-md transition-all h-full ${cl.color}`}
            >
              <IconCircle icon={cl.icon} size="lg" />
              <h2 className="font-heading font-semibold text-foreground text-lg mt-4">
                {cl.title}
              </h2>
              <p className="text-sm text-muted mt-2">{cl.description}</p>
              <p className="text-xs text-primary font-medium mt-2">{cl.items}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3">
                Start checklist <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
