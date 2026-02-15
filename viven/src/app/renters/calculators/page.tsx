"use client";

import Link from "next/link";
import { PiggyBank, Lightbulb, Wallet, Users, ArrowRight } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import { motion } from "framer-motion";

const calculators = [
  { icon: PiggyBank, title: "Rent Affordability", description: "How much rent can you comfortably afford based on your income?", href: "/renters/calculators/rent-affordability", color: "bg-green-50 border-green-100" },
  { icon: Lightbulb, title: "Bills Estimator", description: "Estimate your monthly household bills — council tax, energy, water, and more", href: "/renters/calculators/bills-estimator", color: "bg-amber-50 border-amber-100" },
  { icon: Wallet, title: "Deposit & Upfront Costs", description: "Calculate your total upfront costs — deposit, first month, and fees", href: "/renters/calculators/deposit-calculator", color: "bg-blue-50 border-blue-100" },
  { icon: Users, title: "Fair Rent Split", description: "Split rent fairly between housemates based on room size", href: "/renters/calculators/rent-split", color: "bg-purple-50 border-purple-100" },
];

export default function RenterCalculatorsHub() {
  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-12 pb-16">
      <div className="text-center mb-10">
        <span className="text-primary font-medium text-sm uppercase tracking-wider">Renter Tools</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">Calculators</h1>
        <p className="text-muted mt-3 max-w-lg mx-auto">Free tools to help you budget for renting. All calculations happen in your browser.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {calculators.map((calc, i) => (
          <motion.div key={calc.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link href={calc.href} className={`block rounded-2xl border p-6 hover:shadow-md transition-all h-full ${calc.color}`}>
              <IconCircle icon={calc.icon} size="lg" />
              <h2 className="font-heading font-semibold text-foreground text-lg mt-4">{calc.title}</h2>
              <p className="text-sm text-muted mt-2">{calc.description}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">Open calculator <ArrowRight className="w-4 h-4" /></div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
