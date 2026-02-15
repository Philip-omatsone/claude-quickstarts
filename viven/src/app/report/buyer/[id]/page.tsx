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
} from "lucide-react";
import { BuyerReport } from "@/lib/api/types";
import { ReportSection } from "@/components/report/ReportSection";
import { RiskBadge } from "@/components/report/RiskBadge";
import { PriceChart } from "@/components/report/PriceChart";
import { CrimeCategoryChart, CrimeTrendChart } from "@/components/report/CrimeChart";

export default function BuyerReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<BuyerReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try sessionStorage first
    const stored = sessionStorage.getItem(`report_${id}`);
    if (stored) {
      setReport(JSON.parse(stored));
      setLoading(false);
      return;
    }

    // Fallback: fetch from API
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
          <p className="text-muted mt-2">This report may have expired or doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(price);

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

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 pt-8 pb-16">
      {/* Report Header */}
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
          <button className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 text-xs text-white/60">
          Generated {new Date(report.generatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })} | Report ID: {report.id}
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Property Overview */}
        <ReportSection icon={Home} title="Property Overview" subtitle="Key facts about the property">
          <div className="grid sm:grid-cols-2 gap-6">
            {epc && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  EPC Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted">Property Type</span>
                    <p className="font-medium">{epc.propertyType || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted">Built Form</span>
                    <p className="font-medium">{epc.builtForm || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted">Floor Area</span>
                    <p className="font-medium">
                      {epc.totalFloorArea > 0 ? `${epc.totalFloorArea} m²` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted">Rooms</span>
                    <p className="font-medium">{epc.numberOfRooms || "N/A"}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-muted text-sm">EPC Rating</span>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-12 h-12 rounded-lg bg-green-500 text-white flex items-center justify-center font-heading font-bold text-xl">
                      {epc.currentEnergyRating || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Current: {epc.currentEnergyRating} ({epc.currentEnergyEfficiency})
                      </p>
                      <p className="text-xs text-muted">
                        Potential: {epc.potentialEnergyRating} ({epc.potentialEnergyEfficiency})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {lastSale && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Last Sale
                </h3>
                <div className="bg-background rounded-xl p-4">
                  <p className="text-2xl font-heading font-bold text-primary">
                    {formatPrice(lastSale.price)}
                  </p>
                  <p className="text-sm text-muted mt-1">
                    {new Date(lastSale.dateOfTransfer).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-3 text-sm">
                    <span className="text-muted">Tenure: </span>
                    <span className="font-medium">
                      {lastSale.tenure === "F" ? "Freehold" : "Leasehold"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!epc && !lastSale && (
              <div className="col-span-2 bg-background rounded-xl p-4">
                <p className="text-muted text-sm">
                  No EPC or sale records found for this specific property.
                  {priceHistory && priceHistory.transactions.length > 0 && (
                    <> See price history below for area transaction data.</>
                  )}
                </p>
              </div>
            )}
          </div>
        </ReportSection>

        {/* 2. Price History & Valuation */}
        <ReportSection
          icon={TrendingUp}
          title="Price History & Valuation"
          subtitle="Transaction history and price trends"
          unavailable={!priceHistory}
        >
          {priceHistory && (
            <>
              <PriceChart transactions={priceHistory.transactions} />

              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-sm text-muted">Area Average</p>
                  <p className="text-xl font-heading font-bold text-foreground mt-1">
                    {priceHistory.areaAverage > 0
                      ? formatPrice(priceHistory.areaAverage)
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-sm text-muted">Est. Value Range</p>
                  <p className="text-xl font-heading font-bold text-foreground mt-1">
                    {formatPrice(priceHistory.estimatedValueRange.low)} –{" "}
                    {formatPrice(priceHistory.estimatedValueRange.high)}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-sm text-muted">Transactions</p>
                  <p className="text-xl font-heading font-bold text-foreground mt-1">
                    {priceHistory.transactions.length}
                  </p>
                </div>
              </div>

              {priceHistory.comparableSales.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                    Comparable Sales in Area
                  </h3>
                  <div className="space-y-2">
                    {priceHistory.comparableSales.slice(0, 5).map((sale, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{sale.address}</p>
                          <p className="text-xs text-muted">
                            {new Date(sale.dateOfTransfer).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                        <p className="font-semibold">{formatPrice(sale.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </ReportSection>

        {/* 3. Risk Assessment */}
        <ReportSection
          icon={ShieldCheck}
          title="Risk Assessment"
          subtitle="Environmental and planning risks"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Flood Risk */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold">Flood Risk</h3>
              </div>
              {flood ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted">River & Sea</span>
                    <RiskBadge level={flood.riverAndSea} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Surface Water</span>
                    <RiskBadge level={flood.surfaceWater} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Flood Zone</span>
                    <span className="font-medium">Zone {flood.floodZone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Reservoir Risk</span>
                    <span className="font-medium">
                      {flood.reservoir ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted">Data unavailable</p>
              )}
            </div>

            {/* Geology / Subsidence */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold">Ground Stability</h3>
              </div>
              {geology ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Subsidence Risk</span>
                    <RiskBadge level={geology.subsidenceRisk} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Shrink-Swell</span>
                    <span className="font-medium">{geology.shrinkSwellClass}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Radon</span>
                    <span className="font-medium">{geology.radonLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Bedrock</span>
                    <span className="font-medium text-xs">{geology.bedrockType}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted">Data unavailable</p>
              )}
            </div>
          </div>

          {/* Planning Applications */}
          {planning.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">
                  Nearby Planning Applications ({planning.length})
                </h3>
              </div>
              <div className="space-y-3">
                {planning.slice(0, 5).map((app, i) => (
                  <div
                    key={i}
                    className="bg-background rounded-xl p-4 text-sm"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{app.description || app.reference}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          app.status === "Approved"
                            ? "bg-green-50 text-green-700"
                            : app.status === "Refused"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-muted mt-1">{app.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ReportSection>

        {/* 4. Area & Neighbourhood */}
        <ReportSection
          icon={MapPin}
          title="Area & Neighbourhood"
          subtitle="Crime, schools, transport, and more"
        >
          {/* Crime */}
          {crime && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Crime Statistics</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    crime.comparisonToAverage === "below"
                      ? "bg-green-50 text-green-700"
                      : crime.comparisonToAverage === "above"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {crime.comparisonToAverage === "below"
                    ? "Below Average"
                    : crime.comparisonToAverage === "above"
                    ? "Above Average"
                    : "Average"}
                </span>
              </div>
              <CrimeCategoryChart crime={crime} />
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-muted uppercase mb-2">
                  12-Month Trend
                </h4>
                <CrimeTrendChart crime={crime} />
              </div>
            </div>
          )}

          {/* Schools */}
          {schools.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <School className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Nearby Schools</h3>
              </div>
              <div className="space-y-2">
                {schools.slice(0, 8).map((school, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm"
                  >
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-xs text-muted">
                        {school.type} | {school.distanceKm}km away
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        school.ofstedRating === "Outstanding"
                          ? "bg-green-50 text-green-700"
                          : school.ofstedRating === "Good"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {school.ofstedRating}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transport */}
          {transport && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Train className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Transport</h3>
              </div>
              {transport.nearestStations.length > 0 && (
                <div className="space-y-2 text-sm">
                  {transport.nearestStations.slice(0, 5).map((station, i) => (
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
              {transport.commuteToCenter.length > 0 && (
                <div className="mt-4 bg-background rounded-xl p-4">
                  <p className="text-sm text-muted">Commute to Central London</p>
                  <p className="text-lg font-heading font-bold mt-1">
                    {transport.commuteToCenter[0].durationMinutes} minutes
                  </p>
                </div>
              )}
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
                  <p className="text-muted">Avg Download</p>
                  <p className="text-lg font-bold mt-1">{broadband.averageDownload} Mbps</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-muted">Superfast</p>
                  <p className="text-lg font-bold mt-1">{broadband.superFastAvailability}%</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-muted">Ultrafast</p>
                  <p className="text-lg font-bold mt-1">{broadband.ultraFastAvailability}%</p>
                </div>
              </div>
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
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      Owned {demographics.tenureMix.owned}%
                    </span>
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                      Private rent {demographics.tenureMix.privateRented}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ReportSection>

        {/* 5. Environmental */}
        <ReportSection
          icon={Wind}
          title="Environmental"
          subtitle="Air quality and green space"
          unavailable={!airQuality}
        >
          {airQuality && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-sm text-muted">DAQI Index</p>
                  <p className="text-3xl font-heading font-bold mt-1">
                    {airQuality.index}
                  </p>
                  <p
                    className={`text-sm font-medium mt-1 ${
                      airQuality.band === "Low"
                        ? "text-green-600"
                        : airQuality.band === "Moderate"
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {airQuality.band}
                  </p>
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
                          <span className="font-medium">
                            {p.value} {p.unit} ({p.band})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </ReportSection>
      </div>

      {/* Data Sources Footer */}
      <div className="mt-8 text-center text-xs text-muted">
        <p>
          Data sourced from: Land Registry, EPC Open Data, Environment Agency,
          Police UK, GIAS, TfL, Ofcom, ONS, BGS, DEFRA, PlanIt, OpenStreetMap
        </p>
        <p className="mt-1">
          Report generated on{" "}
          {new Date(report.generatedAt).toLocaleDateString("en-GB")}. Data may
          not reflect the most recent changes.
        </p>
      </div>
    </div>
  );
}
