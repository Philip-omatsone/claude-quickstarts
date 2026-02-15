import { FloodRisk, DataSourceResponse, RiskLevel } from "../types";

// Environment Agency Flood Risk API
const BASE_URL = "https://environment.data.gov.uk/flood-monitoring";

export async function getFloodRisk(
  latitude: number,
  longitude: number
): Promise<DataSourceResponse<FloodRisk>> {
  try {
    // Get flood areas for the location
    const res = await fetch(
      `${BASE_URL}/id/floodAreas?lat=${latitude}&long=${longitude}&dist=1`,
      { next: { revalidate: 2592000 } } // Cache for 30 days
    );

    if (!res.ok) {
      throw new Error(`Environment Agency API returned ${res.status}`);
    }

    const json = await res.json();
    const items = json.items || [];

    // Parse flood zones from the response
    let riverAndSea: RiskLevel = "very_low";
    let surfaceWater: RiskLevel = "very_low";
    let reservoir = false;
    let floodZone = "1";

    for (const area of items) {
      const desc = (area.description || "").toLowerCase();
      const severity = (area.floodWatchArea || "").toLowerCase();

      if (desc.includes("river") || desc.includes("sea")) {
        riverAndSea = parseRiskFromDescription(desc);
      }
      if (desc.includes("surface")) {
        surfaceWater = parseRiskFromDescription(desc);
      }
      if (desc.includes("reservoir")) {
        reservoir = true;
      }
    }

    // Determine flood zone based on risk levels
    if (riverAndSea === "high" || surfaceWater === "high") {
      floodZone = "3";
    } else if (riverAndSea === "medium" || surfaceWater === "medium") {
      floodZone = "2";
    }

    return {
      data: {
        riverAndSea,
        surfaceWater,
        reservoir,
        floodZone,
        historicalFlooding: items.length > 0,
      },
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch flood risk data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

function parseRiskFromDescription(desc: string): RiskLevel {
  if (desc.includes("severe") || desc.includes("high")) return "high";
  if (desc.includes("moderate") || desc.includes("medium")) return "medium";
  if (desc.includes("low")) return "low";
  return "very_low";
}
