"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";

// Static news items — in production, these would come from RSS feeds processed by Claude API
const newsItems = [
  {
    title: "Bank of England holds base rate at 4.5%",
    summary: "The Monetary Policy Committee voted 6-3 to hold rates, with three members preferring a cut. Markets now expect the first cut in Q2 2026.",
    source: "Bank of England",
    category: "Mortgage Rates",
    sentiment: "neutral",
    publishedAt: "2026-02-13",
  },
  {
    title: "UK house prices rise 3.2% annually in January",
    summary: "Nationwide reports the strongest annual growth since mid-2024, driven by improving mortgage affordability and constrained supply in the South East.",
    source: "Nationwide",
    category: "Market Trends",
    sentiment: "positive",
    publishedAt: "2026-02-01",
  },
  {
    title: "First-time buyers now need average deposit of £62,000",
    summary: "Halifax data shows the average FTB deposit has risen 8% year-on-year, with London requiring over £130,000 on average.",
    source: "Halifax",
    category: "Market Trends",
    sentiment: "negative",
    publishedAt: "2026-01-28",
  },
  {
    title: "Government launches new mortgage guarantee scheme extension",
    summary: "The 95% LTV mortgage guarantee scheme has been extended to December 2027, helping buyers with smaller deposits access the market.",
    source: "HM Treasury",
    category: "Government Policy",
    sentiment: "positive",
    publishedAt: "2026-01-22",
  },
  {
    title: "Rental reform bill passes final reading",
    summary: "The Renters' Rights Bill completes its passage through Parliament, banning Section 21 no-fault evictions and introducing a private renters' ombudsman.",
    source: "Parliament",
    category: "Government Policy",
    sentiment: "positive",
    publishedAt: "2026-01-15",
  },
  {
    title: "London house prices lag behind regional cities",
    summary: "Annual growth in Manchester (5.1%), Birmingham (4.3%), and Leeds (4.7%) continues to outpace London (2.1%) as remote working reshapes demand.",
    source: "ONS",
    category: "Regional News",
    sentiment: "neutral",
    publishedAt: "2026-01-10",
  },
  {
    title: "Fixed mortgage rates dip below 4% for first time since 2023",
    summary: "Several lenders now offer sub-4% two-year fixes at 60% LTV, signalling improved conditions for buyers with larger deposits.",
    source: "Moneyfacts",
    category: "Mortgage Rates",
    sentiment: "positive",
    publishedAt: "2026-01-05",
  },
  {
    title: "New EPC requirements delayed to 2028",
    summary: "The government has pushed back the requirement for rental properties to achieve EPC Band C, giving landlords more time to make energy efficiency improvements.",
    source: "DESNZ",
    category: "Government Policy",
    sentiment: "neutral",
    publishedAt: "2025-12-20",
  },
];

const categories = ["All", "Market Trends", "Mortgage Rates", "Government Policy", "Regional News"];

export default function MarketNewsPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? newsItems : newsItems.filter((n) => n.category === filter);

  return (
    <div className="page-transition max-w-3xl mx-auto px-4 pt-8 pb-16">
      <Link href="/buyers/market" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Market Data
      </Link>

      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
        UK Housing Market News
      </h1>
      <p className="text-muted text-sm mb-6">
        Curated updates on house prices, mortgage rates, and policy changes.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === cat ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((item, i) => (
          <article
            key={i}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.sentiment === "positive"
                        ? "bg-green-50 text-green-700"
                        : item.sentiment === "negative"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {item.sentiment === "positive" ? (
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Positive for buyers</span>
                    ) : item.sentiment === "negative" ? (
                      <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Challenging for buyers</span>
                    ) : (
                      <span className="flex items-center gap-1"><Minus className="w-3 h-3" /> Neutral</span>
                    )}
                  </span>
                </div>
                <h2 className="font-heading font-semibold text-foreground">{item.title}</h2>
                <p className="text-sm text-muted mt-1.5 leading-relaxed">{item.summary}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted">
                  <span>{item.source}</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 mt-8 text-center">
        News items are curated from public sources including Bank of England, ONS, Nationwide, Halifax, and HM Treasury.
        In production, these would be auto-aggregated from RSS feeds and summarised using AI.
      </p>
    </div>
  );
}
