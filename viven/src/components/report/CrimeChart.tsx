"use client";

import {
  BarChart,
  Bar,
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

export function CrimeCategoryChart({ crime }: CrimeChartProps) {
  const data = Object.entries(crime.crimesByCategory)
    .map(([category, count]) => ({
      category: category
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis type="number" tick={{ fontSize: 12, fill: "#6B7280" }} />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 11, fill: "#6B7280" }}
            width={110}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
            }}
          />
          <Bar dataKey="count" fill="#16A34A" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CrimeTrendChart({ crime }: CrimeChartProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={crime.monthlyTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#6B7280" }}
          />
          <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#16A34A"
            strokeWidth={2}
            dot={{ r: 3, fill: "#16A34A" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
