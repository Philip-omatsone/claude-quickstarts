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

const BAR_COLORS = [
  "#16A34A", "#22C55E", "#4ADE80", "#86EFAC",
  "#BBF7D0", "#A3A3A3", "#D4D4D4", "#E5E5E5",
];

function formatCategory(raw: string): string {
  return CATEGORY_LABELS[raw] || raw
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function CrimeCategoryChart({ crime }: CrimeChartProps) {
  const data = Object.entries(crime.crimesByCategory)
    .map(([category, count]) => ({
      category: formatCategory(category),
      rawCategory: category,
      count,
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

  return (
    <div className="space-y-2">
      {data.map((item, i) => {
        const maxCount = data[0].count;
        const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
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
                  backgroundColor: BAR_COLORS[i] || BAR_COLORS[BAR_COLORS.length - 1],
                }}
              />
            </div>
            <span className="text-xs font-medium text-foreground w-8 text-right">
              {item.count}
            </span>
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
            stroke="#16A34A"
            strokeWidth={2}
            dot={{ r: 3, fill: "#16A34A" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
