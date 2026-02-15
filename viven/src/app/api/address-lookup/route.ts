import { NextRequest, NextResponse } from "next/server";

const PPD_API =
  "https://landregistry.data.gov.uk/data/ppi/transaction-record.json";

export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get("postcode");

  if (!postcode) {
    return NextResponse.json(
      { error: "Postcode is required" },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({
      "propertyAddress.postcode": postcode.trim().toUpperCase(),
      _pageSize: "100",
      _sort: "-transactionDate",
    });

    const res = await fetch(`${PPD_API}?${params}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`Land Registry API returned ${res.status}`);
    }

    const json = await res.json();
    const items = json.result?.items || [];

    // Extract unique addresses
    const seen = new Set<string>();
    const addresses: { address: string; paon: string; street: string; town: string }[] = [];

    for (const item of items) {
      const addr = item.propertyAddress;
      if (!addr) continue;

      const paon = addr.paon || "";
      const street = addr.street || "";
      const town = addr.town || "";
      const parts = [paon, street, town].filter(Boolean);
      const full = parts.join(", ");
      const key = full.toLowerCase();

      if (!seen.has(key) && full) {
        seen.add(key);
        addresses.push({ address: full, paon, street, town });
      }
    }

    // Sort alphabetically
    addresses.sort((a, b) => a.address.localeCompare(b.address));

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Address lookup error:", error);
    return NextResponse.json({ addresses: [] });
  }
}
