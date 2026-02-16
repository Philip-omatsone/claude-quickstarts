"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PropertyTransaction } from "@/lib/api/types";

interface PriceChartProps {
  transactions: PropertyTransaction[];
  projectedValue?: number;
}

export function PriceChart({ transactions, projectedValue }: PriceChartProps) {
  const sorted = [...transactions].reverse();

  const data: { date: string; price?: number; projected?: number; rawDate: number }[] = sorted.map((t) => ({
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

  // Connect the solid transaction line to the dashed projection line
  // Both lines must share the exact same data point at the junction to avoid a gap
  if (projectedValue && projectedValue > 0 && data.length > 0) {
    const lastActual = data[data.length - 1];
    // Set the projected value on the last actual data point so both lines share it
    lastActual.projected = lastActual.price;
    // Add the projected endpoint at today's date
    data.push({
      date: new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
      }),
      projected: projectedValue,
      rawDate: Date.now(),
    });
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
              formatter={(value: unknown, name?: string) => [
                formatPrice(typeof value === "number" ? value : 0),
                name === "projected" ? "Projected Value" : "Price",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />
            {/* Solid line for actual transactions */}
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
            {/* Dotted line from last sale to projected value */}
            {projectedValue && projectedValue > 0 && (
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#16A34A"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{ fill: "#16A34A", r: 5, stroke: "#fff", strokeWidth: 2 }}
                connectNulls
                name="Projected value"
              />
            )}
            {projectedValue && projectedValue > 0 && (
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-xs text-gray-500">{value}</span>
                )}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {projectedValue && projectedValue > 0 && (
        <div className="flex gap-5 justify-center mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-6 h-0.5 bg-green-600" />
            Recorded transactions
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-6 h-0.5"
              style={{
                background: "repeating-linear-gradient(to right, #16A34A 0px, #16A34A 8px, transparent 8px, transparent 12px)",
              }}
            />
            Projected value (HPI + comparables)
          </span>
        </div>
      )}
    </div>
  );
}
