"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Shield,
  Train,
  Wifi,
  Users,
  Sparkles,
  ShoppingBag,
  Share2,
  Wind,
  School,
  Star,
} from "lucide-react";
import { RentalReport } from "@/lib/api/types";
import { ReportSection } from "@/components/report/ReportSection";
import { VibeScore } from "@/components/report/VibeScore";
import { CrimeCategoryChart, CrimeTrendChart } from "@/components/report/CrimeChart";

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
      Source: {sources.join(" \u00B7 ")}
    </div>
  );
}

export default function RentalReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<RentalReport | null>(null);
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
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
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
          <p className="text-muted mt-2">This report may have expired.</p>
        </div>
      </div>
    );
  }

  const crime = report.safetyScore.crime;
  const commuteMin = report.transport?.commuteToCenter?.[0]?.durationMinutes;

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-8 pb-16">
      {/* --------- HEADER --------- */}
      <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-6 md:p-8 text-white mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm font-medium uppercase tracking-wider">
                Rental Area Report
              </span>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                FREE
              </span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold mt-2">
              {report.address || report.postcode}
            </h1>
            <p className="text-white/80 mt-1">
              {report.geocode.admin_ward}, {report.geocode.admin_district},{" "}
              {report.geocode.region}
            </p>
          </div>
          <button
            className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl transition-colors"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Viven Rental Report: ${report.postcode}`,
                  url: window.location.href,
                });
              }
            }}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 text-xs text-white/60">
          Generated {new Date(report.generatedAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric",
          })} | Report ID: {report.id}
        </div>
      </div>

      {/* --------- QUICK STATS --------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted">Safety</p>
          <p className="text-lg font-heading font-bold mt-1">{report.safetyScore.score}/100</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted">Vibe</p>
          <p className="text-lg font-heading font-bold mt-1">{report.vibeScore.overall}/100</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted">Broadband</p>
          <p className="text-lg font-heading font-bold mt-1">
            {report.broadband ? `${report.broadband.averageDownload} Mbps` : "N/A"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-muted">Commute</p>
          <p className="text-lg font-heading font-bold mt-1">
            {commuteMin ? `${commuteMin} min` : "N/A"}
          </p>
        </div>
      </div>

      {/* --------- AI INSIGHT --------- */}
      {report.insights?.areaOverview && (
        <InsightBox text={report.insights.areaOverview} />
      )}

      <div className="space-y-6 mt-6">
        {/* --------- 1. NEIGHBOURHOOD VIBE --------- */}
        <ReportSection
          icon={Sparkles}
          title="Neighbourhood Vibe"
          subtitle="What it feels like to live here"
        >
          <VibeScore scores={report.vibeScore} details={report.vibeDetails} />
          <SourceAttribution sources={["OpenStreetMap via Overpass API", "Police UK", "DEFRA Air Quality"]} />
        </ReportSection>

        {/* --------- 2. SAFETY & CRIME --------- */}
        <ReportSection
          icon={Shield}
          title="Safety & Crime"
          subtitle="Based on Police UK crime data"
          unavailable={!crime}
        >
          {crime && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    report.safetyScore.score >= 70
                      ? "bg-green-100"
                      : report.safetyScore.score >= 40
                      ? "bg-amber-100"
                      : "bg-red-100"
                  }`}
                >
                  <span className="text-2xl font-heading font-bold">
                    {report.safetyScore.score}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {report.safetyScore.score >= 70
                      ? "Good safety rating"
                      : report.safetyScore.score >= 40
                      ? "Average safety rating"
                      : "Below average safety"}
                  </p>
                  <p className="text-sm text-muted">
                    {crime.totalCrimes} reported incidents nearby | {" "}
                    <span className={
                      crime.comparisonToAverage === "below" ? "text-green-600" :
                      crime.comparisonToAverage === "above" ? "text-red-600" :
                      "text-amber-600"
                    }>
                      {crime.comparisonToAverage === "below"
                        ? `Below average for ${crime.boroughName || "the borough"}`
                        : crime.comparisonToAverage === "above"
                        ? `Above average for ${crime.boroughName || "the borough"}`
                        : `Around average for ${crime.boroughName || "the borough"}`
                      }
                    </span>
                  </p>
                </div>
              </div>

              <CrimeCategoryChart crime={crime} />

              {/* 12-Month Trend */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold text-muted uppercase mb-2">12-Month Trend</h4>
                <CrimeTrendChart crime={crime} />
              </div>

              <SourceAttribution sources={[
                "Police UK (data.police.uk)",
                crime.dateRange ? `Data covers ${crime.dateRange}` : "",
                crime.boroughName ? `Comparison: ${crime.boroughName} borough` : "",
              ].filter(Boolean)} />
            </>
          )}
        </ReportSection>

        {/* --------- 3. GETTING AROUND --------- */}
        <ReportSection
          icon={Train}
          title="Getting Around"
          subtitle="Nearest stations and commute times"
          unavailable={!report.transport}
        >
          {report.transport && (
            <>
              {report.transport.nearestStations.length > 0 && (
                <div className="space-y-2 text-sm">
                  {report.transport.nearestStations.slice(0, 5).map((station, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                    >
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
              )}
              {report.transport.commuteToCenter.length > 0 && (
                <div className="mt-4 bg-primary-light rounded-xl p-4 flex items-center justify-between">
                  <p className="text-sm text-primary font-medium">Commute to Central London</p>
                  <p className="text-xl font-heading font-bold text-foreground">
                    ~{report.transport.commuteToCenter[0].durationMinutes} min
                  </p>
                </div>
              )}
              <SourceAttribution sources={["TfL Journey Planner API"]} />
            </>
          )}
        </ReportSection>

        {/* --------- 4. BROADBAND & BILLS --------- */}
        <ReportSection
          icon={Wifi}
          title="Broadband & Bills"
          subtitle="Internet speeds and connectivity"
          unavailable={!report.broadband}
        >
          {report.broadband && (
            <>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="bg-background rounded-xl p-4">
                  <p className="text-sm text-muted">Avg Download</p>
                  <p className="text-2xl font-heading font-bold text-foreground mt-1">
                    {report.broadband.averageDownload}
                  </p>
                  <p className="text-xs text-muted">Mbps</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-sm text-muted">Superfast</p>
                  <p className="text-2xl font-heading font-bold text-foreground mt-1">
                    {report.broadband.superFastAvailability}%
                  </p>
                  <p className="text-xs text-muted">of premises</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-sm text-muted">Ultrafast</p>
                  <p className="text-2xl font-heading font-bold text-foreground mt-1">
                    {report.broadband.ultraFastAvailability}%
                  </p>
                  <p className="text-xs text-muted">of premises</p>
                </div>
              </div>
              <SourceAttribution sources={["Ofcom Connected Nations"]} />
            </>
          )}
        </ReportSection>

        {/* --------- 5. LOCAL LIFE (AMENITIES) --------- */}
        {report.amenities.length > 0 && (
          <ReportSection
            icon={ShoppingBag}
            title="Local Life"
            subtitle="What&apos;s within walking distance"
          >
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              {report.amenities.slice(0, 14).map((amenity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-3 bg-background rounded-lg"
                >
                  <div>
                    <p className="font-medium">{amenity.name}</p>
                    <p className="text-xs text-muted capitalize">
                      {amenity.category}
                    </p>
                  </div>
                  <span className="text-muted text-xs">
                    {amenity.distanceKm}km
                  </span>
                </div>
              ))}
            </div>
            <SourceAttribution sources={["OpenStreetMap via Overpass API"]} />
          </ReportSection>
        )}

        {/* --------- 6. SCHOOLS --------- */}
        {report.schools && report.schools.length > 0 && (
          <ReportSection
            icon={School}
            title="Nearby Schools"
            subtitle="Schools within the area"
          >
            <div className="space-y-2">
              {report.schools.slice(0, 8).map((school, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0 text-sm">
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
                      <p className="font-medium">{school.name}</p>
                      <p className="text-xs text-muted capitalize">{school.type} | {school.distanceKm}km</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    school.ofstedRating === "Outstanding" ? "bg-green-50 text-green-700" :
                    school.ofstedRating === "Good" ? "bg-blue-50 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{school.ofstedRating}</span>
                </div>
              ))}
            </div>
            <SourceAttribution sources={["DfE Get Information About Schools (GIAS)"]} />
          </ReportSection>
        )}

        {/* --------- 7. DEMOGRAPHICS --------- */}
        <ReportSection
          icon={Users}
          title="Demographics"
          subtitle="Who lives in this area"
          unavailable={!report.demographics}
        >
          {report.demographics && (
            <>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Age Profile</h3>
                  <div className="space-y-2">
                    {Object.entries(report.demographics.ageProfile).map(
                      ([range, pct]) => (
                        <div key={range}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted">{range}</span>
                            <span className="font-medium">{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3">Tenure Mix</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted">Owned</span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        {report.demographics.tenureMix.owned}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted">Private Rented</span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        {report.demographics.tenureMix.privateRented}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted">Social Rented</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        {report.demographics.tenureMix.socialRented}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 bg-background rounded-xl p-3">
                    <p className="text-sm text-muted">Deprivation Decile</p>
                    <p className="font-semibold">
                      {report.demographics.deprivationDecile}/10
                      {report.demographics.deprivationDecile >= 7 && " (Less deprived)"}
                      {report.demographics.deprivationDecile <= 3 && " (More deprived)"}
                    </p>
                  </div>
                </div>
              </div>
              <SourceAttribution sources={["ONS Census 2021", "MHCLG Index of Multiple Deprivation 2019"]} />
            </>
          )}
        </ReportSection>

        {/* --------- 8. ENVIRONMENTAL --------- */}
        {report.airQuality && (
          <ReportSection
            icon={Wind}
            title="Environmental"
            subtitle="Air quality in this area"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-background rounded-xl p-4 text-center">
                <p className="text-xs text-muted">DAQI Index</p>
                <p className="text-3xl font-heading font-bold mt-1">{report.airQuality.index}</p>
                <p className={`text-sm font-medium mt-1 ${
                  report.airQuality.band === "Low" ? "text-green-600" :
                  report.airQuality.band === "Moderate" ? "text-amber-600" : "text-red-600"
                }`}>{report.airQuality.band}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted">
                  Nearest monitoring station: {report.airQuality.nearestStation}
                </p>
                {report.airQuality.pollutants.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {report.airQuality.pollutants.map((p, i) => (
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
          </ReportSection>
        )}

        {/* --------- 9. EPC (if available) --------- */}
        {report.epc && (
          <ReportSection
            icon={MapPin}
            title="Energy Performance"
            subtitle="EPC data for this address"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-heading font-bold text-xl ${
                ["A", "B"].includes(report.epc.currentEnergyRating) ? "bg-green-500" :
                ["C", "D"].includes(report.epc.currentEnergyRating) ? "bg-yellow-400" :
                "bg-red-500"
              }`}>
                {report.epc.currentEnergyRating}
              </div>
              <div>
                <p className="font-semibold">EPC Rating {report.epc.currentEnergyRating}</p>
                <p className="text-sm text-muted">
                  Score: {report.epc.currentEnergyEfficiency}/100 | Potential: {report.epc.potentialEnergyRating}
                </p>
                {report.epc.totalFloorArea > 0 && (
                  <p className="text-sm text-muted">Floor area: {report.epc.totalFloorArea} m&sup2;</p>
                )}
              </div>
            </div>
            <SourceAttribution sources={["EPC Open Data API"]} />
          </ReportSection>
        )}
      </div>

      {/* --------- UPGRADE CTA --------- */}
      <div className="mt-8 bg-white rounded-2xl border border-border p-8 text-center">
        <h2 className="font-heading text-xl font-bold">
          Thinking of buying in this area?
        </h2>
        <p className="text-muted mt-2">
          Get a full Buyer Report with price history, risk assessment, and
          detailed market analysis &mdash; free during early access.
        </p>
        <a
          href="/buyers"
          className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          Get Free Buyer Report
        </a>
      </div>

      {/* --------- DATA SOURCES FOOTER --------- */}
      <div className="mt-6 text-center text-xs text-muted">
        <p>
          Data sourced from: Police UK, Ofcom, TfL, ONS, DEFRA, DfE, EPC Open Data, OpenStreetMap
        </p>
        <p className="mt-1">
          Report generated{" "}
          {new Date(report.generatedAt).toLocaleDateString("en-GB")}.
          Data may not reflect the most recent changes.
        </p>
      </div>
    </div>
  );
}
