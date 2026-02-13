"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartDataPoint } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const LEGEND_NAMES: Record<string, string> = {
  netWorth: "Net Worth",
  assets: "Assets",
  liabilities: "Liabilities",
};

interface NetWorthChartProps {
  data: ChartDataPoint[];
}

export default function NetWorthChart({ data }: NetWorthChartProps) {
  if (data.length === 0) return null;

  if (data.length === 1) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <p className="text-3xl font-semibold text-blue-600">
            {formatCurrency(data[0].netWorth)}
          </p>
          <p className="mt-2">Add more months to see the trend</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) =>
            value >= 1000000
              ? `\u00a3${(value / 1000000).toFixed(1)}M`
              : value >= 1000
                ? `\u00a3${(value / 1000).toFixed(0)}k`
                : `\u00a3${value}`
          }
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            LEGEND_NAMES[name] || name,
          ]}
          labelStyle={{ color: "#1e293b", fontWeight: 600 }}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend formatter={(value: string) => LEGEND_NAMES[value] || value} />
        <Area
          type="monotone"
          dataKey="assets"
          stroke="#10b981"
          fill="url(#colorAssets)"
          strokeWidth={2}
          dot={{ r: 3, fill: "#10b981" }}
        />
        <Area
          type="monotone"
          dataKey="liabilities"
          stroke="#ef4444"
          fill="none"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 3, fill: "#ef4444" }}
        />
        <Area
          type="monotone"
          dataKey="netWorth"
          stroke="#3b82f6"
          fill="url(#colorNetWorth)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#3b82f6" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
