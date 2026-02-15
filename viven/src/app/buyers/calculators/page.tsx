"use client";

import Link from "next/link";
import { Calculator, Receipt, PiggyBank, Truck, TrendingUp, Zap, Scale, ArrowRight } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import { motion } from "framer-motion";

const calculators = [
  {
    icon: Calculator,
    title: "Mortgage Repayment",
    description: "Calculate monthly payments, total interest, and see an amortisation schedule",
    href: "/buyers/calculators/mortgage",
    color: "bg-green-50 border-green-100",
  },
  {
    icon: Receipt,
    title: "Stamp Duty (SDLT)",
    description: "Calculate your stamp duty for England, Scotland, or Wales with FTB relief",
    href: "/buyers/calculators/stamp-duty",
    color: "bg-amber-50 border-amber-100",
  },
  {
    icon: PiggyBank,
    title: "Affordability",
    description: "How much can you borrow? Income multiplier and stress test calculator",
    href: "/buyers/calculators/affordability",
    color: "bg-blue-50 border-blue-100",
  },
  {
    icon: Truck,
    title: "Total Moving Costs",
    description: "The true total cost of buying — deposit, fees, stamp duty, and everything else",
    href: "/buyers/calculators/moving-costs",
    color: "bg-purple-50 border-purple-100",
  },
  {
    icon: TrendingUp,
    title: "Equity Over Time",
    description: "Visualise how your equity grows with property appreciation and mortgage payments",
    href: "/buyers/calculators/equity-over-time",
    color: "bg-sky-50 border-sky-100",
  },
  {
    icon: Zap,
    title: "Overpayment Savings",
    description: "See how overpaying your mortgage saves thousands in interest and years off your term",
    href: "/buyers/calculators/overpayment",
    color: "bg-rose-50 border-rose-100",
  },
  {
    icon: Scale,
    title: "Rent vs Buy",
    description: "Compare the financial outcome of renting versus buying over time",
    href: "/buyers/calculators/rent-vs-buy",
    color: "bg-teal-50 border-teal-100",
  },
];

export default function BuyerCalculatorsHub() {
  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-12 pb-16">
      <div className="text-center mb-10">
        <span className="text-primary font-medium text-sm uppercase tracking-wider">
          Buyer Tools
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
          Calculators
        </h1>
        <p className="text-muted mt-3 max-w-lg mx-auto">
          Your toolkit for every financial decision in the buying process.
          All calculations happen in your browser — nothing is stored.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {calculators.map((calc, i) => (
          <motion.div
            key={calc.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={calc.href}
              className={`block rounded-2xl border p-6 hover:shadow-md transition-all h-full ${calc.color}`}
            >
              <IconCircle icon={calc.icon} size="lg" />
              <h2 className="font-heading font-semibold text-foreground text-lg mt-4">
                {calc.title}
              </h2>
              <p className="text-sm text-muted mt-2">{calc.description}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                Open calculator <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
