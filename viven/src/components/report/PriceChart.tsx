"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PropertyTransaction } from "@/lib/api/types";

interface PriceChartProps {
  transactions: PropertyTransaction[];
}

export function PriceChart({ transactions }: PriceChartProps) {
  const sorted = [...transactions].reverse();

  const data = sorted.map((t) => ({
    date: new Date(t.dateOfTransfer).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
    }),
    price: t.price,
    rawDate: new Date(t.dateOfTransfer).getTime(),
  }));

  if (data.length === 0) {
    return (
      <div className="text-sm text-muted text-center py-8">
        No transaction data available for chart
      </div>
    );
  }

  const formatPrice = (value: number) => {
    if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
    return `£${value}`;
  };

  return (
    <div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatPrice}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: unknown) => [
                formatPrice(typeof value === "number" ? value : 0),
                "Price",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#16A34A"
              strokeWidth={2.5}
              dot={{ fill: "#16A34A", r: 4 }}
              activeDot={{ r: 6, fill: "#16A34A" }}
              connectNulls={false}
              name="Recorded transactions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
