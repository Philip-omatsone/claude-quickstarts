"use client";

import Link from "next/link";
import { TrendingUp, Newspaper, ArrowRight } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";

export default function MarketHub() {
  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-12 pb-16">
      <div className="text-center mb-10">
        <span className="text-primary font-medium text-sm uppercase tracking-wider">Market Data</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">UK Housing Market</h1>
        <p className="text-muted mt-3 max-w-lg mx-auto">Track house prices and stay informed about the UK property market.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <Link href="/buyers/market/house-price-index" className="block bg-white rounded-2xl border border-border p-8 hover:shadow-md transition-all">
          <IconCircle icon={TrendingUp} size="lg" />
          <h2 className="font-heading font-semibold text-foreground text-xl mt-4">House Price Index</h2>
          <p className="text-sm text-muted mt-2">Interactive UK house price tracker with regional data and property type filters</p>
          <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">View tracker <ArrowRight className="w-4 h-4" /></div>
        </Link>
        <Link href="/buyers/market/news" className="block bg-white rounded-2xl border border-border p-8 hover:shadow-md transition-all">
          <IconCircle icon={Newspaper} size="lg" />
          <h2 className="font-heading font-semibold text-foreground text-xl mt-4">Market News</h2>
          <p className="text-sm text-muted mt-2">Curated UK housing market news, mortgage rate updates, and policy changes</p>
          <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">Read news <ArrowRight className="w-4 h-4" /></div>
        </Link>
      </div>
    </div>
  );
}
