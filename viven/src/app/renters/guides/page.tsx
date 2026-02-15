"use client";

import Link from "next/link";
import { BookOpen, FileText, Shield, Wrench, AlertTriangle, Lightbulb, Dog, Users, DoorOpen, ArrowRight } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import { motion } from "framer-motion";

const guides = [
  { icon: BookOpen, title: "Renting 101", time: "12 min", href: "/renters/guides/renting-101", color: "bg-green-50 border-green-100" },
  { icon: FileText, title: "Tenancy Agreements", time: "8 min", href: "/renters/guides/tenancy-agreements", color: "bg-blue-50 border-blue-100" },
  { icon: Shield, title: "Deposits & Protection", time: "7 min", href: "/renters/guides/deposits", color: "bg-amber-50 border-amber-100" },
  { icon: Wrench, title: "Getting Repairs Done", time: "7 min", href: "/renters/guides/repairs", color: "bg-purple-50 border-purple-100" },
  { icon: AlertTriangle, title: "Eviction Rights", time: "8 min", href: "/renters/guides/eviction", color: "bg-red-50 border-red-100" },
  { icon: Lightbulb, title: "Setting Up Bills", time: "6 min", href: "/renters/guides/bills", color: "bg-sky-50 border-sky-100" },
  { icon: Dog, title: "Renting with Pets", time: "6 min", href: "/renters/guides/renting-with-pets", color: "bg-rose-50 border-rose-100" },
  { icon: Users, title: "Flatshare Guide", time: "7 min", href: "/renters/guides/flatshare-guide", color: "bg-violet-50 border-violet-100" },
  { icon: DoorOpen, title: "End of Tenancy", time: "7 min", href: "/renters/guides/end-of-tenancy", color: "bg-teal-50 border-teal-100" },
];

export default function RenterGuidesHub() {
  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-12 pb-16">
      <div className="text-center mb-10">
        <span className="text-primary font-medium text-sm uppercase tracking-wider">Renter Resources</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">Renting Guides</h1>
        <p className="text-muted mt-3 max-w-lg mx-auto">Your rights, your options, and practical advice for every stage of renting.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide, i) => (
          <motion.div key={guide.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Link href={guide.href} className={`block rounded-xl border p-5 hover:shadow-md transition-all h-full ${guide.color}`}>
              <IconCircle icon={guide.icon} size="sm" />
              <h2 className="font-heading font-semibold text-foreground mt-3 text-sm">{guide.title}</h2>
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
