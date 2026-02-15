"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { HousesSilhouette } from "@/components/HousesSilhouette";
import { ArrowRight, Home, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary-light/20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo size="lg" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-primary font-medium text-lg"
        >
          Your guide to smarter renting and buying
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md"
        >
          <Link
            href="/buyers"
            className="flex-1 bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <Home className="w-5 h-5" />
            For Buyers
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/renters"
            className="flex-1 bg-white text-primary border-2 border-primary px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
          >
            <Key className="w-5 h-5" />
            For Renters
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Description card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12 frosted-glass rounded-2xl p-6 border border-white/50 max-w-lg"
        >
          <p className="text-muted leading-relaxed">
            Viven gives you everything you need to make confident property
            decisions. From detailed price histories and risk assessments to
            neighbourhood insights and local amenities — all in one beautiful
            report.
          </p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            UK Government Data
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            15+ Data Sources
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Instant Reports
          </span>
        </motion.div>
      </div>

      {/* Houses silhouette */}
      <HousesSilhouette />
    </div>
  );
}
