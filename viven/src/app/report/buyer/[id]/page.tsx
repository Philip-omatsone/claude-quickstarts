"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  TrendingUp,
  ShieldCheck,
  Users,
  Train,
  Wifi,
  Wind,
  School,
  FileText,
  Download,
  Home,
  Droplets,
  Mountain,
  AlertTriangle,
  Star,
  Sparkles,
  TreePine,
  UtensilsCrossed,
  Baby,
  Moon,
  Volume2,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { BuyerReport, EnrichedComparable, SubjectProperty } from "@/lib/api/types";
import { ReportSection } from "@/components/report/ReportSection";
import { RiskBadge } from "@/components/report/RiskBadge";
import { PriceChart } from "@/components/report/PriceChart";
import { CrimeCategoryChart, CrimeTrendChart } from "@/components/report/CrimeChart";
import { PriceAnalysisSection } from "@/components/report/PriceAnalysis";
import { SchoolsSection } from "@/components/report/Schools";

// --- Helpers ---

// Safely extract a string from a value that might be an RDF literal object
// ({ _value, _datatype, _lang }) returned by the Land Registry Linked Data API
const safeStr = (val: unknown): string => {
  if (typeof val === "string") return val;
  if (val && typeof val === "object" && "_value" in (val as Record<string, unknown>))
    return String((val as Record<string, unknown>)._value);
  return String(val ?? "");
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(price);

const formatPriceShort = (price: number) => {
  if (price >= 1_000_000) return `\u00A3${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `\u00A3${Math.round(price / 1_000)}k`;
  return `\u00A3${price}`;
};

const epcColor = (rating: string) => {
  const map: Record<string, string> = {
    A: "bg-green-600", B: "bg-green-500", C: "bg-lime-500",
    D: "bg-yellow-400", E: "bg-amber-400", F: "bg-orange-500", G: "bg-red-500",
  };
  return map[rating] || "bg-gray-400";
};

const scoreColor = (score: number) =>
  score >= 75 ? "text-green-600" : score >= 50 ? "text-amber-500" : "text-red-500";

const scoreRingColor = (score: number) =>
  score >= 75 ? "stroke-green-500" : score >= 50 ? "stroke-amber-400" : "stroke-red-500";

function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        className={scoreRingColor(score)}
        strokeWidth={8} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

function VibeBar({ label, score, icon: Icon, detail }: {
  label: string;
  score: number;
  icon: React.ElementType;
  detail?: { methodology: string; dataPoints: string[] };
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-muted shrink-0" />
        <span className="text-sm text-muted w-28 shrink-0">{label}</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${score * 10}%` }}
          />
        </div>
        <span className="text-sm font-semibold w-8 text-right">{score}/10</span>
      </div>
      {detail && detail.dataPoints.length > 0 && (
        <p className="text-[11px] text-muted ml-7 mt-0.5 pl-0.5">
          {detail.dataPoints.join(" · ")}
        </p>
      )}
    </div>
  );
}

function InsightBox({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="bg-primary-light border border-primary/20 rounded-xl p-4 flex gap-3 mt-4">
      <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <p className="text-sm text-foreground">{text}</p>
    </div>
  );
}

function SourceAttribution({ sources }: { sources: string[] }) {
  return (
    <div className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100">
      Source: {sources.join(" · ")}
    </div>
  );
}

function EnrichedCompRow({ comp }: { comp: EnrichedComparable }) {
  const date = safeStr(comp.date);
  const propertyType = safeStr(comp.propertyType);
  const tenure = safeStr(comp.tenure);
  const address = safeStr(comp.address);

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0 text-sm">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{address}</p>
        <div className="flex gap-2 text-xs text-muted mt-0.5 flex-wrap">
          <span>{date ? new Date(date).toLocaleDateString("en-GB") : ""}</span>
          {propertyType && <span>{propertyType}</span>}
          {comp.bedrooms && <span>{comp.bedrooms} bed</span>}
          {comp.floorAreaSqm && (
            <span>
              {comp.floorAreaSqm} m&sup2; ({Math.round(comp.floorAreaSqm * 10.764).toLocaleString()} sqft)
            </span>
          )}
          {tenure && <span>{tenure}</span>}
        </div>
      </div>
      <div className="text-right shrink-0 ml-4">
        <p className="font-semibold">{formatPrice(comp.price)}</p>
        {comp.pricePerSqft && (
          <p className="text-xs text-muted">&pound;{comp.pricePerSqft.toLocaleString()}/sqft</p>
        )}
      </div>
    </div>
  );
}

// --- Main Component ---
export default function BuyerReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<BuyerReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(`report_${id}`);
    if (stored) {
      setReport(JSON.parse(stored));
      setLoading(false);
      return;
    }
    fetch(`/api/report/${id}`)
      .then((r) => r.json())
      .then((data) => { setReport(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold">Report not found</h1>
          <p className="text-muted mt-2">This report may have expired or doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const epc = report.propertyOverview.epc;
  const lastSale = report.propertyOverview.lastSale;
  const flood = report.riskAssessment.flood;
  const geology = report.riskAssessment.geology;
  const crime = report.areaInsights.crime;
  const schools = report.areaInsights.schools;
  const transport = report.areaInsights.transport;
  const broadband = report.areaInsights.broadband;
  const demographics = report.areaInsights.demographics;
  const airQuality = report.environmental.airQuality;
  const priceHistory = report.priceHistory;
  const planning = report.riskAssessment.planning;
  const verdict = report.verdict;
  const vibeScores = report.vibeScores;
  const insights = report.insights;
  const valuation = priceHistory?.valuation;
  const enrichedComps = priceHistory?.enrichedComparables;
  const priceAnalysis = report.priceAnalysis;
  const schoolsData = report.schoolsData;
  // Build subject property for PriceAnalysis component
  const subject: SubjectProperty | null = priceAnalysis ? {
    postcode: report.postcode,
    address: report.address,
    propertyType: safeStr(lastSale?.propertyType) || epc?.propertyType || "",
    tenure: safeStr(lastSale?.tenure) || "",
    floorArea: epc && epc.totalFloorArea > 0 ? epc.totalFloorArea : undefined,
    bedrooms: epc && epc.numberOfRooms > 0 ? epc.numberOfRooms : undefined,
    localAuthority: report.geocode.admin_district,
    latitude: report.geocode.latitude,
    longitude: report.geocode.longitude,
  } : null;
  // Use fastest default commute (London Bridge, etc.) for the header stat
  const fastestCommute = transport?.defaultCommutes?.[0];
  const commuteMin = fastestCommute?.durationMinutes ?? transport?.commuteToCenter?.[0]?.durationMinutes;
  const commuteLabel = fastestCommute?.destinationLabel;

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-8 pb-16">
      {/* ──────── HEADER ──────── */}
      <div className="bg-primary rounded-2xl p-6 md:p-8 text-white mb-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-white/70 text-sm font-medium uppercase tracking-wider">
              Buyer Report
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-bold mt-2">
              {report.address}
            </h1>
            <p className="text-white/80 mt-1">
              {report.geocode.admin_ward}, {report.geocode.admin_district},{" "}
              {report.geocode.region}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl transition-colors"
            data-print-hide
            title="Download as PDF"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 text-xs text-white/60">
          Generated {new Date(report.generatedAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric",
          })} | Report ID: {report.id}
        </div>
      </div>

      {/* ──────── ADDRESS WARNING ──────── */}
      {report.addressWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{report.addressWarning}</p>
        </div>
      )}

      {/* ──────── VIVEN VERDICT ──────── */}
      {verdict && (
        <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl font-bold">Viven Verdict</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <ScoreRing score={verdict.score} size={120} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-heading font-bold ${scoreColor(verdict.score)}`}>
                  {verdict.score}
                </span>
                <span className="text-xs text-muted">/100</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {verdict.pills.map((pill, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${
                      pill.type === "positive"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : pill.type === "negative"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    {pill.type === "positive" ? <CheckCircle2 className="w-3 h-3" /> :
                     pill.type === "negative" ? <XCircle className="w-3 h-3" /> :
                     <Info className="w-3 h-3" />}
                    {pill.label}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted leading-relaxed">{verdict.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* ──────── QUICK STATS ──────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted">Estimated Range</p>
          <p className="text-lg font-heading font-bold mt-1">
            {priceAnalysis && priceAnalysis.estimatedRange.low > 0 && priceAnalysis.estimatedRange.high > 0
              ? `${formatPriceShort(priceAnalysis.estimatedRange.low)} \u2013 ${formatPriceShort(priceAnalysis.estimatedRange.high)}`
              : valuation && valuation.rangeLow > 0 && valuation.rangeHigh > 0
              ? `${formatPriceShort(valuation.rangeLow)} \u2013 ${formatPriceShort(valuation.rangeHigh)}`
              : priceHistory && priceHistory.estimatedValueRange.high > 0
              ? `${formatPriceShort(priceHistory.estimatedValueRange.low)} \u2013 ${formatPriceShort(priceHistory.estimatedValueRange.high)}`
              : "N/A"}
          </p>
          {priceAnalysis && priceAnalysis.confidence && (
            <p className="text-[10px] text-muted mt-0.5">
              {priceAnalysis.confidence} confidence
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted">Per sq ft</p>
          <p className="text-lg font-heading font-bold mt-1">
            {priceAnalysis && priceAnalysis.weightedPsf > 0
              ? `${formatPrice(priceAnalysis.weightedPsf)}`
              : priceHistory && priceHistory.pricePerSqFt > 0
              ? `${formatPrice(priceHistory.pricePerSqFt)}`
              : "N/A"}
          </p>
          {priceAnalysis && priceAnalysis.weightedPsf > 0 && (
            <p className="text-[10px] text-muted mt-0.5">weighted from comps</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted">EPC Rating</p>
          <p className="text-lg font-heading font-bold mt-1">
            {epc ? (
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm ${epcColor(epc.currentEnergyRating)}`}>
                {epc.currentEnergyRating}
              </span>
            ) : <span className="text-sm text-muted">No EPC</span>}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted">Commute</p>
          <p className="text-lg font-heading font-bold mt-1">
            {commuteMin ? `${commuteMin} min` : "N/A"}
          </p>
          {commuteLabel && (
            <p className="text-[10px] text-muted mt-0.5">to {commuteLabel}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* ──────── 1. PROPERTY OVERVIEW ──────── */}
        <ReportSection icon={Home} title="Property Overview" subtitle="Key facts about the property">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
            {[
              { label: "Type", value: epc?.propertyType || (safeStr(lastSale?.propertyType) === "D" ? "Detached" : safeStr(lastSale?.propertyType) === "S" ? "Semi-Detached" : safeStr(lastSale?.propertyType) === "T" ? "Terraced" : safeStr(lastSale?.propertyType) === "F" ? "Flat" : "N/A") },
              { label: "Rooms", value: epc?.numberOfRooms ? String(epc.numberOfRooms) : epc === null ? "No EPC on file" : "N/A" },
              { label: "Floor Area", value: epc && epc.totalFloorArea > 0 ? `${epc.totalFloorArea} m\u00B2 (${Math.round(epc.totalFloorArea * 10.764).toLocaleString()} sqft)` : epc === null ? "No EPC on file" : "N/A" },
              { label: "Tenure", value: (() => {
                // Land Registry estateType (F/L) is authoritative; prefer it over EPC
                const lrTenure = lastSale ? safeStr(lastSale.tenure) : "";
                if (lrTenure === "F") {
                  console.log("[Tenure] Source: Land Registry Price Paid — Freehold");
                  return "Freehold";
                }
                if (lrTenure === "L") {
                  console.log("[Tenure] Source: Land Registry Price Paid — Leasehold");
                  return "Leasehold";
                }
                // Fallback: check EPC builtForm or property type hints
                if (epc?.builtForm) {
                  const form = epc.builtForm.toLowerCase();
                  if (form.includes("flat") || form.includes("maisonette")) {
                    console.log("[Tenure] Source: EPC (inferred from built form) — Leasehold");
                    return "Leasehold (from EPC)";
                  }
                }
                console.log("[Tenure] No tenure data found in Land Registry or EPC");
                return "N/A";
              })() },
              { label: "Built Form", value: epc?.builtForm || (epc === null ? "No EPC on file" : "N/A") },
              { label: "Last Sale", value: lastSale ? formatPrice(lastSale.price) : "N/A" },
              { label: "Last Sale Date", value: lastSale ? new Date(safeStr(lastSale.dateOfTransfer)).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "N/A" },
              { label: "EPC Rating", value: epc ? `${epc.currentEnergyRating} (${epc.currentEnergyEfficiency}/100)` : "No EPC on file" },
            ].map((item) => (
              <div key={item.label} className="bg-white p-3 text-center">
                <p className="text-xs text-muted">{item.label}</p>
                <p className="text-sm font-semibold mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* EPC Bar */}
          {epc && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">EPC Performance</h3>
              <div className="space-y-1.5">
                {["A", "B", "C", "D", "E", "F", "G"].map((grade) => {
                  const widths: Record<string, string> = { A: "100%", B: "86%", C: "72%", D: "58%", E: "44%", F: "30%", G: "16%" };
                  const isActive = grade === epc.currentEnergyRating;
                  return (
                    <div key={grade} className="flex items-center gap-2">
                      <span className="text-xs w-4 text-center font-medium text-muted">{grade}</span>
                      <div className="flex-1 h-5 bg-gray-50 rounded overflow-hidden relative">
                        <div
                          className={`h-full rounded ${epcColor(grade)} ${isActive ? "opacity-100" : "opacity-30"}`}
                          style={{ width: widths[grade] }}
                        />
                        {isActive && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white drop-shadow">
                            {epc.currentEnergyEfficiency}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted mt-2">
                Current: {epc.currentEnergyRating} ({epc.currentEnergyEfficiency}) | Potential: {epc.potentialEnergyRating} ({epc.potentialEnergyEfficiency})
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Official EPC rating from certificate{epc.inspectionDate ? ` lodged ${new Date(epc.inspectionDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}.{" "}
                View the full certificate at{" "}
                <a
                  href={`https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?postcode=${encodeURIComponent(report.postcode)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                >
                  find-energy-certificate.service.gov.uk
                </a>
              </p>
            </div>
          )}

          {!epc && (
            <div className="mt-4 bg-background rounded-xl p-4">
              <p className="text-muted text-sm">
                No EPC record found for this property — it may predate the EPC requirement
                or not yet have a certificate on file. All other data sources (Land Registry,
                flood risk, crime, transport, broadband) are unaffected.
                {priceHistory && priceHistory.transactions.length > 0 && (
                  <> See price history below for transaction data.</>
                )}
              </p>
            </div>
          )}

          {insights?.propertyOverview && (
            <InsightBox text={insights.propertyOverview} />
          )}

          <SourceAttribution sources={["EPC Open Data API", "Land Registry Price Paid Data"]} />
        </ReportSection>

        {/* ──────── 2. PRICE HISTORY & MARKET POSITION ──────── */}
        <ReportSection
          icon={TrendingUp}
          title="Price History & Market Position"
          subtitle="Transaction history and price analysis"
          unavailable={!priceHistory}
        >
          {priceHistory && (
            <>
              <PriceChart transactions={priceHistory.transactions} projectedValue={valuation?.estimatedValue} />

              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-xs text-muted">Area Average</p>
                  <p className="text-xl font-heading font-bold mt-1">
                    {priceHistory.areaAverage > 0 ? formatPrice(priceHistory.areaAverage) : "N/A"}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-xs text-muted">Estimated Value Range</p>
                  <p className="text-xl font-heading font-bold mt-1">
                    {formatPrice(priceHistory.estimatedValueRange.low)} &ndash; {formatPrice(priceHistory.estimatedValueRange.high)}
                  </p>
                  {priceAnalysis && priceAnalysis.midpoint > 0 ? (
                    <p className="text-[10px] text-muted mt-0.5">Midpoint: {formatPrice(priceAnalysis.midpoint)}</p>
                  ) : valuation && (
                    <p className="text-[10px] text-muted mt-0.5">Midpoint: {formatPrice(valuation.estimatedValue)}</p>
                  )}
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-xs text-muted">Transactions</p>
                  <p className="text-xl font-heading font-bold mt-1">
                    {priceHistory.transactions.length}
                  </p>
                </div>
              </div>

              {/* ── Price Analysis (new transparent model) ── */}
              {priceAnalysis && priceAnalysis.comparables.length > 0 && subject && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="text-sm font-semibold">Price Analysis</h4>
                  </div>
                  <PriceAnalysisSection analysis={priceAnalysis} subject={subject} />
                </div>
              )}

              {/* Fallback: show legacy valuation if Price Analysis not available */}
              {(!priceAnalysis || priceAnalysis.comparables.length === 0) && valuation && valuation.estimatedValue > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-semibold">Estimated Value Range</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      valuation.confidence === "High" ? "bg-green-50 text-green-700" :
                      valuation.confidence === "Medium" ? "bg-amber-50 text-amber-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {valuation.confidence === "High" ? "\u25CF Based on HPI + comparables" :
                       valuation.confidence === "Medium" ? "\u25CF Based on HPI only" :
                       "\u25CF Limited data available"}
                    </span>
                  </div>

                  {/* Range bar */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-muted">{formatPrice(valuation.rangeLow)}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
                      <div className="h-full rounded-full bg-primary/30" style={{ width: "100%" }} />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-3 bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-muted">{formatPrice(valuation.rangeHigh)}</span>
                  </div>
                  <p className="text-xs text-center text-muted mb-4">
                    Midpoint: {formatPrice(valuation.estimatedValue)}
                  </p>

                  {/* Methodology breakdown */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="text-[11px] uppercase tracking-wider text-gray-400 mb-3">
                      How we calculated this
                    </h5>
                    <div className="space-y-3">
                      {valuation.hpiAdjustedValue && (
                        <div className="pb-3 border-b border-gray-100">
                          <div className="flex justify-between items-start">
                            <span className="text-[13px] text-gray-500">Last sale price (HPI-adjusted)</span>
                            <span className="text-[15px] font-bold text-foreground">{formatPrice(valuation.hpiAdjustedValue)}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {valuation.lastSalePrice
                              ? `Sold for ${formatPrice(valuation.lastSalePrice)} in ${valuation.lastSaleDate ? new Date(valuation.lastSaleDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "N/A"}.`
                              : ""}
                            {" "}Adjusted using ONS House Price Index{valuation.region ? ` for ${valuation.region}` : ""}{valuation.propertyType ? ` (${valuation.propertyType})` : ""}.
                          </p>
                        </div>
                      )}
                      {valuation.compBasedValue && (
                        <div className="pb-3 border-b border-gray-100">
                          <div className="flex justify-between items-start">
                            <span className="text-[13px] text-gray-500">Based on comparable sales</span>
                            <span className="text-[15px] font-bold text-foreground">{formatPrice(valuation.compBasedValue)}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {valuation.medianPsf
                              ? `Median of \u00A3${valuation.medianPsf}/sqft from ${valuation.compCount || "multiple"} comparable sales`
                              : "Based on recent comparable sales in the area"}
                            {valuation.floorAreaSqft ? ` \u00D7 ${Math.round(valuation.floorAreaSqft)} sqft floor area.` : "."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Value-Add Potential */}
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-[13px] font-semibold text-green-900 mb-2">
                      Value-Add Potential
                    </p>
                    <p className="text-[12.5px] text-green-800 leading-relaxed mb-3">
                      Extensions, loft conversions, and renovations could materially increase
                      this property&apos;s value. Typical uplifts based on industry data:
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { label: "Loft conversion", pct: "10\u201315%", low: 0.10, high: 0.15 },
                        { label: "Rear extension", pct: "10\u201320%", low: 0.10, high: 0.20 },
                        { label: "Kitchen renovation", pct: "3\u20135%", low: 0.03, high: 0.05 },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between text-[12.5px]">
                          <span className="text-green-700">{item.label} ({item.pct})</span>
                          <span className="font-medium text-green-900">
                            +{formatPrice(Math.round(valuation.estimatedValue * item.low))} &ndash; {formatPrice(Math.round(valuation.estimatedValue * item.high))}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-green-600 mt-2">
                      Estimates based on estimated value of {formatPrice(valuation.estimatedValue)}. Subject to planning permission and build quality.
                    </p>
                  </div>

                  {/* Caveat — always visible */}
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-[13px] font-semibold text-amber-900 mb-1">
                      This is not a formal property valuation.
                    </p>
                    <p className="text-[12.5px] text-amber-800 leading-relaxed">
                      This estimate is based on publicly available house price index data and
                      recent comparable sales in the area. It is intended as a rough guide only
                      and should not be used for mortgage applications, investment decisions, or
                      price negotiations. For an accurate assessment, commission a RICS-qualified
                      surveyor. Actual market value depends on property condition, specification,
                      and current demand — factors this estimate cannot account for.
                    </p>
                  </div>
                </div>
              )}

              {insights?.priceHistory ? (
                <InsightBox text={insights.priceHistory} />
              ) : priceHistory.pricePerSqFt > 0 && priceHistory.areaAverage > 0 && epc && epc.totalFloorArea > 0 && (
                <InsightBox
                  text={`At ${formatPrice(priceHistory.pricePerSqFt)}/sq ft, this property ${
                    priceHistory.pricePerSqFt > Math.round(priceHistory.areaAverage / (epc.totalFloorArea * 10.764))
                      ? "sits above"
                      : "sits below"
                  } the area average. The ${epc.totalFloorArea} m\u00B2 floor area is ${
                    epc.totalFloorArea > 80 ? "above" : epc.totalFloorArea > 60 ? "around" : "below"
                  } average for the postcode.`}
                />
              )}

              {/* Enriched Comparable Sales */}
              {enrichedComps && enrichedComps.street.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                    Comparable Sales — Same Street ({enrichedComps.street.length})
                  </h3>
                  <div>
                    {enrichedComps.street.slice(0, 8).map((comp, i) => (
                      <EnrichedCompRow key={i} comp={comp} />
                    ))}
                  </div>
                </div>
              ) : priceHistory.comparableSales.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                    Comparable Sales in Area
                  </h3>
                  <div>
                    {priceHistory.comparableSales.slice(0, 5).map((sale, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium">{safeStr(sale.address)}</p>
                          <p className="text-xs text-muted">
                            {new Date(safeStr(sale.dateOfTransfer)).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                        <p className="font-semibold">{formatPrice(sale.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <SourceAttribution sources={["Land Registry Price Paid Data", "Nationwide HPI"]} />
            </>
          )}
        </ReportSection>

        {/* ──────── 3. RISK ASSESSMENT ──────── */}
        <ReportSection icon={ShieldCheck} title="Risk Assessment" subtitle="Environmental and planning risks">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold">Flood Risk</h3>
              </div>
              {flood ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center"><span className="text-muted">River & Sea</span><RiskBadge level={flood.riverAndSea} /></div>
                  <div className="flex justify-between items-center"><span className="text-muted">Surface Water</span><RiskBadge level={flood.surfaceWater} /></div>
                  <div className="flex justify-between items-center"><span className="text-muted">Flood Zone</span><span className="font-medium">Zone {flood.floodZone}</span></div>
                  <div className="flex justify-between items-center"><span className="text-muted">Reservoir</span><span className="font-medium">{flood.reservoir ? "Yes" : "No"}</span></div>
                  <p className="text-[11px] text-gray-400 pt-1">Source: Environment Agency Flood Map</p>
                </div>
              ) : <p className="text-sm text-muted">Data unavailable</p>}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold">Ground Stability</h3>
              </div>
              {geology ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center"><span className="text-muted">Subsidence</span><RiskBadge level={geology.subsidenceRisk} /></div>
                  <div className="flex justify-between items-center"><span className="text-muted">Shrink-Swell</span><span className="font-medium">{geology.shrinkSwellClass}</span></div>
                  <div className="flex justify-between items-center"><span className="text-muted">Radon</span><span className="font-medium">{geology.radonLevel}</span></div>
                  <div className="flex justify-between items-center"><span className="text-muted">Bedrock</span><span className="font-medium text-xs">{geology.bedrockType}</span></div>
                  <p className="text-[11px] text-gray-400 pt-1">Source: BGS GeoSure, UKHSA Radon Atlas</p>
                </div>
              ) : <p className="text-sm text-muted">Data unavailable</p>}
            </div>
          </div>

          {insights?.riskAssessment ? (
            <InsightBox text={insights.riskAssessment} />
          ) : flood && flood.floodZone === "1" && flood.surfaceWater !== "high" && geology?.subsidenceRisk !== "high" && (
            <InsightBox text="This property sits in Flood Zone 1 with low surface water risk and stable ground conditions — a positive sign for long-term structural integrity and insurance costs." />
          )}

          {planning.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Nearby Planning Applications ({planning.length})</h3>
              </div>
              <div className="space-y-3">
                {planning.slice(0, 5).map((app, i) => (
                  <div key={i} className="bg-background rounded-xl p-4 text-sm">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{app.description || app.reference}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                        app.status === "Approved" ? "bg-green-50 text-green-700" :
                        app.status === "Refused" ? "bg-red-50 text-red-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>{app.status}</span>
                    </div>
                    <p className="text-muted mt-1">{app.address}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">Source: PlanIt (planit.org.uk)</p>
            </div>
          )}
        </ReportSection>

        {/* ──────── 4. AREA & NEIGHBOURHOOD ──────── */}
        <ReportSection icon={MapPin} title="Area & Neighbourhood" subtitle="Crime, schools, transport, and more">
          {/* Crime */}
          {crime && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Crime Statistics</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  crime.comparisonToAverage === "below" ? "bg-green-50 text-green-700" :
                  crime.comparisonToAverage === "above" ? "bg-red-50 text-red-700" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {crime.comparisonToAverage === "below"
                    ? `Below average compared to ${crime.boroughName || "the borough"} as a whole`
                    : crime.comparisonToAverage === "above"
                    ? `Above average compared to ${crime.boroughName || "the borough"} as a whole`
                    : `Around average for ${crime.boroughName || "the borough"}`
                  }
                </span>
              </div>
              <CrimeCategoryChart crime={crime} />
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-muted uppercase mb-2">12-Month Trend</h4>
                <CrimeTrendChart crime={crime} />
              </div>
              <SourceAttribution sources={[
                "Police UK (data.police.uk)",
                crime.dateRange ? `Data covers ${crime.dateRange}` : "",
                crime.boroughName ? `Comparison: ${crime.boroughName}` : "",
              ].filter(Boolean)} />
            </div>
          )}

          {/* Schools — Enhanced version with performance data */}
          {schoolsData && (schoolsData.primary.length > 0 || schoolsData.secondary.length > 0) ? (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <School className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Local Schools</h3>
              </div>
              <SchoolsSection schools={schoolsData} />
            </div>
          ) : schools.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <School className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Nearby Schools</h3>
                <span className="text-xs text-muted">
                  (Primary within 1km, Secondary within 2km)
                </span>
              </div>
              <div className="space-y-2">
                {schools.slice(0, 10).map((school, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between py-2.5 border-b border-border last:border-0 text-sm ${
                      school.ofstedRating === "Outstanding" ? "bg-green-50/50 -mx-2 px-2 rounded-lg" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        school.ofstedRating === "Outstanding" ? "bg-green-100" :
                        school.ofstedRating === "Good" ? "bg-blue-100" : "bg-gray-100"
                      }`}>
                        {school.ofstedRating === "Outstanding"
                          ? <Star className="w-4 h-4 text-green-600" />
                          : <School className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div>
                        <p className={`font-medium ${school.ofstedRating === "Outstanding" ? "text-green-800" : ""}`}>
                          {school.name}
                        </p>
                        <p className="text-xs text-muted capitalize">
                          {school.type} | {school.distanceKm}km
                          {school.ageRange ? ` | Ages ${school.ageRange}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      school.ofstedRating === "Outstanding" ? "bg-green-50 text-green-700 font-semibold" :
                      school.ofstedRating === "Good" ? "bg-blue-50 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>{school.ofstedRating}</span>
                  </div>
                ))}
              </div>
              <SourceAttribution sources={["DfE Get Information About Schools (GIAS)"]} />
            </div>
          )}

          {/* Transport */}
          {transport && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Train className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Getting Around</h3>
              </div>

              {/* Nearest Train Stations */}
              {transport.trainStations && transport.trainStations.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-muted uppercase mb-2">Nearest Train Stations</h4>
                  <div className="space-y-2 text-sm">
                    {transport.trainStations.slice(0, 3).map((station, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{station.name}</p>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {station.lines.slice(0, 3).map((line, j) => (
                              <span key={j} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{line}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-muted">{station.distanceKm}km</span>
                          <p className="text-xs text-muted">{Math.round(station.distanceKm / 5 * 60)} min walk</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearest Underground Stations */}
              {transport.tubeStations && transport.tubeStations.length > 0 ? (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-muted uppercase mb-2">Nearest Underground</h4>
                  <div className="space-y-2 text-sm">
                    {transport.tubeStations.slice(0, 3).map((station, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{station.name}</p>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {station.lines.slice(0, 3).map((line, j) => (
                              <span key={j} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{line}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-muted">{station.distanceKm}km</span>
                          <p className="text-xs text-muted">{Math.round(station.distanceKm / 5 * 60)} min walk</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : transport.trainStations && transport.trainStations.length > 0 ? (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-muted uppercase mb-2">Nearest Underground</h4>
                  <p className="text-sm text-muted">No Underground stations within 2km</p>
                </div>
              ) : null}

              {/* Nearest Bus Stops */}
              {transport.busStops && transport.busStops.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-muted uppercase mb-2">Nearest Bus Stops</h4>
                  <div className="space-y-2 text-sm">
                    {transport.busStops.slice(0, 3).map((stop, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{stop.name}</p>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {stop.lines.slice(0, 4).map((line, j) => (
                              <span key={j} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{line}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-muted">{stop.distanceKm < 1 ? `${Math.round(stop.distanceKm * 1000)}m` : `${stop.distanceKm}km`}</span>
                          <p className="text-xs text-muted">{Math.round(stop.distanceKm / 5 * 60)} min walk</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback: show combined list if categorized data not available */}
              {!transport.trainStations && !transport.tubeStations && transport.nearestStations.length > 0 && (
                <>
                  <h4 className="text-xs font-semibold text-muted uppercase mb-2">Nearest Stations</h4>
                  <div className="space-y-2 text-sm">
                    {transport.nearestStations.slice(0, 5).map((station, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{station.name}</p>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {station.lines.slice(0, 3).map((line, j) => (
                              <span key={j} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{line}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-muted">{station.distanceKm}km</span>
                          <p className="text-xs text-muted">{Math.round(station.distanceKm / 5 * 60)} min walk</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Personalised commute */}
              {transport.personalCommute && (
                <div className="mt-5">
                  <h4 className="text-xs font-semibold text-muted uppercase mb-2">Your Commute</h4>
                  <div className="bg-primary-light rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{transport.personalCommute.destinationLabel}</p>
                          <p className="text-xs text-muted">{transport.personalCommute.mode}</p>
                        </div>
                      </div>
                      <p className="text-xl font-heading font-bold text-foreground">
                        {transport.personalCommute.durationMinutes} min
                      </p>
                    </div>
                    {transport.personalCommute.summary && (
                      <p className="text-xs text-muted mt-2 pl-6">
                        {transport.personalCommute.summary}
                      </p>
                    )}
                  </div>

                  {/* Additional destinations */}
                  {transport.additionalCommutes && transport.additionalCommutes.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {transport.additionalCommutes.map((commute, i) => (
                        <div key={i} className="flex items-center justify-between py-2 px-3 bg-background rounded-lg text-sm">
                          <span className="text-muted">{commute.destinationLabel}</span>
                          <span className="font-medium">{commute.durationMinutes} min ({commute.mode})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Default/reference commute times */}
              {transport.defaultCommutes && transport.defaultCommutes.length > 0 && (() => {
                // Use nearest train station name as "from" label (how people think about commuting)
                const nearestTrainName = transport.trainStations?.[0]?.name;
                return (
                  <div className="mt-5">
                    <h4 className="text-xs font-semibold text-muted uppercase mb-2">Reference Commute Times</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {transport.defaultCommutes.map((commute, i) => (
                        <div key={i} className="bg-background rounded-xl p-3 text-center">
                          <p className="text-xs text-muted">{commute.destinationLabel}</p>
                          <p className="text-lg font-heading font-bold mt-1">{commute.durationMinutes} min</p>
                          {(nearestTrainName || commute.fromStation) && (
                            <p className="text-[10px] text-gray-400 mt-0.5">from {nearestTrainName || commute.fromStation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Fallback: existing commute to center */}
              {!transport.personalCommute && !transport.defaultCommutes && transport.commuteToCenter.length > 0 && (
                <div className="mt-4 bg-primary-light rounded-xl p-4 flex items-center justify-between">
                  <p className="text-sm text-primary font-medium">Commute to Central London</p>
                  <p className="text-xl font-heading font-bold text-foreground">
                    ~{transport.commuteToCenter[0].durationMinutes} min
                  </p>
                </div>
              )}

              <SourceAttribution sources={["TfL Journey Planner API", "OSRM"]} />
            </div>
          )}

          {/* Broadband */}
          {broadband && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Wifi className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Broadband</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-background rounded-xl p-3">
                  <p className="text-xs text-muted">Avg Download</p>
                  <p className="text-lg font-bold mt-1">{broadband.averageDownload} <span className="text-xs font-normal text-muted">Mbps</span></p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-xs text-muted">Superfast</p>
                  <p className="text-lg font-bold mt-1">{broadband.superFastAvailability}%</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-xs text-muted">Ultrafast</p>
                  <p className="text-lg font-bold mt-1">{broadband.ultraFastAvailability}%</p>
                </div>
              </div>
              <SourceAttribution sources={["Ofcom Connected Nations"]} />
            </div>
          )}

          {/* Demographics */}
          {demographics && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Demographics</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">Deprivation Decile</span>
                  <p className="font-medium">
                    {demographics.deprivationDecile}/10
                    {demographics.deprivationDecile >= 7 && " (Less deprived)"}
                    {demographics.deprivationDecile <= 3 && " (More deprived)"}
                  </p>
                </div>
                <div>
                  <span className="text-muted">Tenure Mix</span>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      Owned {demographics.tenureMix.owned}%
                    </span>
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                      Private rent {demographics.tenureMix.privateRented}%
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      Social {demographics.tenureMix.socialRented}%
                    </span>
                  </div>
                </div>
              </div>
              <SourceAttribution sources={["ONS Census 2021", "MHCLG Index of Multiple Deprivation 2019"]} />
            </div>
          )}

          {insights?.areaNeighbourhood && (
            <InsightBox text={insights.areaNeighbourhood} />
          )}
        </ReportSection>

        {/* ──────── 5. NEIGHBOURHOOD VIBE ──────── */}
        {vibeScores && (
          <ReportSection icon={Sparkles} title="Neighbourhood Vibe" subtitle="What it feels like to live here">
            <div className="space-y-4">
              <VibeBar label="Walkability" score={vibeScores.walkability} icon={MapPin} detail={vibeScores.details?.walkability} />
              <VibeBar label="Green Space" score={vibeScores.greenSpace} icon={TreePine} detail={vibeScores.details?.greenSpace} />
              <VibeBar label="Food & Drink" score={vibeScores.foodAndDrink} icon={UtensilsCrossed} detail={vibeScores.details?.foodAndDrink} />
              <VibeBar label="Family Friendly" score={vibeScores.familyFriendly} icon={Baby} detail={vibeScores.details?.familyFriendly} />
              <VibeBar label="Nightlife" score={vibeScores.nightlife} icon={Moon} detail={vibeScores.details?.nightlife} />
              <VibeBar label="Peace & Quiet" score={vibeScores.peaceAndQuiet} icon={Volume2} detail={vibeScores.details?.peaceAndQuiet} />
            </div>
            <div className="mt-4 bg-background rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-muted">Overall Vibe Score</span>
              <span className="text-2xl font-heading font-bold text-primary">{vibeScores.overall}/10</span>
            </div>
            <SourceAttribution sources={["OpenStreetMap via Overpass API", "Police UK", "DEFRA Air Quality"]} />
          </ReportSection>
        )}

        {/* ──────── 6. ENVIRONMENTAL ──────── */}
        <ReportSection icon={Wind} title="Environmental" subtitle="Air quality and green space" unavailable={!airQuality}>
          {airQuality && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-xs text-muted">DAQI Index</p>
                  <p className="text-3xl font-heading font-bold mt-1">{airQuality.index}</p>
                  <p className={`text-sm font-medium mt-1 ${
                    airQuality.band === "Low" ? "text-green-600" :
                    airQuality.band === "Moderate" ? "text-amber-600" : "text-red-600"
                  }`}>{airQuality.band}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted">
                    Nearest monitoring station: {airQuality.nearestStation}
                  </p>
                  {airQuality.pollutants.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {airQuality.pollutants.map((p, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted">{p.name}</span>
                          <span className="font-medium">{p.value} {p.unit} ({p.band})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <SourceAttribution sources={["DEFRA Modelled Background Pollution Data"]} />
            </div>
          )}
        </ReportSection>
      </div>

      {/* ──────── RECOMMENDED READING ──────── */}
      {(() => {
        const guides: { title: string; href: string; reason: string }[] = [];
        // Leasehold property
        const lrTenure = lastSale ? safeStr(lastSale.tenure) : "";
        if (lrTenure === "L") {
          guides.push({
            title: "Understanding Leasehold",
            href: "/buyers/guides/leasehold-vs-freehold",
            reason: "This property is leasehold",
          });
        }
        // Poor EPC rating
        if (epc && ["E", "F", "G"].includes(epc.currentEnergyRating)) {
          guides.push({
            title: "Energy Efficiency Guide",
            href: "/buyers/guides/buildings-insurance",
            reason: `This property has an EPC rating of ${epc.currentEnergyRating}`,
          });
        }
        // Above-average crime
        if (crime?.comparisonToAverage === "above") {
          guides.push({
            title: "Understanding Crime Statistics",
            href: "/buyers/guides/buying-in-london",
            reason: `Crime is above average for ${crime.boroughName || "the borough"}`,
          });
        }
        // Flood risk present
        if (flood && (flood.floodZone !== "1" || flood.riverAndSea === "medium" || flood.riverAndSea === "high" || flood.surfaceWater === "medium" || flood.surfaceWater === "high")) {
          guides.push({
            title: "Flood Zone Guide",
            href: "/buyers/guides/surveys",
            reason: `This property is in Flood Zone ${flood.floodZone}`,
          });
        }
        if (guides.length === 0) return null;
        return (
          <div className="mt-8 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-lg font-bold">Recommended Reading</h2>
            </div>
            <div className="space-y-3">
              {guides.map((guide, i) => (
                <a
                  key={i}
                  href={guide.href}
                  className="flex items-center justify-between p-3 bg-background rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {guide.title}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{guide.reason}</p>
                  </div>
                  <span className="text-primary text-sm shrink-0 ml-3">&rarr;</span>
                </a>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ──────── REPORT DISCLAIMER ──────── */}
      <div className="mt-8 bg-gray-50 rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-3 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <h3 className="text-sm font-semibold text-foreground">Important</h3>
        </div>
        <div className="text-[12.5px] text-gray-600 leading-relaxed space-y-3 ml-8">
          <p>
            This report is produced by Viven for informational purposes only and does not
            constitute a property valuation, survey, environmental assessment, or legal advice.
          </p>
          <p>
            Projected property values are calculated using publicly available house price
            index data and recent comparable sales. They should not be relied upon for
            mortgage applications, investment decisions, or negotiations.
          </p>
          <p>
            Crime statistics reflect reported incidents only. Flood risk and ground stability
            assessments are indicative and based on publicly available data &mdash; they do
            not replace professional environmental searches.
          </p>
          <p>
            Before purchasing any property, we recommend commissioning a full RICS building
            survey, obtaining independent legal advice, and conducting formal local authority
            searches through your conveyancer. This report supplements &mdash; not
            replaces &mdash; professional due diligence.
          </p>
          <p className="text-gray-400">
            Data refreshed: {new Date(report.generatedAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "long", year: "numeric",
            })}. Information may have changed since this date. Viven accepts no
            liability for decisions made based on this report.
          </p>
        </div>
        <p className="text-[11px] text-gray-400 mt-4 ml-8">
          &copy; {new Date().getFullYear()} Viven. All rights reserved.
        </p>
      </div>

      {/* ──────── DATA SOURCES ──────── */}
      <div className="mt-4 text-center text-xs text-muted">
        <p>
          Data sourced from: Land Registry, EPC Open Data, Environment Agency,
          Police UK, GIAS, TfL, Ofcom, ONS, BGS, DEFRA, PlanIt, OpenStreetMap, Nationwide HPI
        </p>
      </div>
    </div>
  );
}
