"use client";

import { PriceAnalysis as PriceAnalysisType, SubjectProperty } from "@/lib/api/types";
import { Info } from "lucide-react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const propertyTypeLabel = (code: string) => {
  const map: Record<string, string> = {
    D: "Detached",
    S: "Semi-Detached",
    T: "Terraced",
    F: "Flat",
  };
  return map[code] || code;
};

interface PriceAnalysisProps {
  analysis: PriceAnalysisType;
  subject: SubjectProperty;
}

export function PriceAnalysisSection({ analysis, subject }: PriceAnalysisProps) {
  if (analysis.comparables.length === 0) {
    return (
      <div className="text-sm text-muted text-center py-8">
        No comparable sales data available for price analysis.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Headline range */}
      <div className="bg-primary-light rounded-2xl p-6 text-center">
        <p className="text-xs text-muted uppercase tracking-wider mb-2">
          Estimated Value Range
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            {formatPrice(analysis.estimatedRange.low)}
          </span>
          <span className="text-lg text-muted">&ndash;</span>
          <span className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            {formatPrice(analysis.estimatedRange.high)}
          </span>
        </div>
        {analysis.weightedPsf > 0 && (
          <p className="text-sm text-muted mt-2">
            Based on {formatPrice(analysis.weightedPsf)}/sqft from comparable sales
          </p>
        )}
      </div>

      {/* Confidence indicator */}
      <div
        className={`rounded-xl p-4 border ${
          analysis.confidence === "HIGH"
            ? "bg-green-50 border-green-200"
            : analysis.confidence === "MEDIUM"
              ? "bg-amber-50 border-amber-200"
              : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-muted" />
          <span
            className={`text-sm font-semibold ${
              analysis.confidence === "HIGH"
                ? "text-green-800"
                : analysis.confidence === "MEDIUM"
                  ? "text-amber-800"
                  : "text-gray-700"
            }`}
          >
            Confidence: {analysis.confidence}
          </span>
        </div>
        <ul className="space-y-1 ml-6">
          {analysis.confidenceReasons.map((reason, i) => (
            <li key={i} className="text-xs text-muted list-disc">
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Comparable sales */}
      <div>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">
          Comparable Sales
        </h3>
        <p className="text-xs text-muted mb-4">
          Sorted by similarity to this property. Prices adjusted to current values
          using ONS House Price Index for {subject.localAuthority}.
        </p>

        <div className="space-y-3">
          {analysis.comparables.map((comp, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{comp.address}</p>
                  <div className="flex gap-2 text-xs text-muted mt-0.5 flex-wrap">
                    <span>{formatDate(comp.date)}</span>
                    <span>{propertyTypeLabel(comp.propertyType)}</span>
                    {comp.bedrooms && <span>{comp.bedrooms} bed</span>}
                    {comp.floorArea && <span>{comp.floorArea}m&sup2;</span>}
                    <span>
                      {comp.tenure === "F" ? "Freehold" : "Leasehold"}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-bold">
                    {formatPrice(comp.hpiAdjustedPrice)}
                  </p>
                  {comp.hpiAdjustedPsf && (
                    <p className="text-xs text-muted">
                      &pound;{comp.hpiAdjustedPsf.toLocaleString()}/sqft
                    </p>
                  )}
                </div>
              </div>

              {/* Similarity score bar */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted">
                    Similarity: {comp.similarityScore}/100
                  </span>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {comp.scoreBreakdown.propertyType > 0 && (
                      <span className="text-green-600">Same type</span>
                    )}
                    {comp.scoreBreakdown.bedrooms >= 12 && (
                      <span className="text-green-600">Similar beds</span>
                    )}
                    {comp.scoreBreakdown.floorArea >= 12 && (
                      <span className="text-green-600">Similar size</span>
                    )}
                    {comp.scoreBreakdown.recency >= 10 && (
                      <span className="text-green-600">Recent sale</span>
                    )}
                    {comp.scoreBreakdown.proximity >= 10 && (
                      <span className="text-green-600">Very close</span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      comp.similarityScore >= 60
                        ? "bg-primary"
                        : comp.similarityScore >= 40
                          ? "bg-amber-400"
                          : "bg-gray-400"
                    }`}
                    style={{ width: `${comp.similarityScore}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value-add potential */}
      {analysis.midpoint > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-[13px] font-semibold text-green-900 mb-2">
            Value-Add Potential
          </p>
          <p className="text-[12.5px] text-green-800 leading-relaxed mb-3">
            This analysis reflects the property in its current condition.
            Improvements could materially increase value:
          </p>
          <div className="space-y-1.5">
            {[
              {
                label: "Loft conversion",
                pct: "10\u201315%",
                low: 0.1,
                high: 0.15,
              },
              {
                label: "Rear extension",
                pct: "10\u201320%",
                low: 0.1,
                high: 0.2,
              },
              {
                label: "Kitchen renovation",
                pct: "3\u20135%",
                low: 0.03,
                high: 0.05,
              },
              {
                label: "Bathroom renovation",
                pct: "2\u20134%",
                low: 0.02,
                high: 0.04,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between text-[12.5px]"
              >
                <span className="text-green-700">
                  {item.label} ({item.pct})
                </span>
                <span className="font-medium text-green-900">
                  +{formatPrice(Math.round(analysis.midpoint * item.low))}{" "}
                  &ndash;{" "}
                  {formatPrice(Math.round(analysis.midpoint * item.high))}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-green-600 mt-2">
            These are broad estimates based on typical uplifts in{" "}
            {subject.localAuthority}. Actual impact depends on property
            specifics, planning permission, and quality of work.
          </p>
        </div>
      )}

      {/* Methodology */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-[11px] uppercase tracking-wider text-gray-400 mb-2">
          How we calculated this
        </h4>
        <p className="text-[12.5px] text-gray-600 leading-relaxed">
          {analysis.methodology}
        </p>
        <p className="text-[11px] text-gray-400 mt-3">
          This is not a formal property valuation. It is a data-driven estimate
          based on publicly available sales records. For mortgage or legal
          purposes, commission a RICS-accredited surveyor.
        </p>
      </div>
    </div>
  );
}
