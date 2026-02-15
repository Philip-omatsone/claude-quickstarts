import { EPCRating, DataSourceResponse } from "../types";

// EPC Open Data API
const BASE_URL = "https://epc.opendatacommunities.org/api/v1";

export async function getEPCRating(
  postcode: string,
  address?: string
): Promise<DataSourceResponse<EPCRating>> {
  try {
    // Attempt 1: Full address match
    if (address) {
      const result = await queryEPC(postcode, address);
      if (result) return wrapResult(result);
    }

    // Attempt 2: House number/name only (most common match)
    if (address) {
      const houseNumber = address.match(/^\d+[A-Za-z]?/)?.[0];
      if (houseNumber) {
        const result = await queryEPC(postcode, houseNumber);
        if (result) return wrapResult(result);
      }
    }

    // Attempt 3: All EPCs for postcode, find best match
    const allRows = await queryEPCRaw(postcode, "");
    if (allRows && allRows.length > 0) {
      if (address) {
        // Try to find a match by checking if the EPC address contains our address parts
        const normalised = address.toUpperCase().replace(/[,]/g, "").trim();
        const houseRef = normalised.match(/^\d+[A-Za-z]?/)?.[0];
        const match = allRows.find((row: Record<string, string>) => {
          const epcAddr = (row.address || "").toUpperCase();
          if (houseRef && epcAddr.includes(houseRef)) return true;
          // Check if first significant word appears in EPC address
          const words = normalised.split(/\s+/).filter((w: string) => w.length > 2);
          return words.length > 0 && words.some((w: string) => epcAddr.includes(w));
        });
        if (match) return wrapResult(parseEPCRow(match));
      }
      // Fallback: return the most recent EPC for the postcode
      return wrapResult(parseEPCRow(allRows[0]));
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
    return parseEPCRow(rows[0]);
  }
  return null;
}

async function queryEPCRaw(
  postcode: string,
  address: string
): Promise<Record<string, string>[] | null> {
  const params = new URLSearchParams({
    postcode: postcode.replace(/\s/g, "").toUpperCase(),
    size: "25",
  });
  if (address) {
    params.set("address", address);
  }

  const apiKey = process.env.EPC_API_KEY || "";
  // EPC API uses Basic auth: base64(apikey:) — note the trailing colon
  const authHeader = apiKey.includes(":")
    ? `Basic ${Buffer.from(apiKey).toString("base64")}`
    : `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;

  const res = await fetch(`${BASE_URL}/domestic/search?${params}`, {
    headers: {
      Accept: "application/json",
      Authorization: authHeader,
    },
    next: { revalidate: 604800 }, // Cache for 7 days
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.rows?.length ? json.rows : null;
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
