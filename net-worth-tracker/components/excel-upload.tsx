"use client";

import { useState, useRef } from "react";
import { MonthlySnapshot } from "@/lib/types";
import { parseExcelFile } from "@/lib/excel";
import { formatMonth } from "@/lib/utils";
import { Upload, FileSpreadsheet, X, Check, AlertCircle } from "lucide-react";

interface ExcelUploadProps {
  onImport: (snapshots: MonthlySnapshot[]) => void;
  onClose: () => void;
}

export default function ExcelUpload({ onImport, onClose }: ExcelUploadProps) {
  const [parsed, setParsed] = useState<MonthlySnapshot[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setParsed(null);

    if (
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".csv")
    ) {
      setError("Please upload an Excel file (.xlsx, .xls) or CSV file.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const snapshots = parseExcelFile(buffer);

      if (snapshots.length === 0) {
        setError(
          "No data could be parsed. Make sure your spreadsheet has account names in the first column and monthly values in subsequent columns, with month headers in the first row.",
        );
        return;
      }

      setParsed(snapshots);
    } catch {
      setError("Failed to read file. Please check the format and try again.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleConfirm = () => {
    if (parsed) onImport(parsed);
  };

  const totalItems = parsed
    ? parsed.reduce((sum, s) => sum + s.items.length, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative min-h-full flex items-start justify-center p-4 pt-12">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Import from Excel
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">
                Drop your spreadsheet here or click to browse
              </p>
              <p className="text-xs text-slate-500 mt-1">
                .xlsx, .xls, or .csv
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>

            {/* Format hint */}
            <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-600">
              <p className="font-medium text-slate-700 mb-2">
                Expected format:
              </p>
              <div className="overflow-x-auto">
                <table className="text-left">
                  <thead>
                    <tr>
                      <th className="pr-4 pb-1 font-medium">Account</th>
                      <th className="pr-4 pb-1 font-medium">Jan 2024</th>
                      <th className="pr-4 pb-1 font-medium">Feb 2024</th>
                      <th className="pr-4 pb-1 font-medium">...</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pr-4 text-slate-500">Monzo</td>
                      <td className="pr-4 text-slate-500">1,500</td>
                      <td className="pr-4 text-slate-500">1,650</td>
                      <td className="pr-4 text-slate-500">...</td>
                    </tr>
                    <tr>
                      <td className="pr-4 text-slate-500">Trading 212 ISA</td>
                      <td className="pr-4 text-slate-500">5,000</td>
                      <td className="pr-4 text-slate-500">5,200</td>
                      <td className="pr-4 text-slate-500">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Preview */}
            {parsed && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700">
                    Found <strong>{parsed.length}</strong> months with{" "}
                    <strong>{totalItems}</strong> entries
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="text-left px-3 py-2 text-slate-500 font-medium">
                          Month
                        </th>
                        <th className="text-right px-3 py-2 text-slate-500 font-medium">
                          Items
                        </th>
                        <th className="text-right px-3 py-2 text-slate-500 font-medium">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.map((s) => {
                        const total = s.items.reduce(
                          (sum, item) =>
                            item.type === "asset"
                              ? sum + item.amount
                              : sum - item.amount,
                          0,
                        );
                        return (
                          <tr
                            key={s.month}
                            className="border-t border-slate-100"
                          >
                            <td className="px-3 py-2 text-slate-900">
                              {formatMonth(s.month)}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-500">
                              {s.items.length}
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-slate-900">
                              {new Intl.NumberFormat("en-GB", {
                                style: "currency",
                                currency: "GBP",
                                minimumFractionDigits: 0,
                              }).format(total)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            {parsed && (
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                Import {parsed.length} Months
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
