"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { CrimeData } from "@/lib/api/types";

interface CrimeChartProps {
  crime: CrimeData;
}

// Readable short labels for Police UK crime categories
const CATEGORY_LABELS: Record<string, string> = {
  "anti-social-behaviour": "Anti-Social Behaviour",
  "bicycle-theft": "Bicycle Theft",
  burglary: "Burglary",
  "criminal-damage-arson": "Criminal Damage/Arson",
  drugs: "Drugs",
  "other-crime": "Other Crime",
  "other-theft": "Other Theft",
  "possession-of-weapons": "Weapons Possession",
  "public-order": "Public Order",
  robbery: "Robbery",
  shoplifting: "Shoplifting",
  "theft-from-the-person": "Theft from Person",
  "vehicle-crime": "Vehicle Crime",
  "violent-crime": "Violence",
  "violence-and-sexual-offences": "Violence & Sexual Offences",
};

function formatCategory(raw: string): string {
  return CATEGORY_LABELS[raw] || raw
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Colour bars by severity relative to borough average
function getCrimeBarColour(count: number, boroughAvg: number | undefined): string {
  if (!boroughAvg || boroughAvg === 0) {
    return "#6B7280";
  }
  const ratio = count / boroughAvg;
  if (ratio <= 0.75) return "#22c55e";  // Green — well below average
  if (ratio <= 1.1)  return "#9ca3af";  // Gray — around average
  if (ratio <= 1.3)  return "#f59e0b";  // Amber — above average
  return "#ef4444";                      // Red — significantly above average
}

function getComparisonDot(count: number, boroughAvg: number | undefined): string {
  if (!boroughAvg || boroughAvg === 0) return "";
  const ratio = count / boroughAvg;
  if (ratio <= 0.75) return "\uD83D\uDFE2";  // green circle
  if (ratio <= 1.1)  return "\u26AA";          // white circle
  if (ratio <= 1.3)  return "\uD83D\uDFE1";  // yellow circle
  return "\uD83D\uDD34";                       // red circle
}

function getComparisonText(count: number, boroughAvg: number | undefined): string {
  if (!boroughAvg || boroughAvg === 0) return "";
  const ratio = count / boroughAvg;
  const pctDiff = Math.abs(Math.round((ratio - 1) * 100));
  if (ratio <= 0.75) return `\u25BC ${pctDiff}% below`;
  if (ratio <= 1.1)  return "\u2192 Around avg";
  return `\u25B2 ${pctDiff}% above`;
}

export function CrimeCategoryChart({ crime }: CrimeChartProps) {
  const hasRates = crime.crimeRates && Object.keys(crime.crimeRates).length > 0;

  const data = Object.entries(crime.crimesByCategory)
    .map(([category, count]) => ({
      category: formatCategory(category),
      rawCategory: category,
      count,
      rate: crime.crimeRates?.[category]?.rate ?? null,
      boroughAvg: crime.boroughAverages?.[category],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-4">
        No crime category data available
      </p>
    );
  }

  const hasBoroughData = data.some((d) => d.boroughAvg && d.boroughAvg > 0);

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center gap-3 text-[10px] text-muted uppercase tracking-wider mb-2">
        <span className="w-36 text-right shrink-0">Category</span>
        <span className="flex-1" />
        {hasRates && <span className="w-16 text-right shrink-0">Rate/1k</span>}
        {hasBoroughData && <span className="w-28 shrink-0 text-right">vs {crime.boroughName || "Borough"}</span>}
      </div>

      {data.map((item) => {
        const maxCount = data[0].count;
        const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
        const barColour = getCrimeBarColour(item.count, item.boroughAvg);
        const dot = getComparisonDot(item.count, item.boroughAvg);
        const comparison = getComparisonText(item.count, item.boroughAvg);
        return (
          <div key={item.rawCategory} className="flex items-center gap-3">
            <span className="text-xs text-muted w-36 text-right shrink-0 truncate">
              {item.category}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(pct, 3)}%`,
                  backgroundColor: barColour,
                }}
              />
            </div>
            {hasRates && item.rate !== null ? (
              <span className="text-xs font-semibold text-foreground w-16 text-right shrink-0">
                {item.rate}
              </span>
            ) : (
              <span className="text-xs font-medium text-foreground w-16 text-right shrink-0">
                {item.count}
              </span>
            )}
            {hasBoroughData && (
              <span className="text-[10px] text-muted w-28 shrink-0 text-right truncate">
                {dot} {comparison}
              </span>
            )}
          </div>
        );
      })}

      {/* Footer with units */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-3">
        <p className="text-[10px] text-gray-400">
          {hasRates
            ? "Incidents per 1,000 residents/year"
            : "Incident counts in most recent month"}
          {crime.boroughName ? ` | Comparison baseline: ${crime.boroughName}` : ""}
        </p>
      </div>
    </div>
  );
}

export function CrimeTrendChart({ crime }: CrimeChartProps) {
  // Format month labels to be shorter: "2025-01" -> "Jan"
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const data = crime.monthlyTrend.map((item) => {
    const parts = item.month.split("-");
    const monthIdx = parseInt(parts[1], 10) - 1;
    return {
      month: item.month,
      // Treat -1 (data unavailable) as null so Recharts shows a gap, not a drop to zero
      count: item.count >= 0 ? item.count : null,
      label: monthNames[monthIdx] || item.month,
    };
  });

  const hasData = data.some((d) => d.count !== null && d.count > 0);
  if (data.length === 0 || !hasData) {
    return (
      <p className="text-sm text-muted text-center py-4">
        No trend data available
      </p>
    );
  }

  const unavailableMonths = data.filter((d) => d.count === null).length;

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#6B7280" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            formatter={(value: unknown) => [
              value === null || value === undefined ? "Data unavailable" : String(value),
              "Crimes",
            ]}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3, fill: "#6366f1" }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {unavailableMonths > 0 && (
        <p className="text-[10px] text-muted mt-1">
          {unavailableMonths} month{unavailableMonths > 1 ? "s" : ""} with no data available (Police UK data typically lags 1-2 months)
        </p>
      )}
    </div>
  );
}
