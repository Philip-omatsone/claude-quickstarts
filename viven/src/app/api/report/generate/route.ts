import { NextRequest, NextResponse } from "next/server";
import { geocodePostcode } from "@/lib/api/sources/postcodes-io";
import {
  generateBuyerReport,
  generateRentalReport,
} from "@/lib/api/generate-report";

// Quick validation: check if an address appears in EPC or Land Registry
async function validateAddress(
  postcode: string,
  address: string
): Promise<{ found: boolean; sources: string[] }> {
  const sources: string[] = [];
  const cleanPostcode = postcode.trim().toUpperCase();

  // Check Land Registry
  try {
    const params = new URLSearchParams({
      "propertyAddress.postcode": cleanPostcode,
      _pageSize: "100",
    });
    const lrRes = await fetch(
      `https://landregistry.data.gov.uk/data/ppi/transaction-record.json?${params}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (lrRes.ok) {
      const lrJson = await lrRes.json();
      const items = lrJson.result?.items || [];
      const normAddr = address.toUpperCase().replace(/[^A-Z0-9]/g, "");
      const keywords = address.toUpperCase().split(/\s+/).filter(w => w.length > 0);
      for (const item of items) {
        const addr = item.propertyAddress;
        if (!addr) continue;
        const full = [addr.paon, addr.street, addr.town].filter(Boolean).join(" ").toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (full.includes(normAddr) || keywords.every((kw: string) => full.includes(kw))) {
          sources.push("Land Registry");
          break;
        }
      }
    }
  } catch {
    // Non-critical
  }

  // Check EPC
  try {
    const apiKey = process.env.EPC_API_KEY || "";
    if (apiKey) {
      const authHeader = apiKey.includes(":")
        ? `Basic ${Buffer.from(apiKey).toString("base64")}`
        : `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;
      const params = new URLSearchParams({
        postcode: cleanPostcode.replace(/\s/g, ""),
        size: "100",
      });
      const epcRes = await fetch(
        `https://epc.opendatacommunities.org/api/v1/domestic/search?${params}`,
        {
          headers: { Accept: "application/json", Authorization: authHeader },
          signal: AbortSignal.timeout(5000),
        }
      );
      if (epcRes.ok) {
        const epcJson = await epcRes.json();
        const rows = epcJson.rows || [];
        const normAddr = address.toUpperCase().replace(/[^A-Z0-9]/g, "");
        const keywords = address.toUpperCase().split(/\s+/).filter(w => w.length > 0);
        for (const row of rows) {
          const rowAddr = (row.address || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
          if (rowAddr.includes(normAddr) || keywords.every((kw: string) => rowAddr.includes(kw))) {
            sources.push("EPC");
            break;
          }
        }
      }
    }
  } catch {
    // Non-critical
  }

  return { found: sources.length > 0, sources };
}

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

    // Validate address exists in data sources (non-blocking — still generates report)
    let addressWarning: string | undefined;
    if (address) {
      const validation = await validateAddress(postcode, address);
      if (!validation.found) {
        addressWarning =
          "We couldn\u2019t find this property in our records. The report may have limited property-specific data.";
      }
    }

    // Generate the appropriate report
    if (type === "buyer") {
      const report = await generateBuyerReport(geocodeResult.data, address, preferences);
      return NextResponse.json({ ...report, addressWarning });
    } else {
      const report = await generateRentalReport(geocodeResult.data, address);
      return NextResponse.json({ ...report, addressWarning });
    }
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
