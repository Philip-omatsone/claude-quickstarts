import { NextRequest, NextResponse } from "next/server";

const PPD_API =
  "https://landregistry.data.gov.uk/data/ppi/transaction-record.json";
const EPC_API = "https://epc.opendatacommunities.org/api/v1";

export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get("postcode");

  if (!postcode) {
    return NextResponse.json(
      { error: "Postcode is required" },
      { status: 400 }
    );
  }

  const cleanPostcode = postcode.trim().toUpperCase();

  try {
    // Fan out both Land Registry and EPC lookups in parallel for better coverage
    const [landRegistryAddresses, epcAddresses] = await Promise.all([
      fetchLandRegistryAddresses(cleanPostcode),
      fetchEPCAddresses(cleanPostcode),
    ]);

    // Merge and deduplicate addresses from both sources
    // Use aggressive normalisation to catch duplicates across data sources
    const seen = new Set<string>();
    const addresses: { address: string; paon: string; street: string; town: string; source: string }[] = [];

    // Normalise key: strip everything except alphanumeric, uppercase
    const normaliseKey = (s: string) =>
      s.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Add Land Registry results first (higher quality address format)
    for (const addr of landRegistryAddresses) {
      const key = normaliseKey(addr.address);
      if (!seen.has(key)) {
        seen.add(key);
        addresses.push({ ...addr, source: "land-registry" });
      }
    }

    // Add EPC results that aren't already covered
    for (const addr of epcAddresses) {
      const key = normaliseKey(addr.address);
      // Check for approximate matches (house number + street matching)
      const houseNum = addr.paon.match(/^\d+[A-Za-z]?/)?.[0]?.toUpperCase();
      const alreadyCovered = seen.has(key) || (houseNum
        ? addresses.some((a) => {
            const existingNum = a.paon.match(/^\d+[A-Za-z]?/)?.[0]?.toUpperCase();
            return existingNum === houseNum && normaliseKey(a.street) === normaliseKey(addr.street);
          })
        : false);

      if (!alreadyCovered) {
        seen.add(key);
        addresses.push({ ...addr, source: "epc" });
      }
    }

    // Sort naturally by house number, then alphabetically
    addresses.sort((a, b) => {
      const numA = parseInt(a.paon.match(/^\d+/)?.[0] || "0");
      const numB = parseInt(b.paon.match(/^\d+/)?.[0] || "0");
      if (numA !== numB) return numA - numB;
      return a.address.localeCompare(b.address);
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Address lookup error:", error);
    return NextResponse.json({ addresses: [] });
  }
}

async function fetchLandRegistryAddresses(
  postcode: string
): Promise<{ address: string; paon: string; street: string; town: string }[]> {
  try {
    const params = new URLSearchParams({
      "propertyAddress.postcode": postcode,
      _pageSize: "100",
      _sort: "-transactionDate",
    });

    const res = await fetch(`${PPD_API}?${params}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const items = json.result?.items || [];

    const seen = new Set<string>();
    const addresses: { address: string; paon: string; street: string; town: string }[] = [];

    // Normalise key: uppercase, strip all non-alphanumeric
    const normalise = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

    for (const item of items) {
      const addr = item.propertyAddress;
      if (!addr) continue;

      const paon = addr.paon || "";
      const street = addr.street || "";
      const town = addr.town || "";
      const parts = [paon, street, town].filter(Boolean);
      const full = parts.join(", ");
      const key = normalise(full);

      if (!seen.has(key) && full) {
        seen.add(key);
        addresses.push({ address: full, paon, street, town });
      }
    }

    return addresses;
  } catch {
    return [];
  }
}

async function fetchEPCAddresses(
  postcode: string
): Promise<{ address: string; paon: string; street: string; town: string }[]> {
  try {
    const apiKey = process.env.EPC_API_KEY || "";
    if (!apiKey) return [];

    const authHeader = apiKey.includes(":")
      ? `Basic ${Buffer.from(apiKey).toString("base64")}`
      : `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;

    const params = new URLSearchParams({
      postcode: postcode.replace(/\s/g, ""),
      size: "100",
    });

    const res = await fetch(`${EPC_API}/domestic/search?${params}`, {
      headers: {
        Accept: "application/json",
        Authorization: authHeader,
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const rows = json.rows || [];

    const seen = new Set<string>();
    const addresses: { address: string; paon: string; street: string; town: string }[] = [];

    // Normalise key: uppercase, strip all non-alphanumeric (matches merge logic)
    const normalise = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

    for (const row of rows) {
      const rawAddr = row.address || "";
      if (!rawAddr) continue;

      const key = normalise(rawAddr);
      if (seen.has(key)) continue;
      seen.add(key);

      // Parse EPC address format: "11, RYEDALE, LONDON, SE22 0QW" -> parts
      const parts = rawAddr.split(",").map((p: string) => p.trim()).filter(Boolean);
      // Remove the postcode part if present at the end
      const filtered = parts.filter(
        (p: string) => !/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(p)
      );

      const paon = filtered[0] || "";
      const street = filtered[1] || "";
      const town = filtered[2] || "";
      const display = filtered.join(", ");

      if (display) {
        addresses.push({ address: display, paon, street, town });
      }
    }

    return addresses;
  } catch {
    return [];
  }
}
