"use client";

import Link from "next/link";
import {
  GraduationCap, ListOrdered, Landmark, Search, Scale, Receipt, Key, Users,
  HandHelping, Building2, Gavel, MapPin, FileText, Shield, ClipboardCheck,
  BookOpen, ArrowRight,
} from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import { motion } from "framer-motion";

const guides = [
  { icon: GraduationCap, title: "First-Time Buyers Guide", time: "15 min", href: "/buyers/guides/first-time-buyers", color: "bg-green-50 border-green-100" },
  { icon: ListOrdered, title: "Step-by-Step Buying Process", time: "12 min", href: "/buyers/guides/process", color: "bg-blue-50 border-blue-100" },
  { icon: Landmark, title: "Mortgage Types Explained", time: "10 min", href: "/buyers/guides/mortgages", color: "bg-purple-50 border-purple-100" },
  { icon: Search, title: "Survey Types & When You Need Them", time: "8 min", href: "/buyers/guides/surveys", color: "bg-amber-50 border-amber-100" },
  { icon: Scale, title: "Conveyancing Explained", time: "8 min", href: "/buyers/guides/solicitors", color: "bg-sky-50 border-sky-100" },
  { icon: Receipt, title: "Stamp Duty Explained", time: "6 min", href: "/buyers/guides/stamp-duty-guide", color: "bg-rose-50 border-rose-100" },
  { icon: Key, title: "Exchange & Completion", time: "8 min", href: "/buyers/guides/exchange-completion", color: "bg-teal-50 border-teal-100" },
  { icon: Users, title: "Shared Ownership", time: "8 min", href: "/buyers/guides/shared-ownership", color: "bg-violet-50 border-violet-100" },
  { icon: HandHelping, title: "Help to Buy & Gov Schemes", time: "7 min", href: "/buyers/guides/help-to-buy", color: "bg-lime-50 border-lime-100" },
  { icon: Building2, title: "Buying New Builds", time: "8 min", href: "/buyers/guides/new-builds", color: "bg-orange-50 border-orange-100" },
  { icon: Gavel, title: "Buying at Auction", time: "8 min", href: "/buyers/guides/auctions", color: "bg-red-50 border-red-100" },
  { icon: MapPin, title: "Buying in London", time: "10 min", href: "/buyers/guides/buying-in-london", color: "bg-indigo-50 border-indigo-100" },
  { icon: FileText, title: "Leasehold vs Freehold", time: "8 min", href: "/buyers/guides/leasehold-vs-freehold", color: "bg-cyan-50 border-cyan-100" },
  { icon: Shield, title: "Buildings Insurance", time: "6 min", href: "/buyers/guides/buildings-insurance", color: "bg-emerald-50 border-emerald-100" },
  { icon: ClipboardCheck, title: "New Build Snagging", time: "7 min", href: "/buyers/guides/snagging", color: "bg-pink-50 border-pink-100" },
  { icon: BookOpen, title: "A-Z of Home Buying", time: "Reference", href: "/buyers/guides/a-z", color: "bg-gray-50 border-gray-200" },
];

export default function BuyerGuidesHub() {
  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-12 pb-16">
      <div className="text-center mb-10">
        <span className="text-primary font-medium text-sm uppercase tracking-wider">
          Buyer Resources
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
          Buying Guides
        </h1>
        <p className="text-muted mt-3 max-w-lg mx-auto">
          Everything you need to know about buying a home in the UK, explained in plain English.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide, i) => (
          <motion.div
            key={guide.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              href={guide.href}
              className={`block rounded-xl border p-5 hover:shadow-md transition-all h-full ${guide.color}`}
            >
              <IconCircle icon={guide.icon} size="sm" />
              <h2 className="font-heading font-semibold text-foreground mt-3 text-sm">
                {guide.title}
              </h2>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted">{guide.time}</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
