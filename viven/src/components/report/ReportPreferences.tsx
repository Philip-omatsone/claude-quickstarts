"use client";

import { useState } from "react";
import { UserPreferences } from "@/lib/api/types";

interface ReportPreferencesProps {
  onSubmit: (prefs: UserPreferences) => void;
}

export function ReportPreferences({ onSubmit }: ReportPreferencesProps) {
  const [workPostcode, setWorkPostcode] = useState("");
  const [transportMode, setTransportMode] = useState<
    "transit" | "driving" | "cycling"
  >("transit");
  const [additionalDestinations, setAdditionalDestinations] = useState<
    string[]
  >([]);
  const [additionalInput, setAdditionalInput] = useState("");

  return (
    <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
      <h3 className="font-heading text-xl font-bold text-foreground">
        Personalise your report
      </h3>
      <p className="text-sm text-muted mt-1 mb-6">
        Optional &mdash; helps us make the commute and area sections more
        relevant to you.
      </p>

      {/* Primary commute */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Where do you work?
        </label>
        <input
          type="text"
          placeholder="e.g., EC2R 8AH or Liverpool Street"
          value={workPostcode}
          onChange={(e) => setWorkPostcode(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <p className="text-xs text-muted mt-1">
          Postcode, station name, or area
        </p>
      </div>

      {/* How they commute */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          How would you commute?
        </label>
        <div className="flex gap-2">
          {(
            [
              { value: "transit", label: "Public transport" },
              { value: "driving", label: "Driving" },
              { value: "cycling", label: "Cycling" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTransportMode(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                transportMode === opt.value
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted border-border hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Additional destinations */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Any other places you&apos;d like commute times for?{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Partner's office, gym, parents' house"
          value={additionalInput}
          onChange={(e) => setAdditionalInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && additionalInput.trim()) {
              setAdditionalDestinations([
                ...additionalDestinations,
                additionalInput.trim(),
              ]);
              setAdditionalInput("");
            }
          }}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        {additionalDestinations.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {additionalDestinations.map((dest, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
              >
                {dest}
                <button
                  onClick={() =>
                    setAdditionalDestinations(
                      additionalDestinations.filter((_, j) => j !== i)
                    )
                  }
                  className="text-primary/50 hover:text-primary"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onSubmit({})}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-muted border border-border hover:bg-gray-50 transition-colors"
        >
          Skip &mdash; use defaults
        </button>
        <button
          onClick={() =>
            onSubmit({
              workPostcode: workPostcode || undefined,
              transportMode,
              additionalDestinations:
                additionalDestinations.length > 0
                  ? additionalDestinations
                  : undefined,
            })
          }
          className="flex-1 px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          Generate my report &rarr;
        </button>
      </div>
    </div>
  );
}
