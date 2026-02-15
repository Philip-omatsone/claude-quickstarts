"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { renterTips } from "@/lib/data/tips-data";

const categories = ["All", "Viewing", "Rights", "Deposits", "Bills", "Moving", "Flatshares", "Repairs", "Budgeting"];

export default function RenterTipsPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? renterTips : renterTips.filter((t) => t.category === filter);

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-8 pb-16">
      <Link href="/renters" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> For Renters
      </Link>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 text-primary font-medium text-sm bg-primary-light px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-4 h-4" /> Viven Tips
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Renter Tips</h1>
        <p className="text-muted mt-3 max-w-lg mx-auto">Practical advice to help you rent smarter and know your rights.</p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === cat ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((tip) => (
          <div key={tip.id} className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tip.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-foreground text-sm">{tip.title}</h3>
                <p className="text-sm text-muted mt-1.5 leading-relaxed">{tip.body}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tip.category}</span>
                  {tip.link && (
                    <Link href={tip.link.href} className="text-xs text-primary font-medium flex items-center gap-1 hover:text-primary-dark">
                      {tip.link.label} <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted py-12">No tips in this category yet.</p>}
    </div>
  );
}
