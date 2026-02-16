"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { BuyerReport, UserPreferences } from "@/lib/api/types";
import { ReportPreferences } from "@/components/report/ReportPreferences";

function GeneratingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postcode = searchParams.get("postcode") || "";
  const address = searchParams.get("address") || "";
  const [status, setStatus] = useState("Generating your report...");
  const [detail, setDetail] = useState("");
  const [progress, setProgress] = useState(0);
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [generating, setGenerating] = useState(false);

  const startGeneration = (preferences?: UserPreferences) => {
    setShowQuestionnaire(false);
    setGenerating(true);

    // Store preferences for any downstream use
    if (preferences && Object.keys(preferences).length > 0) {
      try {
        sessionStorage.setItem(
          "report_preferences",
          JSON.stringify(preferences)
        );
      } catch {
        // Non-critical
      }
    }

    const steps = [
      {
        msg: "Looking up property details...",
        pct: 10,
        detail: "EPC Register & Land Registry",
      },
      {
        msg: "Checking environmental risks...",
        pct: 25,
        detail: "Environment Agency & BGS Geology",
      },
      {
        msg: "Analysing local crime data...",
        pct: 40,
        detail: "Police UK — 12 months of data",
      },
      {
        msg: "Calculating commute times...",
        pct: 55,
        detail: "TfL Journey Planner & OSRM",
      },
      {
        msg: "Finding nearby schools...",
        pct: 65,
        detail: "GIAS — Ofsted ratings & performance",
      },
      {
        msg: "Assessing neighbourhood amenities...",
        pct: 75,
        detail: "OpenStreetMap & Google Places",
      },
      {
        msg: "Checking broadband & air quality...",
        pct: 85,
        detail: "Ofcom & DEFRA",
      },
      {
        msg: "Generating your Viven Verdict...",
        pct: 95,
        detail: "Scoring across 9 factors",
      },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setStatus(steps[i].msg);
        setDetail(steps[i].detail);
        setProgress(steps[i].pct);
        i++;
      }
    }, 800);

    // Actually generate the report
    fetch("/api/report/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postcode,
        address,
        type: "buyer",
        preferences,
      }),
    })
      .then((r) => r.json())
      .then((report: BuyerReport) => {
        clearInterval(interval);
        setProgress(100);
        setStatus("Report ready!");

        // Store in sessionStorage for the view page
        sessionStorage.setItem(
          `report_${report.id}`,
          JSON.stringify(report)
        );

        setTimeout(() => {
          router.push(`/report/buyer/${report.id}`);
        }, 500);
      })
      .catch(() => {
        clearInterval(interval);
        setStatus(
          "There was an issue generating your report. Please try again."
        );
      });

    return () => clearInterval(interval);
  };

  // Check if there are already stored preferences (e.g. from preview page flow)
  useEffect(() => {
    try {
      const storedPrefs = sessionStorage.getItem("report_preferences");
      if (storedPrefs) {
        const prefs = JSON.parse(storedPrefs);
        sessionStorage.removeItem("report_preferences");
        // Already has preferences — skip questionnaire
        startGeneration(prefs);
      }
    } catch {
      // Non-critical — show questionnaire
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showQuestionnaire && !generating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <p className="text-sm text-muted">
              Generating report for
            </p>
            <h1 className="font-heading text-xl font-bold text-foreground mt-1">
              {address || postcode}
            </h1>
          </div>
          <ReportPreferences onSubmit={(prefs) => startGeneration(prefs)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />

        <h1 className="font-heading text-2xl font-bold text-foreground mt-8">
          {status}
        </h1>

        {detail && (
          <p className="text-xs text-primary/70 mt-1">{detail}</p>
        )}

        <p className="text-muted mt-3">{address || postcode}</p>

        {/* Progress bar */}
        <div className="mt-8 w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted mt-2">{progress}%</p>

        <p className="text-xs text-muted mt-8">
          Pulling data from 17 sources: Land Registry, EPC Register,
          Environment Agency, Police UK, TfL, Ofcom, DEFRA, and more.
        </p>
      </div>
    </div>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <GeneratingContent />
    </Suspense>
  );
}
