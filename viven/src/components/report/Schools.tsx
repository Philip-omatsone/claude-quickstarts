"use client";

import { SchoolsResult, EnhancedSchoolInfo } from "@/lib/api/types";
import { School, Star, AlertTriangle, Sparkles, ExternalLink, Calendar } from "lucide-react";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
};

function getOfstedReportUrl(urn: string, type: string): string | null {
  if (!urn || urn === "0") return null;
  // Ofsted provider types: 21 = primary, 22 = secondary, 20 = all-through
  const providerType = type === "primary" ? 21 : type === "secondary" ? 22 : 20;
  return `https://reports.ofsted.gov.uk/provider/${providerType}/${urn}`;
}

function OfstedBadge({ rating }: { rating: string }) {
  const normalised = rating.toLowerCase().replace(/\s/g, "-");
  const config: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    outstanding: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    good: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    "requires-improvement": {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    inadequate: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
  };

  const style = config[normalised] || {
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      {rating}
    </span>
  );
}

function SchoolCard({ school }: { school: EnhancedSchoolInfo }) {
  const distanceDisplay =
    school.distanceKm < 1
      ? `${Math.round(school.distanceKm * 1000)}m`
      : `${school.distanceKm.toFixed(1)}km`;

  return (
    <div
      className={`rounded-xl border p-4 ${
        school.ofstedRating === "Outstanding"
          ? "bg-green-50/50 border-green-200"
          : "bg-white border-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              school.ofstedRating === "Outstanding"
                ? "bg-green-100"
                : school.ofstedRating === "Good"
                  ? "bg-blue-100"
                  : "bg-gray-100"
            }`}
          >
            {school.ofstedRating === "Outstanding" ? (
              <Star className="w-4 h-4 text-green-600" />
            ) : (
              <School className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div className="min-w-0">
            <h4
              className={`text-sm font-medium truncate ${
                school.ofstedRating === "Outstanding"
                  ? "text-green-800"
                  : "text-foreground"
              }`}
            >
              {school.name}
            </h4>
            <div className="flex gap-2 text-xs text-muted mt-0.5 flex-wrap">
              <span className="capitalize">{school.type}</span>
              {school.ageRange && <span>Ages {school.ageRange}</span>}
              {school.religiousCharacter && (
                <span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">
                  {school.religiousCharacter}
                </span>
              )}
              {school.numberOfPupils > 0 && (
                <span>{school.numberOfPupils.toLocaleString()} pupils</span>
              )}
            </div>
          </div>
        </div>
        <span className="text-xs text-muted shrink-0 ml-2 mt-1">
          {distanceDisplay}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <OfstedBadge rating={school.ofstedRating || "Not yet inspected"} />
        {school.lastInspectionDate && (
          <span className="flex items-center gap-1 text-[11px] text-muted">
            <Calendar className="w-3 h-3" />
            Inspected {formatDate(school.lastInspectionDate)}
          </span>
        )}
        {school.performanceSummary &&
          school.performanceSummary !== "Performance data not available" && (
            <span className="text-xs text-muted">
              {school.performanceSummary}
            </span>
          )}
      </div>

      {/* KS results detail */}
      {school.type === "primary" && school.ks2Expected !== undefined && (
        <div className="mt-2 text-xs text-muted">
          KS2: {school.ks2Expected}% meeting expected standard in reading, writing &amp; maths
        </div>
      )}
      {school.type === "secondary" && (school.progress8 !== undefined || school.attainment8 !== undefined) && (
        <div className="mt-2 text-xs text-muted space-x-3">
          {school.progress8 !== undefined && <span>Progress 8: {school.progress8.toFixed(2)}</span>}
          {school.attainment8 !== undefined && <span>Attainment 8: {school.attainment8.toFixed(1)}</span>}
          {school.grade5EnglishMaths !== undefined && <span>5+ Eng/Maths: {school.grade5EnglishMaths}%</span>}
        </div>
      )}

      {school.isOversubscribed && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700">
          <AlertTriangle className="w-3 h-3" />
          At or near capacity — check admissions criteria carefully
        </div>
      )}

      {/* Ofsted report link */}
      {school.urn && school.urn !== "0" && (() => {
        const reportUrl = getOfstedReportUrl(school.urn, school.type);
        return reportUrl ? (
          <a
            href={reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            View Ofsted report
          </a>
        ) : null;
      })()}
    </div>
  );
}

interface SchoolsProps {
  schools: SchoolsResult;
}

export function SchoolsSection({ schools }: SchoolsProps) {
  const hasSchools =
    schools.primary.length > 0 ||
    schools.secondary.length > 0 ||
    schools.allThrough.length > 0;

  return (
    <div className="space-y-6">
      {/* Summary insight */}
      {schools.summary && (
        <div className="bg-primary-light border border-primary/20 rounded-xl p-4 flex gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">{schools.summary}</p>
        </div>
      )}

      {/* Primary Schools */}
      {schools.primary.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
            Primary Schools ({schools.primary.length})
          </h3>
          <div className="space-y-2">
            {schools.primary.slice(0, 5).map((school, i) => (
              <SchoolCard key={i} school={school} />
            ))}
          </div>
        </div>
      )}

      {/* Secondary Schools */}
      {schools.secondary.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
            Secondary Schools ({schools.secondary.length})
          </h3>
          <div className="space-y-2">
            {schools.secondary.slice(0, 5).map((school, i) => (
              <SchoolCard key={i} school={school} />
            ))}
          </div>
        </div>
      )}

      {/* All-through */}
      {schools.allThrough.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
            All-Through Schools
          </h3>
          <div className="space-y-2">
            {schools.allThrough.map((school, i) => (
              <SchoolCard key={i} school={school} />
            ))}
          </div>
        </div>
      )}

      {!hasSchools && (
        <p className="text-sm text-muted text-center py-4">
          No state schools found within search radius.
        </p>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-[12px] text-amber-800 leading-relaxed">
          School proximity does not guarantee admission. Contact schools
          directly for catchment areas and admissions criteria. Ofsted ratings
          and performance data from most recent available inspection/results.
        </p>
      </div>

      {/* Source attribution */}
      <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-100">
        Source: Get Information About Schools (GIAS) &middot; Ofsted &middot;
        Department for Education school performance tables
      </div>
    </div>
  );
}
