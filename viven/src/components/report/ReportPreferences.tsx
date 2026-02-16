"use client";

import { useState } from "react";
import { UserPreferences } from "@/lib/api/types";
import { ChevronDown } from "lucide-react";

interface ReportPreferencesProps {
  onSubmit: (prefs: UserPreferences) => void;
}

const COMMUTE_DESTINATIONS = [
  "London Bridge",
  "Liverpool Street",
  "Waterloo",
  "King's Cross / St Pancras",
  "Canary Wharf",
  "Bank / City of London",
  "Victoria",
  "Paddington",
  "Oxford Circus / West End",
];

const COMMUTE_MODES = [
  { value: "public_transport" as const, label: "Train / Tube / Bus" },
  { value: "cycling" as const, label: "Cycling" },
  { value: "driving" as const, label: "Driving" },
  { value: "walking" as const, label: "Walking" },
];

const PRIORITY_OPTIONS = [
  { value: "safety", label: "Safety" },
  { value: "schools", label: "Schools" },
  { value: "transport", label: "Transport links" },
  { value: "green_space", label: "Green space" },
  { value: "nightlife", label: "Nightlife & dining" },
  { value: "quiet", label: "Peace & quiet" },
  { value: "value", label: "Value for money" },
];

export function ReportPreferences({ onSubmit }: ReportPreferencesProps) {
  const [commuteDestination, setCommuteDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const [showCustomDestination, setShowCustomDestination] = useState(false);
  const [isWorkFromHome, setIsWorkFromHome] = useState(false);
  const [commuteModes, setCommuteModes] = useState<
    ("public_transport" | "cycling" | "driving" | "walking")[]
  >([]);
  const [hasChildren, setHasChildren] = useState<
    "yes" | "no" | "planning" | ""
  >("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleCommuteMode = (
    mode: "public_transport" | "cycling" | "driving" | "walking"
  ) => {
    setCommuteModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const togglePriority = (value: string) => {
    setPriorities((prev) => {
      if (prev.includes(value)) return prev.filter((p) => p !== value);
      if (prev.length >= 3) return prev; // Max 3
      return [...prev, value];
    });
  };

  const handleDestinationSelect = (dest: string) => {
    if (dest === "wfh") {
      setIsWorkFromHome(true);
      setCommuteDestination("");
      setShowCustomDestination(false);
    } else if (dest === "other") {
      setShowCustomDestination(true);
      setIsWorkFromHome(false);
      setCommuteDestination("");
    } else {
      setCommuteDestination(dest);
      setIsWorkFromHome(false);
      setShowCustomDestination(false);
    }
    setShowDropdown(false);
  };

  const selectedLabel = isWorkFromHome
    ? "I work from home"
    : showCustomDestination
      ? customDestination || "Type your destination..."
      : commuteDestination || "Select a destination";

  const handleSubmit = () => {
    const prefs: UserPreferences = {};
    const dest = isWorkFromHome
      ? undefined
      : showCustomDestination
        ? customDestination.trim() || undefined
        : commuteDestination || undefined;

    if (dest) {
      prefs.commuteDestination = dest;
      // Map to workPostcode for backward compatibility with transport generation
      prefs.workPostcode = dest;
      prefs.workLocationName = dest;
    }

    if (
      commuteModes.length > 0 &&
      !isWorkFromHome
    ) {
      prefs.commuteModes = commuteModes;
      // Map first mode to transportMode for backward compatibility
      const modeMap: Record<string, "transit" | "driving" | "cycling"> = {
        public_transport: "transit",
        driving: "driving",
        cycling: "cycling",
        walking: "cycling", // Walking uses cycling routing as closest match
      };
      prefs.transportMode = modeMap[commuteModes[0]] || "transit";
    }

    if (hasChildren) {
      prefs.hasChildren = hasChildren as "yes" | "no" | "planning";
    }

    if (priorities.length > 0) {
      prefs.priorities = priorities;
    }

    onSubmit(prefs);
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
      <h3 className="font-heading text-xl font-bold text-foreground">
        Personalise your report
      </h3>
      <p className="text-sm text-muted mt-1 mb-6">
        Answer a few quick questions so we can tailor your report.
      </p>

      {/* Q1: Commute destination */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Where do you commute to?
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary flex items-center justify-between"
          >
            <span
              className={
                commuteDestination || isWorkFromHome
                  ? "text-foreground"
                  : "text-muted"
              }
            >
              {selectedLabel}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted transition-transform ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showDropdown && (
            <div className="absolute z-20 top-full mt-1 w-full bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {COMMUTE_DESTINATIONS.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => handleDestinationSelect(dest)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-light transition-colors ${
                    commuteDestination === dest
                      ? "bg-primary-light font-medium text-primary"
                      : ""
                  }`}
                >
                  {dest}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleDestinationSelect("wfh")}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-light transition-colors border-t border-border ${
                  isWorkFromHome
                    ? "bg-primary-light font-medium text-primary"
                    : ""
                }`}
              >
                I work from home
              </button>
              <button
                type="button"
                onClick={() => handleDestinationSelect("other")}
                className="w-full px-4 py-2.5 text-left text-sm text-primary font-medium hover:bg-primary-light transition-colors border-t border-border"
              >
                Other (type your own)
              </button>
            </div>
          )}
        </div>

        {showCustomDestination && (
          <input
            type="text"
            placeholder="e.g., Manchester Piccadilly, EC2R 8AH"
            value={customDestination}
            onChange={(e) => setCustomDestination(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mt-2"
            autoFocus
          />
        )}
      </div>

      {/* Q2: Commute mode (only if not WFH) */}
      {!isWorkFromHome && (commuteDestination || showCustomDestination) && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            How do you usually commute?
          </label>
          <div className="flex gap-2 flex-wrap">
            {COMMUTE_MODES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleCommuteMode(opt.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  commuteModes.includes(opt.value)
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-muted border-border hover:border-primary/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-1">
            Select all that apply
          </p>
        </div>
      )}

      {/* Q3: School-age children */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Do you have or plan to have school-age children?{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <div className="flex gap-2">
          {(
            [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "planning", label: "Planning to" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setHasChildren(hasChildren === opt.value ? "" : opt.value)
              }
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                hasChildren === opt.value
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted border-border hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Q4: Priorities */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          What matters most to you?{" "}
          <span className="text-muted font-normal">
            (pick up to 3, optional)
          </span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => togglePriority(opt.value)}
              disabled={
                priorities.length >= 3 && !priorities.includes(opt.value)
              }
              className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${
                priorities.includes(opt.value)
                  ? "bg-primary text-white border-primary"
                  : priorities.length >= 3
                    ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                    : "bg-white text-muted border-border hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
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
          onClick={handleSubmit}
          className="flex-1 px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          Generate my report &rarr;
        </button>
      </div>
    </div>
  );
}
