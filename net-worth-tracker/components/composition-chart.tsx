"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MonthlySnapshot } from "@/lib/types";
import { buildCompositionData, formatCurrency, totalAssets } from "@/lib/utils";

interface CompositionChartProps {
  snapshot: MonthlySnapshot;
}

export default function CompositionChart({ snapshot }: CompositionChartProps) {
  const data = buildCompositionData(snapshot);
  const total = totalAssets(snapshot);

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-400">
        No asset data
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatCurrency(value)]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: "13px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {data.map((slice) => (
          <div
            key={slice.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-slate-600">{slice.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500">
                {total > 0 ? ((slice.value / total) * 100).toFixed(1) : 0}%
              </span>
              <span className="text-slate-900 font-medium">
                {formatCurrency(slice.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
