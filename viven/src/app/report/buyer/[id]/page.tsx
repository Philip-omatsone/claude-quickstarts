"use client";

import { useEffect, useState, useCallback } from "react";
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
  Share2,
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
  Loader2,
} from "lucide-react";
import { BuyerReport, EnrichedComparable } from "@/lib/api/types";
import { ReportSection } from "@/components/report/ReportSection";
import { RiskBadge } from "@/components/report/RiskBadge";
import { PriceChart } from "@/components/report/PriceChart";
import { CrimeCategoryChart, CrimeTrendChart } from "@/components/report/CrimeChart";
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

function isRecentTransaction(dateStr: string): boolean {
  if (!dateStr) return false;
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  return new Date(dateStr) >= sixMonthsAgo;
}

function getTransactionAgeBadge(dateStr: string): { label: string; className: string } | null {
  if (!dateStr) return null;
  const txnDate = new Date(dateStr);
  const now = new Date();
  const monthsAgo = (now.getTime() - txnDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000);

  if (monthsAgo < 6) return { label: "Recent", className: "bg-green-100 text-green-700" };
  if (monthsAgo < 12) return null;
  if (monthsAgo < 24) {
    const years = Math.round(monthsAgo / 12);
    return { label: `${years}yr ago`, className: "bg-gray-100 text-gray-600" };
  }
  return { label: "Dated", className: "bg-amber-100 text-amber-700" };
}

function EnrichedCompRow({ comp }: { comp: EnrichedComparable }) {
  const date = safeStr(comp.date);
  const propertyType = safeStr(comp.propertyType);
  const tenure = safeStr(comp.tenure);
  const address = safeStr(comp.address);
  const ageBadge = getTransactionAgeBadge(date);
  const recent = isRecentTransaction(date);

  return (
    <div className={`flex items-center justify-between py-2.5 border-b border-border last:border-0 text-sm ${recent ? "bg-green-50/50 -mx-2 px-2 rounded-lg" : ""}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{address}</p>
          {ageBadge && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${ageBadge.className}`}>{ageBadge.label}</span>
          )}
        </div>
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

function PricePerSqftChart({ comps, subjectPsf, adjustedPsf }: {
  comps: EnrichedComparable[];
  subjectPsf: number | null;
  adjustedPsf?: number | null;
}) {
  const withPsf = comps.filter((c) => c.pricePerSqft && c.pricePerSqft > 0);
  if (withPsf.length < 2) return null;

  // Use adjusted psf if available, otherwise raw psf
  const displayPsf = adjustedPsf && adjustedPsf > 0 ? adjustedPsf : subjectPsf;
  const allValues = withPsf.map((c) => c.pricePerSqft!);
  if (displayPsf && displayPsf > 0) allValues.push(displayPsf);
  const maxVal = Math.max(...allValues);

  return (
    <div className="mt-4">
      <h4 className="text-xs font-semibold text-muted uppercase mb-3">Price per sq ft comparison</h4>
      <div className="space-y-1.5">
        {displayPsf && displayPsf > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary font-semibold w-28 text-right shrink-0 truncate">
              This property{adjustedPsf && adjustedPsf > 0 ? " (adj.)" : ""}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(displayPsf / maxVal) * 100}%` }} />
            </div>
            <span className="text-xs font-bold text-primary w-20 text-right shrink-0">&pound;{displayPsf.toLocaleString()}/sqft</span>
          </div>
        )}
        {withPsf.slice(0, 6).map((comp, i) => {
          const ageBadge = getTransactionAgeBadge(safeStr(comp.date));
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-muted w-28 text-right shrink-0 truncate">{safeStr(comp.address).split(",")[0]}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full ${isRecentTransaction(safeStr(comp.date)) ? "bg-green-400" : ageBadge?.label === "Dated" ? "bg-amber-300" : "bg-gray-400"}`}
                  style={{ width: `${(comp.pricePerSqft! / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted w-20 text-right shrink-0">&pound;{comp.pricePerSqft!.toLocaleString()}/sqft</span>
            </div>
          );
        })}
      </div>
      {adjustedPsf && adjustedPsf > 0 && subjectPsf && subjectPsf > 0 && adjustedPsf !== subjectPsf && (
        <p className="text-[11px] text-muted mt-2 italic">
          &ldquo;This property (adj.)&rdquo; reflects the HPI-adjusted £/sqft — the original {formatPrice(subjectPsf)}/sqft at last sale, adjusted for regional house price growth to today&apos;s equivalent.
        </p>
      )}
    </div>
  );
}

// --- Main Component ---
export default function BuyerReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<BuyerReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const generatePdf = useCallback(async () => {
    if (!report || generatingPdf) return;
    setGeneratingPdf(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const reportEl = document.getElementById("viven-report");
      if (!reportEl) return;

      // Hide print-only elements
      const hideEls = reportEl.querySelectorAll("[data-print-hide]");
      hideEls.forEach((el) => (el as HTMLElement).style.display = "none");

      const canvas = await html2canvas(reportEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FAFAF5",
      });

      hideEls.forEach((el) => (el as HTMLElement).style.display = "");

      const imgWidth = 210; // A4 width mm
      const pageHeight = 297; // A4 height mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF("p", "mm", "a4");

      // Cover page
      pdf.setFillColor(34, 87, 64); // Viven green
      pdf.rect(0, 0, 210, 297, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(32);
      pdf.text("Viven", 105, 100, { align: "center" });
      pdf.setFontSize(14);
      pdf.text("Buyer Report", 105, 115, { align: "center" });
      pdf.setFontSize(18);
      pdf.text(report.address, 105, 145, { align: "center", maxWidth: 160 });
      pdf.setFontSize(11);
      pdf.text(
        `Generated ${new Date(report.generatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
        105, 165, { align: "center" }
      );
      if (report.verdict) {
        pdf.setFontSize(48);
        pdf.text(`${report.verdict.score}`, 105, 210, { align: "center" });
        pdf.setFontSize(12);
        pdf.text("/100 Viven Verdict", 105, 222, { align: "center" });
      }
      pdf.setFontSize(9);
      pdf.setTextColor(200, 200, 200);
      pdf.text("Generated by Viven | viven.co.uk", 105, 280, { align: "center" });

      // Content pages
      let heightLeft = imgHeight;
      let position = 0;
      const pageMargin = 8;
      const contentHeight = pageHeight - pageMargin * 2 - 10; // Leave room for footer

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      let pageNum = 2;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, pageMargin - position, imgWidth, imgHeight);

        // Footer on each page
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${pageNum}`, 105, 290, { align: "center" });
        pdf.text("Generated by Viven | viven.co.uk", 105, 294, { align: "center" });

        heightLeft -= contentHeight;
        position += contentHeight;
        pageNum++;
      }

      // Save
      const cleanAddress = report.address.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 50);
      pdf.save(`Viven_Report_${cleanAddress}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      // Fallback to window.print()
      window.print();
    } finally {
      setGeneratingPdf(false);
    }
  }, [report, generatingPdf]);

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
  const enrichedComps = priceHistory?.enrichedComparables;
  const schoolsData = report.schoolsData;
  // Use fastest default commute (London Bridge, etc.) for the header stat
  const fastestCommute = transport?.defaultCommutes?.[0];
  const commuteMin = fastestCommute?.durationMinutes ?? transport?.commuteToCenter?.[0]?.durationMinutes;
  const commuteLabel = fastestCommute?.destinationLabel;

  return (
    <div id="viven-report" className="page-transition max-w-4xl mx-auto px-4 pt-8 pb-16">
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
          <div className="flex gap-2" data-print-hide>
            <button
              onClick={() => {
                const url = window.location.href;
                if (navigator.share) {
                  navigator.share({ title: `Viven Report — ${report.address}`, url });
                } else {
                  navigator.clipboard.writeText(url).then(() => {
                    alert("Report link copied to clipboard!");
                  });
                }
              }}
              className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl transition-colors"
              title="Share Report"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={generatePdf}
              disabled={generatingPdf}
              className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl transition-colors disabled:opacity-50"
              title="Download as PDF"
            >
              {generatingPdf
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <Download className="w-5 h-5" />}
            </button>
          </div>
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
          <p className="text-xs text-muted">Last Sale</p>
          <p className="text-lg font-heading font-bold mt-1">
            {lastSale ? formatPriceShort(lastSale.price) : "N/A"}
          </p>
          {lastSale && (
            <p className="text-[10px] text-muted mt-0.5">
              {new Date(safeStr(lastSale.dateOfTransfer)).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted">
            {priceHistory?.hpiAdjustedPricePerSqFt ? "Per sq ft (adj.)" : "Per sq ft"}
          </p>
          <p className="text-lg font-heading font-bold mt-1">
            {priceHistory?.hpiAdjustedPricePerSqFt
              ? formatPrice(priceHistory.hpiAdjustedPricePerSqFt)
              : priceHistory && priceHistory.pricePerSqFt > 0
                ? formatPrice(priceHistory.pricePerSqFt)
                : "N/A"}
          </p>
          {priceHistory?.hpiAdjustedPricePerSqFt && priceHistory.pricePerSqFt > 0 && lastSale && (
            <p className="text-[10px] text-muted mt-0.5">
              {formatPrice(priceHistory.pricePerSqFt)} in {new Date(safeStr(lastSale.dateOfTransfer)).getFullYear()}
            </p>
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
                <a
                  href={epc.lmkKey
                    ? `https://find-energy-certificate.service.gov.uk/energy-certificate/${epc.lmkKey}`
                    : `https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?postcode=${encodeURIComponent(report.postcode)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                >
                  View the full EPC certificate
                </a>
              </p>
              {/* Upgrade cost context */}
              {epc.currentEnergyRating !== epc.potentialEnergyRating && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-3">
                  <p className="text-xs text-blue-800">
                    <strong>Upgrade potential:</strong> Moving from {epc.currentEnergyRating} to {epc.potentialEnergyRating}{" "}
                    {epc.recommendations.length > 0 ? (
                      <>could include: {epc.recommendations.slice(0, 3).map((r, i) => (
                        <span key={i}>
                          {i > 0 && ", "}{r.improvement.toLowerCase()}{r.indicativeCost ? ` (${r.indicativeCost})` : ""}
                        </span>
                      ))}.{" "}
                      {epc.recommendations.some(r => r.typicalSaving) && (
                        <>Typical annual savings: {epc.recommendations.filter(r => r.typicalSaving).map(r => r.typicalSaving).join(" + ")}.</>
                      )}
                      </>
                    ) : (
                      <>typically costs {
                        epc.currentEnergyRating === "D" && epc.potentialEnergyRating === "C" ? "£1,000–£5,000" :
                        epc.currentEnergyRating === "E" && ["C", "D"].includes(epc.potentialEnergyRating) ? "£3,000–£10,000" :
                        epc.currentEnergyRating === "F" ? "£5,000–£15,000" :
                        "£1,000–£10,000"
                      } for a property of this type, depending on improvements needed.</>
                    )}
                  </p>
                </div>
              )}
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
              <PriceChart transactions={priceHistory.transactions} />

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-xs text-muted">Area Average</p>
                  <p className="text-xl font-heading font-bold mt-1">
                    {priceHistory.areaAverage > 0 ? formatPrice(priceHistory.areaAverage) : "N/A"}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-xs text-muted">Transactions</p>
                  <p className="text-xl font-heading font-bold mt-1">
                    {priceHistory.transactions.length}
                  </p>
                </div>
              </div>

              {insights?.priceHistory ? (
                <InsightBox text={insights.priceHistory} />
              ) : priceHistory.pricePerSqFt > 0 && epc && epc.totalFloorArea > 0 && lastSale && (() => {
                const saleYear = new Date(safeStr(lastSale.dateOfTransfer)).getFullYear();
                const rawPsf = priceHistory.pricePerSqFt;
                const adjPsf = priceHistory.hpiAdjustedPricePerSqFt;
                const allComps = [...(enrichedComps?.street || []), ...(enrichedComps?.sector || [])].filter(c => c.pricePerSqft && c.pricePerSqft > 0);
                const compPsfValues = allComps.map(c => c.pricePerSqft!);
                const minCompPsf = compPsfValues.length > 0 ? Math.min(...compPsfValues) : null;
                const maxCompPsf = compPsfValues.length > 0 ? Math.max(...compPsfValues) : null;

                let text = `The subject property last sold in ${saleYear} at ${formatPrice(rawPsf)}/sqft.`;
                if (adjPsf && adjPsf !== rawPsf) {
                  text += ` Adjusted for regional house price growth, this is approximately equivalent to ${formatPrice(adjPsf)}/sqft in today's terms.`;
                }
                if (minCompPsf && maxCompPsf) {
                  text += ` Recent comparable sales nearby range from ${formatPrice(minCompPsf)}-${formatPrice(maxCompPsf)}/sqft.`;
                }
                return <InsightBox text={text} />;
              })()}

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

                  {/* Price per sqft chart */}
                  <PricePerSqftChart
                    comps={[...enrichedComps.street, ...(enrichedComps.sector || [])]}
                    subjectPsf={priceHistory.pricePerSqFt > 0 ? priceHistory.pricePerSqFt : null}
                    adjustedPsf={priceHistory.hpiAdjustedPricePerSqFt || null}
                  />
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

              {/* Nearby Streets section */}
              {enrichedComps?.sector && enrichedComps.sector.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                    Nearby Streets ({enrichedComps.sector.length})
                  </h3>
                  <p className="text-xs text-muted mb-3">
                    Recent sales in the same postcode sector, last 2 years
                  </p>
                  <div>
                    {enrichedComps.sector.slice(0, 8).map((comp, i) => (
                      <EnrichedCompRow key={i} comp={comp} />
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
                  {geology.bedrockType.toLowerCase().includes("clay") && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-2">
                      <p className="text-xs text-amber-800">
                        This area sits on {geology.bedrockType} which is associated with ground movement.
                        We recommend a full structural survey before purchase.
                      </p>
                    </div>
                  )}
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

          {planning.length > 0 && (() => {
            const sorted = [...planning].sort((a, b) => (a.distanceKm || 99) - (b.distanceKm || 99));
            const pending = planning.filter((a) => a.status === "Pending" || (!a.status.includes("Approved") && !a.status.includes("Refused")));
            const approved = planning.filter((a) => a.status === "Approved" || a.status.toLowerCase().includes("approved"));
            const refused = planning.filter((a) => a.status === "Refused" || a.status.toLowerCase().includes("refused"));
            return (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Nearby Planning Applications ({planning.length})</h3>
                </div>
                <div className="flex gap-2 mb-3 text-xs flex-wrap">
                  {pending.length > 0 && <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{pending.length} pending</span>}
                  {approved.length > 0 && <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{approved.length} approved</span>}
                  {refused.length > 0 && <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{refused.length} refused</span>}
                  <span className="text-muted">within 500m</span>
                </div>
                <div className="space-y-3">
                  {sorted.slice(0, 5).map((app, i) => (
                    <div key={i} className="bg-background rounded-xl p-4 text-sm">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{app.description || app.reference}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                          app.status === "Approved" || app.status.toLowerCase().includes("approved") ? "bg-green-50 text-green-700" :
                          app.status === "Refused" || app.status.toLowerCase().includes("refused") ? "bg-red-50 text-red-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>{app.status}</span>
                      </div>
                      <div className="flex justify-between text-muted mt-1">
                        <p>{app.address}</p>
                        {app.distanceKm > 0 && (
                          <span className="text-xs shrink-0 ml-2">
                            {app.distanceKm < 1 ? `${Math.round(app.distanceKm * 1000)}m` : `${app.distanceKm.toFixed(1)}km`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">Source: PlanIt (planit.org.uk)</p>
              </div>
            );
          })()}
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
          {schoolsData && (schoolsData.primary.length > 0 || schoolsData.secondary.length > 0 || schoolsData.allThrough.length > 0) ? (
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
                    {!transport.personalCommute && (
                      <p className="text-[11px] text-muted mt-2 italic">
                        Default destinations shown. Personalise your commute when ordering your report.
                      </p>
                    )}
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
              <p className="text-xs text-muted mt-3">
                {broadband.averageDownload >= 100
                  ? `${broadband.averageDownload} Mbps is excellent — fast enough for multiple 4K streams, video calls, and heavy home working simultaneously.`
                  : broadband.averageDownload >= 30
                  ? `${broadband.averageDownload} Mbps is sufficient for streaming 4K on multiple devices, video calls, and working from home.`
                  : `${broadband.averageDownload} Mbps is modest — fine for basic browsing and standard streaming, but may struggle with multiple simultaneous video calls.`
                }
                {broadband.ultraFastAvailability > 0 && (
                  ` Ultrafast (300+ Mbps) is available to ${broadband.ultraFastAvailability}% of premises in this area.`
                )}
              </p>
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
              {/* Tree coverage and noise context */}
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {airQuality.treeCount !== undefined && airQuality.treeCount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TreePine className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-800">Tree Coverage</span>
                    </div>
                    <p className="text-sm text-green-700">
                      {airQuality.treeCount} trees/green features within 500m.
                      {airQuality.treeCount > 50 ? " Excellent tree coverage for the area." :
                       airQuality.treeCount > 20 ? " Good tree coverage." :
                       " Moderate green coverage."}
                    </p>
                  </div>
                )}
                {airQuality.nearestMajorRoad && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-800">Noise Context</span>
                    </div>
                    <p className="text-sm text-amber-700">
                      {airQuality.nearestMajorRoad.name} is within ~{airQuality.nearestMajorRoad.distanceMetres}m.
                      Properties near major roads may experience higher traffic noise during peak hours.
                    </p>
                  </div>
                )}
              </div>

              <SourceAttribution sources={["DEFRA Modelled Background Pollution Data", "OpenStreetMap"]} />
            </div>
          )}
        </ReportSection>
      </div>

      {/* ──────── USEFUL LINKS ──────── */}
      {(() => {
        const links: { title: string; href: string; reason: string }[] = [];

        // Crime: Police UK local area page
        if (crime?.comparisonToAverage === "above" && crime.boroughName) {
          const areaSlug = (report.geocode.admin_ward || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
          const forceSlug = "metropolitan-police";
          links.push({
            title: "Police UK — Local Crime Map",
            href: `https://www.police.uk/pu/your-area/${forceSlug}/${areaSlug}/`,
            reason: `View detailed crime data for ${crime.boroughName}`,
          });
        }

        // Flood risk: Environment Agency long-term flood risk checker
        if (flood && (flood.floodZone !== "1" || flood.riverAndSea === "medium" || flood.riverAndSea === "high" || flood.surfaceWater === "medium" || flood.surfaceWater === "high")) {
          links.push({
            title: "Check Long-Term Flood Risk",
            href: `https://check-long-term-flood-risk.service.gov.uk/postcode?postcode=${encodeURIComponent(report.postcode)}`,
            reason: `This property is in Flood Zone ${flood.floodZone}`,
          });
        }

        // EPC: Direct certificate link
        if (epc) {
          links.push({
            title: "View Full EPC Certificate",
            href: epc.lmkKey
              ? `https://find-energy-certificate.service.gov.uk/energy-certificate/${epc.lmkKey}`
              : `https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?postcode=${encodeURIComponent(report.postcode)}`,
            reason: `Current rating: ${epc.currentEnergyRating} (${epc.currentEnergyEfficiency}/100)`,
          });
        }

        // Schools: DfE performance tables
        if (schools.length > 0 || (schoolsData && (schoolsData.primary.length > 0 || schoolsData.secondary.length > 0))) {
          links.push({
            title: "Compare School Performance",
            href: `https://www.compare-school-performance.service.gov.uk/schools-by-type?step=default&table=schools&region=all-england&for=ofsted&basedon=Overall+effectiveness&postcode=${encodeURIComponent(report.postcode)}`,
            reason: "Search schools near this property on the DfE website",
          });
        }

        // Transport: TfL Journey Planner
        if (transport) {
          links.push({
            title: "TfL Journey Planner",
            href: `https://tfl.gov.uk/plan-a-journey/?from=${encodeURIComponent(report.postcode)}`,
            reason: "Plan a journey from this property",
          });
        }

        if (links.length === 0) return null;
        return (
          <div className="mt-8 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-lg font-bold">Useful Links</h2>
            </div>
            <div className="space-y-3">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-background rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{link.reason}</p>
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
