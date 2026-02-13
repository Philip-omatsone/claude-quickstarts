"use client";

import { MonthlySnapshot } from "@/lib/types";
import {
  formatCurrency,
  formatMonth,
  totalAssets,
  totalLiabilities,
  netWorth,
  totalEquityExposure,
} from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface MonthlyChangesProps {
  snapshots: MonthlySnapshot[];
  onEdit: (month: string) => void;
  onDelete: (month: string) => void;
}

export default function MonthlyChanges({
  snapshots,
  onEdit,
  onDelete,
}: MonthlyChangesProps) {
  if (snapshots.length === 0) return null;

  const reversed = [...snapshots].reverse();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-2 text-slate-500 font-medium">
              Month
            </th>
            <th className="text-right py-3 px-2 text-slate-500 font-medium">
              Assets
            </th>
            <th className="text-right py-3 px-2 text-slate-500 font-medium">
              Liabilities
            </th>
            <th className="text-right py-3 px-2 text-slate-500 font-medium">
              Net Worth
            </th>
            <th className="text-right py-3 px-2 text-slate-500 font-medium">
              Equity Exp.
            </th>
            <th className="text-right py-3 px-2 text-slate-500 font-medium">
              Change
            </th>
            <th className="w-20"></th>
          </tr>
        </thead>
        <tbody>
          {reversed.map((snapshot, i) => {
            const prev = reversed[i + 1];
            const nw = netWorth(snapshot);
            const prevNw = prev ? netWorth(prev) : null;
            const change = prevNw !== null ? nw - prevNw : null;
            const pct =
              prevNw !== null && prevNw !== 0
                ? ((nw - prevNw) / Math.abs(prevNw)) * 100
                : null;
            const equity = totalEquityExposure(snapshot);

            return (
              <tr
                key={snapshot.month}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="py-3 px-2 font-medium text-slate-900">
                  {formatMonth(snapshot.month)}
                </td>
                <td className="py-3 px-2 text-right text-emerald-700">
                  {formatCurrency(totalAssets(snapshot))}
                </td>
                <td className="py-3 px-2 text-right text-red-600">
                  {formatCurrency(totalLiabilities(snapshot))}
                </td>
                <td className="py-3 px-2 text-right font-semibold text-slate-900">
                  {formatCurrency(nw)}
                </td>
                <td className="py-3 px-2 text-right text-indigo-600">
                  {equity > 0 ? formatCurrency(equity) : <span className="text-slate-300">&mdash;</span>}
                </td>
                <td className="py-3 px-2 text-right">
                  {change !== null ? (
                    <span
                      className={`font-medium ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {change >= 0 ? "+" : ""}
                      {formatCurrency(change)}
                      {pct !== null && (
                        <span className="text-xs ml-1 opacity-75">
                          ({pct >= 0 ? "+" : ""}
                          {pct.toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-slate-400">&mdash;</span>
                  )}
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(snapshot.month)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete ${formatMonth(snapshot.month)} snapshot?`,
                          )
                        ) {
                          onDelete(snapshot.month);
                        }
                      }}
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
