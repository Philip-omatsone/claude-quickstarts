import { NextRequest, NextResponse } from "next/server";
import { geocodePostcode } from "@/lib/api/sources/postcodes-io";
import {
  generateBuyerReport,
  generateRentalReport,
} from "@/lib/api/generate-report";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postcode, address, type, preferences } = body;

    if (!postcode) {
      return NextResponse.json(
        { error: "Postcode is required" },
        { status: 400 }
      );
    }

    if (!type || !["buyer", "rental"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'buyer' or 'rental'" },
        { status: 400 }
      );
    }

    // Geocode the postcode
    const geocodeResult = await geocodePostcode(postcode);
    if (!geocodeResult.data) {
      return NextResponse.json(
        { error: geocodeResult.error || "Could not geocode postcode" },
        { status: 400 }
      );
    }

    // Generate the appropriate report
    if (type === "buyer") {
      const report = await generateBuyerReport(geocodeResult.data, address, preferences);
      return NextResponse.json(report);
    } else {
      const report = await generateRentalReport(geocodeResult.data, address);
      return NextResponse.json(report);
    }
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
