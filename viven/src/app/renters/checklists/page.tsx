"use client";

import Link from "next/link";
import { Eye, Home, LogOut, ClipboardList, ArrowRight } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import { motion } from "framer-motion";

const checklists = [
  { icon: Eye, title: "Rental Viewing", description: "Everything to check and ask at each rental viewing", href: "/renters/checklists/viewing", items: "25+ items", color: "bg-green-50 border-green-100" },
  { icon: Home, title: "Moving In", description: "Meter readings, deposit protection, setting up bills, and more", href: "/renters/checklists/moving-in", items: "20+ items", color: "bg-blue-50 border-blue-100" },
  { icon: LogOut, title: "Moving Out", description: "Clean, photograph, return keys, and get your deposit back", href: "/renters/checklists/moving-out", items: "25+ items", color: "bg-amber-50 border-amber-100" },
  { icon: ClipboardList, title: "Inventory Check", description: "Room-by-room condition record with photo prompts", href: "/renters/checklists/inventory", items: "30+ items", color: "bg-purple-50 border-purple-100" },
];

export default function RenterChecklistsHub() {
  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-12 pb-16">
      <div className="text-center mb-10">
        <span className="text-primary font-medium text-sm uppercase tracking-wider">Renter Tools</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">Checklists</h1>
        <p className="text-muted mt-3 max-w-lg mx-auto">Interactive checklists that save your progress. Tick items off as you go.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {checklists.map((cl, i) => (
          <motion.div key={cl.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link href={cl.href} className={`block rounded-2xl border p-6 hover:shadow-md transition-all h-full ${cl.color}`}>
              <IconCircle icon={cl.icon} size="lg" />
              <h2 className="font-heading font-semibold text-foreground text-lg mt-4">{cl.title}</h2>
              <p className="text-sm text-muted mt-2">{cl.description}</p>
              <p className="text-xs text-primary font-medium mt-2">{cl.items}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3">Start checklist <ArrowRight className="w-4 h-4" /></div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
