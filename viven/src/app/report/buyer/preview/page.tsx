"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  MapPin,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Zap,
  Lock,
  ArrowRight,
} from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import { GeocodeResult } from "@/lib/api/types";

function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postcode = searchParams.get("postcode") || "";
  const address = searchParams.get("address") || "";
  const [geocode, setGeocode] = useState<GeocodeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (postcode) {
      fetch(`/api/geocode?postcode=${encodeURIComponent(postcode)}`)
        .then((r) => r.json())
        .then((data) => {
          setGeocode(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [postcode]);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode, address }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">Looking up property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-8 pb-16">
      {/* Property Header */}
      <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
        <div className="flex items-start gap-3">
          <IconCircle icon={MapPin} size="lg" />
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              {address || postcode}
            </h1>
            <p className="text-muted mt-1">
              {geocode
                ? `${geocode.admin_ward}, ${geocode.admin_district}, ${geocode.region}`
                : postcode}
            </p>
          </div>
        </div>
      </div>

      {/* Preview sections (blurred/locked) */}
      <div className="space-y-4">
        {[
          {
            icon: TrendingUp,
            title: "Price History & Valuation",
            desc: "Transaction history, price trends, and estimated value range",
          },
          {
            icon: ShieldCheck,
            title: "Risk Assessment",
            desc: "Flood risk, subsidence, radon, and planning applications",
          },
          {
            icon: MapPin,
            title: "Area & Neighbourhood",
            desc: "Crime stats, schools, transport, demographics, broadband",
          },
          {
            icon: BarChart3,
            title: "Market Context",
            desc: "Comparable sales, area averages, market trends",
          },
          {
            icon: Zap,
            title: "Environmental",
            desc: "Air quality, green space, noise assessment",
          },
        ].map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-2xl border border-border p-6 relative overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <IconCircle icon={section.icon} size="md" />
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  {section.title}
                </h2>
                <p className="text-sm text-muted">{section.desc}</p>
              </div>
            </div>

            {/* Blurred preview content */}
            <div className="mt-4 filter blur-sm select-none pointer-events-none">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-100 rounded-lg h-20" />
                <div className="bg-gray-100 rounded-lg h-20" />
                <div className="bg-gray-100 rounded-lg h-20" />
              </div>
              <div className="bg-gray-100 rounded-lg h-32 mt-4" />
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent flex items-end justify-center pb-6">
              <div className="flex items-center gap-2 text-muted text-sm">
                <Lock className="w-4 h-4" />
                Unlock with full report
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 bg-primary rounded-2xl p-8 text-center text-white">
        <h2 className="font-heading text-2xl font-bold">
          Unlock the full report
        </h2>
        <p className="text-white/80 mt-2 max-w-md mx-auto">
          Get comprehensive property insights from 15+ data sources.
          Everything you need to make a confident buying decision.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {checkoutLoading ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <>
                Get Report for £9.99
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <span className="text-white/60 text-sm">
            Secure checkout with Stripe
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BuyerPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
