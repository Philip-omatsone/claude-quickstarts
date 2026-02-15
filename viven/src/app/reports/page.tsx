"use client";

import {
  Check,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  MapPin,
  BarChart3,
  Zap,
  Home,
  Wifi,
  Train,
  Shield,
  Smile,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const buyerFeatures = [
  { icon: TrendingUp, label: "Full price history & valuation" },
  { icon: ShieldCheck, label: "Flood, subsidence & radon risk" },
  { icon: MapPin, label: "Crime stats & school ratings" },
  { icon: BarChart3, label: "Market comparison & trends" },
  { icon: Home, label: "EPC rating & property details" },
  { icon: Zap, label: "Planning applications" },
  { icon: Wifi, label: "Broadband speeds" },
  { icon: Train, label: "Transport & commute times" },
];

const rentalFeatures = [
  { icon: Shield, label: "Area safety score" },
  { icon: Wifi, label: "Average bills & broadband" },
  { icon: Train, label: "Commute time estimates" },
  { icon: MapPin, label: "Neighbourhood demographics" },
  { icon: Home, label: "Nearby amenities map" },
  { icon: Smile, label: "Vibe score" },
];

export default function ReportsPage() {
  return (
    <div className="page-transition">
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Reports & Tools
          </h1>
          <p className="text-muted mt-4 text-lg">
            Choose the report that fits your needs. Buyer reports are
            comprehensive and data-rich. Rental reports are completely free.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
          {/* Buyer Report */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border-2 border-primary p-8 relative shadow-lg shadow-primary/10"
          >
            <div className="absolute -top-3 left-6">
              <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>

            <h2 className="font-heading text-2xl font-bold text-foreground">
              Buyer Report
            </h2>
            <div className="mt-4">
              <span className="text-4xl font-heading font-bold text-primary">
                Free
              </span>
              <span className="text-muted ml-2">during early access</span>
            </div>
            <p className="text-muted mt-3 text-sm">
              Everything you need to make a confident buying decision.
              Replaces hours of manual research.
            </p>

            <ul className="mt-6 space-y-3">
              {buyerFeatures.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/buyers"
              className="mt-8 w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              Get Your Report
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Rental Report */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-border p-8"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Rental Report
            </h2>
            <div className="mt-4">
              <span className="text-4xl font-heading font-bold text-primary">
                Free
              </span>
            </div>
            <p className="text-muted mt-3 text-sm">
              Essential area insights for renters. No account or payment
              needed.
            </p>

            <ul className="mt-6 space-y-3">
              {rentalFeatures.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/renters"
              className="mt-8 w-full bg-white text-primary border-2 border-primary py-3 rounded-xl font-semibold hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
            >
              Get Free Report
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
