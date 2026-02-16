"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { BuyerReport } from "@/lib/api/types";

function GeneratingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postcode = searchParams.get("postcode") || "";
  const address = searchParams.get("address") || "";
  const [status, setStatus] = useState("Generating your report...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      { msg: "Geocoding postcode...", pct: 10 },
      { msg: "Fetching price history...", pct: 25 },
      { msg: "Checking flood & subsidence risk...", pct: 40 },
      { msg: "Analysing crime data...", pct: 55 },
      { msg: "Finding nearby schools...", pct: 65 },
      { msg: "Checking transport links...", pct: 75 },
      { msg: "Gathering area insights...", pct: 85 },
      { msg: "Compiling report...", pct: 95 },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setStatus(steps[i].msg);
        setProgress(steps[i].pct);
        i++;
      }
    }, 800);

    // Retrieve any stored preferences
    let preferences = undefined;
    try {
      const storedPrefs = sessionStorage.getItem("report_preferences");
      if (storedPrefs) {
        preferences = JSON.parse(storedPrefs);
        sessionStorage.removeItem("report_preferences");
      }
    } catch {
      // Non-critical
    }

    // Actually generate the report
    fetch("/api/report/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postcode, address, type: "buyer", preferences }),
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
        setStatus("There was an issue generating your report. Please try again.");
      });

    return () => clearInterval(interval);
  }, [postcode, address, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />

        <h1 className="font-heading text-2xl font-bold text-foreground mt-8">
          {status}
        </h1>

        <p className="text-muted mt-3">
          {address || postcode}
        </p>

        {/* Progress bar */}
        <div className="mt-8 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted mt-2">{progress}%</p>

        <p className="text-xs text-muted mt-8">
          We&apos;re pulling data from 15+ sources including Land Registry,
          Environment Agency, Police UK, and more.
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
