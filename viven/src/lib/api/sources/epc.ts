import { EPCRating, DataSourceResponse } from "../types";

// EPC Open Data API
const BASE_URL = "https://epc.opendatacommunities.org/api/v1";

export async function getEPCRating(
  postcode: string,
  address?: string
): Promise<DataSourceResponse<EPCRating>> {
  try {
    const cleanPostcode = postcode.replace(/\s+/g, "").toUpperCase();
    // Some EPC entries require the postcode with a space (e.g. "SE22 0NL")
    const spacedPostcode = cleanPostcode.replace(/^(.+?)(\d[A-Z]{2})$/, "$1 $2");

    // Attempt 1: Full address match (no-space postcode)
    if (address) {
      const result = await queryEPC(cleanPostcode, address);
      if (result) return wrapResult(result);
    }

    // Attempt 2: House number/name only
    if (address) {
      const houseNumber = address.match(/^\d+[A-Za-z]?/)?.[0];
      if (houseNumber) {
        const result = await queryEPC(cleanPostcode, houseNumber);
        if (result) return wrapResult(result);
      }
    }

    // Attempt 3: Try with spaced postcode + house number
    if (address) {
      const houseNumber = address.match(/^\d+[A-Za-z]?/)?.[0];
      if (houseNumber && spacedPostcode !== cleanPostcode) {
        const result = await queryEPC(spacedPostcode, houseNumber);
        if (result) return wrapResult(result);
      }
    }

    // Attempt 4: Building name extraction (e.g., "Flat 3, Ryedale House" -> "Ryedale House")
    if (address) {
      const buildingName = address
        .replace(/^(flat|apt|apartment|unit)\s+\d+[a-z]?,?\s*/i, "")
        .trim();
      if (buildingName !== address && buildingName.length > 2) {
        const result = await queryEPC(cleanPostcode, buildingName);
        if (result) return wrapResult(result);
      }
    }

    // Attempt 5: All EPCs for postcode, fuzzy match
    const allRows = await queryEPCRaw(cleanPostcode, "");
    // Also try with spaced postcode if no results
    const rows = allRows ?? await queryEPCRaw(spacedPostcode, "");

    if (rows && rows.length > 0) {
      if (address) {
        const match = fuzzyMatchAddress(rows, address);
        if (match) return wrapResult(parseEPCRow(match));
      }
      // Fallback: return the most recent EPC for the postcode
      const sorted = [...rows].sort(
        (a, b) =>
          new Date(b["lodgement-date"] || b["inspection-date"] || "").getTime() -
          new Date(a["lodgement-date"] || a["inspection-date"] || "").getTime()
      );
      return wrapResult(parseEPCRow(sorted[0]));
    }

    return {
      data: null,
      error: "No EPC data found for this address",
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch EPC data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

// Search for EPC by address within a postcode
export async function searchEPCByAddress(
  postcode: string,
  houseNumberOrName: string
): Promise<EPCRating | null> {
  try {
    const rows = await queryEPCRaw(postcode, houseNumberOrName);
    if (rows && rows.length > 0) {
      return parseEPCRow(rows[0]);
    }
    // Fallback: search all for postcode
    const allRows = await queryEPCRaw(postcode, "");
    if (allRows) {
      const upper = houseNumberOrName.toUpperCase();
      const match = allRows.find(
        (r: Record<string, string>) =>
          (r.address || "").toUpperCase().includes(upper)
      );
      if (match) return parseEPCRow(match);
    }
    return null;
  } catch {
    return null;
  }
}

async function queryEPC(
  postcode: string,
  address: string
): Promise<EPCRating | null> {
  const rows = await queryEPCRaw(postcode, address);
  if (rows && rows.length > 0) {
    // If multiple results, return the most recent
    if (rows.length > 1) {
      const sorted = [...rows].sort(
        (a, b) =>
          new Date(b["lodgement-date"] || b["inspection-date"] || "").getTime() -
          new Date(a["lodgement-date"] || a["inspection-date"] || "").getTime()
      );
      return parseEPCRow(sorted[0]);
    }
    return parseEPCRow(rows[0]);
  }
  return null;
}

async function queryEPCRaw(
  postcode: string,
  address: string
): Promise<Record<string, string>[] | null> {
  const params = new URLSearchParams({
    postcode: postcode,
    size: "100",
  });
  if (address) {
    params.set("address", address);
  }

  const apiKey = process.env.EPC_API_KEY || "";
  if (!apiKey) {
    return null;
  }

  // EPC API uses Basic auth: base64(apikey:) — note the trailing colon
  const authHeader = apiKey.includes(":")
    ? `Basic ${Buffer.from(apiKey).toString("base64")}`
    : `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;

  try {
    const res = await fetch(`${BASE_URL}/domestic/search?${params}`, {
      headers: {
        Accept: "application/json",
        Authorization: authHeader,
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 604800 }, // Cache for 7 days
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        console.warn(`EPC API auth error: ${res.status} — API key may be invalid or revoked`);
      }
      return null;
    }
    const json = await res.json();
    return json.rows?.length ? json.rows : null;
  } catch (err) {
    console.warn("EPC API fetch error:", err);
    return null;
  }
}

function fuzzyMatchAddress(
  rows: Record<string, string>[],
  targetAddress: string
): Record<string, string> | null {
  const target = targetAddress.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Try exact-ish match first
  for (const row of rows) {
    const rowAddr = (row.address || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (rowAddr.includes(target) || target.includes(rowAddr)) {
      return row;
    }
  }

  // Try house number match
  const targetNum = targetAddress.match(/^\d+[A-Za-z]?/)?.[0];
  if (targetNum) {
    for (const row of rows) {
      const rowNum = (row.address || "").match(/^\d+[A-Za-z]?/)?.[0];
      if (rowNum === targetNum) return row;
    }
  }

  // Try matching significant words (skip short words like "the", "and")
  const words = targetAddress
    .toUpperCase()
    .split(/\s+/)
    .filter((w) => w.length > 3 && !["FLAT", "ROAD", "STREET", "LANE", "AVENUE", "DRIVE", "CLOSE", "COURT"].includes(w));
  if (words.length > 0) {
    for (const row of rows) {
      const rowAddr = (row.address || "").toUpperCase();
      const matchCount = words.filter((w) => rowAddr.includes(w)).length;
      if (matchCount >= Math.ceil(words.length * 0.6)) return row;
    }
  }

  return null;
}

function parseEPCRow(row: Record<string, string>): EPCRating {
  return {
    address: row.address || "",
    currentEnergyRating: row["current-energy-rating"] || "",
    currentEnergyEfficiency: parseInt(
      row["current-energy-efficiency"] || "0"
    ),
    potentialEnergyRating: row["potential-energy-rating"] || "",
    potentialEnergyEfficiency: parseInt(
      row["potential-energy-efficiency"] || "0"
    ),
    propertyType: row["property-type"] || "",
    builtForm: row["built-form"] || "",
    totalFloorArea: parseFloat(row["total-floor-area"] || "0"),
    numberOfRooms: parseInt(row["number-habitable-rooms"] || "0"),
    recommendations: [],
    inspectionDate: row["inspection-date"] || "",
  };
}

function wrapResult(data: EPCRating): DataSourceResponse<EPCRating> {
  return {
    data,
    cached: false,
    fetchedAt: new Date().toISOString(),
  };
}
