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
  "anti-social-behaviour": "Anti-Social",
  "bicycle-theft": "Bike Theft",
  burglary: "Burglary",
  "criminal-damage-arson": "Damage/Arson",
  drugs: "Drugs",
  "other-crime": "Other Crime",
  "other-theft": "Other Theft",
  "possession-of-weapons": "Weapons",
  "public-order": "Public Order",
  robbery: "Robbery",
  shoplifting: "Shoplifting",
  "theft-from-the-person": "Theft (Person)",
  "vehicle-crime": "Vehicle Crime",
  "violent-crime": "Violence",
  "violence-and-sexual-offences": "Violence/Sexual",
};

function formatCategory(raw: string): string {
  return CATEGORY_LABELS[raw] || raw
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Colour bars by severity relative to borough average
function getCrimeBarColour(count: number, boroughAvg: number | undefined): string {
  if (!boroughAvg || boroughAvg === 0) {
    // No comparison data — graduated grey to red based on position
    return "#6B7280";
  }
  const ratio = count / boroughAvg;
  if (ratio <= 0.7) return "#22c55e";  // Green — well below average
  if (ratio <= 1.0) return "#f59e0b";  // Amber — around average
  if (ratio <= 1.5) return "#f97316";  // Orange — above average
  return "#ef4444";                     // Red — significantly above average
}

function getComparisonIndicator(count: number, boroughAvg: number | undefined): string {
  if (!boroughAvg || boroughAvg === 0) return "";
  const ratio = count / boroughAvg;
  const pctDiff = Math.abs(Math.round((ratio - 1) * 100));
  if (ratio <= 0.7) return `\u25BC ${pctDiff}% below`;
  if (ratio <= 1.15) return `\u2192 Around avg`;
  return `\u25B2 ${pctDiff}% above`;
}

export function CrimeCategoryChart({ crime }: CrimeChartProps) {
  const data = Object.entries(crime.crimesByCategory)
    .map(([category, count]) => ({
      category: formatCategory(category),
      rawCategory: category,
      count,
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
      <p className="text-xs text-muted mb-3">
        Incidents in most recent month{crime.boroughName ? ` | Compared to ${crime.boroughName} average` : ""}
      </p>
      {data.map((item) => {
        const maxCount = data[0].count;
        const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
        const barColour = getCrimeBarColour(item.count, item.boroughAvg);
        const comparison = getComparisonIndicator(item.count, item.boroughAvg);
        return (
          <div key={item.rawCategory} className="flex items-center gap-3">
            <span className="text-xs text-muted w-28 text-right shrink-0 truncate">
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
            <span className="text-xs font-medium text-foreground w-8 text-right shrink-0">
              {item.count}
            </span>
            {hasBoroughData && (
              <span className="text-[10px] text-muted w-24 shrink-0 truncate">
                {comparison}
              </span>
            )}
          </div>
        );
      })}
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
      ...item,
      label: monthNames[monthIdx] || item.month,
    };
  });

  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <p className="text-sm text-muted text-center py-4">
        No trend data available
      </p>
    );
  }

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
            formatter={(value: number | undefined) => [value ?? 0, "Crimes"]}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3, fill: "#6366f1" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
