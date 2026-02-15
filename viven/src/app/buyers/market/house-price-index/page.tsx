"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { formatGBP } from "@/components/calculators/CalculatorLayout";

// Simulated Nationwide HPI data — in production, this would come from a database
// populated by a monthly cron job parsing the Nationwide CSV
const generateHPIData = () => {
  const regions: Record<string, number> = {
    "UK Average": 250000,
    London: 520000,
    "South East": 380000,
    "South West": 310000,
    "East of England": 340000,
    "East Midlands": 240000,
    "West Midlands": 250000,
    "North West": 210000,
    "North East": 165000,
    "Yorkshire": 205000,
    Wales: 210000,
    Scotland: 195000,
  };

  const data: { date: string; [key: string]: number | string }[] = [];
  const now = new Date();

  for (let m = 120; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const entry: { date: string; [key: string]: number | string } = {
      date: d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
    };

    for (const [region, base] of Object.entries(regions)) {
      // Simulated growth with some volatility
      const yearsAgo = m / 12;
      const growthRate = region === "London" ? 0.02 : region === "North West" ? 0.04 : 0.03;
      const multiplier = Math.pow(1 + growthRate, 10 - yearsAgo);
      const noise = 1 + (Math.sin(m * 0.3 + Object.keys(regions).indexOf(region)) * 0.02);
      // 2008 dip
      const crashFactor = yearsAgo > 8 && yearsAgo < 9.5 ? 0.85 : 1;
      // COVID dip
      const covidFactor = m >= 44 && m <= 48 ? 0.97 : 1;

      entry[region] = Math.round(base * multiplier * noise * crashFactor * covidFactor);
    }

    data.push(entry);
  }
  return data;
};

const COLORS = [
  "#16A34A", "#3B82F6", "#EF4444", "#EAB308", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
  "#06B6D4", "#F43F5E",
];

const REGIONS = [
  "UK Average", "London", "South East", "South West", "East of England",
  "East Midlands", "West Midlands", "North West", "North East", "Yorkshire",
  "Wales", "Scotland",
];

const EVENTS = [
  { month: 24, label: "2008 Financial Crisis" },
  { month: 72, label: "COVID-19" },
  { month: 96, label: "Mini-Budget 2022" },
  { month: 108, label: "Rate Rises" },
];

export default function HousePriceIndexPage() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["UK Average"]);
  const [timeRange, setTimeRange] = useState("10y");
  const [showEvents, setShowEvents] = useState(true);

  const allData = useMemo(() => generateHPIData(), []);

  const data = useMemo(() => {
    const months = timeRange === "1y" ? 12 : timeRange === "5y" ? 60 : timeRange === "10y" ? 120 : allData.length;
    return allData.slice(-months);
  }, [allData, timeRange]);

  const latestData = data[data.length - 1];
  const yearAgoData = data[Math.max(data.length - 13, 0)];

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  return (
    <div className="page-transition max-w-5xl mx-auto px-4 pt-8 pb-16">
      <Link href="/buyers/market" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Market Data
      </Link>

      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
        UK House Price Index
      </h1>
      <p className="text-muted text-sm mb-8">
        Track average house prices across UK regions. Data based on Nationwide HPI methodology.
      </p>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {selectedRegions.slice(0, 4).map((region) => {
          const current = latestData?.[region] as number || 0;
          const yearAgo = yearAgoData?.[region] as number || 0;
          const change = yearAgo > 0 ? ((current - yearAgo) / yearAgo) * 100 : 0;
          const positive = change >= 0;
          return (
            <div key={region} className="bg-white rounded-xl border border-border p-4">
              <p className="text-xs text-muted truncate">{region}</p>
              <p className="text-lg font-heading font-bold mt-1">{formatGBP(current)}</p>
              <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${positive ? "text-green-600" : "text-red-600"}`}>
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {change.toFixed(1)}% (1yr)
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
          {["1y", "5y", "10y"].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${timeRange === r ? "bg-primary text-white" : "text-gray-600 hover:text-foreground"}`}
            >
              {r === "1y" ? "1 Year" : r === "5y" ? "5 Years" : "10 Years"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
          <input type="checkbox" checked={showEvents} onChange={(e) => setShowEvents(e.target.checked)} className="accent-primary" />
          Show events
        </label>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-border p-4 mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={Math.floor(data.length / 8)} />
            <YAxis tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value, name) => [formatGBP(Number(value)), String(name)]}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Legend />
            {selectedRegions.map((region, i) => (
              <Line
                key={region}
                type="monotone"
                dataKey={region}
                stroke={COLORS[REGIONS.indexOf(region) % COLORS.length]}
                strokeWidth={region === "UK Average" ? 2.5 : 1.5}
                dot={false}
                name={region}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Region selector */}
      <div className="bg-white rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Regions</h3>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region, i) => (
            <button
              key={region}
              onClick={() => toggleRegion(region)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                selectedRegions.includes(region)
                  ? "border-transparent text-white"
                  : "border-border text-gray-500 hover:border-gray-400"
              }`}
              style={
                selectedRegions.includes(region)
                  ? { backgroundColor: COLORS[i % COLORS.length] }
                  : {}
              }
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-gray-400 mt-6 text-center">
        Data source: Simulated based on Nationwide HPI methodology. In production, this would use live data from Nationwide monthly CSV downloads.
        House prices are averages and may not reflect individual property values.
      </p>
    </div>
  );
}
