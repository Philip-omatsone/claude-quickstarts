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
} from "lucide-react";
import { RentalReport } from "@/lib/api/types";
import { ReportSection } from "@/components/report/ReportSection";
import { VibeScore } from "@/components/report/VibeScore";
import { CrimeCategoryChart } from "@/components/report/CrimeChart";

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

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-8 pb-16">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-6 md:p-8 text-white mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm font-medium uppercase tracking-wider">
                Free Rental Report
              </span>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                FREE
              </span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold mt-2">
              {report.postcode}
            </h1>
            <p className="text-white/80 mt-1">
              {report.geocode.admin_ward}, {report.geocode.admin_district}
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
      </div>

      <div className="space-y-6">
        {/* Vibe Score */}
        <ReportSection
          icon={Sparkles}
          title="Neighbourhood Vibe Score"
          subtitle="A composite score of what it's like to live here"
        >
          <VibeScore scores={report.vibeScore} />
        </ReportSection>

        {/* Safety */}
        <ReportSection
          icon={Shield}
          title="Safety Score"
          subtitle="Based on Police UK crime data"
          unavailable={!report.safetyScore.crime}
        >
          {report.safetyScore.crime && (
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
                    {report.safetyScore.crime.totalCrimes} reported incidents in
                    the most recent month
                  </p>
                </div>
              </div>

              <CrimeCategoryChart crime={report.safetyScore.crime} />
            </>
          )}
        </ReportSection>

        {/* Broadband */}
        <ReportSection
          icon={Wifi}
          title="Broadband & Bills"
          subtitle="Internet speeds and connectivity"
          unavailable={!report.broadband}
        >
          {report.broadband && (
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="bg-background rounded-xl p-4">
                <p className="text-sm text-muted">Avg Download</p>
                <p className="text-2xl font-heading font-bold text-foreground mt-1">
                  {report.broadband.averageDownload}
                </p>
                <p className="text-xs text-muted">Mbps</p>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-sm text-muted">Superfast Available</p>
                <p className="text-2xl font-heading font-bold text-foreground mt-1">
                  {report.broadband.superFastAvailability}%
                </p>
                <p className="text-xs text-muted">of premises</p>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-sm text-muted">Max Download</p>
                <p className="text-2xl font-heading font-bold text-foreground mt-1">
                  {report.broadband.maxDownload}
                </p>
                <p className="text-xs text-muted">Mbps</p>
              </div>
            </div>
          )}
        </ReportSection>

        {/* Transport */}
        <ReportSection
          icon={Train}
          title="Transport & Commute"
          subtitle="Nearest stations and travel times"
          unavailable={!report.transport}
        >
          {report.transport && (
            <>
              {report.transport.nearestStations.length > 0 && (
                <div className="space-y-2 text-sm">
                  {report.transport.nearestStations.slice(0, 5).map((station, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium">{station.name}</p>
                        <p className="text-xs text-muted">
                          {station.lines.slice(0, 3).join(", ")}
                        </p>
                      </div>
                      <span className="text-muted">{station.distanceKm}km</span>
                    </div>
                  ))}
                </div>
              )}
              {report.transport.commuteToCenter.length > 0 && (
                <div className="mt-4 bg-primary-light rounded-xl p-4 text-center">
                  <p className="text-sm text-primary font-medium">
                    Commute to Central London
                  </p>
                  <p className="text-2xl font-heading font-bold text-foreground mt-1">
                    ~{report.transport.commuteToCenter[0].durationMinutes} min
                  </p>
                </div>
              )}
            </>
          )}
        </ReportSection>

        {/* Demographics */}
        <ReportSection
          icon={Users}
          title="Neighbourhood Demographics"
          subtitle="Who lives in this area"
          unavailable={!report.demographics}
        >
          {report.demographics && (
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
                    <span className="font-medium">
                      {report.demographics.tenureMix.owned}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted">Private Rented</span>
                    <span className="font-medium">
                      {report.demographics.tenureMix.privateRented}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted">Social Rented</span>
                    <span className="font-medium">
                      {report.demographics.tenureMix.socialRented}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-background rounded-xl p-3">
                  <p className="text-sm text-muted">Deprivation Decile</p>
                  <p className="font-semibold">
                    {report.demographics.deprivationDecile}/10
                    {report.demographics.deprivationDecile >= 7 &&
                      " (Less deprived)"}
                    {report.demographics.deprivationDecile <= 3 &&
                      " (More deprived)"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ReportSection>

        {/* Amenities */}
        {report.amenities.length > 0 && (
          <ReportSection
            icon={ShoppingBag}
            title="Nearby Amenities"
            subtitle="What's within walking distance"
          >
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              {report.amenities.slice(0, 12).map((amenity, i) => (
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
          </ReportSection>
        )}
      </div>

      {/* Upgrade CTA */}
      <div className="mt-8 bg-white rounded-2xl border border-border p-8 text-center">
        <h2 className="font-heading text-xl font-bold">
          Thinking of buying in this area?
        </h2>
        <p className="text-muted mt-2">
          Get a full Buyer Report with price history, risk assessment, and
          detailed market analysis for just £9.99.
        </p>
        <a
          href="/buyers"
          className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          Get Buyer Report — £9.99
        </a>
      </div>

      <div className="mt-6 text-center text-xs text-muted">
        <p>
          Data from: Police UK, Ofcom, TfL, ONS, OpenStreetMap
        </p>
        <p className="mt-1">
          Report generated{" "}
          {new Date(report.generatedAt).toLocaleDateString("en-GB")}
        </p>
      </div>
    </div>
  );
}
