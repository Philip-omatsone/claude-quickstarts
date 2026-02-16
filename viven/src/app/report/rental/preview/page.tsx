"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { RentalReport } from "@/lib/api/types";

function RentalPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postcode = searchParams.get("postcode") || "";
  const address = searchParams.get("address") || "";
  const [status, setStatus] = useState("Generating your free report...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      { msg: "Geocoding postcode...", pct: 10 },
      { msg: "Checking area safety...", pct: 25 },
      { msg: "Gathering broadband data...", pct: 40 },
      { msg: "Finding transport links...", pct: 55 },
      { msg: "Checking nearby schools...", pct: 65 },
      { msg: "Mapping amenities...", pct: 75 },
      { msg: "Checking air quality...", pct: 85 },
      { msg: "Calculating vibe score...", pct: 95 },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setStatus(steps[i].msg);
        setProgress(steps[i].pct);
        i++;
      }
    }, 500);

    fetch("/api/report/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postcode, address: address || undefined, type: "rental" }),
    })
      .then((r) => r.json())
      .then((report: RentalReport) => {
        clearInterval(interval);
        setProgress(100);
        setStatus("Report ready!");

        sessionStorage.setItem(
          `report_${report.id}`,
          JSON.stringify(report)
        );

        setTimeout(() => {
          router.push(`/report/rental/${report.id}`);
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

        <p className="text-muted mt-3">{address ? `${address}, ${postcode}` : postcode}</p>

        <div className="mt-8 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted mt-2">{progress}%</p>

        <p className="text-xs text-muted mt-8">
          Your free rental report covers safety, schools, broadband, transport,
          amenities, air quality, and neighbourhood vibes.
        </p>
      </div>
    </div>
  );
}

export default function RentalPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <RentalPreviewContent />
    </Suspense>
  );
}
