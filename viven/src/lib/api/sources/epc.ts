import { EPCRating, DataSourceResponse } from "../types";

// EPC Open Data API
const BASE_URL = "https://epc.opendatacommunities.org/api/v1";

export async function getEPCRating(
  postcode: string,
  address?: string
): Promise<DataSourceResponse<EPCRating>> {
  try {
    const params = new URLSearchParams({
      postcode: postcode.trim().toUpperCase(),
      size: "10",
    });

    if (address) {
      params.set("address", address);
    }

    const res = await fetch(`${BASE_URL}/domestic/search?${params}`, {
      headers: {
        Accept: "application/json",
        // EPC API requires an API key set in Authorization header
        Authorization: `Basic ${process.env.EPC_API_KEY || ""}`,
      },
      next: { revalidate: 604800 }, // Cache for 7 days
    });

    if (!res.ok) {
      throw new Error(`EPC API returned ${res.status}`);
    }

    const json = await res.json();
    const rows = json.rows || [];

    if (rows.length === 0) {
      return {
        data: null,
        error: "No EPC data found for this address",
        cached: false,
        fetchedAt: new Date().toISOString(),
      };
    }

    // Get the most recent EPC
    const latest = rows[0];

    return {
      data: {
        address: latest.address || "",
        currentEnergyRating: latest["current-energy-rating"] || "",
        currentEnergyEfficiency: parseInt(
          latest["current-energy-efficiency"] || "0"
        ),
        potentialEnergyRating: latest["potential-energy-rating"] || "",
        potentialEnergyEfficiency: parseInt(
          latest["potential-energy-efficiency"] || "0"
        ),
        propertyType: latest["property-type"] || "",
        builtForm: latest["built-form"] || "",
        totalFloorArea: parseFloat(latest["total-floor-area"] || "0"),
        numberOfRooms: parseInt(
          latest["number-habitable-rooms"] || "0"
        ),
        recommendations: [],
        inspectionDate: latest["inspection-date"] || "",
      },
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
